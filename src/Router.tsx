import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "./Home";
import Hello from "./Hello";


function Content() {
  return (
    <HashRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/hello" component={Hello} />
    </HashRouter>
  );
}

export default Content;