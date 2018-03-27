'use strict';
var FeeModel = require('../models/feeModel.js'),
  setFeeInfo = require('../helpers').setFeeInfo,
  FeeController = {};

FeeController = {
  fetchFees: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var clientId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var clientFees = FeeModel.filterByClient(clientId);

    return res.status(200).json(clientFees);
  },

  fetchOne: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var feeId = req.params.id;
    var fee = FeeModel.findById(feeId);
    return res.status(200).json(fee);
  },

  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    FeeModel.createOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        return res.status(200).json(newContent);
      }
    );
  },

  updateOne: function(req, res, next) {
    console.log('req.body', req.body);
    var data = req.body;
    FeeModel.updateOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        return res.status(200).json(newContent);
      }
    );
  },
  deleteOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    FeeModel.deleteOne(data,
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
module.exports = FeeController;
