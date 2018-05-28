import React from "react";
import Navigation from "./Navigation";
import "../stylesheets/main.scss";

// app component
export default class App extends React.Component {
  // render
  render() {
    return (
      <div>
          <div>
              <Navigation/>
          </div>
          <div className="container">
              {this.props.children}
          </div>
      </div>
    );
  }
}
