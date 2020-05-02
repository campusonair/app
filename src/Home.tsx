import * as React from "react";
import "./Home.scss";
import { IoIosThumbsUp, IoIosThumbsDown } from "react-icons/io";

type Props = {};

const GOOD = "thumbsUp"
const BAD = "thumbsDown"

const Content = (props: Props) => {

  const reactionContainer = React.useRef<HTMLDivElement>(null)

  const [goodCount, setGood] = React.useState(0)
  const [badCount, setBad] = React.useState(0)
  const [socket, setSocket] = React.useState<WebSocket | null>(null)
  const [wsError, setWsError] = React.useState(false)

  React.useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL as string);
    ws.onerror = (error) => {
      setWsError(true)
      console.error(error);
    };
    setSocket(ws)
  }, [])

  const appendReaction = (icon: string) => {
    if (reactionContainer.current !== null) {
      const marginLeft = Math.random() * 30
      const marginBottom = Math.random() * 30
      const delay = Math.random()
      const reactionElement = document.createElement('div')
      reactionElement.innerHTML = `<i style="margin-left: ${marginLeft}px; margin-bottom: ${marginBottom}px; animation-delay: ${delay}ms" class="stylie icon-animation">${icon}️</i>`
      reactionContainer.current.append(reactionElement)
      setTimeout(() => {
        reactionElement.remove()
      }, 6000)
    }
  }

  if (socket) {
    socket.onmessage = (event) => {
      if (event.data === GOOD) {
        appendReaction('❤');
        setGood(goodCount + 1);
      } else if (event.data === BAD) {
        appendReaction('💙');
        setBad(badCount + 1);
      }
    }
  }

  return (
    socket ? <>
      <IoIosThumbsUp
        onClick={
          () => {
            socket.send(GOOD)
          }
        }
      />
      <IoIosThumbsDown
        onClick={
          () => { socket.send(BAD) }
        }
      />
      <div>
        <dl>
          <dt>Good!</dt>
          <dd>{`+${goodCount}`}</dd>
        </dl>
        <dl>
          <dt>BAD..</dt>
          <dd>{`-${badCount}`}</dd>
        </dl>
        <div className={'reaction-container'} ref={reactionContainer}></div>
      </div>
    </> : wsError ? <p>{'WebSocket 接続エラー'}</p> : <p>{'接続中です..!'}</p>
  );
};

export default Content;
