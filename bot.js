let Twit = require('twit');
let T = new Twit(require('./config.js'));
let Scraper = require('./scraper.js');
let Spawn = require('child_process').spawn;
const fs = require('fs');

// The python process for the ML model
let model;

// The most recent tweets processed by the bot. Make sure this bot wont process a tweet twice.
let sinceId = JSON.parse(fs.readFileSync('since_id.json', 'utf8'));

// TODO use an actual queue and not an array
// When a prediciton is requested, a resolution function will be pushed to the end of this queue
// When the prediction has been received, resolve the front of the queue
let predictionPromiseResolveQueue = [];

async function init(callback) {
	console.log("Starting model.py");
	// Python env variables
	let env = Object.create(process.env);
	env.PYTHONUNBUFFERED = '1';
	// Create the model process
	model = Spawn('python', ['model.py'], { stdio: 'pipe', env: env });
	ready = false;
	model.stdout.on('data', data => {
		dataStr = data.toString().trim();
		console.log("From model.py: " + dataStr);
		if (!ready) {
			// If data is received and the model is not ready, do nothing.
			if (dataStr === "Model trained. Ready to run! Verfication code: Zh1Alex9dU") {
				// Once this output has been receicved, the model is ready and we can call the callback which is run()
				ready = true;
				callback();
			}
		} else {
			// Once the model is ready, we assume all stdout from model now will be a predicted response to an input, resolves the front promise in predictionPromiseResolveQueue with the output
			let resolve = predictionPromiseResolveQueue.shift();
			resolve(dataStr);
		}
	});
}

async function run(callback) {
	hourlyResponse();
	mentionResponse();
	setInterval(hourlyResponse, 1000 * 60 * 60);
	setInterval(mentionResponse, 15000);
}

async function hourlyResponse() {
	console.log("Hourly response: responding to good tweet of this hour.");
	// Scrape for any popular tweet
	let data = await Scraper.getPopularTweet(T, sinceId, fs);
	// Send that tweet text to the model process, returns a promise
	let response = await predictResponse(data.text);
	// Once the promise is resolved, post the response
	Scraper.postResponse(T, data.target, response);
}

async function mentionResponse() {
	console.log("Every 15 seconds response: checking for any @mentions to respond to since id: " + sinceId.most_recent_mention_id);
	// Gets any new mentions
	let data = await Scraper.getNewMentions(T, sinceId, fs);
	// For each new mention, send the tweet to the model process and post it's predicted response
	for (let datum of data) {
		let response = await predictResponse(datum.text);
		Scraper.postResponse(T, datum.target, response);
	}
}

async function predictResponse(input) {
	console.log("New prediction requested. To model.py: " + input);
	// Creates a new promise that will push the resolution funciton into the predictionPromiseResolveQueue
	let promise = new Promise(resolve => {
		predictionPromiseResolveQueue.push(resolve);
	});
	// Write the input into the model
	model.stdin.write(input.replace(/(\r\n|\n|\r)/gm, ""));
	model.stdin.write('\n');
	// Return the promise
	return promise;
}

init(run);
