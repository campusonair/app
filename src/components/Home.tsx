import * as React from "react";
import { Container } from 'react-bootstrap'
import Video from './Video'

type Props = {};

const Content = (props: Props) => {
  return (
    <Container>
      <Video />
    </Container>
  );
};

export default Content;
