import * as React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from './Video'
import LiveCanvas from './Studio/LiveCanvas'
import { joinLive } from '../utils/joinLive'
import { __ } from '@wordpress/i18n'

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
  const insertGuestsVideo = React.useRef<HTMLDivElement>(null);

  return (
    <Container>
      <Row>
        <Col xs={9}>
          <div className="videos-container" ref={insertGuestsVideo}>
            <div className="me videos">
              <Video media={userMedia} />
            </div>
          </div>
          <p><Button variant="primary" size="lg" block onClick={() => {
            joinLive(liveId, userMedia, insertGuestsVideo)
            setJoin(!join)
          }}>{__("Join this live")}</Button></p>
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
