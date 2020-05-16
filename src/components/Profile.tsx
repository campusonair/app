import React from "react";
import { Container } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";
import Loading from './Loading'

const Profile = () => {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <Container><Loading /></Container>
  }

  return (
    <Container>
      <img src={user.picture} alt="Profile" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </Container>
  );
};

export default Profile;
