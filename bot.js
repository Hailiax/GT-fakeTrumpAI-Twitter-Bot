var Twit = require('twit');
var T = new Twit(require('./config.js'));
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

var Scraper = require('./scraper.js');
var Neural = require('./neural.js');

async function train( callback ) {
	let dataset = await Scraper.generateDataset(T, tf);
	console.log(dataset);
	await Neural.train(tf, dataset);
	callback();
}

async function loop( callback ) {
	//var tweet = Scraper.getPopularTweet(T, tf);
	//var response = Neural.respond(tf, tweet);
	//console.log(response);
	//T.post();
}

train( loop );

setInterval(loop, 1000 * 60 * 60);
