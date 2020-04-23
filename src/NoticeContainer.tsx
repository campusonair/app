import * as React from "react";

import Notice from "./Notice";

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div
        className={"notice-container"}
        style={{
          width: "90%",
          height: "90%",
        }}
      >
        <Notice />
      </div>
    </>
  );
};
export default Content;