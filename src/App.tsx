import React from "react";
import Header from "./components/Header";
import { Container } from 'react-bootstrap'

// New - import the React Router components, and the Profile page component
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import history from "./utils/history";

function App() {
  return (
    <div className="App">
      {/* Don't forget to include the history module */}
      <Container>
        <Router history={history}>
          <Header />
          <Switch>
            <Route path="/" exact />
            <Route path="/profile" component={Profile} />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
