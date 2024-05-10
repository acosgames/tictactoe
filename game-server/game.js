// import ACOSServer from './acosg';

import { ACOSServer } from "acosgames";

// let defaultGame = {
//     state: {
//         // cells2: {
//         //     0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
//         // },
//         cells: ['', '', '', '', '', '', '', '', ''],
//         //sx: ''
//     },
//     players: {},
//     next: {},
//     events: {}
// }

// let defaultState = { cells: ["", "", "", "", "", "", "", "", ""] };

class Tictactoe {
    defaultState = { cells: ["", "", "", "", "", "", "", "", ""] };

    onNewGame(action) {
        let game = ACOSServer.gamestate();
        game.state = this.defaultState;

        this.checkNewRound();
    }

    onSkip(action) {
        let next = ACOSServer.next();
        if (!next || !next.id) return;
        // let id = action.payload.id;
        // if (!next.id) {
        //     id = next.id;
        // }

        this.playerLeave(next.id);
    }

    onJoin(action) {
        ACOSServer.output(action);
        if (!action.user.id) return;

        let player = ACOSServer.players(action.user.id);
        // player.rank = 2;
        // player.score = 0;

        let teams = ACOSServer.teams();
        if (teams && player.teamid) {
            teams[player.teamid].rank = 2;
            teams[player.teamid].score = 0;
        }

        ACOSServer.output("TICTACTOE PLAYER INFO:");
        ACOSServer.output(player);

        ACOSServer.players(action.user.id, player);

        let playerCount = ACOSServer.playerCount();
        if (playerCount <= 2) {
            ACOSServer.event("join", {
                id: action.user.id,
            });
            // this.checkNewRound();
        } else {
        }

        // if (ACOSServer.players(action.user.id).type)
        //     return;
    }

    checkNewRound() {
        //if player count reached required limit, start the game
        //let maxPlayers = ACOSServer.rules('maxPlayers') || 2;
        let playerCount = ACOSServer.playerCount();
        if (playerCount >= 2) {
            this.newRound();
        }
    }

    onLeave(action) {
        this.playerLeave(action.user.id);
    }

    playerLeave(id) {
        let players = ACOSServer.players();
        let otherPlayerId = null;
        if (players[id]) {
            otherPlayerId = this.selectNextPlayer(id);
            //delete players[id];
        }

        if (otherPlayerId) {
            let otherPlayer = players[otherPlayerId];
            this.setWinner(otherPlayer.type, "forfeit");
        }
    }

    onPick(action) {
        let room = ACOSServer.room();
        if (room.status != "gamestart") return false;

        let state = ACOSServer.state();
        let user = ACOSServer.players(action.user.id);
        if (user.test2) delete user.test2;
        //get the picked cell
        let cellid = action.payload;
        if (typeof cellid !== "number") return false;

        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            ACOSServer.next({
                id: action.user.id,
                action: "pick",
                error: "NOT_EMPTY",
            });
            return false;
        }

        //mark the selected cell
        let type = user.type;
        let id = action.user.id;
        state.cells[cellid] = type;

        // ACOSServer.event('picked', {
        //     cellid, id
        // });
        // ACOSServer.prev()

        if (this.checkWinner()) {
            return;
        }

        ACOSServer.setTimelimit(15);
        this.selectNextPlayer(null);
    }

    newRound() {
        let playerList = ACOSServer.playerList();

        let state = ACOSServer.state();
        //select the starting player

        let xteam = ACOSServer.teams("team_x");
        // let xplayer = ACOSServer.players(  );

        state.sx = xteam.players[0];

        ACOSServer.next({
            id: state.sx,
            action: "pick",
        });
        let players = ACOSServer.players() || {};
        let playerIds = Object.keys(players);

        let otherIds = playerIds.filter((value) => value != state.sx);

        // let x = ACOSServer.randomInt(0, 2);
        // let o = x == 0 ? 1 : 0;
        let playerX = state.sx; //playerIds[x];
        let playerO = otherIds[0]; //playerIds[o];

        players[playerX].type = "X";
        players[playerO].type = "O";

        ACOSServer.event("newround", true);
        ACOSServer.setTimelimit(15);
    }

    selectNextPlayer(userid) {
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
    checkWinner() {
        if (this.check([0, 1, 2])) return true;
        if (this.check([3, 4, 5])) return true;
        if (this.check([6, 7, 8])) return true;
        if (this.check([0, 3, 6])) return true;
        if (this.check([1, 4, 7])) return true;
        if (this.check([2, 5, 8])) return true;
        if (this.check([0, 4, 8])) return true;
        if (this.check([6, 4, 2])) return true;
        if (this.checkNoneEmpty()) return true;
        return false;
    }

    checkNoneEmpty() {
        let cells = ACOSServer.state().cells;
        // let cellslist = [];
        // for (var key in cells) {
        //     cellslist.push(cells[key]);
        // }
        let filtered = cells.filter((v) => v == "");

        if (filtered.length == 0) {
            this.setTie();
        }
        return filtered.length == 0;
    }

    // checks if a strip has matching types
    check(strip) {
        let cells = ACOSServer.state().cells;
        // let cellslist = [];
        // for (var key in cells) {
        //     cellslist.push(cells[key]);
        // }

        let first = cells[strip[0]];
        if (first == "") return false;
        let filtered = strip.filter((id) => cells[id] == first);
        if (filtered.length == 3 && filtered.length == strip.length) {
            this.setWinner(first, strip);
            return true;
        }
        return false;
    }

    findPlayerWithType(type) {
        let players = ACOSServer.players();
        for (var id in players) {
            let player = players[id];
            if (player.type == type) return id;
        }
        return null;
    }

    setTie() {
        ACOSServer.gameover({ type: "tie" });
        ACOSServer.next({});
        // ACOSServer.prev({})

        // ACOSServer.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = ACOSServer.players(userid);

        let teams = ACOSServer.teams();
        if (teams && player.teamid) {
            teams[player.teamid].rank = 1;
            teams[player.teamid].score = 100;
        }
        // player.rank = 1;
        // player.score = player.score + 100;
        if (!player) {
            player.id = "unknown player";
        }

        ACOSServer.gameover({
            type: "winner",
            pick: type,
            strip: strip,
            id: userid,
        });
        // cup.prev()
        ACOSServer.next({});
        // ACOSServer.killGame();
    }
}

export default new Tictactoe();
