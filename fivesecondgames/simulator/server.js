require('source-map-support').install()
const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Worker } = require("worker_threads")

const port = process.env.PORT || 3000;

var userCount = 0;
var clients = {};
var gameHistory = [];
var worker = createWorker(1);

function getLastGame() {
    if (gameHistory.length > 0)
        return gameHistory[gameHistory.length - 1];
    return null;
}
const stringHashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; ++i) hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
    return hash;
};

io.on('connection', (socket) => {
    userCount++;
    let username = socket.handshake.query.username;
    if (!username)
        return;

    let userid = stringHashCode(username);
    socket.user = { username, userid }
    clients[socket.user.userid] = socket;
    console.log('user connected: ' + socket.user.username);
    socket.emit('connected', socket.user);

    socket.on('disconnect', () => {
        console.log('user disconnected: ' + socket.user.username);
        delete clients[socket.user.userid];
        userCount--;
    });

    socket.on('action', (msg) => {
        msg.userid = socket.user.userid;
        if (msg && msg.type) {

            let lastGame = getLastGame();
            if( lastGame && lastGame.killGame ) 
                return;

            if (msg.type == 'join') {
                msg.username = socket.user.username;
                if( lastGame && lastGame.players && lastGame.players[msg.userid] )
                {
                    socket.emit('game', lastGame);
                    return;
                }
            }
            else if( msg.type == 'leave' ) {
                socket.disconnect();
            }
            else {
                
                if (lastGame) {
                    if (lastGame.next.userid != '*' && lastGame.next.userid != msg.userid)
                        return;
                }
            }
            worker.postMessage(msg);
        }
        
    });

    socket.on('reload', (msg) => {
        gameHistory = [];
        worker.postMessage({ type: 'reset' });
    })
});

function createWorker(index) {
    const worker = new Worker('./fivesecondgames/simulator/worker.js', { workerData: { index } });
    worker.on("message", (game) => {

        console.log("Outgoing Game: ", game);
        gameHistory.push(game);
        io.emit('game', game);

        if (game.killGame) {
            setTimeout(() => {
                for (var id in clients) {
                    let socket = clients[id];
                    socket.disconnect();
                }
                gameHistory = [];
            }, 1000);

            return;
        }

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
    res.sendFile(path.join(__dirname, '../../builds/client/client.bundle.js'));
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
