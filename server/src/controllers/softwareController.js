/**
 * Created by pzheng on 28/04/2017.
 */
'use strict';
var SoftwareModel = require('../models/softwareModel.js'),
  setSoftwareInfo = require('../helpers').setSoftwareInfo,
  SoftwareController = {};

SoftwareController = {
  fetchOneById: function(req, res, next) {
    var softwareId = req.params.softwareId;
    if( req.software.id.toString() !== softwareId) {
      return res.status(401).json({error: 'You are not authorized to view this software.'});
    }

    var foundSoftware = SoftwareModel.findById(softwareId);
    if(!foundSoftware) {
      var err = 'No software could be found for this ID.';
      res.status(400).json({error: err});
      return next(err);
    }

    var softwareToReturn = setSoftwareInfo(foundSoftware);

    return res.status(200).json({client: softwareToReturn});
  },

  fetchAll: function(req, res, next) {
    var softwares = SoftwareModel.softwares;
    return res.status(200).json({softwares: softwares});
  },
};

module.exports = SoftwareController;
