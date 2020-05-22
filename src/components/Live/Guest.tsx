import * as React from "react";
import './Guest.scss'

type Props = {
  media:MediaStream
};

const Content = (props: Props) => {

  const guestVideo = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if(!guestVideo || !guestVideo.current || !props.media){
      return
    }
    guestVideo.current.srcObject = props.media
  }, [guestVideo, props])

  return (
    <div className={"guest video"}>
      <video ref={guestVideo} autoPlay={true}/>
    </div>
  );
};
export default Content;
