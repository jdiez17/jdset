import React from "react";
import Plot from "react-plotly.js";
import { Label, Form, FormGroup, Input, Button, Col, Progress } from "reactstrap";

import SPESimulator from "math/spe_sim";

// Home page component
export default class SolarPanelEfficiency extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [{
        x: [],
        y: [],
        type: 'scatter'
      }], 
      layout: {
        datarevision: 0,
        xaxis: { title: 'Mission Time (days)' },
        yaxis: { title: 'Solar Array Output Power (W)' }
      }, frames: [], config: {},
      frames: [],
      config: {},

      simulationProgress: 0,
      running: false,
      missionDuration: 365.25,
      simulationStep: 0.5,
      hingeEnabled: false,
      minHingeAngle: 0,
      maxHingeAngle: 0,
      maxPower: 1000,
      attenuationCoefficientEnabled: true,
    }

    this.simulator = null;
    this.d = [];
    this.p = [];

    this.simulateAndUpdate = this.simulateAndUpdate.bind(this);
    this.startSimulation = this.startSimulation.bind(this);
    this.stopSimulation = this.stopSimulation.bind(this);
  }

  startSimulation() {
    this.d = [];
    this.p = [];
    this.setState({running: true}, () => {
      this.simulator = new SPESimulator(
        this.state.maxPower, 
        this.state.attenuationCoefficientEnabled,
        this.state.minHingeAngle, 
        this.state.maxHingeAngle
      );

      setTimeout(this.simulateAndUpdate, 0);
    });
  }

  stopSimulation() {
    const newLayout = Object.assign({}, this.state.layout);
    newLayout.datarevision += 1;
    newLayout.xaxis.range = [0, this.state.missionDuration];

    this.setState({
      running: false,
      data: [{x: this.d, y: this.p, type: 'scatter'}],
      layout: newLayout
    })
  }

  simulateAndUpdate() {
    if(!this.state.running)
      return;

    this.simulator.step(parseFloat(this.state.simulationStep));
    const lastD = this.simulator.state.d;
    const simProgress = Math.min((lastD / this.state.missionDuration) * 100, 100);
    this.d.push(lastD);
    this.p.push(this.simulator.state.p);

    this.setState({simulationProgress: simProgress}, () => {
      if(simProgress >= 100) {
        this.stopSimulation();
      } else {
        setTimeout(this.simulateAndUpdate, 0);
      }
    });
  }

  // render
  render() {
    return (
      <div>
        <p>
          This tool simulates the angle between the Sun and the solar panels
          of a spacecraft in geosynchronous orbit around the Earth, as well 
          as the output power of said panels.
        </p>
        <p>
          For more information, see <a href="https://www.atlantis-press.com/php/download_paper.php?id=2962">
          Analyze on GEO Satellites Output Power Variation (Zheng, J., Chen, H., CITCS 2012).</a>
        </p>

        <Form className="bg-light rounded controls">
          <FormGroup row>
            <Col sm={4}>
              <Label for="duration">
                Mission duration (days)
              </Label>
            </Col>
            <Col sm={8}>
              <Input
                disabled={this.state.running} 
                type="number" 
                id="duration" 
                value={this.state.missionDuration}
                onChange={(ev) => this.setState({missionDuration: ev.target.value})} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={4}>
              <Label for="resolution">
                Simulation step size (days)
              </Label>
            </Col>
            <Col sm={8}>
              <Input disabled={this.state.running} type="number" id="resolution" value={this.state.simulationStep} 
                onChange={(ev) => this.setState({simulationStep: ev.target.value})} />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={4}>
              <Label for="power">
                Maximum solar array output power (Watt)
              </Label>
            </Col>
            <Col sm={8}>
              <Input disabled={this.state.running} type="number" id="power" value={this.state.maxPower} 
                onChange={(ev) => this.setState({maxPower: ev.target.value})} />
            </Col>
          </FormGroup>
          <hr/>
          <FormGroup check className="form-group">
            <Label check>
              <Input 
                disabled={this.state.running} 
                checked={this.state.hingeEnabled}
                onChange={(ev) => {
                  this.setState({hingeEnabled: !this.state.hingeEnabled}, () => {
                    if(!this.state.hingeEnabled) {
                      this.setState({minHingeAngle: 0, maxHingeAngle: 0})
                    }
                  })
                }}
                type="checkbox" />
              Enable solar array hinge 
            </Label>
          </FormGroup>
          <FormGroup row>
            <Col sm={4}>
              <Label for="minHingAngle">
                Minimum hinge angle (degrees)
              </Label>
            </Col>
            <Col sm={8}>
              <Input
                disabled={this.state.running || !this.state.hingeEnabled} 
                type="number" 
                value={this.state.minHingeAngle}
                id="minHingAngle"
                onChange={(ev) => {this.setState({minHingeAngle: ev.target.value})}}/>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={4}>
              <Label for="maxHingAngle">
                Maximum hinge angle (degrees)
              </Label>
            </Col>
            <Col sm={8}>
              <Input
                disabled={this.state.running || !this.state.hingeEnabled} 
                type="number" 
                value={this.state.maxHingeAngle}
                id="maxHingAngle"
                onChange={(ev) => {this.setState({maxHingeAngle: ev.target.value})}}/>
            </Col>
          </FormGroup>
          <hr/>
          <FormGroup check className="form-group">
            <Label check>
              <Input 
                disabled={this.state.running} 
                checked={this.state.attenuationCoefficientEnabled}
                onChange={(ev) => this.setState({attenuationCoefficientEnabled: !this.state.attenuationCoefficientEnabled})} 
                type="checkbox" />
              Enable attenuation coefficient 
            </Label>
          </FormGroup>
          <hr />
          <div id="simulationControls" className="row">
            <Col sm>
              <Button 
                onClick={this.startSimulation} 
                disabled={this.state.running} 
                color="success"
              >Start</Button>
            </Col>
            <Col sm>
              <Button 
                onClick={this.stopSimulation} 
                disabled={!this.state.running}
                color="secondary"
              >Stop</Button>
            </Col>
          </div>
        </Form>

        <div className="mt-3">
          <div className="text-center">{this.state.simulationProgress.toFixed(2)}%</div>
          <Progress value={this.state.simulationProgress} />
        </div>

        <Plot
          style={{"width": "100%"}}
          data={this.state.data}
          layout={this.state.layout}
          frames={this.state.frames}
          config={this.state.config}
          onInitialized={(figure) => this.setState(figure)}
          onUpdate={(figure) => this.setState(figure)}
          onRedraw={() => console.log("redraw")}
          useResizeHandler
        />
      </div>
    );
  }
}
