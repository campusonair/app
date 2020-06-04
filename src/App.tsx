import React from "react";
import Header from "./components/Header";
import { Container } from 'react-bootstrap'
import { useAuth0 } from "./react-auth0-spa";
import { Router, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import Home from "./components/Home"
import MasterDashbord from "./components/MasterDashbord"
import Studio from "./components/Studio"
import Live from "./components/Live/Live"
import LiveGuest from "./components/Live/LiveGuest"
import NoMatch from "./components/NoMatch"

import history from "./utils/history";
import "./App.scss"

function App() {
  const { isAuthenticated, loading } = useAuth0();

  return (
    <div className="App">
      {/* Don't forget to include the history module */}
      <Container fluid>
        <Router history={history}>
          <Header />
          <Switch>
            {!isAuthenticated && !loading && <Route path="/" exact component={Home} />}
            {isAuthenticated && !loading &&
              <>
                <Route path="/" exact component={MasterDashbord} />
                <Route path="/profile" exact component={Profile} />
                <Route path="/studio/:liveId" exact component={Studio} />
              </>
            }
            <Route path="/live" exact component={Live} />
            <Route path="/live/guest" exact component={LiveGuest} />

            {!loading && <Route path="*"><NoMatch /></Route>}
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
