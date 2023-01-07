
import React, { Component } from 'react';
import fs from 'flatstore';

function Timeleft(props) {

    let [timeleft] = fs.useWatch('timeleft');

    const getTimeFormatted = () => {
        try {
            if (typeof timeleft != 'number')
                timeleft = Number.parseInt(timeleft);

            timeleft = Math.ceil(timeleft / 1000);
        }
        catch (e) {
            timeleft = 0;
        }

        return (<span>{timeleft}</span>)
    }

    return (
        <div className={"timeleft "}>
            <span>{getTimeFormatted()}</span>
        </div>

    )
}

export default Timeleft;