class OrbitingOrb {
  constructor(
    trigArrayPos,
    originObject,
    magnitude = BASE_MAGNITUDE,
    size = BASE_SIZE
  ) {
    this.originalTrigPos = trigArrayPos * TWO_PI;
    this.x = sin(this.originalTrigPos) * magnitude;
    this.y = cos(this.originalTrigPos) * magnitude;
    this.magnitude = magnitude;
    this.size = size;
    this.originObject = originObject;

    this.isChild = originObject instanceof OrbitingOrb; // FIXME: returning true, even when not.
  }

  update(timeStep, magnitude = this.magnitude, size = this.size) {
    this.x = this.originObject.x;
    this.y = this.originObject.y;
    this.size = size;
    this.x += sin(this.originalTrigPos + timeStep) * magnitude;
    this.y += cos(this.originalTrigPos + timeStep) * magnitude;
  }

  draw() {
    circle(this.x, this.y, this.size);
  }
}
