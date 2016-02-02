var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');

passport.use(new BearerStrategy({}, function(token, done) {
  var config = sails.config.auth;

  jwt.verify(token, new Buffer(config.secret, 'base64'), {audience: config.audience}, function(err, decoded) {
    if (err) {
      return done(err);
    } else if (!decoded.email) {
      return done(null, false);
    } else {
      var promise;

      if (config.findUser) {
        promise = config.findUser(decoded.email);
      } else {
        promise = User.where('email', decoded.email).fetch();
      }

      promise
        .then(function(user){
          if (!user) { return done(null, false); }
          return done(null, user.toJSON(), {});
        })
        .catch(done);
    }
  });
}));

module.exports.http = {
  middleware: passport.initialize()
};