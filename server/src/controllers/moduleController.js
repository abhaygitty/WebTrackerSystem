'use strict';
var ModuleModel = require('../models/moduleModel.js'),
  setModuleInfo = require('../helpers').setModuleInfo,
  ModuleController = {};

ModuleController = {
  fetchModules: function(req, res, next) {
    var clientId = req.params.id;
    var clientModules = ModuleModel.filterByClient(clientId);

    return res.status(200).json({modules:clientModules});
  },

  fetchOne: function(req, res, next) {
    console.log('req.params.id', req.params.id);
    var moduleId = req.params.id;

    var module = ModuleModel.findById(moduleId);

    return res.status(200).json({module:module});
  },

  updateModules: function(req, res, next) {
    var clientId = req.params.id;
    var data = req.body;
    ModuleModel.updateModules(clientId, data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },
  createOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    ModuleModel.createOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },

  updateOne: function(req, res, next) {
    // console.log('req.body', req.body);
    var data = req.body;
    ModuleModel.updateOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  },
  deleteOne: function(req, res, next) {
    console.log('req.body', req.body);
    var data = req.body;
    ModuleModel.deleteOne(data,
      function(err, newContent) {
        if(err) {
          return next(err);
        }
        // console.log('newContent', newContent);
        return res.status(200).json(newContent);
      }
    );
  }
};

module.exports = ModuleController;
