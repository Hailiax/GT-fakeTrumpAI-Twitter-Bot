/**
 * Gets 50 most trending topics in the US
 * 
 * @param T the twitter object
 * @promises an array of trends
 */
async function _getTrends(T) {
	return new Promise(async resolve => {
		let locationUSQuery = { id: '23424977' };
		T.get('trends/place', locationUSQuery, (error, data) => {
			if (!error) {
				let trendList = [];
				for (let trend of data[0].trends)
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
 * Gets the most popular tweets
 * 
 * @param T the twitter object
 * @param query the topic to query
 * @param count the number of tweets to return
 * @return a list of popular tweets
 */
async function _getPopularTweets(T, query, count) {
	return new Promise(async resolve => {
		let popularQuery = { q: query, lang: 'en', count: count, result_type: "popular" };
		T.get('search/tweets', popularQuery, (error, data) => {
			if (!error) {
				let tweetList = [];
				for (let tweet of data.statuses)
					tweetList.push(tweet);
				resolve(tweetList);
			} else {
				console.log(error);
			}
		});
	});
}

/**
 * Gets a single popular tweet's text
 * 
 * @param T the twitter object
 * @return the pre-processed text from a recent tweet
 */
async function getPopularTweet(T) {
	return new Promise(async resolve => {
		let trendsArr = await _getTrends(T);
		let popularTweets = await _getPopularTweets(T, trendsArr[0], 1);
		// TODO: Iterate, preprocess, filter tweets to select a good tweet
		resolve(popularTweets[0].text);
	});
}


/**
 * Generates a large dataset by scraping twitter
 * 
 * @param T the twitter object
 * @return a dataset
 */
async function generateDataset(T, tf) {
	return new Promise(async resolve => {
		let test = await getPopularTweet(T);
		resolve(test);
	});
}

module.exports = {
	generateDataset: generateDataset,
	getPopularTweet: getPopularTweet
};
