/**
 * Created by pzheng on 8/06/2017.
 */
'use strict';
var EdiModel = require('../models/ediModel.js'),
  setEdiInfo = require('../helpers').setEdiInfo,
  EdiController = {};

EdiController = {
  fetchEdis: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var clientId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var clientEdis = EdiModel.filterByClient(clientId);

    return res.status(200).json(clientEdis);
  },

  fetchOne: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var ediId = req.params.id;
    var edi = EdiModel.findById(ediId);
    return res.status(200).json(edi);
  },

  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    EdiModel.createOne(data,
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
    EdiModel.updateOne(data,
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
    EdiModel.deleteOne(data,
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
module.exports = EdiController;
