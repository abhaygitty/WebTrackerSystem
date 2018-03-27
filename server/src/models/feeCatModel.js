/**
 * Created by pzheng on 19/05/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  async = require('async'),
  FeeCatModel = {};

var FeeCat = ModelDefiner.define(config.db, "feecategories");

function getFeeCats(callback) {
  var JsonData = [];
  var feeCat = new FeeCat();
  feeCat.find(function(error, results, fields) {
    if(error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

async.waterfall([getFeeCats, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  FeeCatModel.feeCats = _.clone(result) || [];
});

FeeCatModel = {
  addFeeCat: function ( data, callback) {
    var self = this;
    var content = {
      addtype: data.addtype || '',
      description: data.description || "",
    };
    var feeCat = new FeeCat(content);
    feeCat.save(function(err, results, db) {
      if (results) {
        content.id = Object.keys(results).map(function (key) { //id returned from db
          return results[key];
        })[0];
      }
      if (content.id) {
        console.log(self.feeCats);
        Array.prototype.push.call(self.feeCats, content);
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

  updateFeeCat: function(data, callback) {
    var feeCat = new FeeCat(data);
    feeCat.save(callback);
  },

  deleteFeeCat: function(data, callback) {
    var feeCat = new FeeCat(data);
    var err;
    if (this.findById(data.id) !== undefined) {
      feeCat.remove();
    } else if (this.findByTypeCode(data.addtype) !== undefined ) {
      feeCat.remove({ where: "addtype=" + data.addtype});
    } else {
      err = "Could not find key information to delete feetype";
    }
    if( callback ) {
      callback(err, data);
    }
  },

  findAll: function () {
    return _.map(this.feeCats, function (feeCat) {
      return _.clone(feeCat);
    });
  },

  findById: function (id) {
    return _.clone(_.find(this.feeCats, function (feeCat) {
      return feeCat.id == id;
    }));
  },
}

module.exports = FeeCatModel;
