/**
 * Created by pzheng on 14/02/2017.
 */
'use strict';
var async = require('async');
var options = require('../config/config').db;
var Firebird = require('node-firebird');
var _= require('underscore');

var dbaOptions = _.clone(options);
dbaOptions.user = "aimdba";
dbaOptions.password = "98seXPWin7";

module.exports = {
  // adding/deleting objects to database
  run: function (SQLs, callback) { // SQLs should be [string, string ....]
    // Connect or Create a database
    var upFunctions = [
      function(callback) {
        Firebird.attachOrCreate(dbaOptions, function(err) {
          if(callback) { callback(err);}
        });
      },
    ];
    // Create jobs in the array
    if( SQLs instanceof Array ) {
      SQLs.forEach(function(sql) {
        upFunctions.push(
          function(callback) {
            Firebird.attach(dbaOptions, function(err, db) {
              if(err) {
                throw err;
              }
              db.query(sql, function (err, result) {
                db.detach();
                if(callback) {
                  callback(err);
                }
              });
            });
          }
        );
      });
    }
    //Run them all one by one
    async.series(
      upFunctions,
      function(err, results) {
        if(callback) {
          callback(err);
        }
      }
    );
  },
};
