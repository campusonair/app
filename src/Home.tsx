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
        <div className={"footer-content"} >
          <div className={"footer-content-left"}>
            <div className={"footer-content-col"}>
              <div className={"logo-container"}>Logo</div>
            </div>
            <div className={"footer-content-col"}>
              <div className={"qr-container"}>QR</div>
            </div>
            <div className={"footer-content-col-half"}>
              <div className={"notice-container"}>
                <Notice />
              </div>
            </div>
          </div>
          <div className={"footer-content-right"}>
            <VideoContainer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
