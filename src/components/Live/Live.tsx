import * as React from "react";
import { Container,Row,Col, Button } from 'react-bootstrap'
import Guests from './Guests'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'
import {drawCanvas} from '../../utils/canvas/draw'
import {clearCanvas} from '../../utils/canvas/clear'

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
  const [canvasVideos, setCanvasVideos] = React.useState<Array<HTMLVideoElement>>([])
  const [canvasAudios, setCanvasAudios] = React.useState<Array<MediaStreamTrack>>([])

  const [mixedMedia, setMixedMedia] = React.useState<MediaStream|null>(null)

  const mixAudioVideo = (canvasAudios :Array<MediaStreamTrack>, mixedMedia:MediaStream)=>{

    if(!canvasAudios || [] === canvasAudios){
      return
    }

    let audioContext = new AudioContext();
    let splitter = audioContext.createChannelSplitter(2)
    let gain_node = audioContext.createGain()
    gain_node.gain.value = 1
    let merger = audioContext.createChannelMerger(2)
    let dist = audioContext.createMediaStreamDestination()

    canvasAudios.forEach(audio =>{
      // console.log(audio)
      // let source = audioContext.createMediaStreamTrackSource(audio)
      // source.connect(splitter)
      // splitter.connect(gain_node)
      // gain_node.connect(
      //   merger,
      //   0,
      //   0
      // )
      // if(2 === gain_node.numberOfInputs){
      //   gain_node.connect(
      //     merger,
      //     1,
      //     1
      //   )
      // }
      // merger.connect(dist)
      mixedMedia!.addTrack(audio)
      // mixedMedia!.addTrack(dist.stream.getAudioTracks()[0])
      // video_stream!.removeTrack(dist.stream.getAudioTracks()[0])
    })
  }

  const canvasAddVideo = (video: HTMLVideoElement | null) => {
    if(!video || !video.srcObject || canvasVideos.includes(video)){
      return
    }

    //Check type Mediastream
    if ('getAudioTracks' in video.srcObject) {
      let audio = video.srcObject?.getAudioTracks()[0]
      canvasAudios.push(audio)
      mixAudioVideo(canvasAudios,mixedMedia!)
      setCanvasAudios(canvasAudios)
    }

    canvasVideos.push(video)
    setCanvasVideos(canvasVideos)
  };

  const canvasRemoveVideo =(video: HTMLVideoElement | null)=> {
    const index = canvasVideos.findIndex(item => item === video )
    if(!video || !video.srcObject || -1 === index ){
      return
    }

    if ('getAudioTracks' in video.srcObject) {
      const audio = video.srcObject?.getAudioTracks()[0]
      const index = canvasAudios.findIndex(item => item === audio)
      canvasAudios.splice(index,1)
      mixAudioVideo(canvasAudios,mixedMedia!)
      setCanvasAudios(canvasAudios)
    }

    canvasVideos.splice(index,1)
    drawCanvas(canvas,canvasVideos,0)
    setCanvasVideos(canvasVideos)
  }

  const canvasChangeLayout = ()=>{

  }

  React.useEffect(() => {
    if (!canvas.current || !canvasVideos) {
      return;
    }
    drawCanvas(canvas,canvasVideos,0)
  }, []);

  React.useEffect(() => {

    if(!canvas.current?.captureStream()){
      return
    }
    let video_stream = new MediaStream();
    video_stream.addTrack(canvas.current?.captureStream().getVideoTracks()[0])
    setMixedMedia(video_stream)

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
        stream: video_stream,
      });

      room.on('stream', async stream => {
        stream.getAudioTracks()[0].enabled = false

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
        <Col xs={12} md={9}>
          <canvas ref={canvas} className={"canvas"} width={"1280"} height={"720"}/>
          <div className={"scene"}>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene1</Button>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene2</Button>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene3</Button>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={true} />
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
