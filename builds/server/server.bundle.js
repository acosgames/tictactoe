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
        this.markedForDelete = false;
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

            //if (!('events' in this.nextGame)) {
            this.nextGame.events = [];
            //}
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
            //return;
            // this.nextGame = Object.assign({}, defaultGame, { players: this.nextGame.players })
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
        //game.players = Object.assign({}, game.players, this.nextGame.players)
        this.nextGame = game;
    }

    submit() {
        // if (this.nextGame.timer && this.nextTimeLimit > -1) {
        //     this.nextGame.timer.timelimit = this.nextTimeLimit;
        //     // if (this.markedForDelete)
        //     //     delete this.nextGame.next['timelimit'];
        // }

        //if next info has been updated, we force a new timer
        // let prevNextUser = JSON.stringify(this.originalGame.next);
        // let curNextUser = JSON.stringify(this.nextGame.next);
        // if (prevNextUser != curNextUser && typeof this.nextGame.timer.set == 'undefined') {
        //     this.setTimelimit()
        // }

        if (this.kickedPlayers.length > 0)
            this.nextGame.kick = this.kickedPlayers;

        globals.finish(this.nextGame);
    }

    killGame() {
        this.markedForDelete = true;
        globals.killGame();
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

    event(name) {
        this.nextGame.events.push(name);
    }

    clearEvents() {
        this.nextGame.events = [];
    }
    events(name) {
        if (typeof name === 'undefined')
            return this.nextGame.events;
        this.nextGame.events.push(name);
    }
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

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('picked');
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.prev({
            cellid, id
        })

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
        let filtered = cells.filter(v => v == '');

        if (filtered.length == 0) {
            this.setTie();
        }
        return filtered.length == 0;
    }

    // checks if a strip has matching types
    check(strip) {
        let cells = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
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
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players) {
            let player = players[id];
            if (player.type == type)
                return id;
        }
        return null;
    }


    setTie() {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.clearEvents();
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('tie')
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({});
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.prev({})

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(userid);
        player.rank = 1;
        player.score = player.score + 1;
        if (!player) {
            player.id = 'unknown player';
        }
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.clearEvents();
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('winner')
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.prev({
            pick: type,
            strip: strip,
            id: userid
        })
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({});

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.killGame();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4vZ2FtZS1zZXJ2ZXIvZnNnLmpzIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9nYW1lLmpzIiwiLi4vLi4vd2VicGFjay9ib290c3RyYXAiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0NBQXNDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQ0FBMkM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVDQUF1Qzs7O0FBRzFEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0MsZ0JBQWdCLGlDQUFpQztBQUNoRzs7QUFFQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLHlDQUF5QztBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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QUFDdkIsUUFBUSwrQ0FBUztBQUNqQixRQUFRLDhDQUFRO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRLDhDQUFRLEdBQUc7O0FBRW5CLFFBQVEsa0RBQVk7QUFDcEI7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEU7Ozs7OztVQ3ZPOUI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7Ozs7Ozs7Ozs7QUNBd0I7QUFDTzs7OztBQUkvQiw0Q0FBTSx3QkFBd0Isb0RBQW1CO0FBQ2pELDRDQUFNLHFCQUFxQixpREFBZ0I7QUFDM0MsNENBQU0scUJBQXFCLGlEQUFnQjtBQUMzQyw0Q0FBTSxzQkFBc0Isa0RBQWlCO0FBQzdDLDRDQUFNLHFCQUFxQixpREFBZ0I7O0FBRTNDLGdEQUFVLEciLCJmaWxlIjoic2VydmVyLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBGU0cge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnbG9iYWxzLmFjdGlvbnMoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB0aGlzLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBhY3Rpb25zJyk7IHJldHVybiB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbEdhbWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuZ2FtZSgpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IHRoaXMuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIG9yaWdpbmFsR2FtZScpOyByZXR1cm4gfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuZ2FtZSgpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IHRoaXMuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIG5leHRHYW1lJyk7IHJldHVybiB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmlzTmV3R2FtZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubWFya2VkRm9yRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2Vjb25kcyA9IDE1O1xyXG4gICAgICAgIC8vIHRoaXMubmV4dFRpbWVMaW1pdCA9IC0xO1xyXG4gICAgICAgIHRoaXMua2lja2VkUGxheWVycyA9IFtdO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMubmV4dEdhbWUgfHwgT2JqZWN0LmtleXModGhpcy5uZXh0R2FtZS5ydWxlcykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pc05ld0dhbWUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmVycm9yKCdNaXNzaW5nIFJ1bGVzJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5uZXh0R2FtZSkge1xyXG4gICAgICAgICAgICBpZiAoISgndGltZXInIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnRpbWVyID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoJ3N0YXRlJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5zdGF0ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISgncGxheWVycycgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucGxheWVycyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2lmICghKCdwcmV2JyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLnByZXYgPSB7fTtcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnbmV4dCcgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUubmV4dCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISgncnVsZXMnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnJ1bGVzID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaWYgKCEoJ2V2ZW50cycgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHMgPSBbXTtcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uKHR5cGUsIGNiKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09ICduZXdnYW1lJykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc05ld0dhbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IHRoaXMuYWN0aW9uc1swXTtcclxuICAgICAgICAgICAgICAgIGNiKHRoaXMuYWN0aW9uc1swXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzTmV3R2FtZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vcmV0dXJuO1xyXG4gICAgICAgICAgICAvLyB0aGlzLm5leHRHYW1lID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdEdhbWUsIHsgcGxheWVyczogdGhpcy5uZXh0R2FtZS5wbGF5ZXJzIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hY3Rpb25zW2ldLnR5cGUgPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gdGhpcy5hY3Rpb25zW2ldO1xyXG4gICAgICAgICAgICAgICAgY2IodGhpcy5jdXJyZW50QWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldEdhbWUoZ2FtZSkge1xyXG4gICAgICAgIGZvciAodmFyIGlkIGluIHRoaXMubmV4dEdhbWUucGxheWVycykge1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5uZXh0R2FtZS5wbGF5ZXJzW2lkXTtcclxuICAgICAgICAgICAgZ2FtZS5wbGF5ZXJzW2lkXSA9IHsgbmFtZTogcGxheWVyLm5hbWUgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2dhbWUucGxheWVycyA9IE9iamVjdC5hc3NpZ24oe30sIGdhbWUucGxheWVycywgdGhpcy5uZXh0R2FtZS5wbGF5ZXJzKVxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUgPSBnYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHN1Ym1pdCgpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5uZXh0R2FtZS50aW1lciAmJiB0aGlzLm5leHRUaW1lTGltaXQgPiAtMSkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLm5leHRHYW1lLnRpbWVyLnRpbWVsaW1pdCA9IHRoaXMubmV4dFRpbWVMaW1pdDtcclxuICAgICAgICAvLyAgICAgLy8gaWYgKHRoaXMubWFya2VkRm9yRGVsZXRlKVxyXG4gICAgICAgIC8vICAgICAvLyAgICAgZGVsZXRlIHRoaXMubmV4dEdhbWUubmV4dFsndGltZWxpbWl0J107XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvL2lmIG5leHQgaW5mbyBoYXMgYmVlbiB1cGRhdGVkLCB3ZSBmb3JjZSBhIG5ldyB0aW1lclxyXG4gICAgICAgIC8vIGxldCBwcmV2TmV4dFVzZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm9yaWdpbmFsR2FtZS5uZXh0KTtcclxuICAgICAgICAvLyBsZXQgY3VyTmV4dFVzZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLm5leHRHYW1lLm5leHQpO1xyXG4gICAgICAgIC8vIGlmIChwcmV2TmV4dFVzZXIgIT0gY3VyTmV4dFVzZXIgJiYgdHlwZW9mIHRoaXMubmV4dEdhbWUudGltZXIuc2V0ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuc2V0VGltZWxpbWl0KClcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmtpY2tlZFBsYXllcnMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5raWNrID0gdGhpcy5raWNrZWRQbGF5ZXJzO1xyXG5cclxuICAgICAgICBnbG9iYWxzLmZpbmlzaCh0aGlzLm5leHRHYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBraWxsR2FtZSgpIHtcclxuICAgICAgICB0aGlzLm1hcmtlZEZvckRlbGV0ZSA9IHRydWU7XHJcbiAgICAgICAgZ2xvYmFscy5raWxsR2FtZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZyhtc2cpIHtcclxuICAgICAgICBnbG9iYWxzLmxvZyhtc2cpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IobXNnKSB7XHJcbiAgICAgICAgZ2xvYmFscy5lcnJvcihtc2cpO1xyXG4gICAgfVxyXG5cclxuICAgIGtpY2tQbGF5ZXIoaWQpIHtcclxuICAgICAgICB0aGlzLmtpY2tlZFBsYXllcnMucHVzaChpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YWJhc2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbHMuZGF0YWJhc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0ZShrZXksIHZhbHVlKSB7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUuc3RhdGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnN0YXRlW2tleV07XHJcblxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUuc3RhdGVba2V5XSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllckxpc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMubmV4dEdhbWUucGxheWVycyk7XHJcbiAgICB9XHJcbiAgICBwbGF5ZXJDb3VudCgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5uZXh0R2FtZS5wbGF5ZXJzKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVycyh1c2VyaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VyaWQgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5wbGF5ZXJzO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5wbGF5ZXJzW3VzZXJpZF07XHJcblxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUucGxheWVyc1t1c2VyaWRdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcnVsZXMocnVsZSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJ1bGUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ydWxlcztcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucnVsZXNbcnVsZV07XHJcblxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUucnVsZXNbcnVsZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2KG9iaikge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLnByZXYgPSBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnByZXY7XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dChvYmopIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5uZXh0ID0gb2JqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5uZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldFRpbWVsaW1pdChzZWNvbmRzKSB7XHJcbiAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgfHwgdGhpcy5kZWZhdWx0U2Vjb25kcztcclxuICAgICAgICBpZiAoIXRoaXMubmV4dEdhbWUudGltZXIpXHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUudGltZXIgPSB7fTtcclxuICAgICAgICB0aGlzLm5leHRHYW1lLnRpbWVyLnNldCA9IE1hdGgubWluKDYwLCBNYXRoLm1heCgxMCwgc2Vjb25kcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWNoZWRUaW1lbGltaXQoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhY3Rpb24udGltZWxlZnQgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gYWN0aW9uLnRpbWVsZWZ0IDw9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZXZlbnQobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmV4dEdhbWUuZXZlbnRzLnB1c2gobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJFdmVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHMgPSBbXTtcclxuICAgIH1cclxuICAgIGV2ZW50cyhuYW1lKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUuZXZlbnRzO1xyXG4gICAgICAgIHRoaXMubmV4dEdhbWUuZXZlbnRzLnB1c2gobmFtZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBGU0coKTsiLCJpbXBvcnQgZnNnIGZyb20gJy4vZnNnJztcclxuXHJcbmxldCBkZWZhdWx0R2FtZSA9IHtcclxuICAgIHN0YXRlOiB7XHJcbiAgICAgICAgY2VsbHM6IFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcclxuICAgICAgICBzdGFydFBsYXllcjogJydcclxuICAgIH0sXHJcbiAgICBwbGF5ZXJzOiB7fSxcclxuICAgIHJ1bGVzOiB7XHJcbiAgICAgICAgYmVzdE9mOiA1LFxyXG4gICAgICAgIG1heFBsYXllcnM6IDJcclxuICAgIH0sXHJcbiAgICBuZXh0OiB7fSxcclxuICAgIGV2ZW50czogW11cclxufVxyXG5cclxuY2xhc3MgVGljdGFjdG9lIHtcclxuXHJcbiAgICBvbk5ld0dhbWUoYWN0aW9uKSB7XHJcbiAgICAgICAgZnNnLnNldEdhbWUoZGVmYXVsdEdhbWUpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tOZXdSb3VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uU2tpcChhY3Rpb24pIHtcclxuICAgICAgICBsZXQgbmV4dCA9IGZzZy5uZXh0KCk7XHJcbiAgICAgICAgaWYgKCFuZXh0IHx8ICFuZXh0LmlkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gbGV0IGlkID0gYWN0aW9uLnBheWxvYWQuaWQ7XHJcbiAgICAgICAgLy8gaWYgKCFuZXh0LmlkKSB7XHJcbiAgICAgICAgLy8gICAgIGlkID0gbmV4dC5pZDtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyTGVhdmUobmV4dC5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Kb2luKGFjdGlvbikge1xyXG4gICAgICAgIGZzZy5sb2coYWN0aW9uKTtcclxuICAgICAgICBpZiAoIWFjdGlvbi51c2VyLmlkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBmc2cucGxheWVycyhhY3Rpb24udXNlci5pZCk7XHJcbiAgICAgICAgcGxheWVyLnJhbmsgPSAyO1xyXG4gICAgICAgIHBsYXllci5zY29yZSA9IDA7XHJcbiAgICAgICAgLy8gaWYgKGZzZy5wbGF5ZXJzKGFjdGlvbi51c2VyLmlkKS50eXBlKVxyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuY2hlY2tOZXdSb3VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrTmV3Um91bmQoKSB7XHJcbiAgICAgICAgLy9pZiBwbGF5ZXIgY291bnQgcmVhY2hlZCByZXF1aXJlZCBsaW1pdCwgc3RhcnQgdGhlIGdhbWVcclxuICAgICAgICBsZXQgbWF4UGxheWVycyA9IGZzZy5ydWxlcygnbWF4UGxheWVycycpIHx8IDI7XHJcbiAgICAgICAgbGV0IHBsYXllckNvdW50ID0gZnNnLnBsYXllckNvdW50KCk7XHJcbiAgICAgICAgaWYgKHBsYXllckNvdW50ID49IG1heFBsYXllcnMpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXdSb3VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkxlYXZlKGFjdGlvbikge1xyXG4gICAgICAgIHRoaXMucGxheWVyTGVhdmUoYWN0aW9uLnVzZXIuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllckxlYXZlKGlkKSB7XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBmc2cucGxheWVycygpO1xyXG4gICAgICAgIGxldCBvdGhlclBsYXllcklkID0gbnVsbDtcclxuICAgICAgICBpZiAocGxheWVyc1tpZF0pIHtcclxuICAgICAgICAgICAgb3RoZXJQbGF5ZXJJZCA9IHRoaXMuc2VsZWN0TmV4dFBsYXllcihpZCk7XHJcbiAgICAgICAgICAgIC8vZGVsZXRlIHBsYXllcnNbaWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG90aGVyUGxheWVySWQpIHtcclxuICAgICAgICAgICAgbGV0IG90aGVyUGxheWVyID0gcGxheWVyc1tvdGhlclBsYXllcklkXTtcclxuICAgICAgICAgICAgdGhpcy5zZXRXaW5uZXIob3RoZXJQbGF5ZXIudHlwZSwgJ2ZvcmZlaXQnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblBpY2soYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gZnNnLnN0YXRlKCk7XHJcbiAgICAgICAgbGV0IHVzZXIgPSBmc2cucGxheWVycyhhY3Rpb24udXNlci5pZCk7XHJcbiAgICAgICAgaWYgKHVzZXIudGVzdDIpXHJcbiAgICAgICAgICAgIGRlbGV0ZSB1c2VyLnRlc3QyO1xyXG4gICAgICAgIC8vZ2V0IHRoZSBwaWNrZWQgY2VsbFxyXG4gICAgICAgIGxldCBjZWxsaWQgPSBhY3Rpb24ucGF5bG9hZC5jZWxsO1xyXG4gICAgICAgIGxldCBjZWxsID0gc3RhdGUuY2VsbHNbY2VsbGlkXTtcclxuXHJcbiAgICAgICAgLy8gYmxvY2sgcGlja2luZyBjZWxscyB3aXRoIG1hcmtpbmdzLCBhbmQgc2VuZCBlcnJvclxyXG4gICAgICAgIGlmIChjZWxsLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZnNnLm5leHQoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGFjdGlvbi51c2VyLmlkLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uOiAncGljaycsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjogJ05PVF9FTVBUWSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9tYXJrIHRoZSBzZWxlY3RlZCBjZWxsXHJcbiAgICAgICAgbGV0IHR5cGUgPSB1c2VyLnR5cGU7XHJcbiAgICAgICAgbGV0IGlkID0gYWN0aW9uLnVzZXIuaWQ7XHJcbiAgICAgICAgc3RhdGUuY2VsbHNbY2VsbGlkXSA9IHR5cGU7XHJcblxyXG4gICAgICAgIGZzZy5ldmVudCgncGlja2VkJyk7XHJcbiAgICAgICAgZnNnLnByZXYoe1xyXG4gICAgICAgICAgICBjZWxsaWQsIGlkXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tXaW5uZXIoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmc2cuc2V0VGltZWxpbWl0KDIwKTtcclxuICAgICAgICB0aGlzLnNlbGVjdE5leHRQbGF5ZXIobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3Um91bmQoKSB7XHJcbiAgICAgICAgbGV0IHBsYXllckxpc3QgPSBmc2cucGxheWVyTGlzdCgpO1xyXG5cclxuICAgICAgICBsZXQgc3RhdGUgPSBmc2cuc3RhdGUoKTtcclxuICAgICAgICAvL3NlbGVjdCB0aGUgc3RhcnRpbmcgcGxheWVyXHJcbiAgICAgICAgaWYgKCFzdGF0ZS5zdGFydFBsYXllciB8fCBzdGF0ZS5zdGFydFBsYXllci5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBzdGF0ZS5zdGFydFBsYXllciA9IHRoaXMuc2VsZWN0TmV4dFBsYXllcihwbGF5ZXJMaXN0W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBsYXllckxpc3QubGVuZ3RoKV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc3RhdGUuc3RhcnRQbGF5ZXIgPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIoc3RhdGUuc3RhcnRQbGF5ZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9zZXQgdGhlIHN0YXJ0aW5nIHBsYXllciwgYW5kIHNldCB0eXBlIGZvciBvdGhlciBwbGF5ZXJcclxuICAgICAgICBsZXQgcGxheWVycyA9IGZzZy5wbGF5ZXJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gcGxheWVycylcclxuICAgICAgICAgICAgcGxheWVyc1tpZF0udHlwZSA9ICdPJztcclxuICAgICAgICBwbGF5ZXJzW3N0YXRlLnN0YXJ0UGxheWVyXS50eXBlID0gJ1gnO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE5leHRQbGF5ZXIodXNlcmlkKSB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IGZzZy5hY3Rpb24oKTtcclxuICAgICAgICBsZXQgcGxheWVycyA9IGZzZy5wbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgdXNlcmlkID0gdXNlcmlkIHx8IGFjdGlvbi51c2VyLmlkO1xyXG4gICAgICAgIC8vb25seSAyIHBsYXllcnMgc28ganVzdCBmaWx0ZXIgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgICAgbGV0IHJlbWFpbmluZyA9IHBsYXllcnMuZmlsdGVyKHggPT4geCAhPSB1c2VyaWQpO1xyXG4gICAgICAgIGZzZy5uZXh0KHtcclxuICAgICAgICAgICAgaWQ6IHJlbWFpbmluZ1swXSxcclxuICAgICAgICAgICAgYWN0aW9uOiAncGljaydcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVtYWluaW5nWzBdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBDaGVjayBlYWNoIHN0cmlwIHRoYXQgbWFrZXMgYSB3aW5cclxuICAgIC8vICAgICAgMCAgfCAgMSAgfCAgMlxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgMyAgfCAgNCAgfCAgNVxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgNiAgfCAgNyAgfCAgOFxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDEsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzMsIDQsIDVdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDcsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDMsIDZdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzEsIDQsIDddKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzIsIDUsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDQsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDQsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tOb25lRW1wdHkoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrTm9uZUVtcHR5KCkge1xyXG4gICAgICAgIGxldCBjZWxscyA9IGZzZy5zdGF0ZSgpLmNlbGxzO1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IGNlbGxzLmZpbHRlcih2ID0+IHYgPT0gJycpO1xyXG5cclxuICAgICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUaWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkLmxlbmd0aCA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNoZWNrcyBpZiBhIHN0cmlwIGhhcyBtYXRjaGluZyB0eXBlc1xyXG4gICAgY2hlY2soc3RyaXApIHtcclxuICAgICAgICBsZXQgY2VsbHMgPSBmc2cuc3RhdGUoKS5jZWxscztcclxuICAgICAgICBsZXQgZmlyc3QgPSBjZWxsc1tzdHJpcFswXV07XHJcbiAgICAgICAgaWYgKGZpcnN0ID09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkID0gc3RyaXAuZmlsdGVyKGlkID0+IGNlbGxzW2lkXSA9PSBmaXJzdCk7XHJcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PSAzICYmIGZpbHRlcmVkLmxlbmd0aCA9PSBzdHJpcC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRXaW5uZXIoZmlyc3QsIHN0cmlwKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kUGxheWVyV2l0aFR5cGUodHlwZSkge1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZnNnLnBsYXllcnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpZCBpbiBwbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBwbGF5ZXJzW2lkXTtcclxuICAgICAgICAgICAgaWYgKHBsYXllci50eXBlID09IHR5cGUpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBzZXRUaWUoKSB7XHJcbiAgICAgICAgZnNnLmNsZWFyRXZlbnRzKCk7XHJcbiAgICAgICAgZnNnLmV2ZW50KCd0aWUnKVxyXG4gICAgICAgIGZzZy5uZXh0KHt9KTtcclxuICAgICAgICBmc2cucHJldih7fSlcclxuXHJcbiAgICAgICAgZnNnLmtpbGxHYW1lKCk7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgdGhlIHdpbm5lciBldmVudCBhbmQgZGF0YVxyXG4gICAgc2V0V2lubmVyKHR5cGUsIHN0cmlwKSB7XHJcbiAgICAgICAgLy9maW5kIHVzZXIgd2hvIG1hdGNoZXMgdGhlIHdpbiB0eXBlXHJcbiAgICAgICAgbGV0IHVzZXJpZCA9IHRoaXMuZmluZFBsYXllcldpdGhUeXBlKHR5cGUpO1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBmc2cucGxheWVycyh1c2VyaWQpO1xyXG4gICAgICAgIHBsYXllci5yYW5rID0gMTtcclxuICAgICAgICBwbGF5ZXIuc2NvcmUgPSBwbGF5ZXIuc2NvcmUgKyAxO1xyXG4gICAgICAgIGlmICghcGxheWVyKSB7XHJcbiAgICAgICAgICAgIHBsYXllci5pZCA9ICd1bmtub3duIHBsYXllcic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZzZy5jbGVhckV2ZW50cygpO1xyXG4gICAgICAgIGZzZy5ldmVudCgnd2lubmVyJylcclxuICAgICAgICBmc2cucHJldih7XHJcbiAgICAgICAgICAgIHBpY2s6IHR5cGUsXHJcbiAgICAgICAgICAgIHN0cmlwOiBzdHJpcCxcclxuICAgICAgICAgICAgaWQ6IHVzZXJpZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgZnNnLm5leHQoe30pO1xyXG5cclxuICAgICAgICBmc2cua2lsbEdhbWUoKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFRpY3RhY3RvZSgpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiaW1wb3J0IGZzZyBmcm9tICcuL2ZzZyc7XHJcbmltcG9ydCB0aWN0YWN0b2UgZnJvbSAnLi9nYW1lJztcclxuXHJcblxyXG5cclxuZnNnLm9uKCduZXdnYW1lJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uTmV3R2FtZShhY3Rpb24pKTtcclxuZnNnLm9uKCdza2lwJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uU2tpcChhY3Rpb24pKTtcclxuZnNnLm9uKCdqb2luJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uSm9pbihhY3Rpb24pKTtcclxuZnNnLm9uKCdsZWF2ZScsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vbkxlYXZlKGFjdGlvbikpO1xyXG5mc2cub24oJ3BpY2snLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25QaWNrKGFjdGlvbikpO1xyXG5cclxuZnNnLnN1Ym1pdCgpOyJdLCJzb3VyY2VSb290IjoiIn0=