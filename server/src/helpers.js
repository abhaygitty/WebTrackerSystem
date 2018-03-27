/**
 * Created by pzheng on 8/02/2017.
 */
'use strict';

var fs = require('fs');
var crypto = require('crypto');
var _ = require('underscore');
var moment = require('moment');
var roles = require('./config/constants').userRoles;
var accesslevels = require('./config/constants').accessLevels;

module.exports = {
  loadConfig: function() {
    var config = {};
    /*
     try {
     fs.stateSync(__dirname + '/config/config.json');
     var synconfig = fs.readFileSync((__dirname + '/config/config.json', 'utf8'));
     config = JSON.parse(synconfig);
     console.log('config ', __dirname);
     }
     catch(e) {
     console.log("Error loading config" + e.message);
     }
     */
    return config;
  },

  jsonKeyCase: function(caseOption, json) {
    /*
     var jsonStr = jsonData.stringify(); //may cause undefined is not a function
     if( caseOption.toUpperCase() === 'UPPERCASE' ) {
     jsonStr.replace(/"([\w"]+)":/g, function($0, $1) {
     return('"' + $1.toUpperCase() + '":');
     });
     }
     else {
     jsonStr.replace(/"([\w"]+)":/g, function($0, $1) {
     return('"' + $1.toLowerCase() + '":');
     });
     }
     return jsonStr.toJSON();
     */
    var key, keys = Object.keys(json);
    var n = keys.length;
    var newJson={};
    while(n--) {
      key = keys[n];
      if( caseOption.toUpperCase() === 'UPPERCASE') {
        newJson[key.toUpperCase()] = json[key];
      }
      else {
        newJson[key.toLowerCase()] = json[key];
      }
    }
    return newJson;
  },

  //Reference to: https://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
  getRandomString: function(length) {
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);
  },

  sha512: function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
      salt: salt,
      passwordHash:value
    };
  },

  /* global escape: true */
  //thanks to Niccolo Campolungo at
  // http://stackoverflow.com/questions/17191945/conversion-between-utf-8-arraybuffer-and-string
  uintArrayToString: function(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
      decodedString = decodeURIComponent(escape(encodedString)); //escape deprecated since js 1.5
    return decodedString;
  },

  /* global unescape: true */
  stringTouintArray: function(jstring) {
    jstring = btoa(unescape(encodeURIComponent(jstring)));  //unescape deprecated since js 1.5
    var charList = jstring.split(''),
      uintArray = [];
    for(var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  },

  wrapJson: function(results, fields) {
    var self = this;
    var jsondata = [];
    var tloop = fields;
    var ftype = [];
    _.each(tloop, function(metadesc, key) {
      fields[key] = metadesc.alias;
      ftype[key] = metadesc.type;
    });

    var maxCols = fields.length - 1;
    var holdrow = "";
    var fieldtype = 0;
    var fieldname = "";
    var value = "";
    _.each(_.toArray(results), function(humheader, keyheader) {
      holdrow = "";
      _.each(fields, function(num, key) {
        fieldname = fields[key].toLowerCase();
        fieldtype = ftype[key];
        fieldname = fieldname.replace(/ /gi, ""); //global replace flag gi str.replace(/<br>/gi, '\r');
        value = humheader[num];

        if( key === 0 ) {
          holdrow += '{';
        }

        switch(fieldtype) {
          case 500: //smallint
          case 496: // integer
            if(value || value === 0) {
              holdrow += '"' + fieldname + '":' + value;
            }
            else { // null or undefined
              holdrow += '"' + fieldname + '": 0'; // default value
            }
            break;
          case 448: // string
            if(value) {
              // https://stackoverflow.com/questions/4253367/how-to-escape-a-json-string-containing-newline-characters-using-javascript
              value = self.stringEscaped(value);
              holdrow += '"' + fieldname + '":"' + value + '"';
            } else { // null or undefined
              holdrow += '"' + fieldname + '": ""';
            }
            break;
          case 570: // date
            if(value) {
              value = moment(value).format("DD/MM/YYYY"); // Firebird support dot rather than slash
              holdrow += '"' + fieldname + '":"' + value + '"';
            } else { // null or undefined
              holdrow += '"' + fieldname + '": ""';
            }
            break;
          case 580: //decimal
            if (value || value === 0) {
              holdrow += '"' + fieldname + '":' + value;
            }
            else { // null or undefined
              holdrow += '"' + fieldname + '": 0.00'; // default value
            }
            break;
          default:
            if (value) {
              holdrow += '"' + fieldname + '":"' + value + '"';
            } else {
              holdrow += '"' + fieldname + '": ""';
            }
        }

        if( key ===  maxCols ) {
          holdrow += '}';
        } else {
          holdrow += ',';
        }

      });

      holdrow = holdrow.replace(/[\u0000-\u001F]+/g, "");
      var rowJson = JSON.parse(holdrow);
      jsondata[keyheader] = rowJson; // {'ID': '37'} is invalid JSON String, need to use double quote -- test it at jsonlint.com
    });
    return jsondata;
  },

  extendWrapJson: function(results, fields, callback) {
    var jsonData = this.wrapJson(results, fields);
    if (callback) {
      callback(null, jsonData);
    }
  },

  escape: function(key, val) { // var myJSONString = JSON.stringify(myJSON, escape);
    if (typeof(val) != "string") return val;
    return val
      .replace(/[\n]/g, "\\n")
      .replace(/[\']/g, "\\'")
      .replace(/[\"]/g, '\\"')
      .replace(/[\&]/g, "\\&")
      .replace(/[\r]/g, "\\r")
      .replace(/[\t]/g, "\\t")
      .replace(/[\b]/g, "\\b")
      .replace(/[\f]/g, "\\f")
      .replace(/[\\]/g, "\\\\");
  },

  stringEscaped: function(val) {
    var valRet = String(val);
    return valRet
      .replace(/[\n]/g, "\\n")
      .replace(/[\']/g, "\\'")
      .replace(/[\"]/g, '\\"')
      .replace(/[\&]/g, "\\&")
      .replace(/[\r]/g, "\\r")
      .replace(/[\t]/g, "\\t")
      .replace(/[\b]/g, "\\b")
      .replace(/[\f]/g, "\\f")
      .replace(/[\\]/g, "\\\\");
  },

  applyRoutes: function(app, routes) {
    _.each(routes, function(route) {
      var args = _.flatten([route.path, route.middleware]);
      switch(route.httpMethod.toUpperCase()) {
        case 'GET':
          app.get.apply(app, args);
          break;
        case 'POST':
          app.post.apply(app, args);
          break;
        case 'PUT':
          app.put.apply(app, args);
          break;
        case 'DELETE':
          app.delete.apply(app, args);
          break;
        default:
          throw new Error('Invalid HTTP method specified for route ' + route.path);
      }
    });
  },
  // Set Uer info from request
  setUserInfo: function(request) {
    var getUserInfo = {
      id: request.id,
      username: request.username,
      firstname: request.firstname,
      lastname: request.lastname,
      email: request.email,
      rolegroup: request.rolegroup
    };
    return getUserInfo;
  },

  setAddressTypeInfo: function(request) {
    var getAddressTypeInfo = {
      id: request.id,
      addtype: request.addtype,
      description: request.description
    };
    return getAddressTypeInfo;
  },

  setModuleTypeInfo: function(request) {
    var getModuleTypeInfo = {
      module: request.module,
      code: request.code,
      description: request.description,
      available: request.available
    };
    return getModuleTypeInfo;
  },

  setModuleInfo: function(request) {
    var getModuleInfo = {
      cidref: request.cidref,
      id: request.id,
      mdesc: request.mdesc,
      mid: request.mid
    };
    return getModuleInfo;
  },

  setFeeInfo: function(request) {
    var getFeeInfo = {
      cfee_id: request.cfee_id,
      cidref: request.cidref,
      fromdate: request.fromdate,
      freqtype: request.freqtype,
      annualfee: request.annualfee,
      frequency: request.frequency,
      notes: request.notes,
      reviewdate: request.reviewdate,
      feecategories_id: request.feecategories_id
    };
    return getFeeInfo;
  },

  setClientInfo: function(request) {
    var clientInfo = {
      client_id: request.client_id,
      name: request.name,
      contract_expires: request.contract_expires,
      current_version: request.current_version,
      status: request.status?1:0,
      prepaidminutes: request.prepaidminutes,
      last_allocation_rollover: request.last_allocation_rollover,
      current_software_id: request.current_software_id,
      email: request.email,
      implementation_fee: request.implementation_fee,
      reviewdate: request.reviewdate,
      reminddate: request.reminddate,
      reminder_message: request.reminder_message,
      viewed: request.viewed?1:0,
    };
    return clientInfo;
  },
  setSoftwareInfo: function(request) {
    var softwareInfo = {
      id: request.id,
      code: request.code,
      description: request.description
    };
    return softwareInfo;
  },
  setContactInfo: function(request) {
    var contactInfo = {
      contact_id: request.contact_id,
      cid: request.cid,
      name: request.name,
      primarycontact: request.primarycontact?1:0,
      salutation: request.salutation,
      givenname: request.givenname,
      surname: request.surname,
      phone: request.phone,
      email: request.email,
      fax: request.fax,
      jobdescription: request.jobdescription,
      notes: request.notes,
      mobile: request.mobile,
      identity: request.identity,
    };
    return contactInfo;
  },
  setLocationInfo: function(request) {
    var locationInfo = {
      address_id: request.address_id,
      title: request.title,
      cidref: request.cidref,
      typeref: request.typeref,
      address1: request.address1,
      address2: request.address2,
      state: request.state,
      suburb: request.suburb,
      postcode: request.postcode,
      notes: request.notes,
      number_of_units: request.number_of_units
    };
    return locationInfo;
  },

  setEdiInfo: function(request) {
    var ediInfo = {
      cidref: request.cidref,
      edinumber: request.edinumber,
      service: request.service,
      edistring: request.edistring
    };
    return ediInfo;
  },
  getRole: function(checkRole) {
    var role;
    if( checkRole !== roles.user || checkRole !== roles.admin ) {
      role = roles.public;
    }
    return role;
  },

  getAccessLevel: function(checkAccessLevel) {
    var accessLevel;
    if( checkAccessLevel !== accesslevels.public ||
        checkAccessLevel !== accesslevels.user ||
        checkAccessLevel !== accesslevels.admin ) {
      accessLevel = accesslevels.anon;
    }
    return accessLevel;
  },

  parseToFirebirdString: function(value, type) {
    if (value || typeof value === "boolean" ) {
      switch(type) {
        case 'date':
          return (value === '' ? "null" : ( "'" + moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD') + "'" ));
        case 'string':
          return ("'" + value + "'");
        case 'boolean':
          return (value === true) ? "1" : "0";
        default:
          return value;
      }
    }
    else {
      return "null"
    }
  },
  createObjectWithLowercaseKeys: function(obj) {
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newObj = {};
    while (n--) {
      key = keys[n];
      newObj[key.toLowerCase()] = obj[key];
    }
    return newObj;
  }
};
