let width = 800;
let height = 800;

let circleArray = [];

const ARRAY_LENGTH = 20;
const MAGNITUDE = 100; //probably not an constant, if i want to have more than one orbit

let orbitArray = [];

let time = 0.0001;
let originObject = { x: width / 2, y: height / 2 };

let xPos = width / 2;
let yPos = height / 2;
function setup() {
  createCanvas(width, height);

  for (let i = 0; i < ARRAY_LENGTH; i++) {
    circleArray[i] = new OrbitingOrb(i / ARRAY_LENGTH, MAGNITUDE, originObject);

    orbitArray.push(new Array());
    for (let j = 0; j < 4; j++) {
      orbitArray.at(-1)[j] = new OrbitingOrb(
        j / 4,
        MAGNITUDE / 4,
        circleArray[i]
      );

      // let orbXpos = sin((i / arrayLength) * TWO_PI) * 40;
      // let orbYpos = cos((i / arrayLength) * TWO_PI) * 40;

      // circleArray[i] = [orbXpos, orbYpos];
    }
    // let orbXpos = sin((i / arrayLength) * TWO_PI) * 40;
    // let orbYpos = cos((i / arrayLength) * TWO_PI) * 40;

    // circleArray[i] = [orbXpos, orbYpos];
  }
}

function draw() {
  background(220);

  originObject.x += sin(time);
  originObject.y += cos(time);
  circle(originObject.x, originObject.y, 20);

  for (let orb of circleArray) {
    orb.update(time);
    orb.draw(6);
  }

  for (const array of orbitArray) {
    for (let orb of array) {
      orb.update(sin(time * 2));
      orb.draw(2);
    }
  }

  time += 0.015;
}
