import * as React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from './Video'
import LiveCanvas from './Studio/LiveCanvas'
import InviteButton from './InviteButton'
import Peer from 'skyway-js'
import Config from '../config'

import './Studio.scss'
import { Stream } from "stream";

type Props = {};

const Content = (props: Props) => {
  const { liveId } = useParams()
  const videoOptions = {
    video: {
      width: 1280,
      height: 720
    },
    audio: true
  }

  const [remoteStream, setRemoteStream] = React.useState<MediaStream | null>(null)
  const [inputValue, setInputValue] = React.useState<string | undefined>('')

  const input = React.useRef<HTMLInputElement>(null);

  const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)

  const enterLive = (localStream: MediaStream) => {


    const setEventListener = (mediaConnection: any) => {
      mediaConnection.on('stream', (stream: any) => {
        console.log(stream)
        setRemoteStream(stream)
      });
    }

    const peer = new Peer({ key: Config.skyWayApiKey, debug: 3 })

    peer.on('open', () => {
      console.log(peer.id)
      console.log(inputValue)

      if (!inputValue) {
        return
      }

      const mediaConnection = peer.call(inputValue, localStream);

      setEventListener(mediaConnection);
      peer.on('call', mediaConnection => {
        mediaConnection.answer(localStream);
        setEventListener(mediaConnection);
      });

      console.log(remoteStream)

      // const room = peer.joinRoom(liveId, {
      //   mode: 'mesh', //'sfu' or 'mesh'
      //   stream: localStream,
      // });

      // room.on('stream', async stream => {
      //   remoteStream?.push(stream)
      //   console.log(remoteStream)
      //   setRemoteStream(remoteStream)
      // });

    });
  }

  userMedia.then(localStream => {
    enterLive(localStream)
  }).catch(error => console.log(error))

  return (
    <Container className="studio">
      <Row>
        <Col xs={9}>
          <div className="canvas-container">
            <LiveCanvas></LiveCanvas>
          </div>
          <div className="controls-container">

          </div>
          <div className="videos-container">
            <div className="me videos">
              <Video media={userMedia} />
            </div>
          </div>
          <div className="invite-btn-container">
            <InviteButton />
          </div>
          <input type='text' onClick={() => { setInputValue(input.current?.value) }} ref={input} />
          {console.log(remoteStream)}
          <video ref={video => {
            if (undefined !== video && null !== video) {
              video!.srcObject = remoteStream
            }
          }} />
        </Col>
        <Col xs={3}>

        </Col>
      </Row>
    </Container>
  );
};

export default Content;
