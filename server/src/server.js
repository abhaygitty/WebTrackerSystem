/**
 * Created by pzheng on 6/02/2017.
 */
/**
 * Created by pzheng on 29/11/2016.
 */
'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

console.log('NODE_ENV = ' + process.env.NODE_ENV);

var express = require('./config/express'),
  passport = require('./config/passport'),
  router = require('./router');


var app = express();
var passport = passport();

// Import routes
router(app);

if ( process.env_NODE_ENV == 'production' ) {
  app.listen(3709);
  console.log('Server running at http://localhost:3709/');
}
else {
  app.listen(3708);
  console.log('Server running at http://localhost:3708/');
}
module.exports = app;
