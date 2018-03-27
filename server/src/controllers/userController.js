/**
 * Created by pzheng on 6/04/2017.
 */
'use strict';
var UserModel = require('../models/userModel.js'),
  setUserInfo = require('../helpers').setUserInfo,
  UserController = {};

UserController = {
  viewProfile: function(req, res, next) {
    var userId = req.params.userId;
    if( req.user.id.toString() !== userId) {
      return res.status(401).json({error: 'You are not authorized to view this user profile.'});
    }

    var foundUser = UserModel.findById(userId);
    if(!foundUser) {
      var err = 'No user could be found for this ID.';
      res.status(400).json({error: err});
      return next(err);
    }

    var userToReturn = setUserInfo(foundUser);

    return res.status(200).json({user: userToReturn});

  }
};

module.exports = UserController;
