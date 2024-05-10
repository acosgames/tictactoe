import React, { Component } from "react";
import { useBucket, useBucketSelector } from "react-bucketjs";
import { btGame, btTimeleft } from "../GameLoader";

function Timeleft(props) {
    let timeleft = useBucket(btTimeleft);
    let timer = useBucketSelector(btGame, (g) => g.timer);

    let pct = timeleft / (timer?.seconds * 1000);
    pct = Math.max(0, pct) * 100;
    return (
        // <div className={"timeleft "}>
        //     <span>{getTimeFormatted()}</span>
        // </div>
        <div
            style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: pct + "%",
                height: "4px",
                backgroundColor: "#ccc",
                transition: "width 0.1s linear",
            }}
        ></div>
    );
}

export default Timeleft;
