import * as React from "react";
import VideoPlayer from "./VideoPlayer";

const videoJsOptions = {
  sources: [
    {
      src:
        "https://ismrcqxrr6qz5j.data.mediastore.ap-northeast-1.amazonaws.com/hls-a/stream-a_720p60.m3u8",
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