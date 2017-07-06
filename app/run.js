const path = require('path');

const MirroredLines = require('./mirroredLines');
const utils = require('./utils');
const N = utils.NumberUtils;

let canvas = new utils.EnhancedCanvas(1000, 1000);

function imagePath(filename) {
  return path.join(__dirname, `../generated_images/${filename}`);
}

// Globals for the mirrored line generation
let strokeColor = "rgba(225, 255, 255, 0.3)";

function drawIt() {
  let mp = new MirroredLines({
    width: canvas.width,
    height: canvas.height,
    padding: 100,
    sortLinePoints: false
  });

  let jitterAmount = N.randomInt(220, 180);
  let numberOfTweens = N.randomInt(100, 60);
  let numberOfPoints = N.randomInt(14, 8);
  let timestamp = Date.now();

  // canvas.clear();
  canvas.fill("black");

  let lines = [];
  // Generate a random series of points
  let points = mp.randomPoints(numberOfPoints);

  // Make a line out mirroring the points and reversing the order
  lines.push(mp.makeMirroredShape(points));

  // Jitter the points and add another line
  let newPoints = mp.jitterPoints(points, jitterAmount);
  lines.push(mp.makeMirroredShape(newPoints));

  // Spleen lines between the starting lines and ending lines
  let distrubutedLines = mp.distrubuteLines(points, newPoints, numberOfTweens).map((line) => {
    return mp.makeMirroredShape(line);
  });
  // Insert the distrubutedLines between the start and end lines
  lines.splice(1, 0, ...distrubutedLines);
  // Draw all the lines!
  lines.forEach((line) => {
    canvas.strokeLine(line, strokeColor);
  });

  canvas.writePng(imagePath(`${timestamp}_bg.png`));
}

drawIt();
