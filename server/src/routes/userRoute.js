/**
 * Created by pzheng on 6/04/2017.
 */
'use strict';

var UserController = require('../controllers/userController.js'),
  AuthenticationController = require('../controllers/authenticationController.js'),
  passport = require('passport'),
  helpers = require('../helpers'),
  userRoles = require('../config/constants').userRoles,
  requireAuth = passport.authenticate('jwt', {session: false});

var routes = [
  {
    path: '/:userId',
    httpMethod: 'GET',
    middleware: [requireAuth, UserController.viewProfile]
  },
  {
    path: '/protected',
    httpMethod: 'GET',
    middleware: [requireAuth, function(req, res) {
      res.send({content: 'The protected test route is functionl!'});
    }],
  },
  {
    path: '/admins-only',
    httpMethod: 'GET',
    middleware: [requireAuth, AuthenticationController.roleAuthorization(userRoles.admin), function(req, res) {
      res.send({content: 'Admin dashboard is working.'});
    }],
  }
];

exports.applyUserRoutesAt = function(app) {
  helpers.applyRoutes(app, routes);
};
