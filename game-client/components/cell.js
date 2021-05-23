

import React, { Component } from 'react';

import fs from 'flatstore';
import { send } from '../proxy';

fs.set('state-cells', ['', '', '', '', '', '', '', '', ''])

class Cell extends Component {
    constructor(props) {
        super(props);
    }

    clicked() {
        let id = this.props.id;
        console.log(id);

        send('pick', { cell: id })
    }

    render() {

        let id = this.props.id;
        let cells = this.props['state-cells'];
        let cellType = cells[id];
        if (this.props.cells && typeof id != 'undefined') {
            cellType = this.props.cells[id];
        }

        return (
            <div className={"cell ttt-" + id} onClick={() => this.clicked()}>{cellType}</div>
        )
    }
}

export default fs.connect(['state-cells'])(Cell);