var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');

passport.use(new BearerStrategy({}, function(token, done) {
  var config = sails.config.auth;
  var options = config.options || { algorithms: ['HS256'], audience: config.audience };

  jwt.verify(token, new Buffer(config.secret, 'base64'), options, function(err, decoded) {
    // Error decoding the token
    if (err) return done(err);

    // This token has no email
    if (!decoded.email) return done(null, false);

    var promise;

    if (config.findUser) {
      promise = config.findUser(decoded.email);
    } else {
      promise = User.where('email', decoded.email).fetch();
    }

    return promise
      .then(function(user){
        if (!user) { return done(null, false); }
        return done(null, user.toJSON(), {});
      })
      .catch(done);
  });
}));

module.exports.http = {
  middleware: {
    order: ['passport'],
    passport: passport.initialize()
  }
};