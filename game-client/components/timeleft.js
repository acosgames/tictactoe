
import React, { Component } from 'react';
import fs from 'flatstore';

class Timeleft extends Component {
    constructor(props) {
        super(props);
    }

    getTimeFormatted() {
        let timeleft = fs.get('timeleft') || 0;

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

    render() {
        return (
            <div className="timeleft">
                {this.getTimeFormatted()}
            </div>

        )
    }

}

export default fs.connect(['timeleft'])(Timeleft);