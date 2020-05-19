import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import ViewerDashbord from './ViewerDashbord'

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()
  return (
<<<<<<< HEAD
    <Container>
      <ViewerDashbord />
    </Container>
=======
    <Container>Live id is {liveId}</Container>
>>>>>>> master
  );
};
export default Content;
