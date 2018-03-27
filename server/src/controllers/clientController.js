/**
 * Created by pzheng on 6/04/2017.
 */
'use strict';
var ClientModel = require('../models/clientModel.js'),
  setClientInfo = require('../helpers').setClientInfo,
  ClientController = {};

ClientController = {
  fetchOne: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var clientId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var foundClient = ClientModel.findById(clientId);
    if (!foundClient) {
      var err = 'No client could be found for this ID.';
      return res.status(400).json({error: err});
      // return next(err);
    }
    var clientToReturn = setClientInfo(foundClient);
    return res.status(200).json(clientToReturn);
  },

  fetchAll: function(req, res, next) {
    var clients = ClientModel.clients;
    return res.status(200).json({clients: clients});
  },

  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    ClientModel.addClientBySQL(data,
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
    // console.log('updateOneBySQL, req.body', req.body);
    var data = req.body;
    ClientModel.updateClientBySQL(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },
};

module.exports = ClientController;
