/**
 * Created by pzheng on 8/06/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  userRoles = require('../config/constants').userRoles,
  async = require('async'),
  EdiModel = {};

var Edi = ModelDefiner.define(config.db, "clientedi");

function getEdis(callback) {
  var modelInstance = new Edi();
  var sql = " SELECT a.CIDREF, a.EDINUMBER, a.SERVICE, a.EDISTRING \
            FROM VW_CLIENTEDI a ";
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
async.waterfall([getEdis, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  if( err ) {
    console.log('error occured', err);
  }
  // console.log('result is:', result);
  EdiModel.edis = _.clone(result) || [];
});


EdiModel = {
  validate: function (edi) {
    if( !validator.isLength(edi.title, {min:1, max:256}) ) {
      throw new Error('Edi title must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.edis, function (edi) {
      return _.clone(edi);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.edis, function (edi) {
      return edi.edinumber == id; /* == checking value, while === also checking type */
    }));
  },

  filterByClient: function(clientId) {
    var self = this;
    console.log('self.edis', self.edis);
    return _.filter(self.edis, function(edi) {
      return edi.cidref == clientId;
    });
  },

  createOne: function(data, callback) {
    var self = this;
    var edi = new Edi();
    var content = data;
    // var newContent = helpers.setEdiInfo(content);
    // console.log('content', content);
    var sql = " select * from spw_addclientedi(" +
      helpers.parseToFirebirdString(content.cidref, 'number') + "," +
      helpers.parseToFirebirdString(content.edinumber, 'number') + "," +
      helpers.parseToFirebirdString(content.service, 'string') + "," +
      helpers.parseToFirebirdString(content.edistring, 'string') + ")";

    console.log('sql', sql);

    edi.query(sql, function(error, results, fields) {
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
          Array.prototype.push.call(self.edis, content);
          console.log('edi content after create', _.filter(self.edis, function(edi) {
            return (edi.edinumber == content.edinumber);
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
    var edi = new Edi();
    var newContent = helpers.setEdiInfo(data);
    // console.log('new Content', newContent);
    var sql = " select * from spw_updateclientedi(" +
      helpers.parseToFirebirdString(newContent.edinumber, 'number') + "," +
      helpers.parseToFirebirdString(newContent.service, 'string') + "," +
      helpers.parseToFirebirdString(newContent.edistring, 'string') + ")";
    console.log('sql', sql);
    edi.query(sql, function(error, results, fields) {
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
          _.extend(_.findWhere(self.edis, {edinumber: newContent.edinumber}), newContent);
          console.log('content after update', _.filter(self.edis, function(edi) {
            return (edi.cidref == newContent.cidref);
          }));
          if (callback) {
            callback(null, newContent);
          }
        }
        else {
          if (callback) {
            var error = { summary: "Error return after executing spw_updateclientedi" };
            callback(error);
          }
        }
      }
    });
  },
  deleteOne: function(data, callback) {
    var self = this;
    var edi = new Edi();
    var newContent = data;
    console.log('content.edinumber', newContent.edinumber);
    var sql = " execute procedure spw_deleteclientedi(" +
      helpers.parseToFirebirdString(newContent.edinumber, 'number') + ")";
    console.log('sql', sql);
    edi.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error', error);
        if (callback) {
          callback(error);
        }
      } else {
        // _.remove(self.edis, function(edi) { return (edi.address_id == newContent.address_id);});
        var edis = self.edis;
        self.edis = _.without(edis, _.findWhere(edis, { edinumber: newContent.edinumber}));
        console.log('content after delete', _.filter(self.edis, function(edi) {
          return (edi.edinumber == newContent.edinumber);
        }));
        if (callback) {
          callback(null, newContent);
        }
      }
    });
  },
}
module.exports = EdiModel;
