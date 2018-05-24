function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

export default class SPESimulator {
	constructor(Pmax, attenuationCoefficientEnabled, minHingeAngle, maxHingeAngle) {
		this.Pmax = Pmax;
    this.minHingeAngle = minHingeAngle;
    this.maxHingeAngle = maxHingeAngle;
    this.attenuationCoefficientEnabled = attenuationCoefficientEnabled;

		this.state = {
			d: 0,
			p: undefined,
			i: undefined,
      j: undefined,
      n: undefined,
			theta: undefined
		}
	}

	step(d) {
    var theta = Math.asin(
      Math.sin(toRadians(23.44)) * 
      Math.sin(toRadians((this.state.d + 101) * (360/365.25)))
    );

    var degHinge = 0 - toDegrees(theta);
    if(degHinge < this.minHingeAngle) 
      degHinge = this.minHingeAngle;
    if(degHinge > this.maxHingeAngle)
      degHinge = this.maxHingeAngle;

    theta += toRadians(degHinge);
    this.state.theta = toDegrees(theta);

		this.state.i = 1354 + 45 * Math.cos(toRadians(this.state.d * (360 / 365.25)));
    this.state.j = this.state.i / 1353;

    if(this.attenuationCoefficientEnabled)
      this.state.n = 0.696 + 0.304 * Math.exp(-this.state.d/1000)
    else
      this.state.n = 1;

    this.state.p = this.Pmax * this.state.j * this.state.n * Math.cos(theta);

		this.state.d += d
	}
}
