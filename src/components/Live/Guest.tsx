import * as React from "react";

type Props = {
  stream:MediaStream
};

const Content = (props: Props) => {

  const guestVideo = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if(!guestVideo || !guestVideo.current || !props.stream){
      return
    }
    guestVideo.current.srcObject = props.stream
    console.log(guestVideo)
  }, [guestVideo, props.stream])

  return (
    <>
    {
       console.log(guestVideo)
    }
     <video ref={guestVideo} autoPlay={true}/>
    </>
  );
};
export default Content;
