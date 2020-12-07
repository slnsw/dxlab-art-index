module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/art-index/exhibitions/[id].ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/api/art-index/exhibitions/[id].ts":
/*!*************************************************!*\
  !*** ./pages/api/art-index/exhibitions/[id].ts ***!
  \*************************************************/
/*! exports provided: getExhibitionDetail, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getExhibitionDetail\", function() { return getExhibitionDetail; });\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ \"d3\");\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function getExhibitionDetail(host, id) {\n  // TODO: Work out https or http\n  const allExhibitions = await d3__WEBPACK_IMPORTED_MODULE_0__[\"csv\"](`http://${host}/art-index/data/exhibitions.csv`);\n  const exhibition = allExhibitions.find(e => e.id === id);\n  return exhibition;\n}\n\nasync function handler(req, res) {\n  const {\n    headers,\n    query\n  } = req;\n  const {\n    host\n  } = headers;\n  const {\n    id\n  } = query;\n  const result = await getExhibitionDetail(host, id);\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify(result));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvYXJ0LWluZGV4L2V4aGliaXRpb25zLy50cz80ZGJjIl0sIm5hbWVzIjpbImdldEV4aGliaXRpb25EZXRhaWwiLCJob3N0IiwiaWQiLCJhbGxFeGhpYml0aW9ucyIsImQzIiwiZXhoaWJpdGlvbiIsImZpbmQiLCJlIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImhlYWRlcnMiLCJxdWVyeSIsInJlc3VsdCIsInN0YXR1c0NvZGUiLCJzZXRIZWFkZXIiLCJlbmQiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUU8sZUFBZUEsbUJBQWYsQ0FDTEMsSUFESyxFQUVMQyxFQUZLLEVBRzRCO0FBQ2pDO0FBQ0EsUUFBTUMsY0FBd0MsR0FBRyxNQUFNQyxzQ0FBQSxDQUNwRCxVQUFTSCxJQUFLLGlDQURzQyxDQUF2RDtBQUlBLFFBQU1JLFVBQVUsR0FBR0YsY0FBYyxDQUFDRyxJQUFmLENBQXFCQyxDQUFELElBQU9BLENBQUMsQ0FBQ0wsRUFBRixLQUFTQSxFQUFwQyxDQUFuQjtBQUVBLFNBQU9HLFVBQVA7QUFDRDs7QUFFRCxlQUFlRyxPQUFmLENBQXVCQyxHQUF2QixFQUE0Q0MsR0FBNUMsRUFBa0U7QUFDaEUsUUFBTTtBQUFFQyxXQUFGO0FBQVdDO0FBQVgsTUFBcUJILEdBQTNCO0FBQ0EsUUFBTTtBQUFFUjtBQUFGLE1BQVdVLE9BQWpCO0FBQ0EsUUFBTTtBQUFFVDtBQUFGLE1BQVNVLEtBQWY7QUFFQSxRQUFNQyxNQUFNLEdBQUcsTUFBTWIsbUJBQW1CLENBQUNDLElBQUQsRUFBT0MsRUFBUCxDQUF4QztBQUVBUSxLQUFHLENBQUNJLFVBQUosR0FBaUIsR0FBakI7QUFDQUosS0FBRyxDQUFDSyxTQUFKLENBQWMsY0FBZCxFQUE4QixrQkFBOUI7QUFDQUwsS0FBRyxDQUFDTSxHQUFKLENBQVFDLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxNQUFmLENBQVI7QUFDRDs7QUFFY0wsc0VBQWYiLCJmaWxlIjoiLi9wYWdlcy9hcGkvYXJ0LWluZGV4L2V4aGliaXRpb25zL1tpZF0udHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkMyBmcm9tICdkMyc7XG5pbXBvcnQgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCc7XG5cbmltcG9ydCB7XG4gIC8vIEFydEluZGV4QXBpUXVlcnksXG4gIEFydEluZGV4RXhoaWJpdGlvblR5cGUsXG59IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzL2FydC1pbmRleC10eXBlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRFeGhpYml0aW9uRGV0YWlsKFxuICBob3N0OiBzdHJpbmcsXG4gIGlkOiBzdHJpbmcsXG4pOiBQcm9taXNlPEFydEluZGV4RXhoaWJpdGlvblR5cGU+IHtcbiAgLy8gVE9ETzogV29yayBvdXQgaHR0cHMgb3IgaHR0cFxuICBjb25zdCBhbGxFeGhpYml0aW9uczogQXJ0SW5kZXhFeGhpYml0aW9uVHlwZVtdID0gYXdhaXQgZDMuY3N2KFxuICAgIGBodHRwOi8vJHtob3N0fS9hcnQtaW5kZXgvZGF0YS9leGhpYml0aW9ucy5jc3ZgLFxuICApO1xuXG4gIGNvbnN0IGV4aGliaXRpb24gPSBhbGxFeGhpYml0aW9ucy5maW5kKChlKSA9PiBlLmlkID09PSBpZCk7XG5cbiAgcmV0dXJuIGV4aGliaXRpb247XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcbiAgY29uc3QgeyBoZWFkZXJzLCBxdWVyeSB9ID0gcmVxO1xuICBjb25zdCB7IGhvc3QgfSA9IGhlYWRlcnM7XG4gIGNvbnN0IHsgaWQgfSA9IHF1ZXJ5O1xuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldEV4aGliaXRpb25EZXRhaWwoaG9zdCwgaWQpO1xuXG4gIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/api/art-index/exhibitions/[id].ts\n");

/***/ }),

/***/ "d3":
/*!*********************!*\
  !*** external "d3" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"d3\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJkM1wiPzQzNjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZDMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkM1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///d3\n");

/***/ })

/******/ });