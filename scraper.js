// Gets 50 trending topics in the US 
const param = { id: '23424977' };
async function getTrending(T) {
	var trendList = new Set();
	return new Promise(resolve => {
		T.get('trends/place', param, function (error, data) {
			if (!error) {
				trends = data;
				for (var trend of trends[0].trends) {
					//console.log(trend.name);
					trendList.add(trend.name);
				}
				console.log("bruh");
				//Returns to result
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
	let result = await getTrending(T);
	for (var trend of result) {
		var popular = { q: trend, lang: 'en', count: 100, result_type: "popular" };
		T.get('search/tweets', popular, function (error, data) {
			if (!error) {
				for (var pop of data.statuses)
					console.log(pop.text);

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
	getTrending: getTrending,
	// generateDataset: generateDataset,
	getPopularTweet: getPopularTweet
};