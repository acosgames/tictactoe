import React, { useEffect } from 'react';
import fs from 'flatstore';

fs.set('local', {});
fs.set('timer', {});
fs.set('state', {});
fs.set('players', {});
fs.set('rules', {});
fs.set('prev', {});
fs.set('next', {});
fs.set('events', {});

export function GameLoader(props) {

    useEffect(() => {
        attachMessageEvent()
        timerLoop();
    });


    let Comp = props.component;
    return (<Comp></Comp>)
}

async function timerLoop(cb) {

    if (cb)
        cb();

    setTimeout(() => { timerLoop(cb) }, 100);

    let next = fs.get('next');
    if (!next)
        return;

    let deadline = next.deadline;
    if (!deadline)
        return;

    let now = (new Date()).getTime();
    let elapsed = deadline - now;

    if (elapsed <= 0) {
        elapsed = 0;
    }

    fs.set('timeleft', elapsed);
}

var hasMessageEvent = false;
export async function attachMessageEvent() {
    if (hasMessageEvent)
        return;
    hasMessageEvent = true;

    window.addEventListener('message', (evt) => {
        let message = evt.data;
        let origin = evt.origin;
        let source = evt.source;
        console.log('Game Updated:', message);
        if (!message)
            return;

        if (message.local) {
            fs.set('local', message.local);
        }
        if (message.state) {
            fs.set('state', message.state);
        }
        if (message.players) {
            fs.set('players', message.players);
        }
        if (message.rules) {
            fs.set('rules', message.rules);
        }
        if (message.next) {
            fs.set('next', message.next);
        }
        if (message.prev) {
            fs.set('prev', message.prev);
        }
        if (message.events) {
            let eventMap = {}
            message.events.forEach(v => { eventMap[v] = true })
            fs.set('events', eventMap);
        } else {
            fs.set('events', null);
        }
    }, false);
}

export async function send(type, payload) {
    window.parent.postMessage({ type, payload }, '*');
}