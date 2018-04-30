var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var _ = require('lodash');

passport.use(new BearerStrategy({ passReqToCallback: true }, function(req, token, done) {
  var config = sails.config.auth;
  var options = _.assign({ algorithms: ['HS256'], audience: config.audience, maxAge: '24h' }, config.options, _.get(req, '_authOptions', {}));

  if (process.env.NODE_ENV === 'test') delete options.maxAge;

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
