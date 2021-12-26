import React, { useEffect } from 'react';
import fs from 'flatstore';
import flatstore from 'flatstore';

fs.set('local', {});
fs.set('state', {});
fs.set('players', {});
fs.set('rules', {});
fs.set('prev', {});
fs.set('next', {});
fs.set('events', {});

var needsReset = false;

export function GameLoader(props) {


    const timerLoop = (cb) => {

        if (cb)
            cb();

        setTimeout(() => { timerLoop(cb) }, 100);

        let events = fs.get('events');
        if (events.gameover) {
            return;
        }
        let timer = fs.get('timer');
        if (!timer)
            return;

        let deadline = timer.end;
        if (!deadline)
            return;

        let now = (new Date()).getTime();
        let elapsed = deadline - now;

        if (elapsed <= 0) {
            elapsed = 0;
        }

        fs.set('timeleft', elapsed);
    }

    const flatstoreUpdate = (message) => {
        if (!message)
            return;

        if (message.local) {
            fs.set('local', message.local);
        }
        if (message.timer) {
            fs.set('timer', message.timer);
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
        // if (message.prev) {
        //     fs.set('prev', message.prev);
        // }

        if (message.state) {
            fs.set('state', message.state);
        }

        if (message.events) {
            fs.set('events', message.events);
        }
    }

    const onMessage = (evt) => {

        // console.log("MESSAGE EVENT CALLED #1");
        let message = evt.data;
        let origin = evt.origin;
        let source = evt.source;
        if (!message || message.length == 0)
            return;

        // console.log('Game Updated:', message);

        if (needsReset) {
            flatstoreUpdate({
                local: {},
                state: {},
                players: {},
                events: {},
                next: {},
                timer: {},
                rules: {},
            })
            needsReset = false;
        }

        flatstoreUpdate(message);

        if (message && message.events.gameover) {
            needsReset = true;
        }

    }



    useEffect(() => {
        console.log("ATTACHING TO MESSAGE EVENT");
        window.addEventListener('message', onMessage, false);
        console.log("CREATING TIMER LOOP");
        timerLoop();

        send('ready', true);
    }, []);


    let Comp = props.component;
    return (<Comp></Comp>)
}



export async function send(type, payload) {
    window.parent.postMessage({ type, payload }, '*');
}