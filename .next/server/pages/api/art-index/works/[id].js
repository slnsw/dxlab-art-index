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
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/art-index/works/[id].ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/api/art-index/works/[id].ts":
/*!*******************************************!*\
  !*** ./pages/api/art-index/works/[id].ts ***!
  \*******************************************/
/*! exports provided: getWorkDetail, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getWorkDetail\", function() { return getWorkDetail; });\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ \"d3\");\n/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(d3__WEBPACK_IMPORTED_MODULE_0__);\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\nasync function getWorkDetail(host, id) {\n  // TODO: Work out https or http\n  const allWorks = await d3__WEBPACK_IMPORTED_MODULE_0__[\"csv\"](`http://${host}/art-index/data/works.csv`);\n  const workLinks = await d3__WEBPACK_IMPORTED_MODULE_0__[\"csv\"](`http://${host}/art-index/data/workLinks.csv`);\n  const work = allWorks.find(w => w.id === id);\n  const linkData = workLinks.find(l => l.workId === id);\n  const link = linkData && linkData.url;\n  const imageUrl = linkData && linkData.imageUrl;\n  return _objectSpread(_objectSpread({}, work), {}, {\n    collectionUrl: link,\n    imageUrl\n  });\n}\n\nasync function handler(req, res) {\n  const {\n    headers,\n    query\n  } = req;\n  const {\n    host\n  } = headers;\n  const {\n    id\n  } = query;\n  const result = await getWorkDetail(host, id);\n  res.statusCode = 200;\n  res.setHeader('Content-Type', 'application/json');\n  res.end(JSON.stringify(result));\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (handler);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvYXJ0LWluZGV4L3dvcmtzLy50cz9kMGUxIl0sIm5hbWVzIjpbImdldFdvcmtEZXRhaWwiLCJob3N0IiwiaWQiLCJhbGxXb3JrcyIsImQzIiwid29ya0xpbmtzIiwid29yayIsImZpbmQiLCJ3IiwibGlua0RhdGEiLCJsIiwid29ya0lkIiwibGluayIsInVybCIsImltYWdlVXJsIiwiY29sbGVjdGlvblVybCIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJoZWFkZXJzIiwicXVlcnkiLCJyZXN1bHQiLCJzdGF0dXNDb2RlIiwic2V0SGVhZGVyIiwiZW5kIiwiSlNPTiIsInN0cmluZ2lmeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBUU8sZUFBZUEsYUFBZixDQUNMQyxJQURLLEVBRUxDLEVBRkssRUFHc0I7QUFDM0I7QUFDQSxRQUFNQyxRQUE0QixHQUFHLE1BQU1DLHNDQUFBLENBQ3hDLFVBQVNILElBQUssMkJBRDBCLENBQTNDO0FBSUEsUUFBTUksU0FBZ0IsR0FBRyxNQUFNRCxzQ0FBQSxDQUM1QixVQUFTSCxJQUFLLCtCQURjLENBQS9CO0FBSUEsUUFBTUssSUFBSSxHQUFHSCxRQUFRLENBQUNJLElBQVQsQ0FBZUMsQ0FBRCxJQUFPQSxDQUFDLENBQUNOLEVBQUYsS0FBU0EsRUFBOUIsQ0FBYjtBQUNBLFFBQU1PLFFBQVEsR0FBR0osU0FBUyxDQUFDRSxJQUFWLENBQWdCRyxDQUFELElBQU9BLENBQUMsQ0FBQ0MsTUFBRixLQUFhVCxFQUFuQyxDQUFqQjtBQUNBLFFBQU1VLElBQUksR0FBR0gsUUFBUSxJQUFJQSxRQUFRLENBQUNJLEdBQWxDO0FBQ0EsUUFBTUMsUUFBUSxHQUFHTCxRQUFRLElBQUlBLFFBQVEsQ0FBQ0ssUUFBdEM7QUFFQSx5Q0FBWVIsSUFBWjtBQUFrQlMsaUJBQWEsRUFBRUgsSUFBakM7QUFBdUNFO0FBQXZDO0FBQ0Q7O0FBRUQsZUFBZUUsT0FBZixDQUF1QkMsR0FBdkIsRUFBNENDLEdBQTVDLEVBQWtFO0FBQ2hFLFFBQU07QUFBRUMsV0FBRjtBQUFXQztBQUFYLE1BQXFCSCxHQUEzQjtBQUNBLFFBQU07QUFBRWhCO0FBQUYsTUFBV2tCLE9BQWpCO0FBQ0EsUUFBTTtBQUFFakI7QUFBRixNQUFTa0IsS0FBZjtBQUVBLFFBQU1DLE1BQU0sR0FBRyxNQUFNckIsYUFBYSxDQUFDQyxJQUFELEVBQU9DLEVBQVAsQ0FBbEM7QUFFQWdCLEtBQUcsQ0FBQ0ksVUFBSixHQUFpQixHQUFqQjtBQUNBSixLQUFHLENBQUNLLFNBQUosQ0FBYyxjQUFkLEVBQThCLGtCQUE5QjtBQUNBTCxLQUFHLENBQUNNLEdBQUosQ0FBUUMsSUFBSSxDQUFDQyxTQUFMLENBQWVMLE1BQWYsQ0FBUjtBQUNEOztBQUVjTCxzRUFBZiIsImZpbGUiOiIuL3BhZ2VzL2FwaS9hcnQtaW5kZXgvd29ya3MvW2lkXS50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJztcbmltcG9ydCB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0JztcblxuaW1wb3J0IHtcbiAgLy8gQXJ0SW5kZXhBcGlRdWVyeSxcbiAgQXJ0SW5kZXhXb3JrVHlwZSxcbn0gZnJvbSAnLi4vLi4vLi4vLi4vdHlwZXMvYXJ0LWluZGV4LXR5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFdvcmtEZXRhaWwoXG4gIGhvc3Q6IHN0cmluZyxcbiAgaWQ6IHN0cmluZyxcbik6IFByb21pc2U8QXJ0SW5kZXhXb3JrVHlwZT4ge1xuICAvLyBUT0RPOiBXb3JrIG91dCBodHRwcyBvciBodHRwXG4gIGNvbnN0IGFsbFdvcmtzOiBBcnRJbmRleFdvcmtUeXBlW10gPSBhd2FpdCBkMy5jc3YoXG4gICAgYGh0dHA6Ly8ke2hvc3R9L2FydC1pbmRleC9kYXRhL3dvcmtzLmNzdmAsXG4gICk7XG5cbiAgY29uc3Qgd29ya0xpbmtzOiBhbnlbXSA9IGF3YWl0IGQzLmNzdihcbiAgICBgaHR0cDovLyR7aG9zdH0vYXJ0LWluZGV4L2RhdGEvd29ya0xpbmtzLmNzdmAsXG4gICk7XG5cbiAgY29uc3Qgd29yayA9IGFsbFdvcmtzLmZpbmQoKHcpID0+IHcuaWQgPT09IGlkKTtcbiAgY29uc3QgbGlua0RhdGEgPSB3b3JrTGlua3MuZmluZCgobCkgPT4gbC53b3JrSWQgPT09IGlkKTtcbiAgY29uc3QgbGluayA9IGxpbmtEYXRhICYmIGxpbmtEYXRhLnVybDtcbiAgY29uc3QgaW1hZ2VVcmwgPSBsaW5rRGF0YSAmJiBsaW5rRGF0YS5pbWFnZVVybDtcblxuICByZXR1cm4geyAuLi53b3JrLCBjb2xsZWN0aW9uVXJsOiBsaW5rLCBpbWFnZVVybCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGNvbnN0IHsgaGVhZGVycywgcXVlcnkgfSA9IHJlcTtcbiAgY29uc3QgeyBob3N0IH0gPSBoZWFkZXJzO1xuICBjb25zdCB7IGlkIH0gPSBxdWVyeTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRXb3JrRGV0YWlsKGhvc3QsIGlkKTtcblxuICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgcmVzLmVuZChKU09OLnN0cmluZ2lmeShyZXN1bHQpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFuZGxlcjtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/api/art-index/works/[id].ts\n");

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