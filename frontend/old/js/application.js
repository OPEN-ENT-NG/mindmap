/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var entcore_1 = __webpack_require__(1);
	var model_1 = __webpack_require__(2);
	var controllers = __webpack_require__(107);
	var directives = __webpack_require__(112);
	var services = __webpack_require__(117);
	for (var controller in controllers) {
	    entcore_1.ng.controllers.push(controllers[controller]);
	}
	for (var directive in directives) {
	    entcore_1.ng.directives.push(directives[directive]);
	}
	for (var service in services) {
	    entcore_1.ng.services.push(services[service]);
	}
	entcore_1.ng.configs.push(entcore_1.ng.config(['libraryServiceProvider', function (libraryServiceProvider) {
	        libraryServiceProvider.setInvokableResourceInformationGetterFromResource(function () {
	            return function (resource) {
	                return {
	                    id: resource._id,
	                    resourceInformation: {
	                        title: resource.name,
	                        cover: resource.thumbnail,
	                        application: 'MindMap',
	                        pdfUri: "/mindmap#/print/png/".concat(resource._id)
	                    }
	                };
	            };
	        });
	    }]));
	/**
	 * Allows to create a model.
	 */
	entcore_1.model.build = function () {
	    this.mindmaps = new model_1.Mindmaps();
	};
	/**
	 * Allows to define routes of collaborative walls application.
	 */
	entcore_1.routes.define(function ($routeProvider) {
	    $routeProvider
	        .when('/view/:mindmapId', {
	        action: 'viewMindmap'
	    })
	        .when('/print/:mindmapId', {
	        action: 'printMindmap'
	    })
	        .when('/print/png/:mindmapId', {
	        action: 'printPngMindmap'
	    })
	        .when('/folder/:id', {
	        action: 'viewFolder'
	    })
	        .otherwise({
	        action: 'main'
	    });
	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = entcore;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (this && this.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(__webpack_require__(3), exports);
	__exportStar(__webpack_require__(70), exports);
	__exportStar(__webpack_require__(72), exports);
	__exportStar(__webpack_require__(71), exports);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Mindmaps = void 0;
	var entcore_1 = __webpack_require__(1);
	var entcore_toolkit_1 = __webpack_require__(4);
	var index_1 = __webpack_require__(2);
	var axios_1 = __webpack_require__(44);
	var Mindmaps = /** @class */ (function (_super) {
	    __extends(Mindmaps, _super);
	    function Mindmaps() {
	        return _super.call(this, []) || this;
	    }
	    ;
	    Mindmaps.prototype.sync = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var mindmaps;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, axios_1.default.get('/mindmap/list/all')];
	                    case 1:
	                        mindmaps = _a.sent();
	                        ;
	                        this.all = [];
	                        entcore_1._.forEach(mindmaps.data, function (mindmap) {
	                            _this.all.push(entcore_1.Behaviours.applicationsBehaviours.mindmap.resource(new index_1.Mindmap(mindmap)));
	                        });
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    Mindmaps.prototype.remove = function (mindmap) {
	        this.all = (0, entcore_1._)(this.all).filter(function (item) {
	            return item._id !== mindmap._id;
	        });
	    };
	    ;
	    Mindmaps.prototype.forEach = function (cb) {
	        return entcore_1._.forEach(this.all, cb);
	    };
	    ;
	    Mindmaps.prototype.selection = function () {
	        return this.selected;
	    };
	    return Mindmaps;
	}(entcore_toolkit_1.Selection));
	exports.Mindmaps = Mindmaps;
	;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(5));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(6));
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));
	__export(__webpack_require__(9));
	__export(__webpack_require__(42));
	__export(__webpack_require__(43));


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	function mapToArray(map) {
	    var result = [];
	    map.forEach(function (item) {
	        result.push(item);
	    });
	    return result;
	}
	var Mix = (function () {
	    function Mix() {
	    }
	    Mix.extend = function (obj, mixin, casts) {
	        var _loop_1 = function () {
	            var value = mixin[property];
	            if (casts && casts[property] && value) {
	                var castItem = casts[property];
	                var cast_1;
	                if (castItem instanceof Function) {
	                    cast_1 = {
	                        type: castItem,
	                        deps: []
	                    };
	                }
	                else {
	                    cast_1 = {
	                        type: castItem.type,
	                        single: castItem.single,
	                        deps: castItem.deps ? castItem.deps : []
	                    };
	                }
	                var doCast_1 = function (v) {
	                    var instance = new ((_a = cast_1.type).bind.apply(_a, [void 0].concat(cast_1.deps)))();
	                    if (instance.mixin)
	                        instance.mixin(v);
	                    else
	                        Mix.extend(instance, v);
	                    return instance;
	                    var _a;
	                };
	                if (value instanceof Array && cast_1.single) {
	                    obj[property] = [];
	                    value.forEach(function (v) {
	                        obj[property].push(doCast_1(v));
	                    });
	                }
	                else {
	                    obj[property] = doCast_1(value);
	                }
	            }
	            else if (!value || typeof value !== 'object' || value instanceof Array) {
	                obj[property] = value;
	            }
	            else {
	                if (obj[property] instanceof TypedArray) {
	                    obj[property].load(value);
	                }
	                else {
	                    if (!obj[property]) {
	                        obj[property] = {};
	                    }
	                    this_1.extend(obj[property], value);
	                }
	            }
	        };
	        var this_1 = this;
	        for (var property in mixin) {
	            _loop_1();
	        }
	        if (obj && obj.fromJSON) {
	            obj.fromJSON(mixin);
	        }
	    };
	    Mix.castAs = function (className, obj, params) {
	        if (params === void 0) { params = {}; }
	        var newObj = new className(params);
	        this.extend(newObj, obj);
	        return newObj;
	    };
	    Mix.castArrayAs = function (className, arr, params) {
	        if (params === void 0) { params = {}; }
	        var newArr = [];
	        arr.forEach(function (item) {
	            newArr.push(Mix.castAs(className, item, params));
	        });
	        return newArr;
	    };
	    return Mix;
	}());
	exports.Mix = Mix;
	var TypedArray = (function (_super) {
	    __extends(TypedArray, _super);
	    function TypedArray(className, mixin) {
	        if (mixin === void 0) { mixin = {}; }
	        var _this = _super.call(this) || this;
	        _this.className = className;
	        _this.mixin = mixin;
	        return _this;
	    }
	    TypedArray.prototype.push = function () {
	        var _this = this;
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        items.forEach(function (item) {
	            if (!(item instanceof _this.className)) {
	                item = Mix.castAs(_this.className, item);
	            }
	            for (var prop in _this.mixin) {
	                item[prop] = _this.mixin[prop];
	            }
	            Array.prototype.push.call(_this, item);
	        });
	        return this.length;
	    };
	    TypedArray.prototype.load = function (data) {
	        var _this = this;
	        data.forEach(function (item) {
	            _this.push(item);
	        });
	    };
	    TypedArray.prototype.asArray = function () {
	        return mapToArray(this);
	    };
	    TypedArray.prototype.toJSON = function () {
	        return mapToArray(this);
	    };
	    return TypedArray;
	}(Array));
	exports.TypedArray = TypedArray;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	"use strict";
	var Eventer = (function () {
	    function Eventer() {
	        this.events = new Map();
	    }
	    Eventer.prototype.trigger = function (eventName, data) {
	        if (this.events[eventName]) {
	            this.events[eventName].forEach(function (f) { return f(data); });
	        }
	    };
	    Eventer.prototype.on = function (eventName, cb) {
	        if (!this.events[eventName]) {
	            this.events[eventName] = [];
	        }
	        this.events[eventName].push(cb);
	    };
	    Eventer.prototype.off = function (eventName, cb) {
	        if (!this.events[eventName]) {
	            return;
	        }
	        if (cb === undefined) {
	            this.events[eventName] = [];
	            return;
	        }
	        var index = this.events[eventName].indexOf(cb);
	        if (index !== -1) {
	            this.events[eventName].splice(index, 1);
	        }
	    };
	    Eventer.prototype.once = function (eventName, cb) {
	        var _this = this;
	        var callback = function (data) {
	            cb(data);
	            _this.off(eventName, callback);
	        };
	        this.on(eventName, callback);
	    };
	    return Eventer;
	}());
	exports.Eventer = Eventer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	var Selection = (function () {
	    function Selection(arr) {
	        this.arr = arr;
	        this.selectedElements = [];
	    }
	    Object.defineProperty(Selection.prototype, "all", {
	        get: function () {
	            return this.arr;
	        },
	        set: function (all) {
	            this.arr = all;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Selection.prototype.filter = function (filter) {
	        return this.arr.filter(filter);
	    };
	    Selection.prototype.push = function (item) {
	        this.arr.push(item);
	    };
	    Selection.prototype.addRange = function (arr) {
	        for (var i = 0; i < arr.length; i++) {
	            this.all.push(arr[i]);
	        }
	    };
	    Object.defineProperty(Selection.prototype, "colLength", {
	        get: function () {
	            return this.arr.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Selection.prototype, "length", {
	        get: function () {
	            return this.selected.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Selection.prototype.forEach = function (func) {
	        this.arr.forEach(func);
	    };
	    Selection.prototype.selectAll = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = true;
	        }
	    };
	    Selection.prototype.select = function (filter) {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = filter(this.arr[i]);
	        }
	    };
	    Selection.prototype.deselect = function (filter) {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = !filter(this.arr[i]);
	        }
	    };
	    Selection.prototype.deselectAll = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            this.arr[i].selected = false;
	        }
	    };
	    Selection.prototype.removeSelection = function () {
	        var newArr = [];
	        for (var i = 0; i < this.arr.length; i++) {
	            if (!this.arr[i].selected) {
	                newArr.push(this.arr[i]);
	            }
	        }
	        this.arr.splice(0, this.arr.length);
	        for (var i = 0; i < newArr.length; i++) {
	            this.arr.push(newArr[i]);
	        }
	    };
	    Selection.prototype.updateSelected = function () {
	        for (var i = 0; i < this.arr.length; i++) {
	            var index = this.selectedElements.indexOf(this.arr[i]);
	            if (this.arr[i].selected && index === -1) {
	                this.selectedElements.push(this.arr[i]);
	            }
	            else if (!this.arr[i].selected && index !== -1) {
	                this.selectedElements.splice(index, 1);
	            }
	        }
	        for (var i = 0; i < this.selectedElements.length; i++) {
	            var index = this.arr.indexOf(this.selectedElements[i]);
	            if (index === -1) {
	                this.selectedElements.splice(index, 1);
	            }
	        }
	    };
	    Object.defineProperty(Selection.prototype, "selected", {
	        // a specific array is maintained to avoid references breaking all the time
	        get: function () {
	            this.updateSelected();
	            return this.selectedElements;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Selection;
	}());
	exports.Selection = Selection;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(10));
	__export(__webpack_require__(11));
	__export(__webpack_require__(38));
	__export(__webpack_require__(39));
	__export(__webpack_require__(40));
	__export(__webpack_require__(41));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var minicast_1 = __webpack_require__(6);
	var AbstractCrud = (function () {
	    function AbstractCrud(api, model, initialCast, childrenCasts, customMixin) {
	        this.api = api;
	        this.model = model;
	        this.initialCast = initialCast;
	        this.childrenCasts = childrenCasts;
	        this.customMixin = customMixin;
	    }
	    AbstractCrud.prototype.parseApi = function (api, parameters) {
	        var _this = this;
	        if (typeof api === 'function') {
	            api = api();
	        }
	        return api.split(/(:[a-zA-Z0-9_.]+)/)
	            .map(function (fragment) {
	            return fragment.charAt(0) === ':' ?
	                parameters && parameters[fragment.substr(1)] ||
	                    _this.model[fragment.substr(1)] ||
	                    _this[fragment.substr(1)] ||
	                    fragment :
	                fragment;
	        }).join('');
	    };
	    AbstractCrud.prototype.defaultMixin = function (payload) {
	        var _this = this;
	        if (payload instanceof Array && this.model instanceof Array) {
	            this.model = [];
	            var model_1 = this.model; //fix type inference
	            payload.forEach(function (item) {
	                var instance = {};
	                if (_this.initialCast) {
	                    if (_this.initialCast instanceof Function) {
	                        instance = new _this.initialCast();
	                    }
	                    else {
	                        instance = new ((_a = _this.initialCast.type).bind.apply(_a, [void 0].concat(_this.initialCast.deps)))();
	                    }
	                }
	                minicast_1.Mix.extend(instance, item, _this.childrenCasts);
	                model_1.push(instance);
	                var _a;
	            });
	        }
	        else {
	            minicast_1.Mix.extend(this.model, payload, this.childrenCasts);
	        }
	    };
	    AbstractCrud.prototype.create = function (item, opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.create) {
	            throw '[Crud][Api] "create" route is undefined';
	        }
	        return this.http.post(this.parseApi(this.api.create, item), item || this.model, opts)
	            .then(function (response) {
	            if (_this.model instanceof Array) {
	                _this.model.push(item);
	            }
	            return response;
	        });
	    };
	    AbstractCrud.prototype.sync = function (opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.sync) {
	            throw '[Crud][Api] "sync" route is undefined';
	        }
	        return this.http.get(this.parseApi(this.api.sync), opts)
	            .then(function (response) {
	            (_this.customMixin || _this.defaultMixin).bind(_this)(response.data);
	            return response;
	        });
	    };
	    AbstractCrud.prototype.update = function (item, opts) {
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.update) {
	            throw '[Crud][Api] "update" route is undefined';
	        }
	        return this.http.put(this.parseApi(this.api.update, item), item || this.model, opts);
	    };
	    AbstractCrud.prototype.delete = function (item, opts) {
	        var _this = this;
	        if (opts === void 0) { opts = {}; }
	        if (!this.api.delete) {
	            throw '[Crud][Api] "delete" route is undefined';
	        }
	        return this.http.delete(this.parseApi(this.api.delete, item), opts)
	            .then(function (response) {
	            if (_this.model instanceof Array) {
	                var index = _this.model.indexOf(item);
	                if (index !== -1) {
	                    _this.model.splice(_this.model.indexOf(item), 1);
	                }
	            }
	            return response;
	        });
	    };
	    return AbstractCrud;
	}());
	exports.AbstractCrud = AbstractCrud;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(12);
	var abstract_crud_1 = __webpack_require__(10);
	var Crud = (function (_super) {
	    __extends(Crud, _super);
	    function Crud() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Crud;
	}(abstract_crud_1.AbstractCrud));
	exports.Crud = Crud;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(13);

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	var bind = __webpack_require__(15);
	var Axios = __webpack_require__(16);
	var defaults = __webpack_require__(17);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(35);
	axios.CancelToken = __webpack_require__(36);
	axios.isCancel = __webpack_require__(32);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(37);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(15);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(17);
	var utils = __webpack_require__(14);
	var InterceptorManager = __webpack_require__(29);
	var dispatchRequest = __webpack_require__(30);
	var isAbsoluteURL = __webpack_require__(33);
	var combineURLs = __webpack_require__(34);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(14);
	var normalizeHeaderName = __webpack_require__(19);
	
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(20);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(20);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(14);
	var settle = __webpack_require__(21);
	var buildURL = __webpack_require__(24);
	var parseHeaders = __webpack_require__(25);
	var isURLSameOrigin = __webpack_require__(26);
	var createError = __webpack_require__(22);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(27);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(28);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(22);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response
	    ));
	  }
	};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(23);
	
	/**
	 * Create an Error with the specified message, config, error code, and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, response);
	};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.response = response;
	  return error;
	};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	var transformData = __webpack_require__(31);
	var isCancel = __webpack_require__(32);
	var defaults = __webpack_require__(17);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(14);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(35);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 37 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var abstract_crud_1 = __webpack_require__(10);
	var minicast_1 = __webpack_require__(6);
	var AbstractCollection = (function (_super) {
	    __extends(AbstractCollection, _super);
	    function AbstractCollection(api, initialCast, childrenCasts) {
	        var _this = _super.call(this, api, null, initialCast, childrenCasts) || this;
	        _this.data = [];
	        _this.model = _this.data;
	        _this.customMixin = _this.mixin;
	        return _this;
	    }
	    AbstractCollection.prototype.mixin = function (data) {
	        var _this = this;
	        if (!data || !(data instanceof Array)) {
	            throw "[Crud][Collection] An Array payload is expected.";
	        }
	        this.data = [];
	        data.forEach(function (item) {
	            var instance = {};
	            if (_this.initialCast) {
	                if (_this.initialCast instanceof Function) {
	                    instance = new _this.initialCast();
	                }
	                else {
	                    instance = new ((_a = _this.initialCast.type).bind.apply(_a, [void 0].concat(_this.initialCast.deps)))();
	                }
	            }
	            minicast_1.Mix.extend(instance, item, _this.childrenCasts);
	            _this.data.push(instance);
	            var _a;
	        });
	    };
	    return AbstractCollection;
	}(abstract_crud_1.AbstractCrud));
	exports.AbstractCollection = AbstractCollection;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(12);
	var abstract_collection_1 = __webpack_require__(38);
	var Collection = (function (_super) {
	    __extends(Collection, _super);
	    function Collection(api, initialCast, childrenCasts) {
	        var _this = _super.call(this, api, initialCast, childrenCasts) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Collection;
	}(abstract_collection_1.AbstractCollection));
	exports.Collection = Collection;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var abstract_crud_1 = __webpack_require__(10);
	var minicast_1 = __webpack_require__(6);
	var AbstractModel = (function (_super) {
	    __extends(AbstractModel, _super);
	    function AbstractModel(api, childrenCasts) {
	        var _this = _super.call(this, api, null, null, childrenCasts) || this;
	        _this.model = _this;
	        _this.customMixin = _this.mixin;
	        return _this;
	    }
	    AbstractModel.prototype.mixin = function (data) {
	        if (!data || !(data instanceof Object)) {
	            throw "[Crud][Collection] An Object payload is expected.";
	        }
	        minicast_1.Mix.extend(this, data, this.childrenCasts);
	    };
	    return AbstractModel;
	}(abstract_crud_1.AbstractCrud));
	exports.AbstractModel = AbstractModel;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var axios_1 = __webpack_require__(12);
	var abstract_model_1 = __webpack_require__(40);
	var Model = (function (_super) {
	    __extends(Model, _super);
	    function Model(api, childrenCasts) {
	        var _this = _super.call(this, api, childrenCasts) || this;
	        _this.http = axios_1.default;
	        return _this;
	    }
	    return Model;
	}(abstract_model_1.AbstractModel));
	exports.Model = Model;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var eventer_1 = __webpack_require__(7);
	var minicast_1 = __webpack_require__(6);
	var axios_1 = __webpack_require__(12);
	/*
	 * Tool to manage a single list provider used by multiple objects (to avoid multiple call to a same path)
	 * Usage :
	 * let provider = new Provider<T>(path, MyClass);
	 * function a(){
	 *    //get data from provider
	 *    let data = await provider.data();
	 * }
	 *
	 * function b(){
	 *    let data = await provider.data();
	 *    //get data when a refresh happens
	 *    provider.on('refresh', (newData) => data = newData));
	 * }
	 *
	 * //force provider refresh (after data invalidation)
	 * setTimeout(() => provider.refresh(), 50000);
	 *
	 * a();
	 * b();
	*/
	var Provider = (function () {
	    function Provider(path, className) {
	        this.path = path;
	        this.className = className;
	        this._data = [];
	        this.eventer = new eventer_1.Eventer();
	    }
	    Provider.prototype.data = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(!this.isSynced && !this.syncing))
	                            return [3 /*break*/, 2];
	                        return [4 /*yield*/, this.sync()];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2:
	                        if (!this.syncing)
	                            return [3 /*break*/, 4];
	                        return [4 /*yield*/, this.syncDone()];
	                    case 3:
	                        _a.sent();
	                        _a.label = 4;
	                    case 4: return [2 /*return*/, this._data];
	                }
	            });
	        });
	    };
	    Provider.prototype.syncDone = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var _this = this;
	            return __generator(this, function (_a) {
	                return [2 /*return*/, new Promise(function (resolve, reject) {
	                        _this.eventer.once('sync', function () { return resolve(); });
	                    })];
	            });
	        });
	    };
	    Provider.prototype.sync = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var response;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.syncing = true;
	                        return [4 /*yield*/, axios_1.default.get(this.path)];
	                    case 1:
	                        response = _a.sent();
	                        this._data = minicast_1.Mix.castArrayAs(this.className, response.data);
	                        this.isSynced = true;
	                        this.eventer.trigger('sync');
	                        this.syncing = false;
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Provider.prototype.refresh = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        this.isSynced = false;
	                        return [4 /*yield*/, this.sync()];
	                    case 1:
	                        _a.sent();
	                        this.eventer.trigger('refresh');
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    Provider.prototype.push = function (data) {
	        this._data.push(data);
	    };
	    Provider.prototype.remove = function (data) {
	        var index = this._data.indexOf(data);
	        if (index === -1)
	            return;
	        this._data.splice(index, 1);
	    };
	    return Provider;
	}());
	exports.Provider = Provider;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var axios_1 = __webpack_require__(12);
	var autosaved = [];
	var loopStarted = false;
	var token;
	var loop = function () {
	    autosaved.forEach(function (item) {
	        if (item._backup !== JSON.stringify(item.model)) {
	            if (item.fn) {
	                item.fn();
	            }
	            else {
	                axios_1.default[item.method](item.path, item.model);
	            }
	            item._backup = JSON.stringify(item.model);
	        }
	    });
	    loopStarted = true;
	    token = setTimeout(loop, 500);
	};
	var Autosave = (function () {
	    function Autosave() {
	    }
	    Autosave.watch = function (path, model, method) {
	        if (method === void 0) { method = 'put'; }
	        if (autosaved.findIndex(function (e) { return e.model === model && e.path === path; }) !== -1) {
	            return;
	        }
	        var autosave;
	        if (typeof path === 'string') {
	            autosave = {
	                model: model,
	                path: path,
	                method: method
	            };
	        }
	        else {
	            autosave = {
	                model: model,
	                fn: path,
	                method: method
	            };
	        }
	        autosaved.push(autosave);
	        if (!loopStarted) {
	            loop();
	        }
	    };
	    Autosave.unwatch = function (model) {
	        var index = autosaved.findIndex(function (e) { return e.model === model; });
	        autosaved.splice(index, 1);
	        if (autosaved.length === 0) {
	            this.unwatchAll();
	        }
	    };
	    Autosave.unwatchAll = function () {
	        autosaved = [];
	        clearTimeout(token);
	        loopStarted = false;
	    };
	    return Autosave;
	}());
	exports.Autosave = Autosave;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(45);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	var bind = __webpack_require__(47);
	var Axios = __webpack_require__(49);
	var defaults = __webpack_require__(50);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(67);
	axios.CancelToken = __webpack_require__(68);
	axios.isCancel = __webpack_require__(64);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(69);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(47);
	var isBuffer = __webpack_require__(48);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */
	
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}
	
	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}
	
	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(50);
	var utils = __webpack_require__(46);
	var InterceptorManager = __webpack_require__(61);
	var dispatchRequest = __webpack_require__(62);
	var isAbsoluteURL = __webpack_require__(65);
	var combineURLs = __webpack_require__(66);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(46);
	var normalizeHeaderName = __webpack_require__(51);
	
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(52);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(52);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(46);
	var settle = __webpack_require__(53);
	var buildURL = __webpack_require__(56);
	var parseHeaders = __webpack_require__(57);
	var isURLSameOrigin = __webpack_require__(58);
	var createError = __webpack_require__(54);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(59);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
	        request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(60);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(54);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(55);
	
	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	var transformData = __webpack_require__(63);
	var isCancel = __webpack_require__(64);
	var defaults = __webpack_require__(50);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(46);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(67);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MindmapFolder = exports.MindmapView = exports.Mindmap = void 0;
	var entcore_1 = __webpack_require__(1);
	var axios_1 = __webpack_require__(44);
	var entcore_toolkit_1 = __webpack_require__(4);
	var FolderItem_1 = __webpack_require__(71);
	/**
	 * Model to create a mindmap.
	 */
	var Mindmap = /** @class */ (function (_super) {
	    __extends(Mindmap, _super);
	    function Mindmap(mindmap) {
	        var _this = _super.call(this) || this;
	        _this.rights = new entcore_1.Rights(_this);
	        _this.rights.fromBehaviours();
	        if (mindmap) {
	            entcore_toolkit_1.Mix.extend(_this, mindmap);
	        }
	        return _this;
	    }
	    ;
	    Mindmap.prototype.setType = function (type) {
	        this.type = type;
	        return this;
	    };
	    Mindmap.prototype.save = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.update()];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    Mindmap.prototype.toJSONSave = function () {
	        return {
	            name: this.name,
	            description: this.description,
	            thumbnail: this.thumbnail,
	            map: this.map,
	            folder_parent_id: this.folder_parent_id,
	            type: this.type,
	        };
	    };
	    ;
	    Mindmap.prototype.setFromElement = function (elem) {
	        this.id = elem._id;
	        this.name = elem.name;
	        this.folder_parent_id = elem.folder_parent_id;
	        this.type = elem.type;
	        return this;
	    };
	    Object.defineProperty(Mindmap.prototype, "myRights", {
	        get: function () {
	            return this.rights.myRights;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    ;
	    /**
	     * Allows to create a new mindmap. This method calls the REST web service to
	     * persist data.
	     */
	    Mindmap.prototype.create = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, axios_1.default.post('/mindmap', this.toJSON())];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    /**
	     * Allows to update the mindmap. This method calls the REST web service to persist
	     * data.
	     */
	    Mindmap.prototype.update = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, axios_1.default.put('/mindmap/' + this._id, this.toJSON())];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    /**
	     * Allows to delete the mindmap. This method calls the REST web service to delete
	     * data.
	     */
	    Mindmap.prototype.delete = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, axios_1.default.delete('/mindmap/' + this._id, { data: this.toJSON() })];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    /**
	     * Allows to convert the current mindmap into a JSON format.
	     * @return the current mindmap in JSON format.
	     */
	    Mindmap.prototype.toJSON = function () {
	        return {
	            _id: this._id,
	            name: this.name,
	            folder_parent_id: this.folder_parent_id,
	            type: this.type
	        };
	    };
	    ;
	    Mindmap.prototype.toJson = function () {
	        return {
	            _id: this._id,
	            name: this.name,
	            folder_parent_id: this.folder_parent_id,
	            type: this.type
	        };
	    };
	    return Mindmap;
	}(FolderItem_1.FolderItem));
	exports.Mindmap = Mindmap;
	;
	var MindmapView = /** @class */ (function () {
	    function MindmapView() {
	    }
	    return MindmapView;
	}());
	exports.MindmapView = MindmapView;
	var MindmapFolder = /** @class */ (function (_super) {
	    __extends(MindmapFolder, _super);
	    function MindmapFolder(name, folder_parent, description, thumbnail) {
	        var _this = _super.call(this) || this;
	        _this.name = name;
	        _this.folder_parent = folder_parent;
	        _this.description = description;
	        _this.thumbnail = thumbnail;
	        return _this;
	    }
	    return MindmapFolder;
	}(MindmapView));
	exports.MindmapFolder = MindmapFolder;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FolderItem = exports.FolderItemView = void 0;
	var axios_1 = __webpack_require__(44);
	var FolderItemView = /** @class */ (function () {
	    function FolderItemView() {
	    }
	    return FolderItemView;
	}());
	exports.FolderItemView = FolderItemView;
	var FolderItem = /** @class */ (function (_super) {
	    __extends(FolderItem, _super);
	    function FolderItem(id, name, folder_parent_id) {
	        var _this = _super.call(this) || this;
	        _this.id = id;
	        _this.name = name;
	        _this.folder_parent_id = folder_parent_id;
	        return _this;
	    }
	    FolderItem.prototype.toJSON = function () {
	        return {
	            _id: this._id,
	            name: this.name,
	            folder_parent_id: this.folder_parent_id,
	            type: this.type
	        };
	    };
	    ;
	    FolderItem.prototype.setType = function (type) {
	        this.type = type;
	        return this;
	    };
	    FolderItem.prototype.save = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.update()];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    FolderItem.prototype.update = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!this._id) return [3 /*break*/, 2];
	                        return [4 /*yield*/, axios_1.default.put('/mindmap/' + this._id, this.toJSONSave())];
	                    case 1:
	                        _a.sent();
	                        _a.label = 2;
	                    case 2: return [2 /*return*/];
	                }
	            });
	        });
	    };
	    ;
	    FolderItem.prototype.toJSONSave = function () {
	        return {
	            name: this.name,
	            description: this.description,
	            thumbnail: this.thumbnail,
	            map: this.map
	        };
	    };
	    ;
	    FolderItem.prototype.toJson = function () {
	        var folderItem = {
	            "_id": this.id,
	            "name": this.name,
	            "folder_parent_id": this.folder_parent_id,
	        };
	        return folderItem;
	    };
	    FolderItem.prototype.setFromElement = function (elem) {
	        this.id = elem._id;
	        this.name = elem.name;
	        this.folder_parent_id = elem.folder_parent_id;
	        this.type = elem.type;
	        return this;
	    };
	    return FolderItem;
	}(FolderItemView));
	exports.FolderItem = FolderItem;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Folders = exports.Folder = exports.FolderView = void 0;
	var entcore_toolkit_1 = __webpack_require__(4);
	var entcore_1 = __webpack_require__(1);
	var models = entcore_1.workspace.v2.models;
	var FolderItem_1 = __webpack_require__(71);
	var type_1 = __webpack_require__(73);
	var Mindmap_1 = __webpack_require__(70);
	var forEach = __webpack_require__(74);
	var FolderView = /** @class */ (function () {
	    function FolderView() {
	    }
	    return FolderView;
	}());
	exports.FolderView = FolderView;
	var Folder = /** @class */ (function (_super) {
	    __extends(Folder, _super);
	    function Folder(name, folder_parent_id) {
	        var _this = _super.call(this) || this;
	        _this.name = name;
	        _this.folder_parent_id = folder_parent_id;
	        return _this;
	    }
	    return Folder;
	}(FolderView));
	exports.Folder = Folder;
	var Folders = /** @class */ (function () {
	    function Folders(folderTab, mindmapsTab) {
	        var _this = this;
	        this.mapToChildrenTrees = function () {
	            return entcore_toolkit_1.Mix.castArrayAs(models.Element, _this.all);
	        };
	        this.setFolders = function (folders) {
	            _this.all = folders.filter(function (folder) { return folder.type == type_1.FOLDER_ITEM_TYPE.FOLDER; });
	        };
	        this.setFilterFolder = function (id) {
	            _this.all = _this.all.filter(function (folder) { return folder._id != id; });
	        };
	        this.setMindmaps = function (mindmaps) {
	            _this.mindmapsAll = mindmaps.filter(function (folder) { return folder.type == type_1.FOLDER_ITEM_TYPE.MINDMAP; });
	            _this.mindmapsRight = _this.mindmapsAll.map(function (mindmap) { return entcore_1.Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap_1.Mindmap(mindmap)); });
	        };
	        this.findTree = function (currentFolders, id) {
	            var elem = currentFolders.find(function (folder) { return folder._id == id; });
	            if (!elem) {
	                for (var _i = 0, currentFolders_1 = currentFolders; _i < currentFolders_1.length; _i++) {
	                    var folder = currentFolders_1[_i];
	                    var folderElem = _this.findTree(folder.children, id);
	                    if (folderElem)
	                        return folderElem;
	                }
	            }
	            return elem;
	        };
	        //add Fake Folder for folder who never open before
	        this.setFakeFolder = function (elems) {
	            elems.forEach(function (elem) {
	                elem.children = [new models.Element(new FolderItem_1.FolderItem().setType(type_1.FOLDER_ITEM_TYPE.FOLDER))];
	            });
	        };
	        this.mapFromChildrenTree = function (children) {
	            return children.map(function (child) { return new FolderItem_1.FolderItem().setFromElement(child); });
	        };
	        this.all = folderTab.filter(function (folder) { return folder.type == type_1.FOLDER_ITEM_TYPE.FOLDER; });
	        this.mindmapsAll = mindmapsTab.filter(function (mindmap) { return mindmap.type == type_1.FOLDER_ITEM_TYPE.MINDMAP; });
	        this.trees = [];
	        this.mindmapsRight = this.mindmapsAll.map(function (mindmap) { return entcore_1.Behaviours.applicationsBehaviours.mindmap.resource(new Mindmap_1.Mindmap(mindmap)); });
	        forEach(this.all, function (folder) {
	            if (folder.selected) {
	                _this.selected = true;
	            }
	        });
	    }
	    Folders.prototype.selection = function () {
	        return this.selected;
	    };
	    return Folders;
	}());
	exports.Folders = Folders;


