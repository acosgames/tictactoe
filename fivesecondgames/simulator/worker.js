const { workerData, parentPort } = require("worker_threads")
const fs = require('fs');
const { VM, VMScript, NodeVM } = require('vm2');
const path = require('path');
const profiler = require('./profiler');
const chokidar = require('chokidar');

var globalGame = null;
var globalAction = {};
var globalResult = null;
var globalDone = null;

var globals = {
    log: (msg) => { console.log(msg) },
    error: (msg) => { console.error(msg) },
    finish: (newGame) => {
        try {
            globalResult = cloneObj(newGame);
        }
        catch (e) {
            console.error(e);
        }
    },
    game: () => globalGame,
    action: () => globalAction,
    killGame: () => {
        globalDone = true;
    }
};

const vm = new VM({
    console: false,
    wasm: false,
    eval: false,
    fixAsync: false,
    //timeout: 100,
    sandbox: { globals },
});

function cloneObj(obj) {
    if (typeof obj === 'object')
        return JSON.parse(JSON.stringify(obj));
    return obj;
}

class FSGWorker {
    constructor() {
        this.action = {};
        this.gameHistory = [];
        this.bundlePath = path.join(__dirname, '../../builds/server/server.bundle.js');
        this.gameScript = null;
        this.start();
    }

    storeGame(game) {
        this.gameHistory.push(game);
        globalGame = JSON.parse(JSON.stringify(globalResult));
    }

    makeGame(clearPlayers) {
        if (!globalGame)
            globalGame = {};
        if (globalGame.killGame) {
            delete globalGame['killGame'];
        }
        globalGame.state = {};
        globalGame.rules = {};
        globalGame.next = {};
        globalGame.prev = {};
        globalGame.events = [];

        if (clearPlayers) {
            globalGame.players = {}
        }
        else {
            let newPlayers = {};
            for (var id in globalGame.players) {
                let player = globalGame.players[id];
                newPlayers[id] = {
                    name: player.name
                }
            }
            globalGame.players = newPlayers;
        }

    }

    async onAction(msg) {
        if (!msg.type) {
            console.log("Not an action: ", msg);
            return;
        }

        if (!globalGame)
            this.makeGame();

        if (msg.type == 'join') {
            let userid = msg.user.id;
            let username = msg.user.name;
            if (!userid) {
                console.error("Invalid player: " + userid);
                return;
            }

            if (!(userid in globalGame.players)) {
                globalGame.players[userid] = {
                    name: username
                }
            }
            else {
                globalGame.players[userid].name = username;
            }
        }
        else if (msg.type == 'reset') {
            this.makeGame();
        }

        globalGame = cloneObj(globalGame);
        globalAction = cloneObj(msg);
        this.run();
        this.storeGame(globalResult);

        if (typeof globalDone !== 'undefined' && globalDone) {
            globalResult.killGame = true;
            this.makeGame(true);
            globalDone = false;
        }

        parentPort.postMessage(globalResult);

    }


    async reloadServerBundle(filepath) {
        profiler.Start('Reload Bundle');
        {
            filepath = filepath || this.bundlePath;
            var data = fs.readFileSync(filepath, 'utf8');

            this.gameScript = new VMScript(data, this.bundlePath);
        }
        profiler.End('Reload Bundle');

        let filename = filepath.split(/\/|\\/ig);
        filename = filename[filename.length - 1];
        console.log("Bundle Reloaded: " + filename);

        return this.gameScript;
    }

    async start() {
        try {
            this.reloadServerBundle();

            let watchPath = this.bundlePath.substr(0, this.bundlePath.lastIndexOf('/'));
            chokidar.watch(watchPath).on('change', (path) => {
                this.reloadServerBundle();
                console.log(`${this.bundlePath} file Changed`);
            });

            parentPort.on('message', this.onAction.bind(this));
            parentPort.postMessage({ status: "READY" });
        }
        catch (e) {
            console.error(e);
        }
    }

    run() {
        if (!this.gameScript) {
            console.error("Game script is not loaded.");
            return;
        }

        try {
            profiler.Start('Game Logic');
            {
                vm.run(this.gameScript);

            }
            profiler.End('Game Logic', 100);
        }
        catch (e) {
            console.error(e);
        }
    }
}

var worker = new FSGWorker();