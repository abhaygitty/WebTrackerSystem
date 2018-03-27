/**
 * Created by pzheng on 11/05/2017.
 */
'use strict';
var LocationModel = require('../models/locationModel.js'),
  setLocationInfo = require('../helpers').setLocationInfo,
  LocationController = {};

LocationController = {
  fetchLocations: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var clientId = req.params.id;

    var clientLocations = LocationModel.filterByClient(clientId);
    return res.status(200).json({locations:clientLocations});
  },

  fetchOne: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var locationId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var location = LocationModel.findById(locationId);

    return res.status(200).json({location:location});
  },

  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    LocationModel.createOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },

  updateOne: function(req, res, next) {
    console.log('req.body', req.body);
    var data = req.body;
    LocationModel.updateOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },
  deleteOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    LocationModel.deleteOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  }
};

module.exports = LocationController;