/***/ }),
/* 73 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FOLDER_ITEM_TYPE = void 0;
	exports.FOLDER_ITEM_TYPE = {
	    FOLDER: "FOLDER",
	    MINDMAP: "MINDMAP"
	};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	module.exports = __webpack_require__(78).Array.forEach;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $export  = __webpack_require__(76)
	  , $forEach = __webpack_require__(94)(0)
	  , STRICT   = __webpack_require__(106)([].forEach, true);
	
	$export($export.P + $export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */){
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(77)
	  , core      = __webpack_require__(78)
	  , hide      = __webpack_require__(79)
	  , redefine  = __webpack_require__(89)
	  , ctx       = __webpack_require__(92)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 77 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(80)
	  , createDesc = __webpack_require__(88);
	module.exports = __webpack_require__(84) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(81)
	  , IE8_DOM_DEFINE = __webpack_require__(83)
	  , toPrimitive    = __webpack_require__(87)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(84) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(82);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 82 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(84) && !__webpack_require__(85)(function(){
	  return Object.defineProperty(__webpack_require__(86)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(85)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 85 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(82)
	  , document = __webpack_require__(77).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(82);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 88 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(77)
	  , hide      = __webpack_require__(79)
	  , has       = __webpack_require__(90)
	  , SRC       = __webpack_require__(91)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);
	
	__webpack_require__(78).inspectSource = function(it){
	  return $toString.call(it);
	};
	
	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ }),
/* 90 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 91 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(93);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 93 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx      = __webpack_require__(92)
	  , IObject  = __webpack_require__(95)
	  , toObject = __webpack_require__(97)
	  , toLength = __webpack_require__(99)
	  , asc      = __webpack_require__(101);
	module.exports = function(TYPE, $create){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX
	    , create        = $create || asc;
	  return function($this, callbackfn, that){
	    var O      = toObject($this)
	      , self   = IObject(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(96);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 96 */
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(98);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 98 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(100)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 100 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = __webpack_require__(102);
	
	module.exports = function(original, length){
	  return new (speciesConstructor(original))(length);
	};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(82)
	  , isArray  = __webpack_require__(103)
	  , SPECIES  = __webpack_require__(104)('species');
	
	module.exports = function(original){
	  var C;
	  if(isArray(original)){
	    C = original.constructor;
	    // cross-realm fallback
	    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
	    if(isObject(C)){
	      C = C[SPECIES];
	      if(C === null)C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(96);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(105)('wks')
	  , uid        = __webpack_require__(91)
	  , Symbol     = __webpack_require__(77).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(77)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	var fails = __webpack_require__(85);
	
	module.exports = function(method, arg){
	  return !!method && fails(function(){
	    arg ? method.call(null, function(){}, 1) : method.call(null);
	  });
	};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (this && this.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(__webpack_require__(108), exports);


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MindmapController = void 0;
	var entcore_1 = __webpack_require__(1);
	var axios_1 = __webpack_require__(44);
	var model_1 = __webpack_require__(2);
	var model_2 = __webpack_require__(2);
	var folder_service_1 = __webpack_require__(109);
	var mindmap_service_1 = __webpack_require__(110);
	var type_1 = __webpack_require__(73);
	var folderItem_1 = __webpack_require__(111);
	/**
	 * Controller for mindmaps. All methods contained in this controller can be called
	 * from the view.
	 * @param $scope Angular JS model.
	 * @param template all templates.
	 * @param model the mindmap model.
	 */
	exports.MindmapController = entcore_1.ng.controller('MindmapController', ['$scope', 'model', 'route', '$timeout', '$sce', '$location',
	    function ($scope, model, route, $timeout, $sce, $location) {
	        $scope.printMode = false;
	        $scope.template = entcore_1.template;
	        $scope.mindmaps = model.mindmaps;
	        $scope.display = {};
	        $scope.searchbar = {};
	        $scope.editorLoaded = false;
	        $scope.editorId = 0;
	        $scope.exportInProgress = false;
	        $scope.action = 'mindmap-list';
	        $scope.notFound = false;
	        $scope.forceToClose = false;
	        $scope.isLightBoxActive = false;
	        var _isLoading = false;
	        $scope.openedFolderIds = [];
	        $scope.openedFolderIdsMove = [];
	        $scope.selectedFoldersId = folderItem_1.FOLDER_ITEM.ID_NULL;
	        $scope.selectedFoldersIdMove = null;
	        window.LAZY_MODE = false;
	        $scope.nameLabel = entcore_1.idiom.translate('mindmap.checkbox.my');
	        $scope.nameLabelShare = entcore_1.idiom.translate('mindmap.checkbox.share');
	        $scope.isMyMindmap = true;
	        $scope.isShareMindmap = true;
	        $scope.selectedMindmapTabs = [];
	        $scope.selectedFolderTabs = [];
	        $scope.orginialValue = "";
	        $scope.getOrignialValue = function (name) {
	            $scope.orginialValue = name;
	        };
	        $scope.cancelNameMindmap = function (mindmap) {
	            mindmap.name = $scope.orginialValue;
	        };
	        $scope.cancelNameFolder = function (folder) {
	            folder.name = $scope.orginialValue;
	        };
	        $scope.deleteFoldersAndMindmaps = function (folderTab) {
	            $scope.deleteFolder(folderTab);
	            $scope.removeMindmap();
	        };
	        $scope.selectFolder = function () {
	            $scope.selectedFolderTabs = $scope.selectedFoldersItem();
	        };
	        $scope.selectMindmap = function () {
	            $scope.selectedMindmapTabs = $scope.selectedMindmaps();
	        };
	        $scope.selectedFoldersItem = function () {
	            return $scope.folders.all.filter(function (folder) { return folder.selected; });
	        };
	        $scope.selectedMindmaps = function () {
	            return $scope.mindmapsItem.mindmapsRight.filter(function (mindmap) { return mindmap.selected; });
	        };
	        $scope.renameFolder = function (id, name) {
	            var body = new model_2.Folder(name);
	            $scope.updateFolderName(id, body);
	        };
	        $scope.renameMindmap = function (id, name) {
	            var body = new model_1.MindmapFolder(name);
	            $scope.updateMindmap(id, body);
	        };
	        $scope.sortMindmap = function (isChecked) { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!isChecked && !$scope.isShareMindmap) {
	                            $scope.isShareMindmap = true;
	                        }
	                        if (!!isChecked) return [3 /*break*/, 2];
	                        $scope.isMyMindmap = false;
	                        return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, true, false)];
	                    case 1:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 4];
	                    case 2:
	                        $scope.isMyMindmap = true;
	                        return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, true, true)];
	                    case 3:
	                        _a.sent();
	                        $scope.$apply();
	                        _a.label = 4;
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.sortShare = function (isChecked) { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!isChecked && !$scope.isMyMindmap) {
	                            $scope.isMyMindmap = true;
	                        }
	                        if (!!isChecked) return [3 /*break*/, 2];
	                        $scope.isShareMindmap = false;
	                        return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, false, true)];
	                    case 1:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 4];
	                    case 2:
	                        $scope.isShareMindmap = true;
	                        return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, true, true)];
	                    case 3:
	                        _a.sent();
	                        $scope.$apply();
	                        _a.label = 4;
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.setFolderChildrenMindmap = function (id, isShare, isMine) { return __awaiter(void 0, void 0, void 0, function () {
	            var folderItem, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0:
	                        _b = (_a = Promise).all;
	                        return [4 /*yield*/, folder_service_1.folderService.getFolderChildren(id, isShare, isMine)];
	                    case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
	                    case 2:
	                        folderItem = _c.sent();
	                        $scope.folders = new model_1.Folders(folderItem, []);
	                        $scope.mindmapsItem = new model_1.Folders([], folderItem);
	                        $scope.foldersMove = new model_1.Folders(folderItem, []);
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        /**
	         * Create Folder for the root and add in the scope
	         */
	        $scope.setFolderRoot = function () {
	            var folder = new model_1.FolderItem(folderItem_1.FOLDER_ITEM.ID_ROOT, entcore_1.idiom.translate('mindmap.folder.title.root')).setType(type_1.FOLDER_ITEM_TYPE.FOLDER);
	            var folderTab = [folder];
	            $scope.foldersRoot = new model_1.Folders(folderTab, []);
	        };
	        /**
	         * Create Folder for the root and add in the scope in the tree of moveFolder
	         */
	        $scope.setFolderRootForMove = function () {
	            var folder = new model_1.FolderItem(folderItem_1.FOLDER_ITEM.ID_ROOT, entcore_1.idiom.translate('mindmap.folder.title.root')).setType(type_1.FOLDER_ITEM_TYPE.FOLDER);
	            var folderTab = [folder];
	            $scope.foldersRootMove = new model_1.Folders(folderTab, []);
	        };
	        $scope.isEmpty = function () {
	            return $scope.folders.all != null;
	        };
	        $scope.initFolder = function () { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, $scope.setFolderChildrenMindmap(folderItem_1.FOLDER_ITEM.ID_NULL, $scope.isShareMindmap, $scope.isMyMindmap)];
	                    case 1:
	                        _a.sent();
	                        $scope.setFolderRoot();
	                        $scope.setFolderRootForMove();
	                        $scope.foldersRootMove.trees = $scope.foldersRootMove.mapToChildrenTrees();
	                        $scope.foldersRootMove.setFakeFolder($scope.foldersRootMove.trees);
	                        $scope.foldersRoot.trees = $scope.foldersRoot.mapToChildrenTrees();
	                        $scope.foldersRoot.setFakeFolder($scope.foldersRoot.trees);
	                        $scope.folderTreeRoot = {
	                            cssTree: "folders-tree",
	                            get trees() {
	                                return $scope.foldersRoot.trees;
	                            },
	                            isDisabled: function (folder) {
	                                return false;
	                            },
	                            isOpenedFolder: function (folder) {
	                                if (!folder._id) {
	                                    folder._id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                    $scope.folderTreeRoot.openFolder(folder);
	                                }
	                                return $scope.openedFolderIds.contains(folder._id);
	                            },
	                            isSelectedFolder: function (folder) {
	                                if (!folder._id) {
	                                    folder._id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                    $scope.selectedFoldersId = null;
	                                }
	                                return $scope.selectedFoldersId == folder._id;
	                            },
	                            openFolder: function (folder) {
	                                return __awaiter(this, void 0, void 0, function () {
	                                    var elem, children, _a, _b;
	                                    return __generator(this, function (_c) {
	                                        switch (_c.label) {
	                                            case 0:
	                                                if (!folder._id) {
	                                                    folder._id = null;
	                                                }
	                                                elem = $scope.folders.findTree(this.trees, folder._id);
	                                                if (!elem) return [3 /*break*/, 6];
	                                                children = elem.children;
	                                                if (!(children.length > 0 && !children[0]._id)) return [3 /*break*/, 2];
	                                                return [4 /*yield*/, $scope.IsShare(folder._id)];
	                                            case 1:
	                                                _c.sent();
	                                                $scope.selectedMindmapTabs = [];
	                                                $scope.selectedFolderTabs = [];
	                                                elem.children = $scope.folders.mapToChildrenTrees();
	                                                //setFakeFolder is use for the folder never open before.
	                                                $scope.folders.setFakeFolder(elem.children);
	                                                elem.children.forEach(function (unelem) {
	                                                    $scope.openedFolderIds = $scope.openedFolderIds.filter(function (openFolderId) { return openFolderId != unelem._id; });
	                                                });
	                                                return [3 /*break*/, 5];
	                                            case 2:
	                                                _b = (_a = $scope.mindmapsItem).setMindmaps;
	                                                return [4 /*yield*/, folder_service_1.folderService.getFolderChildren(folder._id, $scope.isShareMindmap, $scope.isMyMindmap)];
	                                            case 3:
	                                                _b.apply(_a, [_c.sent()]);
	                                                $scope.folders.all = $scope.folders.mapFromChildrenTree(elem.children);
	                                                return [4 /*yield*/, $scope.IsShare(folder._id)];
	                                            case 4:
	                                                _c.sent();
	                                                $scope.selectedMindmapTabs = [];
	                                                $scope.selectedFolderTabs = [];
	                                                _c.label = 5;
	                                            case 5:
	                                                $scope.openOrCloseFolder(folder);
	                                                $scope.selectedFoldersId = folder._id;
	                                                _c.label = 6;
	                                            case 6:
	                                                $scope.$apply();
	                                                return [2 /*return*/];
	                                        }
	                                    });
	                                });
	                            }
	                        };
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.displayTreeMoveFolder = function (idFolderSelect) {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    $scope.openedFolderIdsMove = [];
	                    $scope.selectedFoldersIdMove = null;
	                    $scope.setFolderRootForMove();
	                    $scope.foldersRootMove.trees = $scope.foldersRootMove.mapToChildrenTrees();
	                    $scope.foldersRootMove.setFakeFolder($scope.foldersRootMove.trees);
	                    $scope.folderTreeDirective = {
	                        cssTree: "folders-tree",
	                        get trees() {
	                            return $scope.foldersRootMove.trees;
	                        },
	                        isDisabled: function (folder) {
	                            return false;
	                        },
	                        isOpenedFolder: function (folder) {
	                            if (!folder._id) {
	                                folder._id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                $scope.folderTreeDirective.openFolder(folder);
	                            }
	                            return $scope.openedFolderIdsMove.contains(folder._id);
	                        },
	                        isSelectedFolder: function (folder) {
	                            if (!folder._id) {
	                                folder._id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                            }
	                            return $scope.selectedFoldersIdMove == folder._id;
	                        },
	                        openFolder: function (folder) {
	                            return __awaiter(this, void 0, void 0, function () {
	                                var elemMove, children, _a, _b, _c, _d;
	                                return __generator(this, function (_e) {
	                                    switch (_e.label) {
	                                        case 0:
	                                            if (!folder._id) {
	                                                folder._id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                            }
	                                            elemMove = $scope.foldersRootMove.findTree(this.trees, folder._id);
	                                            if (!elemMove) return [3 /*break*/, 5];
	                                            children = elemMove.children;
	                                            if (!(children.length > 0 && !children[0]._id)) return [3 /*break*/, 2];
	                                            _b = (_a = $scope.foldersRootMove).setFolders;
	                                            return [4 /*yield*/, folder_service_1.folderService.getFolderChildren(folder._id, true, true)];
	                                        case 1:
	                                            _b.apply(_a, [_e.sent()]);
	                                            $scope.foldersRootMove.setFilterFolder(idFolderSelect);
	                                            elemMove.children = $scope.foldersRootMove.mapToChildrenTrees();
	                                            $scope.foldersRootMove.setFakeFolder(elemMove.children);
	                                            return [3 /*break*/, 4];
	                                        case 2:
	                                            $scope.foldersRootMove.all = $scope.foldersRootMove.mapFromChildrenTree(elemMove.children);
	                                            _d = (_c = $scope.foldersRootMove).setFolders;
	                                            return [4 /*yield*/, folder_service_1.folderService.getFolderChildren(folder._id, true, true)];
	                                        case 3:
	                                            _d.apply(_c, [_e.sent()]);
	                                            $scope.foldersRootMove.setFilterFolder(idFolderSelect);
	                                            _e.label = 4;
	                                        case 4:
	                                            $scope.openOrCloseFolderMove(folder);
	                                            $scope.selectedFoldersIdMove = folder._id;
	                                            _e.label = 5;
	                                        case 5:
	                                            $scope.$apply();
	                                            return [2 /*return*/];
	                                    }
	                                });
	                            });
	                        }
	                    };
	                    return [2 /*return*/];
	                });
	            });
	        };
	        $scope.moveFolder = function (id, name) {
	            return __awaiter(this, void 0, void 0, function () {
	                var folder;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            if ($scope.selectedFoldersIdMove == folderItem_1.FOLDER_ITEM.ID_NULL || !$scope.selectedFoldersIdMove) {
	                                folder = new model_2.Folder(name, null);
	                            }
	                            else {
	                                folder = new model_2.Folder(name, $scope.selectedFoldersIdMove);
	                            }
	                            return [4 /*yield*/, $scope.updateFolder(id, folder)];
	                        case 1:
	                            _a.sent();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        $scope.updateFolderName = function (id, unFolder) { return __awaiter(void 0, void 0, void 0, function () {
	            var e_1;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        _a.trys.push([0, 3, , 4]);
	                        return [4 /*yield*/, folder_service_1.folderService.updateFolder(id, unFolder)];
	                    case 1:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.folder.update.done'));
	                        return [4 /*yield*/, $scope.openTreeAndViewFolder()];
	                    case 2:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 4];
	                    case 3:
	                        e_1 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate('mindmap.folder.update.fail'));
	                        throw (e_1);
	                    case 4:
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.moveMindmaps = function (mindmaps) {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    mindmaps.forEach(function (mindmap) {
	                        $scope.moveMindmap(mindmap._id, mindmap.name);
	                    });
	                    return [2 /*return*/];
	                });
	            });
	        };
	        $scope.moveMindmap = function (id, name) {
	            return __awaiter(this, void 0, void 0, function () {
	                var mindmap, userId, folder_parent_id, folder_parent, userId, folder_parent_id, folder_parent;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            if ($scope.selectedFoldersIdMove == folderItem_1.FOLDER_ITEM.ID_NULL || !$scope.selectedFoldersIdMove) {
	                                userId = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                folder_parent_id = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                folder_parent = { userId: userId, folder_parent_id: folder_parent_id };
	                                mindmap = new model_1.MindmapFolder(name, folder_parent);
	                            }
	                            else {
	                                userId = folderItem_1.FOLDER_ITEM.ID_NULL;
	                                folder_parent_id = $scope.selectedFoldersIdMove;
	                                folder_parent = { userId: userId, folder_parent_id: folder_parent_id };
	                                mindmap = new model_1.MindmapFolder(name, folder_parent);
	                            }
	                            return [4 /*yield*/, $scope.changeMindmapFolder(id, mindmap)];
	                        case 1:
	                            _a.sent();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        $scope.openFolderByView = function (folder) {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0: return [4 /*yield*/, $scope.folderTreeRoot.openFolder(folder)];
	                        case 1:
	                            _a.sent();
	                            $scope.selectedMindmapTabs = [];
	                            $scope.selectedFolderTabs = [];
	                            $scope.$apply();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        $scope.openOrCloseFolder = function (folder) {
	            if ($scope.folderTreeRoot.isOpenedFolder(folder)) {
	                if ($scope.folderTreeRoot.isSelectedFolder(folder))
	                    $scope.openedFolderIds = $scope.openedFolderIds.filter(function (openFolderId) { return openFolderId != folder._id; });
	            }
	            else {
	                $scope.openedFolderIds.push(folder._id);
	            }
	        };
	        $scope.openOrCloseFolderMove = function (folder) {
	            if ($scope.folderTreeDirective.isOpenedFolder(folder)) {
	                if ($scope.folderTreeDirective.isSelectedFolder(folder))
	                    $scope.openedFolderIdsMove = $scope.openedFolderIdsMove.filter(function (openFolderId) { return openFolderId != folder._id; });
	            }
	            else {
	                $scope.openedFolderIdsMove.push(folder._id);
	            }
	        };
	        $scope.openFolderById = function (id, isShare, isMine) {
	            return __awaiter(this, void 0, void 0, function () {
	                var folderItems, _a, _b;
	                return __generator(this, function (_c) {
	                    switch (_c.label) {
	                        case 0:
	                            entcore_1.template.open('mindmap', 'mindmap-list');
	                            $scope.selectedMindmapTabs = [];
	                            $scope.selectedFolderTabs = [];
	                            _b = (_a = Promise).all;
	                            return [4 /*yield*/, folder_service_1.folderService.getFolderChildren(id, isShare, isMine)];
	                        case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
	                        case 2:
	                            folderItems = _c.sent();
	                            $scope.mindmapsItem.setMindmaps(folderItems);
	                            $scope.folders.setFolders(folderItems);
	                            $scope.$apply();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        $scope.IsShare = function (id) { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (!(!$scope.isMyMindmap && !$scope.isShareMindmap)) return [3 /*break*/, 2];
	                        return [4 /*yield*/, $scope.openFolderById(id, true, true)];
	                    case 1:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 4];
	                    case 2: return [4 /*yield*/, $scope.openFolderById(id, $scope.isShareMindmap, $scope.isMyMindmap)];
	                    case 3:
	                        _a.sent();
	                        $scope.$apply();
	                        _a.label = 4;
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.reloadView = function () { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        $scope.openedFolderIds = [];
	                        $scope.selectedFoldersId = folderItem_1.FOLDER_ITEM.ID_NULL;
	                        return [4 /*yield*/, $scope.IsShare(folderItem_1.FOLDER_ITEM.ID_NULL)];
	                    case 1:
	                        _a.sent();
	                        $scope.initFolder();
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.updateFolder = function (id, unFolder) { return __awaiter(void 0, void 0, void 0, function () {
	            var e_2;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        _a.trys.push([0, 3, , 4]);
	                        return [4 /*yield*/, folder_service_1.folderService.updateFolder(id, unFolder)];
	                    case 1:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.folder.update.done'));
	                        $scope.selectedMindmapTabs = [];
	                        $scope.selectedFolderTabs = [];
	                        return [4 /*yield*/, $scope.reloadView()];
	                    case 2:
	                        _a.sent();
	                        return [3 /*break*/, 4];
	                    case 3:
	                        e_2 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate('mindmap.folder.update.fail'));
	                        throw (e_2);
	                    case 4:
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.updateMindmapFromForm = function (id, name, folder_parent_id, description, thumbnail) { return __awaiter(void 0, void 0, void 0, function () {
	            var mindmapUpdate;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        $scope.forceToClose = true;
	                        mindmapUpdate = new model_1.MindmapFolder(name, folder_parent_id, description, thumbnail);
	                        return [4 /*yield*/, $scope.updateMindmap(id, mindmapUpdate)];
	                    case 1:
	                        _a.sent();
	                        $scope.cancelMindmapEdit();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.updateMindmap = function (id, mindmap) { return __awaiter(void 0, void 0, void 0, function () {
	            var e_3;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        _a.trys.push([0, 3, , 4]);
	                        return [4 /*yield*/, mindmap_service_1.mindmapService.updateMindmap(id, mindmap)];
	                    case 1:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.update.done'));
	                        entcore_1.template.open('mindmap', 'mindmap-list');
	                        return [4 /*yield*/, $scope.IsShare($scope.selectedFoldersId)];
	                    case 2:
	                        _a.sent();
	                        $scope.selectedMindmapTabs = [];
	                        $scope.selectedFolderTabs = [];
	                        return [3 /*break*/, 4];
	                    case 3:
	                        e_3 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate("mindmap.update.fail"));
	                        throw (e_3);
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.changeMindmapFolder = function (id, mindmap) { return __awaiter(void 0, void 0, void 0, function () {
	            var e_4;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        _a.trys.push([0, 3, , 4]);
	                        return [4 /*yield*/, mindmap_service_1.mindmapService.changeMindmapFolder(id, mindmap)];
	                    case 1:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.update.done'));
	                        entcore_1.template.open('mindmap', 'mindmap-list');
	                        return [4 /*yield*/, $scope.IsShare($scope.selectedFoldersId)];
	                    case 2:
	                        _a.sent();
	                        return [3 /*break*/, 4];
	                    case 3:
	                        e_4 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate("mindmap.update.fail"));
	                        throw (e_4);
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.createFolder = function (name) { return __awaiter(void 0, void 0, void 0, function () {
	            var folder, e_5;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if ($scope.selectedFoldersId == folderItem_1.FOLDER_ITEM.ID_NULL) {
	                            folder = new model_2.Folder(name);
	                        }
	                        else {
	                            folder = new model_2.Folder(name, $scope.selectedFoldersId);
	                        }
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, 4, , 5]);
	                        return [4 /*yield*/, folder_service_1.folderService.createFolder(folder)];
	                    case 2:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.folder.create.done'));
	                        $scope.display.createFolder = false;
	                        return [4 /*yield*/, $scope.openTreeAndViewFolder()];
	                    case 3:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 5];
	                    case 4:
	                        e_5 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate('mindmap.folder.create.fail'));
	                        throw (e_5);
	                    case 5:
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.openTreeAndViewFolder = function () { return __awaiter(void 0, void 0, void 0, function () {
	            var elem, _a, _b;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0:
	                        $scope.selectedMindmapTabs = [];
	                        $scope.selectedFolderTabs = [];
	                        if (!($scope.selectedFoldersId == folderItem_1.FOLDER_ITEM.ID_NULL)) return [3 /*break*/, 1];
	                        $scope.reloadView();
	                        return [3 /*break*/, 3];
	                    case 1:
	                        elem = $scope.folders.findTree($scope.folderTreeRoot.trees, $scope.selectedFoldersId);
	                        elem.children.forEach(function (unelem) {
	                            $scope.openedFolderIds = $scope.openedFolderIds.filter(function (openFolderId) { return openFolderId != unelem._id; });
	                        });
	                        _b = (_a = $scope.folders).setFolders;
	                        return [4 /*yield*/, folder_service_1.folderService.getFolderChildren($scope.selectedFoldersId, $scope.isShareMindmap, $scope.isMyMindmap)];
	                    case 2:
	                        _b.apply(_a, [_c.sent()]);
	                        elem.children = $scope.folders.mapToChildrenTrees();
	                        $scope.folders.setFakeFolder(elem.children);
	                        $scope.openedFolderIds = $scope.openedFolderIds.filter(function (openFolderId) { return openFolderId != $scope.selectedFoldersId; });
	                        _c.label = 3;
	                    case 3: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.deleteFolder = function (folders) { return __awaiter(void 0, void 0, void 0, function () {
	            var ids, name, folderBody, e_6;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        ids = folders.map(function (folder) { return folder._id; });
	                        name = "name";
	                        folderBody = { name: name, ids: ids };
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, 4, , 5]);
	                        return [4 /*yield*/, folder_service_1.folderService.deleteFolder(folderBody)];
	                    case 2:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.folder.delete.done'));
	                        return [4 /*yield*/, $scope.openTreeAndViewFolder()];
	                    case 3:
	                        _a.sent();
	                        $scope.$apply();
	                        return [3 /*break*/, 5];
	                    case 4:
	                        e_6 = _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.folder.delete.fail'));
	                        throw (e_6);
	                    case 5:
	                        $scope.$apply();
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.deleteMindmap = function (id) { return __awaiter(void 0, void 0, void 0, function () {
	            var e_7;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        _a.trys.push([0, 3, , 4]);
	                        return [4 /*yield*/, mindmap_service_1.mindmapService.deleteMindmap(id)];
	                    case 1:
	                        _a.sent();
	                        entcore_1.notify.success(entcore_1.idiom.translate('mindmap.delete.done'));
	                        entcore_1.template.open('mindmap', 'mindmap-list');
	                        return [4 /*yield*/, $scope.IsShare($scope.selectedFoldersId)];
	                    case 2:
	                        _a.sent();
	                        $scope.selectedMindmapTabs = [];
	                        $scope.selectedFolderTabs = [];
	                        return [3 /*break*/, 4];
	                    case 3:
	                        e_7 = _a.sent();
	                        entcore_1.notify.error(entcore_1.idiom.translate('mindmap.delete.fail'));
	                        throw (e_7);
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        $scope.isLoading = function (optionalVal) {
	            if (typeof optionalVal === "undefined")
	                return _isLoading;
	            if (optionalVal != _isLoading) {
	                _isLoading = optionalVal;
	                $scope.$apply();
	            }
	        };
	        $scope.showEmptyScreen = function () {
	            return !$scope.isLoading() && $scope.mindmaps && $scope.mindmaps.all && $scope.mindmaps.all.length === 0;
	        };
	        // By default open the mindmap list
	        entcore_1.template.open('mindmap', 'mindmap-list');
	        entcore_1.template.open('folder', 'folder-list');
	        entcore_1.template.open('side-panel', 'mindmap-side-panel');
	        /**
	         * Allows to create a new mindmap and open the "mindmap-edit.html" template into
	         * the "main" div.
	         */
	        $scope.newMindmap = function () {
	            $scope.isMyMindmap = true;
	            $scope.isShareMindmap = true;
	            $scope.mindmap = new model_1.Mindmap();
	            $scope.action = 'mindmap-create';
	            entcore_1.template.open('mindmap', 'mindmap-create');
	        };
	        $scope.goto = function () {
	            window.location.hash = '/';
	        };
	        $scope.createMindmap = function (name, description, thumbnail) {
	            return __awaiter(this, void 0, void 0, function () {
	                var userId, folder_parent_id, mindmap, folder_parent, e_8;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            userId = model.me.userId;
	                            folder_parent_id = $scope.selectedFoldersId;
	                            $scope.forceToClose = true;
	                            if ($scope.selectedFoldersId == folderItem_1.FOLDER_ITEM.ID_NULL) {
	                                folder_parent_id = null;
	                            }
	                            folder_parent = [{ userId: userId, folder_parent_id: folder_parent_id }];
	                            mindmap = new model_1.MindmapFolder(name, folder_parent, description, thumbnail);
	                            _a.label = 1;
	                        case 1:
	                            _a.trys.push([1, 4, , 5]);
	                            return [4 /*yield*/, mindmap_service_1.mindmapService.createMindmap(mindmap)];
	                        case 2:
	                            _a.sent();
	                            $scope.cancelMindmapEdit();
	                            entcore_1.notify.success(entcore_1.idiom.translate("mindmap.create.done"));
	                            entcore_1.template.open('mindmap', 'mindmap-list');
	                            return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, true, true)];
	                        case 3:
	                            _a.sent();
	                            $scope.selectedMindmapTabs = [];
	                            $scope.selectedFolderTabs = [];
	                            $scope.isMyMindmap = true;
	                            $scope.isShareMindmap = true;
	                            return [3 /*break*/, 5];
	                        case 4:
	                            e_8 = _a.sent();
	                            entcore_1.notify.error(entcore_1.idiom.translate('mindmap.create.fail'));
	                            throw (e_8);
	                        case 5: return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        $scope.duplicateMindmap = function (mindmap) {
	            return __awaiter(this, void 0, void 0, function () {
	                var id, folderParentId, e_9;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            id = mindmap._id;
	                            folderParentId = $scope.selectedFoldersId;
	                            _a.label = 1;
	                        case 1:
	                            _a.trys.push([1, 4, , 5]);
	                            return [4 /*yield*/, mindmap_service_1.mindmapService.duplicateMindmap(id, folderParentId)];
	                        case 2:
	                            _a.sent();
	                            entcore_1.notify.success(entcore_1.idiom.translate("mindmap.duplicate.done"));
	                            entcore_1.template.open('mindmap', 'mindmap-list');
	                            return [4 /*yield*/, $scope.openFolderById($scope.selectedFoldersId, true, true)];
	                        case 3:
	                            _a.sent();
	                            $scope.selectedMindmapTabs = [];
	                            $scope.selectedFolderTabs = [];
	                            $scope.isMyMindmap = true;
	                            $scope.isShareMindmap = true;
	                            return [3 /*break*/, 5];
	                        case 4:
	                            e_9 = _a.sent();
	                            entcore_1.notify.error(entcore_1.idiom.translate('mindmap.duplicate.fail'));
	                            throw (e_9);
	                        case 5: return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        /**
	         * Allows to save the current edited mindmap in the scope. After saving the
	         * current mindmap this method closes the edit view too.
	         */
	        $scope.saveMindmap = function () {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            $scope.forceToClose = true;
	                            $scope.master = entcore_1.angular.copy($scope.mindmap);
	                            return [4 /*yield*/, $scope.master.save()];
	                        case 1:
	                            _a.sent();
	                            $scope.cancelMindmapEdit();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        /**
	         * Save the current mindmap in database
	         */
	        $scope.saveMap = function () {
	            return __awaiter(this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            $scope.master = entcore_1.angular.copy($scope.mindmap);
	                            return [4 /*yield*/, $scope.master.save()];
	                        case 1:
	                            _a.sent();
	                            return [4 /*yield*/, $scope.master.save()];
	                        case 2:
	                            _a.sent();
	                            return [2 /*return*/];
	                    }
	                });
	            });
	        };
	        /**
	         * Retrieve the mindmap thumbnail if there is one
	         */
	        $scope.getMindmapThumbnail = function (mindmap) {
	        };
	        /**
	         * Open a mindmap in the wisemapping editor
	         */
	        $scope.openMindmap = function (mindmap) {
	            $scope.selectedMindmapTabs = [];
	            $scope.selectedFolderTabs = [];
	            delete $scope.mindmap;
	            delete $scope.selectedMindmap;
	            $scope.notFound = false;
	            entcore_1.template.close('main');
	            entcore_1.template.close('mindmap');
	            $timeout(function () {
	                $scope.editorId = $scope.editorId + 1;
	                $scope.mindmap = $scope.selectedMindmap = mindmap;
	                mapAdapter.adapt($scope);
	                $scope.action = 'mindmap-open';
	                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
	                entcore_1.template.open('mindmap', 'mindmap-edit');
	                window.location.hash = '/view/' + $scope.mindmap._id;
	            });
	        };
	        $scope.printPngMindmap = function (mindmap, redirect) {
	            var _this = this;
	            if (redirect === void 0) { redirect = true; }
	            if (redirect) {
	                window.open('/mindmap#/print/png/' + mindmap._id);
	                return;
	            }
	            delete $scope.mindmap;
	            delete $scope.selectedMindmap;
	            $scope.notFound = false;
	            $scope.printMode = true;
	            $scope.printModePng = true;
	            entcore_1.template.close('main');
	            entcore_1.template.close('mindmap');
	            entcore_1.template.close('mindmap-list');
	            // Need to wait before opening a mindmap
	            $timeout(function () {
	                $scope.editorId = $scope.editorId + 1;
	                $scope.mindmap = $scope.selectedMindmap = mindmap;
	                mapAdapter.adapt($scope);
	                $scope.action = 'mindmap-open';
	                $("body").attr("style", "");
	                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
	                entcore_1.template.open('mindmap', 'mindmap-print-png');
	            });
	            this.svgLoaded = function () { return __awaiter(_this, void 0, void 0, function () {
	                var svg, response, imageData;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            svg = $('#workspaceContainer');
	                            return [4 /*yield*/, axios_1.default.post("/mindmap/export/png", {
	                                    svgXml: svg[0].innerHTML
	                                })];
	                        case 1:
	                            response = _a.sent();
	                            $('#mindmap-editor')[0].remove();
	                            imageData = response.data.image;
	                            $("img#printpng").attr("src", "data:image/png;base64," + imageData);
	                            $("body").attr("style", "");
	                            setTimeout(function () { return window.print(); }, 1000);
	                            return [2 /*return*/];
	                    }
	                });
	            }); };
	        };
	        $scope.printPngMindmaps = function (mindmaps, redirect) {
	            if (redirect === void 0) { redirect = true; }
	            mindmaps.forEach(function (mindmap) {
	                $scope.printPngMindmap(mindmap, redirect);
	            });
	        };
	        $scope.printMindmap = function (mindmap, redirect) {
	            if (redirect === void 0) { redirect = true; }
	            if (redirect) {
	                window.open('/mindmap/print/mindmap#/print/' + mindmap._id);
	                return;
	            }
	            delete $scope.mindmap;
	            delete $scope.selectedMindmap;
	            $scope.notFound = false;
	            $scope.printMode = true;
	            entcore_1.template.close('main');
	            entcore_1.template.close('mindmap');
	            entcore_1.template.close('mindmap-list');
	            // Need to wait before opening a mindmap
	            $timeout(function () {
	                $scope.editorId = $scope.editorId + 1;
	                $scope.mindmap = $scope.selectedMindmap = mindmap;
	                mapAdapter.adapt($scope);
	                $scope.action = 'mindmap-open';
	                //$scope.mindmap.readOnly = model.me.hasRight(mindmap, Behaviours.applicationsBehaviours.mindmap.rights.resource.contrib);
	                $scope.mindmap.readOnly = (!$scope.mindmap.myRights.contrib);
	                entcore_1.template.open('mindmap', 'mindmap-print');
	            });
	            this.svgLoaded = function () {
	                var svg = $('#workspaceContainer');
	                svg.find("svg").removeAttr("preserveAspectRatio").attr("preserveAspectRatio", "true");
	                $scope.svg = $sce.trustAsHtml(svg[0].innerHTML);
	                $('#mindmap-editor')[0].remove();
	                setTimeout(function () {
	                    window.print();
	                }, 3000);
	            };
	        };
	        /**
	         * Display date in French format
	         */
	        $scope.formatDate = function (dateObject) {
	            return (0, entcore_1.moment)(dateObject.$date).lang(currentLanguage).calendar();
	        };
	        /**
	         * Display export options
	         */
	        $scope.exportMindmap = function () {
	            $scope.display.showExportPanel = true;
	            $scope.exportType = "png";
	        };
	        /**
	         * Convert base64 data to Blob
	         */
	        function b64toBlob(b64Data, contentType, sliceSize) {
	            contentType = contentType || '';
	            sliceSize = sliceSize || 512;
	            // Fix for IE and Safari : remove whitespace characters (such as space, tab, carriage return, new line)
	            b64Data = b64Data.replace(/\s/g, '');
	            var byteCharacters = atob(b64Data);
	            var byteArrays = [];
	            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	                var slice = byteCharacters.slice(offset, offset + sliceSize);
	                var byteNumbers = new Array(slice.length);
	                for (var i = 0; i < slice.length; i++) {
	                    byteNumbers[i] = slice.charCodeAt(i);
	                }
	                var byteArray = new Uint8Array(byteNumbers);
	                byteArrays.push(byteArray);
	            }
	            var blob = new Blob(byteArrays, { type: contentType });
	            return blob;
	        }
	        /**
	         * Export a mindmap into png or svg
	         */
	        $scope.exportMindmapSubmit = function (exportType) {
	            $scope.exportInProgress = true;
	            axios_1.default.post('/mindmap/export/' + exportType, { svgXml: $('#workspaceContainer')[0].innerHTML })
	                .then(function (data) {
	                var filename = $scope.mindmap.name + "." + exportType;
	                var imageData = data.data.image;
	                if ("svg" !== exportType) {
	                    saveAs(b64toBlob(imageData, "image/" + exportType), filename);
	                }
	                else {
	                    saveAs(new Blob([imageData], { type: "image/svg+xml;charset=utf-8" }), filename);
	                }
	                $scope.$apply("exportInProgress = false");
	            });
	            $scope.display.showExportPanel = false;
	        };
	        /**
	         * Checks if a user is a manager
	         */
	        $scope.canManageMindmap = function (mindmap) {
	            return (!!mindmap.myRights.manage);
	        };
	        /**
	         * Check if the user can export either in SVG either in PNG format
	         **/
	        $scope.canExport = function () {
	            var workflowRights = entcore_1.Behaviours.applicationsBehaviours.mindmap.rights.workflow;
	            return (model.me.hasWorkflow(workflowRights["exportpng"]) || model.me.hasWorkflow(workflowRights["exportsvg"]));
	        };
	        /**
	         * Close the mindmap editor and open the mindmap list page
	         */
	        $scope.cancelMindmapEdit = function () {
	            delete $scope.mindmap;
	            delete $scope.selectedMindmap;
	            entcore_1.template.close('main');
	            $scope.action = 'mindmap-list';
	            entcore_1.template.open('mindmap', 'mindmap-list');
	            $scope.forceToClose = false;
	            $scope.selectedMindmapTabs = [];
	            $scope.selectedFolderTabs = [];
	            $scope.$apply();
	        };
	        /**
	         * List of mindmap objects
	         */
	        $scope.openMainPage = function () {
	            delete $scope.mindmap;
	            delete $scope.selectedMindmap;
	            $scope.action = 'mindmap-list';
	            $scope.action = 'folder-list';
	            entcore_1.template.open('mindmap', 'mindmap-list');
	            window.location.hash = "";
	        };
	        /**
	         * Allows to set "showButtons" to false for all mindmaps except the given one.
	         * @param mindmap the current selected mindmap.
	         * @param event triggered event
	         */
	        $scope.hideAlmostAllButtons = function (mindmap, event) {
	            event.stopPropagation();
	            if (mindmap.showButtons) {
	                $scope.mindmap = mindmap;
	            }
	            else {
	                delete $scope.mindmap;
	            }
	            $scope.mindmaps.forEach(function (m) {
	                if (!mindmap || m._id !== mindmap._id) {
	                    m.showButtons = false;
	                }
	            });
	        };
	        /**
	         * Allows to set "showButtons" to false for all mindmaps except the given one.
	         * @param mindmap the current selected mindmap.
	         * @param event triggered event
	         */
	        $scope.hideAllButtons = function (mindmap, event) {
	            event.stopPropagation();
	            if (mindmap.showButtons) {
	                $scope.mindmap = mindmap;
	            }
	            else {
	                delete $scope.mindmap;
	            }
	            $scope.mindmaps.forEach(function (m) {
	                if (!mindmap || m._id !== mindmap._id) {
	                    m.showButtons = false;
	                }
	            });
	        };
	        /**
	         * Edit the properties (name, description) of a mindmap
	         */
	        $scope.editMindmap = function (mindmap, event) {
	            event.stopPropagation();
	            mindmap.showButtons = false;
	            $scope.mindmapCopy = mindmap;
	            $scope.mindmap = entcore_1.angular.copy(mindmap);
	            entcore_1.template.open('mindmap', 'mindmap-update');
	        };
	        /**
	         * Allows to put the current mindmap in the scope and set "confirmDeleteMindmap"
	         * variable to "true".
	         * @param mindmap the mindmap to delete.
	         * @param event an event.
	         */
	        $scope.confirmRemoveMindmap = function (mindmap, event) {
	            event.stopPropagation();
	            $scope.mindmap = mindmap;
	            $scope.display.confirmDeleteMindmap = true;
	        };
	        /**
	         * Allows to cancel the current delete process.
	         */
	        $scope.cancelRemoveMindmap = function () {
	            delete $scope.display.confirmDeleteMindmap;
	        };
	        /**
	         * Allows to remove the current mindmap in the scope.
	         */
	        $scope.removeMindmap = function () { return __awaiter(void 0, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                entcore_1._.map($scope.selectedMindmapTabs, function (mindmap) {
	                    return __awaiter(this, void 0, void 0, function () {
	                        return __generator(this, function (_a) {
	                            switch (_a.label) {
	                                case 0: return [4 /*yield*/, mindmap.delete()];
	                                case 1:
	                                    _a.sent();
	                                    entcore_1.template.open('mindmap', 'mindmap-list');
	                                    return [4 /*yield*/, $scope.IsShare($scope.selectedFoldersId)];
	                                case 2:
	                                    _a.sent();
	                                    $scope.selectedMindmapTabs = [];
	                                    $scope.selectedFolderTabs = [];
	                                    $scope.$apply();
	                                    return [2 /*return*/];
	                            }
	                        });
	                    });
	                });
	                $scope.display.confirmDeleteMindmap = false;
	                return [2 /*return*/];
	            });
	        }); };
	        /**
	         * Allows to open the "share" panel by setting the
	         * "$scope.display.showPanel" variable to "true".
	         * @param mindmap the mindmap to share.
	         * @param event the current event.
	         */
	        $scope.shareMindmap = function (mindmap, event) {
	            $scope.mindmap = mindmap;
	            $scope.display.showPanel = true;
	            event.stopPropagation();
	        };
	        /**
	         * Verify if the selected mindmap is owned
	         * by the user logged in
	         * @param mindmap the selected mindmap
	         */
	        $scope.isMyMap = function (mindmap) {
	            return mindmap.owner.userId === model.me.userId;
	        };
	        /**
	         * Mindmap routes definition
	         */
	        route({
	            /**
	             * Retrieve a mindmap from its database id and open it in a wisemapping editor
	             */
	            viewMindmap: function (params) { return __awaiter(void 0, void 0, void 0, function () {
	                var m, mindMapWithRight, e_10;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            if (!$scope.mindmap) return [3 /*break*/, 1];
	                            $scope.notFound = false;
	                            $scope.openMindmap($scope.mindmap);
	                            return [3 /*break*/, 4];
	                        case 1:
	                            _a.trys.push([1, 3, , 4]);
	                            return [4 /*yield*/, mindmap_service_1.mindmapService.getMindmap(params.mindmapId)];
	                        case 2:
	                            m = _a.sent();
	                            mindMapWithRight = entcore_1.Behaviours.applicationsBehaviours.mindmap.resource(m);
	                            if (mindMapWithRight) {
	                                $scope.notFound = false;
	                                $scope.openMindmap(mindMapWithRight);
	                            }
	                            else {
	                                $scope.notFound = true;
	                                $scope.openMainPage();
	                            }
	                            return [3 /*break*/, 4];
	                        case 3:
	                            e_10 = _a.sent();
	                            $scope.notFound = true;
	                            $scope.openMainPage();
	                            return [3 /*break*/, 4];
	                        case 4: return [2 /*return*/];
	                    }
	                });
	            }); },
	            /**
	             * Retrieve a mindmap from its database id and open it in a wisemapping editor
	             */
	            printMindmap: function (params) { return __awaiter(void 0, void 0, void 0, function () {
	                var m;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0: return [4 /*yield*/, mindmap_service_1.mindmapService.getMindmap(params.mindmapId)];
	                        case 1:
	                            m = _a.sent();
	                            if (m) {
	                                $scope.notFound = "false";
	                                $scope.printMindmap(m, false);
	                            }
	                            else {
	                                $scope.notFound = "true";
	                                $scope.openMainPage();
	                            }
	                            return [2 /*return*/];
	                    }
	                });
	            }); },
	            printPngMindmap: function (params) { return __awaiter(void 0, void 0, void 0, function () {
	                var m;
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0: return [4 /*yield*/, mindmap_service_1.mindmapService.getMindmap(params.mindmapId)];
	                        case 1:
	                            m = _a.sent();
	                            if (m) {
	                                $scope.notFound = "false";
	                                $scope.printPngMindmap(m, false);
	                            }
	                            else {
	                                $scope.notFound = "true";
	                                $scope.openMainPage();
	                            }
	                            return [2 /*return*/];
	                    }
	                });
	            }); },
	            /**
	             * Display the mindmap tree
	             **/
	            main: function () { return __awaiter(void 0, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            delete $scope.mindmap;
	                            delete $scope.selectedMindmap;
	                            entcore_1.template.close('main');
	                            $scope.selectedMindmapTabs = [];
	                            $scope.selectedFolderTabs = [];
	                            $scope.isMyMindmap = true;
	                            $scope.isShareMindmap = true;
	                            $scope.openedFolderIds = [];
	                            $scope.selectedFoldersId = folderItem_1.FOLDER_ITEM.ID_NULL;
	                            return [4 /*yield*/, $scope.initFolder()];
	                        case 1:
	                            _a.sent();
	                            $scope.action = 'mindmap-list';
	                            entcore_1.template.open('mindmap', 'mindmap-list');
	                            $scope.$apply();
	                            return [2 /*return*/];
	                    }
	                });
	            }); },
	        });
	    }]);


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FolderService = exports.folderService = void 0;
	var axios_1 = __webpack_require__(44);
	var entcore_toolkit_1 = __webpack_require__(4);
	var entcore_1 = __webpack_require__(1);
	var FolderItem_1 = __webpack_require__(71);
	exports.folderService = {
	    getFolderChildren: function (folderId, isShare, isMine) { return __awaiter(void 0, void 0, void 0, function () {
	        var data, err_1;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    _a.trys.push([0, 2, , 3]);
	                    return [4 /*yield*/, axios_1.default.get("/mindmap/folders/".concat(folderId, "/children/share/").concat(isShare, "/mine/").concat(isMine))];
	                case 1:
	                    data = (_a.sent()).data;
	                    return [2 /*return*/, entcore_toolkit_1.Mix.castArrayAs(FolderItem_1.FolderItem, data)];
	                case 2:
	                    err_1 = _a.sent();
	                    throw err_1;
	                case 3: return [2 /*return*/];
	            }
	        });
	    }); },
	    createFolder: function (folderBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.post("/mindmap/folder", folderBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    updateFolder: function (id, folderBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.put("/mindmap/folders/".concat(id), folderBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    deleteFolder: function (folderBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.put("/mindmap/folders/delete", folderBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	};
	exports.FolderService = entcore_1.ng.service('FolderService', function () { return exports.folderService; });


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MindmapService = exports.mindmapService = void 0;
	var model_1 = __webpack_require__(2);
	var axios_1 = __webpack_require__(44);
	var entcore_toolkit_1 = __webpack_require__(4);
	var entcore_1 = __webpack_require__(1);
	exports.mindmapService = {
	    getMindmapChildren: function (folderID) { return __awaiter(void 0, void 0, void 0, function () {
	        var data, err_1;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    _a.trys.push([0, 2, , 3]);
	                    return [4 /*yield*/, axios_1.default.get("/mindmap/".concat(folderID, "/children"))];
	                case 1:
	                    data = (_a.sent()).data;
	                    return [2 /*return*/, entcore_toolkit_1.Mix.castArrayAs(model_1.Mindmap, data)];
	                case 2:
	                    err_1 = _a.sent();
	                    throw err_1;
	                case 3: return [2 /*return*/];
	            }
	        });
	    }); },
	    updateMindmap: function (id, mindmapBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.put("/mindmap/".concat(id), mindmapBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    changeMindmapFolder: function (id, mindmapBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.put("/mindmap/move/".concat(id), mindmapBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    deleteMindmap: function (id) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.delete("/mindmap/".concat(id))];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    createMindmap: function (mindmaBody) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, axios_1.default.post("/mindmap", mindmaBody)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    }); },
	    getMindmap: function (id) { return __awaiter(void 0, void 0, void 0, function () {
	        var data, err_2;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    _a.trys.push([0, 2, , 3]);
	                    return [4 /*yield*/, axios_1.default.get("/mindmap/".concat(id))];
	                case 1:
	                    data = (_a.sent()).data;
	                    return [2 /*return*/, entcore_toolkit_1.Mix.castAs(model_1.Mindmap, data)];
	                case 2:
	                    err_2 = _a.sent();
	                    throw err_2;
	                case 3: return [2 /*return*/];
	            }
	        });
	    }); },
	    duplicateMindmap: function (id, folderParentId) { return __awaiter(void 0, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            return [2 /*return*/, axios_1.default.post("/mindmap/".concat(id, "/duplicate?folderTarget=").concat(folderParentId))];
	        });
	    }); }
	};
	exports.MindmapService = entcore_1.ng.service('MindmapService', function () { return exports.mindmapService; });


