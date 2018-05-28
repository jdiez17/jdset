import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import { history } from "./store.js";
import App from "./components/App";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

import modules from "./modules";

const routes = modules.map((module) =>
  <Route key={module.path} path={module.path} component={module.component} />);

// build the router
const router = (
  <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>

      {routes}

      <Route path="*" component={NotFound}/>
    </Route>
  </Router>
);

// export
export { router };
