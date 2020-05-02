import * as React from "react";
import "./Home.scss";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";

type Props = {};

const Content = (props: Props) => {

  const [message, setMessage] = React.useState<String>("No Message");
  const [socket, setSocket] = React.useState<WebSocket | null>(null)

  React.useEffect(() => {
    const ws = new WebSocket(
      "wss://ez6o8j75hg.execute-api.ap-northeast-1.amazonaws.com/v1"
    );
    ws.onerror = (error) => {
      console.error(error);
    };
    ws.onmessage = (event) => {
      console.log(event.data)
      // const data = JSON.parse(event.data);
      // setMessage(data);
    }
    setSocket(ws)
  }, [])



  return (
    socket ? <>
      <IoIosThumbsUp
        onClick={
          () => {
            socket.send("thumbsUp")
          }
        }
      />
      <IoIosThumbsDown
        onClick={
          () => { socket.send("thumbsDown") }

        }
      />
      <div>
        {message}
      </div>
    </> : <p>{'接続中です..!'}</p>
  );
};

export default Content;
