let width = 800;
let height = 800;

let allArrays = [];

const BASE_ARRAY_LENGTH = 20;
const BASE_MAGNITUDE = 100;
const BASE_SIZE = 6;

let time = 0.0001;
let originObject = { x: width / 2, y: height / 2 };

let xPos = width / 2;
let yPos = height / 2;
function setup() {
  createCanvas(width, height);

  let firstOrbitArray = createOrbitArray(20, originObject, BASE_MAGNITUDE, 10);
  for (orb of firstOrbitArray) {
    createOrbitArray(5, orb, 10, 3);
  }
}

function draw() {
  background(220);

  originObject.x += sin(time);
  originObject.y += cos(time);
  circle(originObject.x, originObject.y, 20);

  for (array of allArrays) {
    for (orb of array) {
      if (orb.originObject instanceof OrbitingOrb) {
        orb.update(sin(time), sin(time) * 5 + 20, cos(time) * 4 + 3);
      } else orb.update(time);
      orb.draw();
    }
  }

  time += 0.015;
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
