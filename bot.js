var Twit = require('twit');
var T = new Twit(require('./config.js'));
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

var Scraper = require('./scraper.js');
var Neural = require('./neural.js');

function train() {
	var data = Scraper.generateDataset(T, tf);
	Neural.train(tf, data);
}

function loop() {
	var tweet = Scraper.getPopularTweet(T, tf);
	var response = Neural.respond(tf, tweet);
	console.log(response);
	//T.post();
}

train();

loop();

setInterval(loop, 1000 * 60 * 60);
