

import React, { Component } from 'react';

import fs from 'flatstore';
import { send } from '../proxy';

fs.set('state-cells', ['', '', '', '', '', '', '', '', ''])

class Cell extends Component {
    constructor(props) {
        super(props);
        this.ref = null;
    }

    clicked(id) {
        console.log('clicked cellid: ', id);
        send('pick', { cell: id })
    }

    //set up defaults on page mount
    componentDidMount() {


        //add dimensions listener for window resizing
        window.addEventListener('resize', this.updatePosition.bind(this));
    }

    //remove listener on page exit
    componentWillUnmount() {
        window.removeEventListener('resize', this.updatePosition.bind(this));
    }

    updatePosition() {
        if (!this.ref)
            return;

        let rect = JSON.stringify(this.ref.getBoundingClientRect());
        rect = JSON.parse(rect);
        rect.offsetWidth = this.ref.offsetWidth;
        rect.offsetHeight = this.ref.offsetHeight;

        fs.set('cell' + this.props.id, rect);
    }
    render() {
        let id = this.props.id;
        let cellType = this.props.celltype || '';
        let color = "color-" + cellType;
        return (
            <div
                className={"cell ttt-" + id + ' ' + color}
                onClick={() => this.clicked(id)}
                ref={el => {
                    if (!el) return;
                    this.ref = el;
                    setTimeout(this.updatePosition.bind(this), 2000);
                }}>
                {cellType}
            </div>
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