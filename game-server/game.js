import fsg from './fsg';

let defaultGame = {
    state: {
        cells: ['', '', '', '', '', '', '', '', ''],
        startPlayer: ''
    },
    players: {},
    rules: {
        bestOf: 5,
        maxPlayers: 2
    },
    next: {},
    events: []
}

class Tictactoe {

    onNewGame() {
        return defaultGame
    }

    onJoin() {
        let action = fsg.action();
        if (!action.userid)
            return;

        if (fsg.players(action.userid).type)
            return;
        //if player count reached required limit, start the game
        let maxPlayers = fsg.rules('maxPlayers') || 2;
        let playerCount = fsg.playerCount();
        if (playerCount >= maxPlayers) {
            this.newRound();
        }
    }

    onLeave() {
        let players = fsg.players();
        let action = fsg.action();

        let otherPlayerId = null;
        if (players[action.userid]) {
            otherPlayerId = this.selectNextPlayer(action.userid);
            delete players[action.userid];
        }

        if (otherPlayerId) {
            let otherPlayer = players[otherPlayerId];
            this.setWinner(otherPlayer.type, 'forfeit')
        }
    }

    onPick() {
        let state = fsg.state();
        let action = fsg.action();
        let user = fsg.players(action.userid);

        //get the picked cell
        let cellid = action.payload.cell;
        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            fsg.next({
                userid: action.userid,
                action: 'pick',
                error: 'NOT_EMPTY'
            })
            return;
        }

        //mark the selected cell
        let type = user.type;
        let userid = action.userid;
        state.cells[cellid] = type;

        fsg.event('picked');
        fsg.prev({
            cellid, userid
        })

        if (this.checkWinner()) {
            return;
        }

        this.selectNextPlayer();
    }

    newRound() {
        let playerList = fsg.playerList();

        //select the starting player
        if (!this.startPlayer || this.startPlayer.length == 0) {
            this.startPlayer = this.selectNextPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
        }
        else {
            this.startPlayer = this.selectNextPlayer(this.startPlayer);
        }

        //set the starting player, and set type for other player
        let players = fsg.players();
        for (var id in players)
            players[id].type = 'O';
        players[this.startPlayer].type = 'X';
    }

    selectNextPlayer(userid) {
        let action = fsg.action();
        let players = fsg.playerList();
        userid = userid || action.userid;
        //only 2 players so just filter the current player
        let remaining = players.filter(x => x != action.userid);
        fsg.next({
            userid: remaining[0],
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
        let filtered = cells.filter(v => v == '');

        if (filtered.length == 0) {
            this.setTie();
        }
        return filtered.length == 0;
    }

    // checks if a strip has matching types
    check(strip) {
        let cells = fsg.state().cells;
        let first = cells[strip[0]];
        if (first == '')
            return false;
        let filtered = strip.filter(id => cells[id] == first);
        if (filtered.length == 3 && filtered.length == strip.length) {
            this.setWinner(first, strip);
            return true;
        }
        return false;
    }

    findPlayerWithType(type) {
        let players = fsg.players();
        for (var userid in players) {
            let player = players[userid];
            if (player.type == type)
                return userid;
        }
        return null;
    }


    setTie() {
        fsg.clearEvents();
        fsg.event('tie')
        fsg.next({});
        fsg.prev({})

        fsg.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = fsg.players(userid);
        if (!player) {
            player.userid = 'unknown player';
        }
        fsg.clearEvents();
        fsg.event('winner')
        fsg.prev({
            pick: type,
            strip: strip,
            userid: userid
        })
        fsg.next({});

        // fsg.killGame();
    }
}

export default new Tictactoe();