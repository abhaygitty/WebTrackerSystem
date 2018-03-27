/**
 * Created by pzheng on 13/02/2017.
 */
'use strict';

var AuthenticationController = require('../controllers/authenticationController.js'),
  passport = require('passport'),
  helpers = require('../helpers'),
  // Undocumented param, failWithError, Refer to https://github.com/jaredhanson/passport/issues/458
  localAuthentication = passport.authenticate('local', { session: false, failWithError: true });

var routes = [
  // Local Auth
  {
    path: '/signup',
    httpMethod: 'POST',
    middleware: [AuthenticationController.signup]
  },
  {
    path: '/login',
    httpMethod: 'POST',
    middleware: [localAuthentication, AuthenticationController.loginSuccess, AuthenticationController.loginFailure],
  },
  {
    path: '/forgot-password',
    httpMethod: 'POST',
    middleware: [AuthenticationController.forgotPassword],
  },
  {
    path: '/reset-password/:token',
    httpMethod: 'POST',
    middleware: [AuthenticationController.verifyToken],
  }
];

exports.applyAuthRoutesAt = function(app) {
  helpers.applyRoutes(app, routes);
};