/***/ }),
/* 111 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FOLDER_ITEM = void 0;
	exports.FOLDER_ITEM = {
	    ID_NULL: "null",
	    ID_ROOT: "null",
	};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (this && this.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(__webpack_require__(113), exports);
	__exportStar(__webpack_require__(114), exports);
	__exportStar(__webpack_require__(116), exports);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mindmapEditorDirective = void 0;
	var entcore_1 = __webpack_require__(1);
	var AUTOSAVE_TIMER = 180000;
	var SELECTOR_JQUERY_BUTTON_SAVE = '#save';
	var MindmapChangeGuard = /** @class */ (function () {
	    function MindmapChangeGuard() {
	        this.reference = 0;
	        this.undoSteps = 0;
	    }
	    MindmapChangeGuard.prototype.reset = function () {
	        this.reference = this.undoSteps;
	    };
	    MindmapChangeGuard.prototype.canNavigate = function () {
	        return this.reference == this.undoSteps;
	    };
	    return MindmapChangeGuard;
	}());
	exports.mindmapEditorDirective = entcore_1.ng.directive('mindmapEditor', ['$timeout', function ($timeout) {
	        return {
	            scope: {
	                mindmap: '=',
	                editorid: '=',
	                svgLoaded: '&?'
	            },
	            restrict: 'E',
	            replace: true,
	            templateUrl: '/mindmap/public/template/directives/mindmap-editor.html',
	            link: function (scope, element, attrs) {
	                var registerInterval = setInterval(function () { return $(SELECTOR_JQUERY_BUTTON_SAVE).click(); }, AUTOSAVE_TIMER);
	                var guard = new MindmapChangeGuard();
	                var guardId = entcore_1.navigationGuardService.registerIndependantGuard(guard);
	                // Destroy the wisemapping properly
	                element.on('$destroy', function () {
	                    entcore_1.navigationGuardService.unregisterIndependantGuard(guardId);
	                    if (designer) {
	                        designer.destroy();
	                    }
	                    $moo(document).removeEvents("mousewheel");
	                    $moo(document).removeEvents("keydown");
	                    mindplot.EventBus.instance = null;
	                    clearInterval(registerInterval);
	                });
	                // Wait for all requirements to be loaded
	                $timeout(function () {
	                    var mindmap;
	                    var mapId = scope.mindmap;
	                    // Mindmap editor options
	                    var options = loadDesignerOptions();
	                    options.container = "mindplot" + scope.editorid;
	                    options.mapId = scope.mindmap.name;
	                    options.readOnly = scope.mindmap.readOnly;
	                    options.locale = currentLanguage;
	                    mindplot.EventBus.instance = new mindplot.EventBus();
	                    var designer = buildDesigner(options);
	                    designer.$events.modelUpdate.push(function (e) {
	                        guard.undoSteps = e.undoSteps;
	                    });
	                    toolbarNotifier = new mindplot.widget.ToolbarNotifier();
	                    $notify = toolbarNotifier.logMessage.bind(toolbarNotifier);
	                    var persistence = mindplot.PersistenceManager.getInstance();
	                    if (mapId.map == undefined) {
	                        mindplot.Messages.BUNDLES[currentLanguage].CENTRAL_TOPIC = mapId.name;
	                        mindmap = mindplot.model.Mindmap.buildEmpty(mapId.name);
	                    }
	                    else {
	                        mindmap = persistence.load(mapId.name, mapId.map);
	                    }
	                    designer.onSaveSuccess = function (e) {
	                        guard.reset();
	                    };
	                    designer.loadMap(mindmap);
	                    scope.svgLoaded();
	                });
	            }
	        };
	    }]);


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.directiveFolderList = void 0;
	var entcore_1 = __webpack_require__(1);
	var roots_1 = __webpack_require__(115);
	var model_1 = __webpack_require__(2);
	var type_1 = __webpack_require__(73);
	exports.directiveFolderList = entcore_1.ng.directive('directiveFolderList', function () {
	    return {
	        templateUrl: "".concat(roots_1.ROOTS.directive, "directive-folder/directive-folder-list.html"),
	        scope: {
	            folders: '=',
	            mindmapsItem: '=',
	            onOpenFolder: '&',
	            onUpdateFolder: '&',
	            onUpdateMindmap: '&',
	            onOpenMindmap: '&',
	            onNewMindmap: '=',
	            id: '=',
	            onChangeMindmapFolder: '&',
	            onMindmapIsSelected: '&',
	            onSelectFolder: '=',
	            onSelectMindmap: '=',
	            onFormatDate: '=',
	        },
	        restrict: 'E',
	        controllerAs: 'vm',
	        bindToController: true,
	        replace: false,
	        controller: function () {
	            var _this = this;
	            var vm = this;
	            vm.$onInit = function () { return __awaiter(_this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    return [2 /*return*/];
	                });
	            }); };
	            vm.$onDestroy = function () { return __awaiter(_this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    return [2 /*return*/];
	                });
	            }); };
	        },
	        link: function ($scope) {
	            var vm = $scope.vm;
	            vm.formatDate = function (dateObject) {
	                return (0, entcore_1.moment)(dateObject.$date).lang(entcore_1.currentLanguage).calendar();
	            };
	            vm.selectFolder = function () {
	                $scope.$eval(vm.onSelectFolder);
	            };
	            vm.selectMindmap = function () {
	                $scope.$eval(vm.onSelectMindmap);
	            };
	            vm.getMindmapThumbnail = function (mindmap) {
	                if (!mindmap.thumbnail || mindmap.thumbnail === '') {
	                    return '/img/illustrations/mindmap.svg';
	                }
	                return mindmap.thumbnail + '?thumbnail=120x120';
	            };
	            vm.newMindmap = function () {
	                $scope.$eval(vm.onNewMindmap);
	            };
	            vm.openFolder = function (folder) {
	                $scope.$eval(vm.onOpenFolder)(folder);
	            };
	            vm.openMindmap = function (mindmap) {
	                $scope.$eval(vm.onOpenMindmap)(mindmap);
	            };
	            vm.drag = function (item, $originalEvent) {
	                try {
	                    $originalEvent.dataTransfer.setData('application/json', JSON.stringify(item));
	                }
	                catch (e) {
	                    $originalEvent.dataTransfer.setData('Text', JSON.stringify(item));
	                }
	            };
	            vm.dropCondition = function () {
	                return function (event) {
	                    var dataField = event.dataTransfer.types.indexOf && event.dataTransfer.types.indexOf("application/json") > -1 ? "application/json" : //Chrome & Safari
	                        event.dataTransfer.types.contains && event.dataTransfer.types.contains("application/json") ? "application/json" : //Firefox
	                            event.dataTransfer.types.contains && event.dataTransfer.types.contains("Text") ? "Text" : //IE
	                                undefined;
	                    return dataField;
	                };
	            };
	            vm.dropToFolder = function (targetItem, $originalEvent) {
	                var dataField = vm.dropCondition(targetItem)($originalEvent);
	                var originalItem = JSON.parse($originalEvent.dataTransfer.getData(dataField));
	                if (originalItem._id === targetItem._id)
	                    return;
	                if (targetItem.type === type_1.FOLDER_ITEM_TYPE.MINDMAP)
	                    return;
	                var originId = originalItem._id;
	                var targetId = targetItem._id;
	                if (originalItem.type === type_1.FOLDER_ITEM_TYPE.MINDMAP) {
	                    var userId = "userId";
	                    var folder_parent_id = targetId;
	                    var folder_parent = { userId: userId, folder_parent_id: folder_parent_id };
	                    var mindmapBody = new model_1.MindmapFolder(originalItem.name.toString(), folder_parent);
	                    $scope.$eval(vm.onChangeMindmapFolder)(originId, mindmapBody);
	                }
	                else {
	                    var folderBody = new model_1.Folder(originalItem.name.toString(), targetId);
	                    $scope.$eval(vm.onUpdateFolder)(originId, folderBody);
	                }
	            };
	        }
	    };
	});


