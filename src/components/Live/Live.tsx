import * as React from "react";
import { Container,Row,Col } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'
import {setUpCanvas} from '../../utils/canvas/setUp'
import {drawCanvas} from '../../utils/canvas/draw'
import {useStyles} from '../../assets/mui-styles'

type Props = {};

interface CanvasElement extends HTMLCanvasElement {
  captureStream(): MediaStream;
}

const Content = (props: Props) => {

  const classes = useStyles();
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
        return ""
      }else{
        return video!.srcObject!.id
      }
    })
  }

  const canvasAddVideo = (video: HTMLVideoElement | null) => {

    if(!video || !video.srcObject || canvasVideos.includes(video) || !ownerMedia || !canvasMedia || !('id' in video.srcObject) || !canvas.current){
      return
    }

    if(video.srcObject.id === ownerMedia.id){
      canvasMedia.removeTrack(canvasMedia.getVideoTracks()[0])
      canvasMedia.addTrack(video.srcObject.getVideoTracks()[0])
      video.srcObject = canvasMedia
    }

    video.srcObject.getAudioTracks().forEach(track => track.enabled = true);

    canvasVideos.push(video)
    setCanvasVideos(canvasVideos)

    const canvasVideosId = getCanvasVideoId(canvasVideos)

    room.send({canvasVideosId:canvasVideosId})
  };

  const removeVideo = (canvasVideos:HTMLVideoElement[],peerId:string) =>{
    const index = canvasVideos.findIndex((item:any) => {return item.srcObject.peerId === peerId} )
    if(-1 === index){
      return canvasVideos
    }
    canvasVideos.splice(index,1)
    drawCanvas(canvas,canvasVideos,0)
    return canvasVideos
  }

  const canvasRemoveVideo =(video: any | null)=> {

    if(!video || !video.srcObject || !ownerMedia || !('id' in video.srcObject)){
      return
    }
    video!.srcObject!.getAudioTracks().forEach((track:any) => track.enabled = false);
    setCanvasVideos(removeVideo(canvasVideos, video.srcObject.peerId))
    const canvasVideosId = getCanvasVideoId(canvasVideos)
    room.send({canvasVideosId:canvasVideosId})
  }

  React.useEffect(() => {
    if (!canvas.current || !canvasVideos) {
      return;
    }
    drawCanvas(canvas,canvasVideos,0)
  }, [canvasVideos]);


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

            stream.getAudioTracks().forEach(track => track.enabled = false);
            setGuestMedia(stream)
           }
        });

        room.on('peerLeave', peerId => {

          setLeaveId(peerId)
          setCanvasVideos((canvasVideos)=>{
            return removeVideo(canvasVideos,peerId)
          })

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
        <Col xs={12} md={12}>
          <canvas ref={canvas} className={`canvas ${classes.canvas}`} width={"1280"} height={"720"}/>
          <div className={"scene"}>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={true}/>
            </div>
            <Guests media={guestMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={false}/>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Content;
