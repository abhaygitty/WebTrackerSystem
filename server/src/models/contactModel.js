/**
 * Created by pzheng on 12/05/2017.
 */
'use strict';
var ModelDefiner = require('../firebirdModelDefiner.js'),
  config = require('../config/config.js'),
  helpers = require('../helpers'),
  _ = require('underscore'),
  validator = require('validator'),
  userRoles = require('../config/constants').userRoles,
  async = require('async'),
  ContactModel = {};

var Contact = ModelDefiner.define(config.db, "vw_contacts");

function getContacts(callback) {
  var modelInstance = new Contact();
  var sql = "SELECT a.CONTACT_ID, a.CID, a.PRIMARYCONTACT, a.SALUTATION, a.GIVENNAME, \
    a.SURNAME, a.PHONE, a.EMAIL, a.FAX, a.JOBDESCRIPTION, a.NOTES, a.MOBILE, a.IDENTITY \
    FROM VW_CONTACTS a";
  modelInstance.query(sql, function(error, results, fields) {
    if (error) {
      callback(error);
    } else {
      callback(null, results, fields);
    }
  });
}

// callback function needs to use bind to have statically binding
async.waterfall([getContacts, helpers.extendWrapJson.bind(helpers)], function(err, result) {
  // console.log('result is:', result);
  ContactModel.contacts = _.clone(result) || [];
});


ContactModel = {
  validate: function (contact) {
    if( !validator.isLength(contact.jobdescription, {min:1, max:256}) ) {
      throw new Error('Contact title must be 1-256 characters long');
    }
  },

  findAll: function () {
    var self = this;
    return _.map(self.contacts, function (contact) {
      return _.clone(contact);
    });
  },

  findById: function (id) {
    var self = this;
    return _.clone(_.find(self.contacts, function (contact) {
      return contact.contact_id == id; /* == checking value, while === also checking type */
    }));
  },

  filterByClient: function(clientId) {
    var self = this;
    // console.log('self.contacts', self.contacts);
    return _.filter(self.contacts, function(contact) {
      return contact.cid == clientId;
    });
  },

  createOne: function(data, callback) {
    var self = this;
    var contact = new Contact();
    var content = helpers.setContactInfo(data);
    // console.log('content', content);
    var sql = " select * from spw_addclientcontact(" +
      helpers.parseToFirebirdString(content.cid, 'number') + "," +
      helpers.parseToFirebirdString(content.primarycontact, 'number') + "," +
      helpers.parseToFirebirdString(content.salutation, 'string') + "," +
      helpers.parseToFirebirdString(content.givenname, 'string') + "," +
      helpers.parseToFirebirdString(content.surname, 'string') + "," +
      helpers.parseToFirebirdString(content.jobdescription, 'string') + "," +
      helpers.parseToFirebirdString(content.phone, 'string') + "," +
      helpers.parseToFirebirdString(content.fax, 'string') + "," +
      helpers.parseToFirebirdString(content.mobile, 'string') + "," +
      helpers.parseToFirebirdString(content.email, 'string') + "," +
      helpers.parseToFirebirdString(content.notes, 'string') + ")";

    console.log('sql', sql);

    contact.query(sql, function(error, results, fields) {
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
          Array.prototype.push.call(self.contacts, content);
          console.log('contact content after create', _.filter(self.contacts, function(contact) {
            return (contact.contact_id == content.contact_id);
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
    var contact = new Contact();
    var newContent = helpers.setContactInfo(data);

    console.log('newContent', newContent);
    var sql = " select * from spw_updateclientcontact(" +
      helpers.parseToFirebirdString(newContent.contact_id, 'number') + "," +
      helpers.parseToFirebirdString(newContent.primarycontact, 'number') + "," +
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
    contact.query(sql, function(error, results, fields) {
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
          _.extend(_.findWhere(self.contacts, {contact_id: newContent.contact_id}), newContent);
          console.log('content after update', _.filter(self.contacts, function(contact) {
            return (contact.contact_id == newContent.contact_id);
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
    var contact = new Contact();
    var newContent = data;
    // console.log('content.contact_id', newContent.contact_id);
    var sql = " execute procedure spw_deletecontact(" +
      helpers.parseToFirebirdString(newContent.contact_id, 'number') + ")";
    console.log('sql', sql);
    contact.query(sql, function(error, results, fields) {
      if (error) {
        console.log('error', error);
        if (callback) {
          callback(error);
        }
      } else {
        // _.remove(self.contacts, function(contact) { return (contact.contact_id == newContent.contact_id);});
        var contacts = self.contacts;
        self.contacts = _.without(contacts, _.findWhere(contacts, { contact_id: newContent.contact_id}));
        console.log('content after delete', _.filter(self.contacts, function(contact) {
          return (contact.contact_id == newContent.contact_id);
        }));
        if (callback) {
          callback(null, newContent);
        }
      }
    });
  },

}

module.exports = ContactModel;
