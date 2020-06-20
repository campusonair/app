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
  const [canvasPeerId, setCanvasPeerId] = React.useState<String|null>(null)
  const [guestStream, setGuestStream] = React.useState<Array<any>>([])
  // const [guestStream, setguestStream] = React.useState<Array<MediaStream>>([])
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

        const room = peer.joinRoom(liveId!, {
          mode: 'sfu',
          stream: localStream,
        })


        let guestStreamTemp:Array<MediaStream> = [];

        room.on('stream', async stream => {

          if(peer.id !== stream.peerId){

            stream.getAudioTracks().forEach((track:MediaStreamTrack) => track.enabled = false)
            guestStreamTemp = [...guestStream,stream]
            setGuestStream(guestStreamTemp)
          }
        })

        room.on('data', (props:roomData) => {

          setCanvasPeerId(props.src)

          guestStreamTemp.forEach((stream:MediaStream) => {
            if(-1 !== props.data.canvasVideosId.indexOf(stream.id)){
              stream.getAudioTracks().forEach((track:MediaStreamTrack) => track.enabled = true)
            }else{
              stream.getAudioTracks().forEach((track:MediaStreamTrack) => track.enabled = false)
            }
          })

        })
      })
    })

  }, [])

  React.useEffect(() => {

    if(!canvas.current || guestStream.length <= 0 || !canvasPeerId){
      return
    }
    const find = guestStream.find(video => video.peerId === canvasPeerId)
    if(!find){
      return
    }
    canvas!.current!.srcObject = find

  }, [canvas.current,guestStream,canvasPeerId]);


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
            guestStream.length > 0 && guestStream.map((stream) => {
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
