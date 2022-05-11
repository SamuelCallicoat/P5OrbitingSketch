let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;
const BASE_ARRAY_LENGTH = 20;

let TIME_STEP = 0.02;
const allArrays = [];
let FRAMES_PER_SINE_CYCLE;
let BASE_MAGNITUDE = CANVAS_WIDTH / 2.5;
let BASE_SIZE = CANVAS_WIDTH / 45;
let gif_index = 0;
let time = 0.0001;
let startingRecordingFrame;
let notStartedSavingGif = true;
let xPosCenter = CANVAS_WIDTH / 2;
let yPosCenter = CANVAS_HEIGHT / 2;
let originObject = { x: xPosCenter, y: yPosCenter };
let grayScaleMode = false;
let HSLmode = true;
let HSLVal1 = 100;
let HSLVal2 = 200;

let isSavingGif = false;
let speedSlider;
let magnitudeSlider1;
let magnitudeSlider2;
let sizeSlider0;
let sizeSlider1;
let sizeSlider2;
let resolutionSlider;
let colorModeBtn;
let hslSlider1;
let hslSlider2;

let capturer;
let canvas;
var container;
function setup() {
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  screenResize();
  createSliders();
  updateFramesPerCycle();
  pixelDensity(0.7);
  let firstOrbitArray = createOrbitArray(
    BASE_ARRAY_LENGTH,

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
  screenResize();
  updateFramesPerCycle();
  originObject.x = xPosCenter;
  originObject.y = yPosCenter;

  if (isSavingGif && notStartedSavingGif) {
    startingRecordingFrame = frameCount;
    capturer.start();
    notStartedSavingGif = false;
  }

  noStroke();
  if (grayScaleMode === true) {
    background((sin(time + PI) + 1) * 100);
    fill((sin(time) + 1) * 100);
    circle(originObject.x, originObject.y, BASE_SIZE * sizeSlider0.value());
    fill((sin(time + PI) + 1) * 100);
    circle(
      originObject.x + sin(time) * BASE_SIZE * sizeSlider0.value(),
      originObject.y,
      BASE_SIZE * sizeSlider0.value()
    );
  }
  if (HSLmode === true) {
    let minColor = mapColors(hslSlider1.value(), hslSlider2.value());
    let maxColor = mapColors(hslSlider1.value(), hslSlider2.value(), PI);

    background(maxColor);
    fill(minColor);

    circle(originObject.x, originObject.y, BASE_SIZE * sizeSlider0.value());
    fill(maxColor);

    circle(
      originObject.x + sin(time) * BASE_SIZE * sizeSlider0.value(),
      originObject.y,
      BASE_SIZE * sizeSlider0.value()
    );
  }

  for (array of allArrays) {
    for (orb of array) {
      if (!(orb.originObject instanceof OrbitingOrb)) {
        orb.update(
          time,
          BASE_MAGNITUDE * magnitudeSlider1.value(),
          BASE_SIZE * sizeSlider1.value()
        );
      } else
        orb.update(
          sin(time),
          sin(time) * BASE_MAGNITUDE * magnitudeSlider2.value(),
          (cos(time) * BASE_SIZE * sizeSlider2.value()) / 2 +
            BASE_SIZE * sizeSlider2.value()
        );
      if (HSLmode === true)
        orb.draw('HSL', hslSlider1.value(), hslSlider2.value());
      if (grayScaleMode === true) orb.draw('greyScale');
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

function createSliders() {
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
  gifButton.position(xPosCenter - 40, CANVAS_HEIGHT + 85);
  colorModeBtn = createButton('Color Mode');
  colorModeBtn.mousePressed(() => {
    HSLmode = !HSLmode;
    grayScaleMode = !grayScaleMode;
  });
  colorModeBtn.position(xPosCenter - 40, CANVAS_HEIGHT + 140);

  hslSlider1 = createSlider(0, 360, 199, 0.1);
  hslSlider2 = createSlider(0, 360, 100, 0.1);

  hslSlider1.position(10, CANVAS_HEIGHT + 160);
  hslSlider2.position(10, CANVAS_HEIGHT + 180);

  hslSlider1.style('width', CANVAS_WIDTH / 2 - 10 + 'px');
  hslSlider2.style('width', CANVAS_WIDTH / 2 - 10 + 'px');

  resolutionSlider = createSlider(0.2, 1, 0.6, 0.05);
  resolutionSlider.position(xPosCenter - CANVAS_WIDTH / 4, CANVAS_HEIGHT + 110);
  resolutionSlider.style('width', CANVAS_WIDTH / 2 - 10 + 'px');
}

function screenResize() {
  if (windowWidth < 600) {
    CANVAS_WIDTH = windowWidth - 10;
    CANVAS_HEIGHT = windowWidth - 10;
    xPosCenter = CANVAS_WIDTH / 2;
    yPosCenter = CANVAS_HEIGHT / 2;
    BASE_MAGNITUDE = CANVAS_WIDTH / 2.5;
    BASE_SIZE = CANVAS_WIDTH / 45;
  }
  pixelDensity(resolutionSlider?.value() || 0.5);
  resizeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function updateFramesPerCycle() {
  TIME_STEP = Math.log(speedSlider.value()) / 3;
  FRAMES_PER_SINE_CYCLE = Math.round(TWO_PI / TIME_STEP);
}

function mapColors(HSLInput1, HSLInput2, phase = 0) {
  return `hsb(${round(
    lerp(HSLInput1, HSLInput2, (sin(time + phase) + 1) * 0.5)
  )},70%,70%)`;
}

function printColors(phase = 0) {
  return `hsb(${lerp(
    hslSlider1.value(),
    hslSlider2.value(),
    (sin(time + phase) + 1) * 0.5
  )},100%,100%)`;
}
