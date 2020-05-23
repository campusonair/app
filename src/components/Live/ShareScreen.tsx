import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from '../Video'
import { __ } from '@wordpress/i18n'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [leaveId, setLeaveId] = React.useState<string|null>(null)

  React.useEffect(() => {
    const peer = new Peer({ key: Config.skyWayApiKey });

    peer.on('open', async () => {

      //TypeScript does not support navigator.mediaDevices.getDisplayMedia
      //https://github.com/microsoft/TypeScript/issues/33232
      //Note: getDisplayMedia works with https. You can not use it on localhost except google chrome.
      const mediaDevices = navigator.mediaDevices as any;
      const screenMedia = mediaDevices.getDisplayMedia({ video: {
        width: 1280,
        height: 720
      } });

      screenMedia.then((localStream:MediaStream) => {
        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        });

        room.on('stream', async stream => {
          setGuestMedia(stream)
        });

        room.on('peerLeave', peerId => {
          setLeaveId(peerId)
        });

      })
    })

  }, [])

  return (
    <Container>
     <div>This is the example of ShareScreen by navigator.mediaDevices.getDisplayMedia. <br/> This demo only works with https, or you can using http with chrome.</div>
     <Guests media={guestMedia} leave={leaveId}/>
    </Container>
  );
};

export default Content;
