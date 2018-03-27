/**
 * Created by pzheng on 14/02/2017.
 */
'use strict';
module.exports = {
  sessionSecret: 'testSessionSecret',
  reapInterval: 60000 * 10,
  tokenSecret: 'testTokenSecret',
  tokenTime: 120 * 60,
  mailgun_priv_key: 'mailgun private key for test',
  mailgun_domain: 'mailgun domain for test',
  signup_auth: 'ognib',
  db: {
    "host": "localhost",
    "port": 3050,
    "user": "aimhd",
    "password": "WebUser",
    "role": null,
    "pagesize": 8192,
    "charset": "UTF8",
    "database": "testdb",
    "lowercase_keys": false // always set to false or default, as node-firebird return capital field names
  }
};
