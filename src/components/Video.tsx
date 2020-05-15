import * as React from "react";

import './Video.scss'

type Props = {};

const Content = (props: Props) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!videoNode || !videoNode.current) {
      return
    }

    // Set 16:9
    const height = videoNode.current.clientWidth * 0.562
    videoNode.current.style.height = `${height}px`

    const videoOptions = {
      video: true,
      audio: true
    }

    // @ts-ignore
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia

    navigator.getUserMedia(videoOptions, (stream: MediaStream) => {
        if (videoNode && videoNode.current) {
          videoNode.current.srcObject = stream
        }
      }, (err: MediaStreamError) => {
        console.log(err);
      });
  }, [videoNode])

  return (
    <div className="video-container">
      <video ref={videoNode} autoPlay={true} width="640" height="480" />
    </div>
  );
};

export default Content;
