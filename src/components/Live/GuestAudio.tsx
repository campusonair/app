import * as React from "react";

type Props = {
  media: MediaStream| null
}

const Content = (props: Props) => {

  const guestAudio = React.useRef<any>(null)

  React.useEffect(() => {

    if(!guestAudio || !guestAudio.current || !props.media){
      return
    }
    guestAudio.current.srcObject = props.media
  }, [guestAudio, props])

  return <audio ref={guestAudio} autoPlay={true}/>

}
export default Content;
