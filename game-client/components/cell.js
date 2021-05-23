

import React, { Component } from 'react';

import fs from 'flatstore';
import { send } from '../proxy';

fs.set('state-cells', ['', '', '', '', '', '', '', '', ''])

class Cell extends Component {
    constructor(props) {
        super(props);
    }

    clicked(id) {
        console.log('clicked cellid: ', id);
        send('pick', { cell: id })
    }

    render() {
        let id = this.props.id;
        let cellType = this.props.celltype || '';
        return (
            <div className={"cell ttt-" + id} onClick={() => this.clicked(id)}>{cellType}</div>
        )
    }
}



let onCustomWatched = ownProps => {
    return ['state-cells-' + ownProps.id];
};
let onCustomProps = (key, value, store, ownProps) => {
    return {
        celltype: value
    };
};
export default fs.connect([], onCustomWatched, onCustomProps)(Cell);