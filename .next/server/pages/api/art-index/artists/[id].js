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
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/art-index/artists/[id].ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/api/art-index/artists/[id].ts":
/*!*********************************************!*\
  !*** ./pages/api/art-index/artists/[id].ts ***!
  \*********************************************/
/*! exports provided: getArtistDetail, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getArtistDetail\", function() { return getArtistDetail; });\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ \"d3\");\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);\n\nasync function getArtistDetail(host, id) {\n  // TODO: Work out https or http\n  const allArtists = await d3__WEBPACK_IMPORTED_MODULE_0__[\"csv\"](`http://${host}/art-index/data/artists.csv`);\n  const artists = allArtists.find(a => a.id === id);\n  return artists;\n}\n\nasync function handler(req, res) {\n  const {\n    headers,\n    query\n  } = req;\n  const {\n    host\n  } = headers;\n  const {\n    id\n  } = query;\n  const result = await getArtistDetail(host, id);\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify(result));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvYXJ0LWluZGV4L2FydGlzdHMvLnRzP2MzM2MiXSwibmFtZXMiOlsiZ2V0QXJ0aXN0RGV0YWlsIiwiaG9zdCIsImlkIiwiYWxsQXJ0aXN0cyIsImQzIiwiYXJ0aXN0cyIsImZpbmQiLCJhIiwiaGFuZGxlciIsInJlcSIsInJlcyIsImhlYWRlcnMiLCJxdWVyeSIsInJlc3VsdCIsInN0YXR1c0NvZGUiLCJzZXRIZWFkZXIiLCJlbmQiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUU8sZUFBZUEsZUFBZixDQUNMQyxJQURLLEVBRUxDLEVBRkssRUFHd0I7QUFDN0I7QUFDQSxRQUFNQyxVQUFnQyxHQUFHLE1BQU1DLHNDQUFBLENBQzVDLFVBQVNILElBQUssNkJBRDhCLENBQS9DO0FBSUEsUUFBTUksT0FBTyxHQUFHRixVQUFVLENBQUNHLElBQVgsQ0FBaUJDLENBQUQsSUFBT0EsQ0FBQyxDQUFDTCxFQUFGLEtBQVNBLEVBQWhDLENBQWhCO0FBRUEsU0FBT0csT0FBUDtBQUNEOztBQUVELGVBQWVHLE9BQWYsQ0FBdUJDLEdBQXZCLEVBQTRDQyxHQUE1QyxFQUFrRTtBQUNoRSxRQUFNO0FBQUVDLFdBQUY7QUFBV0M7QUFBWCxNQUFxQkgsR0FBM0I7QUFDQSxRQUFNO0FBQUVSO0FBQUYsTUFBV1UsT0FBakI7QUFDQSxRQUFNO0FBQUVUO0FBQUYsTUFBU1UsS0FBZjtBQUVBLFFBQU1DLE1BQU0sR0FBRyxNQUFNYixlQUFlLENBQUNDLElBQUQsRUFBT0MsRUFBUCxDQUFwQztBQUVBUSxLQUFHLENBQUNJLFVBQUosR0FBaUIsR0FBakI7QUFDQUosS0FBRyxDQUFDSyxTQUFKLENBQWMsY0FBZCxFQUE4QixrQkFBOUI7QUFDQUwsS0FBRyxDQUFDTSxHQUFKLENBQVFDLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxNQUFmLENBQVI7QUFDRDs7QUFFY0wsc0VBQWYiLCJmaWxlIjoiLi9wYWdlcy9hcGkvYXJ0LWluZGV4L2FydGlzdHMvW2lkXS50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcblxuaW1wb3J0IHtcbiAgLy8gQXJ0SW5kZXhBcGlRdWVyeSxcbiAgQXJ0SW5kZXhBcnRpc3RUeXBlLFxufSBmcm9tICcuLi8uLi8uLi8uLi90eXBlcy9hcnQtaW5kZXgtdHlwZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXJ0aXN0RGV0YWlsKFxuICBob3N0OiBzdHJpbmcsXG4gIGlkOiBzdHJpbmcsXG4pOiBQcm9taXNlPEFydEluZGV4QXJ0aXN0VHlwZT4ge1xuICAvLyBUT0RPOiBXb3JrIG91dCBodHRwcyBvciBodHRwXG4gIGNvbnN0IGFsbEFydGlzdHM6IEFydEluZGV4QXJ0aXN0VHlwZVtdID0gYXdhaXQgZDMuY3N2KFxuICAgIGBodHRwOi8vJHtob3N0fS9hcnQtaW5kZXgvZGF0YS9hcnRpc3RzLmNzdmAsXG4gICk7XG5cbiAgY29uc3QgYXJ0aXN0cyA9IGFsbEFydGlzdHMuZmluZCgoYSkgPT4gYS5pZCA9PT0gaWQpO1xuXG4gIHJldHVybiBhcnRpc3RzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGNvbnN0IHsgaGVhZGVycywgcXVlcnkgfSA9IHJlcTtcbiAgY29uc3QgeyBob3N0IH0gPSBoZWFkZXJzO1xuICBjb25zdCB7IGlkIH0gPSBxdWVyeTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRBcnRpc3REZXRhaWwoaG9zdCwgaWQpO1xuXG4gIHJlcy5zdGF0dXNDb2RlID0gMjAwO1xuICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHJlc3VsdCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/api/art-index/artists/[id].ts\n");

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