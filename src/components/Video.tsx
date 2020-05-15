import * as React from "react";

import './Video.scss'

type Props = {};

const Content = (props: Props) => {
  const videoContainer = React.useRef<HTMLVideoElement>(null);

  const setAspectRatio = () => {
    if (!videoContainer || !videoContainer.current) {
      return
    }

    const height = videoContainer.current.clientWidth * 0.562
    videoContainer.current.style.height = `${height}px`
  }

  React.useEffect(() => {
    window.addEventListener('resize', setAspectRatio)
    setAspectRatio()

    const videoOptions = {
      video: {
        width: 1280,
        height: 720
      },
      audio: true
    }

    navigator.mediaDevices.getUserMedia(videoOptions).then((stream) => {
      if (videoContainer && videoContainer.current) {
        videoContainer.current.srcObject = stream
      }
    }).catch((err) => {
      console.log(err.name + ": " + err.message);
    });

  }, [videoContainer])

  return (
    <div className="video-container">
      <video ref={videoContainer} autoPlay={true} width="1280" height="720" />
    </div>
  );
};

export default Content;
