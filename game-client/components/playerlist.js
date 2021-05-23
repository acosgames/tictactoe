
import React, { Component } from 'react';

import fs from 'flatstore';

class PlayerList extends Component {
    constructor(props) {
        super(props);
    }

    renderPlayers() {

        if (!this.props.players) {
            return (<React.Fragment></React.Fragment>)
        }

        let playerids = Object.keys(this.props.players);
        if (playerids.length == 0) {
            return (<React.Fragment></React.Fragment>)
        }
        let players = [];
        for (var id in this.props.players) {
            let player = this.props.players[id];
            players.push(
                <li>
                    {player.name} is type '{player.type}'
                </li>
            )
        }
        return players;
    }

    render() {
        return (
            <ul className="playerlist">
                {this.renderPlayers()}
            </ul>

        )
    }

}

export default fs.connect(['players'])(PlayerList);;