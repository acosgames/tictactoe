'use strict';

class ACOSServer {
    constructor() {
        this.init = () => {
            try {
                this.gameState = JSON.parse(JSON.stringify(game()));
            }
            catch (e) {
                this.error("Failed to load gameState");
                return;
            }
            this.currentAction = null;
            this.kickedPlayers = [];
        };
        this.on = (type, cb) => {
            let userActions = actions();
            for (var i = 0; i < userActions.length; i++) {
                if (userActions[i].type == type) {
                    this.currentAction = userActions[i];
                    let result = cb(this.currentAction);
                    if (typeof result == "boolean" && !result) {
                        ignore();
                        break;
                    }
                }
            }
        };
        this.setGame = (game) => {
            for (var id in this.gameState.players) {
                let player = this.gameState.players[id];
                game.players[id] = player;
            }
            this.gameState = game;
        };
        this.save = () => {
            save(this.gameState);
        };
        this.gameerror = (payload) => {
            gameerror("[Error]:", payload);
            this.events("gameerror", typeof payload === "undefined" ? true : payload);
        };
        this.gamecancelled = (payload) => {
            this.events("gamecancelled", typeof payload === "undefined" ? true : payload);
        };
        this.gameover = (payload) => {
            this.events("gameover", typeof payload === "undefined" ? true : payload);
        };
        this.log = (...msg) => {
            gamelog(...msg);
        };
        this.error = (...msg) => {
            gameerror(...msg);
        };
        this.kickPlayer = (id) => {
            this.kickedPlayers.push(id);
        };
        this.randomInt = (min, max) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(random() * (max - min) + min);
        };
        this.action = () => {
            return this.currentAction;
        };
        this.gamestate = () => {
            return this.gameState;
        };
        this.playerList = () => Object.keys(this.gameState.players);
        this.playerCount = () => Object.keys(this.gameState.players).length;
        this.setTimer = (seconds) => {
            seconds = seconds || 15;
            this.gameState.timer.set = seconds;
        };
        this.reachedTimelimit = (action) => {
            if (typeof action.timeleft == "undefined")
                return false;
            return action.timeleft <= 0;
        };
        this.clearEvents = () => {
            this.gameState.events = {};
        };
    }
    ignore() {
        ignore();
    }
    random() {
        return random();
    }
    database() {
        return database();
    }
    room(key, value) {
        if (typeof key === "undefined")
            return this.gameState.room;
        if (typeof value === "undefined")
            return this.gameState.room[key];
        this.gameState.room[key] = value;
        return value;
    }
    state(key, value) {
        if (typeof key === "undefined")
            return this.gameState.state;
        if (typeof value === "undefined")
            return this.gameState.state[key];
        this.gameState.state[key] = value;
        return value;
    }
    players(shortid, value) {
        if (typeof shortid === "undefined")
            return this.gameState.players;
        if (typeof value === "undefined")
            return this.gameState.players[shortid];
        this.gameState.players[shortid] = value;
        return value;
    }
    statIncrement(shortid, abbreviation, value) {
        let player = this.players(shortid);
        if (typeof player.stats === "undefined") {
            player.stats = {};
        }
        value = value || 1;
        if (typeof player.stats[abbreviation] === "undefined")
            player.stats[abbreviation] = value;
        else
            player.stats[abbreviation] =
                player.stats[abbreviation] + value;
        return player.stats[abbreviation];
    }
    stats(shortid, abbreviation, value) {
        let player = this.players(shortid);
        if (typeof player.stats === "undefined") {
            player.stats = {};
        }
        if (typeof value === "undefined")
            return player.stats[abbreviation];
        if (typeof value == "string") {
            let obj = player.stats[abbreviation];
            if (!obj)
                obj = {};
            if (value in obj)
                obj[value] += 1;
            else
                obj[value] = 1;
            player.stats[abbreviation] = obj;
        }
        else
            player.stats[abbreviation] = value;
        return player.stats[abbreviation];
    }
    teams(teamid, value) {
        if (typeof teamid === "undefined")
            return this.gameState.teams;
        if (typeof value === "undefined")
            return this.gameState.teams[teamid];
        this.gameState.teams[teamid] = value;
    }
    next(id, action) {
        if (typeof id !== "undefined") {
            this.gameState.next = { id, action };
        }
        return this.gameState.next;
    }
    timer() {
        return this.gameState.timer;
    }
    events(name, payload) {
        if (typeof name === "undefined")
            return this.gameState.events;
        if (typeof payload === "undefined")
            return this.gameState.events[name];
        this.gameState.events[name] = payload;
        return this.gameState.events[name];
    }
}
var ACOSServer$1 = new ACOSServer();

const defaultBoard = ["", "", "", "", "", "", "", "", ""];

function onNewGame(action) {
    let state = ACOSServer$1.state();
    state.cells = defaultBoard;

    //select the starting player
    let team = ACOSServer$1.teams("team_x");
    let shortid = team.players[0];

    ACOSServer$1.next(shortid, "pick");
    ACOSServer$1.events("newround", true);
    ACOSServer$1.setTimer(15);
}

