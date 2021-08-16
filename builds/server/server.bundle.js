/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./game-server/fsg.js":
/*!****************************!*\
  !*** ./game-server/fsg.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class FSG {
    constructor() {
        try {
            this.actions = JSON.parse(JSON.stringify(globals.actions()));
        }
        catch (e) { this.error('Failed to load actions'); return }
        try {
            this.originalGame = JSON.parse(JSON.stringify(globals.game()));
        }
        catch (e) { this.error('Failed to load originalGame'); return }
        try {
            this.nextGame = JSON.parse(JSON.stringify(globals.game()));
        }
        catch (e) { this.error('Failed to load nextGame'); return }


        this.currentAction = null;

        this.isNewGame = false;
        // this.markedForDelete = false;
        this.defaultSeconds = 15;
        // this.nextTimeLimit = -1;
        this.kickedPlayers = [];

        if (!this.nextGame || Object.keys(this.nextGame.rules).length == 0) {
            this.isNewGame = true;
            this.error('Missing Rules');
        }

        if (this.nextGame) {
            if (!('timer' in this.nextGame)) {
                this.nextGame.timer = {};
            }
            if (!('state' in this.nextGame)) {
                this.nextGame.state = {};
            }

            if (!('players' in this.nextGame)) {
                this.nextGame.players = {};
            }

            //if (!('prev' in this.nextGame)) {
            this.nextGame.prev = {};
            //}

            if (!('next' in this.nextGame)) {
                this.nextGame.next = {};
            }

            if (!('rules' in this.nextGame)) {
                this.nextGame.rules = {};
            }

            this.nextGame.events = {};
        }



    }

    on(type, cb) {

        if (type == 'newgame') {
            if (this.isNewGame) {
                this.currentAction = this.actions[0];
                cb(this.actions[0]);
                this.isNewGame = false;
            }

            return;
        }

        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].type == type) {
                this.currentAction = this.actions[i];
                cb(this.currentAction);
            }

        }

    }

    setGame(game) {
        for (var id in this.nextGame.players) {
            let player = this.nextGame.players[id];
            game.players[id] = { name: player.name }
        }
        this.nextGame = game;
    }

    submit() {
        if (this.kickedPlayers.length > 0)
            this.nextGame.kick = this.kickedPlayers;

        globals.finish(this.nextGame);
    }

    gameover(payload) {
        this.event('gameover', payload);
    }

    log(msg) {
        globals.log(msg);
    }
    error(msg) {
        globals.error(msg);
    }

    kickPlayer(id) {
        this.kickedPlayers.push(id);
    }

    database() {
        return globals.database();
    }

    action() {
        return this.currentAction;
    }

    state(key, value) {

        if (typeof key === 'undefined')
            return this.nextGame.state;
        if (typeof value === 'undefined')
            return this.nextGame.state[key];

        this.nextGame.state[key] = value;
    }

    playerList() {
        return Object.keys(this.nextGame.players);
    }
    playerCount() {
        return Object.keys(this.nextGame.players).length;
    }

    players(userid, value) {
        if (typeof userid === 'undefined')
            return this.nextGame.players;
        if (typeof value === 'undefined')
            return this.nextGame.players[userid];

        this.nextGame.players[userid] = value;
    }

    rules(rule, value) {
        if (typeof rule === 'undefined')
            return this.nextGame.rules;
        if (typeof value === 'undefined')
            return this.nextGame.rules[rule];

        this.nextGame.rules[rule] = value;
    }

    prev(obj) {
        if (typeof obj === 'object') {
            this.nextGame.prev = obj;
        }
        return this.nextGame.prev;
    }

    next(obj) {
        if (typeof obj === 'object') {
            this.nextGame.next = obj;
        }
        return this.nextGame.next;
    }

    setTimelimit(seconds) {
        seconds = seconds || this.defaultSeconds;
        if (!this.nextGame.timer)
            this.nextGame.timer = {};
        this.nextGame.timer.set = Math.min(60, Math.max(10, seconds));
    }

    reachedTimelimit(action) {
        if (typeof action.timeleft == 'undefined')
            return false;
        return action.timeleft <= 0;
    }

    event(name, payload) {
        if (!payload)
            return this.nextGame.events[name];

        this.nextGame.events[name] = payload || {};
    }

    clearEvents() {
        this.nextGame.events = {};
    }
    // events(name) {
    //     if (typeof name === 'undefined')
    //         return this.nextGame.events;
    //     this.nextGame.events.push(name);
    // }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new FSG());

/***/ }),

