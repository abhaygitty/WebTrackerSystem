/**
 * Created by pzheng on 29/11/2016.
 */
'use strict';
var config = require('./config'),
    express = require('express'),
    logger = require('morgan'), /* Simple logger */
    compress = require('compression'), /* response compression */
    bodyParser = require('body-parser'), /* handle request data */
    methodOverride = require('method-override'), /* provides DELETE and put HTTP verbs legacy support */
    passport = require('passport'),
    path = require('path'),
    cors = require('cors');

module.exports = function() {
    var app = express();

    if( process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
        app.use(cors());
    } else if(process.env.NODE_ENV === 'production') {
        app.use(compress());
    }
    // parse application/x-www-form-urlencoded
    // for easier testing with Postman or plain HTML forms
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // parse application/json
    app.use(bodyParser.json());
    app.use(methodOverride());

    /* Folder deprecated */
    // app.set('views', express.static(path.join(__dirname, '../views'))); /* configure express app views folder */
    // app.set('view engine', 'ejs');   /* configure server template engine */
    // app.set('view options', { layout: false} );

    app.use(passport.initialize());

    // configure static file folder which may contain image etc
    // __dirname represents the folder this file located

    app.use(express.static(path.join(__dirname, '../../static/')));
    app.use(express.static(path.join(__dirname, '../../../client/dist/')));

    //require('../server/routes/users.server.routes')(app);

    //this line should go to the last in router, since it has covering-all routing
    //Reference: http://stackoverflow.com/questions/14125997/difference-between-app-all-and-app-use
    //require('../server/routes/Clients.js')(app);

    //This is embeded in Clients.js
    //app.all("/*", function(req,res) {
        //Use res.sendfile, as it streams instead of reading the file into memory.
        //res.sendFile(path.join(__dirname, '../public/index.html'));
    //});

    return app;
};
