import * as React from "react";
import Chat from "./Chat";

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"chat-container"}
        style={{
          backgroundColor: "blue",
          height: "95%",
          width: "75%",
        }}
      >
        <Chat />
      </div>
    </>
  );
};
export default Content;