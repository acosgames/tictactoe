
import React, { Component } from 'react';
import AlertPanel from './alertpanel';

import Cell from './cell';
import PlayerList from './playerlist';

class Gamescreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gamewrapper">
                <AlertPanel />
                <PlayerList />
                <div className="gamescreen">
                    <Cell id={0} /><Cell id={1} /><Cell id={2} />
                    <Cell id={3} /><Cell id={4} /><Cell id={5} />
                    <Cell id={6} /><Cell id={7} /><Cell id={8} />
                </div>
            </div>

        )
    }

}

export default Gamescreen;