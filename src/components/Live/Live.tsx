import * as React from "react";
import { Container } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from '../Video'
import { __ } from '@wordpress/i18n'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [stream, setStream] = React.useState<MediaStream | null>(null)

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

      userMedia.then((stream) => {
        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: stream,
        });

        room.on('stream', async stream => {
          setStream(stream)
        });
      })
    })

  }, [])

  return (
    <Container>
     <div>Hello</div>
     <Guest stream={stream}/>
    </Container>
  );
};

export default Content;
