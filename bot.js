var Twit = require('twit');
var T = new Twit(require('./config.js'));

var Scraper = require('./scraper.js');
var Neural = require('./neural.js');

function train() {
	var data = Scraper.generateDataset;
	Neural.train(data);
}

function loop() {
	var tweet = Scraper.getPopularTweet;
	var response = Neural.respond(tweet);
	console.log(response);
	//T.post();
}

train();

loop();

setInterval(loop, 1000 * 60 * 60);
