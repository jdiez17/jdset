import React from "react";
import { Label, Form, FormGroup, Input, Button, Col, Progress } from "reactstrap";

const elements = [
  {
    'human': 'Inclination, i (deg)',
    'id': 'i'
  },
  {
    'human': 'RAAN, Omega (deg)',
    'id': 'raan'
  },
  {
    'human': 'Eccentricity, e (ratio)',
    'id': 'e'
  },
  {
    'human': 'Arg. of Perigee, w (deg)',
    'id': 'w'
  },
  {
    'human': 'Mean motion, n (rev/day)',
    'id': 'n'
  },
  {
    'human': 'Mean anomaly, M (deg)',
    'id': 'M'
  }
]

const iss_tle = `1 25544U 98067A   18147.88070465  .00016717  00000-0  10270-3 0  9039
2 25544  51.6366 119.9449 0003554 127.8246 232.3229 15.54100484 35354`;
const molniya_tle = `1 25544U 98067A   18147.88070465  .00016717  00000-0  10270-3 0  9039
2 25544  51.6366 119.9449 0003554 127.8246 232.3229 15.54100484 35354`;

function tle2kepler(tle) {
  const lines = tle.split("\n");
  const i = parseFloat(lines[1].slice(8, 15));
  const raan = parseFloat(lines[1].slice(17, 24));
  const e = parseFloat("0." + lines[1].slice(26, 32));
  const w = parseFloat(lines[1].slice(34, 41));
  const M = parseFloat(lines[1].slice(43, 50));
  const n = parseFloat(lines[1].slice(52, 62));

  return {i, raan, e, w, M, n};
}

function state2tle(state) {
  var tle = state.tle;
  return tle;
}

export default class OPSForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      tle: iss_tle
    };
    Object.assign(this.state, tle2kepler(this.state.tle));


    this.handleTLEChange = this.handleTLEChange.bind(this);
    this.handleElementChange = this.handleElementChange.bind(this);
    this.onPlotOrbitClick = this.onPlotOrbitClick.bind(this);
  }

  handleTLEChange(ev) {
    var newState = {tle: ev.target.value};
    Object.assign(newState, tle2kepler(newState.tle));
    this.setState(newState);
  }

  handleElementChange(el, ev) {
    var newState = {};
    newState[el] = parseFloat(ev.target.value);
    this.setState(newState, () => {
      this.setState({tle: state2tle(this.state)});
    });
  }

  onPlotOrbitClick() {
    this.props.onAddOrbit(this.state.i, this.state.w, this.state.raan, this.state.e, this.state.n);
  }

  render() {
    var groups = [];
    for(var i = 0; i < elements.length; i += 2) {
      let makeInput = (element) => [
        <Col sm={3} key={element.id + "-label"}>
          <Label for={element.id} className="col-form-label">
            {element.human}
          </Label>
        </Col>,
        <Col sm={3} key={element.id + "-input"}>
          <Input
            type="number"
            id={element.id}
            value={this.state[element.id]}
            onChange={(ev) => this.handleElementChange(element.id, ev)}
          />
        </Col>
      ];

      groups.push(<FormGroup row key={"elements-" + i}>
        {makeInput(elements[i])}
        {makeInput(elements[i+1])}
      </FormGroup>);
    }

    return (
      <div>
        <Form className="bg-light rounded controls">
          <h5>TLE</h5>
          <Input 
            type="textarea" style={{"fontFamily": "monospace"}} 
            value={this.state.tle} onChange={this.handleTLEChange} />
         
          <hr />

          <h5>Keplerian Elements</h5>
          {groups}
          <hr />

          <div className="row">
            <Col sm>
              <Button
                onClick={this.onPlotOrbitClick}
                color="success"
              >Plot Orbit</Button>
            </Col>
            <Col sm>
              <Button
                onClick={this.props.onClearOrbits}
              >Clear Orbits</Button>
            </Col>
          </div>
        </Form>

      </div>
    );
  }

}
