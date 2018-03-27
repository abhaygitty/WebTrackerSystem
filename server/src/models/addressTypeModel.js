/**
 * Created by pzheng on 10/05/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  async = require('async'),
  AddressTypeModel = {};

var AddressType = ModelDefiner.define(config.db, "addresstype");

// could not be recognised by nodejs
/*
 Object.defineProperty(UserModel, "users", {
 get: function() {
 return new Promise(function(resolve, reject) {
 var user = new User();
 user.find(function(err, results, fields) {
 if(err) { reject(err); }
 else {
 var users=[];
 helpers.wrapJson(results, fields, users);
 resolve(users);
 }
 });
 });
 }
 });
 */
function getAddressTypes(callback) {
  var JsonData = [];
  var addressType = new AddressType();
  addressType.find(function(error, results, fields) {
    if(error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

async.waterfall([getAddressTypes, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  AddressTypeModel.addressTypes = _.clone(result) || [];
});

AddressTypeModel = {
  addAddressType: function ( data, callback) {
    var self = this;
    // Check in the authentication controller
    // if (this.findByUsername(data.username) !== undefined) {
    // return callback("UserAlreadyExists");
    //}

    /*if ( users && users.length > 500) {
     users = this.users.slice(0, 2);
     }
     */
    var content = {
      addtype: data.addtype || '',
      description: data.description || "",
    };
    var addressType = new AddressType(content);
    addressType.save(function(err, results, db) {
      if (results) {
        content.id = Object.keys(results).map(function (key) { //id returned from db
          return results[key];
        })[0];
      }
      if (content.id) {
        console.log(self.addressTypes);
        Array.prototype.push.call(self.addressTypes, content);
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

  updateAddressType: function(data, callback) {
    var addressType = new AddressType(data);
    addressType.save(callback);
  },

  deleteAddressType: function(data, callback) {
    var addressType = new AddressType(data);
    var err;
    if (this.findById(data.id) !== undefined) {
      addressType.remove();
    } else if (this.findByTypeCode(data.addtype) !== undefined ) {
      addressType.remove({ where: "addtype=" + data.addtype});
    } else {
      err = "Could not find key information to delete addresstype";
    }
    if( callback ) {
      callback(err, data);
    }
  },

  findAll: function () {
    return _.map(this.addressTypes, function (addressType) {
      return _.clone(addressType);
    });
  },

  findById: function (id) {
    return _.clone(_.find(this.addressTypes, function (addressType) {
      return addressType.id === id;
    }));
  },

  findByTypeCode: function (typeCode) {
    return _.clone(_.find(this.addressTypes, function (addressType) {
      return addressType.addtype === typeCode;
    }));
  },
}

module.exports = AddressTypeModel;
