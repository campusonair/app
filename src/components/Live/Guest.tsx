import * as React from "react";

type Props = {
  stream:MediaStream | null
};

const Content = (props: Props) => {

  const guestVideo = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if(!guestVideo || !guestVideo.current || !props.stream){
      return
    }
    guestVideo.current.srcObject = props.stream
  }, [guestVideo, props.stream])

  return (
    <>
     <video ref={guestVideo} autoPlay={true}/>
    </>
  );
};
export default Content;
