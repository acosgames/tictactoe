import React, { Component } from 'react';
import fs from 'flatstore';

class AlertPanel extends Component {
    constructor(props) {
        super(props);

    }

    eventMessage(name) {

        let players = fs.get('players');
        switch (name) {
            case 'picked': {

                let userid = fs.get('events-picked-id');

                let player = players[userid];
                let cellid = fs.get('events-picked-cellid');
                if (typeof cellid === 'undefined') {
                    cellid = unknown;
                }

                return player.name + ' picked cell ' + cellid + '.';

            }
            case 'gameover': {

                let type = fs.get('events-gameover-type');
                // let strip = fs.get('prev-strip');

                if (type == 'winner') {
                    let winnerid = fs.get('events-gameover-id');
                    let strip = fs.get('events-gameover-strip');
                    let player = players[winnerid];
                    if (strip === 'forfeit')
                        return player.name + ' wins by forfeit!';
                    return player.name + ' won the game!'
                }

                if (type == 'tie') {
                    return "No one wins. It's a tie!"
                }

                break;
            }
            case 'join':
                let events = fs.get('events');
                if (events.join && events.join.id) {
                    let player = players[events.join.id];
                    return player.name + ' joined the game.';
                }
                break;
            default:
                return "";
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