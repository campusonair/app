import * as React from "react";
import { Button } from 'react-bootstrap'
import { __ } from '@wordpress/i18n'
import { useParams } from "react-router-dom"

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()
  const [inviteUrl, setInviteUrl] = React.useState<boolean>(false)

  return (
    <>
      <Button variant="primary" onClick={() => setInviteUrl(!inviteUrl)}>{__("Invite guest")}</Button>
      {inviteUrl && <div>{window.location.origin}/live/{liveId}</div>}
    </>
  );
};
export default Content;
