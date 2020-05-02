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

  const [message, setMessage] = React.useState("No Message");
  const ws = new WebSocket(
    "wss://bedhbwbhi7.execute-api.ap-northeast-1.amazonaws.com/v1"
  );
  ws.onerror = (error) => {
    console.error(error);
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setMessage(data.message);
  }
  return (
    <>
      <IoIosThumbsUp
        onClick={
          ws.onopen = () => {
            ws.send("thumbsUp");
          }
        }
      />
      <IoIosThumbsDown
        onClick={
          ws.onopen = () => {
            ws.send("thumbsDown");
          }
        }
      />
      <div>
        {message}
      </div>
    </>
  );
};

export default Content;
