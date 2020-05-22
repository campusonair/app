import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from '../Video'
import { __ } from '@wordpress/i18n'
import Guests from './Guests'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)

  React.useEffect(() => {
    const peer = new Peer({ key: Config.skyWayApiKey });

    peer.on('open', () => {

      const videoOptions = {
        video: {
          width: 1280,
          height: 720
        },
        audio: true
      }
      const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)

      userMedia.then((localStream) => {
        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        });

        room.on('stream', async stream => {
          setGuestMedia(stream)
        });
      })
    })

  }, [])

  return (
    <Container>
     <div>Hello</div>
     <Guests media={guestMedia}/>
    </Container>
  );
};

export default Content;
