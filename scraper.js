/**
 * Gets 50 most trending topics in the US
 * 
 * @param T the twitter object
 * @promises an array of trends
 */
function _getTrends(T) {
	return new Promise(resolve => {
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
 * @promises a list of popular tweets
 */
function _getPopularTweets(T, query, count) {
	return new Promise(resolve => {
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
 * @promises the pre-processed text from a recent tweet
 */
async function _getPopularTweetHelper(T, count) {
	let trendsArr = await _getTrends(T);
	let popularTweets = await _getPopularTweets(T, trendsArr[count], 1);
	// TODO: Iterate, preprocess, filter tweets to select a good tweet
	hypertext = "https://t.co/";
	if (!popularTweets[0].text.includes(hypertext)) {
		return popularTweets[0];
	} else {
		return null;
	}
}

async function getPopularTweet(T) {
	let count = 0;
	let tweet = await _getPopularTweetHelper(T, count);
	while (tweet == null) {
		tweet = await _getPopularTweetHelper(T, ++count);
	}
	return tweet;

}

/**
 * Promises an array of tweet ids
 * 
 * @param {*} T the twitter object
 * @param {*} sinceId since id
 */
function _getNewMentionsHelper(T, sinceId) {
	return new Promise(resolve => {
		let param = {
			since_id: 12345
		}
		T.get('statuses/mentions_timeline', param, function (error, data) {
			let parentIdList = [];
			if (error) {
				console.log(error);
			} else {
				for (let tweet of data)
					parentIdList.push(tweet.in_reply_to_status_id_str);
				console.log(parentIdList);
				resolve(parentIdList);
			}

		});
	});
}

/**
 * Gets newest mentions
 * Mutates sinceId[0] to the newest since id
 * 
 * @param T the twitter object
 * @param sinceId the since id
 * @return an array of new mentions' parents twitter ids
 */
async function getNewMentions(T, sinceId) {

	let tweetIdList = await _getNewMentionsHelper(T, sinceId);
	let tweetList = [];
	for (let tweetId of tweetIdList) {
		if (tweetId == null) {
			param = {
				status: "Cannot find Parent tweet"
			}
			T.post('statuses/update', param, function (error, data) {
				if (error) {
					console.log(error);
				} else {
					console.log("No Parent");
				}
			});
		} else {
			let tweet = await getTweet(T, tweetId);
			tweetList.push(tweet);
		}
	}
	console.log(tweetList);
	return tweetList;
}

/**
 * Gets tweet object from id
 *
 * @param T the twitter api object
 * @param id the id of the tweet to get 
 */
function getTweet(T, id) {
	return new Promise(resolve => {
		let param = {
			id: id
		}
		T.get('statuses/show', param, function (error, data) {
			if (error) {
				console.log(error);
			} else {
				console.log("Successful Lookup");
				resolve(data);
			}
		});
	});

}

/**
 * Posts tweet as a reply
 *
 * @param T the twitter object
 * @param tweet the tweet to respond to
 * @param text the post
 */
async function postResponse(T, tweet, text) {
	let response = {
		status: text,
		in_reply_to_status_id: tweet.id,
	};

	T.post('statuses/update', response, function (error, data) {
		if (error) {
			console.log(error);
		} else {
			console.log('Tweeted: ' + text);
		}
	});
}



module.exports = {
	getPopularTweet: getPopularTweet,
	getNewMentions: getNewMentions,
	postResponse: postResponse,
	getTweet: getTweet
};
