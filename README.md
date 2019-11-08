# Fake Trump AI Bot

https://twitter.com/fakeTrumpAIBot

This bot scrapes twitter for popular trends and gets a tweet for each trend and then replies with a self generated reply. 
The bot also responds to user mentions provided that the mention has a parent tweet that does not contain any media.

## Run This On Your Own Computer!  
If you'd like to use our pretrained model weights, unzip this file into the same directory as model.py. Then change one of the first lines in model.py from `new_training = False` to `new_training = True`.  

## TODO

* Prevent bot from responding to itself and thus creating an infinite loop  
* Handle case where you exceed 50 of the trends and hit the twitter rate limit  
  * Increment the count parameter in _getPopularTweets by 1 and then get the next tweet  
* Update JSDocs
