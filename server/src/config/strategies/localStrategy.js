/**
 * Created by pzheng on 30/11/2016.
 */
'use strict';
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../../models/userModel.js'),
    localOptions = { usernameField: "username", passwordField: "password", session: false };

var localStrategy = new LocalStrategy(localOptions,
  function(username, password, done) {
    console.log('username', username);
    console.log('password', password);
    var user = User.findByUsername(username);
    console.log('user in local Strategy', user);

    if (!user) {
      return done(null, false, { message: 'Unknown user' });
    } else if (!User.authenticate(username, password)) {
      return done(null, false, { message: 'Invalid password' });
    } else {
      return done(null, user);
    }
  });

module.exports = function() {passport.use(localStrategy);};
