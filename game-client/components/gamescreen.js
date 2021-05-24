
import React, { Component } from 'react';
import fs from 'flatstore';

import AlertPanel from './alertpanel';
import Cell from './cell';
import PlayerList from './playerlist';
import Line from './line';

class Gamescreen extends Component {
    constructor(props) {
        super(props);
        this.ref = null;
    }

    updatePosition() {
        if (!this.ref)
            return;

        let rect = JSON.stringify(this.ref.getBoundingClientRect());
        rect = JSON.parse(rect);
        rect.offsetWidth = this.ref.offsetWidth;
        rect.offsetHeight = this.ref.offsetHeight;

        fs.set('gamearea', rect);
    }

    render() {
        return (
            <div className="gamewrapper" ref={el => {
                if (!el) return;
                this.ref = el;
                setTimeout(this.updatePosition.bind(this), 2000);
            }}>
                <AlertPanel />

                <PlayerList />
                <div className="gamescreen">

                    <div className="gamearea">


                        <Cell id={0} /><Cell id={1} /><Cell id={2} />
                        <Cell id={3} /><Cell id={4} /><Cell id={5} />
                        <Cell id={6} /><Cell id={7} /><Cell id={8} />
                    </div>

                </div>
                <Line />
            </div>

        )
    }

}

export default Gamescreen;