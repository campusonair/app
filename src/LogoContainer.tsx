import * as React from "react";
import Logo from "./Logo"

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"logo-container"}
        style={{
          width: "90%",
          height: "90%",
        }}
      >
        <Logo /></div>
    </>
  );
};
export default Content;