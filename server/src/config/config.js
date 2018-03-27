/**
 * Created by pzheng on 30/11/2016.
 */
'use strict';
var configJS = './env/' + process.env.NODE_ENV + '.js';
module.exports = require(configJS);
// module.exports = require('./env/production.js');
