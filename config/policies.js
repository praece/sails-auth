var fs = require('fs');
var _ = require('lodash');

// Add our general custom policies.
var policies = {
  '*': false
};

// Disable delete by default for all controllers.
_.forEach(fs.readdirSync('api/controllers'), function(file) {
  if (_.endsWith(file, '.js')) policies[file.slice(0, -3)] = {destroy: false};
});

module.exports.policies = policies;