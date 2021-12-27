
import React, { Component } from 'react';

import fs from 'flatstore';
import Timeleft from './timeleft';
import Skip from './skip';

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
        let nextUserId = fs.get('next-id');

        let nextTag = nextUserId == local.id ? " > " : "";
        let type = local.type || '';
        let color = ''
        if (type.length > 0) {
            color = "color-" + type;
            type = 'You are ' + type.toUpperCase();
        } else {
            type = local.name + ' (you)';
        }


        // players.push(<div key={local.id}>
        //     <h2 className={color}><span className="nextTag">{nextTag}</span><span className="ttt-type">{type}</span></h2>
        // </div>)

        //draw other players
        for (var id in this.props.players) {
            let player = this.props.players[id];
            nextTag = nextUserId == id ? " next" : "";
            type = player.type || '';
            let color = "color-" + type;
            if (type.length > 0) {
                type = type.toUpperCase();
            }
            players.push(
                <div key={id} className={color + ' nameplate vstack ' + nextTag}>



                    <div className="vstack" >

                        <span className={"ttt-type "}>{type}</span>
                        <span className="playerName">{player.name}{local.id == id ? ' (you)' : ''}</span>

                        <Timeleft hide={(nextUserId != id)} />

                    </div>
                </div>
            )
        }
        return players;
    }

    render() {
        return (
            <div className="player-panel">
                <div className="hstack" style={{ alignItems: "center", justifyContent: "center" }}>
                    {this.renderPlayers()}
                </div>

            </div>
        )
    }

}

export default fs.connect(['players', 'next-id'])(PlayerList);;