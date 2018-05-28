import React from "react";
import { Label, Form, FormGroup, Input, Button, Col, Progress } from "reactstrap";

import * as THREE from 'three';
import React3 from 'react-three-renderer';
import OrbitControls from 'orbit-controls-es6';
//import TrackballControls from 'three-trackballcontrols';

import OPSForm from "./OPSForm";
import simulateKeplerOrbit from "math/kepler";

const EARTH_TEXTURE_URL = "media/pattern_reduced.jpg"

export default class OrbitalParameterSimulator extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cameraPosition: new THREE.Vector3(3, 3, 3),
      cameraRotation: new THREE.Euler(),
      lightPosition: new THREE.Vector3(5, 3, 5),
      equatorialPlaneRotation: new THREE.Euler(THREE.Math.degToRad(90), 0, 0),
      additionalObjects: [],
    };

    this._onAnimate = this._onAnimate.bind(this);
    this._addOrbit = this._addOrbit.bind(this);
  }

  _onAnimate() {
    this.controls.update();

    if(!this.state.animating)
      return;
  }

  componentDidMount() {
    this.controls = new OrbitControls(this.refs.camera, this.refs.react3_element);

    this.controls.addEventListener('change', () => {
      this.setState({
        cameraPosition: this.refs.camera.position.clone(),
        cameraRotation: this.refs.camera.rotation.clone()
      });
    });

    var axes = new THREE.AxesHelper(5);
    this.refs.scene.add(axes);
  }

  _addOrbit(i_deg, w_deg, omega_deg, e, n) {
    const result = simulateKeplerOrbit(e, n);
    var vertices = result.vertices.map((vert) => new THREE.Vector3(vert[0], vert[1], 0));
    vertices.push(...result.vertices.map((vert) => new THREE.Vector3(vert[0], -vert[1], 0)));

    // rotation constants
    const i = THREE.Math.degToRad(i_deg); // inclination (rad)
    const omega = THREE.Math.degToRad(omega_deg); // longitude of ascending node (rad)
    const w = THREE.Math.degToRad(w_deg); // argument of periapsis (rad)

    // plane rotation and position
    // TODO figure out the fudge factors
    //const rotation = new THREE.Euler(THREE.Math.degToRad(90) + i, THREE.Math.degToRad(75) + omega, w);
    const rotation = new THREE.Euler(THREE.Math.degToRad(90) + i, omega, w);
    const orbitPosition = new THREE.Vector3(result.ellipse.c, 0, 0).applyEuler(rotation);

    // The orbital plane mesh
    const color = Math.floor(Math.random() * 0xffffff);
    const padding = 0.5;

    this.state.additionalObjects.push(
      <mesh rotation={rotation} position={orbitPosition}>
        <planeGeometry width={result.ellipse.a * 2 + padding} height={result.ellipse.b * 2 + padding} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          color={color}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    )

    // The orbit ellipse mesh (line)
    this.state.additionalObjects.push(
      <line rotation={rotation} position={orbitPosition}>
        <geometry vertices={vertices} />
        <lineBasicMaterial />
      </line>
    );

    this.setState({
      additionalObjects: this.state.additionalObjects.slice(0)
    })
  }

  render() {
    const width = 900; // canvas width
    const height = 600; // canvas height

    return (
      <div>
        <OPSForm
          onAddOrbit={this._addOrbit}
          onClearOrbits={() => this.setState({additionalObjects: []})}
          ref="form"
        />

        <div className="container" ref="react3_element">
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

              <mesh name="equatorial" rotation={this.state.equatorialPlaneRotation} visible={false}>
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
        </div>

        <Form className="bg-light rounded controls">
          <FormGroup check>
            <Label check><Input id="show_equatorial" type="checkbox"/>Show equatorial plane</Label>
          </FormGroup>
          <FormGroup check>
            <Label check><Input id="show_true_anomaly" type="checkbox" />Show true anomaly</Label>
          </FormGroup>
          <FormGroup check>
            <Label check><Input id="show_nodes" type="checkbox" />Show nodes</Label>
          </FormGroup>

          <hr />

          <Input id="slider" type="range" />
          <Label for="slider">t = 127.36 days</Label>

          <FormGroup row>
            <Col>
            </Col>
          </FormGroup>
        </Form>
    </div>);
  }
}
