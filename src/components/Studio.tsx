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

  const userMedia = navigator.mediaDevices.getUserMedia(videoOptions)
  const guestVideos = React.useRef<HTMLDivElement>(null);
  const peer = new Peer({ key: Config.skyWayApiKey });
  userMedia.then(localStream => {

    peer.on('open', () => {

      const room = peer.joinRoom(liveId!, {
        mode: 'sfu',
        stream: localStream,
      });
      //参加者が追加されると呼び出し
      room.on('stream', async stream => {

        if (stream.peerId === peer.id) {
          return
        }
        const newVideoContainer = document.createElement('div');
        newVideoContainer.className = 'video ';
        // //ビデオタグを作成
        const newVideo = document.createElement('video');
        newVideoContainer.appendChild(newVideo);
        //参加者の動画をセット
        newVideo.srcObject = stream;
        //離脱時のIDとして、peerIdをセット
        newVideo.setAttribute('data-peer-id', stream.peerId);
        //ビデオタグを追加
        guestVideos.current!.append(newVideoContainer);
        //再生開始
        await newVideo.play().catch(console.error);
      });
    })
  })

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
            <div className="guests videos" ref={guestVideos} />
          </div>
        </Col>
        <Col xs={3}>
        </Col>
      </Row>
    </Container>
  );
};

export default Content;
