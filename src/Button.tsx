import * as React from "react";

type Props = {
    Icon: any,
};

const Content = (props: Props) => {
    const Icon = props.Icon;
    return (
        <>
            <button>
                <Icon />
            </button>
        </>
    );
};
export default Content;