import React, { Component } from "react";

import Timeleft from "./Timeleft";
import { btGame } from "../GameLoader";
import { useBucket, useBucketSelector } from "react-bucketjs";

function AlertPanel(props) {
    let events = useBucketSelector(btGame, (bucket) => bucket.events);
    let next = useBucketSelector(btGame, (bucket) => bucket.next);
    let room = useBucketSelector(btGame, (bucket) => bucket.room);

    const eventMessage = (name) => {
        let players = btGame.get((g) => g.players);
        switch (name) {
            case "picked": {
                let picked = btGame.get((g) => g.events?.picked);
                let shortid = picked.shortid;
                let cellid = picked.cellid;
                let player = players[shortid];
                if (typeof cellid === "undefined") {
                    cellid = unknown;
                }

                return (
                    <>
                        <span className={"eventPlayerName-" + player.type}>
                            {player.displayname}
                        </span>{" "}
                        picked cell {cellid}.
                    </>
                );
            }
            case "gamecancelled": {
                return "Game Cancelled. Player left early.";
            }
            case "gameerror": {
                let gameerror = btGame.get((g) => g.events?.gameerror);
                return "Game Error. " + gameerror;
            }
            case "gameover": {
                let gameover = btGame.get((g) => g.events?.gameover);
                let type = gameover?.type;
                // let strip = fs.get('prev-strip');

                if (type == "winner") {
                    let winnerid = gameover?.shortid;
                    let strip = gameover?.strip;
                    let player = players[winnerid];
                    if (!player) return <></>;
                    if (strip === "forfeit")
                        return (
                            <>
                                <span
                                    className={"eventPlayerName-" + player.type}
                                >
                                    {player.displayname}
                                </span>{" "}
                                wins by forfeit!
                            </>
                        );
                    return (
                        <>
                            <span className={"eventPlayerName-" + player.type}>
                                {player.displayname}
                            </span>{" "}
                            won the game!
                        </>
                    );
                }

                if (type == "tie") {
                    return "No one wins. It's a tie!";
                }

                break;
            }
            case "join":
                let events = btGame.get((g) => g.events);
                if (events.join && events.join.id) {
                    let player = players[events.join.id];
                    return (
                        <>
                            <span className="eventPlayerName">
                                {player.displayname}
                            </span>{" "}
                            joined the game.
                        </>
                    );
                }
                break;
            default:
                return "";
        }
    };

    let message = [];

    if (events) {
        let names = Object.keys(events);
        for (var i = 0; i < names.length; i++) {
            let name = names[i];
            if (name in events) {
                message.push(
                    <span key={"alert-" + name} className="eventMessage">
                        {eventMessage(name)}
                    </span>
                );
            }
        }
    }

    let localUser = btGame.get((g) => g.local);
    if (room?.status == "gamestart") {
        if (next?.id == localUser?.shortid) {
            message.push(
                <span key={"alert-yourturn"} className="yourTurn">
                    YOUR TURN
                </span>
            );
        } else {
            message.push(
                <span key={"alert-yourturn"} className="yourTurn">
                    WAITING
                </span>
            );
        }
    }

    if (!message) {
        return <React.Fragment></React.Fragment>;
    }
    return (
        <div className="alert-panel">
            <div className="alert alert-primary" role="alert">
                {message}
            </div>
            <Timeleft />
        </div>
    );
}

export default AlertPanel;
