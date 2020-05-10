import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Home from "./Home";

function Content() {
  return (
    <HashRouter>
      <Route exact path="/" component={Home} />
    </HashRouter>
  );
}

export default Content;
