import * as React from "react";

import './Video.scss'

type Props = {
  media: Promise<MediaStream> | undefined;
};

const Content = (props: Props) => {
  const videoContainer = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!props.media || !videoContainer) {
      return
    }

    props.media.then((stream) => {
      if (videoContainer && videoContainer.current) {
        videoContainer.current.srcObject = stream
      }
    }).catch((err) => {
      console.log(err.name + ": " + err.message);
    });

  }, [videoContainer, props])

  return (
    <div className="video">
      <video ref={videoContainer} autoPlay={true} />
    </div>
  );
};

export default Content;