/***/ }),
/* 115 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ROOTS = void 0;
	exports.ROOTS = {
	    directive: '/mindmap/public/ts/directives/'
	};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (g && (g = 0, op[0] && (_ = 0)), _) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.directiveLabelShare = void 0;
	var entcore_1 = __webpack_require__(1);
	var roots_1 = __webpack_require__(115);
	exports.directiveLabelShare = entcore_1.ng.directive('directiveLabelShare', function () {
	    return {
	        templateUrl: "".concat(roots_1.ROOTS.directive, "directive-label-share/directive-label-share.html"),
	        scope: {
	            onSort: '&',
	            name: '=',
	            isChecked: '='
	        },
	        restrict: 'E',
	        controllerAs: 'vm',
	        bindToController: true,
	        replace: false,
	        controller: function () {
	            var _this = this;
	            var vm = this;
	            vm.$onInit = function () { return __awaiter(_this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    vm.isChecked = true;
	                    return [2 /*return*/];
	                });
	            }); };
	            vm.$onDestroy = function () { return __awaiter(_this, void 0, void 0, function () {
	                return __generator(this, function (_a) {
	                    vm.isChecked = true;
	                    return [2 /*return*/];
	                });
	            }); };
	        },
	        link: function ($scope) {
	            var vm = $scope.vm;
	            vm.sort = function () {
	                vm.isChecked = !vm.isChecked;
	                $scope.$eval(vm.onSort)(vm.isChecked);
	            };
	        }
	    };
	});


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (this && this.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(__webpack_require__(109), exports);


/***/ })
/******/ ]);
//# sourceMappingURL=application.js.map