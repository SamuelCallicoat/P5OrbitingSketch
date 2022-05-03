const width = 270;
const height = 270;

const TIME_STEP = 0.01;
let FRAMES_PER_SINE_CYCLE;
let allArrays = [];
let isSavingGif = false;
const BASE_ARRAY_LENGTH = 20;
const BASE_MAGNITUDE = 100;
const BASE_SIZE = 6;
let gif_index = 0;
let time = 0.0001;
let startingRecordingFrame;
let notStartedSavingGif = true;
const xPosCenter = width / 2;
const yPosCenter = height / 2;
let originObject = { x: xPosCenter, y: yPosCenter };

let capturer;
let canvas;
var container;
function setup() {
  FRAMES_PER_SINE_CYCLE = Math.floor(TWO_PI / TIME_STEP);
  canvas = createCanvas(width, height);
  frameRate(60);
  let firstOrbitArray = createOrbitArray(20, originObject, BASE_MAGNITUDE, 10);
  for (orb of firstOrbitArray) {
    createOrbitArray(5, orb, 10, 3);
  }
  container = select('#defaultCanvas0');
  capturer = new CCapture({
    format: 'png',
    name: 'orbit_gif',
  });
}

function draw() {
  background(220);
  if (isSavingGif && notStartedSavingGif) {
    startingRecordingFrame = frameCount;
    capturer.start();
    notStartedSavingGif = false;
  }
  // originObject.x += sin(time);
  // originObject.y += cos(time);
  noStroke();
  fill((sin(time) + 1) * 100, (sin(time) + 1) * 100, (sin(time) + 1) * 100);
  circle(originObject.x, originObject.y, 20);
  // line(xPosCenter , yPosCenter, originObject.x, originObject.y);

  for (array of allArrays) {
    for (orb of array) {
      if (orb.originObject instanceof OrbitingOrb) {
        orb.update(sin(time), sin(time) * 5 + 20, cos(time) * 4 + 3);
      } else orb.update(time);
      orb.draw();
    }
  }

  capturer.capture(container.elt);
  if (frameCount == FRAMES_PER_SINE_CYCLE + startingRecordingFrame) {
    console.log('finished at frame: ' + frameCount);
    capturer.stop();
    capturer.save();
  }
  time += TIME_STEP;
}

function createOrbitArray(numOfOrbs, centerObject, magnitude, size) {
  const createdArray = [];

  for (let i = 0; i < numOfOrbs; i++) {
    createdArray[i] = new OrbitingOrb(
      i / numOfOrbs,
      centerObject,
      magnitude,
      size
    );
  }

  allArrays.push(createdArray);
  return createdArray;
}
