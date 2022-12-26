
import React, { Component } from 'react';

import fs from 'flatstore';
import Timeleft from './timeleft';
import TimeBar from './timebar';

class PlayerList extends Component {
    constructor(props) {
        super(props);

        this.state = { percent: 0 }
    }

    findOtherPlayer(localId) {
        for (var id in this.props.players) {
            let player = this.props.players[id];
            if (id != localId)
                return { id, player };
        }
        return { id: null, player: null };
    }

    renderPlayerO(playerid) {
        // let local = fs.get('local');

        let players = fs.get('players') || {};
        let player = players[playerid];

        if (!player)
            return <></>

        let type = player.type || '';
        let nextID = fs.get('next-id');
        if (!Array.isArray(nextID)) {
            nextID = [nextID];
        }
        let isNext = nextID.includes(playerid) || nextID.includes(player.teamid);
        let nextTag = isNext ? 'next' : '';

        return (
            <div className={`color-${type} nameplate vstack ${nextTag}`}>

                <div className="hstack" style={{ zIndex: 4, position: 'relative' }}>
                    <div className="spacer"></div>
                    <div className="vstack" >
                        <div className="hstack" style={{ alignContent: 'center', justifyContent: 'center' }}>

                            <span className="playerName">{player.name}</span>
                        </div>
                        <Timeleft next={isNext} />
                    </div>
                    <div className="ttt-type">
                        {type || '?'}
                    </div>
                </div>
                {/* <div className="timebar-panel"><TimeBar /></div> */}
            </div>
        )
    }

    renderPlayerX(playerid) {
        // let local = fs.get('local');
        // let { id, player } = this.findOtherPlayer(local.id);
        // if (!player)
        //     return <></>

        let players = fs.get('players') || {};
        let player = players[playerid];

        if (!player)
            return <></>

        let type = player.type || '';
        let nextID = fs.get('next-id');
        if (!Array.isArray(nextID)) {
            nextID = [nextID];
        }
        let isNext = nextID.includes(playerid) || nextID.includes(player.teamid);
        let nextTag = isNext ? 'next' : '';
        return (
            <div className={`color-${type} nameplate vstack ${nextTag}`}>

                <div className="hstack" style={{ zIndex: 4, position: 'relative' }}>

                    <div className="ttt-type">{type || '?'}</div>
                    <div className="vstack" >
                        <span className="playerName">{player.name}</span>
                        <Timeleft next={isNext} />
                    </div>
                </div>
                {/* <div className="timebar-panel">
                    <TimeBar reverse={true} />             
                </div> */}

            </div>
        )
    }

    render() {

        let teams = fs.get('teams');
        if (!teams)
            return <></>
        let teamo = teams.team_o;
        let teamx = teams.team_x;


        return (
            <div className="player-panel">
                <div className="hstack" style={{ alignItems: "center", justifyContent: "center" }}>

                    {this.renderPlayerO(teamo.players[0])}

                    <div className="vs">
                        VS
                    </div>
                    {this.renderPlayerX(teamx.players[0])}
                </div>

            </div>
        )
    }

}

export default fs.connect(['players', 'next-id'])(PlayerList);;