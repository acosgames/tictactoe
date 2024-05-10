import React, { Component, useEffect, useRef } from "react";

import AlertPanel from "./alertpanel";
import Cell from "./cell";
import PlayerList from "./playerlist";
import Line from "./line";
import { bucket } from "react-bucketjs";

// import book1 from '../images/book1.jpg';
// import book2 from '../images/book2.jpg';
// import book3 from '../images/book3.jpg';
// import book4 from '../images/book4.jpg';
// import book5 from '../images/book5.jpg';
// import book6 from '../images/book6.jpg';
// import book7 from '../images/book7.jpg';
// import test from '../images/test.mp3';
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
                    {/* <Line className={'foreground'} />
                        <Line className={'background'} />
                        <Line className={'background'} /> */}
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

                    {/* <audio controls >
                    <source src={test} />
                </audio>
                <img src={book1} />
                <img src={book2} />
                <img src={book3} />
                <img src={book4} />
                <img src={book5} />
                <img src={book6} />
                <img src={book7} /> */}
                </div>
            </div>
        </div>
    );
}

export default Gamescreen;
