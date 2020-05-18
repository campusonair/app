import * as React from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from "react-router-dom"
import Video from './Video'
import LiveCanvas from './Studio/LiveCanvas'
import InviteButton from './InviteButton'
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

  const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
  const localStream = navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);

  const remoteVideos = React.useRef<HTMLDivElement>(null);

  const peer = new Peer({ key: Config.skyWayApiKey });

  const stream = (peer: Peer, roomId: string, localStream: MediaStream) => {

    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    const room = peer.joinRoom(roomId, {
      mode: 'mesh', //'sfu' or 'mesh'
      stream: localStream,
    });

    // Render remote stream for new peer join in the room
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      // mark peerId to find it later at peerLeave event
      newVideo.setAttribute('data-peer-id', stream.peerId);
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });


    // for closing room members
    room.on('peerLeave', peerId => {
      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id=${peerId}]`
      );
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();
    });

    // for closing myself
    room.once('close', () => {
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    // leaveTrigger.addEventListener('click', () => room.close(), { once: true });
  }

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
        </Col>
        <Col xs={3}>
          <div ref={remoteVideos} />
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
