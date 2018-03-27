/**
 * Created by pzheng on 10/05/2017.
 */
'use strict';
var AddressTypeModel = require('../models/addressTypeModel.js'),
  setAddressTypeInfo = require('../helpers').setAddressTypeInfo,
  AddressTypeController = {};

AddressTypeController = {
  fetchOneById: function(req, res, next) {
    var locationTypeId = req.params.locationTypeId;
    if( req.location.id.toString() !== locationTypeId) {
      return res.status(401).json({error: 'You are not authorized to view this software.'});
    }

    var foundType = AddressTypeModel.findById(locationTypeId);
    if(!foundType) {
      var err = 'No address type could be found for this ID.';
      res.status(400).json({error: err});
      return next(err);
    }

    var typeToReturn = setAddressTypeInfo(foundType);

    return res.status(200).json({locationType: typeToReturn});

  },

  fetchAll: function(req, res, next) {
    var addressTypes = AddressTypeModel.addressTypes;
    return res.status(200).json({locationTypes: addressTypes});
  },
};

module.exports = AddressTypeController;
