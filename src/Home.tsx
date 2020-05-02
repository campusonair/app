import * as React from "react";
import VideoContainer from "./VideoContainer";
import SlideContainer from "./SlideContainer";
import ChatContainer from "./ChatContainer";
import NoticeContainer from "./NoticeContainer";
import QrContainer from "./QrContainer";
import LogoContainer from "./LogoContainer";
import "./Home.scss";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";

type Props = {};

const Content = (props: Props) => {
  const ws = new WebSocket(
    "wss://bedhbwbhi7.execute-api.ap-northeast-1.amazonaws.com/v1"
  );
  ws.onerror = (error) => {
    console.error(error);
  };
  ws.onmessage = (message) => {
    console.log(message);
  };
  return (
    <>
      <IoIosThumbsUp
        onClick={() => {
          ws.onopen = () => {
            ws.send("thumbsUp");
          };
        }}
      />
      <IoIosThumbsDown
        onClick={() => {
          console.log("thumbsDown");
        }}
      />
      {/* <div className={"home-header"}>
        <h1>Example World 2020 re:Public</h1>
      </div>
      <div className={"home-body"}>
        <main className={"home-main"}>
          <SlideContainer />
        </main>
        <aside className={"home-aside"}>
          <ChatContainer />
        </aside>
      </div>
      <div className={"home-footer"}>
        <div className={"home-footer-content"} >
          <div className={"home-footer-content-left"}>
            <div className={"home-footer-content-col"}>
              <LogoContainer />
            </div>
            <div className={"home-footer-content-col"}>
              <QrContainer />
            </div>
            <div className={"home-footer-content-col-half"}>
              <NoticeContainer />
            </div>
          </div>
          <div className={"home-footer-content-right"}>
            <VideoContainer />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Content;
