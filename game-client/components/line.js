
import React, { Component, useEffect, useState } from 'react';
import fs from 'flatstore';

function Line(props) {

    let [width, setWidth] = useState(0);
    let [height, setHeight] = useState(0);

    let [roomUpdate] = fs.useWatch('room');

    //actually set the state to the window dimensions
    const getDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    const isArrEqual = (arr1, arr2) => {
        let filtered = arr1.filter((v, i) => arr1[i] == arr2[i]);
        if (arr1.length != arr2.length)
            return false;
        if (arr1.length == 0)
            return false;
        if (filtered.length != arr1.length)
            return false;
        return true;
    }

    useEffect(() => {
        //set up defaults on page mount
        getDimensions();

        //add dimensions listener for window resizing
        window.addEventListener('resize', getDimensions);
        window.addEventListener('paint', getDimensions);

        return () => {
            //remove listener on page exit
            window.removeEventListener('resize', getDimensions);
            window.removeEventListener('paint', getDimensions);
        }
    }, [])


    let events = fs.get('events');
    let state = fs.get('state');
    let room = fs.get('room');

    let gameoverEvent = events?.gameover;
    if (room?.status != 'gameover') {
        return <React.Fragment></React.Fragment>
    }
    let strip = [0, 1, 2];

    strip = events?.gameover?.strip;
    if (!strip) {
        return <React.Fragment></React.Fragment>
    }
    let gamearea = fs.get('gamearea');
    let start = fs.get('cell' + strip[0]);
    let end = fs.get('cell' + strip[2]);

    if (!start || !end || !gameoverEvent.id)
        return (<React.Fragment></React.Fragment>)

    let x1 = start.left + (start.offsetWidth / 2);
    let y1 = start.top + (start.offsetHeight / 2);
    let x2 = end.left + (end.offsetWidth / 2);
    let y2 = end.top + (end.offsetHeight / 2);

    let cells = state?.cells || {};
    let celltype = cells[strip[0]] || '';
    let color = 'color-' + celltype.toUpperCase();
    //console.log("line: ", x1, y1, x2, y2);
    return (
        <svg className={"line " + props.className + ' ' + color}>
            <line
                id="line1"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth="10"
                stroke="#fff"
                strokeLinecap="round">
            </line>
        </svg>
    )

}

// export default fs.connect(['cell8', 'cell0'])(Line);
export default Line;