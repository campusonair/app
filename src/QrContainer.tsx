import * as React from "react";
import Qr from "./Qr"

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"qr-container"}
        style={{
          width: "90%",
          height: "90%",
        }}
      ><Qr /></div>
    </>
  );
};
export default Content;