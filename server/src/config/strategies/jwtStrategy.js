/**
 * Created by pzheng on 7/02/2017.
 */
'use strict';
var config = require('../config'),
    passport = require('passport'),
    ExtractJwt = require('passport-jwt').ExtractJwt,
    JwtStrategy = require('passport-jwt').Strategy,
    User = require('../../models/userModel.js'),
    jwtOptions = {
      // Advise Passport to check authorization headers for JWT
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      // Advise Passport where to find the secret
      secretOrKey: config.tokenSecret
      //TO-DO: Add Issuer and audience checks
    };

var jwtStrategy = new JwtStrategy(jwtOptions,
  function(jwt_payload, done) {
    console.log("Payload received", jwt_payload);
    //usually this would be a database call:
    var user = User.findByUsername(jwt_payload.username);
    if (!user) {
      console.log("Unknown user");
      return done(null, false, {message: 'Unknown user'});
    } else if (!User.authenticate(jwt_payload.username, jwt_payload.password)) {
      console.log("Invalid password");
      return done(null, false, {message: 'Invalid password'});
    } else {
      console.log("User verified by JWT: " + JSON.stringify(user));
      console.log("In the payload, Username: " + jwt_payload.username + " password: " + jwt_payload.password );
      return done(null, user);
    }
  }
);

module.exports = function() { passport.use(jwtStrategy); }
