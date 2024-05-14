import React, { Component, useEffect, useRef } from "react";

import AlertPanel from "./AlertPanel";
import Cell from "./Cell";
import PlayerList from "./PlayerList";
import Line from "./Line";
import { bucket } from "react-bucketjs";

export const btGameArea = bucket({});

function Gamescreen(props) {
    let ref = useRef();

    const updatePosition = () => {
        if (!ref) return;

        let rect = JSON.stringify(ref.current.getBoundingClientRect());
        rect = JSON.parse(rect);
        rect.offsetWidth = ref.current.offsetWidth;
        rect.offsetHeight = ref.current.offsetHeight;

        btGameArea.set(rect);
    };

    useEffect(() => {
        setTimeout(updatePosition, 2000);
    });

    return (
        <div className="gamewrapper" ref={ref}>
            <div className="vstack">
                <div className="vstack-noh">
                    <div className="vstack">
                        <PlayerList />
                    </div>

                    <AlertPanel />
                </div>
                <div className="gamescreen">
                    <Line className={"foreground"} />
                    <Line className={"background"} />
                    <div className="gamearea">
                        <div className="vstack">
                            <div className="hstack">
                                <Cell id={0} />
                                <div className="vertical" />
                                <Cell id={1} />
                                <div className="vertical" />
                                <Cell id={2} />
                            </div>
                            <div className="horizontal" />
                            <div className="hstack">
                                <Cell id={3} />
                                <div className="vertical" />
                                <Cell id={4} />
                                <div className="vertical" />
                                <Cell id={5} />
                            </div>
                            <div className="horizontal" />
                            <div className="hstack">
                                <Cell id={6} />
                                <div className="vertical" />
                                <Cell id={7} />
                                <div className="vertical" />
                                <Cell id={8} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gamescreen;
