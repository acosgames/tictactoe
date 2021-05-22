/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./game-server/fsg.js":
/*!****************************!*\
  !*** ./game-server/fsg.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\r\nclass FSG {\r\n    constructor() {\r\n        this.msg = JSON.parse(JSON.stringify(globals.action()));\r\n        this.originalState = JSON.parse(JSON.stringify(globals.state()));\r\n        this.nextState = JSON.parse(JSON.stringify(globals.state()));\r\n        if (!('players' in this.nextState)) {\r\n            this.nextState.players = {};\r\n        }\r\n    }\r\n\r\n    on(actionName, cb) {\r\n        if (this.msg.action != actionName)\r\n            return;\r\n        cb(this.msg);\r\n    }\r\n\r\n    finish() {\r\n        globals.finish(this.nextState);\r\n    }\r\n\r\n    log(msg) {\r\n        globals.log(msg);\r\n    }\r\n    error(msg) {\r\n        globals.error(msg);\r\n    }\r\n\r\n    action() {\r\n        return this.action;\r\n    }\r\n\r\n    state(key, value) {\r\n\r\n        if (typeof key === 'undefined')\r\n            return this.nextState;\r\n        if (typeof value === 'undefined')\r\n            return this.nextState[key];\r\n\r\n        this.nextState[key] = value;\r\n    }\r\n\r\n    players(userid, value) {\r\n        if (typeof userid === 'undefined')\r\n            return this.nextState.players;\r\n        if (typeof value === 'undefined')\r\n            return this.nextState.players[userid];\r\n\r\n        this.nextState.players[userid] = value;\r\n    }\r\n\r\n    rules(rule, value) {\r\n        if (typeof rule === 'undefined')\r\n            return this.nextState.rules;\r\n        if (typeof value === 'undefined')\r\n            return this.nextState.rules[rule];\r\n\r\n        this.nextState.rules[rule] = value;\r\n    }\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new FSG());//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aWN0YWN0b2UvLi9nYW1lLXNlcnZlci9mc2cuanM/OThiMSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyIsImZpbGUiOiIuL2dhbWUtc2VydmVyL2ZzZy5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jbGFzcyBGU0cge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5tc2cgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuYWN0aW9uKCkpKTtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsU3RhdGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGdsb2JhbHMuc3RhdGUoKSkpO1xyXG4gICAgICAgIHRoaXMubmV4dFN0YXRlID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShnbG9iYWxzLnN0YXRlKCkpKTtcclxuICAgICAgICBpZiAoISgncGxheWVycycgaW4gdGhpcy5uZXh0U3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dFN0YXRlLnBsYXllcnMgPSB7fTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb24oYWN0aW9uTmFtZSwgY2IpIHtcclxuICAgICAgICBpZiAodGhpcy5tc2cuYWN0aW9uICE9IGFjdGlvbk5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBjYih0aGlzLm1zZyk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluaXNoKCkge1xyXG4gICAgICAgIGdsb2JhbHMuZmluaXNoKHRoaXMubmV4dFN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2cobXNnKSB7XHJcbiAgICAgICAgZ2xvYmFscy5sb2cobXNnKTtcclxuICAgIH1cclxuICAgIGVycm9yKG1zZykge1xyXG4gICAgICAgIGdsb2JhbHMuZXJyb3IobXNnKTtcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRlKGtleSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0U3RhdGU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRTdGF0ZVtrZXldO1xyXG5cclxuICAgICAgICB0aGlzLm5leHRTdGF0ZVtrZXldID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVycyh1c2VyaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB1c2VyaWQgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0U3RhdGUucGxheWVycztcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dFN0YXRlLnBsYXllcnNbdXNlcmlkXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0U3RhdGUucGxheWVyc1t1c2VyaWRdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcnVsZXMocnVsZSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJ1bGUgPT09ICd1bmRlZmluZWQnKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0U3RhdGUucnVsZXM7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5leHRTdGF0ZS5ydWxlc1tydWxlXTtcclxuXHJcbiAgICAgICAgdGhpcy5uZXh0U3RhdGUucnVsZXNbcnVsZV0gPSB2YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IEZTRygpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./game-server/fsg.js\n");

/***/ }),

/***/ "./game-server/index.js":
/*!******************************!*\
  !*** ./game-server/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

eval("/* harmony import */ var _fsg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsg */ \"./game-server/fsg.js\");\n\r\n\r\ntry {\r\n    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('join', (msg) => {\r\n        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.log(\"JOIN: \", JSON.stringify(msg));\r\n    });\r\n    // debugger\r\n    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.on('pick', (msg) => {\r\n        _fsg__WEBPACK_IMPORTED_MODULE_0__.default.log(\"PICK: \" + JSON.stringify(msg));\r\n    });\r\n\r\n    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.finish();\r\n}\r\ncatch (e) {\r\n    _fsg__WEBPACK_IMPORTED_MODULE_0__.default.error(e);\r\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aWN0YWN0b2UvLi9nYW1lLXNlcnZlci9pbmRleC5qcz80Y2E5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBd0I7O0FBRXhCO0FBQ0EsSUFBSSw0Q0FBTTtBQUNWLFFBQVEsNkNBQU87QUFDZixLQUFLO0FBQ0w7QUFDQSxJQUFJLDRDQUFNO0FBQ1YsUUFBUSw2Q0FBTztBQUNmLEtBQUs7O0FBRUwsSUFBSSxnREFBVTtBQUNkO0FBQ0E7QUFDQSxJQUFJLCtDQUFTO0FBQ2IiLCJmaWxlIjoiLi9nYW1lLXNlcnZlci9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmc2cgZnJvbSAnLi9mc2cnO1xyXG5cclxudHJ5IHtcclxuICAgIGZzZy5vbignam9pbicsIChtc2cpID0+IHtcclxuICAgICAgICBmc2cubG9nKFwiSk9JTjogXCIsIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfSk7XHJcbiAgICAvLyBkZWJ1Z2dlclxyXG4gICAgZnNnLm9uKCdwaWNrJywgKG1zZykgPT4ge1xyXG4gICAgICAgIGZzZy5sb2coXCJQSUNLOiBcIiArIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnNnLmZpbmlzaCgpO1xyXG59XHJcbmNhdGNoIChlKSB7XHJcbiAgICBmc2cuZXJyb3IoZSk7XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./game-server/index.js\n");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./game-server/index.js");
/******/ 	
/******/ })()
;