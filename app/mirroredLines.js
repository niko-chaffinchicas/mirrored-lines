'use strict';
/** @module MirroredLines */

const A = require('./utils/arrays');
const N = require('./utils/numbers');

/**
 * @class
 */
class MirroredLines {
  constructor(options) {
    Object.assign(this, options);
    this.padding = options.padding || 0;
    this.sortLinePoints = options.sortLinePoints || false;
  }

  clonePoints(points) {
    return points.map(coords => coords.map(c => c));
  }

  distrubutePoints(n, startPoint, endPoint) {
    let distributedXs = N.distribute(n, startPoint[0], endPoint[0]);
    let distributedYs = N.distribute(n, startPoint[1], endPoint[1]);
    return A.transpose([distributedXs, distributedYs]);
  }

  distrubuteLines(startingLine, endingLine, n) {
    let distrubutedPointSets = [];
    for (var i=0; i<startingLine.length; i++) {
      let distrubutedPoints = this.distrubutePoints(n, startingLine[i], endingLine[i]);
      distrubutedPointSets.push(distrubutedPoints);
    }
    return A.transpose(distrubutedPointSets);
  }

  jitterPoints(points, maxDiff) {
    maxDiff = maxDiff || 20;
    return points.map(function(point) {
      return [
        N.jitter(point[0], maxDiff),
        N.jitter(point[1], maxDiff)
      ];
    });
  }

  xMirrorPoints(points) {
    points = this.clonePoints(points);
    for (let point of points) {
      point[0] = N.mirror(point[0], this.width);
    }
    return points;
  }

  makeMirroredShape(line) {
    return [...line, ...this.xMirrorPoints(line).reverse()];
  }

  randomPoint() {
    let x = N.randomInt(this.width - this.padding, this.width/2);
    let y = N.randomInt(this.height - this.padding, this.padding);
    return [x, y];
  }

  randomPoints(n) {
    let points = [];
    for (var i=0; i<n; i++) {
      let point = this.randomPoint();
      points.push(point);
    }
    if (this.sortLinePoints) {
      points = this.sortPointsByY(points);
    }
    return points;
  }

  sortPointsByY(points) {
    return points.sort(function(a, b) {
      return a[1] - b[1];
    });
  }
}

module.exports = MirroredLines;
