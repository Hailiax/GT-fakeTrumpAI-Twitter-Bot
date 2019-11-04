let Twit = require('twit');
let T = new Twit(require('./config.js'));
let Scraper = require('./scraper.js');
let Spawn = require('child_process').spawn;
let model, sinceId = [0];

async function init( callback ) {
	model = Spawn('python', ['model.py']);
	py.stdout.on('end', data => {
		callback();
	})
}

async function run( callback ) {
	hourlyResponse();
	mentionResponse();
	setInterval(hourlyResponse, 1000 * 60 * 60);
	setInterval(mentionResponse, 15000);
}

async function hourlyResponse() {
	let target = Scraper.getPopularTweet(T);
	// TODO create and post response to tweet
}

async function mentionResponse() {
	let mentions = Scraper.getNewMentions(T, sinceId);
	for (let mention of mentions) {
		// TODO create and post response to mention
	}
}

init( run );
