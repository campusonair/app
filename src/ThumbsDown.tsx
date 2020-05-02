import * as React from "react";
import Button from "./Button";
import { IoIosThumbsDown } from "react-icons/io";

type Props = {};

const Content = (props: Props) => {
    return (
        <>
            <button
                onClick={() => { console.log("hellooo") }}
            >
                <Button
                    Icon={IoIosThumbsDown}
                />
            </button>
        </>
    );
};
export default Content;