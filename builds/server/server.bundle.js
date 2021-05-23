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
        this.msg = JSON.parse(JSON.stringify(globals.action()));
        this.originalGame = JSON.parse(JSON.stringify(globals.game()));
        this.nextGame = JSON.parse(JSON.stringify(globals.game()));
        this.isNewGame = false;
        this.markedForDelete = false;

        if (!this.nextGame || Object.keys(this.nextGame.rules).length == 0) {
            this.isNewGame = true;
            this.error('Missing Rules');
        }

        if (this.nextGame) {
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
        if (this.msg.type != type) {
            if (type == 'newgame' && this.isNewGame) {
                let defaultGame = cb(this.msg);
                this.nextGame = Object.assign({}, defaultGame, { players: this.nextGame.players })
            }
            return;
        }

        cb(this.msg);
    }

    submit() {
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

    action() {
        return this.msg;
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

    onNewGame() {
        return defaultGame
    }

    onJoin() {
        let action = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.action();
        if (!action.userid)
            return;

        if( _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.userid).type ) 
            return;
        //if player count reached required limit, start the game
        let maxPlayers = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.rules('maxPlayers') || 2;
        let playerCount = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerCount();
        if (playerCount >= maxPlayers) {
            this.newRound();
        }
    }

    onLeave() {
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        let action = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.action();

        let otherPlayerId = null;
        if( players[action.userid] ) {
            otherPlayerId = this.selectNextPlayer(action.userid);
            delete players[action.userid];
        }

        if( otherPlayerId ) {
            let otherPlayer = players[otherPlayerId];
            this.setWinner(otherPlayer.type, 'forfeit')
        }
    }

    onPick() {
        let state = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state();
        let action = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.action();
        let user = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players(action.userid);

        //get the picked cell
        let cellid = action.payload.cell;
        let cell = state.cells[cellid];

        // block picking cells with markings, and send error
        if (cell.length > 0) {
            _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({
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

        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('picked');
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.prev({
            cellid, userid
        })

        if (this.checkWinner()) {
            return;
        }

        this.selectNextPlayer();
    }

    newRound() {
        let playerList = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();

        //select the starting player
        if (!this.startPlayer || this.startPlayer.length == 0) {
            this.startPlayer = this.selectNextPlayer(playerList[Math.floor(Math.random() * playerList.length)]);
        }
        else {
            this.startPlayer = this.selectNextPlayer(this.startPlayer);
        }

        //set the starting player, and set type for other player
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.players();
        for (var id in players) 
            players[id].type = 'o';
        players[this.startPlayer].type = 'x';
    }

    selectNextPlayer(userid) {
        let action = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.action();
        let players = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.playerList();
        userid = userid || action.userid;
        //only 2 players so just filter the current player
        let remaining = players.filter(x => x != action.userid);
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.next({
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
        let cells = _fsg__WEBPACK_IMPORTED_MODULE_0__.default.state().cells;
        let filtered = cells.filter(v => v == '');

        if( filtered.length == 0 ) {
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
        for (var userid in players) {
            let player = players[userid];
            if (player.type == type)
                return userid;
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
            player.userid = 'unknown player';
        }
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.clearEvents();
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.event('winner')
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.prev({
            pick: type,
            strip: strip,
            userid: userid
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



_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('newgame', () => _game__WEBPACK_IMPORTED_MODULE_1__.default.onNewGame());
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', () => _game__WEBPACK_IMPORTED_MODULE_1__.default.onJoin());
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('leave', () => _game__WEBPACK_IMPORTED_MODULE_1__.default.onLeave());
_fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', () => _game__WEBPACK_IMPORTED_MODULE_1__.default.onPick());

_fsg__WEBPACK_IMPORTED_MODULE_0__.default.submit();
})();

/******/ })()
;
//# sourceMappingURL=server.bundle.js.map