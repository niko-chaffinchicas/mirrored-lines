const path = require('path');
const uuid = require('uuid/v1');

const MirroredLines = require('./mirroredLines');
const utils = require('./utils');
const N = utils.NumberUtils;

let canvas = new utils.EnhancedCanvas(1000, 1000);

function imagePath(filename) {
  return path.join(__dirname, `../generated_images/${filename}`);
}

// blue-grey to maroon, with difference
let strokeColor = "rgba(230, 134, 140, 0.2)";

// yellow to red-purple, with difference
// let strokeColor = "rgba(30, 80, 203, 0.3)";

function drawIt() {
  // Initialize the generator with its parameters
  let mp = new MirroredLines({
    width: canvas.width,
    height: canvas.height,
    padding: canvas.width * 0.2,
    sortLinePoints: false,
    restrainPoints: true,
    restraintPadding: canvas.width * 0.05,
  });

  let jitterAmount = N.randomInt(300, 180);
  let numberOfTweens = N.randomInt(100, 60);
  let numberOfPoints = N.randomInt(28, 16);
  let timestamp = uuid();

  canvas.context.globalCompositeOperation = "source-over";
  canvas.fill("white");

  // Generate a random series of points
  let points = mp.randomPoints(numberOfPoints);

  // Get a new line by jittering the original line, then generate "tween" lines
  let lines = mp.jitterPointsAndDistribute(points, jitterAmount, numberOfTweens);
  lines = lines.map(line => mp.makeMirroredShape(line));

  lines = mp.centerLinesVertically(lines);

  canvas.context.globalCompositeOperation = "difference";
  // Draw all the lines!
  lines.forEach((line) => {
    canvas.strokeLine(line, strokeColor);
  });

  canvas.writePng(imagePath(`${timestamp}_bg.png`));

  // drawIt();
}

drawIt();
