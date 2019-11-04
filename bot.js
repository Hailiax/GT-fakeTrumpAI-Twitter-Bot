let Twit = require('twit');
let T = new Twit(require('./config.js'));
let Scraper = require('./scraper.js');
let Spawn = require('child_process').spawn;

let model, sinceId = [0];
// TODO use an actual queue
let predictionPromiseQueue = [];

async function init( callback ) {
	model = Spawn('python', ['model.py']);
	compiled = false;
	model.stdout.on('data', data => {
		console.log(data);
		if (compiled){
			let promise = predictionPromiseQueue.shift();
			promise.resolve(data);
		} else {
			if (data === "Model compiled and trained. Ready to run! Zh1Alex9dU") {
				compiled = true;
				callback();
			}
		}
	});
}

async function run( callback ) {
	hourlyResponse();
	mentionResponse();
	setInterval(hourlyResponse, 1000 * 60 * 60);
	setInterval(mentionResponse, 15000);
}

async function hourlyResponse() {
	let data = await Scraper.getPopularTweet(T);
	let response = await predictResponse(data.text);
	Scraper.postResponse(T, data.target, response);
}

async function mentionResponse() {
	let data = await Scraper.getNewMentions(T, sinceId);
	for (let datum of data) {
		let response = await predictResponse(datum.text);
		Scraper.postResponse(T, datum.target, response);
	}
}

async function predictResponse(input) {
	let promise = new Promise();
	model.stdin.write(input);
	predictionPromiseQueue.push(promise);
	return promise;
}

init( run );
