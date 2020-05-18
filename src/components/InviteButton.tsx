import * as React from "react";
import { __ } from '@wordpress/i18n'
import { useParams } from "react-router-dom"

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()
  const [inviteUrl, setInviteUrl] = React.useState<boolean>(false)

  return (
    <>
      <button onClick={() => setInviteUrl(!inviteUrl)}>{__("Invite guest")}</button>
      {inviteUrl && <div>{window.location.origin}/studio/{liveId}</div>}
    </>
  );
};
export default Content;
