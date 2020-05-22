import * as React from "react";

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
    <>
      <video ref={guestVideo} autoPlay={true}/>
    </>
  );
};
export default Content;
