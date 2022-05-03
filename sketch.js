let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

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

let speedSlider;
let magnitudeSlider1;

let capturer;
let canvas;
var container;
function setup() {
  FRAMES_PER_SINE_CYCLE = Math.round(TWO_PI / TIME_STEP);
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  createSliders();
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
  // TODO: make a somewhat reasonable screen resizing function
  //       Also need to update the translation of screen center, if i want it to work
  // screenResize();

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
          sin(time) * BASE_SIZE + BASE_SIZE * magnitudeSlider2.value(),
          (cos(time) * BASE_SIZE * sizeSlider2.value()) / 2 +
            BASE_SIZE * sizeSlider2.value()
        );
      } else orb.update(time, BASE_SIZE * magnitudeSlider1.value());
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
  time += Math.log(speedSlider.value() + 1) / 2;
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
  speedSlider = createSlider(0.001, 0.07, 0.001, 0.001);
  speedSlider.position(0, CANVAS_HEIGHT + 20);

  magnitudeSlider1 = createSlider(0, 20, 3, 0.1);
  magnitudeSlider2 = createSlider(0, 6, 3, 0.1);
  magnitudeSlider1.position(0, CANVAS_HEIGHT + 40);
  magnitudeSlider2.position(0, CANVAS_HEIGHT + 60);

  sizeSlider0 = createSlider(0, 45, 3, 0.1);
  sizeSlider1 = createSlider(0, 20, 3, 0.1);
  sizeSlider2 = createSlider(0, 3, 1, 0.1);
  sizeSlider0.position(150, CANVAS_HEIGHT + 20);
  sizeSlider1.position(150, CANVAS_HEIGHT + 40);
  sizeSlider2.position(150, CANVAS_HEIGHT + 60);
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
