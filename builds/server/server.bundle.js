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
        player.test = {};
        player.test._secret = (new Date()).getTime();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4vZ2FtZS1zZXJ2ZXIvZnNnLmpzIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9nYW1lLmpzIiwiLi4vLi4vd2VicGFjay9ib290c3RyYXAiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCIuLi8uLi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwiLi4vLi4vLi9nYW1lLXNlcnZlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0NBQXNDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiwyQ0FBMkM7QUFDOUQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVDQUF1Qzs7O0FBRzFEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrQ0FBK0MsZ0JBQWdCLGlDQUFpQztBQUNoRzs7QUFFQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLHlDQUF5QztBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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Q2pCLFFBQVEsOENBQVE7QUFDaEI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVEsOENBQVEsR0FBRzs7QUFFbkIsUUFBUSxrREFBWTtBQUNwQjtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRTs7Ozs7O1VDcE85QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7Ozs7Ozs7OztBQ0F3QjtBQUNPOzs7O0FBSS9CLDRDQUFNLHdCQUF3QixvREFBbUI7QUFDakQsNENBQU0scUJBQXFCLGlEQUFnQjtBQUMzQyw0Q0FBTSxxQkFBcUIsaURBQWdCO0FBQzNDLDRDQUFNLHNCQUFzQixrREFBaUI7QUFDN0MsNENBQU0scUJBQXFCLGlEQUFnQjs7QUFFM0MsZ0RBQVUsRyIsImZpbGUiOiJzZXJ2ZXIuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNsYXNzIEZTRyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuYWN0aW9ucygpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IHRoaXMuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIGFjdGlvbnMnKTsgcmV0dXJuIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsR2FtZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2xvYmFscy5nYW1lKCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgdGhpcy5lcnJvcignRmFpbGVkIHRvIGxvYWQgb3JpZ2luYWxHYW1lJyk7IHJldHVybiB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZ2xvYmFscy5nYW1lKCkpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgdGhpcy5lcnJvcignRmFpbGVkIHRvIGxvYWQgbmV4dEdhbWUnKTsgcmV0dXJuIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuaXNOZXdHYW1lID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tYXJrZWRGb3JEZWxldGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlZmF1bHRTZWNvbmRzID0gMTU7XHJcbiAgICAgICAgLy8gdGhpcy5uZXh0VGltZUxpbWl0ID0gLTE7XHJcbiAgICAgICAgdGhpcy5raWNrZWRQbGF5ZXJzID0gW107XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5uZXh0R2FtZSB8fCBPYmplY3Qua2V5cyh0aGlzLm5leHRHYW1lLnJ1bGVzKS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTmV3R2FtZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoJ01pc3NpbmcgUnVsZXMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5leHRHYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICghKCd0aW1lcicgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUudGltZXIgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoISgnc3RhdGUnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnN0YXRlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghKCdwbGF5ZXJzJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5wbGF5ZXJzID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vaWYgKCEoJ3ByZXYnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucHJldiA9IHt9O1xyXG4gICAgICAgICAgICAvL31cclxuXHJcbiAgICAgICAgICAgIGlmICghKCduZXh0JyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5uZXh0ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghKCdydWxlcycgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucnVsZXMgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9pZiAoISgnZXZlbnRzJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLmV2ZW50cyA9IFtdO1xyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgb24odHlwZSwgY2IpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGUgPT0gJ25ld2dhbWUnKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTmV3R2FtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gdGhpcy5hY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICAgICAgY2IodGhpcy5hY3Rpb25zWzBdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNOZXdHYW1lID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy9yZXR1cm47XHJcbiAgICAgICAgICAgIC8vIHRoaXMubmV4dEdhbWUgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0R2FtZSwgeyBwbGF5ZXJzOiB0aGlzLm5leHRHYW1lLnBsYXllcnMgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGlvbnNbaV0udHlwZSA9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSB0aGlzLmFjdGlvbnNbaV07XHJcbiAgICAgICAgICAgICAgICBjYih0aGlzLmN1cnJlbnRBY3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0R2FtZShnYW1lKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy5uZXh0R2FtZS5wbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLm5leHRHYW1lLnBsYXllcnNbaWRdO1xyXG4gICAgICAgICAgICBnYW1lLnBsYXllcnNbaWRdID0geyBuYW1lOiBwbGF5ZXIubmFtZSB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vZ2FtZS5wbGF5ZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgZ2FtZS5wbGF5ZXJzLCB0aGlzLm5leHRHYW1lLnBsYXllcnMpXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZSA9IGdhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgc3VibWl0KCkge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLm5leHRHYW1lLnRpbWVyICYmIHRoaXMubmV4dFRpbWVMaW1pdCA+IC0xKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubmV4dEdhbWUudGltZXIudGltZWxpbWl0ID0gdGhpcy5uZXh0VGltZUxpbWl0O1xyXG4gICAgICAgIC8vICAgICAvLyBpZiAodGhpcy5tYXJrZWRGb3JEZWxldGUpXHJcbiAgICAgICAgLy8gICAgIC8vICAgICBkZWxldGUgdGhpcy5uZXh0R2FtZS5uZXh0Wyd0aW1lbGltaXQnXTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIC8vaWYgbmV4dCBpbmZvIGhhcyBiZWVuIHVwZGF0ZWQsIHdlIGZvcmNlIGEgbmV3IHRpbWVyXHJcbiAgICAgICAgLy8gbGV0IHByZXZOZXh0VXNlciA9IEpTT04uc3RyaW5naWZ5KHRoaXMub3JpZ2luYWxHYW1lLm5leHQpO1xyXG4gICAgICAgIC8vIGxldCBjdXJOZXh0VXNlciA9IEpTT04uc3RyaW5naWZ5KHRoaXMubmV4dEdhbWUubmV4dCk7XHJcbiAgICAgICAgLy8gaWYgKHByZXZOZXh0VXNlciAhPSBjdXJOZXh0VXNlciAmJiB0eXBlb2YgdGhpcy5uZXh0R2FtZS50aW1lci5zZXQgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5zZXRUaW1lbGltaXQoKVxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMua2lja2VkUGxheWVycy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLmtpY2sgPSB0aGlzLmtpY2tlZFBsYXllcnM7XHJcblxyXG4gICAgICAgIGdsb2JhbHMuZmluaXNoKHRoaXMubmV4dEdhbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGtpbGxHYW1lKCkge1xyXG4gICAgICAgIHRoaXMubWFya2VkRm9yRGVsZXRlID0gdHJ1ZTtcclxuICAgICAgICBnbG9iYWxzLmtpbGxHYW1lKCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nKG1zZykge1xyXG4gICAgICAgIGdsb2JhbHMubG9nKG1zZyk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihtc2cpIHtcclxuICAgICAgICBnbG9iYWxzLmVycm9yKG1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAga2lja1BsYXllcihpZCkge1xyXG4gICAgICAgIHRoaXMua2lja2VkUGxheWVycy5wdXNoKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhYmFzZSgpIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFscy5kYXRhYmFzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlKGtleSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5zdGF0ZTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUuc3RhdGVba2V5XTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5zdGF0ZVtrZXldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyTGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5uZXh0R2FtZS5wbGF5ZXJzKTtcclxuICAgIH1cclxuICAgIHBsYXllckNvdW50KCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm5leHRHYW1lLnBsYXllcnMpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXJzKHVzZXJpZCwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHVzZXJpZCA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnBsYXllcnM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnBsYXllcnNbdXNlcmlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5wbGF5ZXJzW3VzZXJpZF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBydWxlcyhydWxlLCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnJ1bGVzO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ydWxlc1tydWxlXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ydWxlc1tydWxlXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXYob2JqKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucHJldiA9IG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucHJldjtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KG9iaikge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLm5leHQgPSBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLm5leHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZWxpbWl0KHNlY29uZHMpIHtcclxuICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyB8fCB0aGlzLmRlZmF1bHRTZWNvbmRzO1xyXG4gICAgICAgIGlmICghdGhpcy5uZXh0R2FtZS50aW1lcilcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS50aW1lciA9IHt9O1xyXG4gICAgICAgIHRoaXMubmV4dEdhbWUudGltZXIuc2V0ID0gTWF0aC5taW4oNjAsIE1hdGgubWF4KDEwLCBzZWNvbmRzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhY2hlZFRpbWVsaW1pdChhY3Rpb24pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFjdGlvbi50aW1lbGVmdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb24udGltZWxlZnQgPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICBldmVudChuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHMucHVzaChuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLm5leHRHYW1lLmV2ZW50cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZXZlbnRzKG5hbWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ldmVudHM7XHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHMucHVzaChuYW1lKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEZTRygpOyIsImltcG9ydCBmc2cgZnJvbSAnLi9mc2cnO1xyXG5cclxubGV0IGRlZmF1bHRHYW1lID0ge1xyXG4gICAgc3RhdGU6IHtcclxuICAgICAgICBjZWxsczogWycnLCAnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJyddLFxyXG4gICAgICAgIHN0YXJ0UGxheWVyOiAnJ1xyXG4gICAgfSxcclxuICAgIHBsYXllcnM6IHt9LFxyXG4gICAgcnVsZXM6IHtcclxuICAgICAgICBiZXN0T2Y6IDUsXHJcbiAgICAgICAgbWF4UGxheWVyczogMlxyXG4gICAgfSxcclxuICAgIG5leHQ6IHt9LFxyXG4gICAgZXZlbnRzOiBbXVxyXG59XHJcblxyXG5jbGFzcyBUaWN0YWN0b2Uge1xyXG5cclxuICAgIG9uTmV3R2FtZShhY3Rpb24pIHtcclxuICAgICAgICBmc2cuc2V0R2FtZShkZWZhdWx0R2FtZSk7XHJcbiAgICAgICAgdGhpcy5jaGVja05ld1JvdW5kKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Ta2lwKGFjdGlvbikge1xyXG4gICAgICAgIGxldCBuZXh0ID0gZnNnLm5leHQoKTtcclxuICAgICAgICBpZiAoIW5leHQgfHwgIW5leHQuaWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvLyBsZXQgaWQgPSBhY3Rpb24ucGF5bG9hZC5pZDtcclxuICAgICAgICAvLyBpZiAoIW5leHQuaWQpIHtcclxuICAgICAgICAvLyAgICAgaWQgPSBuZXh0LmlkO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXJMZWF2ZShuZXh0LmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkpvaW4oYWN0aW9uKSB7XHJcbiAgICAgICAgZnNnLmxvZyhhY3Rpb24pO1xyXG4gICAgICAgIGlmICghYWN0aW9uLnVzZXIuaWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbGV0IHBsYXllciA9IGZzZy5wbGF5ZXJzKGFjdGlvbi51c2VyLmlkKTtcclxuICAgICAgICBwbGF5ZXIudGVzdCA9IHt9O1xyXG4gICAgICAgIHBsYXllci50ZXN0Ll9zZWNyZXQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIC8vIGlmIChmc2cucGxheWVycyhhY3Rpb24udXNlci5pZCkudHlwZSlcclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmNoZWNrTmV3Um91bmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja05ld1JvdW5kKCkge1xyXG4gICAgICAgIC8vaWYgcGxheWVyIGNvdW50IHJlYWNoZWQgcmVxdWlyZWQgbGltaXQsIHN0YXJ0IHRoZSBnYW1lXHJcbiAgICAgICAgbGV0IG1heFBsYXllcnMgPSBmc2cucnVsZXMoJ21heFBsYXllcnMnKSB8fCAyO1xyXG4gICAgICAgIGxldCBwbGF5ZXJDb3VudCA9IGZzZy5wbGF5ZXJDb3VudCgpO1xyXG4gICAgICAgIGlmIChwbGF5ZXJDb3VudCA+PSBtYXhQbGF5ZXJzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV3Um91bmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25MZWF2ZShhY3Rpb24pIHtcclxuICAgICAgICB0aGlzLnBsYXllckxlYXZlKGFjdGlvbi51c2VyLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXJMZWF2ZShpZCkge1xyXG4gICAgICAgIGxldCBwbGF5ZXJzID0gZnNnLnBsYXllcnMoKTtcclxuICAgICAgICBsZXQgb3RoZXJQbGF5ZXJJZCA9IG51bGw7XHJcbiAgICAgICAgaWYgKHBsYXllcnNbaWRdKSB7XHJcbiAgICAgICAgICAgIG90aGVyUGxheWVySWQgPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIoaWQpO1xyXG4gICAgICAgICAgICAvL2RlbGV0ZSBwbGF5ZXJzW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdGhlclBsYXllcklkKSB7XHJcbiAgICAgICAgICAgIGxldCBvdGhlclBsYXllciA9IHBsYXllcnNbb3RoZXJQbGF5ZXJJZF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0V2lubmVyKG90aGVyUGxheWVyLnR5cGUsICdmb3JmZWl0JylcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25QaWNrKGFjdGlvbikge1xyXG4gICAgICAgIGxldCBzdGF0ZSA9IGZzZy5zdGF0ZSgpO1xyXG4gICAgICAgIGxldCB1c2VyID0gZnNnLnBsYXllcnMoYWN0aW9uLnVzZXIuaWQpO1xyXG5cclxuICAgICAgICAvL2dldCB0aGUgcGlja2VkIGNlbGxcclxuICAgICAgICBsZXQgY2VsbGlkID0gYWN0aW9uLnBheWxvYWQuY2VsbDtcclxuICAgICAgICBsZXQgY2VsbCA9IHN0YXRlLmNlbGxzW2NlbGxpZF07XHJcblxyXG4gICAgICAgIC8vIGJsb2NrIHBpY2tpbmcgY2VsbHMgd2l0aCBtYXJraW5ncywgYW5kIHNlbmQgZXJyb3JcclxuICAgICAgICBpZiAoY2VsbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZzZy5uZXh0KHtcclxuICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24udXNlci5pZCxcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogJ3BpY2snLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICdOT1RfRU1QVFknXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vbWFyayB0aGUgc2VsZWN0ZWQgY2VsbFxyXG4gICAgICAgIGxldCB0eXBlID0gdXNlci50eXBlO1xyXG4gICAgICAgIGxldCBpZCA9IGFjdGlvbi51c2VyLmlkO1xyXG4gICAgICAgIHN0YXRlLmNlbGxzW2NlbGxpZF0gPSB0eXBlO1xyXG5cclxuICAgICAgICBmc2cuZXZlbnQoJ3BpY2tlZCcpO1xyXG4gICAgICAgIGZzZy5wcmV2KHtcclxuICAgICAgICAgICAgY2VsbGlkLCBpZFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnNnLnNldFRpbWVsaW1pdCgyMCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3ROZXh0UGxheWVyKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld1JvdW5kKCkge1xyXG4gICAgICAgIGxldCBwbGF5ZXJMaXN0ID0gZnNnLnBsYXllckxpc3QoKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXRlID0gZnNnLnN0YXRlKCk7XHJcbiAgICAgICAgLy9zZWxlY3QgdGhlIHN0YXJ0aW5nIHBsYXllclxyXG4gICAgICAgIGlmICghc3RhdGUuc3RhcnRQbGF5ZXIgfHwgc3RhdGUuc3RhcnRQbGF5ZXIubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgc3RhdGUuc3RhcnRQbGF5ZXIgPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIocGxheWVyTGlzdFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJMaXN0Lmxlbmd0aCldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnN0YXJ0UGxheWVyID0gdGhpcy5zZWxlY3ROZXh0UGxheWVyKHN0YXRlLnN0YXJ0UGxheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBzdGFydGluZyBwbGF5ZXIsIGFuZCBzZXQgdHlwZSBmb3Igb3RoZXIgcGxheWVyXHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBmc2cucGxheWVycygpO1xyXG4gICAgICAgIGZvciAodmFyIGlkIGluIHBsYXllcnMpXHJcbiAgICAgICAgICAgIHBsYXllcnNbaWRdLnR5cGUgPSAnTyc7XHJcbiAgICAgICAgcGxheWVyc1tzdGF0ZS5zdGFydFBsYXllcl0udHlwZSA9ICdYJztcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3ROZXh0UGxheWVyKHVzZXJpZCkge1xyXG4gICAgICAgIGxldCBhY3Rpb24gPSBmc2cuYWN0aW9uKCk7XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBmc2cucGxheWVyTGlzdCgpO1xyXG4gICAgICAgIHVzZXJpZCA9IHVzZXJpZCB8fCBhY3Rpb24udXNlci5pZDtcclxuICAgICAgICAvL29ubHkgMiBwbGF5ZXJzIHNvIGp1c3QgZmlsdGVyIHRoZSBjdXJyZW50IHBsYXllclxyXG4gICAgICAgIGxldCByZW1haW5pbmcgPSBwbGF5ZXJzLmZpbHRlcih4ID0+IHggIT0gdXNlcmlkKTtcclxuICAgICAgICBmc2cubmV4dCh7XHJcbiAgICAgICAgICAgIGlkOiByZW1haW5pbmdbMF0sXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ3BpY2snXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHJlbWFpbmluZ1swXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gQ2hlY2sgZWFjaCBzdHJpcCB0aGF0IG1ha2VzIGEgd2luXHJcbiAgICAvLyAgICAgIDAgIHwgIDEgIHwgIDJcclxuICAgIC8vICAgIC0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgICAgIDMgIHwgIDQgIHwgIDVcclxuICAgIC8vICAgIC0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAgICAgIDYgIHwgIDcgIHwgIDhcclxuICAgIGNoZWNrV2lubmVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFswLCAxLCAyXSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFszLCA0LCA1XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFs2LCA3LCA4XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFswLCAzLCA2XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFsxLCA0LCA3XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFsyLCA1LCA4XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFswLCA0LCA4XSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrKFs2LCA0LCAyXSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrTm9uZUVtcHR5KCkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja05vbmVFbXB0eSgpIHtcclxuICAgICAgICBsZXQgY2VsbHMgPSBmc2cuc3RhdGUoKS5jZWxscztcclxuICAgICAgICBsZXQgZmlsdGVyZWQgPSBjZWxscy5maWx0ZXIodiA9PiB2ID09ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGllKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZC5sZW5ndGggPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVja3MgaWYgYSBzdHJpcCBoYXMgbWF0Y2hpbmcgdHlwZXNcclxuICAgIGNoZWNrKHN0cmlwKSB7XHJcbiAgICAgICAgbGV0IGNlbGxzID0gZnNnLnN0YXRlKCkuY2VsbHM7XHJcbiAgICAgICAgbGV0IGZpcnN0ID0gY2VsbHNbc3RyaXBbMF1dO1xyXG4gICAgICAgIGlmIChmaXJzdCA9PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IHN0cmlwLmZpbHRlcihpZCA9PiBjZWxsc1tpZF0gPT0gZmlyc3QpO1xyXG4gICAgICAgIGlmIChmaWx0ZXJlZC5sZW5ndGggPT0gMyAmJiBmaWx0ZXJlZC5sZW5ndGggPT0gc3RyaXAubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0V2lubmVyKGZpcnN0LCBzdHJpcCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFBsYXllcldpdGhUeXBlKHR5cGUpIHtcclxuICAgICAgICBsZXQgcGxheWVycyA9IGZzZy5wbGF5ZXJzKCk7XHJcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gcGxheWVycykge1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gcGxheWVyc1tpZF07XHJcbiAgICAgICAgICAgIGlmIChwbGF5ZXIudHlwZSA9PSB0eXBlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgc2V0VGllKCkge1xyXG4gICAgICAgIGZzZy5jbGVhckV2ZW50cygpO1xyXG4gICAgICAgIGZzZy5ldmVudCgndGllJylcclxuICAgICAgICBmc2cubmV4dCh7fSk7XHJcbiAgICAgICAgZnNnLnByZXYoe30pXHJcblxyXG4gICAgICAgIGZzZy5raWxsR2FtZSgpO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0IHRoZSB3aW5uZXIgZXZlbnQgYW5kIGRhdGFcclxuICAgIHNldFdpbm5lcih0eXBlLCBzdHJpcCkge1xyXG4gICAgICAgIC8vZmluZCB1c2VyIHdobyBtYXRjaGVzIHRoZSB3aW4gdHlwZVxyXG4gICAgICAgIGxldCB1c2VyaWQgPSB0aGlzLmZpbmRQbGF5ZXJXaXRoVHlwZSh0eXBlKTtcclxuICAgICAgICBsZXQgcGxheWVyID0gZnNnLnBsYXllcnModXNlcmlkKTtcclxuICAgICAgICBpZiAoIXBsYXllcikge1xyXG4gICAgICAgICAgICBwbGF5ZXIuaWQgPSAndW5rbm93biBwbGF5ZXInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmc2cuY2xlYXJFdmVudHMoKTtcclxuICAgICAgICBmc2cuZXZlbnQoJ3dpbm5lcicpXHJcbiAgICAgICAgZnNnLnByZXYoe1xyXG4gICAgICAgICAgICBwaWNrOiB0eXBlLFxyXG4gICAgICAgICAgICBzdHJpcDogc3RyaXAsXHJcbiAgICAgICAgICAgIGlkOiB1c2VyaWRcclxuICAgICAgICB9KVxyXG4gICAgICAgIGZzZy5uZXh0KHt9KTtcclxuXHJcbiAgICAgICAgZnNnLmtpbGxHYW1lKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBUaWN0YWN0b2UoKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsImltcG9ydCBmc2cgZnJvbSAnLi9mc2cnO1xyXG5pbXBvcnQgdGljdGFjdG9lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5cclxuXHJcbmZzZy5vbignbmV3Z2FtZScsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vbk5ld0dhbWUoYWN0aW9uKSk7XHJcbmZzZy5vbignc2tpcCcsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vblNraXAoYWN0aW9uKSk7XHJcbmZzZy5vbignam9pbicsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vbkpvaW4oYWN0aW9uKSk7XHJcbmZzZy5vbignbGVhdmUnLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25MZWF2ZShhY3Rpb24pKTtcclxuZnNnLm9uKCdwaWNrJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uUGljayhhY3Rpb24pKTtcclxuXHJcbmZzZy5zdWJtaXQoKTsiXSwic291cmNlUm9vdCI6IiJ9