
import React, { Component } from 'react';

import Cell from './cell';
import { attachMessageEvent } from './action';

class Gamescreen extends Component {
    constructor(props) {
        super(props);

        attachMessageEvent(this.onMessage);
    }

    onMessage(evt) {
        let message = evt.data;
        let origin = evt.origin;
        let source = evt.source;

        console.log('Received from origin:' + origin, message);
    }

    render() {
        return (
            <div className="gamewrapper">
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