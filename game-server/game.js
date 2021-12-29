import fsg from './fsg';

let defaultGame = {
    state: {
        cells: {
            0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
        },
        // cells: ['', '', '', '', '', '', '', '', ''],
        //sx: ''
    },
    players: {},
    next: {},
    events: {}
}

class Tictactoe {

    onNewGame(action) {
        fsg.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = fsg.next();
        if (!next || !next.id)
            return;
        // let id = action.payload.id;
        // if (!next.id) {
        //     id = next.id;
        // }

        this.playerLeave(next.id);
    }

    onJoin(action) {
        fsg.log(action);
        if (!action.user.id)
            return;

        let player = fsg.players(action.user.id);
        player.rank = 2;
        player.score = 0;

        let playerCount = fsg.playerCount();
        if (playerCount <= 2) {
            fsg.event('join', {
                id: action.user.id
            });
            // this.checkNewRound();
        }
        else {

        }


        // if (fsg.players(action.user.id).type)
        //     return;


    }

    checkNewRound() {
        //if player count reached required limit, start the game
        //let maxPlayers = fsg.rules('maxPlayers') || 2;
        let playerCount = fsg.playerCount();
        if (playerCount >= 2) {
            this.newRound();
        }
    }

    onLeave(action) {
        this.playerLeave(action.user.id);
    }

    playerLeave(id) {
        let players = fsg.players();
        let otherPlayerId = null;
        if (players[id]) {
            otherPlayerId = this.selectNextPlayer(id);
            //delete players[id];
        }

        if (otherPlayerId) {
            let otherPlayer = players[otherPlayerId];
            this.setWinner(otherPlayer.type, 'forfeit')
        }
    }

    onPick(action) {
        let state = fsg.state();
        let user = fsg.players(action.user.id);
        if (user.test2)
            delete user.test2;
        //get the picked cell
        let cellid = action.payload;
        if (typeof cellid !== 'number')
            return false;

        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            fsg.next({
                id: action.user.id,
                action: 'pick',
                error: 'NOT_EMPTY'
            })
            return false;
        }

        //mark the selected cell
        let type = user.type;
        let id = action.user.id;
        state.cells[cellid] = type;

        fsg.event('picked', {
            cellid, id
        });
        // fsg.prev()

        if (this.checkWinner()) {
            return;
        }

        fsg.setTimelimit(10);
        this.selectNextPlayer(null);
    }

    newRound() {
        let playerList = fsg.playerList();

        let state = fsg.state();
        //select the starting player
        if (!state.sx || state.sx.length == 0) {
            state.sx = this.selectNextPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
        }
        else {
            state.sx = this.selectNextPlayer(state.sx);
        }

        //set the starting player, and set type for other player
        let players = fsg.players();
        for (var id in players)
            players[id].type = 'O';
        players[state.sx].type = 'X';

        fsg.event('newround', true);
        fsg.setTimelimit(15);
    }

    selectNextPlayer(userid) {
        let action = fsg.action();
        let players = fsg.playerList();
        userid = userid || action.user.id;
        //only 2 players so just filter the current player
        let remaining = players.filter(x => x != userid);
        fsg.next({
            id: remaining[0],
            action: 'pick'
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
        let cells = fsg.state().cells;
        let cellslist = [];
        for (var key in cells) {
            cellslist.push(cells[key]);
        }
        let filtered = cellslist.filter(v => v == '');

        if (filtered.length == 0) {
            this.setTie();
        }
        return filtered.length == 0;
    }

    // checks if a strip has matching types
    check(strip) {
        let cells = fsg.state().cells;
        let cellslist = [];
        for (var key in cells) {
            cellslist.push(cells[key]);
        }


        let first = cellslist[strip[0]];
        if (first == '')
            return false;
        let filtered = strip.filter(id => cellslist[id] == first);
        if (filtered.length == 3 && filtered.length == strip.length) {
            this.setWinner(first, strip);
            return true;
        }
        return false;
    }

    findPlayerWithType(type) {
        let players = fsg.players();
        for (var id in players) {
            let player = players[id];
            if (player.type == type)
                return id;
        }
        return null;
    }


    setTie() {
        fsg.gameover({ type: 'tie' })
        fsg.next({});
        // fsg.prev({})

        // fsg.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = fsg.players(userid);
        player.rank = 1;
        player.score = player.score + 100;
        if (!player) {
            player.id = 'unknown player';
        }

        fsg.gameover({
            type: 'winner',
            pick: type,
            strip: strip,
            id: userid
        });
        // fsg.prev()
        fsg.next({});
        // fsg.killGame();
    }
}

export default new Tictactoe();