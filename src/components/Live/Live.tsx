import * as React from "react";
import { Container,Row,Col, Button } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'
import {addCanvasVideos} from './addCanvasVideos'
import {clearCanvas} from './clearCanvas'

type Props = {};

const Content = (props: Props) => {

  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)
  const [leaveId, setLeaveId] = React.useState<string|null>(null)

  const canvas = React.useRef<HTMLCanvasElement>(null);
  const [canvasVideos, setCanvasVideos] = React.useState<Array<HTMLVideoElement>>([])

  const onSetCanvasMedia = (video: HTMLVideoElement | null) => {
    if(!video || canvasVideos.includes(video)){
      return
    }
    canvasVideos.push(video)
    setCanvasVideos(canvasVideos)
  };

  const onRemoveCanvasMedia =(video: HTMLVideoElement | null)=> {

    const index = canvasVideos.findIndex(item => item === video )
    if(!video || -1 === index ){
      return
    }
    canvasVideos.splice(index,1)
    setCanvasVideos(canvasVideos)
    clearCanvas(canvas, canvasVideos, index)
  }

  React.useEffect(() => {
    if (!canvas.current || !canvasVideos) {
      return;
    }
    addCanvasVideos(canvas,canvasVideos);
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

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        });

        room.on('stream', async stream => {
          if(peer.id !== stream.peerId){
            setGuestMedia(stream)
          }
        });

        room.on('peerLeave', peerId => {
          setLeaveId(peerId)
        });

      })
    })

  }, [])

  return (
    <div className={"live-container"}>
    <Container fluid>
      <Row>
        <Col xs={9}>
          <canvas ref={canvas} className={"canvas"} width={"1280"} height={"720"}/>
          <div className={"scene"}>
            <button>Scene</button>
            <button>Scene</button>
            <button>Scene</button>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} onSetCanvasMedia={onSetCanvasMedia} onRemoveCanvasMedia={onRemoveCanvasMedia}/>
            </div>
            <Guests media={guestMedia} leave={leaveId} onSetCanvasMedia={onSetCanvasMedia} onRemoveCanvasMedia={onRemoveCanvasMedia}/>
            <Button variant="secondary">+</Button>
          </div>
        </Col>
        <Col xs={3}>
          <div className={"sidebar"}>Sidebar</div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Content;
