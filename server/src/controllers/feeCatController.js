/**
 * Created by pzheng on 19/05/2017.
 */
'use strict';
var FeeCatModel = require('../models/feeCatModel.js'),
  setFeeCatInfo = require('../helpers').setFeeCatInfo,
  FeeCatController = {};

FeeCatController = {
  fetchOneById: function(req, res, next) {
    var feeCatId = req.params.feeCatId;
    if( req.fee.id.toString() !== feeCatId) {
      return res.status(401).json({error: 'You are not authorized to view this software.'});
    }

    var foundCat = FeeCatModel.findById(feeCatId);
    if(!foundCat) {
      var err = 'No fee type could be found for this ID.';
      res.status(400).json({error: err});
      return next(err);
    }
    var catToReturn = setFeeCatInfo(foundCat);
    return res.status(200).json({feeCat: catToReturn});
  },

  fetchAll: function(req, res, next) {
    var feeCats = FeeCatModel.feeCats;
    return res.status(200).json(feeCats);
  },
};

module.exports = FeeCatController;
