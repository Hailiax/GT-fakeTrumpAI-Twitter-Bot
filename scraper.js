/*
// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var mediaArtsSearch = {q: "#mediaarts", count: 10, result_type: "recent"}; 

// This function finds the latest tweet with the #mediaarts hashtag, and retweets it.
function retweetLatest( T ) {
	T.get('search/tweets', mediaArtsSearch, function (error, data) {
	  // log out any errors and responses
	  console.log(error, data);
	  // If our search request to the server had no errors...
	  if (!error) {
	  	// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	  }
	  // However, if our original search request had an error, we want to print it out here.
	  else {
	  	console.log('There was an error with your hashtag search:', error);
	  }
	});
}
*/

/**
 * Generates a large dataset by scraping twitter
 * 
 * @param T the twitter object
 * @return a dataset
 */
 
function generateDataset(T, tf) {
	return {};
}

/**
 * Gets the most popular tweet
 * 
 * @param T the twitter object
 * @return the pre-processed text from a recent tweet
 */
 
function getPopularTweet(T, tf) {
	return "Donald Trump can suck a dick.";
}

module.exports = {
	generateDataset: generateDataset,
	getPopularTweet: getPopularTweet
};