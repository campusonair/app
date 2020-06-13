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
  const [mixedMedia, setMixedMedia] = React.useState<MediaStream|null>(null)
  const [room, setRoom] = React.useState<any|null>(null)

  // const mixAudioVideo = (canvasVideos :Array<HTMLVideoElement>)=>{

  //   if(!canvasVideos || !mixedMedia){
  //     return
  //   }

  //   console.log(canvasVideos)
  //   console.log(mixedMedia)
  //   console.log(room)

  //   // if(1 === canvasVideos.length && !mixedMedia.getAudioTracks()[0]){


  //   //     let stream = canvasVideos[0].srcObject;
  //   //     if(!stream || !('id' in stream)){
  //   //       return
  //   //     }

  //   //     console.log(mixedMedia.getAudioTracks())
  //   //     console.log(stream.getAudioTracks()[0])

  //   //     mixedMedia.addTrack(stream.getAudioTracks()[0])
  //   //     console.log(mixedMedia.getAudioTracks())

  //   // }else{

  //       let audioContext = new AudioContext();
  //       let splitter = audioContext.createChannelSplitter(2)
  //       let gain_node = audioContext.createGain()
  //       gain_node.gain.value = 1
  //       let merger = audioContext.createChannelMerger(2)
  //       let dist = audioContext.createMediaStreamDestination()

  //       canvasVideos.forEach(video =>{

  //       if(!video.srcObject || !('id' in video.srcObject)){
  //         return
  //       }
  //       let source = audioContext.createMediaStreamSource(video.srcObject)
  //       source.connect(splitter)
  //       splitter.connect(gain_node)
  //       gain_node.connect(
  //         merger,
  //         0,
  //         0
  //       )
  //       merger.connect(dist)
  //     })

  //     if(mixedMedia.getAudioTracks()[0]){
  //       mixedMedia.getAudioTracks()[0].stop()
  //       mixedMedia.removeTrack(mixedMedia.getAudioTracks()[0])
  //       mixedMedia.addTrack(dist.stream.getAudioTracks()[0])
  //     }else{
  //       mixedMedia.addTrack(dist.stream.getAudioTracks()[0])
  //     }
  //   // }
  //   room.replaceStream(mixedMedia)
  // }

  const mixAudioVideo = (video:HTMLVideoElement)=>{

    let stream = video.srcObject;
    if(!mixedMedia || !stream || !('id' in stream)){
      return
    }

    stream.getAudioTracks().forEach(track => track.enabled = true);

    if(mixedMedia.getAudioTracks()[0]){
      mixedMedia.removeTrack(mixedMedia.getAudioTracks()[0])
      mixedMedia.addTrack(stream.getAudioTracks()[0])
    }else{
      mixedMedia.addTrack(stream.getAudioTracks()[0])
    }
    room.replaceStream(mixedMedia)
  }

  const canvasAddVideo = (video: HTMLVideoElement | null) => {

    if(!video || !video.srcObject || !('id' in video.srcObject)){
      return
    }
    console.log(video.srcObject.getAudioTracks())
    console.log(ownerMedia?.getVideoTracks())

    if(!video || !video.srcObject || canvasVideos.includes(video)){
      return
    }
    canvasVideos.push(video)
    mixAudioVideo(video)
    setCanvasVideos(canvasVideos)
  };

  const canvasRemoveVideo =(video: HTMLVideoElement | null)=> {
    const index = canvasVideos.findIndex(item => item === video )
    if(!video || !video.srcObject || -1 === index ){
      return
    }

    // if ('getAudioTracks' in video.srcObject) {
    //   const audio = video.srcObject?.getAudioTracks()[0]
    //   const index = canvasAudios.findIndex(item => item === audio)
    //   canvasAudios.splice(index,1)
    //   mixAudioVideo(canvasAudios,mixedMedia!)
    //   setCanvasAudios(canvasAudios)
    // }

    canvasVideos.splice(index,1)
    drawCanvas(canvas,canvasVideos,0)
    mixAudioVideo(video)
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

        //roomかvideostreamがstateに保存した後だと効かない
        room.on('stream', async stream => {

          if(peer.id !== stream.peerId){

            stream.getAudioTracks().forEach(track => track.enabled = false);
            setGuestMedia(stream)

            // console.log(video_stream?.getAudioTracks())

            // if(video_stream.getAudioTracks()[0]){
            //   video_stream.getAudioTracks()[0].stop()
            //   video_stream.removeTrack(video_stream.getAudioTracks()[0])
            //   video_stream.addTrack(stream.getAudioTracks()[0])
            // }else{
            //   video_stream.addTrack(stream.getAudioTracks()[0])
            // }
            // console.log(video_stream?.getAudioTracks())
            // room.replaceStream(video_stream)
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
              <Guest media={ownerMedia} leave={leaveId} canvasAddVideo={canvasAddVideo} canvasRemoveVideo={canvasRemoveVideo} muted={false} />
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
