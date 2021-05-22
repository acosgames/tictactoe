const { workerData, parentPort } = require("worker_threads")
const fs = require('fs');
const { VM, VMScript, NodeVM } = require('vm2');

const profiler = require('./profiler');

var globalState = { test: '123' };
var globalAction = {};
var globalResult = null;

var globals = {
    log: (msg) => { console.log(msg) },
    error: (msg) => { console.error(msg) },
    finish: (newState) => {
        try {
            globalResult = cloneObj(newState);
        }
        catch (e) {
            console.error(e);
        }
    },
    state: () => globalState,
    action: () => globalAction
};

const vm = new NodeVM({
    console: false,
    wasm: false,
    eval: true,
    fixAsync: true,
    timeout: 500,
    sandbox: { globals },
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function cloneObj(obj) {
    if (typeof obj === 'object')
        return JSON.parse(JSON.stringify(obj));
    return obj;
}

const index = workerData.index;


class FSGWorker {
    constructor() {
        this.action = {};
        this.stateHistory = [];

        // this.bundlePath = './game-server/index.js';
        this.bundlePath = './fivesecondgames/builds/server/server.bundle.js';
        this.gameScript = null;

        this.start();
    }

    async onAction(msg) {
        if (!msg.action) {
            console.log("Not an action: ", msg);
            return;
        }
        globalState = cloneObj(globalState);
        globalAction = cloneObj(msg);
        this.run();
    }

    async onClose() {

    }

    onException(err) {
        console.error('Asynchronous error caught.', err);
    }

    async reloadServerBundle(filepath) {
        filepath = filepath || this.bundlePath;
        var data = fs.readFileSync(filepath, 'utf8');
        let filename = filepath.split('/');
        filename = filename[filename.length - 1];
        this.gameScript = new VMScript(data, filepath);
        return this.gameScript;
    }

    async start() {
        try {
            this.reloadServerBundle();
            fs.watchFile(this.bundlePath, (curr, prev) => {
                this.reloadServerBundle();
                console.log(`${this.bundlePath} file Changed`);
            });

            parentPort.on('message', this.onAction.bind(this));
            parentPort.on('close', this.onClose.bind(this));
            parentPort.postMessage({ status: "READY" });
            process.on('uncaughtException', this.onException.bind(this))
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
                parentPort.postMessage(globalResult);
            }
            profiler.End('Game Logic');
        }
        catch (e) {
            console.error(e);
        }
    }



}

var worker = new FSGWorker();