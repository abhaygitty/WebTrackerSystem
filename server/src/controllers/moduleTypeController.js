'use strict';
var ModuleTypeModel = require('../models/moduleTypeModel.js'),
  // setModuleTypeInfo = require('../helpers').setModuleTypeInfo,
  ModuleTypeController = {};

ModuleTypeController = {
  fetchOneById: function(req, res, next) {
    var id = req.params.id;
    if( req.moduleTypes.id.toString() !== id) {
      return res.status(401).json({error: 'You are not authorized to view this moduletype.'});
    }

    var foundOne = ModuleTypeModel.findById(id);
    if(!foundOne) {
      var err = 'No record could be found for this ID.';
      res.status(400).json({error: err});
      return next(err);
    }

    var oneToReturn = setModuleTypeInfo(foundOne);

    return res.status(200).json({locationType: oneToReturn});

  },

  fetchAll: function(req, res, next) {
    var moduleTypes = ModuleTypeModel.moduleTypes;
    return res.status(200).json({modules: moduleTypes});
  },
};

module.exports = ModuleTypeController;
