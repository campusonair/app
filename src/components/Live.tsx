import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Dashboard from './Dashboard'

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()
  return (
    <Container>
    </Container>
  );
};

export default Content;
