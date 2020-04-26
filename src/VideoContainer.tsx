import * as React from "react";
import VideoPlayer from "./VideoPlayer";

const videoJsOptions = {
  autoplay: true,
  sources: [
    {
      src:
        "https://d2xrglmfv4b1pf.cloudfront.net/hls-a/stream-a_1280x720_6500k.m3u8",
      type: "application/x-mpegURL",
    },
  ],
};

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"video-container"}
        style={{
          width: "65%",
          minWidth: "280px",
        }}
      >
        <VideoPlayer options={videoJsOptions} />
      </div>
    </>
  );
};
export default Content;