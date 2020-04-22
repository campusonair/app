import * as React from "react";
import videojs from "video.js";

// Styles
import "video.js/dist/video-js.css";

type Props = {
  options: videojs.PlayerOptions;
};

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const Content = (props: Props) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const player = React.useRef<videojs.Player>();

  React.useEffect(() => {
    if (player.current) {
      player.current.dispose();
    }
    player.current = videojs(videoNode.current, {
      ...initialOptions,
      ...props.options,
    });
  }, [props.options]);

  return (
    <>
      <video ref={videoNode} className="video-js" />
    </>
  );
};

export default Content;
