import * as React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from './Video'
import LiveCanvas from './Studio/LiveCanvas'
import Peer from 'skyway-js'
import Config from '../config'

import './Studio.scss'

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

  const [join, setJoin] = React.useState<Boolean>(true);
  const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
  const guestVideos = React.useRef<HTMLDivElement>(null);

  const joinLive = (userMedia: Promise<MediaStream>, guestVideos: React.RefObject<HTMLDivElement>
  ) => {

    const peer = new Peer({ key: Config.skyWayApiKey });

    userMedia.then(localStream => {

      peer.on('open', () => {

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        });

        //Call when new user entered.
        room.on('stream', async stream => {

          if (stream.peerId === peer.id) {
            return
          }
          const newVideoContainer = document.createElement('div');

          newVideoContainer.className = 'video ';

          const newVideo = document.createElement('video');

          newVideoContainer.appendChild(newVideo);
          //Set new user's stream.
          newVideo.srcObject = stream;
          //Set data-peer-id for stop this video for later.
          newVideo.setAttribute('data-peer-id', stream.peerId);

          guestVideos.current!.append(newVideoContainer);

          await newVideo.play().catch(console.error);
        });
      })
    })
  }

  return (
    <Container>
      <Row>
        <Col xs={9}>
          <div className="videos-container">
            <div className="me videos">
              <Video media={userMedia} />
            </div>
            <div className="guests videos" ref={guestVideos} />
          </div>
          {join && <button onClick={() => {
            joinLive(userMedia, guestVideos)
            setJoin(!join)
          }}>Join Live</button>}
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
