var OAuth = require('OAuth').OAuth;

module.exports.login = function (req, res) {
  // TODO - twitter settings must be moved to config file
  var twitterConsumerKey = 'sSQP13VO7Mg41RbDnYQ';
  var twitterConsumerSecret = 'jZ44hpTGZSOh96Z4z9TeVcQtehudSzkEt6PXJxY0OZE';

  var oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    twitterConsumerKey, twitterConsumerSecret,
    '1.0A', 'http://localhost:3700/twitter_redirect', 'HMAC-SHA1'
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
      function (error, data, res) {
        if (error) {
          console.log("An error occurred while obtaining logged-in user details");
          console.log(error);
        } else {
          console.log("****************");
          console.log(require('util').inspect(data));
          console.dir(data);
          console.log("****************");
        }
      }
    );
  }
};
