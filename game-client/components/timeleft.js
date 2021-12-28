
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

        if (timeleft > 0 && timeleft < 10) {
            timeleft = "0" + timeleft;
        }

        if (!this.props.next) {
            timeleft = "10";
        }

        return (<span>{timeleft}</span>)
    }

    render() {
        return (
            <div className={"timeleft "}>
                <span>
                </span>
                <span>{this.getTimeFormatted()}</span>
            </div>

        )
    }

}

export default fs.connect(['timeleft'])(Timeleft);