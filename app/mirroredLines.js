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
    this.restraintPadding = options.restraintPadding || 0;
    this.sortLinePoints = options.sortLinePoints || false;
  }

  containPoint(point) {
    point = point.slice(0);
    point[0] = N.contain(point[0], this.width - this.restraintPadding, this.restraintPadding);
    point[1] = N.contain(point[1], this.height - this.restraintPadding, this.restraintPadding);
    return point;
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

  /**
   * Returns a an array of lines, from the starting lines to the ending,
   * jittered lines, with `n` number of lines inbetween.
   */
  jitterPointsAndDistribute(points, maxDiff, nTweens, nRepeat) {
    let lines = [points];
    let newPoints;
    nTweens = Math.floor(nTweens);
    nRepeat = Math.floor(nRepeat) || 1;
    for (var i = 0; i < nRepeat; i++) {
      newPoints = this.jitterPoints(points, maxDiff);
      let distrubutedLines = this.distrubuteLines(points, newPoints, nTweens, nRepeat);
      lines.push(...distrubutedLines.reverse(), newPoints);
      points = newPoints;
    }
    return lines;
  }

  /**
   * Centers an array of lines vertically within the boundaries of the
   * originally entered width and height
   */
  centerLinesVertically(lines) {
    // Find the point with the lowest y value
    let yVals = [].concat(...lines).map(point => point[1]);
    let [highY, lowY] = N.range(yVals);
    let diffY = ((this.height - (highY - lowY)) / 2) - lowY;
    return lines.map((line) => {
      return line.map((point) => {
        point[1] += diffY;
        return point;
      });
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
    line = [...line, ...this.xMirrorPoints(line).reverse()];
    if (this.restrainPoints) {
      line = line.map(point => this.containPoint(point));
    }
    return line;
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