/***/ "./game-server/game.js":
/*!*****************************!*\
  !*** ./game-server/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fsg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsg */ "./game-server/fsg.js");


let defaultGame = {
    state: {
        cells: {
            0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
        },
        // cells: ['', '', '', '', '', '', '', '', ''],
        //startPlayer: ''
    },
    players: {},
    rules: {
        bestOf: 5,
        maxPlayers: 2
    },
    next: {},
    events: {}
}

class Tictactoe {

    onNewGame(action) {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next();
        if (!next || !next.id)
            return;
        // let id = action.payload.id;
        // if (!next.id) {
        //     id = next.id;
        // }

        this.playerLeave(next.id);
    }

    onJoin(action) {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.log(action);
        if (!action.user.id)
            return;

        let player = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.user.id);
        player.rank = 2;
        player.score = 0;

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('join', {
            id: action.user.id
        });

        // if (fsg.players(action.user.id).type)
        //     return;

        this.checkNewRound();
    }

    checkNewRound() {
        //if player count reached required limit, start the game
        let maxPlayers = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.rules('maxPlayers') || 2;
        let playerCount = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerCount();
        if (playerCount >= maxPlayers) {
            this.newRound();
        }
    }

    onLeave(action) {
        this.playerLeave(action.user.id);
    }

    playerLeave(id) {
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
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
        let state = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        let user = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.user.id);
        if (user.test2)
            delete user.test2;
        //get the picked cell
        let cellid = action.payload.cell;
        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({
                id: action.user.id,
                action: 'pick',
                error: 'NOT_EMPTY'
            })
            return;
        }

        //mark the selected cell
        let type = user.type;
        let id = action.user.id;
        state.cells[cellid] = type;

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('picked', {
            cellid, id
        });
        // fsg.prev()

        if (this.checkWinner()) {
            return;
        }

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.setTimelimit(20);
        this.selectNextPlayer(null);
    }

    newRound() {
        let playerList = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();

        let state = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        //select the starting player
        if (!state.startPlayer || state.startPlayer.length == 0) {
            state.startPlayer = this.selectNextPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
        }
        else {
            state.startPlayer = this.selectNextPlayer(state.startPlayer);
        }

        //set the starting player, and set type for other player
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players)
            players[id].type = 'O';
        players[state.startPlayer].type = 'X';

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('gamestart', 1);
    }

    selectNextPlayer(userid) {
        let action = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.action();
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();
        userid = userid || action.user.id;
        //only 2 players so just filter the current player
        let remaining = players.filter(x => x != userid);
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({
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
        let cells = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
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
        let cells = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
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
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players) {
            let player = players[id];
            if (player.type == type)
                return id;
        }
        return null;
    }


    setTie() {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.gameover({ type: 'tie' })
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({});
        // fsg.prev({})

        // fsg.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(userid);
        player.rank = 1;
        player.score = player.score + 100;
        if (!player) {
            player.id = 'unknown player';
        }

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.gameover({
            type: 'winner',
            pick: type,
            strip: strip,
            id: userid
        });
        // fsg.prev()
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({});
        // fsg.killGame();
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Tictactoe());

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./game-server/index.js ***!
  \******************************/
/* harmony import */ var _fsg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsg */ "./game-server/fsg.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./game-server/game.js");





_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('newgame', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onNewGame(action));
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('skip', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onSkip(action));
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onJoin(action));
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('leave', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onLeave(action));
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onPick(action));

