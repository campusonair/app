import * as React from "react";
import Dashboard from "./Dashboard"
import { __ } from '@wordpress/i18n'
import Peer from 'skyway-js'
import { getLiveId } from '../utils/api'
import { useAuth0 } from "../react-auth0-spa";
import Config from '../config'
import ViewerStudio from './ViewerStudio'

type Props = {};

const Content = (props: Props) => {

  const [displayDashbord, setDisplayDashbord] = React.useState<boolean>(true)
  const [displayStudio, setdisplayStudio] = React.useState<boolean>(false)



  const handleCreateStudio = async () => {
    // const peer = new Peer({ key: Config.skyWayApiKey });

    // const claims = await auth0Client.getIdTokenClaims()
    // const id_token = claims.__raw

    // peer.on('open', () => {
    //   const studioId = getLiveId(peer.id, id_token)
    //   window.location.href = `/studio/${studioId}`
    // });
    //webrtc接続するコード
    setDisplayDashbord(!displayDashbord)
    setdisplayStudio(!displayStudio)
  }
  return (
    <>
      {displayDashbord && <Dashboard buttonLabel={__("Enter the Live")} handleCreateStudio={handleCreateStudio} />}
      {displayStudio && <ViewerStudio />}
    </>
  );
};
export default Content;
