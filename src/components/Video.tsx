import * as React from "react";

import './Video.scss'

type Props = {
  media: Promise<MediaStream> | undefined
};

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
    if (!props.media || !videoContainer) {
      return
    }

    window.addEventListener('resize', setAspectRatio)
    setAspectRatio()

    props.media.then((stream) => {
      if (videoContainer && videoContainer.current) {
        videoContainer.current.srcObject = stream
      }
    }).catch((err) => {
      console.log(err.name + ": " + err.message);
    });

  }, [videoContainer, props.media])

  return (
    <div className="video">
      <video ref={videoContainer} autoPlay={true} width="1280" height="720" />
    </div>
  );
};

export default Content;
