import * as React from "react";
import VideoPlayer from "./VideoPlayer";

const videoJsOptions = {
  sources: [
    {
      src:
        "https://d2zihajmogu5jn.cloudfront.net/advanced-fmp4/master.m3u8",
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