let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

let TIME_STEP = 0.02;
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

let speedSlider;
let magnitudeSlider1;

let capturer;
let canvas;
var container;
function setup() {
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  createSliders();
  updateFramesPerCycle();

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
  // TODO: make a somewhat reasonable screen resizing function
  //       Also need to update the translation of screen center, if i want it to work
  // screenResize();
  updateFramesPerCycle();
  background((sin(time + PI) + 1) * 100);

  if (isSavingGif && notStartedSavingGif) {
    startingRecordingFrame = frameCount;
    capturer.start();
    notStartedSavingGif = false;
  }
  // originObject.x += sin(time);
  // originObject.y += cos(time);
  noStroke();
  fill((sin(time) + 1) * 100);
  circle(originObject.x, originObject.y, BASE_SIZE * sizeSlider0.value());
  fill((sin(time + PI) + 1) * 100);
  circle(
    originObject.x + sin(time) * BASE_SIZE * sizeSlider0.value(),
    originObject.y,
    BASE_SIZE * sizeSlider0.value()
  );
  // line(xPosCenter , yPosCenter, originObject.x, originObject.y);

  for (array of allArrays) {
    for (orb of array) {
      if (orb.originObject instanceof OrbitingOrb) {
        orb.update(
          sin(time),
          sin(time) * BASE_MAGNITUDE +
            BASE_MAGNITUDE * magnitudeSlider2.value(),
          (cos(time) * BASE_SIZE * sizeSlider2.value()) / 2 +
            BASE_SIZE * sizeSlider2.value()
        );
      } else orb.update(time, BASE_MAGNITUDE * magnitudeSlider1.value());
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
Math.log();
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

function createSliders() {
  // TODO all the

  speedSlider = createSlider(1.001, 1.07, 0.045, 0.001);
  speedSlider.position(0, CANVAS_HEIGHT + 20);
  speedSlider.style('width', CANVAS_WIDTH / 2 - 10 + 'px');

  magnitudeSlider1 = createSlider(0, 1, 0.5, 0.01);
  magnitudeSlider2 = createSlider(0, 1, 0.5, 0.1);
  magnitudeSlider1.position(0, CANVAS_HEIGHT + 40);
  magnitudeSlider2.position(0, CANVAS_HEIGHT + 60);
  magnitudeSlider1.style('width', CANVAS_WIDTH / 2 - 10 + 'px');
  magnitudeSlider2.style('width', CANVAS_WIDTH / 2 - 10 + 'px');

  sizeSlider0 = createSlider(0, 45, 3, 0.1);
  sizeSlider1 = createSlider(0, 20, 3, 0.1);
  sizeSlider2 = createSlider(0, 3, 1, 0.1);
  sizeSlider0.position(xPosCenter + 10, CANVAS_HEIGHT + 20);
  sizeSlider1.position(xPosCenter + 10, CANVAS_HEIGHT + 40);
  sizeSlider2.position(xPosCenter + 10, CANVAS_HEIGHT + 60);
  sizeSlider0.style('width', CANVAS_WIDTH / 2 - 10 + 'px');
  sizeSlider1.style('width', CANVAS_WIDTH / 2 - 10 + 'px');
  sizeSlider2.style('width', CANVAS_WIDTH / 2 - 10 + 'px');

  gifButton = createButton('Save GIF');
  gifButton.mousePressed(() => (isSavingGif = true));
  gifButton.position(xPosCenter - 40, CANVAS_HEIGHT + 80);
}

function screenResize() {
  if (windowHeight < windowWidth) {
    CANVAS_WIDTH = windowHeight * 0.8;
    CANVAS_HEIGHT = windowHeight * 0.8;
  }
  if (windowHeight >= windowWidth) {
    CANVAS_WIDTH = windowWidth * 0.8;
    CANVAS_HEIGHT = windowWidth * 0.8;
  }
  resizeCanvas(windowWidth, windowHeight);
}

function updateFramesPerCycle() {
  TIME_STEP = Math.log(speedSlider.value()) / 3;
  FRAMES_PER_SINE_CYCLE = Math.round(TWO_PI / TIME_STEP);
}
