import React, { Component } from 'react';
import fs from 'flatstore';

class AlertPanel extends Component {
    constructor(props) {
        super(props);

    }

    eventMessage(name) {
        let userid = fs.get('prev-id');
        let players = fs.get('players');
        let player = players[userid];

        switch (name) {
            case 'picked': {
                return player.name + ' picked cell ' + fs.get('prev-cellid') + '.';
                break;
            }
            case 'winner': {
                let strip = fs.get('prev-strip');
                if (strip === 'forfeit')
                    return player.name + ' wins by forfeit!';
                return player.name + ' won the game!'
                break;
            }
            case 'tie': {
                return "No one wins. It's a tie!"
            }
        }
    }

    render() {

        let events = fs.get('events');
        let message = "";

        if (events) {
            let names = Object.keys(events);
            for (var i = 0; i < names.length; i++) {
                let name = names[i];
                if (name in events) {
                    message += this.eventMessage(name) + ' ';
                }
            }
        }

        if (message.length == 0) {
            return (<React.Fragment></React.Fragment>)
        }
        return (
            <div className="alert-panel">
                <div className="alert alert-primary" role="alert">
                    {message}
                </div>
            </div>

        )
    }

}

export default fs.connect(['events'])(AlertPanel);