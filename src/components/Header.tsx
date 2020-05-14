import React from "react";
import { Navbar, NavDropdown } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <Navbar className="justify-content-between">
      <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
      {!isAuthenticated && (<button onClick={() => loginWithRedirect({})}>Log in</button>)}
      {isAuthenticated &&
        <NavDropdown title="Dropdown" id="basic-nav-dropdown" alignRight>
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
        </NavDropdown>
      }
    </Navbar>
  );
};

export default NavBar;
