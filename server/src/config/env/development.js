/**
 * Created by pzheng on 30/11/2016.
 */
'use strict';
module.exports = {
    sessionSecret: 'developmentSessionSecret',
    reapInterval: 60000 * 10,
    tokenSecret: 'developmentTokenSecret',
    tokenTime: 120 * 60,
    mailgun_priv_key: 'key-3f0f23fae65d0e5deef3b236dbd4db09',
    mailgun_domain: 'sandboxe614b95208ca4895ac87a3520c33abef.mailgun.org',
    signup_auth: 'ognib',
    db: {
        "host": "localhost",
        "port": 3050,
        "user": "aimhd",
        "password": "WebUser",
        "role": null,
        "pagesize": 8192,
        "charset": "UTF8",
        "database": "helpdesk",
        "lowercase_keys": false // always set to false or default, as node-firebird return capital field names
    }
};
