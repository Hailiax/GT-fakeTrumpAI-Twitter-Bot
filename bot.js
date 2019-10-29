var Twit = require('twit');
var T = new Twit(require('./config.js'));

var Scraper = require('./scraper.js');
var Neural = require('./neural.js');

function train() {
	Neural.train('hi');
}

function loop() {
	Scraper.retweet(T);
}

train();

loop();

setInterval(loop, 1000 * 60 * 60);
