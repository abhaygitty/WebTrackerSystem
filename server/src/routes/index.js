/**
 * Created by pzheng on 19/01/2017.
 */

'use strict';

var index = require('../controllers/index.js'),
    path = require('path'),
    _ = require('underscore'),
    funHelper = require('../helpers'),
    userRoles = require('../config/constants').userRoles,
    accessLevels = require('../config/constants').accessLevels;

var routes = [
    //views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }],
        accessLevel: accessLevels.public
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            res.json({message: "Express is up!"});
        }],
        accessLevel: accessLevels.public
    }
];

module.exports = function(app) {
    funHelper.applyRoutes(app, routes);
};
