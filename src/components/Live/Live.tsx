import * as React from "react";
import { Container,Row,Col } from 'react-bootstrap'
import Guests from './Guests'
import Video from './../Video'
import Peer from 'skyway-js'
import Config from '../../config'
import './Live.scss'

type Props = {};

const Content = (props: Props) => {
  // const { liveId } = useParams()
  const liveId  = 'devRoom'
  const [guestMedia, setGuestMedia] = React.useState<MediaStream|null>(null)
  const [ownerMedia, setOwnerMedia] = React.useState<Promise<MediaStream>>()
  const [leaveId, setLeaveId] = React.useState<string|null>(null)

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
      setOwnerMedia(userMedia)

      userMedia.then((localStream) => {
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
          <div className={"canvas"}>
            <div>canvas</div>
          </div>
          <div className={"scene"}>
            <button>Scene</button>
            <button>Scene</button>
            <button>Scene</button>
          </div>
          <div className={"videos"}>
            <div className={"me"}>
              <Video media={ownerMedia} />
            </div>
            <Guests media={guestMedia} leave={leaveId}/>
            <button>+</button>
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
