import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import { history } from "./store.js";
import App from "./components/App";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

import SolarPanelEfficiency from "./components/SolarPanelEfficiency";
import OrbitalParameterSimulator from "./components/OrbitalParameterSimulator";

// build the router
const router = (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
			<Route path="/solar-panel-efficiency" component={SolarPanelEfficiency}/>
			<Route path="/orbital-parameter-simulator" component={OrbitalParameterSimulator}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// export
export { router };