function onJoin(action) {
    ACOSServer$1.log(action);
    if (!action.user.shortid) return;

    let player = ACOSServer$1.players(action.user.shortid);
    player.rank = 2;
    player.score = 0;

    let teams = ACOSServer$1.teams();
    if (teams && player.teamid) {
        teams[player.teamid].rank = 2;
        teams[player.teamid].score = 0;
    }

    ACOSServer$1.log("TICTACTOE PLAYER INFO:");
    ACOSServer$1.log(player);

    ACOSServer$1.players(action.user.shortid, player);

    let playerCount = ACOSServer$1.playerCount();
    if (playerCount <= 2) {
        ACOSServer$1.events("join", {
            shortid: action.user.shortid,
        });
    }
}

function onSkip(action) {
    let next = ACOSServer$1.next();
    if (!next || !next.id) return;

    playerLeave(next.id);
}

function onLeave(action) {
    playerLeave(action.user.shortid);
}

let cellToName = [
    "Top Left",
    "Top Middle",
    "Top Right",
    "Middle Left",
    "Middle",
    "Middle Right",
    "Bottom Left",
    "Bottom Middle",
    "Bottom Right",
];

function onPick(action) {
    let state = ACOSServer$1.state();
    let player = ACOSServer$1.players(action.user.shortid);

    //get the picked cell
    let cellid = action.payload;
    if (
        typeof cellid !== "number" ||
        cellid < 0 ||
        cellid >= state.cells.length
    )
        return false;

    // block picking cells with markings, and send error
    let cell = state.cells[cellid];
    if (cell.length > 0) {
        player._error = "Square is not empty!";
        return true;
    }

    //mark the selected cell
    let teamType = getTeamType(player.teamid);
    if (!state.cells.includes(teamType)) {
        ACOSServer$1.stats(action.user.shortid, "FP", cellToName[cellid]);
    }
    state.cells[cellid] = teamType;

    ACOSServer$1.timer();

    ACOSServer$1.statIncrement(action.user.shortid, "P");

    ACOSServer$1.statIncrement(action.user.shortid, "F");
    ACOSServer$1.statIncrement(action.user.shortid, "A");
    ACOSServer$1.statIncrement(action.user.shortid, "T", action.timeleft / 1000);

    if (checkWinner()) {
        if (state.cells.includes(teamType)) {
            ACOSServer$1.stats(action.user.shortid, "WP", cellToName[cellid]);
        }
        return;
    }

    ACOSServer$1.setTimer(15);
    selectNextPlayer(action.user.shortid);
}

function getTeamType(teamid) {
    return teamid == "team_x" ? "X" : "O";
}

function playerLeave(shortid) {
    let players = ACOSServer$1.players();
    let otherPlayerId = null;
    if (players[shortid]) {
        otherPlayerId = selectNextPlayer(shortid);
        let otherPlayer = players[otherPlayerId];
        setWinner(otherPlayer.teamid, "forfeit");
    }
}

function selectNextPlayer(shortid) {
    //only 2 players so just filter the current player
    let playerList = ACOSServer$1.playerList();
    shortid = playerList.filter((x) => x != shortid)[0];
    ACOSServer$1.next(shortid, "pick");
    return shortid;
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
    if (checkBoardFilled()) return true;
    return false;
}

function checkBoardFilled() {
    let cells = ACOSServer$1.state().cells;
    let filtered = cells.filter((v) => v == "");

    if (filtered.length == 0) {
        setTie();
    }
    return filtered.length == 0;
}

// checks if a strip has matching types
function check(strip) {
    let cells = ACOSServer$1.state().cells;
    let first = cells[strip[0]];
    if (first == "") return false;
    let filtered = strip.filter((id) => cells[id] == first);
    if (filtered.length == 3 && filtered.length == strip.length) {
        setWinner(first == "X" ? "team_x" : "team_o", strip);
        return true;
    }
    return false;
}

function findPlayerWithType(teamid) {
    let team = ACOSServer$1.teams(teamid);
    return team.players[0];
}

function setTie() {
    ACOSServer$1.gameover({ type: "tie" });
    ACOSServer$1.next("none");
}

// set the winner event and data
function setWinner(teamid, strip) {
    //find user who matches the win type
    let shortid = findPlayerWithType(teamid);
    let player = ACOSServer$1.players(shortid);

    let team = ACOSServer$1.teams(player.teamid);
    if (team) {
        team.rank = 1;
        team.score = 100;
    }
    player.rank = 1;
    player.score = player.score + 100;

    if (strip == "forfeit") ACOSServer$1.gameerror("Player left early.");
    else
        ACOSServer$1.gameover({
            type: "winner",
            pick: teamid,
            strip: strip,
            shortid: shortid,
        });
}

//prepare gameState for mutation
ACOSServer$1.init();

//ACOS events
ACOSServer$1.on("gamestart", onNewGame);
ACOSServer$1.on("join", onJoin);
ACOSServer$1.on("leave", onLeave);
ACOSServer$1.on("skip", onSkip);

//Custom events
ACOSServer$1.on("pick", onPick);

//Save changes
ACOSServer$1.save();
//# sourceMappingURL=server.bundle.dev.js.map
