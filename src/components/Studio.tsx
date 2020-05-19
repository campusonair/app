import * as React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from './Video'
import LiveCanvas from './Studio/LiveCanvas'
import InviteButton from './InviteButton'
import { joinLive } from '../utils/joinLive'

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

  const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
  const insertGuestsVideo = React.useRef<HTMLDivElement>(null);

  joinLive(liveId, userMedia, insertGuestsVideo)

  return (
    <Container className="studio">
      <Row>
        <Col xs={9}>
          <div className="canvas-container">
            <LiveCanvas></LiveCanvas>
          </div>
          <div className="controls-container">
          </div>
          <div className="videos-container" ref={insertGuestsVideo}>
            <div className="me videos">
              <Video media={userMedia} />
            </div>
          </div>
          <InviteButton />
        </Col>
        <Col xs={3}>
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
