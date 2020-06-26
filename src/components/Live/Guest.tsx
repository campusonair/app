import * as React from "react";
import { Button } from 'react-bootstrap'
import './Guest.scss'

type Props = {
  media: MediaStream| null,
  canvasAddVideo:(video: HTMLVideoElement | null ) => void,
  canvasRemoveVideo:(video: HTMLVideoElement | null ) => void,
  muted:boolean
};

const Content = (props: Props) => {

  const guestVideo = React.useRef<any>(null)
  const [switchBtn, setSwitchBtn] = React.useState<boolean>(false)

  React.useEffect(() => {

  }, [])

  React.useEffect(() => {

    if(!guestVideo || !guestVideo.current || !props.media){
      return
    }
    guestVideo.current.srcObject = props.media
  }, [guestVideo,props.media])

  const addVideo = (props:Props)=>{
    if(!props.media || !guestVideo.current){
      return
    }
    guestVideo.current.srcObject = props.media
    props.canvasAddVideo(guestVideo.current)
    setSwitchBtn(!switchBtn)
  }

  const removeVideo = (props:Props)=>{
    if(!props.media || !guestVideo.current){
      return
    }
    guestVideo.current.srcObject = props.media
    props.canvasRemoveVideo(guestVideo.current)
    setSwitchBtn(!switchBtn)
  }

  return (
    <div className={"guest video"}>
      {!switchBtn && <Button onClick={()=>{addVideo(props)}} className={"add-video-canvas"}>Add</Button>}
      {switchBtn && <Button onClick={()=>{removeVideo(props)}} className={"remove-video-canvas"}>Remove</Button>}
      <video ref={guestVideo} autoPlay playsInline muted={props.muted}/>
    </div>
  );
};
export default Content;
