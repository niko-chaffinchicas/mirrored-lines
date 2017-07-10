const fs = require('fs');
const path = require('path');
const Twitter = require('twitter');
const uuid = require('uuid/v1');
const CronJob = require('cron').CronJob;

const MirroredLines = require('./mirroredLines');
const utils = require('./utils');
const N = utils.NumberUtils;

let canvas = new utils.EnhancedCanvas(1000, 1000);
let strokeColors = [
  "rgba(230, 134, 140, 0.2)",
  "rgba(30, 80, 203, 0.3)",
];

let envPath = path.join(__dirname, 'env.js');
if (!fs.existsSync(envPath)) {
  throw new Error(`${utils.isoTimestamp()} No env.js file found`);
}

const _env = require(envPath);
let twitterClient = new Twitter({
  consumer_key: _env.TWITTER_CONSUMER_KEY,
  consumer_secret: _env.TWITTER_CONSUMER_SECRET,
  access_token_key: _env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: _env.TWITTER_ACCESS_TOKEN_SECRET,
});

function postRandomCatsCradle() {
  let timestamp = uuid();
  let name = `cats-cradle-${timestamp}`;
  utils.log(`starting to generate post ${name}...`);

  let bgColor = "white";
  let colorFilter = "difference";
  let color = strokeColors[Math.floor(Math.random()*strokeColors.length)];

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

  canvas.context.globalCompositeOperation = "source-over";
  canvas.fill(bgColor);

  // Generate a random series of points
  let points = mp.randomPoints(numberOfPoints);

  // Get a new line by jittering the original line, then generate "tween" lines
  let lines = mp.jitterPointsAndDistribute(points, jitterAmount, numberOfTweens);
  lines = lines.map(line => mp.makeMirroredShape(line));

  lines = mp.centerLinesVertically(lines);

  canvas.context.globalCompositeOperation = colorFilter;
  // Draw all the lines!
  lines.forEach((line) => {
    canvas.strokeLine(line, color);
  });
  utils.log(`img created ${name}`);

  let data = canvas.toBuffer();
  twitterClient.post('media/upload', {media:data}, function(error, media) {
    if (error) {
      return utils.log("Error uploading media:", error);
    }

    let status = {
      status: name,
      media_ids: media.media_id_string
    };

    twitterClient.post('statuses/update', status, function(error) {
      if (error) {
        return utils.log("Error updating status:", error);
      }
      utils.log(`Successfully tweeted ${name}.`);
    });
  });
}

new CronJob('0 0 */2 * * *', postRandomCatsCradle, null, true, 'America/Los_Angeles');
utils.log("started cron job");
