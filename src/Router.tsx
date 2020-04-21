import React from "react";
import { HashRouter, Route } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const videoJsOptions = {
  sources: [
    {
      src: "https://your-end-point.m3u8",
      type: "application/x-mpegURL",
    },
  ],
};

function Content() {
  return (
    <HashRouter>
      <Route exact path="/">
        Hello
      </Route>
      <Route exact path="/video">
        <VideoPlayer options={videoJsOptions} />
      </Route>
    </HashRouter>
  );
}

export default Content;
