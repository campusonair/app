import * as React from "react";
import VideoContainer from "./VideoContainer";
import Chat from "./Chat";
import Notice from "./Notice";
import Slide from "./Slide";


type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <header style={{
        backgroundColor: "gray",
        padding: "20px"
      }}>
        <h1>Backlog World 2020 re:Union</h1>
      </header>
      <div style={{
        height: "70vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Slide />
        <Chat />
      </div>
      <footer style={{
        height: "20vh",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "gray"
      }}>
        <div>Logo</div>
        <div>QR</div>
        <Notice />
        <VideoContainer />
      </footer>
    </>
  );
};

export default Content;
