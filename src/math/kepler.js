const r_earth = 6371 * 1e3; // meters
const m_earth = 5.972 * 1e24; // kg
const G = 6.67408 * (1 / Math.pow(r_earth, 3)) * 1e-11; // kg^-1 s^-2 (normal units)^3
const mu = G * m_earth; // s^-2 (normal units)^3

const dt = 60; // seconds

function simulateKeplerOrbit(e, n) {
  const n_rad_s = n * (2 * Math.PI / 86400); // TODO: why do we need to convert to radians to get a?
  const a = Math.pow(mu, 1/3) / Math.pow(n_rad_s, 2/3); // from n = sqrt(mu/a^3)
  const c = e * a; // from e = c/a
  const b = Math.sqrt(Math.pow(a, 2) - Math.pow(c, 2)); // from ellipse geometry

  var steps = [];
  var vertices = [];
  
  for(var M = 0; M < 2 * Math.PI; M += n_rad_s * dt) {
    // Calculate eccentric anomaly using newton's method
    var E = M;
    for(var step = 0; step < 3; step++) {
      var dE = (E - e * Math.sin(E) - M)/(1 - e * Math.cos(E));
      E -= dE;
    }

    // Calculate true anomaly
    const v = Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E/2)) * 2;

    // Calculate the position of the object;
    const x = a * Math.cos(v);
    const y = (b/a) * Math.sqrt(Math.abs(Math.pow(a, 2) - Math.pow(x, 2)));
    vertices.push([x, y]);

    steps.push({E, v});
  }
  
  return {steps, vertices, ellipse: {a, b, c}};
}

export {r_earth, m_earth, G, mu, simulateKeplerOrbit as default};
