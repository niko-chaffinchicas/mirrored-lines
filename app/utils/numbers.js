'use strict';
/** @module NumberUtils */

module.exports = {
  /**
   * @ignore
   */
  _numberParamCheck: function(n, name) {
    name = ` \`${name}\`` || '';
    n = parseFloat(n);
    if (!this.isNumber(n)) {
      throw new Error(`Must supply a number for${name} parameter.`);
    }
    return n;
  },
  /**
   * @ignore
   * @function _maxMinParamCheck
   * @param {Number} max
   * @param {Number} [min]
   * @param {Number} [defaultMin]
   * @returns The max and min params with greater value first.
   */
  _maxMinParamCheck: function(max, min, defaultMin) {
    max = parseFloat(max);
    min = parseFloat(min) || defaultMin || 0;
    if (!max || !this.isNumber(max)) {
      throw new Error('Must supply a non-zero number for `max` parameter.');
    }
    return [max, min].sort().reverse();
  },

  /**
   * @function isNumber
   * @param {*} n - The variable to check
   * @returns {Boolean} Returns `true` if the variable is a number. Otherwise,
   * returns `false`.
   */
  isNumber: function(n) {
    return typeof n === "number" && isFinite(n);
  },

  /**
   * @function isNumberArray
   * @param {*} a - The variable to check
   * @returns {Boolean} Returns `true` if the variable is an array of only
   * numbers. Otherwise, returns `false`.
   */
  isNumberArray: function(a) {
    if (!Array.isArray(a)) {
      return false;
    }
    for (let item of a) {
      if (!this.isNumber(item)) {
        return false;
      }
    }
    return true;
  },

  /**
   * @function random
   * @param {Number} max - The max value for the random number
   * @param {Number} [min=0] - The min value for the random number
   * @returns {Number} A random number between (and including) the `max` and
   * `min` value.
   */
  random: function(max, min) {
    [max, min] = this._maxMinParamCheck(max, min);
    return min + Math.random() * (max - min);
  },

  /**
   * @function randomInt
   * @param {Number} max - The max value for the random number
   * @param {Number} [min=0] - The min value for the random number
   * @returns {Number} A random number between (and including) the `max` and
   * `min` value, rounded to the nearest integer.
   */
  randomInt: function(max, min) {
    max = Math.ceil(max);
    min = Math.floor(min);
    return Math.round(this.random(max, min));
  },

  /**
   * @function mirror
   * @param {Number} n - The number to mirror
   * @param {Number} max - The max value for the range
   * @param {Number} [min=0] - The min value for the range
   * @returns {Number} A number that is the same distance from the middle of
   * the `range` as `n`, but on the opposite side of the middle value.
   */
  mirror: function(n, max, min) {
    [max, min] = this._maxMinParamCheck(max, min);
    return max - n + min;
  },

  /**
   * @function contain
   * @param {Number} n - The number to contain
   * @param {Number} max - The max value for the range
   * @param {Number} [min=0] - The min value for the range
   */
  contain: function(n, min, max) {
    [max, min] = this._maxMinParamCheck(max, min);
    if (n > max) {
      return max;
    } else if (n < min) {
      return min;
    }
    return n;
  },

  /**
   * @function jitter
   * @param {Number} n - The number to modify
   * @param {Number} max - The max amount to add to the number
   * @param {Number} [min] - The min amount to add to the number. Default value is `max * -1`
   * @returns {Number} The original number, with a random number between the
   * `max` and `min` values added to it.
   */
  jitter: function(n, max, min) {
    max = parseFloat(max);
    [max, min] = this._maxMinParamCheck(max, min, max * -1);
    return n + this.random(max, min);
  },

  /**
   * @function distribute
   * @param {Number} n - The number of evenly distributed points to generate
   * @param {Number} max - The max value for the range
   * @param {Number} [min=0] - The min value for the range
   * @returns {Number[]} An array of n length, containing evenly distributed
   * numbers between the `max` and `min`, excluding `max` and `min`.
   */
  distribute: function(n, start, end) {
    n = this._numberParamCheck(n, 'n');
    start = this._numberParamCheck(start, 'start');
    end = this._numberParamCheck(end, 'end');
    let diff = (start - end);
    return Array.apply(null, {length: n}).map((_, i) => {
      return end + (diff / (n+1) * (i+1));
    });
  }
};
