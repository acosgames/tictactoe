import React, { Component } from "react";

import { ACOSClient } from "acosgames";
import { useBucket, useBucketSelector } from "react-bucketjs";
import { btGame, btTimeleft } from "../GameLoader";

function Skip(props) {
    let timeleft = useBucket(btTimeleft);
    let next = useBucketSelector(btGame, (g) => g.next);
    let nextId = next?.id;

    const skipPlayer = () => {
        let id = this.props["next-id"];
        ACOSClient.send("skip", { id });
    };

    if (!nextId || nextId != props.id) {
        return <React.Fragment></React.Fragment>;
    }

    if (timeleft <= 0) {
        return <button onClick={skipPlayer}>Kick</button>;
    }

    return <React.Fragment></React.Fragment>;
}

export default Skip;
