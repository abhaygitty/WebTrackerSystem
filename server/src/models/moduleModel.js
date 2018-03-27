'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  async = require('async'),
  ModuleModel = {};

var Module = ModelDefiner.define(config.db, "vw_clientmodules");

function getModules(callback) {
  var modelInstance = new Module();
  var sql = "SELECT a.ID, a.CIDREF, a.MID, a.MDESC FROM VW_CLIENTMODULES a;";
  modelInstance.query(sql, function(error, results, fields) {
    if (error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

function getClientModules(clientId, callback) {
  var modelInstance = new Module();
  var sql = "SELECT a.ID, a.CIDREF, a.MID, a.MDESC FROM VW_CLIENTMODULES a where a.CIDREF=" + clientId;
  modelInstance.query(sql, function(error, results, fields) {
    if (error) {
      if(callback) {
        callback(error)
      }
    } else {
      if (callback) {
        callback(null, results, fields);
      }
    }
  });
}

// callback function needs to use bind to have statically binding
async.waterfall([getModules, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  ModuleModel.modules = _.clone(result) || [];
});

ModuleModel = {
  validate: function (module) {
    if( !validator.isLength(module.mdesc, {min:1, max:256}) ) {
      throw new Error('Module title must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.modules, function (module) {
      return _.clone(module);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.modules, function (module) {
      return module.module_id == id; /* == checking value, while === also checking type */
    }));
  },

  filterByClient: function(clientId) {
    var self = this;
    return _.filter(self.modules, function(module) {
      return module.cidref == clientId;
    });
  },

  updateModules: function(clientId, data, callback) {
    var module = new Module();
    console.log('client, data', clientId, data);
    var newContent = data || [];

    console.log('newContent', newContent);
    var midString = _.map(newContent, function(m) { return m.mid }).toString();

    var sql = " select * from spw_updateclientmodule(" + clientId + ",'" +
      midString + "')";

    // console.log('sql', sql);
    module.query(sql, function(error, results, fields) {
      if (error) {
        if(callback) {
          callback(error);
        }
      } else {
        async.waterfall([
          function(callback) {
            callback(null, clientId);
          },
          getClientModules,
          helpers.extendWrapJson.bind(helpers)],
          function(err, result) {
            var theResult = _.clone(result) || [];
            if (err) {
              if (callback) {
                callback(err, theResult);
              }
            }
            else {
              // refresh all
              async.waterfall([getModules, helpers.extendWrapJson.bind(helpers)], function(err, allResult) {
                ModuleModel.modules = _.clone(allResult) || [];
              });
              if (callback) {
                callback(null, theResult);
              }
            }
          }
        );
      }
    });
  },

  createOne: function(data, callback) {
    var self = this;
    var module = new Module();
    var content = helpers.setModuleInfo(data);
    // console.log('content', content);
    var sql = " select * from spw_addclientmodule(" +
      helpers.parseToFirebirdString(content.cid, 'number') + "," +
      helpers.parseToFirebirdString(content.primarymodule, 'number') + "," +
      helpers.parseToFirebirdString(content.salutation, 'string') + "," +
      helpers.parseToFirebirdString(content.givenname, 'string') + "," +
      helpers.parseToFirebirdString(content.surname, 'string') + "," +
      helpers.parseToFirebirdString(content.jobdescription, 'string') + "," +
      helpers.parseToFirebirdString(content.phone, 'string') + "," +
      helpers.parseToFirebirdString(content.fax, 'string') + "," +
      helpers.parseToFirebirdString(content.mobile, 'string') + "," +
      helpers.parseToFirebirdString(content.email, 'string') + "," +
      helpers.parseToFirebirdString(content.notes, 'string') + ")";

    // console.log('sql', sql);

    module.query(sql, function(error, results, fields) {
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
          Array.prototype.push.call(self.modules, content);
          console.log('module content after create', _.filter(self.modules, function(module) {
            return (module.module_id == content.module_id);
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
    var module = new Module();
    var newContent = helpers.setModuleInfo(data);

    console.log('newContent', newContent);
    var sql = " select * from spw_updateclientmodule(" +
      helpers.parseToFirebirdString(newContent.module_id, 'number') + "," +
      helpers.parseToFirebirdString(newContent.primarymodule, 'number') + "," +
      helpers.parseToFirebirdString(newContent.salutation, 'string') + "," +
      helpers.parseToFirebirdString(newContent.givenname, 'string') + "," +
      helpers.parseToFirebirdString(newContent.surname, 'string') + "," +
      helpers.parseToFirebirdString(newContent.jobdescription, 'string') + "," +
      helpers.parseToFirebirdString(newContent.phone, 'string') + "," +
      helpers.parseToFirebirdString(newContent.fax, 'string') + "," +
      helpers.parseToFirebirdString(newContent.mobile, 'string') + "," +
      helpers.parseToFirebirdString(newContent.email, 'string') + "," +
      helpers.parseToFirebirdString(newContent.notes, 'string') + ")";
    // console.log('sql', sql);
    module.query(sql, function(error, results, fields) {
      if (error) {
        if (callback) {
          callback(error);
        }
      } else {
        // callback(null, results, fields);
        // console.log('results', results);

        if (results) { // id == 0, failed
          var theArray = helpers.wrapJson(results, fields);
          var newProperties = theArray[0];
          _.extend(newContent, newProperties);
          _.extend(_.findWhere(self.modules, {module_id: newContent.module_id}), newContent);
          console.log('content after update', _.filter(self.modules, function(module) {
            return (module.module_id == newContent.module_id);
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
    var module = new Module();
    var newContent = data;
    console.log('content.module_id', newContent.module_id);
    var sql = " execute procedure spw_deletemodule(" +
      helpers.parseToFirebirdString(newContent.module_id, 'number') + ")";
    console.log('sql', sql);
    module.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error', error);
        if (callback) {
          callback(error);
        }
      } else {
        // _.remove(self.modules, function(module) { return (module.module_id == newContent.module_id);});
        var modules = self.modules;
        self.modules = _.without(modules, _.findWhere(modules, { module_id: newContent.module_id}));
        console.log('content after delete', _.filter(self.modules, function(module) {
          return (module.module_id == newContent.module_id);
        }));
        if (callback) {
          callback(null, newContent);
        }
      }
    });
  },

}

module.exports = ModuleModel;
