

import React, { Component } from 'react';

import fs from 'flatstore';
import { send } from './action';

fs.set('cells', ['x', 'x', 'x', 'o', 'o', 'o', 'o', 'x', 'x'])

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
        let cellType = '';
        if (this.props.cells && typeof id != 'undefined') {
            cellType = this.props.cells[id];
        }

        return (
            <div className={"cell ttt-" + id} onClick={() => this.clicked()}>{cellType}</div>
        )
    }
}

export default fs.connect(['cells'])(Cell);