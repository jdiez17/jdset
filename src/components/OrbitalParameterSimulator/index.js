import React from "react";
import { Label, Form, FormGroup, Input, Button, Col, Progress } from "reactstrap";

import * as THREE from 'three';
import React3 from 'react-three-renderer';
import OrbitControls from 'orbit-controls-es6';
//import TrackballControls from 'three-trackballcontrols';

import OPSForm from "./OPSForm";

const EARTH_TEXTURE_URL = "media/pattern_reduced.jpg"

export default class OrbitalParameterSimulator extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cameraPosition: new THREE.Vector3(0, 0, 5),
      cameraRotation: new THREE.Euler(),
      lightPosition: new THREE.Vector3(5, 3, 5),
      equatorialPlaneRotation: new THREE.Euler(THREE.Math.degToRad(90), 0, 0),
      additionalObjects: [],
    };

    this._onAnimate = this._onAnimate.bind(this);
    this._addRandomPlane = this._addRandomPlane.bind(this);
  }

  _onAnimate() {
    this.controls.update();

    if(!this.state.animating)
      return;
  }

  componentDidMount() {
    this.controls = new OrbitControls(this.refs.camera, this.refs.react3_element);

    /*
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    */

    this.controls.addEventListener('change', () => {
      this.setState({
        cameraPosition: this.refs.camera.position.clone(),
        cameraRotation: this.refs.camera.rotation.clone()
      });
    });

    var axes = new THREE.AxesHelper(5);
    this.refs.scene.add(axes);
  }

  _addRandomPlane() {
    const i = THREE.Math.degToRad(Math.random() * 360); //Math.random() * 360; // inclination (rad)
    const w = THREE.Math.degToRad(Math.random() * 360); // argument of periapsis (rad)
    const omega = THREE.Math.degToRad(Math.random() * 360); // longitude of ascending node (radk)
    const a = 3; // semi-major axis
    const c = 7; // linear eccentricity
    const e = c/a; // numerical eccentricity
    const b = Math.sqrt(Math.pow(a, 2) - Math.pow(e, 2)); // semi-minor axis

    const rotation = new THREE.Euler(THREE.Math.degToRad(90) + i, omega, w);

    // This allows us to move the orbit shape to make the central body
    // be in one of the foci of the ellipse. TODO figure out why e + 1.
    // I think 1 comes from the radius of the Earth in this coordinate
    // system. But I would have expected to use the linear eccentricity
    // instead of the numerical eccentricity.
    const orbitPosition = new THREE.Vector3(-e + 1, 0, 0).applyEuler(rotation);

    // The orbital plane
    const color = Math.floor(Math.random() * 0xffffff);
    const padding = 0.5;

    this.state.additionalObjects.push(
      <mesh rotation={rotation} position={orbitPosition}>
        <planeGeometry width={a * 2 + padding} height={b * 2 + padding} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          color={color}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    )

    var vertices_pos = [];
    var vertices_neg = [];
    const steps = 120;
    for(var it = 0; it <= steps; it++) {
      const x = -a + ((a * 2) / steps) * it;
      const y = (b / a) * Math.sqrt(Math.pow(a, 2) - Math.pow(x, 2));

      vertices_pos.push(
        new THREE.Vector3(x, y, 0),
      );
      vertices_neg.push(
        new THREE.Vector3(x, -y, 0)
      );
    }
    const vertices = vertices_pos.concat(vertices_neg);

    /*
    var vertices = [];
    for(var M = 0; M < 2 * Math.PI; M += 0.1) {
      var E = M;

      // Calculate eccentric anomaly using Newton's Method
      console.log("calculating E, M=" + M);
      while(true) {
        var dE = (E - e * Math.sin(E) - M)/(1 - e * Math.cos(E));
        E -= dE;
        if(Math.abs(dE) < 1e-2) break;
      }
      console.log("done");

      // TODO figure this out
      const P = a * (Math.cos(E) - other_e);
      const Q = a * Math.sin(E) * Math.sqrt(1 - Math.pow(other_e, 2));

      // rotate by argument of perigee
      var x = Math.cos(w) * P - Math.sin(w) * Q;
      var y = Math.sin(w) * P + Math.cos(w) * Q;

      // rotate by inclination
      var z = Math.sin(i) * x;
          x = Math.cos(i) * x;

      // rotate by longitude of ascending node
      var xtemp = x;

      x = Math.cos(omega) * xtemp - Math.sin(omega) * y;
      y = Math.sin(omega) * xtemp + Math.cos(omega) * y;
      vertices.push(new THREE.Vector3(x, y, z));
    }
    */

    // The orbit ellipse
    this.state.additionalObjects.push(
      <line rotation={rotation} position={orbitPosition}>
        <geometry vertices={vertices} />
        <lineBasicMaterial />
      </line>
    );

    this.setState({
      additionalObjects: this.state.additionalObjects.slice(0)
    })

    console.log("adding random plane");
  }

  render() {
    const width = 600; // canvas width
    const height = 800; // canvas height

    return (
      <div>
        <OPSForm
          onAddRandomPlane={this._addRandomPlane}
          onClearPlanes={() => this.setState({additionalObjects: []})}
          ref="form"
        />

        <div ref="react3_element">
          <React3
            mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
            width={width}
            height={height}

            onAnimate={this._onAnimate}
          >
            <scene ref="scene">
              <perspectiveCamera
                name="camera"
                fov={45}
                aspect={width / height}
                near={0.1}
                far={1000}

                position={this.state.cameraPosition}
                rotation={this.state.cameraRotation}
                ref="camera"
              />

              <directionalLight position={this.state.lightPosition} />

              <ambientLight />

              <mesh name="earth">
                <sphereGeometry
                  radius={1}
                  heightSegments={32}
                  widthSegments={32}
                />
                <meshPhongMaterial>
                  <texture url={EARTH_TEXTURE_URL} />
                </meshPhongMaterial>
              </mesh>

              <mesh name="equatorial" rotation={this.state.equatorialPlaneRotation}>
                <planeGeometry width={4} height={4} />
                <meshBasicMaterial
                  side={THREE.DoubleSide}
                  transparent={true}
                  opacity={0.6}
                />
              </mesh>

              {this.state.additionalObjects}
            </scene>
          </React3>

          <Form className="bg-light rounded controls">
            <FormGroup row className="check-inline">
              <Col sm={6}>
                <Label check><Input id="show_equatorial" type="checkbox" />Show equatorial plane</Label>
              </Col>
              <Col sm={6}>
                <Label check><Input id="show_true_anomaly" type="checkbox" />Show true anomaly</Label>
              </Col>
            </FormGroup>

            <FormGroup row className="check-inline">
              <Col sm={6}>
                <Label check><Input id="show_nodes" type="checkbox" />Show nodes</Label>
              </Col>
            </FormGroup>

            <hr />

            <Input id="slider" type="range" />
            <Label for="slider">t = 127.36 days</Label>

            <FormGroup row>
              <Col>
              </Col>
            </FormGroup>
          </Form>
        </div>
    </div>);
  }
}
