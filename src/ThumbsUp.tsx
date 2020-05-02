import * as React from "react";
import Button from "./Button";
import { IoIosThumbsUp } from "react-icons/io";

type Props = {};

const Content = (props: Props) => {
    return (
        <>
            <button
                onClick={() => { console.log("hellooo") }}
            >
                <Button
                    Icon={IoIosThumbsUp}
                />
            </button>
        </>
    );
};
export default Content;