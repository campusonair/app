import * as React from "react";
import { Container,Row,Col, Button } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'
import {setUpCanvas} from '../../utils/canvas/setUp'
import {drawCanvas} from '../../utils/canvas/draw'
import {mixAudio} from '../../utils/audio/mix'
import {muteAudio} from '../../utils/audio/mute'


type Props = {};

interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

const Content = (props: Props) => {

  // const { liveId } = useParams()
  const liveId  = 'devRoom'

  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)
  const [leaveId, setLeaveId] = React.useState<string|null>(null)
  const canvas = React.useRef<CanvasElement>(null);
  const audio = React.useRef<HTMLAudioElement>(null);
  const [canvasVideos, setCanvasVideos] = React.useState<Array<HTMLVideoElement>>([])
  const [mixedMedia, setMixedMedia] = React.useState<MediaStream|null>(null)
  const [room, setRoom] = React.useState<any|null>(null)

  const canvasAddVideo = (video: HTMLVideoElement | null) => {
    if(!video || !video.srcObject || canvasVideos.includes(video)){
      return
    }
    canvasVideos.push(video)
    mixAudio({canvasVideos,mixedMedia,audio,room})
    setCanvasVideos(canvasVideos)
  };

  const canvasRemoveVideo =(video: HTMLVideoElement | null)=> {
    const index = canvasVideos.findIndex(item => item === video )
    if(!video || !video.srcObject || -1 === index ){
      return
    }
    canvasVideos.splice(index,1)
    muteAudio({canvasVideos,mixedMedia,audio,room})
    drawCanvas(canvas,canvasVideos,0)
    setCanvasVideos(canvasVideos)
  }

  React.useEffect(() => {
    if (!canvas.current || !canvasVideos) {
      return;
    }
    drawCanvas(canvas,canvasVideos,0)
  }, []);


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
        setOwnerMedia(localStream)

        const canvasStream = setUpCanvas(canvas,localStream)
        setMixedMedia(canvasStream!)

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: canvasStream,
        });

        room.on('stream', async stream => {

          if(peer.id !== stream.peerId){

            stream.getAudioTracks().forEach(track => track.enabled = false);
            setGuestMedia(stream)
          }
        });

        room.on('peerLeave', peerId => {
          setLeaveId(peerId)
        });

        setRoom(room)

     })
    })
  }, [])

  return (
    <div className={"live-container"}>
    <Container fluid>
      <Row>
        <Col xs={12} md={9}>
          <canvas ref={canvas} className={"canvas"} width={"1280"} height={"720"}/>
          <audio ref={audio} autoPlay={true}/>
          <div className={"scene"}>
            <Button variant="secondary">Scene1</Button>
            <Button variant="secondary">Scene2</Button>
            <Button variant="secondary">Scene3</Button>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} />
            </div>
            <Guests media={guestMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} />
            <Button variant="secondary">+</Button>
          </div>
        </Col>
        <Col xs={12} md={3}>
          <div className={"sidebar"}>Sidebar</div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Content;
