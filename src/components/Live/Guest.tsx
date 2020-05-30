import * as React from "react";
import { Button } from 'react-bootstrap'
import './Guest.scss'

type Props = {
  media: MediaStream| null,
  onSetCanvasMedia:(video: MediaStream | null ) => void,
  onRemoveCanvasMedia:(video: MediaStream | null ) => void
};

const Content = (props: Props) => {

  const guestVideo = React.useRef<HTMLVideoElement>(null)
  const [switchBtn, setSwitchBtn] = React.useState<boolean>(false)

  React.useEffect(() => {

    if(!guestVideo || !guestVideo.current || !props.media){
      return
    }
    guestVideo.current.srcObject = props.media
  }, [guestVideo, props])

  const setMedia = (props:Props)=>{

    if(!props.media){
      return
    }
    props.onSetCanvasMedia(props.media)
    setSwitchBtn(!switchBtn)
  }

  const removeMedia = (props:Props)=>{

    if(!props.media){
      return
    }
    props.onRemoveCanvasMedia(props.media)
    setSwitchBtn(!switchBtn)
  }

  return (
    <div className={"guest video"}>
      {!switchBtn && <Button onClick={()=>{setMedia(props)}} className={"add-video-canvas"}>Add</Button>}
      {switchBtn && <Button onClick={()=>{removeMedia(props)}} className={"remove-video-canvas"}>Remove</Button>}
      <video ref={guestVideo} autoPlay={true}/>
    </div>
  );
};
export default Content;
