import * as React from "react";
import { Container, Button } from 'react-bootstrap'
import { useAuth0 } from "../react-auth0-spa";
import { __ } from '@wordpress/i18n'

type Props = {};

const Content = (props: Props) => {
  const { isAuthenticated } = useAuth0();

  return (
    <Container>
      <Button>{__("Create a studio")}</Button>
    </Container>
  );
};

export default Content;
