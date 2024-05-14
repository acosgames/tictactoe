import React, { useEffect } from "react";

import { ACOSClient } from "acosgames";

import { bucket } from "react-bucketjs";

export const btTimeleft = bucket(0);
export const btGame = bucket({
    state: {},
    players: {},
    teams: {},
    rules: {},
    next: {},
    events: {},
    room: {},
    local: {},
});

export function GameLoader(props) {
    const onTimeLoop = (elapsed) => {
        btTimeleft.set(elapsed);
    };

    const onMessage = (message) => {
        if (message) btGame.set(message);
    };

    useEffect(() => {
        console.log("[TicTacToe] Starting");
        ACOSClient.listen(onMessage);
        ACOSClient.timerLoop(onTimeLoop);
        ACOSClient.ready();
    }, []);

    let Comp = props.component;
    return <Comp></Comp>;
}
