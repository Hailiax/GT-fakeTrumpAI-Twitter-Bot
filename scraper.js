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
 * @param trendsArr an array with the current trending topics
 * @param sinceId the id of the most recent popular tweet that the bot found
 * @promises the pre-processed text from a recent tweet
 */
async function _getPopularTweetHelper(T, trend, sinceId) {
	let popularTweets = await _getPopularTweets(T, trend, 1);
	if (popularTweets.length === 0) {
		return null;
	}
	if (!popularTweets[0].text.includes("https://t.co/") && parseInt(popularTweets[0].id_str) > parseInt(sinceId.most_recent_popular_tweet_id)) {
		return popularTweets[0];
	} else {
		return null;
	}
}

/**
 * Gets a single popular tweet
 *
 * @param T the twitter object
 * @param sinceId the id of the most recent popular tweet that the bot found
 * @param fs the node file system library
 * @return {target: 'the id of the tweet to post a reply to', text: 'the text to respond to'}
 */
async function getPopularTweet(T, sinceId, fs) {
	console.log("Attempting to get one popular tweet");
	let trendsArr = await _getTrends(T);
	let count = 0;
	let tweet = await _getPopularTweetHelper(T, trendsArr[count], sinceId);
	while (tweet === null) {
		console.log("Tweet contained an image or tweet is too old. Finding a new tweet.");
		if (count > trendsArr.length - 1) {
			count = 0;
			trendsArr = await _getTrends(T);
		}
		tweet = await _getPopularTweetHelper(T, trendsArr[++count], sinceId);
	}
	sinceId.most_recent_popular_tweet_id = tweet.id_str;
	await fs.writeFile('since_id.json', JSON.stringify(sinceId), function (error) {
		if (error) {
			console.log(error);
		}
	});
	console.log("Successful get tweet");
	return { target: tweet, text: tweet.text };
}

/**
 * Promises an array of tweet ids
 * 
 * @param  the twitter object
 * @param sinceId id of the most recent mention the bot replied to
 * @return array of recent mentions
 */
function _getNewMentionsHelper(T, sinceId) {
	return new Promise(resolve => {
		let param = {
			since_id: sinceId
		}
		T.get('statuses/mentions_timeline', param, function (error, data) {
			if (!error) {
				resolve(data);
			} else {
				console.log(error);
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
 * @return an array of {target: 'the mentioner's tweet', text: 'the text of the parent to respond to'}
 */
async function getNewMentions(T, sinceId, fs) {
	// TODO update sinceId
	console.log("Attempting to get list of recent proper mentions.");
	let tweetList = await _getNewMentionsHelper(T, sinceId.most_recent_mention_id);
	let returnArr = [];
	for (let tweet of tweetList) {
		if (parseInt(sinceId.most_recent_mention_id) < parseInt(tweet.id_str)) {
			sinceId.most_recent_mention_id = tweet.id_str;
		}
		await fs.writeFile('since_id.json', JSON.stringify(sinceId), function (error) {
			if (error) {
				console.log(error);
			}
		});
		if ((tweet.in_reply_to_status_id_str !== null && tweet.in_reply_to_user_id_str !== '1186681648122757121')) {
			let parent = await getTweet(T, tweet.in_reply_to_status_id_str);
			/*if (parent.text.includes("https://t.co/")) {
				postResponse(T, tweet, "I cannot respond to this. Please reply to any text only tweet mentioning me, and I will reply with my response to the tweet you replied to.");
			} else {*/
				returnArr.push({ target: tweet, text: parent.text });
			//}
		} else
			postResponse(T, tweet, "I cannot respond to this. Please reply to any text only tweet mentioning me, and I will reply with my response to the tweet you replied to.");
	}

	console.log("Successful Get New Mentions");
	return returnArr;
}

/**
 * Gets tweet object from id
 *
 * @param T the twitter api object
 * @param id the id of the tweet to get
 * @return the tweet object
 */
function getTweet(T, id) {
	console.log("Attempting to get tweet with id: " + id);
	return new Promise(resolve => {
		let param = {
			id: id
		}
		T.get('statuses/show', param, function (error, data) {
			if (error) {
				console.log(error);
			} else {
				console.log("Successful Get Tweet");
				resolve(data);
			}
		});
	});

}

/**
 * Posts tweet as a reply
 *
 * @param T the twitter object
 * @param tweet the id of the tweet to reply to
 * @param text the post
 */
function postResponse(T, tweet, text) {
	console.log("Attempting to reply to tweet id " + tweet.id_str + " with: " + text);
	let response = {
		status: "@" + tweet.user.screen_name + " " + text,
		in_reply_to_status_id: tweet.id_str,
	};
	T.post('statuses/update', response, function (error, data) {
		if (!error) {
			console.log("Successful Reply");
		} else {
			console.log(error);
		}
	});
}



module.exports = {
	getPopularTweet: getPopularTweet,
	getNewMentions: getNewMentions,
	postResponse: postResponse,
	getTweet: getTweet
};
