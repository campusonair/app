import React from "react";
import Header from "./components/Header";
import { Container } from 'react-bootstrap'
import { useAuth0 } from "./react-auth0-spa";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"
import history from "./utils/history";

function App() {
  const { isAuthenticated, loading } = useAuth0();

  return (
    <div className="App">
      {/* Don't forget to include the history module */}
      <Container>
        <Router history={history}>
          <Header />
          <Switch>
            {!isAuthenticated && !loading && <Route path="/" exact component={Home} />}
            {isAuthenticated && !loading && <Route path="/" exact component={Dashboard} />}
            <Route path="/profile" exact component={Profile} />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
