'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  async = require('async'),
  ModuleTypeModel = {};

var ModuleType = ModelDefiner.define(config.db, "vw_aimmodules");

function getModuleTypes(callback) {
  var JsonData = [];
  var moduleType = new ModuleType();
  moduleType.find(function(error, results, fields) {
    if(error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

async.waterfall([getModuleTypes, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  ModuleTypeModel.moduleTypes = _.clone(result) || [];
});

ModuleTypeModel = {
  createOne: function (data, callback) { // to be fixed
    var self = this;
    var content = {
      code: data.code || '',
      description: data.description || "",
      available: data.available || "1"
    };
    var moduleType = new ModuleType(content);
    moduleType.save(function(err, results, db) {
      if (results) {
        content.module = Object.keys(results).map(function (key) { //id returned from db
          return results[key];
        })[0];
      }
      if (content.id) {
        console.log(self.moduleTypes);
        Array.prototype.push.call(self.moduleTypes, content);
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

  updateOne: function(data, callback) {
    var moduleType = new ModuleType(data);
    moduleType.save(callback);
  },

  deleteOne: function(data, callback) {
    var self = this;
    var moduleType = new ModuleType(data);
    var err;
    if (self.findById(data.id) !== undefined) {
      moduleType.remove();
    } else if (self.findByTypeCode(data.addtype) !== undefined ) {
      moduleType.remove({ where: "addtype=" + data.addtype});
    } else {
      err = "Could not find key information to delete moduletype";
    }
    if( callback ) {
      callback(err, data);
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.moduleTypes, function (moduleType) {
      return _.clone(moduleType);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.moduleTypes, function (moduleType) {
      return moduleType.id == id;
    }));
  },

  findByTypeCode: function (typeCode) {
    var self = this;
    return _.clone(_.find(self.moduleTypes, function (moduleType) {
      return moduleType.addtype === typeCode;
    }));
  },
}

module.exports = ModuleTypeModel;
