/**
 * Created by pzheng on 6/04/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  userRoles = require('../config/constants').userRoles,
  async = require('async'),
  ClientModel = {};

var Client = ModelDefiner.define(config.db, "clients"); //spw_clients

function getClients(callback) {
  var ModelInstance = new Client();
  var sql = "select * from spw_clients";
  ModelInstance.query(sql, function(error, results, fields) {
    if (error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

async.waterfall([getClients, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('async.waterfall, client result', result);
  ClientModel.clients = _.clone(result) || [];
});

ClientModel = {
  addClient: function (data, callback) {
    var self = this;

    // console.log('data to be added', data)
    var content = data;
    var client = new Client(content);
    client.save(function(err, results, db) {
      if (results) {
        content.id = Object.keys(results).map(function (key) { //id returned from db
          return results[key];
        })[0];
      }
      if (content.id) {
        // console.log(self.clients);
        Array.prototype.push.call(self.clients, content);
        if (callback) {
          callback(null, content);
        }
      }
      else {
        err = "Fail to get valid id from database";
        if(callback) {
          callback(err, content);
        }
      }
      db.detach();
    });
  },
  addClientBySQL: function(data, callback) {
    var self = this;
    var client = new Client();
    var content = data;
    var sql = " select * from spw_addclient(" +
      helpers.parseToFirebirdString(content.name, 'string') + "," +
      helpers.parseToFirebirdString(content.contract_expires, 'date') + "," +
      helpers.parseToFirebirdString(content.prepaidminutes, 'decimal') + "," +
      helpers.parseToFirebirdString(content.last_allocation_rollover, 'date') + "," +
      helpers.parseToFirebirdString(content.email, 'string') + "," +
      helpers.parseToFirebirdString(content.implementation_fee, 'decimal') + "," +
      helpers.parseToFirebirdString(content.reviewdate, 'date') + "," +
      helpers.parseToFirebirdString(content.viewed, 'boolean') + "," +
      helpers.parseToFirebirdString(content.reminder_message, 'string') + "," +
      helpers.parseToFirebirdString(content.reminddate, 'date') + "," +
      helpers.parseToFirebirdString(content.status, 'boolean') + ")";

     // console.log('sql', sql);

    client.query(sql, function(error, results, fields) {
      var newProperties = {};
      if (error) {
        callback(error);
      } else {
        // callback(null, results, fields);
        // console.log('results', results);
        if (results) {
          /*newContentPart = Object.keys(results).map(function (key) { //id returned from db
           return results[key];
           })[0];
           */
          var theArray = helpers.wrapJson(results, fields);
          var newProperties = theArray[0];
        }
        // console.log('newProperties', newProperties);
        if (newProperties) {
          _.extend(content, newProperties);
          Array.prototype.push.call(self.clients, content);
          //console.log('client content after create', _.filter(self.clients, function(client) {
          //  return (client.client_id == content.client_id);
          // }));
          if (callback) {
            callback(null, content);
          }
        } else {
          error = "Fail to get valid id from database";
          if (callback) {
            callback(error, content);
          }
        }
      }
    });
  },

  updateClient: function(data, callback) {
    var client = new Client(data);
    client.save(callback);
  },

  deleteClient: function(data, callback) {
    var client = new Client(data);
    var err;
    if (this.findById(data.id) !== undefined) {
      client.remove();
    } else if (this.findByClientname(data.name) !== undefined ) {
      client.remove({ where: "name=" + data.name});
    } else {
      err = "Could not find key information to delete client";
    }
    if( callback ) {
      callback(err, data);
    }
  },

  updateClientBySQL: function(data, callback) {
    var self = this;
    var client = new Client();
    var newContent = data;
    var sql = " select id from spw_updateclient(" +
      helpers.parseToFirebirdString(newContent.client_id, 'number') + "," +
      helpers.parseToFirebirdString(newContent.name, 'string') + "," +
      helpers.parseToFirebirdString(newContent.contract_expires, 'date') + "," +
      helpers.parseToFirebirdString(newContent.prepaidminutes, 'decimal') + "," +
      helpers.parseToFirebirdString(newContent.last_allocation_rollover, 'date') + "," +
      helpers.parseToFirebirdString(newContent.email, 'string') + "," +
      helpers.parseToFirebirdString(newContent.implementation_fee, 'decimal') + "," +
      helpers.parseToFirebirdString(newContent.reviewdate, 'date') + "," +
      helpers.parseToFirebirdString(newContent.viewed, 'boolean') + "," +
      helpers.parseToFirebirdString(newContent.reminder_message, 'string') + "," +
      helpers.parseToFirebirdString(newContent.reminddate, 'date') + "," +
      helpers.parseToFirebirdString(newContent.status, 'boolean') + ")";
    // console.log('sql', sql);
    client.query(sql, function(error, results, fields) {
      if (error) {
        if (callback) {
          callback(error);
        }
      } else {
        // callback(null, results, fields);
        if (results) { // id == 0, failed
          _.extend(_.findWhere(self.clients, {client_id: newContent.client_id}), newContent);
          // console.log('content after update', _.filter(self.clients, function(client) {
          //  return (client.client_id == newContent.client_id);
          // }));
          if (callback) {
            callback(null, newContent);
          }
        }
        else {
          if (callback) {
            var error = { summary: "Error return after executing spw_udpateclient" };
            callback(error);
          }
        }
      }
    });
  },

  findByProviderId: function (provider, id) {
    var self = this;
    return _.find(self.clients, function (client) {
      return client[provider] == id;
    });
  },

  validate: function (client) {
    if( !validator.isLength(client.name, {min:1, max:256}) ) {
      throw new Error('Clientname must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.clients, function (client) {
      return _.clone(client);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.clients, function (client) {
      return client.client_id == id; /* == checking value, while === also checking type */
    }));
  },

  findByClientname: function (clientname) {
    var self = this;
    return _.clone(_.find(self.clients, function (client) {
      return client.name == clientname;
    }));
  }
}

module.exports = ClientModel;
