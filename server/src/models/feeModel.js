/**
 * Created by pzheng on 19/05/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  userRoles = require('../config/constants').userRoles,
  async = require('async'),
  FeeModel = {};

var Fee = ModelDefiner.define(config.db, "vw_clientfees");

function getFees(callback) {
  var modelInstance = new Fee();
  var sql = " SELECT a.CFEE_ID, a.CIDREF, a.FROMDATE, a.ANNUALFEE, \
      a.FREQTYPE, a.NOTES, a.FREQDESC, a.REVIEWDATE, a.FEECATEGORIES_ID, \
      a.FEECATDESC \
    FROM VW_CLIENTFEES a ";
  modelInstance.query(sql, function(error, results, fields) {
    if (error) {
      callback(error);
    } else {
      // console.log('results', results);
      callback(null, results, fields);
    }
  });
}

// callback function needs to use bind to have statically binding
async.waterfall([getFees, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  if( err ) {
    console.log('error occured', err);
  }
  // console.log('result is:', result);
  FeeModel.fees = _.clone(result) || [];
});


FeeModel = {
  validate: function (fee) {
    if( !validator.isLength(fee.title, {min:1, max:256}) ) {
      throw new Error('Fee title must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.fees, function (fee) {
      return _.clone(fee);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.fees, function (fee) {
      return fee.cfee_id == id; /* == checking value, while === also checking type */
    }));
  },

  filterByClient: function(clientId) {
    var self = this;
    console.log('self.fees', self.fees);
    return _.filter(self.fees, function(fee) {
      return fee.cidref == clientId;
    });
  },

  createOne: function(data, callback) {
    var self = this;
    var fee = new Fee();
    var content = data;
    // var newContent = helpers.setFeeInfo(content);
    // console.log('content', content);
    var sql = " select * from spw_addclientfee(" +
      helpers.parseToFirebirdString(content.cidref, 'number') + "," +
      helpers.parseToFirebirdString(content.fromdate, 'date') + "," +
      helpers.parseToFirebirdString(content.freqtype, 'number') + "," +
      helpers.parseToFirebirdString(content.annualfee, 'number') + "," +
      helpers.parseToFirebirdString(content.notes, 'string') + "," +
      helpers.parseToFirebirdString(content.reviewdate, 'date') + "," +
      helpers.parseToFirebirdString(content.feecategories_id, 'number') + ")";

    console.log('sql', sql);

    fee.query(sql, function(error, results, fields) {
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
          Array.prototype.push.call(self.fees, content);
          console.log('fee content after create', _.filter(self.fees, function(fee) {
            return (fee.cfee_id == content.cfee_id);
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
    var fee = new Fee();
    var newContent = helpers.setFeeInfo(data);
    // console.log('new Content', newContent);
    var sql = " select * from spw_updateclientfee(" +
      helpers.parseToFirebirdString(newContent.cfee_id, 'number') + "," +
      helpers.parseToFirebirdString(newContent.cidref, 'number') + "," +
      helpers.parseToFirebirdString(newContent.fromdate, 'date') + "," +
      helpers.parseToFirebirdString(newContent.freqtype, 'number') + "," +
      helpers.parseToFirebirdString(newContent.annualfee, 'number') + "," +
      helpers.parseToFirebirdString(newContent.notes, 'string') + "," +
      helpers.parseToFirebirdString(newContent.reviewdate, 'date') + "," +
      helpers.parseToFirebirdString(newContent.feecategories_id, 'number') + ")";
    console.log('sql', sql);
    fee.query(sql, function(error, results, fields) {
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
          _.extend(_.findWhere(self.fees, {cfee_id: newContent.cfee_id}), newContent);
          console.log('content after update', _.filter(self.fees, function(fee) {
            return (fee.cidref == newContent.cidref);
          }));
          if (callback) {
            callback(null, newContent);
          }
        }
        else {
          if (callback) {
            var error = { summary: "Error return after executing spw_updateclientfee" };
            callback(error);
          }
        }
      }
    });
  },
  deleteOne: function(data, callback) {
    var self = this;
    var fee = new Fee();
    var newContent = data;
    console.log('content.cfee_id', newContent.cfee_id);
    var sql = " execute procedure spw_deleteclientfee(" +
      helpers.parseToFirebirdString(newContent.cfee_id, 'number') + ")";
    console.log('sql', sql);
    fee.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error', error);
        if (callback) {
          callback(error);
        }
      } else {
        // _.remove(self.fees, function(fee) { return (fee.address_id == newContent.address_id);});
        var fees = self.fees;
        self.fees = _.without(fees, _.findWhere(fees, { cfee_id: newContent.cfee_id}));
        console.log('content after delete', _.filter(self.fees, function(fee) {
          return (fee.address_id == newContent.address_id);
        }));
        if (callback) {
          callback(null, newContent);
        }
      }
    });
  },
}
module.exports = FeeModel;
