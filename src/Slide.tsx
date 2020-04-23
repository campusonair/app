
import * as React from "react";

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"slide"}
        style={{
          backgroundColor: "red",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >Slide</div>
    </>
  );
};
export default Content;