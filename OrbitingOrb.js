class OrbitingOrb {
  constructor(trigArrayPos, magnitude) {
    this.x = sin(trigArrayPos * TWO_PI) * magnitude;
    this.y = cos(trigArrayPos * TWO_PI) * magnitude;
    this.originalTrigPos = trigArrayPos * TWO_PI;
    this.magnitude = magnitude;
  }

  update(time) {
    this.x = sin(this.originalTrigPos + time) * this.magnitude;
    this.y = cos(this.originalTrigPos + time) * this.magnitude;
  }

  draw(size) {
    circle(this.x, this.y, size);
  }
}
