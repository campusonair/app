import * as React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from '../Video'
import { __ } from '@wordpress/i18n'
import Guests from '../Studio/Guests'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()

  React.useEffect(() => {
    const peer = new Peer({ key: Config.skyWayApiKey });
    // peer.on('open', () => {
    //   const videoOptions = {
    //     video: {
    //       width: 1280,
    //       height: 720
    //     },
    //     audio: true
    //   }
    //   const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
    //   userMedia.then((stream) => {
    //     const room = peer.joinRoom(liveId!, {
    //       mode: 'sfu',
    //       stream: stream,
    //     });
    //   })
    // })
  }, [])

  const container = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    console.log(container.current)
  }, [container.current])

  return (
    <Container>
      {/* {time && <div ref={container}>{time}</div>} */}
    </Container>
  );
};

export default Content;
