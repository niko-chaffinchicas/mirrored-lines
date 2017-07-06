'use strict';
/** @module ArrayUtils */

module.exports = {
  /**
   * @function transpose
   * @param {Array} arr - The original 2D array to transpose, where all the
   * child arrays presumably have the same length
   * @returns {Array} An array transposed from the original (i.e. if the
   * original array was 5x2, the returned array is 2x5)
   */
  transpose: function(arr) {
    let newArray = [],
        origArrayLength = arr.length,
        arrayLength = arr[0].length,
        i;
    for (i=0; i<arrayLength; i++){
        newArray.push([]);
    }
    for (i=0; i<origArrayLength; i++){
        for(let j=0; j<arrayLength; j++){
            newArray[j].push(arr[i][j]);
        }
    }
    return newArray;
  }
};
