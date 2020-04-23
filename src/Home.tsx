import * as React from "react";
import VideoContainer from "./VideoContainer";
import Chat from "./Chat";
import Notice from "./Notice";
import Slide from "./Slide";


type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"header"}
        style={{
          height: "7vh",
          backgroundColor: "gray",
          padding: "10px"
        }}>
        <h1>Example World 2020 re:Public</h1>
      </div>
      <div className={"body"}>
        <main className={"main"}>
          <div className={"slide-container"}>
            <Slide />
          </div>
        </main>
        <aside className={"aside"}>
          <div className={"chat-container"}>
            <Chat />
          </div>
        </aside>
      </div>
      <div
        className={"footer"}
        style={{
          height: "23vh",
          backgroundColor: "gray"
        }}>
        <div className={"footer-container"} >
          <div
            className={"footer-container-left"}
            style={{

            }}>
            <div className={"logo-container"}>Logo</div>
            <div className={"qr-container"}>QR</div>
            <div className={"notice-container"}>
              <Notice />
            </div>
          </div>
          <div className={"footer-container-right"}>
            <VideoContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
