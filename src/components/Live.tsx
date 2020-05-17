import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"

type Props = {};

const Content = (props: Props) => {
  const { studioId } = useParams()

  return (
  <Container>Live id is {studioId}</Container>
  );
};

export default Content;
