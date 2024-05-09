import React, { Component } from "react";
import fs from "flatstore";

function Timeleft(props) {
    let [timeleft] = fs.useWatch("timeleft");
    let timer = fs.get("timer");

    const getTimeFormatted = () => {
        try {
            if (typeof timeleft != "number")
                timeleft = Number.parseInt(timeleft);

            timeleft = Math.ceil(timeleft / 1000);
        } catch (e) {
            timeleft = 0;
        }
        if (Number.isNaN(timeleft)) timeleft = 0;

        return <span>{timeleft}</span>;
    };

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
