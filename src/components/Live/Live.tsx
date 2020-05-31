import * as React from "react";
import { Container,Row,Col, Button } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)
  const [leaveId, setLeaveId] = React.useState<string|null>(null)
  const [canvasMedias, setCanvasMedias] = React.useState<Array<HTMLVideoElement>>([])
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {

    if (!canvas.current) {
      return;
    }
    const canvasContext = canvas.current.getContext("2d", { desynchronized: true });
    draw(canvasMedias!,canvasContext);

  }, []);

  const onSetCanvasMedia = (video: HTMLVideoElement | null) => {
    if(!video || canvasMedias.includes(video)){
      return
    }
    canvasMedias.push(video)
    setCanvasMedias(canvasMedias)
  };

  const onRemoveCanvasMedia =(video: HTMLVideoElement | null)=> {
    if(!video || !canvasMedias.includes(video)){
      return
    }
    canvasMedias.forEach((item, index) => {
      if(item === video) {
        canvasMedias.splice(index,1)
      }
    });
    setCanvasMedias(canvasMedias)
    const canvasContext = canvas!.current!.getContext("2d", { desynchronized: true });
    //Render Area in Canvas
    const renderWidth = canvas.current!.width/(canvasMedias.length?canvasMedias.length:1)
    const renderHeight = canvas.current!.height
    const renderStartX = 0
    const renderStartY = 0
    canvasContext!.clearRect( renderStartX, renderStartY, renderWidth, renderHeight)
  }

  const draw = (
    videos: Array<HTMLVideoElement>,
    canvasContext:CanvasRenderingContext2D | null
  ) => {

    if (!videos || !canvasContext){
      return false;
    }

    canvasContext!.clearRect( 0, 0, canvas.current!.width, canvas.current!.height)

    videos.forEach((video,index)=>{

      //Render Area in Canvas
      const renderWidth = canvas.current!.width/(canvasMedias.length?canvasMedias.length:1)
      const renderHeight = canvas.current!.height
      const renderStartX = renderWidth * index
      console.log(renderStartX)
      const renderStartY = 0

      //Cropped Video Size
      const targetAspect = renderWidth/renderHeight
      const cropWidth = targetAspect * video.videoHeight
      const cropHeight = video.videoHeight
      const cropStartX = (video.videoWidth - cropWidth)/canvasMedias.length
      const cropStartY = 0

      canvasContext!.drawImage(video, cropStartX, cropStartY, cropWidth , cropHeight , renderStartX, renderStartY, renderWidth, renderHeight);
    })

    requestAnimationFrame(()=>{
      draw(videos,canvasContext)
    })
  };

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
