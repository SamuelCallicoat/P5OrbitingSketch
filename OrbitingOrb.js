class OrbitingOrb {
  constructor(trigArrayPos, magnitude, originObject) {
    this.x = sin(trigArrayPos * TWO_PI) * magnitude;
    this.y = cos(trigArrayPos * TWO_PI) * magnitude;
    this.originalTrigPos = trigArrayPos * TWO_PI;
    this.magnitude = magnitude;

    this.originObject = originObject;
  }

  update(time) {
    this.x = this.originObject.x;
    this.y = this.originObject.y;

    this.x += sin(this.originalTrigPos + time) * this.magnitude;
    this.y += cos(this.originalTrigPos + time) * this.magnitude;
  }

  draw(size) {
    circle(this.x, this.y, size);
  }
}
