# Fake Trump AI Bot

https://twitter.com/fakeTrumpAI

This bot scrapes twitter for popular trends and gets a tweet for each trend and then replies with a self generated reply. 
The bot also responds to user mentions provided that the mention has a parent tweet that does not contain any media.

## Run This On Your Own Computer!  
Run this bot: `node bot.js`  

This bot uses python to run the tensorflow model and node to interact with twitter. Make sure to install node and python and all of this project's dependencies in the directory. I used a python virtual enviroment and I listed all the packages I had installed in dependencies.txt  

If you'd like to use our pretrained model weights, unzip [this file](https://gtvault-my.sharepoint.com/personal/awing6_gatech_edu/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fawing6%5Fgatech%5Fedu%2FDocuments%2Ftraining%2Ezip&parent=%2Fpersonal%2Fawing6%5Fgatech%5Fedu%2FDocuments&originalPath=aHR0cHM6Ly9ndHZhdWx0LW15LnNoYXJlcG9pbnQuY29tLzp1Oi9nL3BlcnNvbmFsL2F3aW5nNl9nYXRlY2hfZWR1L0VZcWpXNWVGQ0x0SnNHNXdlUzM0ZEdNQnk5T194ekQzT0ZfTUNJSVhpOVdCNWc_cnRpbWU9WHduYUlaVmsxMGc) into the same directory as model.py. Then change one of the first lines in model.py from `new_training = True` to `new_training = False`.  

## TODO

* Prevent bot from responding to itself and thus creating an infinite loop  
* Handle case where you exceed 50 of the trends and hit the twitter rate limit  
  * Increment the count parameter in _getPopularTweets by 1 and then get the next tweet  
* Update JSDocs
