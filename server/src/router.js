/**
 * Created by pzheng on 13/02/2017.
 */
'use strict';
var AuthenticationController = require("./controllers/authenticationController.js");
var UserController = require("./controllers/userController.js");
// TO-DO ChatController, CommunicationController, StripeController

var path = require('path'),
    express = require('express'),
    passport = require('passport'),
    authRoutes = require('./routes/authenticationRoute.js'),
    userRoutes = require('./routes/userRoute.js'),
    apiRoutes = require('./routes/apiRoute.js');

var passportService = require('./config/passport'); // Provide passport strategies

module.exports = function(app) {
  // Initialising route groups
  var rootRouter = express.Router(),
      authRouter = express.Router(),
      userRouter = express.Router(),
      apiRouter = express.Router();
      // TO-DO
      //chatRouter = express.Router(),
      //payRouter = express.Router(),
      //communitionRouter = express.Router();
  //= ==========================
  // API Routes
  //= ==========================
  rootRouter.use('/api', apiRouter);
  apiRoutes.applyApiRoutesAt(apiRouter);

  //= ==========================
  // Auth Routes
  //= ==========================

  // Set auth routes as subgroup/middleware to apiRoutes
  rootRouter.use('/auth', authRouter);
  authRoutes.applyAuthRoutesAt(authRouter);

  //= ==========================
  // User Routes
  //= ==========================
  rootRouter.use('/user', userRouter);
  userRoutes.applyUserRoutesAt(userRouter);

  //= ===========================
  // TO-DO: Chat Routes
  //= ===========================

  //= ===========================
  // TO-DO: Payment Routes
  //= ===========================

  //= ===========================
  // TO-DO: Communication Routes
  //= ===========================

  // Set url for root/API group routes
  app.use('/', rootRouter);

  app.get('/*', function(req, res) {
  // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendFile(path.resolve(__dirname, '../static/index.html'));
  });

  if (process.env.ENV_NODE === 'developement'){
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        error: err,
        message: err.message
      });
    });
  }

// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    next(err);
  });

// production error handler
// no stacktrace leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      error: {},
      message: err.message
    });
  });

};
