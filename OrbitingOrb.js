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
    //                                                             possibly context error?
  }

  update(timeStep, magnitude = this.magnitude, size = this.size) {
    this.x = this.originObject.x;
    this.y = this.originObject.y;
    this.size = size;
    this.x += sin(this.originalTrigPos + timeStep) * magnitude;
    this.y += cos(this.originalTrigPos + timeStep) * magnitude;
  }

  draw(colorMode = 'grayScale', HSLInput1 = undefined, HSLInput2 = undefined) {
    let scaling;
    let c;
    switch (colorMode) {
      case 'grayScale':
        scaling = map(this.x - this.originObject.x, -100, 100, 40, 180);
        if (scaling > 100) scaling = 100;
        if (scaling < 0) scaling = 0;
        c = color(scaling, scaling, scaling);
        break;
      case 'HSL':
        scaling = scaling = map(this.x - this.originObject.x, -200, 200, 0, 1);
        if (scaling > 1) scaling = 1;
        if (scaling < 0) scaling = 0;
        c = color(
          `hsb(${round(lerp(HSLInput1, HSLInput2, scaling))}, 70%, 70%)`
        );
        break;
      default:
        scaling = map(this.x - this.originObject.x, -100, 100, 40, 180);
        if (scaling > 100) scaling = 100;
        if (scaling < 0) scaling = 0;
        c = color(scaling, scaling, scaling);
    }

    noStroke();
    fill(c);
    //noStroke();
    circle(this.x, this.y, this.size);
  }
}
