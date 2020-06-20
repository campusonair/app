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
  const audio = React.useRef<HTMLAudioElement>(null);
  const [canvasVideos, setCanvasVideos] = React.useState<Array<HTMLVideoElement>>([])
  const [mixedMedia, setMixedMedia] = React.useState<MediaStream|null>(null)
  const [room, setRoom] = React.useState<any|null>(null)

  const mixAudioVideo = (canvasVideos:Array<HTMLVideoElement>)=>{

    if(!mixedMedia || !audio.current){
      return
    }

    let audioContext = new AudioContext();
    let splitter = audioContext.createChannelSplitter(2)
    let gain_node = audioContext.createGain()
    gain_node.gain.value = 1
    let merger = audioContext.createChannelMerger(2)
    let dist = audioContext.createMediaStreamDestination()

    if(0 === canvasVideos.length){
      mixedMedia.getAudioTracks().forEach(track => track.enabled = false);
      audio.current.srcObject = mixedMedia
      room.replaceStream(mixedMedia)
      return
    }

    canvasVideos.forEach(video =>{
      if(!video.srcObject || !('id' in video.srcObject)){
        return
      }
      video.srcObject.getAudioTracks().forEach(track => track.enabled = true);
      let source = audioContext.createMediaStreamSource(video.srcObject)
      source.connect(splitter)
      splitter.connect(gain_node)
      gain_node.connect(
        merger,
          0,
          0
        )
        merger.connect(dist)
    })

    let stream = dist.stream;
    if(!stream){
      return
    }

    if(mixedMedia.getAudioTracks()[0]){
      mixedMedia.removeTrack(mixedMedia.getAudioTracks()[0])
      mixedMedia.addTrack(stream.getAudioTracks()[0])
    }else{
      mixedMedia.addTrack(stream.getAudioTracks()[0])
    }
    audio.current.srcObject = mixedMedia
    room.replaceStream(mixedMedia)
  }

  const canvasAddVideo = (video: HTMLVideoElement | null) => {

    if(!video || !video.srcObject || canvasVideos.includes(video)){
      return
    }
    canvasVideos.push(video)
    mixAudioVideo(canvasVideos)
    setCanvasVideos(canvasVideos)
  };

  const canvasRemoveVideo =(video: HTMLVideoElement | null)=> {
    const index = canvasVideos.findIndex(item => item === video )
    if(!video || !video.srcObject || -1 === index ){
      return
    }
    canvasVideos.splice(index,1)
    mixAudioVideo(canvasVideos)
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

        if(!canvas.current?.captureStream()){
          return
        }
        let video_stream = new MediaStream();
        video_stream.addTrack(canvas.current?.captureStream().getVideoTracks()[0])
        localStream.getAudioTracks().forEach(track => track.enabled = false);
        video_stream.addTrack(localStream.getAudioTracks()[0])
        setMixedMedia(video_stream)

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: video_stream,
        });

        setRoom(room)

        room.on('stream', async stream => {
          if(peer.id !== stream.peerId){
            stream.getAudioTracks().forEach(track => track.enabled = false);
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
          <audio ref={audio} autoPlay={true}/>
          <div className={"scene"}>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene1</Button>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene2</Button>
            <Button variant="secondary" onClick={canvasChangeLayout}>Scene3</Button>
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