_fsg__WEBPACK_IMPORTED_MODULE_0__.default.submit();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4vZ2FtZS1zZXJ2ZXIvZnNnLmpzIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9nYW1lLmpzIiwiLi4vLi4vd2VicGFjay9ib290c3RyYXAiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0NBQXNDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQ0FBMkM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVDQUF1Qzs7O0FBRzFEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QUFDVDtBQUNBLFFBQVEsOENBQVEsR0FBRztBQUNuQjtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsZUFBZSxFOzs7Ozs7VUMxUDlCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7Ozs7Ozs7O0FDQXdCO0FBQ087Ozs7QUFJL0IsNENBQU0sd0JBQXdCLG9EQUFtQjtBQUNqRCw0Q0FBTSxxQkFBcUIsaURBQWdCO0FBQzNDLDRDQUFNLHFCQUFxQixpREFBZ0I7QUFDM0MsNENBQU0sc0JBQXNCLGtEQUFpQjtBQUM3Qyw0Q0FBTSxxQkFBcUIsaURBQWdCOztBQUUzQyxnREFBVSxHIiwiZmlsZSI6InNlcnZlci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgRlNHIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2xvYmFscy5hY3Rpb25zKCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgdGhpcy5lcnJvcignRmFpbGVkIHRvIGxvYWQgYWN0aW9ucycpOyByZXR1cm4gfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxHYW1lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnbG9iYWxzLmdhbWUoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB0aGlzLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBvcmlnaW5hbEdhbWUnKTsgcmV0dXJuIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnbG9iYWxzLmdhbWUoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB0aGlzLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBuZXh0R2FtZScpOyByZXR1cm4gfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5pc05ld0dhbWUgPSBmYWxzZTtcclxuICAgICAgICAvLyB0aGlzLm1hcmtlZEZvckRlbGV0ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNlY29uZHMgPSAxNTtcclxuICAgICAgICAvLyB0aGlzLm5leHRUaW1lTGltaXQgPSAtMTtcclxuICAgICAgICB0aGlzLmtpY2tlZFBsYXllcnMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm5leHRHYW1lIHx8IE9iamVjdC5rZXlzKHRoaXMubmV4dEdhbWUucnVsZXMpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNOZXdHYW1lID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcignTWlzc2luZyBSdWxlcycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMubmV4dEdhbWUpIHtcclxuICAgICAgICAgICAgaWYgKCEoJ3RpbWVyJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS50aW1lciA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghKCdzdGF0ZScgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUuc3RhdGUgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCEoJ3BsYXllcnMnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnBsYXllcnMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pZiAoISgncHJldicgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5wcmV2ID0ge307XHJcbiAgICAgICAgICAgIC8vfVxyXG5cclxuICAgICAgICAgICAgaWYgKCEoJ25leHQnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLm5leHQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCEoJ3J1bGVzJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5ydWxlcyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLmV2ZW50cyA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbih0eXBlLCBjYikge1xyXG5cclxuICAgICAgICBpZiAodHlwZSA9PSAnbmV3Z2FtZScpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNOZXdHYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF07XHJcbiAgICAgICAgICAgICAgICBjYih0aGlzLmFjdGlvbnNbMF0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc05ld0dhbWUgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uc1tpXS50eXBlID09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IHRoaXMuYWN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGNiKHRoaXMuY3VycmVudEFjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzZXRHYW1lKGdhbWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm5leHRHYW1lLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMubmV4dEdhbWUucGxheWVyc1tpZF07XHJcbiAgICAgICAgICAgIGdhbWUucGxheWVyc1tpZF0gPSB7IG5hbWU6IHBsYXllci5uYW1lIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZSA9IGdhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmtpY2tlZFBsYXllcnMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5raWNrID0gdGhpcy5raWNrZWRQbGF5ZXJzO1xyXG5cclxuICAgICAgICBnbG9iYWxzLmZpbmlzaCh0aGlzLm5leHRHYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBnYW1lb3ZlcihwYXlsb2FkKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudCgnZ2FtZW92ZXInLCBwYXlsb2FkKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2cobXNnKSB7XHJcbiAgICAgICAgZ2xvYmFscy5sb2cobXNnKTtcclxuICAgIH1cclxuICAgIGVycm9yKG1zZykge1xyXG4gICAgICAgIGdsb2JhbHMuZXJyb3IobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICBraWNrUGxheWVyKGlkKSB7XHJcbiAgICAgICAgdGhpcy5raWNrZWRQbGF5ZXJzLnB1c2goaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGFiYXNlKCkge1xyXG4gICAgICAgIHJldHVybiBnbG9iYWxzLmRhdGFiYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRBY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGUoa2V5LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnN0YXRlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5zdGF0ZVtrZXldO1xyXG5cclxuICAgICAgICB0aGlzLm5leHRHYW1lLnN0YXRlW2tleV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXJMaXN0KCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm5leHRHYW1lLnBsYXllcnMpO1xyXG4gICAgfVxyXG4gICAgcGxheWVyQ291bnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMubmV4dEdhbWUucGxheWVycykubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllcnModXNlcmlkLCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdXNlcmlkID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucGxheWVycztcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucGxheWVyc1t1c2VyaWRdO1xyXG5cclxuICAgICAgICB0aGlzLm5leHRHYW1lLnBsYXllcnNbdXNlcmlkXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJ1bGVzKHJ1bGUsIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBydWxlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucnVsZXM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnJ1bGVzW3J1bGVdO1xyXG5cclxuICAgICAgICB0aGlzLm5leHRHYW1lLnJ1bGVzW3J1bGVdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldihvYmopIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5wcmV2ID0gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5wcmV2O1xyXG4gICAgfVxyXG5cclxuICAgIG5leHQob2JqKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUubmV4dCA9IG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUubmV4dDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaW1lbGltaXQoc2Vjb25kcykge1xyXG4gICAgICAgIHNlY29uZHMgPSBzZWNvbmRzIHx8IHRoaXMuZGVmYXVsdFNlY29uZHM7XHJcbiAgICAgICAgaWYgKCF0aGlzLm5leHRHYW1lLnRpbWVyKVxyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLnRpbWVyID0ge307XHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS50aW1lci5zZXQgPSBNYXRoLm1pbig2MCwgTWF0aC5tYXgoMTAsIHNlY29uZHMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZWFjaGVkVGltZWxpbWl0KGFjdGlvbikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uLnRpbWVsZWZ0ID09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbi50aW1lbGVmdCA8PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGV2ZW50KG5hbWUsIHBheWxvYWQpIHtcclxuICAgICAgICBpZiAoIXBheWxvYWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLmV2ZW50c1tuYW1lXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHNbbmFtZV0gPSBwYXlsb2FkIHx8IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMubmV4dEdhbWUuZXZlbnRzID0ge307XHJcbiAgICB9XHJcbiAgICAvLyBldmVudHMobmFtZSkge1xyXG4gICAgLy8gICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAvLyAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLmV2ZW50cztcclxuICAgIC8vICAgICB0aGlzLm5leHRHYW1lLmV2ZW50cy5wdXNoKG5hbWUpO1xyXG4gICAgLy8gfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgRlNHKCk7IiwiaW1wb3J0IGZzZyBmcm9tICcuL2ZzZyc7XHJcblxyXG5sZXQgZGVmYXVsdEdhbWUgPSB7XHJcbiAgICBzdGF0ZToge1xyXG4gICAgICAgIGNlbGxzOiB7XHJcbiAgICAgICAgICAgIDA6ICcnLCAxOiAnJywgMjogJycsIDM6ICcnLCA0OiAnJywgNTogJycsIDY6ICcnLCA3OiAnJywgODogJydcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGNlbGxzOiBbJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJ10sXHJcbiAgICAgICAgLy9zdGFydFBsYXllcjogJydcclxuICAgIH0sXHJcbiAgICBwbGF5ZXJzOiB7fSxcclxuICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgYmVzdE9mOiA1LFxyXG4gICAgICAgIG1heFBsYXllcnM6IDJcclxuICAgIH0sXHJcbiAgICBuZXh0OiB7fSxcclxuICAgIGV2ZW50czoge31cclxufVxyXG5cclxuY2xhc3MgVGljdGFjdG9lIHtcclxuXHJcbiAgICBvbk5ld0dhbWUoYWN0aW9uKSB7XHJcbiAgICAgICAgZnNnLnNldEdhbWUoZGVmYXVsdEdhbWUpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tOZXdSb3VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU2tpcChhY3Rpb24pIHtcclxuICAgICAgICBsZXQgbmV4dCA9IGZzZy5uZXh0KCk7XHJcbiAgICAgICAgaWYgKCFuZXh0IHx8ICFuZXh0LmlkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gbGV0IGlkID0gYWN0aW9uLnBheWxvYWQuaWQ7XHJcbiAgICAgICAgLy8gaWYgKCFuZXh0LmlkKSB7XHJcbiAgICAgICAgLy8gICAgIGlkID0gbmV4dC5pZDtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyTGVhdmUobmV4dC5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Kb2luKGFjdGlvbikge1xyXG4gICAgICAgIGZzZy5sb2coYWN0aW9uKTtcclxuICAgICAgICBpZiAoIWFjdGlvbi51c2VyLmlkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBmc2cucGxheWVycyhhY3Rpb24udXNlci5pZCk7XHJcbiAgICAgICAgcGxheWVyLnJhbmsgPSAyO1xyXG4gICAgICAgIHBsYXllci5zY29yZSA9IDA7XHJcblxyXG4gICAgICAgIGZzZy5ldmVudCgnam9pbicsIHtcclxuICAgICAgICAgICAgaWQ6IGFjdGlvbi51c2VyLmlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGlmIChmc2cucGxheWVycyhhY3Rpb24udXNlci5pZCkudHlwZSlcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrTmV3Um91bmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja05ld1JvdW5kKCkge1xyXG4gICAgICAgIC8vaWYgcGxheWVyIGNvdW50IHJlYWNoZWQgcmVxdWlyZWQgbGltaXQsIHN0YXJ0IHRoZSBnYW1lXHJcbiAgICAgICAgbGV0IG1heFBsYXllcnMgPSBmc2cucnVsZXMoJ21heFBsYXllcnMnKSB8fCAyO1xyXG4gICAgICAgIGxldCBwbGF5ZXJDb3VudCA9IGZzZy5wbGF5ZXJDb3VudCgpO1xyXG4gICAgICAgIGlmIChwbGF5ZXJDb3VudCA+PSBtYXhQbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV3Um91bmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25MZWF2ZShhY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnBsYXllckxlYXZlKGFjdGlvbi51c2VyLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXJMZWF2ZShpZCkge1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZnNnLnBsYXllcnMoKTtcclxuICAgICAgICBsZXQgb3RoZXJQbGF5ZXJJZCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHBsYXllcnNbaWRdKSB7XHJcbiAgICAgICAgICAgIG90aGVyUGxheWVySWQgPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIoaWQpO1xyXG4gICAgICAgICAgICAvL2RlbGV0ZSBwbGF5ZXJzW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdGhlclBsYXllcklkKSB7XHJcbiAgICAgICAgICAgIGxldCBvdGhlclBsYXllciA9IHBsYXllcnNbb3RoZXJQbGF5ZXJJZF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0V2lubmVyKG90aGVyUGxheWVyLnR5cGUsICdmb3JmZWl0JylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QaWNrKGFjdGlvbikge1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IGZzZy5zdGF0ZSgpO1xyXG4gICAgICAgIGxldCB1c2VyID0gZnNnLnBsYXllcnMoYWN0aW9uLnVzZXIuaWQpO1xyXG4gICAgICAgIGlmICh1c2VyLnRlc3QyKVxyXG4gICAgICAgICAgICBkZWxldGUgdXNlci50ZXN0MjtcclxuICAgICAgICAvL2dldCB0aGUgcGlja2VkIGNlbGxcclxuICAgICAgICBsZXQgY2VsbGlkID0gYWN0aW9uLnBheWxvYWQuY2VsbDtcclxuICAgICAgICBsZXQgY2VsbCA9IHN0YXRlLmNlbGxzW2NlbGxpZF07XHJcblxyXG4gICAgICAgIC8vIGJsb2NrIHBpY2tpbmcgY2VsbHMgd2l0aCBtYXJraW5ncywgYW5kIHNlbmQgZXJyb3JcclxuICAgICAgICBpZiAoY2VsbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZzZy5uZXh0KHtcclxuICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24udXNlci5pZCxcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3BpY2snLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdOT1RfRU1QVFknXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbWFyayB0aGUgc2VsZWN0ZWQgY2VsbFxyXG4gICAgICAgIGxldCB0eXBlID0gdXNlci50eXBlO1xyXG4gICAgICAgIGxldCBpZCA9IGFjdGlvbi51c2VyLmlkO1xyXG4gICAgICAgIHN0YXRlLmNlbGxzW2NlbGxpZF0gPSB0eXBlO1xyXG5cclxuICAgICAgICBmc2cuZXZlbnQoJ3BpY2tlZCcsIHtcclxuICAgICAgICAgICAgY2VsbGlkLCBpZFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGZzZy5wcmV2KClcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tXaW5uZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmc2cuc2V0VGltZWxpbWl0KDIwKTtcclxuICAgICAgICB0aGlzLnNlbGVjdE5leHRQbGF5ZXIobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3Um91bmQoKSB7XHJcbiAgICAgICAgbGV0IHBsYXllckxpc3QgPSBmc2cucGxheWVyTGlzdCgpO1xyXG5cclxuICAgICAgICBsZXQgc3RhdGUgPSBmc2cuc3RhdGUoKTtcclxuICAgICAgICAvL3NlbGVjdCB0aGUgc3RhcnRpbmcgcGxheWVyXHJcbiAgICAgICAgaWYgKCFzdGF0ZS5zdGFydFBsYXllciB8fCBzdGF0ZS5zdGFydFBsYXllci5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzdGF0ZS5zdGFydFBsYXllciA9IHRoaXMuc2VsZWN0TmV4dFBsYXllcihwbGF5ZXJMaXN0W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllckxpc3QubGVuZ3RoKV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RhdGUuc3RhcnRQbGF5ZXIgPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIoc3RhdGUuc3RhcnRQbGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9zZXQgdGhlIHN0YXJ0aW5nIHBsYXllciwgYW5kIHNldCB0eXBlIGZvciBvdGhlciBwbGF5ZXJcclxuICAgICAgICBsZXQgcGxheWVycyA9IGZzZy5wbGF5ZXJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gcGxheWVycylcclxuICAgICAgICAgICAgcGxheWVyc1tpZF0udHlwZSA9ICdPJztcclxuICAgICAgICBwbGF5ZXJzW3N0YXRlLnN0YXJ0UGxheWVyXS50eXBlID0gJ1gnO1xyXG5cclxuICAgICAgICBmc2cuZXZlbnQoJ2dhbWVzdGFydCcsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE5leHRQbGF5ZXIodXNlcmlkKSB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IGZzZy5hY3Rpb24oKTtcclxuICAgICAgICBsZXQgcGxheWVycyA9IGZzZy5wbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgdXNlcmlkID0gdXNlcmlkIHx8IGFjdGlvbi51c2VyLmlkO1xyXG4gICAgICAgIC8vb25seSAyIHBsYXllcnMgc28ganVzdCBmaWx0ZXIgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgICAgbGV0IHJlbWFpbmluZyA9IHBsYXllcnMuZmlsdGVyKHggPT4geCAhPSB1c2VyaWQpO1xyXG4gICAgICAgIGZzZy5uZXh0KHtcclxuICAgICAgICAgICAgaWQ6IHJlbWFpbmluZ1swXSxcclxuICAgICAgICAgICAgYWN0aW9uOiAncGljaydcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVtYWluaW5nWzBdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBDaGVjayBlYWNoIHN0cmlwIHRoYXQgbWFrZXMgYSB3aW5cclxuICAgIC8vICAgICAgMCAgfCAgMSAgfCAgMlxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgMyAgfCAgNCAgfCAgNVxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgNiAgfCAgNyAgfCAgOFxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDEsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzMsIDQsIDVdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDcsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDMsIDZdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzEsIDQsIDddKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzIsIDUsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDQsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDQsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tOb25lRW1wdHkoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrTm9uZUVtcHR5KCkge1xyXG4gICAgICAgIGxldCBjZWxscyA9IGZzZy5zdGF0ZSgpLmNlbGxzO1xyXG4gICAgICAgIGxldCBjZWxsc2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2VsbHMpIHtcclxuICAgICAgICAgICAgY2VsbHNsaXN0LnB1c2goY2VsbHNba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IGNlbGxzbGlzdC5maWx0ZXIodiA9PiB2ID09ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGllKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZC5sZW5ndGggPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVja3MgaWYgYSBzdHJpcCBoYXMgbWF0Y2hpbmcgdHlwZXNcclxuICAgIGNoZWNrKHN0cmlwKSB7XHJcbiAgICAgICAgbGV0IGNlbGxzID0gZnNnLnN0YXRlKCkuY2VsbHM7XHJcbiAgICAgICAgbGV0IGNlbGxzbGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjZWxscykge1xyXG4gICAgICAgICAgICBjZWxsc2xpc3QucHVzaChjZWxsc1trZXldKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgZmlyc3QgPSBjZWxsc2xpc3Rbc3RyaXBbMF1dO1xyXG4gICAgICAgIGlmIChmaXJzdCA9PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IHN0cmlwLmZpbHRlcihpZCA9PiBjZWxsc2xpc3RbaWRdID09IGZpcnN0KTtcclxuICAgICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09IDMgJiYgZmlsdGVyZWQubGVuZ3RoID09IHN0cmlwLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFdpbm5lcihmaXJzdCwgc3RyaXApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRQbGF5ZXJXaXRoVHlwZSh0eXBlKSB7XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBmc2cucGxheWVycygpO1xyXG4gICAgICAgIGZvciAodmFyIGlkIGluIHBsYXllcnMpIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbaWRdO1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLnR5cGUgPT0gdHlwZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldFRpZSgpIHtcclxuICAgICAgICBmc2cuZ2FtZW92ZXIoeyB0eXBlOiAndGllJyB9KVxyXG4gICAgICAgIGZzZy5uZXh0KHt9KTtcclxuICAgICAgICAvLyBmc2cucHJldih7fSlcclxuXHJcbiAgICAgICAgLy8gZnNnLmtpbGxHYW1lKCk7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgdGhlIHdpbm5lciBldmVudCBhbmQgZGF0YVxyXG4gICAgc2V0V2lubmVyKHR5cGUsIHN0cmlwKSB7XHJcbiAgICAgICAgLy9maW5kIHVzZXIgd2hvIG1hdGNoZXMgdGhlIHdpbiB0eXBlXHJcbiAgICAgICAgbGV0IHVzZXJpZCA9IHRoaXMuZmluZFBsYXllcldpdGhUeXBlKHR5cGUpO1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBmc2cucGxheWVycyh1c2VyaWQpO1xyXG4gICAgICAgIHBsYXllci5yYW5rID0gMTtcclxuICAgICAgICBwbGF5ZXIuc2NvcmUgPSBwbGF5ZXIuc2NvcmUgKyAxMDA7XHJcbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcclxuICAgICAgICAgICAgcGxheWVyLmlkID0gJ3Vua25vd24gcGxheWVyJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZzZy5nYW1lb3Zlcih7XHJcbiAgICAgICAgICAgIHR5cGU6ICd3aW5uZXInLFxyXG4gICAgICAgICAgICBwaWNrOiB0eXBlLFxyXG4gICAgICAgICAgICBzdHJpcDogc3RyaXAsXHJcbiAgICAgICAgICAgIGlkOiB1c2VyaWRcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBmc2cucHJldigpXHJcbiAgICAgICAgZnNnLm5leHQoe30pO1xyXG4gICAgICAgIC8vIGZzZy5raWxsR2FtZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgVGljdGFjdG9lKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgZnNnIGZyb20gJy4vZnNnJztcclxuaW1wb3J0IHRpY3RhY3RvZSBmcm9tICcuL2dhbWUnO1xyXG5cclxuXHJcblxyXG5mc2cub24oJ25ld2dhbWUnLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25OZXdHYW1lKGFjdGlvbikpO1xyXG5mc2cub24oJ3NraXAnLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25Ta2lwKGFjdGlvbikpO1xyXG5mc2cub24oJ2pvaW4nLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25Kb2luKGFjdGlvbikpO1xyXG5mc2cub24oJ2xlYXZlJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uTGVhdmUoYWN0aW9uKSk7XHJcbmZzZy5vbigncGljaycsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vblBpY2soYWN0aW9uKSk7XHJcblxyXG5mc2cuc3VibWl0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==