

const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const { Worker } = require("worker_threads")
// io.set("transports", ['websocket']);

const port = process.env.PORT || 3000;

var userCount = 0;
var clients = {};

var worker = createWorker(1);

io.on('connection', (socket) => {

    userCount++;

    clients[userCount] = socket;
    socket.userid = userCount;

    console.log('user connected: player' + socket.userid);

    socket.on('disconnect', () => {
        console.log('user disconnected: player' + socket.userid);
        delete clients[socket.userid];
        userCount--;
    });

    socket.on('action', (msg) => {
        console.log('message: ', msg);
        worker.postMessage(msg);
    });

    socket.on('reload', (msg) => {
        for (var id in clients) {
            let client = clients[id];
            client.disconnect();
        }
    })
});

function createWorker(index) {
    const worker = new Worker('./fivesecondgames/simulator/worker.js', { workerData: { index } });
    worker.on("message", (msg) => {
        console.log("WorkerManager [" + index + "] received: ", msg);
        // for (var id in clients) {
        //     clients[id].emit('game', msg);
        // }
        io.emit('game', msg);
    });
    worker.on("online", (err) => {

    })
    worker.on("error", (err) => {
        console.error(err);
    })
    worker.on("exit", code => {
        if (code !== 0) {
            console.error(code);
            throw new Error(`Worker stopped with exit code ${code}`)
        }
    })

    return worker;
}


app.get('/client.bundle.js', function (req, res) {
    res.sendFile(path.join(__dirname, '../builds/client/client.bundle.js'));
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/iframe', function (req, res) {
    res.sendFile(path.join(__dirname, './iframe.html'));
});

server.listen(port, () => {
    console.log('Server started at http://localhost:' + port);


});
