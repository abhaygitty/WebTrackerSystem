/**
 * Created by pzheng on 14/02/2017.
 */
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var migration = require('./db-migration');
var dbsqls = require('./dbsql');

var buildSQLs = dbsqls.buildAll() || [];
migration.run(buildSQLs, function(err) {
  console.log(process.env.NODE_ENV);
  if(err) {
    console.log(err);
  }
  process.exit(0);
});


