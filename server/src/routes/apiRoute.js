/**
 * Created by pzheng on 17/03/2017.
 */
'use strict';

var passport = require('passport'),
  helpers = require('../helpers'),
  // userRoles = require('../config/constants').userRoles,
  // requireAuth = passport.authenticate('jwt', {session: false});
  requireAuth = require('../controllers/authenticationController.js').authenticationCheck,
  ClientController = require('../controllers/clientController.js'),
  LocationController = require('../controllers/locationController.js'),
  SoftwareController = require('../controllers/softwareController.js'),
  ContactController = require('../controllers/contactController.js'),
  AddressTypeController = require('../controllers/addressTypeControler.js'),
  ModuleController = require('../controllers/moduleController.js'),
  ModuleTypeController = require('../controllers/moduleTypeController.js'),
  FeeController = require('../controllers/feeController.js'),
  FreqTypeController = require('../controllers/freqTypeController.js'),
  FeeCatController = require('../controllers/feeCatController.js'),
  EdiController = require('../controllers/ediController.js');

var routes = [
  {
    path: '/dashboard',
    httpMethod: 'GET',
    middleware: [requireAuth, function(req, res) {
      return res.status(200).json({
        message: "You're authorized to see this secret message."
      });
    }]
  },
  {
    path: '/clients',
    httpMethod: 'GET',
    middleware: [requireAuth, ClientController.fetchAll]
  },
  {
    path: '/softwares',
    httpMethod: 'GET',
    middleware: [requireAuth, SoftwareController.fetchAll]
  },
  {
    path: '/clients/create',
    httpMethod: 'POST',
    middleware: [requireAuth, ClientController.createOne]
  },
  {
    path: '/clients/:id',
    httpMethod: 'GET',
    middleware: [requireAuth, ClientController.fetchOne]
  },
  {
    path: '/clients/update',
    httpMethod: 'POST',
    middleware: [requireAuth, ClientController.updateOne]
  },
  {
    path: '/clients/update/:id/locations',
    httpMethod: 'GET',
    middleware: [requireAuth, LocationController.fetchLocations]
  },
  {
    path: '/locations/:id',
    httpMethod: 'GET',
    middleware: [requireAuth, LocationController.fetchOne]
  },
  {
    path: '/locations/create',
    httpMethod: 'POST',
    middleware: [requireAuth, LocationController.createOne]
  },
  {
    path: '/locations/update',
    httpMethod: 'POST',
    middleware: [requireAuth, LocationController.updateOne]
  },
  {
    path: '/locations/delete',
    httpMethod: 'POST',
    middleware: [requireAuth, LocationController.deleteOne]
  },
  {
    path: '/locationtypes',
    httpMethod: 'GET',
    middleware: [requireAuth, AddressTypeController.fetchAll]
  },
  {
    path: '/clients/update/:id/contacts',
    httpMethod: 'GET',
    middleware: [requireAuth, ContactController.fetchContacts]
  },
  {
    path: '/contacts/:id',
    httpMethod: 'GET',
    middleware: [requireAuth, ContactController.fetchOne]
  },
  {
    path: '/contacts/create',
    httpMethod: 'POST',
    middleware: [requireAuth, ContactController.createOne]
  },
  {
    path: '/contacts/update',
    httpMethod: 'POST',
    middleware: [requireAuth, ContactController.updateOne]
  },
  {
    path: '/contacts/delete',
    httpMethod: 'POST',
    middleware: [requireAuth, ContactController.deleteOne]
  },
  {
    path: '/clients/update/:id/modules',
    httpMethod: 'GET',
    middleware: [requireAuth, ModuleController.fetchModules]
  },
  {
    path: '/clients/:id/modules/update',
    httpMethod: 'POST',
    middleware: [requireAuth, ModuleController.updateModules]
  },
  {
    path: '/moduletypes',
    httpMethod: 'GET',
    middleware: [requireAuth, ModuleTypeController.fetchAll]
  },
  {
    path: '/clients/update/:id/fees',
    httpMethod: 'GET',
    middleware: [requireAuth, FeeController.fetchFees]
  },
  {
    path: '/fees/:id',
    httpMethod: 'GET',
    middleware: [requireAuth, FeeController.fetchOne]
  },
  {
    path: '/fees/create',
    httpMethod: 'POST',
    middleware: [requireAuth, FeeController.createOne]
  },
  {
    path: '/fees/update',
    httpMethod: 'POST',
    middleware: [requireAuth, FeeController.updateOne]
  },
  {
    path: '/fees/delete',
    httpMethod: 'POST',
    middleware: [requireAuth, FeeController.deleteOne]
  },
  {
    path: '/freqtypes',
    httpMethod: 'GET',
    middleware: [requireAuth, FreqTypeController.fetchAll]
  },
  {
    path: '/feecats',
    httpMethod: 'GET',
    middleware: [requireAuth, FeeCatController.fetchAll]
  },
  /* edi */
  {
    path: '/clients/update/:id/edis',
    httpMethod: 'GET',
    middleware: [requireAuth, EdiController.fetchEdis]
  },
  {
    path: '/edis/:id',
    httpMethod: 'GET',
    middleware: [requireAuth, EdiController.fetchOne]
  },
  {
    path: '/edis/create',
    httpMethod: 'POST',
    middleware: [requireAuth, EdiController.createOne]
  },
  {
    path: '/edis/update',
    httpMethod: 'POST',
    middleware: [requireAuth, EdiController.updateOne]
  },
  {
    path: '/edis/delete',
    httpMethod: 'POST',
    middleware: [requireAuth, EdiController.deleteOne]
  },

];

exports.applyApiRoutesAt = function(app) {
  helpers.applyRoutes(app, routes);
};
