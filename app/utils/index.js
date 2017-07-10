'use strict';
const EnhancedCanvas = require('./enhancedCanvas');
const NumberUtils = require('./numbers');
const ArrayUtils = require('./arrays');

module.exports = {
  EnhancedCanvas,
  NumberUtils,
  ArrayUtils,

  isoTimestamp() {
    return `[${(new Date()).toISOString()}]`;
  },

  log(...items) {
    console.log(this.isoTimestamp(), ...items);
  }
};
