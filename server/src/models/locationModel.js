/**
 * Created by pzheng on 11/05/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  userRoles = require('../config/constants').userRoles,
  async = require('async'),
  LocationModel = {};

var Location = ModelDefiner.define(config.db, "vw_addresses");

function getLocations(callback) {
  var modelInstance = new Location();
  var sql = "SELECT a.ADDRESS_ID, a.TITLE, a.CIDREF, a.TYPEREF, a.ADDRESSTYPE, \
            a.TYPE_INST, a.ADDRESS1, a.ADDRESS2, \
            a.STARTDATE, a.NOTES, a.SUBURB, a.STATE, a.POSTCODE \
            FROM VW_ADDRESSES a where a.TYPE_INST > 0";
  modelInstance.query(sql, function(error, results, fields) {
    if (error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

// callback function needs to use bind to have statically binding
async.waterfall([getLocations, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  LocationModel.locations = _.clone(result) || [];
});


LocationModel = {
  validate: function (location) {
    if( !validator.isLength(location.title, {min:1, max:256}) ) {
      throw new Error('Location title must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.locations, function (location) {
      return _.clone(location);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.locations, function (location) {
      return location.address_id == id; /* == checking value, while === also checking type */
    }));
  },

  filterByClient: function(clientId) {
    var self = this;
    return _.filter(self.locations, function(location) {
      return location.cidref == clientId;
    });
  },

  createOne: function(data, callback) {
    var self = this;
    var location = new Location();
    var content = data;
    var newContent = helpers.setLocationInfo(content);
    // console.log('content', content);
    var sql = " select * from spw_addclientaddress(" +
      helpers.parseToFirebirdString(content.cidref, 'number') + "," +
      helpers.parseToFirebirdString(content.title, 'string') + "," +
      helpers.parseToFirebirdString(content.typeref, 'string') + "," +
      helpers.parseToFirebirdString(content.address1, 'string') + "," +
      helpers.parseToFirebirdString(content.address2, 'string') + "," +
      helpers.parseToFirebirdString(content.state, 'string') + "," +
      helpers.parseToFirebirdString(content.suburb, 'string') + "," +
      helpers.parseToFirebirdString(content.postcode, 'string') + "," +
      helpers.parseToFirebirdString(content.notes, 'string') + "," +
      helpers.parseToFirebirdString(content.number_of_units, 'number') + ")";

    console.log('sql', sql);

    location.query(sql, function(error, results, fields) {
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
          Array.prototype.push.call(self.locations, content);
          console.log('address content after create', _.filter(self.locations, function(location) {
            return (location.address_id == content.address_id);
          }));
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

  updateOne: function(data, callback) {
    var self = this;
    var location = new Location();
    var newContent = helpers.setLocationInfo(data);
    // console.log('new Content', newContent);
    var sql = " select * from spw_updateclientaddress(" +
      helpers.parseToFirebirdString(newContent.address_id, 'number') + "," +
      helpers.parseToFirebirdString(newContent.title, 'string') + "," +
      helpers.parseToFirebirdString(newContent.cidref, 'number') + "," +
      helpers.parseToFirebirdString(newContent.typeref, 'string') + "," +
      helpers.parseToFirebirdString(newContent.address1, 'string') + "," +
      helpers.parseToFirebirdString(newContent.address2, 'string') + "," +
      helpers.parseToFirebirdString(newContent.state, 'string') + "," +
      helpers.parseToFirebirdString(newContent.suburb, 'string') + "," +
      helpers.parseToFirebirdString(newContent.postcode, 'string') + "," +
      helpers.parseToFirebirdString(newContent.notes, 'string') + "," +
      helpers.parseToFirebirdString(newContent.number_of_units, 'number') + ")";
    console.log('sql', sql);
    location.query(sql, function(error, results, fields) {
      if (error) {
        if (callback) {
          callback(error);
        }
      } else {
        // callback(null, results, fields);
        if (results) { // id == 0, failed
          var theArray = helpers.wrapJson(results, fields);
          var newProperties = theArray[0];
          if(newProperties) {
            _.extend(newContent, newProperties);
          }
          _.extend(_.findWhere(self.locations, {address_id: newContent.address_id}), newContent);
          console.log('content after update', _.filter(self.locations, function(location) {
            return (location.cidref == newContent.cidref);
          }));
          if (callback) {
            callback(null, newContent);
          }
        }
        else {
          if (callback) {
            var error = { summary: "Error return after executing spw_updateclientaddress" };
            callback(error);
          }
        }
      }
    });
  },
  deleteOne: function(data, callback) {
    var self = this;
    var location = new Location();
    var newContent = data;
    console.log('content.address_id', newContent.address_id);
    var sql = " execute procedure spw_deleteclientaddress(" +
      helpers.parseToFirebirdString(newContent.address_id, 'number') + ")";
    console.log('sql', sql);
    location.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error', error);
        if (callback) {
          callback(error);
        }
      } else {
        // _.remove(self.locations, function(location) { return (location.address_id == newContent.address_id);});
        var locations = self.locations;
        self.locations = _.without(locations, _.findWhere(locations, { address_id: newContent.address_id}));
        console.log('content after delete', _.filter(self.locations, function(location) {
          return (location.address_id == newContent.address_id);
        }));
        if (callback) {
          callback(null, newContent);
        }
      }
    });
  },

}

module.exports = LocationModel;
