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
        this.originalState = JSON.parse(JSON.stringify(globals.state()));
        this.nextState = JSON.parse(JSON.stringify(globals.state()));
        if (!('players' in this.nextState)) {
            this.nextState.players = {};
        }
    }

    on(actionName, cb) {
        if (this.msg.action != actionName)
            return;
        cb(this.msg);
    }

    finish() {
        globals.finish(this.nextState);
    }

    log(msg) {
        globals.log(msg);
    }
    error(msg) {
        globals.error(msg);
    }

    action() {
        return this.action;
    }

    state(key, value) {

        if (typeof key === 'undefined')
            return this.nextState;
        if (typeof value === 'undefined')
            return this.nextState[key];

        this.nextState[key] = value;
    }

    players(userid, value) {
        if (typeof userid === 'undefined')
            return this.nextState.players;
        if (typeof value === 'undefined')
            return this.nextState.players[userid];

        this.nextState.players[userid] = value;
    }

    rules(rule, value) {
        if (typeof rule === 'undefined')
            return this.nextState.rules;
        if (typeof value === 'undefined')
            return this.nextState.rules[rule];

        this.nextState.rules[rule] = value;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new FSG());

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


;

try {
    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', (msg) => {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.log("JOIN: ", msg);
    });
    // debugger
    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', (msg) => {
        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.log("PICK: ", msg);
    });

    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.finish();
}
catch (e) {
    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.error(e);
}

})();

/******/ })()
;