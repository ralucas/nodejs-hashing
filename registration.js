var passport = require('passport')
    LocalStrategy = require('passport-local').Strategy,
    db = require('./db');

module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.User.findOne({ username: username }, function(err, user) {
        if (err) { 
          return done(err); 
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
};
