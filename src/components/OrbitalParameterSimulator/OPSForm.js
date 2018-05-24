import React from "react";
import { Label, Form, FormGroup, Input, Button, Col, Progress } from "reactstrap";

export default class OPSForm extends React.Component {
  render() {
    return (
      <div>
        <Form className="bg-light rounded controls">
          <h5>Keplerian Elements</h5>
          <FormGroup row>
            <Col sm={3}>
              <Label for="inclination">
                Inclination, i (deg)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="inclination" 
                />
            </Col>
            <Col sm={3}>
              <Label for="raan">
                RAAN, Omega (deg)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="raan" 
                />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={3}>
              <Label for="eccentricity">
                Eccentricity, e (ratio)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="eccentricity" 
                />
            </Col>
            <Col sm={3}>
              <Label for="argperigee">
                Arg. of Perigee, w (deg)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="argperigee" 
                />
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col sm={3}>
              <Label for="meanmotion">
                Mean motion, n (rev/day)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="meanmotion" 
                />
            </Col>
            <Col sm={3}>
              <Label for="meananomaly">
                Mean anomaly, M (deg)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="meananomaly" 
                />
            </Col>
          </FormGroup>

          <hr />

          <FormGroup row>
            <Col sm={3}>
              <Label for="duration">
                Simulation duration (minutes)
              </Label>
            </Col>
            <Col sm={3}>
              <Input
                type="number" 
                id="duration"
              />
            </Col>
            <Col sm={3}>
              <Label for="resolution">
                Step size (minutes)
              </Label>
            </Col>
            <Col sm={3}>
              <Input type="number" id="resolution" />
            </Col>
          </FormGroup>

          <hr />

          <div id="simulationControls" className="row">
            <Col sm>
              <Button
                onClick={this.props.onAddRandomPlane}
                color="success"
              >Add Random Plane</Button>
            </Col>
            <Col sm>
              <Button
                onClick={this.props.onClearPlanes}
              >Clear Planes</Button>
            </Col>
          </div>
        </Form>

      </div>
    );
  }

}
