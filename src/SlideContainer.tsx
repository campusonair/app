import * as React from "react";
import Slide from "./Slide";
import "./SlideContainer.scss";

type Props = {};

const Content = (props: Props) => {
  return (
    <>
      <div className={"slide-container"}>
        <Slide />
      </div>
    </>
  );
};
export default Content;