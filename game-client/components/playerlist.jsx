import React, { Component, useState } from "react";

import { useBucketSelector } from "react-bucketjs";
import { btGame } from "../GameLoader";

function PlayerList(props) {
    let players = useBucketSelector(btGame, (g) => g.players);
    let teams = useBucketSelector(btGame, (g) => g.teams);
    let next = useBucketSelector(btGame, (g) => g.next);
    let nextId = next?.id;

    const renderPlayerO = (playerid) => {
        let players = btGame.get((g) => g.players) || {};
        let player = players[playerid];
        let room = btGame.get((g) => g.room) || {};
        let status = room.status;
        if (!player) return <></>;

        let type = player.teamid == "team_o" ? "O" : "X";
        let nid = nextId;
        if (!Array.isArray(nid)) {
            nid = [nid];
        }
        let isNext =
            status == "gameover" ||
            status == "pregame" ||
            nid.includes(playerid) ||
            nid.includes(player.teamid);
        let nextTag = isNext ? "next" : "";

        return (
            <div className={`color-${type} nameplate vstack ${nextTag}`}>
                <div
                    className="hstack"
                    style={{ zIndex: 4, position: "relative" }}
                >
                    <div className="spacer"></div>
                    <div className="vstack">
                        <div
                            className="hstack"
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.8rem",
                            }}
                        >
                            <img
                                src={player.portrait}
                                style={{
                                    width: "4rem",
                                    height: "4rem",
                                    borderRadius: "50%",
                                    border: "1px solid #888",
                                    opacity: isNext ? "1" : "0.1",
                                }}
                            />
                            <span className="playerName">{player.name}</span>
                        </div>
                    </div>
                    <div className="ttt-type">{type || "?"}</div>
                </div>
            </div>
        );
    };

    const renderPlayerX = (playerid) => {
        let players = btGame.get((g) => g.players) || {};
        let room = btGame.get((g) => g.room) || {};
        let status = room.status;
        let player = players[playerid];

        if (!player) return <></>;

        let type = player.teamid == "team_o" ? "O" : "X";
        let nid = nextId;
        if (!Array.isArray(nid)) {
            nid = [nid];
        }
        let isNext =
            status == "gameover" ||
            status == "pregame" ||
            nid.includes(playerid) ||
            nid.includes(player.teamid);
        let nextTag = isNext ? "next" : "";
        return (
            <div className={`color-${type} nameplate vstack ${nextTag}`}>
                <div
                    className="hstack"
                    style={{ zIndex: 4, position: "relative" }}
                >
                    <div className="ttt-type">{type || "?"}</div>
                    <div className="vstack">
                        <div
                            className="hstack"
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.8rem",
                            }}
                        >
                            <img
                                src={player.portrait}
                                style={{
                                    width: "4rem",
                                    height: "4rem",
                                    borderRadius: "50%",
                                    border: "1px solid #888",
                                    opacity: isNext ? "1" : "0.1",
                                }}
                            />
                            <span className="playerName">{player.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!teams) return <div className="player-panel"></div>;

    let teamo = teams.team_o;
    let teamx = teams.team_x;

    return (
        <div className="player-panel">
            <div
                className="hstack"
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "10vh",
                }}
            >
                {renderPlayerO(teamo?.players[0])}

                <div className="vs">VS</div>
                {renderPlayerX(teamx?.players[0])}
            </div>
        </div>
    );
}

export default PlayerList;
