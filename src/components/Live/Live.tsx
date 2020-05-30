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
  const [canvasMedias, setCanvasMedias] = React.useState<Array<MediaStream>>([])

  const onSetCanvasMedia = (video: MediaStream | null) => {
    if(!video || canvasMedias.includes(video)){
      return
    }
    setCanvasMedias([...canvasMedias,video])
  };

  const onRemoveCanvasMedia =(video: MediaStream | null)=> {

    if(!video || !canvasMedias.includes(video)){
      return
    }
    let leaveIdRemoved = canvasMedias.filter((media:any)=>{
      return media !== video
    })
    setCanvasMedias(leaveIdRemoved)
  }

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
          <div className={"canvas"}>
            {
              canvasMedias.map((stream)=>{
                return <Guest media={stream} key={stream.id} onSetCanvasMedia={onSetCanvasMedia} onRemoveCanvasMedia={onRemoveCanvasMedia}/>
              })
            }
          </div>
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
