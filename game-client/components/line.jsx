import React, { Component, useEffect, useState } from "react";

import { useBucketSelector } from "react-bucketjs";
import { btGameArea } from "./GameScreen";
import { btGame } from "../GameLoader";
import { btCells } from "./Cell";

function Line(props) {
    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);

    let roomUpdate = useBucketSelector(btGame, (g) => g.room);

    //actually set the state to the window dimensions
    const getDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    const isArrEqual = (arr1, arr2) => {
        let filtered = arr1.filter((v, i) => arr1[i] == arr2[i]);
        if (arr1.length != arr2.length) return false;
        if (arr1.length == 0) return false;
        if (filtered.length != arr1.length) return false;
        return true;
    };

    useEffect(() => {
        //set up defaults on page mount
        getDimensions();

        //add dimensions listener for window resizing
        window.addEventListener("resize", getDimensions);
        window.addEventListener("paint", getDimensions);

        return () => {
            //remove listener on page exit
            window.removeEventListener("resize", getDimensions);
            window.removeEventListener("paint", getDimensions);
        };
    }, []);

    let events = btGame.get((g) => g.events);
    let state = btGame.get((g) => g.state);
    let room = btGame.get((g) => g.room);

    let gameoverEvent = events?.gameover;
    if (room?.status != "gameover") {
        return <React.Fragment></React.Fragment>;
    }
    let strip = [0, 1, 2];

    strip = events?.gameover?.strip;
    if (!strip) {
        return <React.Fragment></React.Fragment>;
    }
    let gamearea = btGameArea.get();
    let start = btCells.get((c) => c[strip[0]]);
    let end = btCells.get((c) => c[strip[2]]);

    if (!start || !end || !gameoverEvent.shortid)
        return <React.Fragment></React.Fragment>;

    let x1 = start.left + start.offsetWidth / 2;
    let y1 = start.top + start.offsetHeight / 2;
    let x2 = end.left + end.offsetWidth / 2;
    let y2 = end.top + end.offsetHeight / 2;

    let cells = state?.cells || {};
    let celltype = cells[strip[0]] || "";
    let color = "color-" + celltype.toUpperCase();
    //console.log("line: ", x1, y1, x2, y2);
    return (
        <svg className={"line " + props.className + " " + color}>
            <line
                id="line1"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="10"
                stroke="#fff"
                strokeLinecap="round"
            ></line>
        </svg>
    );
}

export default Line;
