/**
 * Created by pzheng on 6/04/2017.
 */
'use strict';
var jwt = require('jsonwebtoken'),
  crypto = require('crypto'),
  UserModel = require('../models/userModel.js'),
  mailgun = require('../config/mailgun'),
  setUserInfo = require('../helpers').setUserInfo,
  getRole = require('../helpers').getRole,
  config = require('../config/config'),
  constants = require('../config/constants'),
  validator = require('validator');

// Generate JWT
// TO-DO add issuer and audience
function generateToken(payload) {
  return jwt.sign(payload, config.tokenSecret, {
    expiresIn: config.tokenTime
  });
}

// validate sign up form
function validateSignupForm(payload) {
  var errors = {};
  var isFormValid = true;
  var message = '';

  console.log('payload', payload);
  if (!payload || typeof payload.firstname !== 'string' || payload.firstname.trim().length === 0) {
    isFormValid = false;
    errors.lastname = 'Please provide your first name.';
  }

  if (!payload || typeof payload.lastname !== 'string' || payload.lastname.trim().length === 0) {
    isFormValid = false;
    errors.lastname = 'Please provide your last name.';
  }

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }
  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Please provide an account user name.';
  } else {
    var existingUser = UserModel.findByUsername(payload.username);
    if( existingUser ) {
      isFormValid = false;
      errors.username = 'That user name is already in use.';
    }
  }

  if(!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8 ) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  } else {
    if( payload.password !== payload.confirmpassword ) {
      isFormValid = false;
      errors.password = 'Password inputs are not consistent.';
    }
  }

  if(!payload || typeof payload.authorizationcode !== 'string' || payload.authorizationcode.trim() !== config.signup_auth ) {
    isFormValid = false;
    errors.authorizationcode = 'Invalid authorization code provided';
  }

  if ( !isFormValid ) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message: message,
    errors: errors
  };
}

module.exports = {
  //= =========================================
  // Login Success Route
  //= =========================================
  loginSuccess: function(req, res, next) {
    console.log('controller login success');
    var userInfo = setUserInfo(req.user);
    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in!',
      token: "JWT " + generateToken(userInfo),
      user: userInfo
    });
  },

  //= =========================================
  // Login Failure Route
  //= =========================================
  loginFailure: function(err, req, res, next) {
    console.log('controller login failure');
    return res.status(401).json({
      success: false,
      message: err.name + ": " + err.message + " User Name or Password "
    });
  },

  //= =========================================
  // authentication checker with jwt
  //= =========================================
  authenticationCheck: function(req, res, next) {
    // console.log('req.headers.authorization:', req.headers.authorization);
    if(!req.headers.authorization) {
      return res.status(401).end();
    }

    // get the last part from a authorization header string like "JWT token-value"
    var token = req.headers.authorization.split(' ')[1];

    // console.log('token:', token);
    // decode the token using a secret key-phrase
    return jwt.verify(token, config.tokenSecret, function(err, decoded) {
      if (err) { return res.status(401).end(); }

      console.log('decoded', decoded);
      var userId = decoded.id;
      var existingUser = UserModel.findById(userId);
      if (!existingUser) {
        return res.status(401).end();
      }
      return next();
    });
  },

  //= =======================================
  // Registration Route
  //= =======================================
  signup: function(req, res, next) {
    // fields validation check
    console.log(req);
    var validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(422).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }

    UserModel.addUser(
      { username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        userpass: req.body.password,
        rolegroup: req.body.rolegroup || constants.userRoles.user
      },
      function(err, userAdded) {
        if (err) {
          return next(err);
        }

        var userInfo = setUserInfo(userAdded);
        res.status(201).json({
          success: true,
          message: 'You have succesfully signed up! Now you should be able to log in.',
          token: "JWT " + generateToken(userInfo),
          user: userInfo
        });
      }
    );
  },

  roleAuthorization: function(requireRole) {
    return function(req, res, next) {
      var user = req.user;

      var foundUser = UserModel.findById(user.id);

      if(!foundUser) {
        var err = "No user was found";
        res.status(422).json({error: err});
        return next(err);
      }

      // User found, check role
      if( getRole(foundUser.rolegroup) >= getRole(requireRole)) {
        return next();
      }

      return res.status(401).json({ error: "You are not authorized to view this content."});
    };
  },

  // = ==============================
  // Forget Password Route
  // = ==============================

  forgotPassword: function(req, res, next) {
    console.log('req.body.email', req.body.email);
    // console.log('req', req);
    var email = req.body.email;

    var existingUser = UserModel.findByEmail(email);
    console.log('existingUser', existingUser);
    if( !existingUser ) {
      var err = "Your request could not be processed as entered. Please try again.";
      return res.status(422).json({error: err});
      //return next(err);
    }

    // User is found, generate and save resetToken
    crypto.randomBytes(48, function(err, buffer) {
      var resetToken = buffer.toString('hex');
      if( err ) { return next(err); }

      //console.log('resetToken', resetToken);

      existingUser.resetpasswordtoken = resetToken;
      var hoursLater = new Date(Date.now() + 24 * 3600000); // 24 hour

      // https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
      var resetExpires = hoursLater.toISOString().slice(0, 19).replace('T', ' ');
      existingUser.resetpasswordexpires = resetExpires;

      UserModel.setPasswordTokenAndExpires(existingUser, resetToken, resetExpires,  function(err) {      
        if(err) {
          console.log('error', err);
          return next(err);
        }        

        var text = 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset-password/' + resetToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n';
        var message = {
          subject: 'Reset Password',
          text: text
        };

        // Send the email
        mailgun.sendEmail(existingUser.email, message);

        return res.status(200).json({message: 'Please check your email for the link to reset your password.'});
      });
    });
  },

  verifyToken: function(req, res, next) {
    var resetUser = UserModel.findResetUser(req.params.token); 
    console.log('resetUser', resetUser);       
    if( !resetUser ) {
      return res.status(422).json({error: 'Your token has expired. Please attempt to reset your password again.'});
    }

    // Otherwise, save new password and clear resetToken from database
    //resetUser.userpass = req.body.userpass;
    //resetUser.resetpasswordtoken = '';
    //resetUser.resetpasswordexpires = '';

    UserModel.changePassword(resetUser, req.body.userpass, function(err) {
      if(err) {
        console.log('error', err);
        return next(err);
      }

      var text = 'You are receiving this email because you changed your password\n\n' +
        'If you did not request this change, please contact us immediately\n';
      var message = {
        subject: 'Password Changed',
        text: text
      };

      // Send the email
      mailgun.sendEmail(resetUser.email, message);

      return res.status(200).json({message: 'Password changed sucessfully. Please login with your new password.'});
    });

  }
}
