/**
 * Created by pzheng on 30/11/2016.
 */
"use strict";
var config = require('./config'),
    fb = require('node-firebird'),
    helpers = require('../helpers'),
    fbSchema = {};

fbSchema = {
    /*
    database: function () {
        var connection;
        fb.attach(config.db,
            function(err, db) {
                if(err) {
                    console.log(err.message);
                    connection = null;
                }
                else {
                    connection = db;
                }
            }
        );
        return connection;
    },
    */
    getUsers: function() {
        var jsondata = [];
        fb.attach(config.db,
            function(err, db) {
                if(err) {
                    console.log(err.message);
                    throw new Error(err.message);
                }
                else {
                    var sql = ' SELECT a.id, a.firstname, a.lastname, a.email, a.username, a.userpass, a.provider, a.rolegroup, ' +
                        ' a.salt FROM USERS a';
                    db.query(sql, function (err, results, fields) {
                            console.log("database.query result 'staff'", results);
                            helpers.wrapJson(results, fields, jsondata);
                            db.detach();
                        },
                        logError
                    );
                }

                function logError(err) {
                    console.log(err.message);
                }
            }
        );
        return jsondata;
    }
}

/* Someone suggests to use singleton pattern to implement it,
 * but as far I am concerned, module caching in node automatically handles it
 * */
/*
    var schemaInstance = function() {
        if( global.singletonSchemaInstance === undefined ) {
            global.singletonSchemaInstance = new Schema('firebird', config.db);
        }
        return global.singletonSchemaInstance;
    };

    exports.schemaInstance = schemaInstance();
 */
module.exports = fbSchema;

