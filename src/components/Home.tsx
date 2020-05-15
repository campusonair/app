import * as React from "react";
import { Container } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";
import Video from './Video'

type Props = {};

const Content = (props: Props) => {
  const { isAuthenticated } = useAuth0();

  let HomeContent
  if (isAuthenticated) {
    HomeContent = (<Video />)
  } else {
    HomeContent = (<></>)
  }

  return (
    <Container>{HomeContent}</Container>
  );
};

export default Content;
