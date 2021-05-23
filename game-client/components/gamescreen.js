
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
                <AlertPanel></AlertPanel>
                <PlayerList></PlayerList>
                <div className="gamescreen">
                    <Cell id={0}></Cell>
                    <Cell id={1}></Cell>
                    <Cell id={2}></Cell>
                    <Cell id={3}></Cell>
                    <Cell id={4}></Cell>
                    <Cell id={5}></Cell>
                    <Cell id={6}></Cell>
                    <Cell id={7}></Cell>
                    <Cell id={8}></Cell>
                </div>
            </div>

        )
    }

}

export default Gamescreen;