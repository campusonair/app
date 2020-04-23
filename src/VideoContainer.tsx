import * as React from "react";
import VideoPlayer from "./VideoPlayer";

const videoJsOptions = {
  sources: [
    {
      src:
        "https://15bcd044c531aa99.mediapackage.ap-northeast-1.amazonaws.com/out/v1/33de575936f14b54b4c642d4c0d2aadc/index.m3u8",
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