

import React, { Component } from 'react';

import fs from 'flatstore';
import { send } from '../acosg';

fs.set('state-cells', {
    0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
})

class Cell extends Component {
    constructor(props) {
        super(props);
        this.ref = null;
    }

    clicked(id) {
        //console.log('clicked cellid: ', id);
        send('pick', id)
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
        let cellType = this.props?.state?.cells ? this.props?.state?.cells[id] : '';
        let inactive = (cellType == 'X' || cellType == 'O') ? '' : ' inactive ';
        let color = "color-" + cellType;
        return (
            <div
                className={"cell ttt-" + id + ' ' + color + inactive}
                onClick={() => this.clicked(id)}
                // onTouchEnd={() => this.clicked(id)}
                ref={el => {
                    if (!el) return;
                    this.ref = el;
                    this.updatePosition();
                    // setTimeout(this.updatePosition.bind(this), 100);
                }}>
                <span className={color + ' foreground'}>{cellType}</span>
                <span className={color + ' background'}>{cellType}</span>

            </div>
        )
    }
}




export default fs.connect(['state'])(Cell);