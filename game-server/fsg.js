
class FSG {
    constructor() {
        this.msg = JSON.parse(JSON.stringify(globals.action()));
        this.originalState = JSON.parse(JSON.stringify(globals.state()));
        this.nextState = JSON.parse(JSON.stringify(globals.state()));
        if (!('players' in this.nextState)) {
            this.nextState.players = {};
        }
    }

    on(actionName, cb) {
        if (this.msg.action != actionName)
            return;
        cb(this.msg);
    }

    finish() {
        globals.finish(this.nextState);
    }

    log(msg) {
        globals.log(msg);
    }
    error(msg) {
        globals.error(msg);
    }

    action() {
        return this.action;
    }

    state(key, value) {

        if (typeof key === 'undefined')
            return this.nextState;
        if (typeof value === 'undefined')
            return this.nextState[key];

        this.nextState[key] = value;
    }

    players(userid, value) {
        if (typeof userid === 'undefined')
            return this.nextState.players;
        if (typeof value === 'undefined')
            return this.nextState.players[userid];

        this.nextState.players[userid] = value;
    }

    rules(rule, value) {
        if (typeof rule === 'undefined')
            return this.nextState.rules;
        if (typeof value === 'undefined')
            return this.nextState.rules[rule];

        this.nextState.rules[rule] = value;
    }
}

export default new FSG();