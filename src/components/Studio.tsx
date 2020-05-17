import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()

  return (
    <Container>
      StudioId is {liveId}.
    </Container>
  );
};

export default Content;
