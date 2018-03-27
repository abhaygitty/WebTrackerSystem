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
  FreqTypeModel = {};

var FreqType = ModelDefiner.define(config.db, "feetypes");

function getFreqTypes(callback) {
  var JsonData = [];
  var freqType = new FreqType();
  freqType.find(function(error, results, fields) {
    if(error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

async.waterfall([getFreqTypes, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  FreqTypeModel.freqTypes = _.clone(result) || [];
});

FreqTypeModel = {
  findAll: function () {
    var self = this;
    return _.map(self.freqTypes, function (freqType) {
      return _.clone(freqType);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.freqTypes, function (freqType) {
      return freqType.id == id;
    }));
  },
}

module.exports = FreqTypeModel;
