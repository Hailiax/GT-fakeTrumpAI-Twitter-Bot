# Iris Electran

https://twitter.com/irisElectran

This bot scrapes twitter for popular trends and gets a tweet for each trend and then replies with a self generated reply. 
The bot also responds to user mentions provided that the mention has a parent tweet that does not contain any media.


## TODO

Prevent bot from responding to itself and thus creating an infinite loop  
Handle case where you exceed 50 of the trends and hit the twitter rate limit  
* Increment the count parameter in _getPopularTweets by 1 and then get the next tweet