let Twit = require('twit');
let T = new Twit(require('./config.js'));
let Scraper = require('./scraper.js');
let Spawn = require('child_process').spawn;
const fs = require('fs');

let model, sinceId = JSON.parse(fs.readFileSync('since_id.json', 'utf8'));

// TODO use an actual queue
let predictionPromiseResolveQueue = [];

async function init(callback) {
	console.log("Starting model.py");
	let env = Object.create(process.env);
	env.PYTHONUNBUFFERED = '1';
	model = Spawn('python', ['model.py'], { stdio: 'pipe', env: env });
	ready = false;
	model.stdout.on('data', data => {
		dataStr = data.toString().trim();
		console.log("From model.py: " + dataStr);
		if (!ready) {
			if (dataStr === "Model trained. Ready to run! Verfication code: Zh1Alex9dU") {
				ready = true;
				callback();
			}
		} else {
			// Assuming all stdout from model now will be a predicted response to an input
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
	let data = await Scraper.getPopularTweet(T, sinceId, fs);
	let response = await predictResponse(data.text);
	Scraper.postResponse(T, data.target, response);
}

async function mentionResponse() {
	console.log("Every 15 seconds response: checking for any @mentions to respond to since id: " + sinceId.most_recent_mention_id);
	let data = await Scraper.getNewMentions(T, sinceId, fs);
	for (let datum of data) {
		let response = await predictResponse(datum.text);
		Scraper.postResponse(T, datum.target, response);
	}
}

async function predictResponse(input) {
	console.log("New prediction requested. To model.py: " + input);
	let promise = new Promise(resolve => {
		predictionPromiseResolveQueue.push(resolve);
	});
	model.stdin.write(input.replace(/(\r\n|\n|\r)/gm, ""));
	model.stdin.write('\n');
	return promise;
}

init(run);
