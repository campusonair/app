import * as React from "react";
import { Container,Row,Col } from 'react-bootstrap'
import Guest from './Guest'
import Peer from 'skyway-js'
import Config from '../../config'
import './LiveGuest.scss'

type Props = {};

const Content = (props: Props) => {

  // const { liveId } = useParams()
  const liveId  = 'devRoom'

  const [ownerMedia, setOwnerMedia] = React.useState<MediaStream|null>(null)
  const canvas = React.useRef<HTMLVideoElement>(null)

  let guestMedia : string|null = null

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
          if(peer.id !== stream.peerId && null === guestMedia){
            canvas.current!.srcObject = stream
            guestMedia = stream.peerId
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
          <video ref={canvas} autoPlay={true} className={"canvas"} width={"1280"} height={"720"}/>
          <div className={"videos"}>
            <div className={"me"}>
              <Guest media={ownerMedia} canvasAddVideo={()=>{}} canvasRemoveVideo={()=>{}} leave={""}/>
            </div>
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
