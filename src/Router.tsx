import React from "react";
import { HashRouter, Route } from "react-router-dom";

function Content() {
  return (
    <HashRouter>
      <Route exact path="/">Hello</Route>
    </HashRouter>
  );
}

export default Content;
