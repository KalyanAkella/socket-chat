var config = require('./config');
var twitterConfig = config.twitter;
var OAuth = require('OAuth').OAuth;

module.exports.login = function (req, res) {
  // TODO - twitter settings must be moved to config file
  var twitterConsumerKey = twitterConfig.key;
  var twitterConsumerSecret = twitterConfig.secret;
  var oauthVersion = twitterConfig.oauth.version;
  var oauthAlgo = twitterConfig.oauth.algo;

  var oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    twitterConsumerKey, twitterConsumerSecret, oauthVersion,
    'http://' + config.host + ':' + config.port + '/twitter_redirect', oauthAlgo
  );

  oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log("An error occurred while obtaining the request token");
      console.log(error);
    } else {
      req.session.oauth = oauth;
      req.session.oauth_token = oauth_token;
      req.session.oauth_token_secret = oauth_token_secret;
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + oauth_token);
    }
  });
};

module.exports.redirect = function (req, res) {
  console.log("******************");
  console.dir(req);
  console.log("******************");
  if (req.session.oauth) {
    var oauth = new OAuth(
      req.session.oauth._requestUrl,
      req.session.oauth._accessUrl,
      req.session.oauth._consumerKey,
      req.session.oauth._consumerSecret,
      req.session.oauth._version,
      req.session.oauth._authorize_callback,
      req.session.oauth._signatureMethod
    );
    oauth.getOAuthAccessToken(
      req.session.oauth_token,
      req.session.oauth_token_secret,
      req.param('oauth_verifier'),
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log("An error occurred while obtaining the access token");
          console.log(error);
        } else {
          req.session.oauth_access_token = oauth_access_token;
          req.session.oauth_access_token_secret = oauth_access_token_secret;
          res.redirect('/');
        }
      }
    );
  }
};

module.exports.getUser = function (req, res) {
  if (req.session.oauth) {
    var oauth = new OAuth(
      req.session.oauth._requestUrl,
      req.session.oauth._accessUrl,
      req.session.oauth._consumerKey,
      req.session.oauth._consumerSecret,
      req.session.oauth._version,
      req.session.oauth._authorize_callback,
      req.session.oauth._signatureMethod
    );
    oauth.get('https://api.twitter.com/1.1/account/settings.json',
      req.session.oauth_access_token,
      req.session.oauth_access_token_secret,
      function (error, data) {
        if (error) {
          console.log("An error occurred while obtaining logged-in user details");
          console.log(error);
        } else {
          var twitter_data = JSON.parse(data);
          res.render("page", { twitter_logged_in: twitter_data.screen_name });
        }
      }
    );
  } else {
    res.render("page");
  }
};
