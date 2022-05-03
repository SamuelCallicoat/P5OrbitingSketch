const CANVAS_WIDTH = 200;
const CANVAS_HEIGHT = 200;

const TIME_STEP = 0.02;
let FRAMES_PER_SINE_CYCLE;
const allArrays = [];
let isSavingGif = false;
const BASE_ARRAY_LENGTH = 20;
const BASE_MAGNITUDE = CANVAS_WIDTH / 2.5;
const BASE_SIZE = CANVAS_WIDTH / 45;
let gif_index = 0;
let time = 0.0001;
let startingRecordingFrame;
let notStartedSavingGif = true;
const xPosCenter = CANVAS_WIDTH / 2;
const yPosCenter = CANVAS_HEIGHT / 2;
let originObject = { x: xPosCenter, y: yPosCenter };

let capturer;
let canvas;
var container;
function setup() {
  FRAMES_PER_SINE_CYCLE = Math.round(TWO_PI / TIME_STEP);
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  //frameRate(60);
  let firstOrbitArray = createOrbitArray(
    20,
    originObject,
    BASE_MAGNITUDE,
    BASE_SIZE * 2
  );
  for (orb of firstOrbitArray) {
    createOrbitArray(5, orb, BASE_MAGNITUDE * 1.5, BASE_SIZE / 2);
  }
  container = select('#defaultCanvas0');
  capturer = new CCapture({
    format: 'gif',
    name: 'orbit_gif',
    workersPath: '/',
  });
}

function draw() {
  background(
    (sin(time + PI) + 1) * 100,
    (sin(time + PI) + 1) * 100,
    (sin(time + PI) + 1) * 100
  );

  if (isSavingGif && notStartedSavingGif) {
    startingRecordingFrame = frameCount;
    capturer.start();
    notStartedSavingGif = false;
  }
  // originObject.x += sin(time);
  // originObject.y += cos(time);
  noStroke();
  fill((sin(time) + 1) * 100, (sin(time) + 1) * 100, (sin(time) + 1) * 100);
  circle(originObject.x, originObject.y, BASE_SIZE * 4);
  fill(
    (sin(time + PI) + 1) * 100,
    (sin(time + PI) + 1) * 100,
    (sin(time + PI) + 1) * 100
  );
  circle(
    originObject.x + sin(time) * BASE_SIZE * 3,
    originObject.y,
    BASE_SIZE * 4
  );
  // line(xPosCenter , yPosCenter, originObject.x, originObject.y);

  for (array of allArrays) {
    for (orb of array) {
      if (orb.originObject instanceof OrbitingOrb) {
        orb.update(
          sin(time),
          sin(time) * BASE_SIZE + BASE_SIZE * 3,
          (cos(time) * BASE_SIZE) / 3 + BASE_SIZE / 2
        );
      } else orb.update(time);
      orb.draw();
    }
  }

  capturer.capture(container.elt);
  if (frameCount == FRAMES_PER_SINE_CYCLE + startingRecordingFrame) {
    console.log('finished at frame: ' + frameCount);
    capturer.stop();
    capturer.save();
    notStartedSavingGif = true;
    isSavingGif = false;
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
