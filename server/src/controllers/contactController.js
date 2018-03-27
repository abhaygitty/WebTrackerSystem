'use strict';
var ContactModel = require('../models/contactModel.js'),
  setContactInfo = require('../helpers').setContactInfo,
  ContactController = {};

ContactController = {
  fetchContacts: function(req, res, next) {
    // console.log('req.params.id', req.params.id);
    var clientId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var clientContacts = ContactModel.filterByClient(clientId);

    return res.status(200).json({contacts:clientContacts});
  },

  fetchOne: function(req, res, next) {
    console.log('req.params.id', req.params.id);
    var contactId = req.params.id;

    // var allClients = ClientModel.findAll();
    // console.log('allClients', allClients);
    var contact = ContactModel.findById(contactId);

    console.log('contact', contact);
    return res.status(200).json({contact:contact});
  },

  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    ContactModel.createOne(data,
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
    ContactModel.updateOne(data,
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
    console.log('req.body', req.body);
    var data = req.body;
    ContactModel.deleteOne(data,
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

module.exports = ContactController;
