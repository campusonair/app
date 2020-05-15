import React from "react";
import { Navbar, NavDropdown, Button } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout, loading, user } = useAuth0();
  const [userName, setUserName] = React.useState<string>('')

  React.useEffect(() => {
    if (isAuthenticated && (!loading || user)) {
      setUserName(user.nickname)
    }
  }, [loading, user, isAuthenticated])

  return (
    <Navbar className="justify-content-between">
      <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
      {!isAuthenticated && !loading && (<Button onClick={() => loginWithRedirect({})}>Log in</Button>)}
      {userName &&
        <NavDropdown title={userName} id="basic-nav-dropdown" alignRight>
          <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
        </NavDropdown>
      }
    </Navbar>
  );
};

export default NavBar;
