import * as React from "react";
import { Container,Row,Col, Button } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'
import {setUpCanvas} from '../../utils/canvas/setUp'
import {drawCanvas} from '../../utils/canvas/draw'
import {mute} from '../../utils/audio/mute'

type Props = {};

interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

const Content = (props: Props) => {

  // const { liveId } = useParams()
  const liveId  = 'devRoom'

  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)

  const [canvasMedia, setCanvasMedia] = React.useState<MediaStream|null>(null)
  const canvas = React.useRef<CanvasElement>(null);
  const [canvasVideos, setCanvasVideos] = React.useState<Array<HTMLVideoElement>>([])

  const [room, setRoom] = React.useState<any|null>(null)
  const [leaveId, setLeaveId] = React.useState<string|null>(null)


  const getCanvasVideoId = (canvasVideos:HTMLVideoElement[]) =>{
    return canvasVideos.map((video) => {
      if(!video || !video.srcObject || !('id' in video.srcObject)){
        return
      }else{
        return video!.srcObject!.id
      }
    })
  }

  const updateOwnerMediaAudio = ( canvasMedia:MediaStream|null, ownerMedia:MediaStream|null, video:HTMLVideoElement ) =>{

    if(!canvasMedia || !video || !video.srcObject || !ownerMedia || !('id' in video.srcObject)){
      return
    }
    if(video.srcObject.id === ownerMedia.id){
      canvasMedia.removeTrack(canvasMedia.getVideoTracks()[0])
      canvasMedia.addTrack(video.srcObject.getVideoTracks()[0])
    }
  }


  const canvasAddVideo = (video: HTMLVideoElement | null) => {

    if(!video || !video.srcObject || canvasVideos.includes(video) || !ownerMedia || !canvasMedia || !('id' in video.srcObject)){
      return
    }

    updateOwnerMediaAudio(canvasMedia,ownerMedia,video)
    video.srcObject.getAudioTracks().forEach(track => track.enabled = true);

    canvasVideos.push(video)
    setCanvasVideos(canvasVideos)

    const canvasVideosId = getCanvasVideoId(canvasVideos)

    room.send({canvasVideosId:canvasVideosId})
  };

  const canvasRemoveVideo =(video: HTMLVideoElement | null)=> {

    if(!video || !video.srcObject || !ownerMedia || !('id' in video.srcObject)){
      return
    }

    if(video.srcObject.id === ownerMedia.id){
      video.srcObject = canvasMedia
    }

    const muteAudio = mute(video.srcObject,false)
    video.srcObject = muteAudio

    const index = canvasVideos.findIndex(item => item === video )

    if(-1 === index){
      return
    }

    canvasVideos.splice(index,1)
    drawCanvas(canvas,canvasVideos,0)
    setCanvasVideos(canvasVideos)

    const canvasVideosId = getCanvasVideoId(canvasVideos)

    room.send({canvasVideosId:canvasVideosId})
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

        const canvasStream = setUpCanvas(canvas,localStream)

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: canvasStream,
        });

        room.on('stream', async stream => {

           if(peer.id !== stream.peerId){

            const muteStream = mute(stream,false)
            setGuestMedia(muteStream)
           }
        });

        room.on('peerLeave', peerId => {
          setLeaveId(peerId)
        });

        setOwnerMedia(localStream)
        setCanvasMedia(canvasStream!)
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
          <div className={"scene"}>
            <Button variant="secondary">Scene1</Button>
            <Button variant="secondary">Scene2</Button>
            <Button variant="secondary">Scene3</Button>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={true}/>
            </div>
            <Guests media={guestMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={false}/>
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
