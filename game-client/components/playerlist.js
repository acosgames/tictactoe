
import React, { Component } from 'react';

import fs from 'flatstore';

class PlayerList extends Component {
    constructor(props) {
        super(props);
    }

    renderPlayers() {
        //not initialized yet
        if (!this.props.players) {
            return (<React.Fragment></React.Fragment>)
        }

        //don't draw if no player exists
        let playerids = Object.keys(this.props.players);
        if (playerids.length == 0) {
            return (<React.Fragment></React.Fragment>)
        }

        //draw local player name
        let local = fs.get('local');
        let players = [];
        let nextUserId = fs.get('next-userid');

        let nextTag = nextUserId == local.userid ? " > " : "";
        let type = local.type || '';
        let color = ''
        if (type.length > 0) {
            color = "color-" + type;
            type = 'You are ' + type.toUpperCase();
        }


        players.push(<li key={local.userid}>
            <h2 className={color}><span className="nextTag">{nextTag}</span><span className="ttt-type">{type}</span></h2>
        </li>)

        //draw other players
        for (var id in this.props.players) {
            if (local.userid == id)
                continue;
            let player = this.props.players[id];
            nextTag = nextUserId == id ? " > " : "";
            type = player.type || '';
            let color = "color-" + type;
            if (type.length > 0) {
                type = 'is ' + type.toUpperCase();
            }
            players.push(
                <li key={id}>
                    <h3 className={color}><span className="nextTag">{nextTag}</span>{player.name} <span className="ttt-type">{type}</span></h3>
                </li>
            )
        }
        return players;
    }

    render() {
        return (
            <div className="player-panel">
                <ul className="playerlist">
                    {this.renderPlayers()}
                </ul>
            </div>
        )
    }

}

export default fs.connect(['players', 'next-userid'])(PlayerList);;