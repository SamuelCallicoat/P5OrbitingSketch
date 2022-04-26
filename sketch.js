let width = 400;
let height = 400;

let circleArray = [];
const ARRAY_LENGTH = 20;
const MAGNITUDE = 100;

let time = 0;

let xPos = width / 2;
let yPos = height / 2;
function setup() {
  createCanvas(width, height);

  for (let i = 0; i < ARRAY_LENGTH; i++) {
    circleArray[i] = new OrbitingOrb(i / ARRAY_LENGTH, MAGNITUDE);

    // let orbXpos = sin((i / arrayLength) * TWO_PI) * 40;
    // let orbYpos = cos((i / arrayLength) * TWO_PI) * 40;

    // circleArray[i] = [orbXpos, orbYpos];
  }
}

function draw() {
  background(220);
  circle(xPos, yPos, 20);

  translate(xPos, yPos);

  for (let orb of circleArray) {
    orb.update(time);
    orb.draw(6);
  }

  time += 0.015;
}
