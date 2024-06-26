import React, { Component, useEffect, useRef } from "react";

import { ACOSClient } from "acosgames";
import { bucket, useBucketSelector } from "react-bucketjs";
import { btGame } from "../GameLoader";

export const btCells = bucket({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
});

function Cell(props) {
    let ref = useRef();

    let state = useBucketSelector(btGame, (g) => g.state);

    const clicked = (id) => {
        //console.log('clicked cellid: ', id);
        ACOSClient.send("pick", id);
    };

    const updatePosition = () => {
        if (!ref) return;

        let rect = JSON.stringify(ref.getBoundingClientRect());
        rect = JSON.parse(rect);
        rect.offsetWidth = ref.offsetWidth;
        rect.offsetHeight = ref.offsetHeight;

        btCells.assign({ [props.id]: rect });
    };

    useEffect(() => {
        //add dimensions listener for window resizing
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("resize", updatePosition);
        };
    }, []);

    let id = props.id;
    let cellType = state?.cells ? state?.cells[id] : "";
    let inactive = cellType == "X" || cellType == "O" ? "" : " inactive ";
    let color = "color-" + cellType;
    return (
        <div
            className={"cell ttt-" + id + " " + color + inactive}
            onClick={() => clicked(id)}
            onTouchEnd={() => {
                clicked(id);
            }}
            ref={(el) => {
                if (!el) return;
                ref = el;
                updatePosition();
            }}
        >
            <span className={color + " foreground"}>{cellType}</span>
            <span className={color + " background"}>{cellType}</span>
        </div>
    );
}

export default Cell;
