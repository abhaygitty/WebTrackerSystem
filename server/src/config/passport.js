/**
 * Created by pzheng on 13/12/2016.
 */
'use strict';
var passport = require('passport');
    //,UserModel = require('../models/user.server.model');

module.exports = function() {
    /* deprecated, no session any more */
    /*
    passport.serializeUser(function(user, done) {
        done(null, user.id ); //saved to session req.session.passport.user= {id:'...'}
    });

    passport.deserializeUser(function(id, done) {
        var user = UserModel.findById(id);
        if(user) {
            done(null, user);} //user.id built-in property is different from user.ID; user object attaches to the request as req.user
        else {
            done(null, false);
        }
    });
    */
    require('./strategies/localStrategy.js')();
    require('./strategies/jwtStrategy.js')();
};
