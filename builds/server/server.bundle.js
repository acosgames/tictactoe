/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./game-server/acosg.js":
/*!******************************!*\
  !*** ./game-server/acosg.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

class ACOSG {
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

        // if (!this.nextGame || !this.nextGame.rules || Object.keys(this.nextGame.rules).length == 0) {
        //     this.isNewGame = true;
        //     this.error('Missing Rules');
        // }

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

        // if (type == 'newgame') {
        //     //if (this.isNewGame) {
        //     this.currentAction = this.actions[0];
        //     if (this.currentAction.type == '')
        //         cb(this.actions[0]);
        //     this.isNewGame = false;
        //     //}

        //     return;
        // }

        for (var i = 0; i < this.actions.length; i++) {
            if (this.actions[i].type == type) {
                this.currentAction = this.actions[i];
                let result = cb(this.currentAction);
                if (typeof result == "boolean" && !result) {
                    this.ignore();
                    break;
                }
            }

        }

    }

    ignore() {
        globals.ignore();
    }

    setGame(game) {
        for (var id in this.nextGame.players) {
            let player = this.nextGame.players[id];
            game.players[id] = player;
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ACOSG());

/***/ }),

/***/ "./game-server/game.js":
/*!*****************************!*\
  !*** ./game-server/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _acosg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./acosg */ "./game-server/acosg.js");


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
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.setGame(defaultGame);
        this.checkNewRound();
    }

    onSkip(action) {
        let next = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next();
        if (!next || !next.id)
            return;
        // let id = action.payload.id;
        // if (!next.id) {
        //     id = next.id;
        // }

        this.playerLeave(next.id);
    }

    onJoin(action) {
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.log(action);
        if (!action.user.id)
            return;

        let player = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.user.id);
        player.rank = 2;
        player.score = 0;

        let playerCount = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.playerCount();
        if (playerCount <= 2) {
            _acosg__WEBPACK_IMPORTED_MODULE_0__.default.event('join', {
                id: action.user.id
            });
            // this.checkNewRound();
        }
        else {

        }


        // if (cup.players(action.user.id).type)
        //     return;


    }

    checkNewRound() {
        //if player count reached required limit, start the game
        //let maxPlayers = cup.rules('maxPlayers') || 2;
        let playerCount = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.playerCount();
        if (playerCount >= 2) {
            this.newRound();
        }
    }

    onLeave(action) {
        this.playerLeave(action.user.id);
    }

    playerLeave(id) {
        let players = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players();
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
        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        let user = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.user.id);
        if (user.test2)
            delete user.test2;
        //get the picked cell
        let cellid = action.payload;
        if (typeof cellid !== 'number')
            return false;

        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next({
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

        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.event('picked', {
            cellid, id
        });
        // cup.prev()

        if (this.checkWinner()) {
            return;
        }

        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.setTimelimit(10);
        this.selectNextPlayer(null);
    }

    newRound() {
        let playerList = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();

        let state = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        //select the starting player
        if (!state.sx || state.sx.length == 0) {
            state.sx = this.selectNextPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
        }
        else {
            state.sx = this.selectNextPlayer(state.sx);
        }

        //set the starting player, and set type for other player
        let players = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players)
            players[id].type = 'O';
        players[state.sx].type = 'X';

        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.event('newround', true);
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.setTimelimit(15);
    }

    selectNextPlayer(userid) {
        let action = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.action();
        let players = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();
        userid = userid || action.user.id;
        //only 2 players so just filter the current player
        let remaining = players.filter(x => x != userid);
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next({
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
        let cells = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
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
        let cells = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
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
        let players = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players) {
            let player = players[id];
            if (player.type == type)
                return id;
        }
        return null;
    }


    setTie() {
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.gameover({ type: 'tie' })
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next({});
        // cup.prev({})

        // cup.killGame();
    }
    // set the winner event and data
    setWinner(type, strip) {
        //find user who matches the win type
        let userid = this.findPlayerWithType(type);
        let player = _acosg__WEBPACK_IMPORTED_MODULE_0__.default.players(userid);
        player.rank = 1;
        player.score = player.score + 100;
        if (!player) {
            player.id = 'unknown player';
        }

        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.gameover({
            type: 'winner',
            pick: type,
            strip: strip,
            id: userid
        });
        // cup.prev()
        _acosg__WEBPACK_IMPORTED_MODULE_0__.default.next({});
        // cup.killGame();
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
/* harmony import */ var _acosg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./acosg */ "./game-server/acosg.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./game-server/game.js");




_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('gamestart', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onNewGame(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('skip', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onSkip(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onJoin(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('leave', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onLeave(action));
_acosg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', (action) => _game__WEBPACK_IMPORTED_MODULE_1__.default.onPick(action));

_acosg__WEBPACK_IMPORTED_MODULE_0__.default.submit();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4vZ2FtZS1zZXJ2ZXIvYWNvc2cuanMiLCIuLi8uLi8uL2dhbWUtc2VydmVyL2dhbWUuanMiLCIuLi8uLi93ZWJwYWNrL2Jvb3RzdHJhcCIsIi4uLy4uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIi4uLy4uL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCIuLi8uLi8uL2dhbWUtc2VydmVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixzQ0FBc0M7QUFDekQ7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDJDQUEyQztBQUM5RDtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsdUNBQXVDOzs7QUFHMUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsdUJBQXVCLHlCQUF5QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsb0RBQVk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxRQUFRLGdEQUFRLEdBQUc7QUFDbkI7QUFDQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRTs7Ozs7O1VDbFE5QjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7Ozs7Ozs7OztBQ0EwQjtBQUNLOzs7QUFHL0IsOENBQU0sMEJBQTBCLG9EQUFtQjtBQUNuRCw4Q0FBTSxxQkFBcUIsaURBQWdCO0FBQzNDLDhDQUFNLHFCQUFxQixpREFBZ0I7QUFDM0MsOENBQU0sc0JBQXNCLGtEQUFpQjtBQUM3Qyw4Q0FBTSxxQkFBcUIsaURBQWdCOztBQUUzQyxrREFBVSxHIiwiZmlsZSI6InNlcnZlci5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuY2xhc3MgQUNPU0cge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnbG9iYWxzLmFjdGlvbnMoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB0aGlzLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBhY3Rpb25zJyk7IHJldHVybiB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbEdhbWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuZ2FtZSgpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IHRoaXMuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIG9yaWdpbmFsR2FtZScpOyByZXR1cm4gfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuZ2FtZSgpKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IHRoaXMuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIG5leHRHYW1lJyk7IHJldHVybiB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLmlzTmV3R2FtZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIHRoaXMubWFya2VkRm9yRGVsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kZWZhdWx0U2Vjb25kcyA9IDE1O1xyXG4gICAgICAgIC8vIHRoaXMubmV4dFRpbWVMaW1pdCA9IC0xO1xyXG4gICAgICAgIHRoaXMua2lja2VkUGxheWVycyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBpZiAoIXRoaXMubmV4dEdhbWUgfHwgIXRoaXMubmV4dEdhbWUucnVsZXMgfHwgT2JqZWN0LmtleXModGhpcy5uZXh0R2FtZS5ydWxlcykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5pc05ld0dhbWUgPSB0cnVlO1xyXG4gICAgICAgIC8vICAgICB0aGlzLmVycm9yKCdNaXNzaW5nIFJ1bGVzJyk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5uZXh0R2FtZSkge1xyXG4gICAgICAgICAgICBpZiAoISgndGltZXInIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnRpbWVyID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCEoJ3N0YXRlJyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS5zdGF0ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISgncGxheWVycycgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucGxheWVycyA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL2lmICghKCdwcmV2JyBpbiB0aGlzLm5leHRHYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLnByZXYgPSB7fTtcclxuICAgICAgICAgICAgLy99XHJcblxyXG4gICAgICAgICAgICBpZiAoISgnbmV4dCcgaW4gdGhpcy5uZXh0R2FtZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEdhbWUubmV4dCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoISgncnVsZXMnIGluIHRoaXMubmV4dEdhbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRHYW1lLnJ1bGVzID0ge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUuZXZlbnRzID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uKHR5cGUsIGNiKSB7XHJcblxyXG4gICAgICAgIC8vIGlmICh0eXBlID09ICduZXdnYW1lJykge1xyXG4gICAgICAgIC8vICAgICAvL2lmICh0aGlzLmlzTmV3R2FtZSkge1xyXG4gICAgICAgIC8vICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSB0aGlzLmFjdGlvbnNbMF07XHJcbiAgICAgICAgLy8gICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24udHlwZSA9PSAnJylcclxuICAgICAgICAvLyAgICAgICAgIGNiKHRoaXMuYWN0aW9uc1swXSk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuaXNOZXdHYW1lID0gZmFsc2U7XHJcbiAgICAgICAgLy8gICAgIC8vfVxyXG5cclxuICAgICAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aW9uc1tpXS50eXBlID09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IHRoaXMuYWN0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBjYih0aGlzLmN1cnJlbnRBY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gXCJib29sZWFuXCIgJiYgIXJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaWdub3JlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBpZ25vcmUoKSB7XHJcbiAgICAgICAgZ2xvYmFscy5pZ25vcmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRHYW1lKGdhbWUpIHtcclxuICAgICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLm5leHRHYW1lLnBsYXllcnMpIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMubmV4dEdhbWUucGxheWVyc1tpZF07XHJcbiAgICAgICAgICAgIGdhbWUucGxheWVyc1tpZF0gPSBwbGF5ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUgPSBnYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHN1Ym1pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5raWNrZWRQbGF5ZXJzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUua2ljayA9IHRoaXMua2lja2VkUGxheWVycztcclxuXHJcbiAgICAgICAgZ2xvYmFscy5maW5pc2godGhpcy5uZXh0R2FtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZW92ZXIocGF5bG9hZCkge1xyXG4gICAgICAgIHRoaXMuZXZlbnQoJ2dhbWVvdmVyJywgcGF5bG9hZCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9nKG1zZykge1xyXG4gICAgICAgIGdsb2JhbHMubG9nKG1zZyk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihtc2cpIHtcclxuICAgICAgICBnbG9iYWxzLmVycm9yKG1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAga2lja1BsYXllcihpZCkge1xyXG4gICAgICAgIHRoaXMua2lja2VkUGxheWVycy5wdXNoKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhYmFzZSgpIHtcclxuICAgICAgICByZXR1cm4gZ2xvYmFscy5kYXRhYmFzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlKGtleSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5zdGF0ZTtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUuc3RhdGVba2V5XTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5zdGF0ZVtrZXldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyTGlzdCgpIHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5uZXh0R2FtZS5wbGF5ZXJzKTtcclxuICAgIH1cclxuICAgIHBsYXllckNvdW50KCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLm5leHRHYW1lLnBsYXllcnMpLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwbGF5ZXJzKHVzZXJpZCwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHVzZXJpZCA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnBsYXllcnM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnBsYXllcnNbdXNlcmlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5wbGF5ZXJzW3VzZXJpZF0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBydWxlcyhydWxlLCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcnVsZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLnJ1bGVzO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ydWxlc1tydWxlXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0R2FtZS5ydWxlc1tydWxlXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXYob2JqKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dEdhbWUucHJldiA9IG9iajtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmV4dEdhbWUucHJldjtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0KG9iaikge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICB0aGlzLm5leHRHYW1lLm5leHQgPSBvYmo7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm5leHRHYW1lLm5leHQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0VGltZWxpbWl0KHNlY29uZHMpIHtcclxuICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyB8fCB0aGlzLmRlZmF1bHRTZWNvbmRzO1xyXG4gICAgICAgIGlmICghdGhpcy5uZXh0R2FtZS50aW1lcilcclxuICAgICAgICAgICAgdGhpcy5uZXh0R2FtZS50aW1lciA9IHt9O1xyXG4gICAgICAgIHRoaXMubmV4dEdhbWUudGltZXIuc2V0ID0gTWF0aC5taW4oNjAsIE1hdGgubWF4KDEwLCBzZWNvbmRzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhY2hlZFRpbWVsaW1pdChhY3Rpb24pIHtcclxuICAgICAgICBpZiAodHlwZW9mIGFjdGlvbi50aW1lbGVmdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb24udGltZWxlZnQgPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICBldmVudChuYW1lLCBwYXlsb2FkKSB7XHJcbiAgICAgICAgaWYgKCFwYXlsb2FkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ldmVudHNbbmFtZV07XHJcblxyXG4gICAgICAgIHRoaXMubmV4dEdhbWUuZXZlbnRzW25hbWVdID0gcGF5bG9hZCB8fCB7fTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLm5leHRHYW1lLmV2ZW50cyA9IHt9O1xyXG4gICAgfVxyXG4gICAgLy8gZXZlbnRzKG5hbWUpIHtcclxuICAgIC8vICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgLy8gICAgICAgICByZXR1cm4gdGhpcy5uZXh0R2FtZS5ldmVudHM7XHJcbiAgICAvLyAgICAgdGhpcy5uZXh0R2FtZS5ldmVudHMucHVzaChuYW1lKTtcclxuICAgIC8vIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEFDT1NHKCk7IiwiaW1wb3J0IGN1cCBmcm9tICcuL2Fjb3NnJztcclxuXHJcbmxldCBkZWZhdWx0R2FtZSA9IHtcclxuICAgIHN0YXRlOiB7XHJcbiAgICAgICAgY2VsbHM6IHtcclxuICAgICAgICAgICAgMDogJycsIDE6ICcnLCAyOiAnJywgMzogJycsIDQ6ICcnLCA1OiAnJywgNjogJycsIDc6ICcnLCA4OiAnJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gY2VsbHM6IFsnJywgJycsICcnLCAnJywgJycsICcnLCAnJywgJycsICcnXSxcclxuICAgICAgICAvL3N4OiAnJ1xyXG4gICAgfSxcclxuICAgIHBsYXllcnM6IHt9LFxyXG4gICAgbmV4dDoge30sXHJcbiAgICBldmVudHM6IHt9XHJcbn1cclxuXHJcbmNsYXNzIFRpY3RhY3RvZSB7XHJcblxyXG4gICAgb25OZXdHYW1lKGFjdGlvbikge1xyXG4gICAgICAgIGN1cC5zZXRHYW1lKGRlZmF1bHRHYW1lKTtcclxuICAgICAgICB0aGlzLmNoZWNrTmV3Um91bmQoKTtcclxuICAgIH1cclxuXHJcbiAgICBvblNraXAoYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IG5leHQgPSBjdXAubmV4dCgpO1xyXG4gICAgICAgIGlmICghbmV4dCB8fCAhbmV4dC5pZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vIGxldCBpZCA9IGFjdGlvbi5wYXlsb2FkLmlkO1xyXG4gICAgICAgIC8vIGlmICghbmV4dC5pZCkge1xyXG4gICAgICAgIC8vICAgICBpZCA9IG5leHQuaWQ7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICB0aGlzLnBsYXllckxlYXZlKG5leHQuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uSm9pbihhY3Rpb24pIHtcclxuICAgICAgICBjdXAubG9nKGFjdGlvbik7XHJcbiAgICAgICAgaWYgKCFhY3Rpb24udXNlci5pZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyID0gY3VwLnBsYXllcnMoYWN0aW9uLnVzZXIuaWQpO1xyXG4gICAgICAgIHBsYXllci5yYW5rID0gMjtcclxuICAgICAgICBwbGF5ZXIuc2NvcmUgPSAwO1xyXG5cclxuICAgICAgICBsZXQgcGxheWVyQ291bnQgPSBjdXAucGxheWVyQ291bnQoKTtcclxuICAgICAgICBpZiAocGxheWVyQ291bnQgPD0gMikge1xyXG4gICAgICAgICAgICBjdXAuZXZlbnQoJ2pvaW4nLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogYWN0aW9uLnVzZXIuaWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuY2hlY2tOZXdSb3VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gaWYgKGN1cC5wbGF5ZXJzKGFjdGlvbi51c2VyLmlkKS50eXBlKVxyXG4gICAgICAgIC8vICAgICByZXR1cm47XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjaGVja05ld1JvdW5kKCkge1xyXG4gICAgICAgIC8vaWYgcGxheWVyIGNvdW50IHJlYWNoZWQgcmVxdWlyZWQgbGltaXQsIHN0YXJ0IHRoZSBnYW1lXHJcbiAgICAgICAgLy9sZXQgbWF4UGxheWVycyA9IGN1cC5ydWxlcygnbWF4UGxheWVycycpIHx8IDI7XHJcbiAgICAgICAgbGV0IHBsYXllckNvdW50ID0gY3VwLnBsYXllckNvdW50KCk7XHJcbiAgICAgICAgaWYgKHBsYXllckNvdW50ID49IDIpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXdSb3VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkxlYXZlKGFjdGlvbikge1xyXG4gICAgICAgIHRoaXMucGxheWVyTGVhdmUoYWN0aW9uLnVzZXIuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHBsYXllckxlYXZlKGlkKSB7XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBjdXAucGxheWVycygpO1xyXG4gICAgICAgIGxldCBvdGhlclBsYXllcklkID0gbnVsbDtcclxuICAgICAgICBpZiAocGxheWVyc1tpZF0pIHtcclxuICAgICAgICAgICAgb3RoZXJQbGF5ZXJJZCA9IHRoaXMuc2VsZWN0TmV4dFBsYXllcihpZCk7XHJcbiAgICAgICAgICAgIC8vZGVsZXRlIHBsYXllcnNbaWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG90aGVyUGxheWVySWQpIHtcclxuICAgICAgICAgICAgbGV0IG90aGVyUGxheWVyID0gcGxheWVyc1tvdGhlclBsYXllcklkXTtcclxuICAgICAgICAgICAgdGhpcy5zZXRXaW5uZXIob3RoZXJQbGF5ZXIudHlwZSwgJ2ZvcmZlaXQnKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvblBpY2soYWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IHN0YXRlID0gY3VwLnN0YXRlKCk7XHJcbiAgICAgICAgbGV0IHVzZXIgPSBjdXAucGxheWVycyhhY3Rpb24udXNlci5pZCk7XHJcbiAgICAgICAgaWYgKHVzZXIudGVzdDIpXHJcbiAgICAgICAgICAgIGRlbGV0ZSB1c2VyLnRlc3QyO1xyXG4gICAgICAgIC8vZ2V0IHRoZSBwaWNrZWQgY2VsbFxyXG4gICAgICAgIGxldCBjZWxsaWQgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBpZiAodHlwZW9mIGNlbGxpZCAhPT0gJ251bWJlcicpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGNlbGwgPSBzdGF0ZS5jZWxsc1tjZWxsaWRdO1xyXG5cclxuICAgICAgICAvLyBibG9jayBwaWNraW5nIGNlbGxzIHdpdGggbWFya2luZ3MsIGFuZCBzZW5kIGVycm9yXHJcbiAgICAgICAgaWYgKGNlbGwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjdXAubmV4dCh7XHJcbiAgICAgICAgICAgICAgICBpZDogYWN0aW9uLnVzZXIuaWQsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdwaWNrJyxcclxuICAgICAgICAgICAgICAgIGVycm9yOiAnTk9UX0VNUFRZJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL21hcmsgdGhlIHNlbGVjdGVkIGNlbGxcclxuICAgICAgICBsZXQgdHlwZSA9IHVzZXIudHlwZTtcclxuICAgICAgICBsZXQgaWQgPSBhY3Rpb24udXNlci5pZDtcclxuICAgICAgICBzdGF0ZS5jZWxsc1tjZWxsaWRdID0gdHlwZTtcclxuXHJcbiAgICAgICAgY3VwLmV2ZW50KCdwaWNrZWQnLCB7XHJcbiAgICAgICAgICAgIGNlbGxpZCwgaWRcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjdXAucHJldigpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrV2lubmVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VwLnNldFRpbWVsaW1pdCgxMCk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3ROZXh0UGxheWVyKG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld1JvdW5kKCkge1xyXG4gICAgICAgIGxldCBwbGF5ZXJMaXN0ID0gY3VwLnBsYXllckxpc3QoKTtcclxuXHJcbiAgICAgICAgbGV0IHN0YXRlID0gY3VwLnN0YXRlKCk7XHJcbiAgICAgICAgLy9zZWxlY3QgdGhlIHN0YXJ0aW5nIHBsYXllclxyXG4gICAgICAgIGlmICghc3RhdGUuc3ggfHwgc3RhdGUuc3gubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgc3RhdGUuc3ggPSB0aGlzLnNlbGVjdE5leHRQbGF5ZXIocGxheWVyTGlzdFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwbGF5ZXJMaXN0Lmxlbmd0aCldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLnN4ID0gdGhpcy5zZWxlY3ROZXh0UGxheWVyKHN0YXRlLnN4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vc2V0IHRoZSBzdGFydGluZyBwbGF5ZXIsIGFuZCBzZXQgdHlwZSBmb3Igb3RoZXIgcGxheWVyXHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBjdXAucGxheWVycygpO1xyXG4gICAgICAgIGZvciAodmFyIGlkIGluIHBsYXllcnMpXHJcbiAgICAgICAgICAgIHBsYXllcnNbaWRdLnR5cGUgPSAnTyc7XHJcbiAgICAgICAgcGxheWVyc1tzdGF0ZS5zeF0udHlwZSA9ICdYJztcclxuXHJcbiAgICAgICAgY3VwLmV2ZW50KCduZXdyb3VuZCcsIHRydWUpO1xyXG4gICAgICAgIGN1cC5zZXRUaW1lbGltaXQoMTUpO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE5leHRQbGF5ZXIodXNlcmlkKSB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IGN1cC5hY3Rpb24oKTtcclxuICAgICAgICBsZXQgcGxheWVycyA9IGN1cC5wbGF5ZXJMaXN0KCk7XHJcbiAgICAgICAgdXNlcmlkID0gdXNlcmlkIHx8IGFjdGlvbi51c2VyLmlkO1xyXG4gICAgICAgIC8vb25seSAyIHBsYXllcnMgc28ganVzdCBmaWx0ZXIgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgICAgbGV0IHJlbWFpbmluZyA9IHBsYXllcnMuZmlsdGVyKHggPT4geCAhPSB1c2VyaWQpO1xyXG4gICAgICAgIGN1cC5uZXh0KHtcclxuICAgICAgICAgICAgaWQ6IHJlbWFpbmluZ1swXSxcclxuICAgICAgICAgICAgYWN0aW9uOiAncGljaydcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVtYWluaW5nWzBdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBDaGVjayBlYWNoIHN0cmlwIHRoYXQgbWFrZXMgYSB3aW5cclxuICAgIC8vICAgICAgMCAgfCAgMSAgfCAgMlxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgMyAgfCAgNCAgfCAgNVxyXG4gICAgLy8gICAgLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vICAgICAgNiAgfCAgNyAgfCAgOFxyXG4gICAgY2hlY2tXaW5uZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDEsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzMsIDQsIDVdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDcsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDMsIDZdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzEsIDQsIDddKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzIsIDUsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzAsIDQsIDhdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2soWzYsIDQsIDJdKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tOb25lRW1wdHkoKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrTm9uZUVtcHR5KCkge1xyXG4gICAgICAgIGxldCBjZWxscyA9IGN1cC5zdGF0ZSgpLmNlbGxzO1xyXG4gICAgICAgIGxldCBjZWxsc2xpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY2VsbHMpIHtcclxuICAgICAgICAgICAgY2VsbHNsaXN0LnB1c2goY2VsbHNba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IGNlbGxzbGlzdC5maWx0ZXIodiA9PiB2ID09ICcnKTtcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGllKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmaWx0ZXJlZC5sZW5ndGggPT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVja3MgaWYgYSBzdHJpcCBoYXMgbWF0Y2hpbmcgdHlwZXNcclxuICAgIGNoZWNrKHN0cmlwKSB7XHJcbiAgICAgICAgbGV0IGNlbGxzID0gY3VwLnN0YXRlKCkuY2VsbHM7XHJcbiAgICAgICAgbGV0IGNlbGxzbGlzdCA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBjZWxscykge1xyXG4gICAgICAgICAgICBjZWxsc2xpc3QucHVzaChjZWxsc1trZXldKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgZmlyc3QgPSBjZWxsc2xpc3Rbc3RyaXBbMF1dO1xyXG4gICAgICAgIGlmIChmaXJzdCA9PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBmaWx0ZXJlZCA9IHN0cmlwLmZpbHRlcihpZCA9PiBjZWxsc2xpc3RbaWRdID09IGZpcnN0KTtcclxuICAgICAgICBpZiAoZmlsdGVyZWQubGVuZ3RoID09IDMgJiYgZmlsdGVyZWQubGVuZ3RoID09IHN0cmlwLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFdpbm5lcihmaXJzdCwgc3RyaXApO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRQbGF5ZXJXaXRoVHlwZSh0eXBlKSB7XHJcbiAgICAgICAgbGV0IHBsYXllcnMgPSBjdXAucGxheWVycygpO1xyXG4gICAgICAgIGZvciAodmFyIGlkIGluIHBsYXllcnMpIHtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbaWRdO1xyXG4gICAgICAgICAgICBpZiAocGxheWVyLnR5cGUgPT0gdHlwZSlcclxuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHNldFRpZSgpIHtcclxuICAgICAgICBjdXAuZ2FtZW92ZXIoeyB0eXBlOiAndGllJyB9KVxyXG4gICAgICAgIGN1cC5uZXh0KHt9KTtcclxuICAgICAgICAvLyBjdXAucHJldih7fSlcclxuXHJcbiAgICAgICAgLy8gY3VwLmtpbGxHYW1lKCk7XHJcbiAgICB9XHJcbiAgICAvLyBzZXQgdGhlIHdpbm5lciBldmVudCBhbmQgZGF0YVxyXG4gICAgc2V0V2lubmVyKHR5cGUsIHN0cmlwKSB7XHJcbiAgICAgICAgLy9maW5kIHVzZXIgd2hvIG1hdGNoZXMgdGhlIHdpbiB0eXBlXHJcbiAgICAgICAgbGV0IHVzZXJpZCA9IHRoaXMuZmluZFBsYXllcldpdGhUeXBlKHR5cGUpO1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBjdXAucGxheWVycyh1c2VyaWQpO1xyXG4gICAgICAgIHBsYXllci5yYW5rID0gMTtcclxuICAgICAgICBwbGF5ZXIuc2NvcmUgPSBwbGF5ZXIuc2NvcmUgKyAxMDA7XHJcbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcclxuICAgICAgICAgICAgcGxheWVyLmlkID0gJ3Vua25vd24gcGxheWVyJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cC5nYW1lb3Zlcih7XHJcbiAgICAgICAgICAgIHR5cGU6ICd3aW5uZXInLFxyXG4gICAgICAgICAgICBwaWNrOiB0eXBlLFxyXG4gICAgICAgICAgICBzdHJpcDogc3RyaXAsXHJcbiAgICAgICAgICAgIGlkOiB1c2VyaWRcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBjdXAucHJldigpXHJcbiAgICAgICAgY3VwLm5leHQoe30pO1xyXG4gICAgICAgIC8vIGN1cC5raWxsR2FtZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgVGljdGFjdG9lKCk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCJpbXBvcnQgY3VwIGZyb20gJy4vYWNvc2cnO1xyXG5pbXBvcnQgdGljdGFjdG9lIGZyb20gJy4vZ2FtZSc7XHJcblxyXG5cclxuY3VwLm9uKCdnYW1lc3RhcnQnLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25OZXdHYW1lKGFjdGlvbikpO1xyXG5jdXAub24oJ3NraXAnLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25Ta2lwKGFjdGlvbikpO1xyXG5jdXAub24oJ2pvaW4nLCAoYWN0aW9uKSA9PiB0aWN0YWN0b2Uub25Kb2luKGFjdGlvbikpO1xyXG5jdXAub24oJ2xlYXZlJywgKGFjdGlvbikgPT4gdGljdGFjdG9lLm9uTGVhdmUoYWN0aW9uKSk7XHJcbmN1cC5vbigncGljaycsIChhY3Rpb24pID0+IHRpY3RhY3RvZS5vblBpY2soYWN0aW9uKSk7XHJcblxyXG5jdXAuc3VibWl0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==