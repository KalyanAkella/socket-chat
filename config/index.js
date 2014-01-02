var config = require('./default.js');

try {
  var config_file = './' + (process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'dev') + '.js';
  var env_config = require(config_file);
  for (var key in env_config) {
    config[key] = env_config[key];
  }
} catch (err) {
  if (err.code && err.code === 'MODULE_NOT_FOUND') {
    console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV
      + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
    process.exit(1);
  } else {
    throw err;
  }
}
module.exports = config;
