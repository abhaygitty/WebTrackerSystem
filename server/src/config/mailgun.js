/**
 * Created by pzheng on 13/02/2017.
 */
'use strict';
var config = require('./config');
var mailgun = require('mailgun-js')({apiKey: config.mailgun_priv_key, domain: config.mailgun_domain});

// Create and export function to send emails through Mailgun API
module.exports = {
  sendEmail: function(recipient, message) {
    var data = {
      from: 'Your Site <info@yourdomain.com>',
      to: recipient,
      subject: message.subject,
      text: message.text
    };

    mailgun.messages().send(data, function(error, body) {
      //console.log(body);
    });
  },

  contactForm: function(sender, message) {
    var data = {
      from: sender,
      to: 'you@yourdomain.com',
      subject: message.subject,
      text: message.text
    };

    mailgun.messages().send(data, function(error, body) {
      // console.log(body);
    });
  }
};
