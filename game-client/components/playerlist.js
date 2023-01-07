
import React, { Component, useState } from 'react';

import fs from 'flatstore';
import Timeleft from './timeleft';
import TimeBar from './timebar';

function PlayerList(props) {


    // let [percent, setPercent] = useState(0);

    let [players] = fs.useWatch('players');
    let [nextId] = fs.useWatch('next-id');

    const findOtherPlayer = (localId) => {
        for (var id in props.players) {
            let player = props.players[id];
            if (id != localId)
                return { id, player };
        }
        return { id: null, player: null };
    }

    const renderPlayerO = (playerid) => {
        // let local = fs.get('local');

        let players = fs.get('players') || {};
        let player = players[playerid];

        if (!player)
            return <></>

        let type = player.type || '';
        let nid = nextId;
        if (!Array.isArray(nid)) {
            nid = [nid];
        }
        let isNext = nid.includes(playerid) || nid.includes(player.teamid);
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

    const renderPlayerX = (playerid) => {


        let players = fs.get('players') || {};
        let player = players[playerid];

        if (!player)
            return <></>

        let type = player.type || '';
        let nid = nextId;
        if (!Array.isArray(nid)) {
            nid = [nid];
        }
        let isNext = nid.includes(playerid) || nid.includes(player.teamid);
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


    let teams = fs.get('teams');
    if (!teams)
        return <></>
    let teamo = teams.team_o;
    let teamx = teams.team_x;


    return (
        <div className="player-panel">
            <div className="hstack" style={{ alignItems: "center", justifyContent: "center" }}>

                {renderPlayerO(teamo.players[0])}

                <div className="vs">
                    VS
                </div>
                {renderPlayerX(teamx.players[0])}
            </div>

        </div>
    )


}

export default PlayerList;