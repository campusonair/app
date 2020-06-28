import React from "react";
import { Navbar, NavDropdown, Button } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";
// import { ReactComponent as Logo } from '../assets/logo.svg';
import logo from '../assets/logo.png';
import "./Header.scss"
import {useStyles} from '../assets/mui-styles'

const NavBar = () => {
  const classes = useStyles();
  const { isAuthenticated, loginWithRedirect, logout, loading, user } = useAuth0();
  const [userName, setUserName] = React.useState<string>('')

  React.useEffect(() => {
    if (isAuthenticated && (!loading || user)) {
      setUserName(user.name)
    }
  }, [loading, user, isAuthenticated])

  return (
    <Navbar className={`justify-content-between ${classes.navbar}`}>
      <Navbar.Brand href="/"><img src={logo} className={`${classes.logo}`} alt="Logo" /></Navbar.Brand>
      {!isAuthenticated && !loading && (<Button className={`${classes.btn_primary}`} onClick={() => loginWithRedirect({})}>Log in</Button>)}
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
