import * as React from "react";
import { Container,Row,Col } from 'react-bootstrap'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './LiveGuest.scss'
import GuestAudio from './GuestAudio'
import Guests from './Guests'


type Props = {};
type roomData = {
  src:String
  data:{
    canvasVideosId:Array<String>
  }
}

const Content = (props: Props) => {

  // const { liveId } = useParams()
  const liveId  = 'devRoom'

  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [canvasStream, setCanvasStream] = React.useState<Array<MediaStream>>([])
  const canvas = React.useRef<HTMLVideoElement>(null)

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

        localStream.getAudioTracks().forEach(track => track.enabled = false)

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        });

        room.on('stream', async stream => {

          if(peer.id !== stream.peerId && !guestMedia){
            if(!canvas.current){
              return
            }
            canvas.current.srcObject = stream
            setGuestMedia(stream)

          }else if(peer.id !== stream.peerId){
            setCanvasStream([...canvasStream,stream])

          }
        });

        room.on('data', (props:roomData) => {

          const find = props.data.canvasVideosId.find(videoId => videoId === localStream.id)
          if(find){
            localStream.getAudioTracks().forEach(track => track.enabled = true)
            room.replaceStream(localStream)
          }else{
            localStream.getAudioTracks().forEach(track => track.enabled = false)
            room.replaceStream(localStream)
          }
        });
      })
    })

  }, [])

  return (
    <div className={"live-container guest"}>
    <Container fluid>
      <Row>
      <Col xs={12} md={9}>
          <video ref={canvas} autoPlay={true} className={"canvas"} width={"1280"} height={"720"} muted={true}/>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} canvasAddVideo={()=>{}} canvasRemoveVideo={()=>{}} leave={""} muted={true}/>
            </div>
          </div>
          <div className={"guest audio"}>
          {
            canvasStream.length >= 0 && canvasStream.map((stream) => {
              return <GuestAudio media={stream} key={stream.id} />
            })
          }
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
