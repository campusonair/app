import React from "react";
import { HashRouter, Route } from "react-router-dom";
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

function Content() {
  return (
    <HashRouter>
      <Route exact path="/">
        <VideoPlayer options={videoJsOptions} />
      </Route>
    </HashRouter>
  );
}

export default Content;
