// import ACOSServer from './acosg';

import { ACOSServer } from "acosgames";

// let defaultGame = {
//     state: {
//         cells: ['', '', '', '', '', '', '', '', ''],
//         //sx: ''
//     },
//     players: {},
//     next: {},
//     events: {}
// }

const defaultState = { cells: ["", "", "", "", "", "", "", "", ""] };

export function onNewGame(action) {
    let game = ACOSServer.gamestate();
    game.state = defaultState;

    checkNewRound();
}

export function onSkip(action) {
    let next = ACOSServer.next();
    if (!next || !next.id) return;

    playerLeave(next.id);
}

export function onJoin(action) {
    ACOSServer.log(action);
    if (!action.user.id) return;

    let player = ACOSServer.players(action.user.id);
    player.rank = 2;
    player.score = 0;

    let teams = ACOSServer.teams();
    if (teams && player.teamid) {
        teams[player.teamid].rank = 2;
        teams[player.teamid].score = 0;
    }

    ACOSServer.log("TICTACTOE PLAYER INFO:");
    ACOSServer.log(player);

    ACOSServer.players(action.user.id, player);

    let playerCount = ACOSServer.playerCount();
    if (playerCount <= 2) {
        ACOSServer.event("join", {
            id: action.user.id,
        });
    }
}

export function onLeave(action) {
    playerLeave(action.user.id);
}

export function onPick(action) {
    let room = ACOSServer.room();
    if (room.status != "gamestart") return false;

    let state = ACOSServer.state();
    let user = ACOSServer.players(action.user.id);

    //get the picked cell
    let cellid = action.payload;
    if (typeof cellid !== "number") return false;

    // block picking cells with markings, and send error
    let cell = state.cells[cellid];
    if (cell.length > 0) {
        user._error = {
            message: "Square is not empty!",
        };
        return true;
    }

    //mark the selected cell
    let type = user.type;
    state.cells[cellid] = type;

    if (checkWinner()) return;

    ACOSServer.setTimelimit(15);
    selectNextPlayer(null);
}

function checkNewRound() {
    //if player count reached required limit, start the game
    //let maxPlayers = ACOSServer.rules('maxPlayers') || 2;
    let playerCount = ACOSServer.playerCount();
    if (playerCount >= 2) {
        newRound();
    }
}

function playerLeave(id) {
    let players = ACOSServer.players();
    let otherPlayerId = null;
    if (players[id]) otherPlayerId = selectNextPlayer(id);

    if (otherPlayerId) {
        let otherPlayer = players[otherPlayerId];
        setWinner(otherPlayer.type, "forfeit");
    }
}

function newRound() {
    let playerList = ACOSServer.playerList();

    let state = ACOSServer.state();

    //select the starting player
    let xteam = ACOSServer.teams("team_x");
    state.sx = xteam.players[0];

    ACOSServer.next({
        id: state.sx,
        action: "pick",
    });
    let players = ACOSServer.players() || {};
    let playerIds = Object.keys(players);

    let otherIds = playerIds.filter((value) => value != state.sx);

    let playerX = state.sx;
    let playerO = otherIds[0];

    players[playerX].type = "X";
    players[playerO].type = "O";

    ACOSServer.event("newround", true);
    ACOSServer.setTimelimit(15);
}

function selectNextPlayer(userid) {
    let action = ACOSServer.action();
    let players = ACOSServer.playerList();
    userid = userid || action.user.id;

    //only 2 players so just filter the current player
    let remaining = players.filter((x) => x != userid);
    ACOSServer.next({
        id: remaining[0],
        action: "pick",
    });
    return remaining[0];
}

// Check each strip that makes a win
//      0  |  1  |  2
//    -----------------
//      3  |  4  |  5
//    -----------------
//      6  |  7  |  8
function checkWinner() {
    if (check([0, 1, 2])) return true;
    if (check([3, 4, 5])) return true;
    if (check([6, 7, 8])) return true;
    if (check([0, 3, 6])) return true;
    if (check([1, 4, 7])) return true;
    if (check([2, 5, 8])) return true;
    if (check([0, 4, 8])) return true;
    if (check([6, 4, 2])) return true;
    if (checkNoneEmpty()) return true;
    return false;
}

function checkNoneEmpty() {
    let cells = ACOSServer.state().cells;
    let filtered = cells.filter((v) => v == "");

    if (filtered.length == 0) {
        setTie();
    }
    return filtered.length == 0;
}

// checks if a strip has matching types
function check(strip) {
    let cells = ACOSServer.state().cells;
    let first = cells[strip[0]];
    if (first == "") return false;
    let filtered = strip.filter((id) => cells[id] == first);
    if (filtered.length == 3 && filtered.length == strip.length) {
        setWinner(first, strip);
        return true;
    }
    return false;
}

function findPlayerWithType(type) {
    let players = ACOSServer.players();
    for (var id in players) {
        let player = players[id];
        if (player.type == type) return id;
    }
    return null;
}

function setTie() {
    ACOSServer.gameover({ type: "tie" });
    ACOSServer.next({});
}

// set the winner event and data
function setWinner(type, strip) {
    //find user who matches the win type
    let userid = findPlayerWithType(type);
    let player = ACOSServer.players(userid);

    let teams = ACOSServer.teams();
    if (teams && player.teamid) {
        teams[player.teamid].rank = 1;
        teams[player.teamid].score = 100;
    }
    player.rank = 1;
    player.score = player.score + 100;
    if (!player) {
        player.id = "unknown player";
    }

    ACOSServer.gameover({
        type: "winner",
        pick: type,
        strip: strip,
        id: userid,
    });
    ACOSServer.next({});
}
