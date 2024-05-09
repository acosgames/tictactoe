
import React, { Component } from 'react';
import fs from 'flatstore';
import { send } from '../fsg';

function Skip(props) {

    let [timeleft] = fs.useWatch('timeleft');
    let [nextId] = fs.useWatch('next-id');

    const skipPlayer = () => {
        let id = this.props['next-id'];
        send('skip', { id })
    }

    if (!nextId || nextId != props.id) {
        return (<React.Fragment></React.Fragment>);
    }

    if (timeleft <= 0) {
        return (
            <button onClick={skipPlayer}>Kick</button>
        )
    }

    return (<React.Fragment></React.Fragment>);
}

export default Skip;