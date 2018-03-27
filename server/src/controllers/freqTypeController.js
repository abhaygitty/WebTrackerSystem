/**
 * Created by pzheng on 19/05/2017.
 */
'use strict';
var FreqTypeModel = require('../models/freqTypeModel.js'),
  // setFreqTypeModel = require('../helpers').setFeeTypeInfo,
  FreqTypeController = {};

FreqTypeController = {
  fetchAll: function(req, res, next) {
    var freqTypes = FreqTypeModel.freqTypes;
    return res.status(200).json(freqTypes);
  },
};

module.exports = FreqTypeController;
