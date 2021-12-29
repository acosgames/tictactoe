
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

    renderPlayerLocal() {
        let local = fs.get('local');

        let type = local.type || '';
        let nextID = fs.get('next-id');
        let isNext = nextID == local.id;
        let nextTag = isNext ? 'next' : '';

        return (
            <div className={`color-${type} nameplate vstack ${nextTag} local`}>

                <div className="hstack" style={{ zIndex: 4, position: 'relative' }}>
                    <div className="spacer"></div>
                    <div className="vstack" >
                        <div className="hstack" style={{ alignContent: 'center', justifyContent: 'center' }}>
                            <span className="localPlayerIndicator">✦</span>
                            <span className="playerName">{local.name}</span>
                        </div>
                        <Timeleft next={isNext} />
                    </div>
                    <div className="ttt-type">
                        {type || '?'}
                    </div>
                </div>
                <div className="timebar-panel"><TimeBar /></div>
            </div>
        )
    }

    renderPlayerOther() {
        let local = fs.get('local');
        let { id, player } = this.findOtherPlayer(local.id);
        if (!player)
            return <></>

        let type = player.type || '';
        let nextID = fs.get('next-id');
        let isNext = nextID == id;
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
                <div className="timebar-panel">
                    <TimeBar reverse={true} />
                </div>

            </div>
        )
    }

    render() {
        return (
            <div className="player-panel">
                <div className="hstack" style={{ alignItems: "center", justifyContent: "center" }}>
                    {this.renderPlayerLocal()}
                    <div className="vs">
                        VS
                    </div>
                    {this.renderPlayerOther()}
                </div>

            </div>
        )
    }

}

export default fs.connect(['players', 'next-id'])(PlayerList);;