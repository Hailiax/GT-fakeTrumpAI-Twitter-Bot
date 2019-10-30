/**
 * Gets 50 most trending topics in the US
 * 
 * @param T the twitter object
 * @promises an array of trends
 */
async function getTrending(T) {
	return new Promise(resolve => {
		// id: '23424977' is the US location code
		T.get('trends/place', { id: '23424977' }, (error, data) => {
			if (!error) {
				var trendList = [];
				for (var trend of data[0].trends)
					trendList.push(trend.name);
				// Acts like the return for this promise
				resolve(trendList);
			} else {
				console.log(error);
			}
		});
	});
}

/**
 * Gets the most popular tweet
 * 
 * @param T the twitter object
 * @return the pre-processed text from a recent tweet
 */
async function getPopularTweet(T) {
	let trendList = await getTrending(T);
	for (var trend of trendList) {
		var popularQuery = { q: trend, lang: 'en', count: 100, result_type: "popular" };
		T.get('search/tweets', popularQuery, (error, data) => {
			if (!error) {
				for (var tweet of data.statuses)
					console.log(tweet.text);

			} else {
				console.log(error);
			}
		})
	}
}


// /**
//  * Generates a large dataset by scraping twitter
//  * 
//  * @param T the twitter object
//  * @return a dataset
//  */

// function generateDataset(T, tf) {
// 	var set = new Set();
// 	getTrending(T, tf);
// 	T.get('search/tweets', trends, function (error, data) {
// 		// log out any errors and responses
// 		console.log(error, data);
// 		// If our search request to the server had no errors...
// 		if (!error) {
// 			set.add(data);
// 		}
// 		// However, if our original search request had an error, we want to print it out here.
// 		else {
// 			console.log('There was an error with your hashtag search:', error);
// 		}

// 	});
// 	return set;
// }

module.exports = {
	// generateDataset: generateDataset,
	getPopularTweet: getPopularTweet
};
