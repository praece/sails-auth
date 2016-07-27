var passport = require('passport');

module.exports = function (req, res, done) {

  passport.authenticate('bearer', function(err, user, info) {
    if (err) return res.forbidden(err);
    if (!user) return res.forbidden({message: 'You are not authorized to access this page!'});

    // If this is a socket request we don't have req.login, so fake it
    if (!req.login) {
      req.user = user;

      return done();
    }

    req.login(user, {session: false}, function(err) {
      if (err) { return done(err); }

      done();
    });
  })(req, res, done);

};