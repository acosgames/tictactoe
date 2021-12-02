
import React, { Component } from 'react';
import fs from 'flatstore';

import AlertPanel from './alertpanel';
import Cell from './cell';
import PlayerList from './playerlist';
import Line from './line';

// import book1 from '../images/book1.jpg';
// import book2 from '../images/book2.jpg';
// import book3 from '../images/book3.jpg';
// import book4 from '../images/book4.jpg';
// import book5 from '../images/book5.jpg';
// import book6 from '../images/book6.jpg';
// import book7 from '../images/book7.jpg';
// import test from '../images/test.mp3';

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

        )
    }

}

export default Gamescreen;