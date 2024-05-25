import { ACOSServer } from "acosgames";

const defaultBoard = ["", "", "", "", "", "", "", "", ""];

export function onNewGame(action) {
    let state = ACOSServer.state();
    state.cells = defaultBoard;

    //select the starting player
    let team = ACOSServer.teams("team_x");
    let shortid = team.players[0];

    ACOSServer.next(shortid, "pick");
    ACOSServer.events("newround", true);
    ACOSServer.setTimer(15);
}

export function onJoin(action) {
    ACOSServer.log(action);
    if (!action.user.shortid) return;

    let player = ACOSServer.players(action.user.shortid);
    player.rank = 2;
    player.score = 0;

    let teams = ACOSServer.teams();
    if (teams && player.teamid) {
        teams[player.teamid].rank = 2;
        teams[player.teamid].score = 0;
    }

    ACOSServer.log("TICTACTOE PLAYER INFO:");
    ACOSServer.log(player);

    ACOSServer.players(action.user.shortid, player);

    let playerCount = ACOSServer.playerCount();
    if (playerCount <= 2) {
        ACOSServer.events("join", {
            shortid: action.user.shortid,
        });
    }
}

export function onSkip(action) {
    let next = ACOSServer.next();
    if (!next || !next.id) return;

    playerLeave(next.id);
}

export function onLeave(action) {
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

export function onPick(action) {
    let state = ACOSServer.state();
    let player = ACOSServer.players(action.user.shortid);

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
        ACOSServer.stats(action.user.shortid, "FP", cellToName[cellid]);
    }
    state.cells[cellid] = teamType;

    let timer = ACOSServer.timer();

    ACOSServer.statIncrement(action.user.shortid, "P");

    ACOSServer.statIncrement(action.user.shortid, "F", 1.1);
    ACOSServer.statIncrement(action.user.shortid, "A");
    ACOSServer.statIncrement(action.user.shortid, "T", action.timeleft / 1000);

    if (checkWinner()) {
        if (state.cells.includes(teamType)) {
            ACOSServer.stats(action.user.shortid, "WP", cellToName[cellid]);
        }
        return;
    }

    ACOSServer.setTimer(15);
    selectNextPlayer(action.user.shortid);
}

function getTeamType(teamid) {
    return teamid == "team_x" ? "X" : "O";
}

function playerLeave(shortid) {
    let players = ACOSServer.players();
    let otherPlayerId = null;
    if (players[shortid]) {
        otherPlayerId = selectNextPlayer(shortid);
        let otherPlayer = players[otherPlayerId];
        setWinner(otherPlayer.teamid, "forfeit");
    }
}

function selectNextPlayer(shortid) {
    //only 2 players so just filter the current player
    let playerList = ACOSServer.playerList();
    shortid = playerList.filter((x) => x != shortid)[0];
    ACOSServer.next(shortid, "pick");
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
        setWinner(first == "X" ? "team_x" : "team_o", strip);
        return true;
    }
    return false;
}

function findPlayerWithType(teamid) {
    let team = ACOSServer.teams(teamid);
    return team.players[0];
}

function setTie() {
    ACOSServer.gameover({ type: "tie" });
    ACOSServer.next("none");
}

// set the winner event and data
function setWinner(teamid, strip) {
    //find user who matches the win type
    let shortid = findPlayerWithType(teamid);
    let player = ACOSServer.players(shortid);

    let team = ACOSServer.teams(player.teamid);
    if (team) {
        team.rank = 1;
        team.score = 100;
    }
    player.rank = 1;
    player.score = player.score + 100;

    if (strip == "forfeit") ACOSServer.gameerror("Player left early.");
    else
        ACOSServer.gameover({
            type: "winner",
            pick: teamid,
            strip: strip,
            shortid: shortid,
        });
}
