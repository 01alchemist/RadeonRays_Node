/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Demo {
}
exports.Demo = Demo;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const terminal_1 = __webpack_require__(3);
const index_1 = __webpack_require__(7);
const UIL = __webpack_require__(10);
function main() {
    createGUI();
}
exports.main = main;
function changeDemo(demo) {
    console.log(demo);
}
function createGUI() {
    const demoList = index_1.demos.map(demo => ({ label: demo.NAME, class: demo }));
    terminal_1.Terminal.info("Creating GUI");
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#141414";
    var ui = new UIL.Gui({ css: 'top:10px; left:130px;', size: 300, center: true });
    ui.add('title', { name: 'RadeonRays + Three.js' });
    ui.add('list', { name: 'Demo', callback: changeDemo, list: demoList });
}
main();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __webpack_require__(4);
const color_1 = __webpack_require__(6);
class Terminal {
    static log(text) {
        Terminal.write(text + "\n");
    }
    static write(text) {
        Terminal.history += text;
        if (Terminal.silent) {
            return;
        }
        if (env_1.isNode) {
            process.stdout.write(text);
        }
        else {
            if (text === "\n") {
                let texts = [];
                let styles = [];
                Terminal.browserBuffer.forEach(log => {
                    texts.push(log.text);
                    styles.push(log.style);
                });
                console.log.apply(null, [texts.join("")].concat(styles));
                Terminal.browserBuffer = [];
            }
            else {
                Terminal.browserBuffer.push({
                    text: `%c${text}`,
                    style: `background: ${Terminal.browserStyles.background};` +
                        `color: ${Terminal.browserStyles.text};` +
                        `font-weight: ${Terminal.browserStyles.bold ? "700" : "100"};`
                });
            }
        }
    }
    static time(name) {
        if (!Terminal.silent) {
            console.time(name);
        }
    }
    static timeEnd(name) {
        if (!Terminal.silent) {
            console.timeEnd(name);
        }
    }
    static setBGColor(color) {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[48;5;${color === null ? "" : color}m`);
            }
        }
        else {
            Terminal.browserStyles.background = color_1.HexColor[color];
        }
    }
    static setTextColor(color) {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;5;${color}m`);
            }
        }
        else {
            Terminal.browserStyles.text = color_1.HexColor[color];
        }
    }
    static setBoldText() {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[38;1m`);
            }
        }
        else {
            Terminal.browserStyles.bold = true;
        }
    }
    static clearColor() {
        if (env_1.isNode) {
            if (process.stdout.isTTY) {
                process.stdout.write(`\x1B[0m`);
            }
        }
        else {
            Terminal.browserStyles.text = color_1.HexColor[color_1.Color.DEFAULT_TEXT];
            Terminal.browserStyles.background = "none";
            Terminal.browserStyles.bold = false;
        }
    }
    static error(content) {
        Terminal.setBGColor(color_1.Color.RED);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" ERROR ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.RED);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }
    static warn(content) {
        Terminal.setBGColor(color_1.Color.ORANGE);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" WARNING ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.ORANGE);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }
    static success(content) {
        Terminal.setBGColor(color_1.Color.GREEN);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" SUCCESS ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.GREEN);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }
    static info(content) {
        Terminal.setBGColor(color_1.Color.BLUE);
        Terminal.setTextColor(color_1.Color.WHITE);
        Terminal.write(" INFO ");
        Terminal.clearColor();
        Terminal.setTextColor(color_1.Color.BLUE);
        Terminal.write(" ");
        Terminal.write(typeof content !== "string" ? JSON.stringify(content) : content);
        Terminal.write("\n");
        Terminal.clearColor();
    }
}
Terminal.silent = false;
Terminal.history = "";
Terminal.browserStyles = {
    text: color_1.HexColor[color_1.Color.DEFAULT_TEXT],
    background: color_1.HexColor[color_1.Color.DEFAULT_BG],
    bold: false
};
Terminal.browserBuffer = [];
exports.Terminal = Terminal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = new Function("try {return this===window;}catch(e){ return false;}")();
exports.isWorker = new Function("try {return this===self && typeof importScripts !== 'undefined';}catch(e){return false;}")();
exports.isNode = typeof global !== "undefined" && typeof process !== "undefined" && typeof process.stdout !== "undefined";

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(0)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = {
    DEFAULT_TEXT: 12,
    DEFAULT_BG: 8,
    BLACK: 0,
    WHITE: 255,
    BOLD: 1,
    RED: 1,
    GREEN: 2,
    YELLOW: 3,
    BLUE: 4,
    MAGENTA: 5,
    ORANGE: 208,
};
const hexColor = {};
hexColor[exports.Color.DEFAULT_TEXT] = "#000000";
hexColor[exports.Color.DEFAULT_BG] = "#FFFFFF";
hexColor[exports.Color.BLACK] = "#000000";
hexColor[exports.Color.WHITE] = "#FFFFFF";
hexColor[exports.Color.BOLD] = "";
hexColor[exports.Color.RED] = "#FF0000";
hexColor[exports.Color.GREEN] = "#00FF00";
hexColor[exports.Color.BLUE] = "#4badff";
hexColor[exports.Color.YELLOW] = "#FFF600";
hexColor[exports.Color.MAGENTA] = "#FF00FF";
hexColor[exports.Color.ORANGE] = "#FF8C00";
exports.HexColor = hexColor;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const teapot_1 = __webpack_require__(8);
const orb_1 = __webpack_require__(9);
exports.demos = [
    orb_1.OrbRadeonRaysDemo,
    teapot_1.TeapotDemo,
];


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const demo_1 = __webpack_require__(1);
class TeapotDemo extends demo_1.Demo {
}
TeapotDemo.NAME = "Teapot";
exports.TeapotDemo = TeapotDemo;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const demo_1 = __webpack_require__(1);
class OrbRadeonRaysDemo extends demo_1.Demo {
}
OrbRadeonRaysDemo.NAME = "Orb RadeonRays";
exports.OrbRadeonRaysDemo = OrbRadeonRaysDemo;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tools", function() { return Tools; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gui", function() { return Gui; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Proto", function() { return Proto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bool", function() { return Bool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Circular", function() { return Circular; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fps", function() { return Fps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Group", function() { return Group; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Joystick", function() { return Joystick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Knob", function() { return Knob; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Numeric", function() { return Numeric; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Slide", function() { return Slide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextInput", function() { return TextInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Title", function() { return Title; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "REVISION", function() { return REVISION; });
// Polyfills

if ( Number.EPSILON === undefined ) {

	Number.EPSILON = Math.pow( 2, - 52 );

}

//

if ( Math.sign === undefined ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;

	};

}

if ( Function.prototype.name === undefined ) {

	// Missing in IE9-11.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

	Object.defineProperty( Function.prototype, 'name', {

		get: function () {

			return this.toString().match( /^\s*function\s*([^\(\s]*)/ )[ 1 ];

		}

	} );

}

if ( Object.assign === undefined ) {

	// Missing in IE.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

	( function () {

		Object.assign = function ( target ) {

			'use strict';

			if ( target === undefined || target === null ) {

				throw new TypeError( 'Cannot convert undefined or null to object' );

			}

			var output = Object( target );

			for ( var index = 1; index < arguments.length; index ++ ) {

				var source = arguments[ index ];

				if ( source !== undefined && source !== null ) {

					for ( var nextKey in source ) {

						if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

							output[ nextKey ] = source[ nextKey ];

						}

					}

				}

			}

			return output;

		};

	} )();

}

/**
 * @author lo-th / https://github.com/lo-th
 */

var Tools = {

    main: null,

    doc: document,
    frag: document.createDocumentFragment(),

    URL: window.URL || window.webkitURL,

    isLoop: false,
    listens: [],

    svgns: "http://www.w3.org/2000/svg",
    htmls: "http://www.w3.org/1999/xhtml",

    DOM_SIZE: [ 'height', 'width', 'top', 'left', 'bottom', 'right', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'],
    SVG_TYPE_D: [ 'pattern', 'defs', 'transform', 'stop', 'animate', 'radialGradient', 'linearGradient', 'animateMotion' ],
    SVG_TYPE_G: [ 'rect', 'circle', 'path', 'polygon', 'text', 'g', 'line', 'foreignObject' ],

    size: {
        
        w: 240,
        h: 20,
        p: 30,
        s: 20,

    },

    // colors

    colors: {

        text : '#C0C0C0',
        background: 'rgba(44,44,44,0.3)',

        border : '#4f4f4f',
        borderSelect : '#308AFF',

        button : '#404040',
        boolbg : '#181818',

        select : '#308AFF',
        moving : '#03afff',
        down : '#024699',

        stroke: '#606060',//'rgba(120,120,120,0.6)',
        scroll: '#333333',

    },

    // style css

    css : {
        basic: '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none;' + 'position:absolute; pointer-events:none; box-sizing:border-box; margin:0; padding:0; border:none; overflow:hidden; background:none;',
    },

    // svg path

    GPATH: 'M 7 7 L 7 8 8 8 8 7 7 7 M 5 7 L 5 8 6 8 6 7 5 7 M 3 7 L 3 8 4 8 4 7 3 7 M 7 5 L 7 6 8 6 8 5 7 5 M 6 6 L 6 5 5 5 5 6 6 6 M 7 3 L 7 4 8 4 8 3 7 3 M 6 4 L 6 3 5 3 5 4 6 4 M 3 5 L 3 6 4 6 4 5 3 5 M 3 3 L 3 4 4 4 4 3 3 3 Z',

    setText : function( size, color, font ){

        size = size || 11;
        color = color || '#CCC';
        font = font || '"Consolas", "Lucida Console", Monaco, monospace';

        Tools.colors.text = color;

        Tools.css.txt = Tools.css.basic + 'font-family:'+font+'; font-size:'+size+'px; color:'+color+'; padding:2px 10px; left:0; top:2px; height:16px; width:100px; overflow:hidden; white-space: nowrap;';
        Tools.css.txtedit = Tools.css.txt + 'pointer-events:auto; padding:2px 5px; outline:none; -webkit-appearance:none; -moz-appearance:none; border:1px dashed #4f4f4f; -ms-user-select:element;';
        Tools.css.txtselect = Tools.css.txt + 'pointer-events:auto; padding:2px 5px; outline:none; -webkit-appearance:none; -moz-appearance:none; border:1px dashed ' + Tools.colors.border+'; -ms-user-select:element;';
        Tools.css.txtnumber = Tools.css.txt + 'letter-spacing:-1px; padding:2px 5px;';
        Tools.css.item = Tools.css.txt + 'position:relative; background:rgba(0,0,0,0.2); margin-bottom:1px; pointer-events:auto; cursor:pointer;';

    },

    setSvg: function( dom, type, value, id ){

        if( id === -1 ) dom.setAttributeNS( null, type, value );
        else dom.childNodes[ id || 0 ].setAttributeNS( null, type, value );

    },

    set: function( g, o ){

        for( var att in o ){
            if( att === 'txt' ) g.textContent = o[ att ];
            g.setAttributeNS( null, att, o[ att ] );
        }
        
    },

    get: function( dom, id ){

        if( id === undefined ) return dom; // root
        else if( !isNaN( id ) ) return dom.childNodes[ id ]; // first child
        else if( id instanceof Array ){
            if(id.length === 2) return dom.childNodes[ id[0] ].childNodes[ id[1] ];
            if(id.length === 3) return dom.childNodes[ id[0] ].childNodes[ id[1] ].childNodes[ id[2] ];
        }

    },

    /*setDom : function( dom, type, value ){

        var ext = Tools.DOM_SIZE.indexOf(type) !== -1 ? 'px' : '';
        dom.style[type] = value + ext;

    },*/

    dom : function ( type, css, obj, dom, id ) {

        type = type || 'div';

        if( Tools.SVG_TYPE_D.indexOf(type) !== -1 || Tools.SVG_TYPE_G.indexOf(type) !== -1 ){ // is svg element

            // create new svg if not def
            if( dom === undefined ) dom = Tools.doc.createElementNS( Tools.svgns, 'svg' );

            Tools.addAttributes( dom, type, obj, id );
            
        } else { // is html element

            if( dom === undefined ) dom = Tools.doc.createElementNS( Tools.htmls, type );
            else dom = dom.appendChild( Tools.doc.createElementNS( Tools.htmls, type ) );

        }

        if( css ) dom.style.cssText = css; 

        if( id === undefined ) return dom;
        else return dom.childNodes[ id || 0 ];

    },

    addAttributes : function( dom, type, o, id ){

        var g = Tools.doc.createElementNS( Tools.svgns, type );
        Tools.set( g, o );
        Tools.get( dom, id ).appendChild( g );
        if( Tools.SVG_TYPE_G.indexOf(type) !== -1 ) g.style.pointerEvents = 'none';
        return g;

    },

    clear : function( dom ){

        Tools.purge( dom );
        while (dom.firstChild) {
            if ( dom.firstChild.firstChild ) Tools.clear( dom.firstChild );
            dom.removeChild( dom.firstChild ); 
        }

    },

    purge : function ( dom ) {

        var a = dom.attributes, i, n;
        if (a) {
            i = a.length;
            while(i--){
                n = a[i].name;
                if (typeof dom[n] === 'function') dom[n] = null;
            }
        }
        a = dom.childNodes;
        if (a) {
            i = a.length;
            while(i--){ 
                Tools.purge( dom.childNodes[i] ); 
            }
        }

    },



    // LOOP

    loop : function(){

        if( Tools.isLoop ) requestAnimationFrame( Tools.loop );
        Tools.update();

    },

    update : function(){

        var i = Tools.listens.length;
        while(i--) Tools.listens[i].listening();

    },

    removeListen : function ( proto ){

        var id = Tools.listens.indexOf( proto );
        Tools.listens.splice(id, 1);

        if( Tools.listens.length === 0 ) Tools.isLoop = false;

    },

    addListen : function ( proto ){

        var id = Tools.listens.indexOf( proto );

        if( id !== -1 ) return; 

        Tools.listens.push( proto );

        if( !Tools.isLoop ){
            Tools.isLoop = true;
            Tools.loop();
        }

    },

    // ----------------------
    //   Color function
    // ----------------------

    ColorLuma : function ( hex, lum ) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }

        return rgb;

    },

    findDeepInver: function( rgb ){ 

        return (rgb[0] * 0.3 + rgb[1] * .59 + rgb[2] * .11) <= 0.6;
        
    },


    hexToHtml: function(v){ 
        v = v === undefined ? 0x000000 : v;
        return "#" + ("000000" + v.toString(16)).substr(-6);
        
    },

    htmlToHex: function(v){ 

        return v.toUpperCase().replace("#", "0x");

    },

    u255: function(color, i){

        return parseInt(color.substring(i, i + 2), 16) / 255;

    },

    u16: function( color, i ){

        return parseInt(color.substring(i, i + 1), 16) / 15;

    },

    unpack: function( color ){

        if (color.length == 7) return [ Tools.u255(color, 1), Tools.u255(color, 3), Tools.u255(color, 5) ];
        else if (color.length == 4) return [ Tools.u16(color,1), Tools.u16(color,2), Tools.u16(color,3) ];

    },

    htmlRgb: function( rgb ){

        return 'rgb(' + Math.round(rgb[0] * 255) + ','+ Math.round(rgb[1] * 255) + ','+ Math.round(rgb[2] * 255) + ')';

    },

    rgbToHex : function( rgb ){

        return '#' + ( '000000' + ( ( rgb[0] * 255 ) << 16 ^ ( rgb[1] * 255 ) << 8 ^ ( rgb[2] * 255 ) << 0 ).toString( 16 ) ).slice( - 6 );

    },

    hueToRgb: function( p, q, t ){

        if ( t < 0 ) t += 1;
        if ( t > 1 ) t -= 1;
        if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
        if ( t < 1 / 2 ) return q;
        if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
        return p;

    },

    rgbToHsl: function(rgb){

        var r = rgb[0], g = rgb[1], b = rgb[2], min = Math.min(r, g, b), max = Math.max(r, g, b), delta = max - min, h = 0, s = 0, l = (min + max) / 2;
        if (l > 0 && l < 1) s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
        if (delta > 0) {
            if (max == r && max != g) h += (g - b) / delta;
            if (max == g && max != b) h += (2 + (b - r) / delta);
            if (max == b && max != r) h += (4 + (r - g) / delta);
            h /= 6;
        }
        return [ h, s, l ];

    },

    hslToRgb: function( hsl ){

        var p, q, h = hsl[0], s = hsl[1], l = hsl[2];

        if ( s === 0 ) return [ l, l, l ];
        else {
            q = l <= 0.5 ? l * (s + 1) : l + s - ( l * s );
            p = l * 2 - q;
            return [ Tools.hueToRgb(p, q, h + 0.33333), Tools.hueToRgb(p, q, h), Tools.hueToRgb(p, q, h - 0.33333) ];
        }

    },

    // svg to canvas test 

    toCanvas: function( canvas, content, w, h ){

        var ctx = canvas.getContext("2d");

        var dcopy = null;

        if( typeof content === 'string' ){

            dcopy = Tools.dom( 'iframe', 'position:abolute; left:0; top:0; width:'+w+'px; height:'+h+'px;' );
            dcopy.src = content;

        }else{
            dcopy = content.cloneNode(true);
            dcopy.style.left = 0;
        }

        var svg = Tools.dom( 'foreignObject', 'position:abolute; left:0; top:0;', { width:w, height:h });

        svg.childNodes[0].appendChild( dcopy );
        
        svg.setAttribute("version", "1.1");
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg' );
        svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

        svg.setAttribute('width', w );
        svg.setAttribute('height', h );
        svg.childNodes[0].setAttribute('width', '100%' );
        svg.childNodes[0].setAttribute('height', '100%' );

        //console.log(svg)

        var img = new Image();
        

        var data = 'data:image/svg+xml;base64,'+ window.btoa((new XMLSerializer).serializeToString(svg));
        dcopy = null;

        img.onload = function() {
            ctx.clearRect( 0, 0, w, h );
            ctx.drawImage( img, 0, 0, w, h, 0, 0, w, h );
        };
        
        img.src = data;

        /*setTimeout(function() {
            ctx.clearRect( 0, 0, w, h );
            ctx.drawImage( img, 0, 0, w, h, 0, 0, w, h );
        }, 0);*/

        // blob

        /*var svgBlob = new Blob([(new XMLSerializer).serializeToString(svg)], {type: "image/svg+xml;charset=utf-8"});
        var url = URL.createObjectURL(svgBlob);

        img.onload = function() {
            ctx.clearRect( 0, 0, w, h );
            ctx.drawImage( img, 0, 0, w, h, 0, 0, w, h );
            URL.revokeObjectURL(url);
        };
        img.src = url;*/

    },

};

Tools.setText();

/**
 * @author lo-th / https://github.com/lo-th
 */

function Proto ( o ) {

    o = o || {};

    this.main = o.main || null;
    // if is on ui pannel
    this.isUI = o.isUI || false;

    // percent of title
    this.p = o.p !== undefined ? o.p : Tools.size.p;

    this.width = this.isUI ? this.main.size.w : Tools.size.w;
    if( o.w !== undefined ) this.width = o.w;

    this.h = this.isUI ? this.main.size.h : Tools.size.h;
    if( o.h !== undefined ) this.h = o.h;
    this.h = this.h < 11 ? 11 : this.h;

    // if need resize width
    this.autoWidth = true;

    // if need resize height
    this.isOpen = false;

    this.isGroup = false;
    this.parentGroup = null;

    // if height can change
    this.autoHeight = false;

    // radius for toolbox
    this.radius = o.radius || 0;

    

    // only for number
    this.isNumber = false;

    // only most simple 
    this.mono = false;

    // stop listening for edite slide text
    this.isEdit = false;

    // no title 
    this.simple = o.simple || false;
    if( this.simple ) this.sa = 0;

    // define obj size
    this.setSize( this.width );

    // title size
    if(o.sa !== undefined ) this.sa = o.sa;
    if(o.sb !== undefined ) this.sb = o.sb;

    if( this.simple ) this.sb = this.width - this.sa;

    // last number size for slide
    this.sc = o.sc === undefined ? 47 : o.sc;

    // like dat gui
    this.parent = null;
    this.val = null;
    this.isSend = false;

    
    
    // Background
    this.bg = this.isUI ? this.main.bg : Tools.colors.background;
    if( o.bg !== undefined ) this.bg = o.bg;

    // Font Color;
    this.titleColor = o.titleColor || Tools.colors.text;
    this.fontColor = o.fontColor || Tools.colors.text;
    this.colorPlus = Tools.ColorLuma( this.fontColor, 0.3 );

    this.name = o.name || 'Proto';
    
    this.txt = o.name || 'Proto';
    this.rename = o.rename || '';
    this.target = o.target || null;

    this.callback = o.callback === undefined ? null : o.callback;
    this.endCallback = null;

    if( this.callback === null && this.isUI && this.main.callback !== null ) this.callback = this.main.callback;

    // elements

    this.c = [];

    // style 

    this.s = [];

    //this.c[0] = Tools.dom('UIL', 'div', 'position:relative; height:20px; float:left;');
    this.c[0] = Tools.dom( 'div', Tools.css.basic + 'position:relative; height:20px; float:left; overflow:hidden;');
    this.s[0] = this.c[0].style;

    if( this.isUI ) this.s[0].marginBottom = '1px';
    

    if( !this.simple ){ 
        //this.c[1] = Tools.dom('UIL text');
        this.c[1] = Tools.dom( 'div', Tools.css.txt );
        this.s[1] = this.c[1].style;
        this.c[1].textContent = this.rename === '' ? this.txt : this.rename;
        this.s[1].color = this.titleColor;
    }

    if(o.pos){
        this.s[0].position = 'absolute';
        for(var p in o.pos){
            this.s[0][p] = o.pos[p];
        }
        this.mono = true;
    }

    if(o.css){
        this.s[0].cssText = o.css; 
    }

}

Proto.prototype = {

    constructor: Proto,

    // ----------------------
    // make de node
    // ----------------------

    init: function () {

        var s = this.s; // style cache
        var c = this.c; // div cache

        s[0].height = this.h + 'px';

        //if( this.isUI ) s[0].background = this.bg;
        if( this.autoHeight ) s[0].transition = 'height 0.1s ease-out';
        if( c[1] !== undefined && this.autoWidth ){
            s[1] = c[1].style;
            s[1].height = (this.h-4) + 'px';
            s[1].lineHeight = (this.h-8) + 'px';
        }

        var frag = Tools.frag;

        for( var i=1, lng = c.length; i !== lng; i++ ){
            if( c[i] !== undefined ) {
                frag.appendChild( c[i] );
                s[i] = c[i].style;
            }
        }


        if( this.target !== null ){ 
            this.target.appendChild( c[0] );
        } else {
            if( this.isUI ) this.main.inner.appendChild( c[0] );
            else document.body.appendChild( c[0] );
        }

        c[0].appendChild( frag );

        this.rSize();
        this.addEvent();

    },

    rename: function ( s ) {

        this.c[1].textContent = s;

    },

    setBG: function ( c ) {

        this.bg = c;
        this.s[0].background = c;

    },

    listen: function () {

        Tools.addListen( this );
        Tools.listens.push( this );
        return this;

    },

    listening: function () {

        if( this.parent === null ) return;
        if( this.isSend ) return;
        if( this.isEdit ) return;

        this.setValue( this.parent[ this.val ] );

    },

    setValue: function ( v ) {

        if( this.isNumber ) this.value = this.numValue( v );
        else this.value = v;
        this.update();

    },

    update: function () {
        
    },

    // ----------------------
    // update every change
    // ----------------------

    onChange: function ( f ) {

        this.callback = f;
        return this;

    },

    // ----------------------
    // update only on end
    // ----------------------

    onFinishChange: function ( f ) {

        this.callback = null;
        this.endCallback = f;
        return this;

    },

    send: function ( v ) {

        this.isSend = true;
        if( this.parent !== null ) this.parent[ this.val ] = v || this.value;
        if( this.callback ) this.callback( v || this.value );
        this.isSend = false;

    },

    sendEnd: function ( v ) {

        if( this.endCallback ) this.endCallback( v || this.value );
        if( this.parent !== null ) this.parent[ this.val ] = v || this.value;

    },

    // ----------------------
    // clear node
    // ----------------------
    
    clear: function () {

        this.clearEvent();
        Tools.clear( this.c[0] );

        if( this.target !== null ){ 
            this.target.removeChild( this.c[0] );
        } else {
            if( this.isUI ) this.main.clearOne( this );
            else document.body.removeChild( this.c[0] );
        }

        this.c = null;
        this.s = null;
        this.callback = null;
        this.target = null;

    },

    // ----------------------
    // change size 
    // ----------------------

    setSize: function ( sx ) {

        if( !this.autoWidth ) return;

        this.width = sx;

        if( this.simple ){
            //this.sa = 0;
            this.sb = this.width - this.sa;
        } else {
            var pp = this.width * ( this.p / 100 );
            this.sa = ~~ pp + 10;
            this.sb = ~~ this.width - pp - 20;
        }

    },

    rSize: function () {

        if( !this.autoWidth ) return;

        this.s[0].width = this.width + 'px';
        if( !this.simple ) this.s[1].width = this.sa + 'px';
    
    },

    // ----------------------
    // for numeric value
    // ----------------------

    setTypeNumber: function ( o ) {

        this.isNumber = true;

        this.value = 0;
        if(o.value !== undefined){
            if( typeof o.value === 'string' ) this.value = o.value * 1;
            else this.value = o.value;
        }

        this.min = o.min === undefined ? -Infinity : o.min;
        this.max = o.max === undefined ?  Infinity : o.max;
        this.precision = o.precision === undefined ? 2 : o.precision;

        var s;

        switch(this.precision){
            case 0: s = 1; break;
            case 1: s = 0.1; break;
            case 2: s = 0.01; break;
            case 3: s = 0.001; break;
            case 4: s = 0.0001; break;
        }

        this.step = o.step === undefined ?  s : o.step;

        this.range = this.max - this.min;

        this.value = this.numValue( this.value );
        
    },

    numValue: function ( n ) {

        return Math.min( this.max, Math.max( this.min, n ) ).toFixed( this.precision ) * 1;

    },

    // ----------------------
    //   Events dispatch
    // ----------------------

    addEvent: function () {

        var i = this.c.length, j, c;
        while( i-- ){
            c = this.c[i];
            if( c !== undefined ){
                if( c.events !== undefined ){
                    j = c.events.length;
                    while( j-- ) c.addEventListener( c.events[j], this, false );
                }
            }
        }

    },

    clearEvent: function () {

        var i = this.c.length, j, c;
        while( i-- ){
            c = this.c[i];
            if( c !== undefined ){
                if( c.events !== undefined ){
                    j = c.events.length;
                    while( j-- ) c.removeEventListener( c.events[j], this, false );
                }
            }
        }

    },

    handleEvent: function ( e ) {
        
    },

    // ----------------------
    // object referency
    // ----------------------

    setReferency: function ( obj, val ) {

        this.parent = obj;
        this.val = val;

    },

    display: function ( v ) {

        this.s[0].display = v ? 'block' : 'none';

    },

    // ----------------------
    // resize height 
    // ----------------------

    open: function () {

        if( this.isOpen ) return;
        this.isOpen = true;

    },

    close: function () {

        if( !this.isOpen ) return;
        this.isOpen = false;

    },


};

function Bool ( o ){

    Proto.call( this, o );

    this.value = o.value || false;

    this.buttonColor = o.bColor || Tools.colors.button;

    this.inh = o.inh || this.h;

    var t = ~~ (this.h*0.5)-((this.inh-2)*0.5);

    this.c[2] = Tools.dom( 'div', Tools.css.basic + 'background:'+ Tools.colors.boolbg +'; height:'+(this.inh-2)+'px; width:36px; top:'+t+'px; border-radius:20px; pointer-events:auto; cursor:pointer; transition:0.1s ease-out;' );
    this.c[3] = Tools.dom( 'div', Tools.css.basic + 'opasity:0, background:'+ Tools.colors.boolbg +'; height:'+(this.inh-6)+'px; width:'+(this.inh-6)+'px; top:'+(t+2)+'px; border-radius:20px; ' );
    this.c[4] = Tools.dom( 'div', Tools.css.basic + 'border:1px solid '+this.buttonColor+'; height:'+(this.inh-4)+'px; width:16px; top:'+(t+1)+'px; border-radius:20px; background:'+this.buttonColor+'; transition:margin 0.1s ease-out;' );

    if(this.value){
        this.c[4].style.marginLeft = '18px';
        this.c[2].style.background = this.fontColor;
        this.c[2].style.borderColor = this.fontColor;
    }

    this.c[2].events = [ 'click' ];

    this.init();

}

Bool.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Bool,

    handleEvent: function ( e ) {

        e.preventDefault();

        switch( e.type ) {
            case 'click': this.click(e); break;
        }

    },

    click: function( e ){

        if(this.value) this.value = false;
        else this.value = true;
        this.update();
        this.send();

    },

    update: function() {

        var s = this.s;

        if(this.value){
            s[4].marginLeft = '18px';
            s[2].background = this.fontColor;
            s[2].borderColor = this.fontColor;
            s[4].borderColor = this.fontColor;
        } else {
            s[4].marginLeft = '0px';
            s[2].background = Tools.colors.boolbg;
            s[2].borderColor = Tools.colors.boolbg;
            s[4].borderColor = Tools.colors.border;
        }
            
    },

    rSize: function(){

        Proto.prototype.rSize.call( this );
        var s = this.s;
        s[2].left = this.sa + 'px';
        s[3].left = this.sa+1+ 'px';
        s[4].left = this.sa+1 + 'px';

    }

} );

function Button ( o ) {

    Proto.call( this, o );

    this.value = o.value || [this.txt];

    this.buttonColor = o.bColor || Tools.colors.button;

    this.isLoadButton = o.loader || false;
    this.isDragButton = o.drag || false;
    if(this.isDragButton ) this.isLoadButton = true;
    //this.r = o.r || 3;

    this.lng = this.value.length;

    for(var i = 0; i < this.lng; i++){
        //this.c[i+2] = Tools.dom( 'div', Tools.css.txt + 'text-align:center; border:1px solid ' + Tools.colors.border+'; top:1px; pointer-events:auto; cursor:pointer; background:'+this.buttonColor+'; height:'+(this.h-2)+'px; border-radius:'+this.r+'px; line-height:'+(this.h-4)+'px;' );
        this.c[i+2] = Tools.dom( 'div', Tools.css.txt + 'text-align:center; top:1px; pointer-events:auto; cursor:pointer; background:'+this.buttonColor+'; height:'+(this.h-2)+'px; border-radius:'+this.radius+'px; line-height:'+(this.h-4)+'px;' );
        this.c[i+2].style.color = this.fontColor;

        this.c[i+2].events = [ 'click', 'mouseover', 'mousedown', 'mouseup', 'mouseout' ];
        this.c[i+2].innerHTML = this.value[i];//this.txt;
        this.c[i+2].name = i;
    }

    if( this.c[1] !== undefined ) this.c[1].textContent = '';
    

    if( this.isLoadButton ) this.initLoader();
    if( this.isDragButton ){ 
        this.lng ++;
        this.initDrager();
    }

    this.init();

}

Button.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Button,

    handleEvent: function ( e ) {

        e.preventDefault();

        switch( e.type ) {
            case 'click': this.click( e ); break;
            case 'mouseover': this.mode( 1, e ); break;
            case 'mousedown': this.mode( 2, e ); break;
            case 'mouseup': this.mode( 0, e ); break;
            case 'mouseout': this.mode( 0, e ); break;
            case 'change': this.fileSelect( e.target.files[0] ); break;

            case 'dragover': this.dragover(); break;
            case 'dragend': this.dragend(); break;
            case 'dragleave': this.dragend(); break;
            case 'drop': this.drop( e ); break;
        }

    },

    mode: function ( mode, e ) {

        var s = this.s;
        var i = e.target.name || 0;
        if(i==='loader') i = 0;

        switch( mode ){
            case 0: // base
                s[i+2].color = this.fontColor;
                s[i+2].background = this.buttonColor;
            break;
            case 1: // over
                s[i+2].color = '#FFF';
                s[i+2].background = Tools.colors.select;
            break;
            case 2: // edit / down
                s[i+2].color = this.fontColor;
                s[i+2].background = Tools.colors.down;
            break;

        }
    },

    dragover: function () {

        this.s[4].borderColor = Tools.colors.select;
        this.s[4].color = Tools.colors.select;

    },

    dragend: function () {

        this.s[4].borderColor = this.fontColor;
        this.s[4].color = this.fontColor;
    },

    drop: function ( e ) {

        this.dragend();
        this.fileSelect( e.dataTransfer.files[0] );

    },

    

    initDrager: function () {

        this.c[4] = Tools.dom( 'div', Tools.css.txt +' text-align:center; line-height:'+(this.h-8)+'px; border:1px dashed '+this.fontColor+'; top:2px; pointer-events:auto; cursor:default; height:'+(this.h-4)+'px; border-radius:'+this.r+'px;' );
        this.c[4].textContent = 'DRAG';

        this.c[2].events = [  ];
        this.c[4].events = [ 'dragover', 'dragend', 'dragleave', 'drop' ];


    },

    initLoader: function () {

        this.c[3] = Tools.dom( 'input', Tools.css.basic +'border:1px solid '+Tools.colors.border+'; top:1px; opacity:0; pointer-events:auto; cursor:pointer; height:'+(this.h-2)+'px;' );
        this.c[3].name = 'loader';
        this.c[3].type = "file";

        this.c[2].events = [  ];
        this.c[3].events = [ 'change', 'mouseover', 'mousedown', 'mouseup', 'mouseout' ];

        //this.hide = document.createElement('input');

    },

    fileSelect: function ( file ) {

        var dataUrl = [ 'png', 'jpg', 'mp4', 'webm', 'ogg' ];
        var dataBuf = [ 'sea', 'bvh', 'BVH', 'z' ];

        //if( ! e.target.files ) return;

        //var file = e.target.files[0];
       
        //this.c[3].type = "null";
        // console.log( this.c[4] )

        if( file === undefined ) return;

        var reader = new FileReader();
        var fname = file.name;
        var type = fname.substring(fname.lastIndexOf('.')+1, fname.length );

        if( dataUrl.indexOf( type ) !== -1 ) reader.readAsDataURL( file );
        else if( dataBuf.indexOf( type ) !== -1 ) reader.readAsArrayBuffer( file );
        else reader.readAsText( file );

        // if( type === 'png' || type === 'jpg' || type === 'mp4' || type === 'webm' || type === 'ogg' ) reader.readAsDataURL( file );
        //else if( type === 'z' ) reader.readAsBinaryString( file );
        //else if( type === 'sea' || type === 'bvh' || type === 'BVH' || type === 'z') reader.readAsArrayBuffer( file );
        //else if(  ) reader.readAsArrayBuffer( file );
        //else reader.readAsText( file );

        reader.onload = function(e) {
            
            if( this.callback ) this.callback( e.target.result, fname, type );
            //this.c[3].type = "file";
            //this.send( e.target.result ); 
        }.bind(this);

    },

    click: function ( e ) {

        var i = e.target.name || 0;
        var v = this.value[i];

        this.send( v );

    },

    label: function ( string, n ) {

        n = n || 2;
        this.c[n].textContent = string;

    },

    icon: function ( string, y, n ) {

        n = n || 2;
        this.s[n].padding = ( y || 0 ) +'px 0px';
        this.c[n].innerHTML = string;

    },

    rSize: function () {

        Proto.prototype.rSize.call( this );

        var s = this.s;
        var w = this.sb;
        var d = this.sa;

        var i = this.lng;
        var dc =  3;
        var size = Math.floor( ( w-(dc*(i-1)) ) / i );

        while(i--){
            
            s[i+2].width = size + 'px';
            s[i+2].left = d + ( size * i ) + ( dc * i) + 'px';

        }

        if( this.isDragButton ){ 
            s[4].left = (d+size+dc) + 'px';
            s[4].width = size + 'px';
        }

        if( this.isLoadButton ){
            s[3].left = d + 'px';
            s[3].width = size + 'px';
        }

    }

} );

function Circular ( o ) {

    Proto.call( this, o );

    //this.type = 'circular';
    this.autoWidth = false;

    this.buttonColor = Tools.colors.button;

    this.setTypeNumber( o );

    this.radius = Math.floor((this.width-20)*0.5);

    /*this.radius = o.radius || 15;
    
    this.width = (this.radius*2)+20;

    if(o.width !== undefined){
        this.width = o.width;
        this.radius = ~~ (this.width-20)*0.5;
    }

    if(o.size !== undefined){
        this.width = o.size;
        this.radius = ~~ (this.width-20)*0.5;
    }*/

    this.w = this.height = this.radius * 2;
    this.h = o.height || (this.height + 40);

    this.twoPi = Math.PI * 2;

    this.top = 0;

    this.c[0].style.width = this.width +'px';

    if(this.c[1] !== undefined) {

        this.c[1].style.width = this.width +'px';
        this.c[1].style.textAlign = 'center';
        this.top = 20;

    }

    this.percent = 0;

    this.c[2] = Tools.dom( 'div', Tools.css.txtnumber + 'text-align:center; top:'+(this.height+24)+'px; width:'+this.width+'px; color:'+ this.fontColor );
    this.c[3] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px; pointer-events:auto; cursor:pointer;', { cx:this.radius, cy:this.radius, r:this.radius, fill:'rgba(0,0,0,0.3)' });
    this.c[4] = Tools.dom( 'path', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;', { d:this.makePath(), fill:this.fontColor });
    this.c[5] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;', { cx:this.radius, cy:this.radius, r:this.radius*0.5, fill:this.buttonColor, 'stroke-width':1, stroke:Tools.colors.stroke });

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.init();

    this.update();

}

Circular.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Circular,

    handleEvent: function ( e ) {

        e.preventDefault();

        switch( e.type ) {
            case 'mouseover': this.over( e ); break;
            case 'mousedown': this.down( e ); break;
            case 'mouseout':  this.out( e );  break;

            case 'mouseup':   this.up( e );   break;
            case 'mousemove': this.move( e ); break;
        }

    },

    mode: function ( mode ) {

        switch(mode){
            case 0: // base
                this.s[2].color = this.fontColor;
                Tools.setSvg( this.c[3], 'fill','rgba(0,0,0,0.2)');
                Tools.setSvg( this.c[4], 'fill', this.fontColor );
            break;
            case 1: // over
                this.s[2].color = this.colorPlus;
                Tools.setSvg( this.c[3], 'fill','rgba(0,0,0,0.6)');
                Tools.setSvg( this.c[4], 'fill', this.colorPlus );
            break;
        }

    },

    // ACTION

    over: function ( e ) {

        this.isOver = true;
        this.mode(1);

    },

    out: function ( e ) {

        this.isOver = false;
        if(this.isDown) return;
        this.mode(0);

    },

    up: function ( e ) {

        this.isDown = false;
        document.removeEventListener( 'mouseup', this, false );
        document.removeEventListener( 'mousemove', this, false );

        if(this.isOver) this.mode(1);
        else this.mode(0);

        this.sendEnd();

    },

    down: function ( e ) {

        this.isDown = true;
        document.addEventListener( 'mouseup', this, false );
        document.addEventListener( 'mousemove', this, false );

        this.rect = this.c[3].getBoundingClientRect();
        this.old = this.value;
        this.oldr = null;
        this.move( e );

    },

    move: function ( e ) {

        if( !this.isDown ) return;

        var x = this.radius - (e.clientX - this.rect.left);
        var y = this.radius - (e.clientY - this.rect.top);

        this.r = Math.atan2( y, x ) - (Math.PI * 0.5);
        this.r = (((this.r%this.twoPi)+this.twoPi)%this.twoPi);

        if( this.oldr !== null ){ 

            var dif = this.r - this.oldr;
            this.r = Math.abs(dif) > Math.PI ? this.oldr : this.r;

            if(dif > 6) this.r = 0;
            if(dif < -6) this.r = this.twoPi;

        }

        var steps = 1 / this.twoPi;
        var value = this.r * steps;

        var n = ( ( this.range * value ) + this.min ) - this.old;

        if(n >= this.step || n <= this.step){ 
            n = ~~ ( n / this.step );
            this.value = this.numValue( this.old + ( n * this.step ) );
            this.update( true );
            this.old = this.value;
            this.oldr = this.r;
        }

    },

    makePath: function () {

        var r = this.radius;
        //var start = 0;
        var end = this.percent * this.twoPi - 0.001;
        //var x1 = r + r * Math.sin(start);
        //var y1 = r - r * Math.cos(start);
        var x2 = r + r * Math.sin(end);
        var y2 = r - r * Math.cos(end);
        //var big = end - start > Math.PI ? 1 : 0;
        var big = end > Math.PI ? 1 : 0;
        return "M " + r + "," + r + " L " + r + "," + 0 + " A " + r + "," + r + " 0 " + big + " 1 " + x2 + "," + y2 + " Z";

    },

    update: function ( up ) {

        this.c[2].textContent = this.value;
        this.percent = ( this.value - this.min ) / this.range;
        Tools.setSvg( this.c[4], 'd', this.makePath() );
        if( up ) this.send();
        
    },

} );

function Color ( o ) {
    
    Proto.call( this, o );

    this.autoHeight = true;

    this.ctype = o.ctype || 'array';
    this.ww = this.sb;
    this.oldWidth = 0;

    // color up or down
    this.side = o.side || 'down';
    this.holdTop = 0;
    
    this.wheelWidth = this.ww*0.1;
    this.decal = this.h + 2;
    
    this.colorRadius = (this.ww - this.wheelWidth) * 0.5 - 1;
    this.square = Math.floor((this.colorRadius - this.wheelWidth * 0.5) * 0.7) - 1;
    this.mid = Math.floor(this.ww * 0.5 );
    this.markerSize = this.wheelWidth * 0.3;

    this.baseH = this.h;

    //this.c[2] = Tools.dom( 'div',  Tools.css.txt + 'height:'+(this.h-4)+'px;' + 'border-radius:3px; pointer-events:auto; cursor:pointer; border:1px solid '+ Tools.colors.border + '; line-height:'+(this.h-8)+'px;' );
    this.c[2] = Tools.dom( 'div',  Tools.css.txt + 'height:'+(this.h-4)+'px;' + 'border-radius:'+this.radius+'px; pointer-events:auto; cursor:pointer; line-height:'+(this.h-8)+'px;' );

    this.s[2] = this.c[2].style;

    if(this.side === 'up'){
        this.decal = 5;
        this.s[2].top = 'auto';
        this.s[2].bottom = '2px';
    }

    this.c[3] = Tools.dom( 'div', Tools.css.basic + 'display:none' );
    this.c[4] = Tools.dom( 'canvas', Tools.css.basic + 'display:none;');
    this.c[5] = Tools.dom( 'canvas', Tools.css.basic + 'pointer-events:auto; cursor:pointer; display:none;');

    this.s[3] = this.c[3].style;
    this.s[5] = this.c[5].style;

    if(this.side === 'up') this.s[5].pointerEvents = 'none';

    this.c[4].width = this.c[4].height = this.ww;
    this.c[5].width = this.c[5].height = this.ww;

    this.ctxMask = this.c[4].getContext('2d');
    this.ctxOverlay = this.c[5].getContext('2d');
    this.ctxMask.translate(this.mid, this.mid);
    this.ctxOverlay.translate(this.mid, this.mid);

    this.hsl = null;
    this.value = '#ffffff';
    if( o.value !== undefined ){
        if(o.value instanceof Array) this.value = Tools.rgbToHex( o.value );
        else if(!isNaN(o.value)) this.value = Tools.hexToHtml( o.value );
        else this.value = o.value;
    }
    this.bcolor = null;
    this.isDown = false;
    this.isDraw = false;

    this.c[2].events = [ 'click' ];
    this.c[5].events = [ 'mousedown', 'mousemove', 'mouseup', 'mouseout' ];

    this.setColor( this.value );

    this.init();

    if( o.open !== undefined ) this.open();

}

Color.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Color,

	handleEvent: function( e ) {

	    e.preventDefault();
	    e.stopPropagation();

	    switch( e.type ) {
	        case 'click': this.click(e); break;
	        case 'mousedown': this.down(e); break;
	        case 'mousemove': this.move(e); break;
	        case 'mouseup': this.up(e); break;
	        case 'mouseout': this.out(e); break;
	    }

	},

	// ACTION

	click: function( e ){

	    if( !this.isOpen ) this.open();
	    else this.close();

	},

	up: function( e ){

	    this.isDown = false;

	},

	out: function( e ){

	    if( this.isOpen ) this.close();

	},

	down: function( e ){

	    if(!this.isOpen) return;
	    this.isDown = true;
	    this.move( e );
	    //return false;

	},

	move: function( e ){

	    if(!this.isDown) return;

	    this.offset = this.c[5].getBoundingClientRect();
	    var pos = { x: e.pageX - this.offset.left - this.mid, y: e.pageY - this.offset.top - this.mid };
	    this.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) > (this.square + 2);

	    if ( this.circleDrag ) {
	        var hue = Math.atan2(pos.x, -pos.y) / 6.28;
	        this.setHSL([(hue + 1) % 1, this.hsl[1], this.hsl[2]]);
	    } else {
	        var sat = Math.max(0, Math.min(1, -( pos.x / this.square * 0.5) + .5) );
	        var lum = Math.max(0, Math.min(1, -( pos.y / this.square * 0.5) + .5) );
	        this.setHSL([this.hsl[0], sat, lum]);
	    }

	},


	//////

	redraw: function(){

	    
	    this.drawCircle();
	    this.drawMask();
	    this.drawMarkers();

	    this.oldWidth = this.ww;
	    this.isDraw = true;

	    //console.log(this.isDraw)

	},

	open: function(){

		Proto.prototype.open.call( this );

	    if( this.oldWidth !== this.ww ) this.redraw();

	    this.h = this.ww + this.baseH + 10;
	    this.s[0].height = this.h + 'px';

	    if( this.side === 'up' ){ 
	        this.holdTop = this.s[0].top.substring(0,this.s[0].top.length-2) * 1 || 'auto';
	        if(!isNaN(this.holdTop)) this.s[0].top = (this.holdTop-(this.h-20))+'px';
	        setTimeout(function(){this.s[5].pointerEvents = 'auto';}.bind(this), 100);
	    }

	    this.s[3].display = 'block';
	    this.s[4].display = 'block';
	    this.s[5].display = 'block';

	    var t = this.h - this.baseH;

	    if ( this.parentGroup !== null ) this.parentGroup.calc( t );
	    else if ( this.isUI ) this.main.calc( t );

	    console.log('open');

	},

	close: function(){

	    Proto.prototype.close.call( this );

	    var t = this.h - this.baseH;

	    if ( this.parentGroup !== null ) this.parentGroup.calc( -t );
	    else if ( this.isUI ) this.main.calc( -t ); 

	    
	    this.h = this.baseH;
	    if(this.side === 'up'){ 
	        if(!isNaN(this.holdTop)) this.s[0].top = (this.holdTop)+'px';
	        this.s[5].pointerEvents = 'none';
	    }
	    this.s[0].height = this.h+'px';
	    this.s[3].display = 'none';
	    this.s[4].display = 'none';
	    this.s[5].display = 'none';

	    console.log('close');
	    
	},

	update: function( up ){

	    this.s[3].background = Tools.rgbToHex( Tools.hslToRgb([this.hsl[0], 1, 0.5]) );

	    this.drawMarkers();
	    
	    this.value = this.bcolor;

	    this.s[2].background = this.bcolor;
	    this.c[2].textContent = Tools.htmlToHex( this.bcolor );

	    this.invert = Tools.findDeepInver( this.rgb );
	    this.s[2].color = this.invert ? '#fff' : '#000';

	    if(!up) return;

	    if( this.ctype === 'array' ) this.send( this.rgb );
	    if( this.ctype === 'rgb' ) this.send( Tools.htmlRgb( this.rgb ) );
	    if( this.ctype === 'hex' ) this.send( Tools.htmlToHex( this.value ) );
	    if( this.ctype === 'html' ) this.send();

	},

	setColor: function( color ){

	    var unpack = Tools.unpack(color);
	    if (this.bcolor != color && unpack) {
	        this.bcolor = color;
	        this.rgb = unpack;
	        this.hsl = Tools.rgbToHsl( this.rgb );
	        this.update();
	    }
	    return this;

	},

	setHSL: function( hsl ){

	    this.hsl = hsl;
	    this.rgb = Tools.hslToRgb( hsl );
	    this.bcolor = Tools.rgbToHex( this.rgb );
	    this.update( true );
	    return this;

	},

	calculateMask: function( sizex, sizey, outputPixel ){

	    var isx = 1 / sizex, isy = 1 / sizey;
	    for (var y = 0; y <= sizey; ++y) {
	        var l = 1 - y * isy;
	        for (var x = 0; x <= sizex; ++x) {
	            var s = 1 - x * isx;
	            var a = 1 - 2 * Math.min(l * s, (1 - l) * s);
	            var c = (a > 0) ? ((2 * l - 1 + a) * .5 / a) : 0;
	            outputPixel(x, y, c, a);
	        }
	    }

	},

	drawMask: function(){

	    var size = this.square * 2, sq = this.square;
	    var sz = Math.floor(size / 2);
	    var buffer = document.createElement('canvas');
	    buffer.width = buffer.height = sz + 1;
	    var ctx = buffer.getContext('2d');
	    var frame = ctx.getImageData(0, 0, sz + 1, sz + 1);

	    var i = 0;
	    this.calculateMask(sz, sz, function (x, y, c, a) {
	        frame.data[i++] = frame.data[i++] = frame.data[i++] = c * 255;
	        frame.data[i++] = a * 255;
	    });

	    ctx.putImageData(frame, 0, 0);
	    this.ctxMask.drawImage(buffer, 0, 0, sz + 1, sz + 1, -sq, -sq, sq * 2, sq * 2);

	},

	drawCircle: function(){

	    var n = 24,r = this.colorRadius, w = this.wheelWidth, nudge = 8 / r / n * Math.PI, m = this.ctxMask, a1 = 0, color1, d1;
	    var ym, am, tan, xm, color2, d2, a2, ar;
	    m.save();
	    m.lineWidth = w / r;
	    m.scale(r, r);
	    for (var i = 0; i <= n; ++i) {
	        d2 = i / n;
	        a2 = d2 * Math.PI * 2;
	        ar = [Math.sin(a1), -Math.cos(a1), Math.sin(a2), -Math.cos(a2)];
	        am = (a1 + a2) * 0.5;
	        tan = 1 / Math.cos((a2 - a1) * 0.5);
	        xm = Math.sin(am) * tan, ym = -Math.cos(am) * tan;
	        color2 = Tools.rgbToHex( Tools.hslToRgb([d2, 1, 0.5]) );
	        if (i > 0) {
	            var grad = m.createLinearGradient(ar[0], ar[1], ar[2], ar[3]);
	            grad.addColorStop(0, color1);
	            grad.addColorStop(1, color2);
	            m.strokeStyle = grad;
	            m.beginPath();
	            m.moveTo(ar[0], ar[1]);
	            m.quadraticCurveTo(xm, ym, ar[2], ar[3]);
	            m.stroke();
	        }
	        a1 = a2 - nudge; 
	        color1 = color2;
	        d1 = d2;
	    }
	    m.restore();

	},

	drawMarkers: function(){

	    var m = this.markerSize, ra=this.colorRadius, sz = this.ww, lw = Math.ceil(m/ 4), r = m - lw + 1, c1 = this.invert ? '#fff' : '#000', c2 = this.invert ? '#000' : '#fff';
	    var angle = this.hsl[0] * 6.28;
	    var ar = [Math.sin(angle) * ra, -Math.cos(angle) * ra, 2 * this.square * (.5 - this.hsl[1]), 2 * this.square * (.5 - this.hsl[2]) ];
	  
	    var circles = [
	        { x: ar[2], y: ar[3], r: m, c: c1,     lw: lw },
	        { x: ar[2], y: ar[3], r: r, c: c2,     lw: lw + 1 },
	        { x: ar[0], y: ar[1], r: m, c: '#fff', lw: lw },
	        { x: ar[0], y: ar[1], r: r, c: '#000', lw: lw + 1 },
	    ];
	    this.ctxOverlay.clearRect(-this.mid, -this.mid, sz, sz);
	    var i = circles.length;
	    while(i--){
	        var c = circles[i];
	        this.ctxOverlay.lineWidth = c.lw;
	        this.ctxOverlay.strokeStyle = c.c;
	        this.ctxOverlay.beginPath();
	        this.ctxOverlay.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
	        this.ctxOverlay.stroke();
	    }

	},

	rSize: function(){

	    Proto.prototype.rSize.call( this );

	    this.ww = this.sb;
	    this.wheelWidth = this.ww*0.1;

	    if( this.side === 'up' ) this.decal = 5;
	    this.colorRadius = (this.ww - this.wheelWidth) * 0.5 - 1;
	    this.square = Math.floor((this.colorRadius - this.wheelWidth * 0.5) * 0.7) - 1;
	    this.mid = Math.floor(this.ww * 0.5 );
	    this.markerSize = this.wheelWidth * 0.3;

	    var s = this.s;

	    s[2].width = this.sb + 'px';
	    s[2].left = this.sa + 'px';

	    s[3].width = (this.square * 2 - 1) + 'px';
	    s[3].height = (this.square * 2 - 1) + 'px';
	    s[3].top = (this.mid+this.decal )-this.square + 'px';
	    s[3].left = (this.mid+this.sa )-this.square + 'px';

	    this.c[4].width = this.c[4].height = this.ww;
	    s[4].left = this.sa + 'px';
	    s[4].top = this.decal + 'px';

	    this.c[5].width = this.c[5].height = this.ww;
	    s[5].left = this.sa + 'px';
	    s[5].top = this.decal + 'px';

	    this.ctxMask.translate(this.mid, this.mid);
	    this.ctxOverlay.translate(this.mid, this.mid);

	    if( this.isOpen ){ 
	        this.redraw();

	        //this.open();
	        //this.h = this.ww+30;
	        //this.c[0].height = this.h + 'px';
	        //if( this.isUI ) this.main.calc();
	    }

	}

} );

function Fps ( o ) {

    Proto.call( this, o );

    this.round = Math.round;

    this.autoHeight = true;

    this.baseH = this.h;
    this.hplus = 50;

    this.res = o.res || 40;
    this.l = 1;

    this.pa1 = [];
    this.pa2 = [];
    this.pa3 = [];

    var i = this.res+1;
    while(i--){
        this.pa1.push(50);
        this.pa2.push(50);
        this.pa3.push(50);
    }

    var fltop = Math.floor(this.h*0.5)-6;

    this.c[1].textContent = 'FPS';
    this.c[0].style.cursor = 'pointer';
    this.c[0].style.pointerEvents = 'auto';

    var panelCss = 'display:none; left:10px; top:'+ this.h + 'px; height:'+(this.hplus - 8)+'px; background: rgba(0, 0, 0, 0.2);' + 'border:1px solid rgba(255, 255, 255, 0.2); ';

    this.c[2] = Tools.dom( 'path', Tools.css.basic + panelCss , { fill:'rgba(200,200,200,0.3)', 'stroke-width':1, stroke:this.fontColor, 'vector-effect':'non-scaling-stroke' });

    this.c[2].setAttribute('viewBox', '0 0 '+this.res+' 42' );
    this.c[2].setAttribute('height', '100%' );
    this.c[2].setAttribute('width', '100%' );
    this.c[2].setAttribute('preserveAspectRatio', 'none' );

    Tools.dom( 'path', null, { fill:'rgba(255,255,0,0.3)', 'stroke-width':1, stroke:'#FF0', 'vector-effect':'non-scaling-stroke' }, this.c[2] );
    Tools.dom( 'path', null, { fill:'rgba(0,255,255,0.3)', 'stroke-width':1, stroke:'#0FF', 'vector-effect':'non-scaling-stroke' }, this.c[2] );


    // bottom line
    this.c[3] = Tools.dom( 'div', Tools.css.basic + 'width:100%; bottom:0px; height:1px; background: rgba(255, 255, 255, 0.2);');

    this.c[4] = Tools.dom( 'path', Tools.css.basic + 'position:absolute; width:10px; height:10px; left:4px; top:'+fltop+'px;', { d:'M 3 8 L 8 5 3 2 3 8 Z', fill:this.fontColor, stroke:'none'});

    this.isShow = o.show || false;

    this.c[1].style.marginLeft = '10px';

    this.now = ( self.performance && self.performance.now ) ? self.performance.now.bind( performance ) : Date.now;
    this.startTime = this.now();
    this.prevTime = this.startTime;
    this.frames = 0;

    this.isMem = false;

    this.ms = 0;
    this.fps = 0;
    this.mem = 0;
    this.mm = 0;

    if ( self.performance && self.performance.memory ) this.isMem = true;

    this.c[0].events = [ 'click', 'mousedown', 'mouseover', 'mouseout' ];

    this.init();

    //if( this.isShow ) this.show();

}


Fps.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Fps,

    handleEvent: function ( e ) {

        e.preventDefault();

        switch( e.type ) {
            case 'click': this.click(e); break;
            case 'mouseover': this.mode(1); break;
            case 'mousedown': this.mode(2); break;
            case 'mouseout':  this.mode(0); break;
        }

    },

    mode: function ( mode ) {

        var s = this.s;

        switch(mode){
            case 0: // base
                s[1].color = this.fontColor;
                //s[1].background = 'none';
            break;
            case 1: // over
                s[1].color = '#FFF';
                //s[1].background = UIL.SELECT;
            break;
            case 2: // edit / down
                s[1].color = this.fontColor;
                //s[1].background = UIL.SELECTDOWN;
            break;

        }
    },

    click: function ( e ) {

        if( this.isShow ) this.hide();
        else this.show();

    },

    makePath: function ( point ) {

        var p = '';
        p += 'M ' + (-1) + ' ' + 50;
        for ( var i = 0; i < this.res + 1; i ++ ) { p += ' L ' + i + ' ' + point[i]; }
        p += ' L ' + (this.res + 1) + ' ' + 50;

        return p;

    },

    drawGraph: function( ){

        var svg = this.c[2];

        this.pa1.shift();
        this.pa1.push( 8.5 + this.round( ( 1 - (this.fps / 100)) * 30 ) );

        Tools.setSvg( svg, 'd', this.makePath( this.pa1 ), 0 );

        this.pa2.shift();
        this.pa2.push( 8.5 + this.round( ( 1 - (this.ms / 200)) * 30 ) );

        Tools.setSvg( svg, 'd', this.makePath( this.pa2 ), 1 );

        if ( this.isMem ) {

            this.pa3.shift();
            this.pa3.push( 8.5 + this.round( ( 1 - this.mm) * 30 ) );

            Tools.setSvg( svg, 'd', this.makePath( this.pa3 ), 2 );

        }

    },

    show: function(){

        this.h = this.hplus + this.baseH;

        Tools.setSvg( this.c[4], 'd','M 5 8 L 8 3 2 3 5 8 Z');


        if( this.parentGroup !== null ){ this.parentGroup.calc( this.hplus );}
        else if( this.isUI ) this.main.calc( this.hplus );

        this.s[0].height = this.h +'px';
        this.s[2].display = 'block'; 
        this.isShow = true;

        Tools.addListen( this );

    },

    hide: function(){

        this.h = this.baseH;

        Tools.setSvg( this.c[4], 'd','M 3 8 L 8 5 3 2 3 8 Z');

        if( this.parentGroup !== null ){ this.parentGroup.calc( -this.hplus );}
        else if( this.isUI ) this.main.calc( -this.hplus );
        
        this.s[0].height = this.h +'px';
        this.s[2].display = 'none';
        this.isShow = false;

        Tools.removeListen( this );
        this.c[1].textContent = 'FPS';
        
    },



    //////////////////

    begin: function(){

        this.startTime = this.now();
        
    },

    end: function(){


        var time = this.now();
        this.ms = time - this.startTime;

        this.frames ++;

        if ( time > this.prevTime + 1000 ) {

            this.fps = this.round( ( this.frames * 1000 ) / ( time - this.prevTime ) );

            this.prevTime = time;
            this.frames = 0;

            if ( this.isMem ) {

                var heapSize = performance.memory.usedJSHeapSize;
                var heapSizeLimit = performance.memory.jsHeapSizeLimit;

                this.mem = this.round( heapSize * 0.000000954 );

                this.mm = heapSize / heapSizeLimit;

            }

        }

        this.drawGraph();
        this.c[1].innerHTML = 'FPS ' + this.fps + '<font color="yellow"> MS '+ ( this.ms | 0 ) + '</font><font color="cyan"> MB '+ this.mem + '</font>';

        return time;

        
    },

    listening: function(){

        this.startTime = this.end();
        
    },


    rSize: function(){

        this.s[0].width = this.width + 'px';
        this.s[1].width = this.width + 'px';
        this.s[2].left = 10 + 'px';
        this.s[2].width = (this.width-20) + 'px';
        
    },
    
} );

function Group ( o ) {
 
    Proto.call( this, o );

    this.autoHeight = true;
    this.isGroup = true;

    //this.bg = o.bg || null;
    

    //this.h = 25;
    this.baseH = this.h;
    var fltop = Math.floor(this.h*0.5)-6;


    this.isLine = o.line !== undefined ? o.line : false;

    this.c[2] = Tools.dom( 'div', Tools.css.basic + 'width:100%; left:0; height:auto; overflow:hidden; top:'+this.h+'px');
    this.c[3] = Tools.dom( 'path', Tools.css.basic + 'position:absolute; width:10px; height:10px; left:0; top:'+fltop+'px;', { d:Tools.GPATH, fill:this.fontColor, stroke:'none'});
    this.c[4] = Tools.dom( 'path', Tools.css.basic + 'position:absolute; width:10px; height:10px; left:4px; top:'+fltop+'px;', { d:'M 3 8 L 8 5 3 2 3 8 Z', fill:this.fontColor, stroke:'none'});
    // bottom line
    if(this.isLine) this.c[5] = Tools.dom( 'div', Tools.css.basic +  'background:rgba(255, 255, 255, 0.2); width:100%; left:0; height:1px; bottom:0px');

    var s = this.s;

    s[0].height = this.h + 'px';
    s[1].height = this.h + 'px';
    //s[1].top = 4 + 'px';
    //s[1].left = 4 + 'px';
    s[1].pointerEvents = 'auto';
    s[1].cursor = 'pointer';
    this.c[1].name = 'group';

    this.s[1].marginLeft = '10px';
    this.s[1].lineHeight = this.h-4;
    this.s[1].color = this.fontColor;
    this.s[1].fontWeight = 'bold';

    this.uis = [];

    this.c[1].events = [ 'click' ];

    this.init();

    if( o.bg !== undefined ) this.setBG(o.bg);
    if( o.open !== undefined ) this.open();

}

Group.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Group,

    handleEvent: function ( e ) {

        e.preventDefault();
        //e.stopPropagation();

        switch( e.type ) {
            case 'click': this.click( e ); break;
        }

    },


    click: function ( e ) {

        if( this.isOpen ) this.close();
        else this.open();

    },

    setBG: function ( c ) {

        this.s[0].background = c;

        var i = this.uis.length;
        while(i--){
            this.uis[i].setBG( c );
        }

    },

    add: function( ){

        var a = arguments;

        if( typeof a[1] === 'object' ){ 
            a[1].isUI = this.isUI;
            a[1].target = this.c[2];
            a[1].main = this.main;
        } else if( typeof arguments[1] === 'string' ){
            if( a[2] === undefined ) [].push.call(a, { isUI:true, target:this.c[2], main:this.main });
            else{ 
                a[2].isUI = true;
                a[2].target = this.c[2];
                a[2].main = this.main;
            }
        }

        var n = add.apply( this, a );
        this.uis.push( n );

        if( n.autoHeight ) n.parentGroup = this;

        return n;

    },

    open: function () {

        Proto.prototype.open.call( this );

        Tools.setSvg( this.c[4], 'd','M 5 8 L 8 3 2 3 5 8 Z');
        //this.s[4].background = UIL.F1;
        this.rSizeContent();

        if( this.isUI ) this.main.calc( this.h - this.baseH );

    },

    close: function () {

        Proto.prototype.close.call( this );

        if( this.isUI ) this.main.calc( -( this.h - this.baseH ) );

        Tools.setSvg( this.c[4], 'd','M 3 8 L 8 5 3 2 3 8 Z');
        this.h = this.baseH;
        this.s[0].height = this.h + 'px';

    },

    clear: function(){

        this.clearGroup();
        if( this.isUI ) this.main.calc( -(this.h +1 ));
        Proto.prototype.clear.call( this );

    },

    clearGroup: function(){

        this.close();

        var i = this.uis.length;
        while(i--){
            this.uis[i].clear();
            this.uis.pop();
        }
        this.uis = [];
        this.h = this.baseH;

    },

    calc: function( y ){

        if( !this.isOpen ) return;

        if( y !== undefined ){ 
            this.h += y;
            if( this.isUI ) this.main.calc( y );
        } else {
            this.h = this.c[2].offsetHeight + this.baseH;
        }
        this.s[0].height = this.h + 'px';

    },

    rSizeContent: function(){

        var i = this.uis.length;
        while(i--){
            this.uis[i].setSize( this.width );
            this.uis[i].rSize();
        }
        this.calc();

    },

    rSize: function(){

        Proto.prototype.rSize.call( this );

        var s = this.s;

        s[3].left = ( this.sa + this.sb - 17 ) + 'px';
        s[1].width = this.width + 'px';
        s[2].width = this.width + 'px';

        if(this.isOpen) this.rSizeContent();

    }

} );

function Joystick ( o ) {

    Proto.call( this, o );

    this.autoWidth = false;

    this.value = [0,0];

    this.joyType = 'analogique';

    this.precision = o.precision || 2;
    this.multiplicator = o.multiplicator || 1;

    this.x = 0;
    this.y = 0;

    this.oldx = 0;
    this.oldy = 0;

    this.interval = null;

    this.radius = Math.floor((this.width-20)*0.5);

    /*this.radius = o.radius || 50;

    this.width = (this.radius*2)+20;

    if(o.width !== undefined){
        this.width = o.width;
        this.radius = ~~ (( this.width-20 )*0.5);
    }
    if(o.size !== undefined){
        this.width = o.size;
        this.radius = ~~ (this.width-20)*0.5;
    }*/

    this.innerRadius = o.innerRadius || this.radius*0.6;
    this.maxDistance = this.radius - this.innerRadius - 5;
    this.height = this.radius*2;
    this.h = o.height || (this.height + 40);

    this.top = 0;

    this.c[0].style.width = this.width +'px';

    if(this.c[1] !== undefined) {

        this.c[1].style.width = this.width +'px';
        this.c[1].style.textAlign = 'center';
        this.top = 20;

    }

    this.c[2] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;  pointer-events:auto; cursor:pointer;', { cx:this.radius, cy:this.radius, r:this.radius, fill:'url(#grad)' });
    this.c[3] = Tools.dom( 'circle', Tools.css.basic + 'left:0px; top:'+(this.top-10)+'px; width:'+(this.w+20)+'px; height:'+(this.height+20)+'px;', { cx:this.radius+10, cy:this.radius+10, r:this.innerRadius+10, fill:'url(#gradS)'});
    this.c[4] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;', { cx:this.radius, cy:this.radius, r:this.innerRadius, fill:'url(#gradIn)', 'stroke-width':1, stroke:'#000'  });
    this.c[5] = Tools.dom( 'div', Tools.css.txt + 'text-align:center; top:'+(this.height+20)+'px; width:'+this.width+'px; color:'+ this.fontColor );

    // gradian bakground
    var svg = this.c[2];
    Tools.dom( 'defs', null, {}, svg );
    Tools.dom( 'radialGradient', null, {id:'grad', cx:'50%', cy:'50%', r:'50%', fx:'50%', fy:'50%' }, svg, 1 );
    Tools.dom( 'stop', null, { offset:'40%', style:'stop-color:rgb(0,0,0); stop-opacity:0.3;' }, svg, [1,0] );
    Tools.dom( 'stop', null, { offset:'80%', style:'stop-color:rgb(0,0,0); stop-opacity:0;' }, svg, [1,0] );
    Tools.dom( 'stop', null, { offset:'90%', style:'stop-color:rgb(50,50,50); stop-opacity:0.4;' }, svg, [1,0] );
    Tools.dom( 'stop', null, { offset:'100%', style:'stop-color:rgb(50,50,50); stop-opacity:0;' }, svg, [1,0] );

    // gradian shadow
    svg = this.c[3];
    Tools.dom( 'defs', null, {}, svg );
    Tools.dom( 'radialGradient', null, {id:'gradS', cx:'50%', cy:'50%', r:'50%', fx:'50%', fy:'50%' }, svg, 1 );
    Tools.dom( 'stop', null, { offset:'60%', style:'stop-color:rgb(0,0,0); stop-opacity:0.5;' }, svg, [1,0] );
    Tools.dom( 'stop', null, { offset:'100%', style:'stop-color:rgb(0,0,0); stop-opacity:0;' }, svg, [1,0] );

    // gradian stick

    var cc0 = ['rgb(40,40,40)', 'rgb(48,48,48)', 'rgb(30,30,30)'];
    var cc1 = ['rgb(1,90,197)', 'rgb(3,95,207)', 'rgb(0,65,167)'];

    svg = this.c[4];
    Tools.dom( 'defs', null, {}, svg );
    Tools.dom( 'radialGradient', null, {id:'gradIn', cx:'50%', cy:'50%', r:'50%', fx:'50%', fy:'50%' }, svg, 1 );
    Tools.dom( 'stop', null, { offset:'30%', style:'stop-color:'+cc0[0]+'; stop-opacity:1;' }, svg, [1,0] );
    Tools.dom( 'stop', null, { offset:'60%', style:'stop-color:'+cc0[1]+'; stop-opacity:1;' }, svg, [1,0]  );
    Tools.dom( 'stop', null, { offset:'80%', style:'stop-color:'+cc0[1]+'; stop-opacity:1;' }, svg, [1,0]  );
    Tools.dom( 'stop', null, { offset:'100%', style:'stop-color:'+cc0[2]+'; stop-opacity:1;' }, svg, [1,0]  );

    Tools.dom( 'radialGradient', null, {id:'gradIn2', cx:'50%', cy:'50%', r:'50%', fx:'50%', fy:'50%' }, this.c[4], 1 );
    Tools.dom( 'stop', null, { offset:'30%', style:'stop-color:'+cc1[0]+'; stop-opacity:1;' }, svg, [1,1]  );
    Tools.dom( 'stop', null, { offset:'60%', style:'stop-color:'+cc1[1]+'; stop-opacity:1;' }, svg, [1,1] );
    Tools.dom( 'stop', null, { offset:'80%', style:'stop-color:'+cc1[1]+'; stop-opacity:1;' }, svg, [1,1] );
    Tools.dom( 'stop', null, { offset:'100%', style:'stop-color:'+cc1[2]+'; stop-opacity:1;' }, svg, [1,1] );

    //console.log( this.c[4] )

    this.c[5].textContent = 'x'+ this.value[0] +' y' + this.value[1];

    this.c[2].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.init();

    this.update(false);
}

Joystick.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Joystick,

    handleEvent: function ( e ) {

        e.preventDefault();

        switch( e.type ) {
            case 'mouseover': this.over( e ); break;
            case 'mousedown': this.down( e ); break;
            case 'mouseout':  this.out( e );  break;
            case 'mouseup':   this.up( e );   break;
            case 'mousemove': this.move( e ); break;
        }

    },

    mode: function ( mode ) {

        switch(mode){
            case 0: // base
                Tools.setSvg( this.c[4], 'fill','url(#gradIn)');
                Tools.setSvg( this.c[4], 'stroke', '#000' );
            break;
            case 1: // over
                Tools.setSvg( this.c[4], 'fill', 'url(#gradIn2)' );
                Tools.setSvg( this.c[4], 'stroke', 'rgba(0,0,0,0)' );
            break;
            case 2: // edit
            break;

        }
    },

    over: function( e ){

        this.isOver = true;
        this.mode(1);

    },

    out: function( e ){

        this.isOver = false;
        if(this.isDown) return;
        this.mode(0);

    },

    up: function( e ){

        this.isDown = false;
        document.removeEventListener( 'mouseup', this, false );
        document.removeEventListener( 'mousemove', this, false );

        this.interval = setInterval(this.update.bind(this), 10);

        if(this.isOver) this.mode(1);
        else this.mode(0);
        
    },

    down: function( e ){

        this.isDown = true;
        document.addEventListener( 'mouseup', this, false );
        document.addEventListener( 'mousemove', this, false );

        this.rect = this.c[2].getBoundingClientRect();
        this.move( e );
        this.mode( 2 );

    },

    move: function ( e ) {

        if( !this.isDown ) return;

        var x = this.radius - ( e.clientX - this.rect.left );
        var y = this.radius - ( e.clientY - this.rect.top );

        var distance = Math.sqrt( x * x + y * y );

        if ( distance > this.maxDistance ) {
            var angle = Math.atan2(x, y);
            x = Math.sin(angle) * this.maxDistance;
            y = Math.cos(angle) * this.maxDistance;
        }

        this.x = x / this.maxDistance;
        this.y = y / this.maxDistance;

        this.update();

    },

    setValue: function ( x, y ) {

        this.x = x || 0;
        this.y = y || 0;

        this.updateSVG();

    },

    update: function ( up ) {

        if(up === undefined) up = true;

        if( this.interval !== null ){

            if( !this.isDown ){
                this.x += (0 - this.x)/3;
                this.y += (0 - this.y)/3;
            }

            if ( this.x.toFixed(2) === this.oldx.toFixed(2) && this.y.toFixed(2) === this.oldy.toFixed(2)){
                
                this.x = 0;
                this.y = 0;
            }

        }

        this.updateSVG();

        if( up ) this.send();

        if( this.interval !== null && this.x === 0 && this.y === 0 ){
            clearInterval( this.interval );
            this.interval = null;
        }

    },

    updateSVG: function () {

        var rx = this.x * this.maxDistance;
        var ry = this.y * this.maxDistance;
        var x = this.radius - rx;
        var y = this.radius - ry;
        var sx = x + ((1-this.x)*5) + 5;
        var sy = y + ((1-this.y)*5) + 10;

        Tools.setSvg( this.c[3], 'cx', sx );
        Tools.setSvg( this.c[3], 'cy', sy );
        Tools.setSvg( this.c[4], 'cx', x );
        Tools.setSvg( this.c[4], 'cy', y );

        this.oldx = this.x;
        this.oldy = this.y;

        this.value[0] = -( this.x * this.multiplicator ).toFixed( this.precision ) * 1;
        this.value[1] =  ( this.y * this.multiplicator ).toFixed( this.precision ) * 1;

        this.c[5].textContent = 'x'+ this.value[0] +' y' + this.value[1];

    },

} );

function Knob ( o ) {

    Proto.call( this, o );

    //this.type = 'knob';
    this.autoWidth = false;

    this.buttonColor = Tools.colors.button;

    this.setTypeNumber( o );

    this.mPI = Math.PI * 0.8;
    this.toDeg = 180 / Math.PI;
    this.cirRange = this.mPI * 2;

    this.radius = Math.floor((this.width-20)*0.5);

    /*this.radius = o.radius || 15;
    
    this.width = (this.radius*2)+20;

    if(o.width !== undefined){
        this.width = o.width;
        this.radius = ~~ (this.width-20)*0.5;
    }

    if(o.size !== undefined){
        this.width = o.size;
        this.radius = ~~ (this.width-20)*0.5;
    }*/

    this.w = this.height = this.radius * 2;
    this.h = o.height || (this.height + 40);
    this.top = 0;

    this.c[0].style.width = this.width +'px';

    if(this.c[1] !== undefined) {

        this.c[1].style.width = this.width +'px';
        this.c[1].style.textAlign = 'center';
        this.top = 20;

    }

    this.percent = 0;

    this.c[2] = Tools.dom( 'div', Tools.css.txtnumber + 'text-align:center; top:'+(this.height+24)+'px; width:'+this.width+'px; color:'+ this.fontColor );

    this.c[3] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;  pointer-events:auto; cursor:pointer;', { cx:this.radius, cy:this.radius, r:this.radius-4, fill:'rgba(0,0,0,0.3)' });
    this.c[4] = Tools.dom( 'circle', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;', { cx:this.radius, cy:this.radius*0.5, r:3, fill:this.fontColor });
    this.c[5] = Tools.dom( 'path', Tools.css.basic + 'left:10px; top:'+this.top+'px; width:'+this.w+'px; height:'+this.height+'px;', { d:this.makeGrad(), 'stroke-width':1, stroke:Tools.colors.stroke });
    
    Tools.dom( 'circle', null, { cx:this.radius, cy:this.radius, r:this.radius*0.7, fill:this.buttonColor, 'stroke-width':1, stroke:Tools.colors.stroke }, this.c[3] );

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.r = 0;

    this.init();

    this.update();

}

Knob.prototype = Object.assign( Object.create( Circular.prototype ), {

    constructor: Knob,

    move: function( e ){

        if( !this.isDown ) return;

        var x = this.radius - (e.clientX - this.rect.left);
        var y = this.radius - (e.clientY - this.rect.top);
        this.r = - Math.atan2( x, y );

        if( this.oldr !== null ) this.r = Math.abs(this.r - this.oldr) > Math.PI ? this.oldr : this.r;

        this.r = this.r > this.mPI ? this.mPI : this.r;
        this.r = this.r < -this.mPI ? -this.mPI : this.r;

        var steps = 1 / this.cirRange;
        var value = (this.r + this.mPI) * steps;

        var n = ( ( this.range * value ) + this.min ) - this.old;

        if(n >= this.step || n <= this.step){ 
            n = ~~ ( n / this.step );
            this.value = this.numValue( this.old + ( n * this.step ) );
            this.update( true );
            this.old = this.value;
            this.oldr = this.r;
        }

    },

    makeGrad: function () {

        var d = '', step, range, a, x, y, x2, y2, r = this.radius;
        var startangle = Math.PI + this.mPI;
        var endangle = Math.PI - this.mPI;

        if(this.step>5){
            range =  this.range / this.step;
            step = ( startangle - endangle ) / range;
        } else {
            step = ( startangle - endangle ) / r;
            range = r;
        }

        for ( var i = 0; i <= range; ++i ) {

            a = startangle - ( step * i );
            x = r + Math.sin( a ) * r;
            y = r + Math.cos( a ) * r;
            x2 = r + Math.sin( a ) * ( r - 3 );
            y2 = r + Math.cos( a ) * ( r - 3 );
            d += 'M' + x + ' ' + y + ' L' + x2 + ' '+y2 + ' ';

        }

        return d;

    },

    update: function ( up ) {

        this.c[2].textContent = this.value;
        this.percent = (this.value - this.min) / this.range;

        var r = ( (this.percent * this.cirRange) - (this.mPI)) * this.toDeg;

        Tools.setSvg( this.c[4], 'transform', 'rotate('+ r +' '+this.radius+' '+this.radius+')' );

        if( up ) this.send();
        
    },

} );

function List(o) {
    Proto.call(this, o);

    this.autoHeight = true;
    var align = o.align || "center";

    this.buttonColor = o.bColor || Tools.colors.button;

    var fltop = Math.floor(this.h * 0.5) - 5;

    //this.c[2] = Tools.dom( 'div', Tools.css.basic + 'top:0; height:90px; cursor:s-resize; pointer-events:auto; display:none; overflow:hidden; border:1px solid '+Tools.colors.border+';' );
    //this.c[3] = Tools.dom( 'div', Tools.css.txt + 'text-align:'+align+'; line-height:'+(this.h-4)+'px; border:1px solid '+Tools.colors.border+'; top:1px; pointer-events:auto; cursor:pointer; background:'+this.buttonColor+'; height:'+(this.h-2)+'px;' );

    this.c[2] = Tools.dom(
        "div",
        Tools.css.basic +
            "top:0; height:90px; cursor:s-resize; pointer-events:auto; display:none; overflow:hidden;",
    );
    this.c[3] = Tools.dom(
        "div",
        Tools.css.txt +
            "text-align:" +
            align +
            "; line-height:" +
            (this.h - 4) +
            "px; top:1px; pointer-events:auto; cursor:pointer; background:" +
            this.buttonColor +
            "; height:" +
            (this.h - 2) +
            "px; border-radius:" +
            this.radius +
            "px;",
    );
    this.c[4] = Tools.dom(
        "path",
        Tools.css.basic +
            "position:absolute; width:10px; height:10px; top:" +
            fltop +
            "px;",
        { d: "M 3 8 L 8 5 3 2 3 8 Z", fill: this.fontColor, stroke: "none" },
    );

    this.scroller = Tools.dom(
        "div",
        Tools.css.basic +
            "right:5px;  width:10px; pointer-events:none; background:#666; display:none;",
    );

    this.c[2].name = "list";
    this.c[3].name = "title";

    //this.c[2].style.borderTop = this.h + 'px solid transparent';
    this.c[3].style.color = this.fontColor;

    this.c[2].events = [
        "mousedown",
        "mousemove",
        "mouseup",
        "mousewheel",
        "mouseout",
        "mouseover",
    ];
    this.c[3].events = ["mousedown", "mouseover", "mouseout"];

    this.list = o.list || [];

    this.baseH = this.h;

    //this.maxItem = o.maxItem || 5;
    this.itemHeight = o.itemHeight || this.h - 3;
    //this.length = this.list.length;

    // force full list
    this.full = o.full || false;

    this.py = 0;
    this.w = this.sb;
    this.scroll = false;
    this.isDown = false;

    // list up or down
    this.side = o.side || "down";
    this.holdTop = 0;

    if (this.side === "up") {
        this.c[2].style.top = "auto";
        this.c[3].style.top = "auto";
        this.c[4].style.top = "auto";
        //this.c[5].style.top = 'auto';

        this.c[2].style.bottom = this.h - 2 + "px";
        this.c[3].style.bottom = "1px";
        this.c[4].style.bottom = fltop + "px";
        //this.c[5].style.bottom = '2px';
    } else {
        this.c[2].style.top = this.h - 2 + "px";
        //this.c[6].style.top = this.h + 'px';
    }

    this.listIn = Tools.dom(
        "div",
        Tools.css.basic +
            "left:0; top:0; width:100%; background:rgba(0,0,0,0.2);",
    );
    this.listIn.name = "list";

    this.c[2].appendChild(this.listIn);
    this.c[2].appendChild(this.scroller);

    // populate list

    this.setList(this.list, o.value);

    this.init();

    if (o.open !== undefined) this.open();
}

List.prototype = Object.assign(Object.create(Proto.prototype), {
    constructor: List,

    handleEvent: function(e) {
        e.preventDefault();

        var name = e.target.name || "";
        switch (e.type) {
            case "click":
                this.click(e);
                break
            case "mouseover":
                if (name === "title") this.mode(1);
                else this.listover(e);
                break
            case "mousedown":
                if (name === "title") this.titleClick(e);
                else this.listdown(e);
                break
            case "mouseup":
                if (name === "title") this.mode(0);
                else this.listup(e);
                break
            case "mouseout":
                if (name === "title") this.mode(0);
                else this.listout(e);
                break
            case "mousemove":
                this.listmove(e);
                break
            case "mousewheel":
                this.listwheel(e);
                break
        }
    },

    mode: function(mode) {
        var s = this.s;

        switch (mode) {
            case 0: // base
                s[3].color = this.fontColor;
                s[3].background = this.buttonColor;
                break
            case 1: // over
                s[3].color = "#FFF";
                s[3].background = Tools.colors.select;
                break
            case 2: // edit / down
                s[3].color = this.fontColor;
                s[3].background = Tools.colors.down;
                break
        }
    },

    clearList: function() {
        while (this.listIn.children.length)
            this.listIn.removeChild(this.listIn.lastChild);
    },

    setList: function(list, value) {
        this.clearList();

        this.list = list;
        this.length = this.list.length;

        this.maxItem = this.full ? this.length : 5;
        this.maxItem = this.length < this.maxItem ? this.length : this.maxItem;

        this.maxHeight = this.maxItem * (this.itemHeight + 1) + 2;

        this.max = this.length * (this.itemHeight + 1) + 2;
        this.ratio = this.maxHeight / this.max;
        this.sh = this.maxHeight * this.ratio;
        this.range = this.maxHeight - this.sh;

        this.c[2].style.height = this.maxHeight + "px";
        this.scroller.style.height = this.sh + "px";

        if (this.max > this.maxHeight) {
            this.w = this.sb - 20;
            this.scroll = true;
        }

        var item, n; //, l = this.sb;
        for (var i = 0; i < this.length; i++) {
            n = this.list[i];
            item = Tools.dom(
                "div",
                Tools.css.item +
                    "width:" +
                    this.w +
                    "px; height:" +
                    this.itemHeight +
                    "px; line-height:" +
                    (this.itemHeight - 5) +
                    "px;",
            );
            if (typeof n === "object") {
                item.textContent = n.label ? n.label : n;
            } else {
                item.textContent = n;
            }
            item.style.color = this.fontColor;
            item.name = "item";
            this.listIn.appendChild(item);
        }

        if (value !== undefined) {
            if (!isNaN(value)) this.value = this.list[value];
            else this.value = value;
        } else {
            this.value = this.list[0];
        }

        this.c[3].textContent =
            typeof this.value === "object"
                ? this.value.label ? this.value.label : this.value
                : this.value;
    },

    // -----

    click: function(e) {
        var name = e.target.name;
        if (name !== "title" && name !== "list") this.close();
    },

    titleClick: function(e) {
        if (this.isOpen) this.close();
        else {
            this.open();
            this.mode(2);
        }
    },

    // ----- LIST

    listover: function(e) {
        var name = e.target.name;
        //console.log(name)
        if (name === "item") {
            e.target.style.background = Tools.colors.select;
            e.target.style.color = "#FFF";
        }
    },

    listdown: function(e) {
        var name = e.target.name;
        if (name !== "list" && name !== undefined) {
            const label = e.target.textContent; //name;
            this.value = this.list.find(item => {
                if(typeof item === "object"){
                    return item.label === label;
                } else {
                    return item === label;
                }
            });
            this.c[3].textContent = label;
            this.send();
            // this.close();
        } else if (name === "list" && this.scroll) {
            this.isDown = true;
            this.listmove(e);
            this.listIn.style.background = "rgba(0,0,0,0.6)";
            this.scroller.style.background = "#AAA";
        }
    },

    listmove: function(e) {
        if (this.isDown) {
            var rect = this.c[2].getBoundingClientRect();
            this.update(e.clientY - rect.top - this.sh * 0.5);
        }
    },

    listup: function(e) {
        this.isDown = false;
        this.listIn.style.background = "rgba(0,0,0,0.2)";
        this.scroller.style.background = "#666";
    },

    listout: function(e) {
        var n = e.target.name;
        if (n === "item") {
            e.target.style.background = "rgba(0,0,0,0.2)";
            e.target.style.color = this.fontColor;
        }

        if (this.isUI) this.main.lockwheel = false;
        this.listup();
        //var name = e.relatedTarget.name;
        //if( name === undefined ) this.close();
    },

    listwheel: function(e) {
        if (!this.scroll) return
        if (this.isUI) this.main.lockwheel = true;
        var delta = 0;
        if (e.wheelDeltaY) delta = -e.wheelDeltaY * 0.04;
        else if (e.wheelDelta) delta = -e.wheelDelta * 0.2;
        else if (e.detail) delta = e.detail * 4.0;

        this.py += delta;

        this.update(this.py);
    },

    // ----- LIST

    update: function(y) {
        if (!this.scroll) return

        y = y < 0 ? 0 : y;
        y = y > this.range ? this.range : y;

        this.listIn.style.top = -Math.floor(y / this.ratio) + "px";
        this.scroller.style.top = Math.floor(y) + "px";

        this.py = y;
    },

    open: function() {
        Proto.prototype.open.call(this);

        document.addEventListener("click", this, false);

        this.update(0);
        this.h = this.maxHeight + this.baseH + 10;
        if (!this.scroll) {
            this.h = this.baseH + 10 + this.max;
            this.scroller.style.display = "none";
        } else {
            this.scroller.style.display = "block";
        }
        this.s[0].height = this.h + "px";
        this.s[2].display = "block";
        if (this.side === "up")
            Tools.setSvg(this.c[4], "d", "M 5 2 L 2 7 8 7 5 2 Z");
        else Tools.setSvg(this.c[4], "d", "M 5 8 L 8 3 2 3 5 8 Z");

        this.rSizeContent();

        if (this.parentGroup !== null)
            this.parentGroup.calc(this.h - this.baseH);
        else if (this.isUI) this.main.calc(this.h - this.baseH);
    },

    close: function() {
        Proto.prototype.close.call(this);

        document.removeEventListener("click", this, false);

        if (this.parentGroup !== null)
            this.parentGroup.calc(-(this.h - this.baseH));
        else if (this.isUI) this.main.calc(-(this.h - this.baseH));

        this.h = this.baseH;
        this.s[0].height = this.h + "px";
        this.s[2].display = "none";
        Tools.setSvg(this.c[4], "d", "M 3 8 L 8 5 3 2 3 8 Z");
    },

    // -----

    text: function(txt) {
        this.c[3].textContent = txt;
    },

    rSizeContent: function() {
        var i = this.length;
        while (i--) this.listIn.children[i].style.width = this.w + "px";
    },

    rSize: function() {
        Proto.prototype.rSize.call(this);

        var s = this.s;
        var w = this.sb;
        var d = this.sa;

        s[2].width = w + "px";
        s[2].left = d + "px";

        s[3].width = w + "px";
        s[3].left = d + "px";

        s[4].left = d + w - 17 + "px";

        //s[5].width = w + 'px';
        //s[5].left = d + 'px';

        this.w = w;
        if (this.max > this.maxHeight) this.w = w - 20;

        if (this.isOpen) this.rSizeContent();
    },
});

function Numeric( o ){

    Proto.call( this, o );

    this.type = 'number';

    this.setTypeNumber( o );

    this.allway = o.allway || false;
    this.isDrag = o.drag === undefined ? true : o.drag;

    this.value = [0];
    this.toRad = 1;
    this.isNumber = true;
    this.isAngle = false;
    this.isVector = false;
    this.isSelect = false;

    if( o.value !== undefined ){
        if(!isNaN(o.value)){ this.value = [o.value];}
        else if(o.value instanceof Array ){ this.value = o.value; this.isNumber=false;}
        else if(o.value instanceof Object ){ 
            this.value = [];
            if(o.value.x) this.value[0] = o.value.x;
            if(o.value.y) this.value[1] = o.value.y;
            if(o.value.z) this.value[2] = o.value.z;
            if(o.value.w) this.value[3] = o.value.w;
            this.isVector = true;
        }
    }

    this.length = this.value.length;

    if(o.isAngle){
        this.isAngle = true;
        this.toRad = Math.PI/180;
    }

    //this.w = ((Tools.base.BW+5)/(this.length))-5;
    this.current = undefined;
    
    var i = this.length;
    while(i--){
        if(this.isAngle) this.value[i] = (this.value[i] * 180 / Math.PI).toFixed( this.precision );
        this.c[2+i] = Tools.dom( 'div', Tools.css.txtselect + 'letter-spacing:-1px; cursor:pointer; height:'+(this.h-4)+'px; line-height:'+(this.h-8)+'px;');
        this.c[2+i].name = i;
        if(this.isDrag) this.c[2+i].style.cursor = 'move';
        if(o.center) this.c[2+i].style.textAlign = 'center';

        this.c[2+i].textContent = this.value[i];
        this.c[2+i].style.color = this.fontColor;
        //this.c[2+i].contentEditable = true;
        this.c[2+i].events = [ 'keydown', 'keyup', 'mousedown', 'blur', 'focus' ]; //'click', 

    }

    this.init();
}

Numeric.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Numeric,

    handleEvent: function( e ) {

        //e.preventDefault();
        //e.stopPropagation();

        switch( e.type ) {
            //case 'click': this.click( e ); break;
            case 'mousedown': this.down( e ); break;
            case 'keydown': this.keydown( e ); break;
            case 'keyup': this.keyup( e ); break;

            case 'blur': this.blur( e ); break;
            case 'focus': this.focus( e ); break;

            // document
            case 'mouseup': this.up( e ); break;
            case 'mousemove': this.move( e ); break;

        }

    },

    setValue: function ( v, n ) {

        n = n || 0;
        this.value[n] = this.numValue( v );
        this.c[2+n].textContent = this.value[n];

    },

    keydown: function ( e ) {

        e.stopPropagation();

        if( e.keyCode === 13 ){
            e.preventDefault();
            this.testValue( parseFloat(e.target.name) );
            this.validate();
            e.target.blur();
        }

    },

    keyup: function ( e ) {
        
        e.stopPropagation();

        if( this.allway ){ 
            this.testValue( parseFloat(e.target.name) );
            this.validate();
        }

    },

    blur: function ( e ) {

        this.isSelect = false;
        e.target.style.borderColor = Tools.colors.border;
        e.target.contentEditable = false;
        //e.target.style.border = '1px solid rgba(255,255,255,0.1)';
        if(this.isDrag) e.target.style.cursor = 'move';
        else  e.target.style.cursor = 'pointer';

    },

    focus: function ( e ) {

        this.isSelect = true;
        this.current = undefined;
        e.target.style.borderColor = Tools.colors.borderSelect;
        
        //e.target.style.border = '1px solid ' + UIL.BorderSelect;
        if(this.isDrag) e.target.style.cursor = 'auto';

    },

    down: function ( e ) {

        if(this.isSelect) return;

        e.preventDefault();

        this.current = parseFloat(e.target.name);

        this.prev = { x:e.clientX, y:e.clientY, d:0, id:(this.current+2)};
        if( this.isNumber ) this.prev.v = parseFloat(this.value);
        else this.prev.v = parseFloat( this.value[this.current] );



        document.addEventListener( 'mouseup', this, false );
        if(this.isDrag) document.addEventListener( 'mousemove', this, false );

    },

    ////

    up: function( e ){

        e.preventDefault();

        document.removeEventListener( 'mouseup', this, false );
        if(this.isDrag) document.removeEventListener( 'mousemove', this, false );

        if(this.current !== undefined){ 

            if( this.current === parseFloat(e.target.name) ){ 
                e.target.contentEditable = true;
                e.target.focus();
            }

        }

    },

    move: function( e ){

        e.preventDefault();

        if( this.current === undefined ) return;

        this.prev.d += ( e.clientX - this.prev.x ) - ( e.clientY - this.prev.y );
        var n = this.prev.v + ( this.prev.d * this.step);

        this.value[this.current] = this.numValue(n);
        //this.c[2+this.current].value = this.value[this.current];

        this.c[2+this.current].textContent = this.value[this.current];

        this.validate();

        this.prev.x = e.clientX;
        this.prev.y = e.clientY;

    },

    /////

    testValue: function( n ){

        if(!isNaN( this.c[2+n].textContent )){ 
            var nx = this.numValue( this.c[2+n].textContent );
            this.c[2+n].textContent = nx;
            this.value[n] = nx;
        } else { // not number
            this.c[2+n].textContent = this.value[n];
        }

    },

    validate: function(){

        var ar = [];
        var i = this.length;
        while(i--) ar[i] = this.value[i]*this.toRad;

        if( this.isNumber ) this.send( ar[0] );
        else this.send( ar );

    },

    rSize: function(){

        Proto.prototype.rSize.call( this );

        this.w = ~~( ( this.sb + 5 ) / this.length )-5;
        var s = this.s;
        var i = this.length;
        while(i--){
            s[2+i].left = (~~( this.sa + ( this.w * i )+( 5 * i ))) + 'px';
            s[2+i].width = this.w + 'px';
        }

    }

} );

function Slide ( o ){

    Proto.call( this, o );

    this.setTypeNumber( o );

    this.stype = o.stype || 0;
    this.buttonColor = o.bColor || Tools.colors.button;

    //this.old = this.value;
    this.isDown = false;
    this.isOver = false;
    this.allway = o.allway || false;

    this.c[2] = Tools.dom( 'div', Tools.css.txtselect + 'letter-spacing:-1px; padding:2px 5px; text-align:right; cursor:pointer; width:47px; border:none; color:'+ this.fontColor );
    this.c[3] = Tools.dom( 'div', Tools.css.basic + 'pointer-events:auto; cursor:w-resize; top:0; height:'+this.h+'px;' );
    //this.c[4] = Tools.dom( 'div', Tools.css.basic + 'border:1px solid '+this.buttonColor+'; pointer-events:none; background:rgba(0,0,0,0.3); top:2px; height:'+(this.h-4)+'px;' );
    this.c[4] = Tools.dom( 'div', Tools.css.basic + 'pointer-events:none; background:rgba(0,0,0,0.3); top:2px; height:'+(this.h-4)+'px;' );
    this.c[5] = Tools.dom( 'div', Tools.css.basic + 'left:4px; top:5px; height:'+(this.h-10)+'px; background:' + this.fontColor +';' );

    this.c[2].name = 'text';
    this.c[3].name = 'scroll';

    if(this.stype !== 0){
        if(this.stype === 1 || this.stype === 3){
            var h1 = 4;
            var h2 = 8;
            var ww = this.h-4;
            var ra = 20;
        }

        if(this.stype === 2){
            h1 = 2;
            h2 = 4;
            ra = 2;
            ww = (this.h-4)*0.5;
        }

        if(this.stype === 3) this.c[5].style.visible = 'none';

        this.c[4].style.borderRadius = h1 + 'px';
        this.c[4].style.height = h2 + 'px';
        this.c[4].style.top = (this.h*0.5) - h1 + 'px';
        this.c[5].style.borderRadius = (h1*0.5) + 'px';
        this.c[5].style.height = h1 + 'px';
        this.c[5].style.top = (this.h*0.5)-(h1*0.5) + 'px';

        this.c[6] = Tools.dom( 'div', Tools.css.basic + 'border-radius:'+ra+'px; margin-left:'+(-ww*0.5)+'px; border:1px solid '+Tools.colors.border+'; background:'+this.buttonColor+'; left:4px; top:2px; height:'+(this.h-4)+'px; width:'+ww+'px;' );
    }

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];
    this.c[2].events = [ 'keydown', 'keyup', 'mousedown', 'blur', 'focus' ];

    this.init();

}

Slide.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Slide,

    handleEvent: function ( e ) {

        //e.preventDefault();

        //console.log(e.target.name)

        switch( e.type ) {
            case 'mouseover': this.over( e ); break;
            case 'mousedown': e.target.name === 'text' ? this.textdown( e ) : this.down( e ); break;
            case 'mouseout': this.out( e ); break;

            case 'mouseup': this.up( e ); break;
            case 'mousemove': if(this.isDown) this.move( e ); break;

            case 'blur': this.blur( e ); break;
            case 'focus': this.focus( e ); break;
            case 'keydown': this.keydown( e ); break;
            case 'keyup': this.keyup( e ); break;
        }

    },

    mode: function ( mode ) {

        var s = this.s;

        switch(mode){
            case 0: // base
                s[2].color = this.fontColor;
                s[4].background = 'rgba(0,0,0,0.3)';
                s[5].background = this.fontColor;
            break;
            case 1: // over
                s[2].color = this.colorPlus;
               // if( !s[6] ) s[4].background = UIL.SlideBG;
               // else 
                s[4].background = 'rgba(0,0,0,0.6)';
                s[5].background = this.colorPlus;
            break;
        }
    },

    over: function( e ){

        e.preventDefault();
        e.stopPropagation();

        this.isOver = true;
        this.mode(1);

    },

    out: function( e ){

        e.preventDefault();
        e.stopPropagation();

        this.isOver = false;
        if(this.isDown) return;
        this.mode(0);

    },

    up: function( e ){

        e.preventDefault();
        e.stopPropagation();

        this.isDown = false;
        document.removeEventListener( 'mouseup', this, false );
        document.removeEventListener( 'mousemove', this, false );

        if(this.isOver) this.mode(1);
        else this.mode(0);

        this.sendEnd();
        
    },

    down: function( e ){

        e.preventDefault();
        e.stopPropagation();

        this.isDown = true;
        document.addEventListener( 'mouseup', this, false );
        document.addEventListener( 'mousemove', this, false );

        this.left = this.c[3].getBoundingClientRect().left;
        this.old = this.value;
        this.move( e );

    },

    move: function( e ){

        var n = ((( e.clientX - this.left - 3 ) / this.w ) * this.range + this.min ) - this.old;
        if(n >= this.step || n <= this.step){ 
            n = ~~ ( n / this.step );
            this.value = this.numValue( this.old + ( n * this.step ) );
            this.update( true );
            this.old = this.value;
        }

    },

    update: function( up ){

        var ww = this.w * (( this.value - this.min ) / this.range );
       
        if(this.stype !== 3) this.s[5].width = ~~ ww + 'px';
        if(this.s[6]) this.s[6].left = ~~ (this.sa +ww + 3) + 'px';
        this.c[2].textContent = this.value;

        if( up ) this.send();

    },

    rSize: function(){

        Proto.prototype.rSize.call( this );

        var w = this.sb - this.sc;
        this.w = w - 6;

        var tx = this.sc;
        if(this.isUI || !this.simple) tx = this.sc+10;

        var ty = ~~(this.h * 0.5) - 8;

        var s = this.s;

        s[2].width = (this.sc -2 )+ 'px';
        s[2].left = (this.width - tx +2) + 'px';
        s[2].top = ty + 'px';
        s[3].left = this.sa + 'px';
        s[3].width = w + 'px';
        s[4].left = this.sa + 'px';
        s[4].width = w + 'px';
        s[5].left = (this.sa + 3) + 'px';

        this.update();

    },

    // text

    validate: function( e ){

        if(!isNaN( this.c[2].textContent )){ 
            this.value = this.numValue( this.c[2].textContent ); 
            this.update(true); 
        }
        else this.c[2].textContent = this.value;

    },

    textdown: function( e ){

        e.target.contentEditable = true;
        e.target.focus();
        this.isEdit = true;

    },

    keydown: function( e ){

        e.stopPropagation();

        if( e.keyCode === 13 ){
            e.preventDefault();
            this.validate();
            e.target.blur();
        }

    },

    keyup: function( e ){
        
        e.stopPropagation();
        if( this.allway ) this.validate();

    },

    blur: function( e ){

        e.target.style.border = 'none';
        e.target.contentEditable = false;
        this.isEdit = false;

    },

    focus: function( e ){

        e.target.style.border = '1px dashed ' + Tools.colors.borderSelect;

    }

} );

function TextInput( o ){

    Proto.call( this, o );

    this.value = o.value || '';
    this.allway = o.allway || false;

    this.c[2] = Tools.dom( 'div',  Tools.css.txtselect );
    this.c[2].name = 'input';
    //this.c[2].style.color = ;
    this.c[2].textContent = this.value;

    this.c[2].events = [ 'mousedown', 'keydown', 'keyup', 'blur', 'focus' ];

    this.init();

}

TextInput.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: TextInput,

    handleEvent: function( e ) {

        switch( e.type ) {
            case 'mousedown': this.down( e ); break;
            case 'blur': this.blur( e ); break;
            case 'focus': this.focus( e ); break
            case 'keydown': this.keydown( e ); break;
            case 'keyup': this.keyup( e ); break;
        }

    },

    down: function( e ){

        e.target.contentEditable = true;
        e.target.focus();
        e.target.style.cursor = 'auto';

    },

    blur: function( e ){

        e.target.style.borderColor = Tools.colors.border;
        e.target.contentEditable = false;

    },

    focus: function( e ){

        e.target.style.borderColor = Tools.colors.borderSelect;

    },

    keydown: function( e ){
        
        e.stopPropagation();

        if( e.keyCode === 13 ){ 
            e.preventDefault();
            this.value = e.target.textContent;
            e.target.blur();
            this.send();
        }

    },

    keyup: function( e ){
        
        e.stopPropagation();

        this.value = e.target.textContent;
        if( this.allway ) this.send();
        
    },

    rSize: function(){

        Proto.prototype.rSize.call( this );
        this.s[2].color = this.fontColor;
        this.s[2].left = this.sa + 'px';
        this.s[2].width = this.sb + 'px';
        this.s[2].height = this.h -4 + 'px';
        this.s[2].lineHeight = this.h - 8 + 'px';
     
    }

} );

function Title ( o ) {
    
    Proto.call( this, o );

    //var id = o.id || 0;
    var prefix = o.prefix || '';

    this.c[2] = Tools.dom( 'div', Tools.css.txt + 'text-align:right; width:60px; line-height:'+ (this.h-8) + 'px; color:' + this.fontColor );

    if( this.h === 31 ){

        this.s[0].height = this.h + 'px';
        this.s[1].top = 8 + 'px';
        this.c[2].style.top = 8 + 'px';

    }

    this.c[1].textContent = this.txt.substring(0,1).toUpperCase() + this.txt.substring(1).replace("-", " ");
    this.c[2].textContent = prefix;

    this.init();

}

Title.prototype = Object.assign( Object.create( Proto.prototype ), {

    constructor: Title,

    text: function ( txt ) {

        this.c[1].textContent = txt;

    },

    text2: function ( txt ) {

        this.c[2].textContent = txt;

    },

    rSize: function () {

        Proto.prototype.rSize.call( this );
        this.s[1].width = this.width-50 + 'px';
        this.s[2].left = this.width-(50+26) + 'px';

    },

} );

function getType( name, o ) {

        var n = null;

        switch( name ){

            case 'Bool': case 'bool': n = new Bool(o); break;
            case 'Button': case 'button': n = new Button(o); break;
            case 'Circular': case 'circular': n = new Circular(o); break;
            case 'Color': case 'color': n = new Color(o); break;
            case 'Fps': case 'fps': n = new Fps(o); break;
            case 'Group': case 'group': n = new Group(o); break;
            case 'Joystick': case 'joystick': n = new Joystick(o); break;
            case 'Knob': case 'knob': n = new Knob(o); break;
            case 'List': case 'list': n = new List(o); break;
            case 'Numeric':case 'Number': case 'numeric':case 'number': n = new Numeric(o); break;
            case 'Slide': case 'slide': n = new Slide(o); break;
            case 'TextInput':case 'String': case 'textInput':case 'string': n = new TextInput(o); break;
            case 'Title': case 'title': n = new Title(o); break;

        }

        return n;
}

function add (){

    var a = arguments; 

    var type, o, ref = false;

    if( typeof a[0] === 'string' ){ 

        type = a[0];//[0].toUpperCase() + a[0].slice(1);
        o = a[1] || {};

    } else if ( typeof a[0] === 'object' ){ // like dat gui

        ref = true;
        if( a[2] === undefined ) [].push.call(a, {});

        type = autoType.apply( this, a );

        o = a[2];

        o.name = a[1];
        o.value = a[0][a[1]];

    }

    var n = getType( type, o );

    if(n !== null ){
        if( ref ) n.setReferency( a[0], a[1] );
        return n;
    }
    

}

function autoType () {

    var a = arguments;

    var type = 'Slide';

    if(a[2].type) type = a[2].type;

    return type;

}

var REVISION = '1.0';

/**
 * @author lo-th / https://github.com/lo-th
 */

function Gui ( o ) {

    o = o || {};

    // css plus
    this.css = o.css !== undefined ? o.css : '';

    // size define
    this.size = Tools.size;
    if( o.p !== undefined ) this.size.p = o.p;
    if( o.w !== undefined ) this.size.w = o.w;
    if( o.h !== undefined ) this.size.h = o.h;
    if( o.s !== undefined ) this.size.s = o.s;

    this.size.h = this.size.h < 11 ? 11 : this.size.h;

    this.width = this.size.w;

    // bottom height
    this.bh = this.size.h;




    //this.width = o.width !== undefined ? o.width : Tools.size.width;
    //this.width = o.size !== undefined ? o.size : this.width;


    // tmp variable
    this.height = 0;
    this.left = 0;
    this.h = 0;
    this.prevY = -1;
    this.sw = 0;


    // color
    this.colors = Tools.colors;
    this.bg = o.bg || Tools.colors.background;

    // bottom and close height
    this.isWithClose = true;
    

    //this.baseH = Tools.size.height;

    if(o.close !== undefined ){
        this.isWithClose = o.close;
        this.bh = !this.isWithClose ? 0 : this.bh;
    }



    

    Tools.main = this;

    this.callback = o.callback  === undefined ? null : o.callback;

   
    
    this.isCenter = o.center || false;
    this.lockwheel = false;
    this.onWheel = false;
    this.isOpen = true;

    this.uis = [];

    this.content = Tools.dom( 'div', Tools.css.basic + 'display:block; width:'+this.width+'px; height:auto; top:0; right:10px; transition:height 0.1s ease-out;' + this.css );
    if( o.parent !== undefined ) o.parent.appendChild( this.content );
    else document.body.appendChild( this.content );

    this.innerContent = Tools.dom( 'div', Tools.css.basic + 'width:100%; top:0; left:0; height:auto; overflow:hidden;');
    this.content.appendChild( this.innerContent );

    this.inner = Tools.dom( 'div', Tools.css.basic + 'width:100%; top:0; left:0; height:auto; background:'+this.bg+';');
    this.innerContent.appendChild(this.inner);
    this.inner.name = 'inner';

    // scroll background
    this.scrollBG = Tools.dom( 'div', Tools.css.basic + 'right:0; top:0; width:'+this.size.s+'px; height:10px; cursor:s-resize; pointer-events:auto; display:none; background:'+this.bg+'; border-left:1px solid '+this.colors.stroke+';');
    this.content.appendChild( this.scrollBG );
    this.scrollBG.name = 'scroll';

    // scroll
    this.scroll = Tools.dom( 'div', Tools.css.basic + 'background:'+this.colors.scroll+'; right:0px; top:0; width:'+this.size.s+'px; height:10px;');
    this.scrollBG.appendChild( this.scroll );

    this.bottom = Tools.dom( 'div',  Tools.css.txt + 'width:100%; top:auto; bottom:0; left:0; border-bottom-right-radius:10px;  border-bottom-left-radius:10px; text-align:center; pointer-events:auto; cursor:pointer; height:'+this.bh+'px; line-height:'+(this.bh-5)+'px; border-top:1px solid '+Tools.colors.stroke+';');
    this.content.appendChild(this.bottom);
    this.bottom.textContent = 'close';
    this.bottom.name = 'bottom';
    this.bottom.style.background = this.bg;
    
    this.isDown = false;
    this.isScroll = false;

    this.callbackClose = function(){};

    this.content.addEventListener( 'mousedown', this, false );
    this.content.addEventListener( 'mousemove', this, false );
    this.content.addEventListener( 'mouseout',  this, false );
    this.content.addEventListener( 'mouseup',   this, false );
    this.content.addEventListener( 'mouseover', this, false );

    //console.log(this.content.getBoundingClientRect().top);

    this.top = o.top || this.content.getBoundingClientRect().top;
    //this.content.addEventListener( 'mousewheel', this, false );

    document.addEventListener( 'mousewheel', function(e){this.wheel(e);}.bind(this), false );
    window.addEventListener("resize", function(e){this.resize(e);}.bind(this), false );

    //

    this.setWidth( this.width );

}

Gui.prototype = {

    constructor: Gui,

    setText: function ( size, color, font ) {

        Tools.setText( size, color, font );

    },

    hide : function (b) {

        if(b) this.content.style.display = 'none';
        else this.content.style.display = 'block';
        
    },

    setBG : function(c){

        this.bg = c;

        /*var i = this.uis.length;
        while(i--){
            this.uis[i].setBG(c);
        }*/

        this.innerstyle.background = this.bg;
        this.bottom.style.background = this.bg;

    },

    getHTML : function(){

        return this.content;

    },

    onChange : function( f ){

        this.callback = f;
        return this;

    },

    handleEvent : function( e ) {

        //e.preventDefault();
        //e.stopPropagation();

        switch( e.type ) {
            case 'mousedown': this.down( e ); break;
            case 'mouseout': this.out( e ); break;
            case 'mouseover': this.over( e ); break;
            //case 'mousewheel': this.wheel( e ); break;

            case 'mouseup': this.up( e ); break;
            case 'mousemove': this.move( e ); break;
        }

    },

    // Mouse event

    down: function( e ){

        if( !e.target.name ) return;

        if(e.target.name === 'scroll'){
            this.isDown = true;
            this.move( e );
            document.addEventListener( 'mouseup', this, false );
            document.addEventListener( 'mousemove', this, false );
        }
        if(e.target.name === 'bottom'){
            this.isOpen = this.isOpen ? false : true;
            this.bottom.textContent = this.isOpen ? 'close' : 'open';
            this.testHeight();
        }
        
    },

    move: function( e ){

        if(!this.isDown) return;
        this.scroll.style.background = this.colors.down;
        this.update( (e.clientY-this.top)-(this.sh*0.5) );

    },

    

    out: function( e ){

        if( !e.target.name ) return;

        if(e.target.name === 'scroll'){
            this.scroll.style.background = this.colors.scroll;
        }

        if(e.target.name === 'bottom'){
            this.bottom.style.color = '#CCC';
        }

    },

    up: function( e ){

        this.isDown = false;
        this.scroll.style.background = this.colors.scroll;
        document.removeEventListener( 'mouseup', this, false );
        document.removeEventListener( 'mousemove', this, false );

    },

    over: function( e ){

        if( !e.target.name ) return;
        if(e.target.name === 'scroll'){
            this.scroll.style.background = this.colors.select;
        }
        if(e.target.name === 'bottom'){
            this.bottom.style.color = '#FFF';
        }

    },

    // Wheel event

    wheel: function ( e ){

        //e.preventDefault();
        //e.stopPropagation();

        if( this.lockwheel || !this.isScroll ) return;

        //this.onWheel = true;

        var x = e.clientX;
        var px = this.content.getBoundingClientRect().left;

        if(x<px) return;
        if(x>(px+this.width)) return;

        var delta = 0;
        if(e.wheelDeltaY) delta = -e.wheelDeltaY*0.04;
        else if(e.wheelDelta) delta = -e.wheelDelta*0.2;
        else if(e.detail) delta = e.detail*4.0;

        this.py += delta;

        this.update( this.py );

    },

    // -----------------------------------

    // Add node to gui

    add:function(){

        var a = arguments;

        if( typeof a[1] === 'object' ){ 

            a[1].isUI = true;
            a[1].main = this;

        } else if( typeof a[1] === 'string' ){

            if( a[2] === undefined ) [].push.call(a, { isUI:true, main:this });
            else {
                a[2].isUI = true;
                a[2].main = this;
            }
            
        } 


        var n = add.apply( this, a );
        //var n = UIL.add( ...args );

        this.uis.push( n );
        n.py = this.h;

        if( !n.autoWidth ){
            var y = n.c[0].getBoundingClientRect().top;
            if( this.prevY !== y ){
                this.calc( n.h + 1 );
                this.prevY = y;
            }
        }else{
            this.prevY = -1;
            this.calc( n.h + 1 );
        }

        return n;
    },

    // remove one node

    remove: function ( n ) { 

        var i = this.uis.indexOf( n ); 
        if ( i !== -1 ) this.uis[i].clear();

    },

    // call after uis clear

    clearOne: function ( n ) { 

        var i = this.uis.indexOf( n ); 
        if ( i !== -1 ) {
            this.inner.removeChild( this.uis[i].c[0] );
            this.uis.splice( i, 1 ); 
        }

    },

    // clear all gui

    clear:function(){

        var i = this.uis.length;
        while(i--) this.uis[i].clear();

        this.uis = [];
        Tools.listens = [];

        this.calc( - this.h );

    },

    // -----------------------------------

    // Scroll

    update: function ( y ){

        y = y < 0 ? 0 :y;
        y = y > this.range ? this.range : y;

        this.inner.style.top = - Math.floor( y / this.ratio ) + 'px';
        this.scroll.style.top = Math.floor( y ) + 'px';

        this.py = y;

        //this.onWheel = false;

    },

    showScroll:function(h){

        this.isScroll = true;
        this.sw = this.size.s;

        this.total = this.h;
        this.maxView = this.maxHeight;// - this.height;

        this.ratio = this.maxView / this.total;
        this.sh = this.maxView * this.ratio;

        if( this.sh < 20 ) this.sh = 20;

        this.range = this.maxView - this.sh;

        this.scrollBG.style.display = 'block';
        this.scrollBG.style.height = this.maxView + 'px';
        this.scroll.style.height = this.sh + 'px';

        

        this.setItemWidth( this.width - this.sw );

        this.update( 0 );

    },

    hideScroll:function(){

        this.isScroll = false;
        this.sw = 0;
        

        this.setItemWidth( this.width - this.sw );

        this.update( 0 );

        this.scrollBG.style.display = 'none';

    },

    // -----------------------------------

    resize:function(e){

        this.testHeight();

    },

    calc:function( y ) {

        this.h += y;
        clearTimeout( this.tmp );
        this.tmp = setTimeout( this.testHeight.bind(this), 10 );

    },

    testHeight:function(){

        if( this.tmp ) clearTimeout( this.tmp );

        this.height = this.top + this.bh;

        if( this.isOpen ){

            this.maxHeight = window.innerHeight - this.top - this.bh;

            if( this.h > this.maxHeight ){

                this.height = this.maxHeight + this.bh;
                this.showScroll();

            }else{

                this.height = this.h + this.bh;
                this.hideScroll();

            }

        } else {

            this.height = this.bh;
            this.hideScroll();

        }

        this.innerContent.style.height = this.height - this.bh + 'px';
        this.content.style.height = this.height + 'px';
        this.bottom.style.top = this.height - this.bh + 'px';

    },

    setWidth: function( w ) {

        if( w ) this.width = w;
        this.content.style.width = this.width + 'px';

        //console.log(this.width)


        if( this.isCenter ) this.content.style.marginLeft = -(~~ (this.width*0.5)) + 'px';

        this.setItemWidth( this.width - this.sw );

        /*var l = this.uis.length;
        var i = l;
        while(i--){
            this.uis[i].setSize( this.width );
        }

        i = l;
        while(i--){
            this.uis[i].rSize();
        }*/

        this.resize();

    },

    setItemWidth: function( w ){

        var i = this.uis.length;
        while(i--){
            this.uis[i].setSize( w );
            this.uis[i].rSize();
        }

    },


};




/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTExNWJjMTY1YzA5NzRkMDBiYTIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZGVtb3MvZGVtby50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3Rlcm1pbmFsLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9lbnYudHMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvY29sb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW9zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9kZW1vcy90ZWFwb3QudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW9zL29yYi50cyIsIndlYnBhY2s6Ly8vL1VzZXJzL24udmluYXlha2FuL3dvcmtzcGFjZS91aWwvYnVpbGQvdWlsLm1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7OztBQ3ZM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LDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0M7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsNkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUwsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsOEVBQThFLHVCQUF1QixxQkFBcUIsZ0JBQWdCLDZDQUE2Qyw4QkFBOEI7QUFDck4sNEVBQTRFLHFDQUFxQyxxQkFBcUIsZ0JBQWdCLDhCQUE4Qjs7QUFFcEw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFFQUFxRTtBQUNyRSw0RUFBNEUsZ0JBQWdCLGNBQWM7O0FBRTFHO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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QTZGO0FBQzdGLDJDQUEyQzs7QUFFM0MseUNBQXlDO0FBQ3pDLDZEQUE2RDs7QUFFN0Qsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyw4Q0FBOEM7QUFDOUMsMENBQTBDO0FBQzFDOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQSw2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBLDRDO0FBQ0EsZ0U7QUFDQSw4QjtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFF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QUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7OztBQUlBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsYUFBYTs7QUFFYjtBQUNBOztBQUVBOztBQUVBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7OztBQUdMOztBQUVRIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTExNWJjMTY1YzA5NzRkMDBiYTIiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBEZW1vIHtcbiAgICBcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVtb3MvZGVtby50cyIsImltcG9ydCB7IFRlcm1pbmFsIH0gZnJvbSAnLi91dGlscy90ZXJtaW5hbCc7XG5pbXBvcnQgeyBkZW1vcyB9IGZyb20gXCIuL2RlbW9zL2luZGV4XCJcbmltcG9ydCAqIGFzIFVJTCBmcm9tIFwiLi4vLi4vLi4vLi4vdWlsXCI7XG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBjcmVhdGVHVUkoKTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRGVtbyhkZW1vKSB7XG4gICAgY29uc29sZS5sb2coZGVtbyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdVSSgpIHtcbiAgICBjb25zdCBkZW1vTGlzdCA9IGRlbW9zLm1hcChkZW1vID0+ICh7bGFiZWw6ZGVtby5OQU1FLCBjbGFzczpkZW1vfSkpO1xuICAgIFRlcm1pbmFsLmluZm8oXCJDcmVhdGluZyBHVUlcIik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzE0MTQxNFwiO1xuICAgIHZhciB1aTphbnkgPSBuZXcgVUlMLkd1aSggeyBjc3M6J3RvcDoxMHB4OyBsZWZ0OjEzMHB4OycsIHNpemU6MzAwLCBjZW50ZXI6dHJ1ZSB9ICk7XG4gICAgdWkuYWRkKCd0aXRsZScsIHsgbmFtZTonUmFkZW9uUmF5cyArIFRocmVlLmpzJ30pO1xuICAgIHVpLmFkZCgnbGlzdCcsIHsgbmFtZTonRGVtbycsIGNhbGxiYWNrOmNoYW5nZURlbW8sIGxpc3Q6ZGVtb0xpc3R9KTtcbn1cblxubWFpbigpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXgudHMiLCJpbXBvcnQge2lzTm9kZX0gZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQge0NvbG9yLCBIZXhDb2xvcn0gZnJvbSBcIi4vY29sb3JcIjtcbi8qKlxuICogQ3JlYXRlZCBieSBuLnZpbmF5YWthbiBvbiAwNi4wNi4xNy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlcm1pbmFsIHtcblxuICAgIHN0YXRpYyBzaWxlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzdGF0aWMgaGlzdG9yeTogc3RyaW5nID0gXCJcIjtcbiAgICBzdGF0aWMgYnJvd3NlclN0eWxlcyA9IHtcbiAgICAgICAgdGV4dDogSGV4Q29sb3JbQ29sb3IuREVGQVVMVF9URVhUXSxcbiAgICAgICAgYmFja2dyb3VuZDogSGV4Q29sb3JbQ29sb3IuREVGQVVMVF9CR10sXG4gICAgICAgIGJvbGQ6IGZhbHNlXG4gICAgfTtcbiAgICBzdGF0aWMgYnJvd3NlckJ1ZmZlciA9IFtdO1xuXG4gICAgc3RhdGljIGxvZyh0ZXh0KSB7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKHRleHQgKyBcIlxcblwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgd3JpdGUodGV4dCkge1xuICAgICAgICBUZXJtaW5hbC5oaXN0b3J5ICs9IHRleHQ7XG4gICAgICAgIGlmIChUZXJtaW5hbC5zaWxlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSh0ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRzID0gW107XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlcyA9IFtdO1xuICAgICAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJCdWZmZXIuZm9yRWFjaChsb2cgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0cy5wdXNoKGxvZy50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzLnB1c2gobG9nLnN0eWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShudWxsLCBbdGV4dHMuam9pbihcIlwiKV0uY29uY2F0KHN0eWxlcykgKTtcbiAgICAgICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyQnVmZmVyID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJCdWZmZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGAlYyR7dGV4dH1gLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogYGJhY2tncm91bmQ6ICR7VGVybWluYWwuYnJvd3NlclN0eWxlcy5iYWNrZ3JvdW5kfTtgICtcbiAgICAgICAgICAgICAgICAgICAgYGNvbG9yOiAke1Rlcm1pbmFsLmJyb3dzZXJTdHlsZXMudGV4dH07YCArXG4gICAgICAgICAgICAgICAgICAgIGBmb250LXdlaWdodDogJHtUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJvbGQgPyBcIjcwMFwiIDogXCIxMDBcIn07YFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgdGltZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFUZXJtaW5hbC5zaWxlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZShuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyB0aW1lRW5kKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIVRlcm1pbmFsLnNpbGVudCkge1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJHQ29sb3IoY29sb3IpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3Rkb3V0LmlzVFRZKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFxceDFCWzQ4OzU7JHtjb2xvciA9PT0gbnVsbCA/IFwiXCIgOiBjb2xvcn1tYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJhY2tncm91bmQgPSBIZXhDb2xvcltjb2xvcl07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0VGV4dENvbG9yKGNvbG9yKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLnN0ZG91dC5pc1RUWSkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBcXHgxQlszODs1OyR7Y29sb3J9bWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVGVybWluYWwuYnJvd3NlclN0eWxlcy50ZXh0ID0gSGV4Q29sb3JbY29sb3JdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJvbGRUZXh0KCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5zdGRvdXQuaXNUVFkpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgXFx4MUJbMzg7MW1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJTdHlsZXMuYm9sZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXJDb2xvcigpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3Rkb3V0LmlzVFRZKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFxceDFCWzBtYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLnRleHQgPSBIZXhDb2xvcltDb2xvci5ERUZBVUxUX1RFWFRdO1xuICAgICAgICAgICAgVGVybWluYWwuYnJvd3NlclN0eWxlcy5iYWNrZ3JvdW5kID0gXCJub25lXCI7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJvbGQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBlcnJvcihjb250ZW50OiBFcnJvciB8IHN0cmluZykge1xuICAgICAgICBUZXJtaW5hbC5zZXRCR0NvbG9yKENvbG9yLlJFRCk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5XSElURSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIEVSUk9SIFwiKTtcbiAgICAgICAgVGVybWluYWwuY2xlYXJDb2xvcigpO1xuICAgICAgICBUZXJtaW5hbC5zZXRUZXh0Q29sb3IoQ29sb3IuUkVEKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdhcm4oY29udGVudDogYW55KSB7XG4gICAgICAgIFRlcm1pbmFsLnNldEJHQ29sb3IoQ29sb3IuT1JBTkdFKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLldISVRFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgV0FSTklORyBcIik7XG4gICAgICAgIFRlcm1pbmFsLmNsZWFyQ29sb3IoKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLk9SQU5HRSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIFwiKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUodHlwZW9mIGNvbnRlbnQgIT09IFwic3RyaW5nXCIgPyBKU09OLnN0cmluZ2lmeShjb250ZW50KSA6IGNvbnRlbnQpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZShcIlxcblwiKTtcbiAgICAgICAgVGVybWluYWwuY2xlYXJDb2xvcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdWNjZXNzKGNvbnRlbnQ6IGFueSkge1xuICAgICAgICBUZXJtaW5hbC5zZXRCR0NvbG9yKENvbG9yLkdSRUVOKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLldISVRFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgU1VDQ0VTUyBcIik7XG4gICAgICAgIFRlcm1pbmFsLmNsZWFyQ29sb3IoKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLkdSRUVOKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluZm8oY29udGVudDogYW55KSB7XG4gICAgICAgIFRlcm1pbmFsLnNldEJHQ29sb3IoQ29sb3IuQkxVRSk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5XSElURSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIElORk8gXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5CTFVFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzL3Rlcm1pbmFsLnRzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG4udmluYXlha2FuIG9uIDA2LjA2LjE3LlxuICovXG4vL3RzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGlzQnJvd3NlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT13aW5kb3c7fWNhdGNoKGUpeyByZXR1cm4gZmFsc2U7fVwiKSgpO1xuLy90c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBpc1dvcmtlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT1zZWxmICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJzt9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlO31cIikoKTtcbi8vdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgaXNOb2RlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcHJvY2Vzcy5zdGRvdXQgIT09IFwidW5kZWZpbmVkXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvZW52LnRzIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlZCBieSBuLnZpbmF5YWthbiBvbiAwNi4wNi4xNy5cbiAqL1xuZXhwb3J0IGNvbnN0IENvbG9yID0ge1xuICAgIERFRkFVTFRfVEVYVDogMTIsXG4gICAgREVGQVVMVF9CRzogOCxcbiAgICBCTEFDSzogMCxcbiAgICBXSElURTogMjU1LFxuICAgIEJPTEQ6IDEsXG4gICAgUkVEOiAxLFxuICAgIEdSRUVOOiAyLFxuICAgIFlFTExPVzogMyxcbiAgICBCTFVFOiA0LFxuICAgIE1BR0VOVEE6IDUsXG4gICAgT1JBTkdFOiAyMDgsXG59O1xuXG5jb25zdCBoZXhDb2xvciA9IHt9O1xuaGV4Q29sb3JbQ29sb3IuREVGQVVMVF9URVhUXSA9IFwiIzAwMDAwMFwiO1xuaGV4Q29sb3JbQ29sb3IuREVGQVVMVF9CR10gPSBcIiNGRkZGRkZcIjtcbmhleENvbG9yW0NvbG9yLkJMQUNLXSA9IFwiIzAwMDAwMFwiO1xuaGV4Q29sb3JbQ29sb3IuV0hJVEVdID0gXCIjRkZGRkZGXCI7XG5oZXhDb2xvcltDb2xvci5CT0xEXSA9IFwiXCI7XG5oZXhDb2xvcltDb2xvci5SRURdID0gXCIjRkYwMDAwXCI7XG5oZXhDb2xvcltDb2xvci5HUkVFTl0gPSBcIiMwMEZGMDBcIjtcbmhleENvbG9yW0NvbG9yLkJMVUVdID0gXCIjNGJhZGZmXCI7XG5oZXhDb2xvcltDb2xvci5ZRUxMT1ddID0gXCIjRkZGNjAwXCI7XG5oZXhDb2xvcltDb2xvci5NQUdFTlRBXSA9IFwiI0ZGMDBGRlwiO1xuaGV4Q29sb3JbQ29sb3IuT1JBTkdFXSA9IFwiI0ZGOEMwMFwiO1xuZXhwb3J0IGNvbnN0IEhleENvbG9yID0gaGV4Q29sb3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvY29sb3IudHMiLCJpbXBvcnQgeyBUZWFwb3REZW1vIH0gZnJvbSAnLi90ZWFwb3QnO1xuaW1wb3J0IHsgT3JiUmFkZW9uUmF5c0RlbW8gfSBmcm9tICcuL29yYic7XG5leHBvcnQgY29uc3QgZGVtb3MgPSBbXG4gICAgT3JiUmFkZW9uUmF5c0RlbW8sXG4gICAgVGVhcG90RGVtbyxcbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVtb3MvaW5kZXgudHMiLCJpbXBvcnQgeyBEZW1vIH0gZnJvbSAnLi9kZW1vJztcbmV4cG9ydCBjbGFzcyBUZWFwb3REZW1vIGV4dGVuZHMgRGVtbyB7XG4gICAgc3RhdGljIE5BTUU6c3RyaW5nID0gXCJUZWFwb3RcIjtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVtb3MvdGVhcG90LnRzIiwiaW1wb3J0IHsgRGVtbyB9IGZyb20gJy4vZGVtbyc7XG5leHBvcnQgY2xhc3MgT3JiUmFkZW9uUmF5c0RlbW8gZXh0ZW5kcyBEZW1vIHtcbiAgICBzdGF0aWMgTkFNRTpzdHJpbmcgPSBcIk9yYiBSYWRlb25SYXlzXCI7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2RlbW9zL29yYi50cyIsIi8vIFBvbHlmaWxsc1xuXG5pZiAoIE51bWJlci5FUFNJTE9OID09PSB1bmRlZmluZWQgKSB7XG5cblx0TnVtYmVyLkVQU0lMT04gPSBNYXRoLnBvdyggMiwgLSA1MiApO1xuXG59XG5cbi8vXG5cbmlmICggTWF0aC5zaWduID09PSB1bmRlZmluZWQgKSB7XG5cblx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTWF0aC9zaWduXG5cblx0TWF0aC5zaWduID0gZnVuY3Rpb24gKCB4ICkge1xuXG5cdFx0cmV0dXJuICggeCA8IDAgKSA/IC0gMSA6ICggeCA+IDAgKSA/IDEgOiArIHg7XG5cblx0fTtcblxufVxuXG5pZiAoIEZ1bmN0aW9uLnByb3RvdHlwZS5uYW1lID09PSB1bmRlZmluZWQgKSB7XG5cblx0Ly8gTWlzc2luZyBpbiBJRTktMTEuXG5cdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL25hbWVcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoIEZ1bmN0aW9uLnByb3RvdHlwZSwgJ25hbWUnLCB7XG5cblx0XHRnZXQ6IGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0cmV0dXJuIHRoaXMudG9TdHJpbmcoKS5tYXRjaCggL15cXHMqZnVuY3Rpb25cXHMqKFteXFwoXFxzXSopLyApWyAxIF07XG5cblx0XHR9XG5cblx0fSApO1xuXG59XG5cbmlmICggT2JqZWN0LmFzc2lnbiA9PT0gdW5kZWZpbmVkICkge1xuXG5cdC8vIE1pc3NpbmcgaW4gSUUuXG5cdC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cblxuXHQoIGZ1bmN0aW9uICgpIHtcblxuXHRcdE9iamVjdC5hc3NpZ24gPSBmdW5jdGlvbiAoIHRhcmdldCApIHtcblxuXHRcdFx0J3VzZSBzdHJpY3QnO1xuXG5cdFx0XHRpZiAoIHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCApIHtcblxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCAnQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0JyApO1xuXG5cdFx0XHR9XG5cblx0XHRcdHZhciBvdXRwdXQgPSBPYmplY3QoIHRhcmdldCApO1xuXG5cdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAxOyBpbmRleCA8IGFyZ3VtZW50cy5sZW5ndGg7IGluZGV4ICsrICkge1xuXG5cdFx0XHRcdHZhciBzb3VyY2UgPSBhcmd1bWVudHNbIGluZGV4IF07XG5cblx0XHRcdFx0aWYgKCBzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwgKSB7XG5cblx0XHRcdFx0XHRmb3IgKCB2YXIgbmV4dEtleSBpbiBzb3VyY2UgKSB7XG5cblx0XHRcdFx0XHRcdGlmICggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKCBzb3VyY2UsIG5leHRLZXkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRvdXRwdXRbIG5leHRLZXkgXSA9IHNvdXJjZVsgbmV4dEtleSBdO1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvdXRwdXQ7XG5cblx0XHR9O1xuXG5cdH0gKSgpO1xuXG59XG5cbi8qKlxuICogQGF1dGhvciBsby10aCAvIGh0dHBzOi8vZ2l0aHViLmNvbS9sby10aFxuICovXG5cbnZhciBUb29scyA9IHtcblxuICAgIG1haW46IG51bGwsXG5cbiAgICBkb2M6IGRvY3VtZW50LFxuICAgIGZyYWc6IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSxcblxuICAgIFVSTDogd2luZG93LlVSTCB8fCB3aW5kb3cud2Via2l0VVJMLFxuXG4gICAgaXNMb29wOiBmYWxzZSxcbiAgICBsaXN0ZW5zOiBbXSxcblxuICAgIHN2Z25zOiBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgaHRtbHM6IFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiLFxuXG4gICAgRE9NX1NJWkU6IFsgJ2hlaWdodCcsICd3aWR0aCcsICd0b3AnLCAnbGVmdCcsICdib3R0b20nLCAncmlnaHQnLCAnbWFyZ2luLWxlZnQnLCAnbWFyZ2luLXJpZ2h0JywgJ21hcmdpbi10b3AnLCAnbWFyZ2luLWJvdHRvbSddLFxuICAgIFNWR19UWVBFX0Q6IFsgJ3BhdHRlcm4nLCAnZGVmcycsICd0cmFuc2Zvcm0nLCAnc3RvcCcsICdhbmltYXRlJywgJ3JhZGlhbEdyYWRpZW50JywgJ2xpbmVhckdyYWRpZW50JywgJ2FuaW1hdGVNb3Rpb24nIF0sXG4gICAgU1ZHX1RZUEVfRzogWyAncmVjdCcsICdjaXJjbGUnLCAncGF0aCcsICdwb2x5Z29uJywgJ3RleHQnLCAnZycsICdsaW5lJywgJ2ZvcmVpZ25PYmplY3QnIF0sXG5cbiAgICBzaXplOiB7XG4gICAgICAgIFxuICAgICAgICB3OiAyNDAsXG4gICAgICAgIGg6IDIwLFxuICAgICAgICBwOiAzMCxcbiAgICAgICAgczogMjAsXG5cbiAgICB9LFxuXG4gICAgLy8gY29sb3JzXG5cbiAgICBjb2xvcnM6IHtcblxuICAgICAgICB0ZXh0IDogJyNDMEMwQzAnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSg0NCw0NCw0NCwwLjMpJyxcblxuICAgICAgICBib3JkZXIgOiAnIzRmNGY0ZicsXG4gICAgICAgIGJvcmRlclNlbGVjdCA6ICcjMzA4QUZGJyxcblxuICAgICAgICBidXR0b24gOiAnIzQwNDA0MCcsXG4gICAgICAgIGJvb2xiZyA6ICcjMTgxODE4JyxcblxuICAgICAgICBzZWxlY3QgOiAnIzMwOEFGRicsXG4gICAgICAgIG1vdmluZyA6ICcjMDNhZmZmJyxcbiAgICAgICAgZG93biA6ICcjMDI0Njk5JyxcblxuICAgICAgICBzdHJva2U6ICcjNjA2MDYwJywvLydyZ2JhKDEyMCwxMjAsMTIwLDAuNiknLFxuICAgICAgICBzY3JvbGw6ICcjMzMzMzMzJyxcblxuICAgIH0sXG5cbiAgICAvLyBzdHlsZSBjc3NcblxuICAgIGNzcyA6IHtcbiAgICAgICAgYmFzaWM6ICctby11c2VyLXNlbGVjdDpub25lOyAtbXMtdXNlci1zZWxlY3Q6bm9uZTsgLWtodG1sLXVzZXItc2VsZWN0Om5vbmU7IC13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTsgLW1vei11c2VyLXNlbGVjdDpub25lOycgKyAncG9zaXRpb246YWJzb2x1dGU7IHBvaW50ZXItZXZlbnRzOm5vbmU7IGJveC1zaXppbmc6Ym9yZGVyLWJveDsgbWFyZ2luOjA7IHBhZGRpbmc6MDsgYm9yZGVyOm5vbmU7IG92ZXJmbG93OmhpZGRlbjsgYmFja2dyb3VuZDpub25lOycsXG4gICAgfSxcblxuICAgIC8vIHN2ZyBwYXRoXG5cbiAgICBHUEFUSDogJ00gNyA3IEwgNyA4IDggOCA4IDcgNyA3IE0gNSA3IEwgNSA4IDYgOCA2IDcgNSA3IE0gMyA3IEwgMyA4IDQgOCA0IDcgMyA3IE0gNyA1IEwgNyA2IDggNiA4IDUgNyA1IE0gNiA2IEwgNiA1IDUgNSA1IDYgNiA2IE0gNyAzIEwgNyA0IDggNCA4IDMgNyAzIE0gNiA0IEwgNiAzIDUgMyA1IDQgNiA0IE0gMyA1IEwgMyA2IDQgNiA0IDUgMyA1IE0gMyAzIEwgMyA0IDQgNCA0IDMgMyAzIFonLFxuXG4gICAgc2V0VGV4dCA6IGZ1bmN0aW9uKCBzaXplLCBjb2xvciwgZm9udCApe1xuXG4gICAgICAgIHNpemUgPSBzaXplIHx8IDExO1xuICAgICAgICBjb2xvciA9IGNvbG9yIHx8ICcjQ0NDJztcbiAgICAgICAgZm9udCA9IGZvbnQgfHwgJ1wiQ29uc29sYXNcIiwgXCJMdWNpZGEgQ29uc29sZVwiLCBNb25hY28sIG1vbm9zcGFjZSc7XG5cbiAgICAgICAgVG9vbHMuY29sb3JzLnRleHQgPSBjb2xvcjtcblxuICAgICAgICBUb29scy5jc3MudHh0ID0gVG9vbHMuY3NzLmJhc2ljICsgJ2ZvbnQtZmFtaWx5OicrZm9udCsnOyBmb250LXNpemU6JytzaXplKydweDsgY29sb3I6Jytjb2xvcisnOyBwYWRkaW5nOjJweCAxMHB4OyBsZWZ0OjA7IHRvcDoycHg7IGhlaWdodDoxNnB4OyB3aWR0aDoxMDBweDsgb3ZlcmZsb3c6aGlkZGVuOyB3aGl0ZS1zcGFjZTogbm93cmFwOyc7XG4gICAgICAgIFRvb2xzLmNzcy50eHRlZGl0ID0gVG9vbHMuY3NzLnR4dCArICdwb2ludGVyLWV2ZW50czphdXRvOyBwYWRkaW5nOjJweCA1cHg7IG91dGxpbmU6bm9uZTsgLXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7IC1tb3otYXBwZWFyYW5jZTpub25lOyBib3JkZXI6MXB4IGRhc2hlZCAjNGY0ZjRmOyAtbXMtdXNlci1zZWxlY3Q6ZWxlbWVudDsnO1xuICAgICAgICBUb29scy5jc3MudHh0c2VsZWN0ID0gVG9vbHMuY3NzLnR4dCArICdwb2ludGVyLWV2ZW50czphdXRvOyBwYWRkaW5nOjJweCA1cHg7IG91dGxpbmU6bm9uZTsgLXdlYmtpdC1hcHBlYXJhbmNlOm5vbmU7IC1tb3otYXBwZWFyYW5jZTpub25lOyBib3JkZXI6MXB4IGRhc2hlZCAnICsgVG9vbHMuY29sb3JzLmJvcmRlcisnOyAtbXMtdXNlci1zZWxlY3Q6ZWxlbWVudDsnO1xuICAgICAgICBUb29scy5jc3MudHh0bnVtYmVyID0gVG9vbHMuY3NzLnR4dCArICdsZXR0ZXItc3BhY2luZzotMXB4OyBwYWRkaW5nOjJweCA1cHg7JztcbiAgICAgICAgVG9vbHMuY3NzLml0ZW0gPSBUb29scy5jc3MudHh0ICsgJ3Bvc2l0aW9uOnJlbGF0aXZlOyBiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC4yKTsgbWFyZ2luLWJvdHRvbToxcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyc7XG5cbiAgICB9LFxuXG4gICAgc2V0U3ZnOiBmdW5jdGlvbiggZG9tLCB0eXBlLCB2YWx1ZSwgaWQgKXtcblxuICAgICAgICBpZiggaWQgPT09IC0xICkgZG9tLnNldEF0dHJpYnV0ZU5TKCBudWxsLCB0eXBlLCB2YWx1ZSApO1xuICAgICAgICBlbHNlIGRvbS5jaGlsZE5vZGVzWyBpZCB8fCAwIF0uc2V0QXR0cmlidXRlTlMoIG51bGwsIHR5cGUsIHZhbHVlICk7XG5cbiAgICB9LFxuXG4gICAgc2V0OiBmdW5jdGlvbiggZywgbyApe1xuXG4gICAgICAgIGZvciggdmFyIGF0dCBpbiBvICl7XG4gICAgICAgICAgICBpZiggYXR0ID09PSAndHh0JyApIGcudGV4dENvbnRlbnQgPSBvWyBhdHQgXTtcbiAgICAgICAgICAgIGcuc2V0QXR0cmlidXRlTlMoIG51bGwsIGF0dCwgb1sgYXR0IF0gKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LFxuXG4gICAgZ2V0OiBmdW5jdGlvbiggZG9tLCBpZCApe1xuXG4gICAgICAgIGlmKCBpZCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuIGRvbTsgLy8gcm9vdFxuICAgICAgICBlbHNlIGlmKCAhaXNOYU4oIGlkICkgKSByZXR1cm4gZG9tLmNoaWxkTm9kZXNbIGlkIF07IC8vIGZpcnN0IGNoaWxkXG4gICAgICAgIGVsc2UgaWYoIGlkIGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgICAgIGlmKGlkLmxlbmd0aCA9PT0gMikgcmV0dXJuIGRvbS5jaGlsZE5vZGVzWyBpZFswXSBdLmNoaWxkTm9kZXNbIGlkWzFdIF07XG4gICAgICAgICAgICBpZihpZC5sZW5ndGggPT09IDMpIHJldHVybiBkb20uY2hpbGROb2Rlc1sgaWRbMF0gXS5jaGlsZE5vZGVzWyBpZFsxXSBdLmNoaWxkTm9kZXNbIGlkWzJdIF07XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKnNldERvbSA6IGZ1bmN0aW9uKCBkb20sIHR5cGUsIHZhbHVlICl7XG5cbiAgICAgICAgdmFyIGV4dCA9IFRvb2xzLkRPTV9TSVpFLmluZGV4T2YodHlwZSkgIT09IC0xID8gJ3B4JyA6ICcnO1xuICAgICAgICBkb20uc3R5bGVbdHlwZV0gPSB2YWx1ZSArIGV4dDtcblxuICAgIH0sKi9cblxuICAgIGRvbSA6IGZ1bmN0aW9uICggdHlwZSwgY3NzLCBvYmosIGRvbSwgaWQgKSB7XG5cbiAgICAgICAgdHlwZSA9IHR5cGUgfHwgJ2Rpdic7XG5cbiAgICAgICAgaWYoIFRvb2xzLlNWR19UWVBFX0QuaW5kZXhPZih0eXBlKSAhPT0gLTEgfHwgVG9vbHMuU1ZHX1RZUEVfRy5pbmRleE9mKHR5cGUpICE9PSAtMSApeyAvLyBpcyBzdmcgZWxlbWVudFxuXG4gICAgICAgICAgICAvLyBjcmVhdGUgbmV3IHN2ZyBpZiBub3QgZGVmXG4gICAgICAgICAgICBpZiggZG9tID09PSB1bmRlZmluZWQgKSBkb20gPSBUb29scy5kb2MuY3JlYXRlRWxlbWVudE5TKCBUb29scy5zdmducywgJ3N2ZycgKTtcblxuICAgICAgICAgICAgVG9vbHMuYWRkQXR0cmlidXRlcyggZG9tLCB0eXBlLCBvYmosIGlkICk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHsgLy8gaXMgaHRtbCBlbGVtZW50XG5cbiAgICAgICAgICAgIGlmKCBkb20gPT09IHVuZGVmaW5lZCApIGRvbSA9IFRvb2xzLmRvYy5jcmVhdGVFbGVtZW50TlMoIFRvb2xzLmh0bWxzLCB0eXBlICk7XG4gICAgICAgICAgICBlbHNlIGRvbSA9IGRvbS5hcHBlbmRDaGlsZCggVG9vbHMuZG9jLmNyZWF0ZUVsZW1lbnROUyggVG9vbHMuaHRtbHMsIHR5cGUgKSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZiggY3NzICkgZG9tLnN0eWxlLmNzc1RleHQgPSBjc3M7IFxuXG4gICAgICAgIGlmKCBpZCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuIGRvbTtcbiAgICAgICAgZWxzZSByZXR1cm4gZG9tLmNoaWxkTm9kZXNbIGlkIHx8IDAgXTtcblxuICAgIH0sXG5cbiAgICBhZGRBdHRyaWJ1dGVzIDogZnVuY3Rpb24oIGRvbSwgdHlwZSwgbywgaWQgKXtcblxuICAgICAgICB2YXIgZyA9IFRvb2xzLmRvYy5jcmVhdGVFbGVtZW50TlMoIFRvb2xzLnN2Z25zLCB0eXBlICk7XG4gICAgICAgIFRvb2xzLnNldCggZywgbyApO1xuICAgICAgICBUb29scy5nZXQoIGRvbSwgaWQgKS5hcHBlbmRDaGlsZCggZyApO1xuICAgICAgICBpZiggVG9vbHMuU1ZHX1RZUEVfRy5pbmRleE9mKHR5cGUpICE9PSAtMSApIGcuc3R5bGUucG9pbnRlckV2ZW50cyA9ICdub25lJztcbiAgICAgICAgcmV0dXJuIGc7XG5cbiAgICB9LFxuXG4gICAgY2xlYXIgOiBmdW5jdGlvbiggZG9tICl7XG5cbiAgICAgICAgVG9vbHMucHVyZ2UoIGRvbSApO1xuICAgICAgICB3aGlsZSAoZG9tLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGlmICggZG9tLmZpcnN0Q2hpbGQuZmlyc3RDaGlsZCApIFRvb2xzLmNsZWFyKCBkb20uZmlyc3RDaGlsZCApO1xuICAgICAgICAgICAgZG9tLnJlbW92ZUNoaWxkKCBkb20uZmlyc3RDaGlsZCApOyBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHB1cmdlIDogZnVuY3Rpb24gKCBkb20gKSB7XG5cbiAgICAgICAgdmFyIGEgPSBkb20uYXR0cmlidXRlcywgaSwgbjtcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIGkgPSBhLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICAgICAgbiA9IGFbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRvbVtuXSA9PT0gJ2Z1bmN0aW9uJykgZG9tW25dID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhID0gZG9tLmNoaWxkTm9kZXM7XG4gICAgICAgIGlmIChhKSB7XG4gICAgICAgICAgICBpID0gYS5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZShpLS0peyBcbiAgICAgICAgICAgICAgICBUb29scy5wdXJnZSggZG9tLmNoaWxkTm9kZXNbaV0gKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cblxuXG4gICAgLy8gTE9PUFxuXG4gICAgbG9vcCA6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYoIFRvb2xzLmlzTG9vcCApIHJlcXVlc3RBbmltYXRpb25GcmFtZSggVG9vbHMubG9vcCApO1xuICAgICAgICBUb29scy51cGRhdGUoKTtcblxuICAgIH0sXG5cbiAgICB1cGRhdGUgOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpID0gVG9vbHMubGlzdGVucy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSkgVG9vbHMubGlzdGVuc1tpXS5saXN0ZW5pbmcoKTtcblxuICAgIH0sXG5cbiAgICByZW1vdmVMaXN0ZW4gOiBmdW5jdGlvbiAoIHByb3RvICl7XG5cbiAgICAgICAgdmFyIGlkID0gVG9vbHMubGlzdGVucy5pbmRleE9mKCBwcm90byApO1xuICAgICAgICBUb29scy5saXN0ZW5zLnNwbGljZShpZCwgMSk7XG5cbiAgICAgICAgaWYoIFRvb2xzLmxpc3RlbnMubGVuZ3RoID09PSAwICkgVG9vbHMuaXNMb29wID0gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgYWRkTGlzdGVuIDogZnVuY3Rpb24gKCBwcm90byApe1xuXG4gICAgICAgIHZhciBpZCA9IFRvb2xzLmxpc3RlbnMuaW5kZXhPZiggcHJvdG8gKTtcblxuICAgICAgICBpZiggaWQgIT09IC0xICkgcmV0dXJuOyBcblxuICAgICAgICBUb29scy5saXN0ZW5zLnB1c2goIHByb3RvICk7XG5cbiAgICAgICAgaWYoICFUb29scy5pc0xvb3AgKXtcbiAgICAgICAgICAgIFRvb2xzLmlzTG9vcCA9IHRydWU7XG4gICAgICAgICAgICBUb29scy5sb29wKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gICBDb2xvciBmdW5jdGlvblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIENvbG9yTHVtYSA6IGZ1bmN0aW9uICggaGV4LCBsdW0gKSB7XG5cbiAgICAgICAgLy8gdmFsaWRhdGUgaGV4IHN0cmluZ1xuICAgICAgICBoZXggPSBTdHJpbmcoaGV4KS5yZXBsYWNlKC9bXjAtOWEtZl0vZ2ksICcnKTtcbiAgICAgICAgaWYgKGhleC5sZW5ndGggPCA2KSB7XG4gICAgICAgICAgICBoZXggPSBoZXhbMF0raGV4WzBdK2hleFsxXStoZXhbMV0raGV4WzJdK2hleFsyXTtcbiAgICAgICAgfVxuICAgICAgICBsdW0gPSBsdW0gfHwgMDtcblxuICAgICAgICAvLyBjb252ZXJ0IHRvIGRlY2ltYWwgYW5kIGNoYW5nZSBsdW1pbm9zaXR5XG4gICAgICAgIHZhciByZ2IgPSBcIiNcIiwgYywgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgYyA9IHBhcnNlSW50KGhleC5zdWJzdHIoaSoyLDIpLCAxNik7XG4gICAgICAgICAgICBjID0gTWF0aC5yb3VuZChNYXRoLm1pbihNYXRoLm1heCgwLCBjICsgKGMgKiBsdW0pKSwgMjU1KSkudG9TdHJpbmcoMTYpO1xuICAgICAgICAgICAgcmdiICs9IChcIjAwXCIrYykuc3Vic3RyKGMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZ2I7XG5cbiAgICB9LFxuXG4gICAgZmluZERlZXBJbnZlcjogZnVuY3Rpb24oIHJnYiApeyBcblxuICAgICAgICByZXR1cm4gKHJnYlswXSAqIDAuMyArIHJnYlsxXSAqIC41OSArIHJnYlsyXSAqIC4xMSkgPD0gMC42O1xuICAgICAgICBcbiAgICB9LFxuXG5cbiAgICBoZXhUb0h0bWw6IGZ1bmN0aW9uKHYpeyBcbiAgICAgICAgdiA9IHYgPT09IHVuZGVmaW5lZCA/IDB4MDAwMDAwIDogdjtcbiAgICAgICAgcmV0dXJuIFwiI1wiICsgKFwiMDAwMDAwXCIgKyB2LnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIGh0bWxUb0hleDogZnVuY3Rpb24odil7IFxuXG4gICAgICAgIHJldHVybiB2LnRvVXBwZXJDYXNlKCkucmVwbGFjZShcIiNcIiwgXCIweFwiKTtcblxuICAgIH0sXG5cbiAgICB1MjU1OiBmdW5jdGlvbihjb2xvciwgaSl7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbG9yLnN1YnN0cmluZyhpLCBpICsgMiksIDE2KSAvIDI1NTtcblxuICAgIH0sXG5cbiAgICB1MTY6IGZ1bmN0aW9uKCBjb2xvciwgaSApe1xuXG4gICAgICAgIHJldHVybiBwYXJzZUludChjb2xvci5zdWJzdHJpbmcoaSwgaSArIDEpLCAxNikgLyAxNTtcblxuICAgIH0sXG5cbiAgICB1bnBhY2s6IGZ1bmN0aW9uKCBjb2xvciApe1xuXG4gICAgICAgIGlmIChjb2xvci5sZW5ndGggPT0gNykgcmV0dXJuIFsgVG9vbHMudTI1NShjb2xvciwgMSksIFRvb2xzLnUyNTUoY29sb3IsIDMpLCBUb29scy51MjU1KGNvbG9yLCA1KSBdO1xuICAgICAgICBlbHNlIGlmIChjb2xvci5sZW5ndGggPT0gNCkgcmV0dXJuIFsgVG9vbHMudTE2KGNvbG9yLDEpLCBUb29scy51MTYoY29sb3IsMiksIFRvb2xzLnUxNihjb2xvciwzKSBdO1xuXG4gICAgfSxcblxuICAgIGh0bWxSZ2I6IGZ1bmN0aW9uKCByZ2IgKXtcblxuICAgICAgICByZXR1cm4gJ3JnYignICsgTWF0aC5yb3VuZChyZ2JbMF0gKiAyNTUpICsgJywnKyBNYXRoLnJvdW5kKHJnYlsxXSAqIDI1NSkgKyAnLCcrIE1hdGgucm91bmQocmdiWzJdICogMjU1KSArICcpJztcblxuICAgIH0sXG5cbiAgICByZ2JUb0hleCA6IGZ1bmN0aW9uKCByZ2IgKXtcblxuICAgICAgICByZXR1cm4gJyMnICsgKCAnMDAwMDAwJyArICggKCByZ2JbMF0gKiAyNTUgKSA8PCAxNiBeICggcmdiWzFdICogMjU1ICkgPDwgOCBeICggcmdiWzJdICogMjU1ICkgPDwgMCApLnRvU3RyaW5nKCAxNiApICkuc2xpY2UoIC0gNiApO1xuXG4gICAgfSxcblxuICAgIGh1ZVRvUmdiOiBmdW5jdGlvbiggcCwgcSwgdCApe1xuXG4gICAgICAgIGlmICggdCA8IDAgKSB0ICs9IDE7XG4gICAgICAgIGlmICggdCA+IDEgKSB0IC09IDE7XG4gICAgICAgIGlmICggdCA8IDEgLyA2ICkgcmV0dXJuIHAgKyAoIHEgLSBwICkgKiA2ICogdDtcbiAgICAgICAgaWYgKCB0IDwgMSAvIDIgKSByZXR1cm4gcTtcbiAgICAgICAgaWYgKCB0IDwgMiAvIDMgKSByZXR1cm4gcCArICggcSAtIHAgKSAqIDYgKiAoIDIgLyAzIC0gdCApO1xuICAgICAgICByZXR1cm4gcDtcblxuICAgIH0sXG5cbiAgICByZ2JUb0hzbDogZnVuY3Rpb24ocmdiKXtcblxuICAgICAgICB2YXIgciA9IHJnYlswXSwgZyA9IHJnYlsxXSwgYiA9IHJnYlsyXSwgbWluID0gTWF0aC5taW4ociwgZywgYiksIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBkZWx0YSA9IG1heCAtIG1pbiwgaCA9IDAsIHMgPSAwLCBsID0gKG1pbiArIG1heCkgLyAyO1xuICAgICAgICBpZiAobCA+IDAgJiYgbCA8IDEpIHMgPSBkZWx0YSAvIChsIDwgMC41ID8gKDIgKiBsKSA6ICgyIC0gMiAqIGwpKTtcbiAgICAgICAgaWYgKGRlbHRhID4gMCkge1xuICAgICAgICAgICAgaWYgKG1heCA9PSByICYmIG1heCAhPSBnKSBoICs9IChnIC0gYikgLyBkZWx0YTtcbiAgICAgICAgICAgIGlmIChtYXggPT0gZyAmJiBtYXggIT0gYikgaCArPSAoMiArIChiIC0gcikgLyBkZWx0YSk7XG4gICAgICAgICAgICBpZiAobWF4ID09IGIgJiYgbWF4ICE9IHIpIGggKz0gKDQgKyAociAtIGcpIC8gZGVsdGEpO1xuICAgICAgICAgICAgaCAvPSA2O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbIGgsIHMsIGwgXTtcblxuICAgIH0sXG5cbiAgICBoc2xUb1JnYjogZnVuY3Rpb24oIGhzbCApe1xuXG4gICAgICAgIHZhciBwLCBxLCBoID0gaHNsWzBdLCBzID0gaHNsWzFdLCBsID0gaHNsWzJdO1xuXG4gICAgICAgIGlmICggcyA9PT0gMCApIHJldHVybiBbIGwsIGwsIGwgXTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBxID0gbCA8PSAwLjUgPyBsICogKHMgKyAxKSA6IGwgKyBzIC0gKCBsICogcyApO1xuICAgICAgICAgICAgcCA9IGwgKiAyIC0gcTtcbiAgICAgICAgICAgIHJldHVybiBbIFRvb2xzLmh1ZVRvUmdiKHAsIHEsIGggKyAwLjMzMzMzKSwgVG9vbHMuaHVlVG9SZ2IocCwgcSwgaCksIFRvb2xzLmh1ZVRvUmdiKHAsIHEsIGggLSAwLjMzMzMzKSBdO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gc3ZnIHRvIGNhbnZhcyB0ZXN0IFxuXG4gICAgdG9DYW52YXM6IGZ1bmN0aW9uKCBjYW52YXMsIGNvbnRlbnQsIHcsIGggKXtcblxuICAgICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICB2YXIgZGNvcHkgPSBudWxsO1xuXG4gICAgICAgIGlmKCB0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycgKXtcblxuICAgICAgICAgICAgZGNvcHkgPSBUb29scy5kb20oICdpZnJhbWUnLCAncG9zaXRpb246YWJvbHV0ZTsgbGVmdDowOyB0b3A6MDsgd2lkdGg6Jyt3KydweDsgaGVpZ2h0OicraCsncHg7JyApO1xuICAgICAgICAgICAgZGNvcHkuc3JjID0gY29udGVudDtcblxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGRjb3B5ID0gY29udGVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBkY29weS5zdHlsZS5sZWZ0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdmcgPSBUb29scy5kb20oICdmb3JlaWduT2JqZWN0JywgJ3Bvc2l0aW9uOmFib2x1dGU7IGxlZnQ6MDsgdG9wOjA7JywgeyB3aWR0aDp3LCBoZWlnaHQ6aCB9KTtcblxuICAgICAgICBzdmcuY2hpbGROb2Rlc1swXS5hcHBlbmRDaGlsZCggZGNvcHkgKTtcbiAgICAgICAgXG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2ZXJzaW9uXCIsIFwiMS4xXCIpO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxucycsICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShcInhtbG5zOnhsaW5rXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiKTtcblxuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHcgKTtcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaCApO1xuICAgICAgICBzdmcuY2hpbGROb2Rlc1swXS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnICk7XG4gICAgICAgIHN2Zy5jaGlsZE5vZGVzWzBdLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzEwMCUnICk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhzdmcpXG5cbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBcblxuICAgICAgICB2YXIgZGF0YSA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LCcrIHdpbmRvdy5idG9hKChuZXcgWE1MU2VyaWFsaXplcikuc2VyaWFsaXplVG9TdHJpbmcoc3ZnKSk7XG4gICAgICAgIGRjb3B5ID0gbnVsbDtcblxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjdHguY2xlYXJSZWN0KCAwLCAwLCB3LCBoICk7XG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKCBpbWcsIDAsIDAsIHcsIGgsIDAsIDAsIHcsIGggKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGltZy5zcmMgPSBkYXRhO1xuXG4gICAgICAgIC8qc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoIDAsIDAsIHcsIGggKTtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltZywgMCwgMCwgdywgaCwgMCwgMCwgdywgaCApO1xuICAgICAgICB9LCAwKTsqL1xuXG4gICAgICAgIC8vIGJsb2JcblxuICAgICAgICAvKnZhciBzdmdCbG9iID0gbmV3IEJsb2IoWyhuZXcgWE1MU2VyaWFsaXplcikuc2VyaWFsaXplVG9TdHJpbmcoc3ZnKV0sIHt0eXBlOiBcImltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOFwifSk7XG4gICAgICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN2Z0Jsb2IpO1xuXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoIDAsIDAsIHcsIGggKTtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltZywgMCwgMCwgdywgaCwgMCwgMCwgdywgaCApO1xuICAgICAgICAgICAgVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgICAgICB9O1xuICAgICAgICBpbWcuc3JjID0gdXJsOyovXG5cbiAgICB9LFxuXG59O1xuXG5Ub29scy5zZXRUZXh0KCk7XG5cbi8qKlxuICogQGF1dGhvciBsby10aCAvIGh0dHBzOi8vZ2l0aHViLmNvbS9sby10aFxuICovXG5cbmZ1bmN0aW9uIFByb3RvICggbyApIHtcblxuICAgIG8gPSBvIHx8IHt9O1xuXG4gICAgdGhpcy5tYWluID0gby5tYWluIHx8IG51bGw7XG4gICAgLy8gaWYgaXMgb24gdWkgcGFubmVsXG4gICAgdGhpcy5pc1VJID0gby5pc1VJIHx8IGZhbHNlO1xuXG4gICAgLy8gcGVyY2VudCBvZiB0aXRsZVxuICAgIHRoaXMucCA9IG8ucCAhPT0gdW5kZWZpbmVkID8gby5wIDogVG9vbHMuc2l6ZS5wO1xuXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuaXNVSSA/IHRoaXMubWFpbi5zaXplLncgOiBUb29scy5zaXplLnc7XG4gICAgaWYoIG8udyAhPT0gdW5kZWZpbmVkICkgdGhpcy53aWR0aCA9IG8udztcblxuICAgIHRoaXMuaCA9IHRoaXMuaXNVSSA/IHRoaXMubWFpbi5zaXplLmggOiBUb29scy5zaXplLmg7XG4gICAgaWYoIG8uaCAhPT0gdW5kZWZpbmVkICkgdGhpcy5oID0gby5oO1xuICAgIHRoaXMuaCA9IHRoaXMuaCA8IDExID8gMTEgOiB0aGlzLmg7XG5cbiAgICAvLyBpZiBuZWVkIHJlc2l6ZSB3aWR0aFxuICAgIHRoaXMuYXV0b1dpZHRoID0gdHJ1ZTtcblxuICAgIC8vIGlmIG5lZWQgcmVzaXplIGhlaWdodFxuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cbiAgICB0aGlzLmlzR3JvdXAgPSBmYWxzZTtcbiAgICB0aGlzLnBhcmVudEdyb3VwID0gbnVsbDtcblxuICAgIC8vIGlmIGhlaWdodCBjYW4gY2hhbmdlXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gZmFsc2U7XG5cbiAgICAvLyByYWRpdXMgZm9yIHRvb2xib3hcbiAgICB0aGlzLnJhZGl1cyA9IG8ucmFkaXVzIHx8IDA7XG5cbiAgICBcblxuICAgIC8vIG9ubHkgZm9yIG51bWJlclxuICAgIHRoaXMuaXNOdW1iZXIgPSBmYWxzZTtcblxuICAgIC8vIG9ubHkgbW9zdCBzaW1wbGUgXG4gICAgdGhpcy5tb25vID0gZmFsc2U7XG5cbiAgICAvLyBzdG9wIGxpc3RlbmluZyBmb3IgZWRpdGUgc2xpZGUgdGV4dFxuICAgIHRoaXMuaXNFZGl0ID0gZmFsc2U7XG5cbiAgICAvLyBubyB0aXRsZSBcbiAgICB0aGlzLnNpbXBsZSA9IG8uc2ltcGxlIHx8IGZhbHNlO1xuICAgIGlmKCB0aGlzLnNpbXBsZSApIHRoaXMuc2EgPSAwO1xuXG4gICAgLy8gZGVmaW5lIG9iaiBzaXplXG4gICAgdGhpcy5zZXRTaXplKCB0aGlzLndpZHRoICk7XG5cbiAgICAvLyB0aXRsZSBzaXplXG4gICAgaWYoby5zYSAhPT0gdW5kZWZpbmVkICkgdGhpcy5zYSA9IG8uc2E7XG4gICAgaWYoby5zYiAhPT0gdW5kZWZpbmVkICkgdGhpcy5zYiA9IG8uc2I7XG5cbiAgICBpZiggdGhpcy5zaW1wbGUgKSB0aGlzLnNiID0gdGhpcy53aWR0aCAtIHRoaXMuc2E7XG5cbiAgICAvLyBsYXN0IG51bWJlciBzaXplIGZvciBzbGlkZVxuICAgIHRoaXMuc2MgPSBvLnNjID09PSB1bmRlZmluZWQgPyA0NyA6IG8uc2M7XG5cbiAgICAvLyBsaWtlIGRhdCBndWlcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy52YWwgPSBudWxsO1xuICAgIHRoaXMuaXNTZW5kID0gZmFsc2U7XG5cbiAgICBcbiAgICBcbiAgICAvLyBCYWNrZ3JvdW5kXG4gICAgdGhpcy5iZyA9IHRoaXMuaXNVSSA/IHRoaXMubWFpbi5iZyA6IFRvb2xzLmNvbG9ycy5iYWNrZ3JvdW5kO1xuICAgIGlmKCBvLmJnICE9PSB1bmRlZmluZWQgKSB0aGlzLmJnID0gby5iZztcblxuICAgIC8vIEZvbnQgQ29sb3I7XG4gICAgdGhpcy50aXRsZUNvbG9yID0gby50aXRsZUNvbG9yIHx8IFRvb2xzLmNvbG9ycy50ZXh0O1xuICAgIHRoaXMuZm9udENvbG9yID0gby5mb250Q29sb3IgfHwgVG9vbHMuY29sb3JzLnRleHQ7XG4gICAgdGhpcy5jb2xvclBsdXMgPSBUb29scy5Db2xvckx1bWEoIHRoaXMuZm9udENvbG9yLCAwLjMgKTtcblxuICAgIHRoaXMubmFtZSA9IG8ubmFtZSB8fCAnUHJvdG8nO1xuICAgIFxuICAgIHRoaXMudHh0ID0gby5uYW1lIHx8ICdQcm90byc7XG4gICAgdGhpcy5yZW5hbWUgPSBvLnJlbmFtZSB8fCAnJztcbiAgICB0aGlzLnRhcmdldCA9IG8udGFyZ2V0IHx8IG51bGw7XG5cbiAgICB0aGlzLmNhbGxiYWNrID0gby5jYWxsYmFjayA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IG8uY2FsbGJhY2s7XG4gICAgdGhpcy5lbmRDYWxsYmFjayA9IG51bGw7XG5cbiAgICBpZiggdGhpcy5jYWxsYmFjayA9PT0gbnVsbCAmJiB0aGlzLmlzVUkgJiYgdGhpcy5tYWluLmNhbGxiYWNrICE9PSBudWxsICkgdGhpcy5jYWxsYmFjayA9IHRoaXMubWFpbi5jYWxsYmFjaztcblxuICAgIC8vIGVsZW1lbnRzXG5cbiAgICB0aGlzLmMgPSBbXTtcblxuICAgIC8vIHN0eWxlIFxuXG4gICAgdGhpcy5zID0gW107XG5cbiAgICAvL3RoaXMuY1swXSA9IFRvb2xzLmRvbSgnVUlMJywgJ2RpdicsICdwb3NpdGlvbjpyZWxhdGl2ZTsgaGVpZ2h0OjIwcHg7IGZsb2F0OmxlZnQ7Jyk7XG4gICAgdGhpcy5jWzBdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3Bvc2l0aW9uOnJlbGF0aXZlOyBoZWlnaHQ6MjBweDsgZmxvYXQ6bGVmdDsgb3ZlcmZsb3c6aGlkZGVuOycpO1xuICAgIHRoaXMuc1swXSA9IHRoaXMuY1swXS5zdHlsZTtcblxuICAgIGlmKCB0aGlzLmlzVUkgKSB0aGlzLnNbMF0ubWFyZ2luQm90dG9tID0gJzFweCc7XG4gICAgXG5cbiAgICBpZiggIXRoaXMuc2ltcGxlICl7IFxuICAgICAgICAvL3RoaXMuY1sxXSA9IFRvb2xzLmRvbSgnVUlMIHRleHQnKTtcbiAgICAgICAgdGhpcy5jWzFdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dCApO1xuICAgICAgICB0aGlzLnNbMV0gPSB0aGlzLmNbMV0uc3R5bGU7XG4gICAgICAgIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9IHRoaXMucmVuYW1lID09PSAnJyA/IHRoaXMudHh0IDogdGhpcy5yZW5hbWU7XG4gICAgICAgIHRoaXMuc1sxXS5jb2xvciA9IHRoaXMudGl0bGVDb2xvcjtcbiAgICB9XG5cbiAgICBpZihvLnBvcyl7XG4gICAgICAgIHRoaXMuc1swXS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIGZvcih2YXIgcCBpbiBvLnBvcyl7XG4gICAgICAgICAgICB0aGlzLnNbMF1bcF0gPSBvLnBvc1twXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vbm8gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmKG8uY3NzKXtcbiAgICAgICAgdGhpcy5zWzBdLmNzc1RleHQgPSBvLmNzczsgXG4gICAgfVxuXG59XG5cblByb3RvLnByb3RvdHlwZSA9IHtcblxuICAgIGNvbnN0cnVjdG9yOiBQcm90byxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBtYWtlIGRlIG5vZGVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7IC8vIHN0eWxlIGNhY2hlXG4gICAgICAgIHZhciBjID0gdGhpcy5jOyAvLyBkaXYgY2FjaGVcblxuICAgICAgICBzWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG5cbiAgICAgICAgLy9pZiggdGhpcy5pc1VJICkgc1swXS5iYWNrZ3JvdW5kID0gdGhpcy5iZztcbiAgICAgICAgaWYoIHRoaXMuYXV0b0hlaWdodCApIHNbMF0udHJhbnNpdGlvbiA9ICdoZWlnaHQgMC4xcyBlYXNlLW91dCc7XG4gICAgICAgIGlmKCBjWzFdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5hdXRvV2lkdGggKXtcbiAgICAgICAgICAgIHNbMV0gPSBjWzFdLnN0eWxlO1xuICAgICAgICAgICAgc1sxXS5oZWlnaHQgPSAodGhpcy5oLTQpICsgJ3B4JztcbiAgICAgICAgICAgIHNbMV0ubGluZUhlaWdodCA9ICh0aGlzLmgtOCkgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyYWcgPSBUb29scy5mcmFnO1xuXG4gICAgICAgIGZvciggdmFyIGk9MSwgbG5nID0gYy5sZW5ndGg7IGkgIT09IGxuZzsgaSsrICl7XG4gICAgICAgICAgICBpZiggY1tpXSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGZyYWcuYXBwZW5kQ2hpbGQoIGNbaV0gKTtcbiAgICAgICAgICAgICAgICBzW2ldID0gY1tpXS5zdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYoIHRoaXMudGFyZ2V0ICE9PSBudWxsICl7IFxuICAgICAgICAgICAgdGhpcy50YXJnZXQuYXBwZW5kQ2hpbGQoIGNbMF0gKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uaW5uZXIuYXBwZW5kQ2hpbGQoIGNbMF0gKTtcbiAgICAgICAgICAgIGVsc2UgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggY1swXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgY1swXS5hcHBlbmRDaGlsZCggZnJhZyApO1xuXG4gICAgICAgIHRoaXMuclNpemUoKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudCgpO1xuXG4gICAgfSxcblxuICAgIHJlbmFtZTogZnVuY3Rpb24gKCBzICkge1xuXG4gICAgICAgIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9IHM7XG5cbiAgICB9LFxuXG4gICAgc2V0Qkc6IGZ1bmN0aW9uICggYyApIHtcblxuICAgICAgICB0aGlzLmJnID0gYztcbiAgICAgICAgdGhpcy5zWzBdLmJhY2tncm91bmQgPSBjO1xuXG4gICAgfSxcblxuICAgIGxpc3RlbjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFRvb2xzLmFkZExpc3RlbiggdGhpcyApO1xuICAgICAgICBUb29scy5saXN0ZW5zLnB1c2goIHRoaXMgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuXG4gICAgbGlzdGVuaW5nOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYoIHRoaXMucGFyZW50ID09PSBudWxsICkgcmV0dXJuO1xuICAgICAgICBpZiggdGhpcy5pc1NlbmQgKSByZXR1cm47XG4gICAgICAgIGlmKCB0aGlzLmlzRWRpdCApIHJldHVybjtcblxuICAgICAgICB0aGlzLnNldFZhbHVlKCB0aGlzLnBhcmVudFsgdGhpcy52YWwgXSApO1xuXG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAoIHYgKSB7XG5cbiAgICAgICAgaWYoIHRoaXMuaXNOdW1iZXIgKSB0aGlzLnZhbHVlID0gdGhpcy5udW1WYWx1ZSggdiApO1xuICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSB2O1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHVwZGF0ZSBldmVyeSBjaGFuZ2VcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvbkNoYW5nZTogZnVuY3Rpb24gKCBmICkge1xuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gdXBkYXRlIG9ubHkgb24gZW5kXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb25GaW5pc2hDaGFuZ2U6IGZ1bmN0aW9uICggZiApIHtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgdGhpcy5lbmRDYWxsYmFjayA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfSxcblxuICAgIHNlbmQ6IGZ1bmN0aW9uICggdiApIHtcblxuICAgICAgICB0aGlzLmlzU2VuZCA9IHRydWU7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCAhPT0gbnVsbCApIHRoaXMucGFyZW50WyB0aGlzLnZhbCBdID0gdiB8fCB0aGlzLnZhbHVlO1xuICAgICAgICBpZiggdGhpcy5jYWxsYmFjayApIHRoaXMuY2FsbGJhY2soIHYgfHwgdGhpcy52YWx1ZSApO1xuICAgICAgICB0aGlzLmlzU2VuZCA9IGZhbHNlO1xuXG4gICAgfSxcblxuICAgIHNlbmRFbmQ6IGZ1bmN0aW9uICggdiApIHtcblxuICAgICAgICBpZiggdGhpcy5lbmRDYWxsYmFjayApIHRoaXMuZW5kQ2FsbGJhY2soIHYgfHwgdGhpcy52YWx1ZSApO1xuICAgICAgICBpZiggdGhpcy5wYXJlbnQgIT09IG51bGwgKSB0aGlzLnBhcmVudFsgdGhpcy52YWwgXSA9IHYgfHwgdGhpcy52YWx1ZTtcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2xlYXIgbm9kZVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBcbiAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuY2xlYXJFdmVudCgpO1xuICAgICAgICBUb29scy5jbGVhciggdGhpcy5jWzBdICk7XG5cbiAgICAgICAgaWYoIHRoaXMudGFyZ2V0ICE9PSBudWxsICl7IFxuICAgICAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlQ2hpbGQoIHRoaXMuY1swXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jbGVhck9uZSggdGhpcyApO1xuICAgICAgICAgICAgZWxzZSBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKCB0aGlzLmNbMF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYyA9IG51bGw7XG4gICAgICAgIHRoaXMucyA9IG51bGw7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGNoYW5nZSBzaXplIFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHNldFNpemU6IGZ1bmN0aW9uICggc3ggKSB7XG5cbiAgICAgICAgaWYoICF0aGlzLmF1dG9XaWR0aCApIHJldHVybjtcblxuICAgICAgICB0aGlzLndpZHRoID0gc3g7XG5cbiAgICAgICAgaWYoIHRoaXMuc2ltcGxlICl7XG4gICAgICAgICAgICAvL3RoaXMuc2EgPSAwO1xuICAgICAgICAgICAgdGhpcy5zYiA9IHRoaXMud2lkdGggLSB0aGlzLnNhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHBwID0gdGhpcy53aWR0aCAqICggdGhpcy5wIC8gMTAwICk7XG4gICAgICAgICAgICB0aGlzLnNhID0gfn4gcHAgKyAxMDtcbiAgICAgICAgICAgIHRoaXMuc2IgPSB+fiB0aGlzLndpZHRoIC0gcHAgLSAyMDtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYoICF0aGlzLmF1dG9XaWR0aCApIHJldHVybjtcblxuICAgICAgICB0aGlzLnNbMF0ud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgICAgICAgaWYoICF0aGlzLnNpbXBsZSApIHRoaXMuc1sxXS53aWR0aCA9IHRoaXMuc2EgKyAncHgnO1xuICAgIFxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZm9yIG51bWVyaWMgdmFsdWVcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBzZXRUeXBlTnVtYmVyOiBmdW5jdGlvbiAoIG8gKSB7XG5cbiAgICAgICAgdGhpcy5pc051bWJlciA9IHRydWU7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICAgIGlmKG8udmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIG8udmFsdWUgPT09ICdzdHJpbmcnICkgdGhpcy52YWx1ZSA9IG8udmFsdWUgKiAxO1xuICAgICAgICAgICAgZWxzZSB0aGlzLnZhbHVlID0gby52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWluID0gby5taW4gPT09IHVuZGVmaW5lZCA/IC1JbmZpbml0eSA6IG8ubWluO1xuICAgICAgICB0aGlzLm1heCA9IG8ubWF4ID09PSB1bmRlZmluZWQgPyAgSW5maW5pdHkgOiBvLm1heDtcbiAgICAgICAgdGhpcy5wcmVjaXNpb24gPSBvLnByZWNpc2lvbiA9PT0gdW5kZWZpbmVkID8gMiA6IG8ucHJlY2lzaW9uO1xuXG4gICAgICAgIHZhciBzO1xuXG4gICAgICAgIHN3aXRjaCh0aGlzLnByZWNpc2lvbil7XG4gICAgICAgICAgICBjYXNlIDA6IHMgPSAxOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogcyA9IDAuMTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IHMgPSAwLjAxOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzogcyA9IDAuMDAxOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDogcyA9IDAuMDAwMTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0ZXAgPSBvLnN0ZXAgPT09IHVuZGVmaW5lZCA/ICBzIDogby5zdGVwO1xuXG4gICAgICAgIHRoaXMucmFuZ2UgPSB0aGlzLm1heCAtIHRoaXMubWluO1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB0aGlzLnZhbHVlICk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBudW1WYWx1ZTogZnVuY3Rpb24gKCBuICkge1xuXG4gICAgICAgIHJldHVybiBNYXRoLm1pbiggdGhpcy5tYXgsIE1hdGgubWF4KCB0aGlzLm1pbiwgbiApICkudG9GaXhlZCggdGhpcy5wcmVjaXNpb24gKSAqIDE7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vICAgRXZlbnRzIGRpc3BhdGNoXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgYWRkRXZlbnQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgaSA9IHRoaXMuYy5sZW5ndGgsIGosIGM7XG4gICAgICAgIHdoaWxlKCBpLS0gKXtcbiAgICAgICAgICAgIGMgPSB0aGlzLmNbaV07XG4gICAgICAgICAgICBpZiggYyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgaWYoIGMuZXZlbnRzICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICAgICAgaiA9IGMuZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGotLSApIGMuYWRkRXZlbnRMaXN0ZW5lciggYy5ldmVudHNbal0sIHRoaXMsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgY2xlYXJFdmVudDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBpID0gdGhpcy5jLmxlbmd0aCwgaiwgYztcbiAgICAgICAgd2hpbGUoIGktLSApe1xuICAgICAgICAgICAgYyA9IHRoaXMuY1tpXTtcbiAgICAgICAgICAgIGlmKCBjICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBpZiggYy5ldmVudHMgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgICAgICAgICBqID0gYy5ldmVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSggai0tICkgYy5yZW1vdmVFdmVudExpc3RlbmVyKCBjLmV2ZW50c1tqXSwgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKCBlICkge1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIG9iamVjdCByZWZlcmVuY3lcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBzZXRSZWZlcmVuY3k6IGZ1bmN0aW9uICggb2JqLCB2YWwgKSB7XG5cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBvYmo7XG4gICAgICAgIHRoaXMudmFsID0gdmFsO1xuXG4gICAgfSxcblxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uICggdiApIHtcblxuICAgICAgICB0aGlzLnNbMF0uZGlzcGxheSA9IHYgPyAnYmxvY2snIDogJ25vbmUnO1xuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyByZXNpemUgaGVpZ2h0IFxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9wZW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiggdGhpcy5pc09wZW4gKSByZXR1cm47XG4gICAgICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmKCAhdGhpcy5pc09wZW4gKSByZXR1cm47XG4gICAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG5cbiAgICB9LFxuXG5cbn07XG5cbmZ1bmN0aW9uIEJvb2wgKCBvICl7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICB0aGlzLnZhbHVlID0gby52YWx1ZSB8fCBmYWxzZTtcblxuICAgIHRoaXMuYnV0dG9uQ29sb3IgPSBvLmJDb2xvciB8fCBUb29scy5jb2xvcnMuYnV0dG9uO1xuXG4gICAgdGhpcy5pbmggPSBvLmluaCB8fCB0aGlzLmg7XG5cbiAgICB2YXIgdCA9IH5+ICh0aGlzLmgqMC41KS0oKHRoaXMuaW5oLTIpKjAuNSk7XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnYmFja2dyb3VuZDonKyBUb29scy5jb2xvcnMuYm9vbGJnICsnOyBoZWlnaHQ6JysodGhpcy5pbmgtMikrJ3B4OyB3aWR0aDozNnB4OyB0b3A6Jyt0KydweDsgYm9yZGVyLXJhZGl1czoyMHB4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgdHJhbnNpdGlvbjowLjFzIGVhc2Utb3V0OycgKTtcbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnb3Bhc2l0eTowLCBiYWNrZ3JvdW5kOicrIFRvb2xzLmNvbG9ycy5ib29sYmcgKyc7IGhlaWdodDonKyh0aGlzLmluaC02KSsncHg7IHdpZHRoOicrKHRoaXMuaW5oLTYpKydweDsgdG9wOicrKHQrMikrJ3B4OyBib3JkZXItcmFkaXVzOjIwcHg7ICcgKTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnYm9yZGVyOjFweCBzb2xpZCAnK3RoaXMuYnV0dG9uQ29sb3IrJzsgaGVpZ2h0OicrKHRoaXMuaW5oLTQpKydweDsgd2lkdGg6MTZweDsgdG9wOicrKHQrMSkrJ3B4OyBib3JkZXItcmFkaXVzOjIwcHg7IGJhY2tncm91bmQ6Jyt0aGlzLmJ1dHRvbkNvbG9yKyc7IHRyYW5zaXRpb246bWFyZ2luIDAuMXMgZWFzZS1vdXQ7JyApO1xuXG4gICAgaWYodGhpcy52YWx1ZSl7XG4gICAgICAgIHRoaXMuY1s0XS5zdHlsZS5tYXJnaW5MZWZ0ID0gJzE4cHgnO1xuICAgICAgICB0aGlzLmNbMl0uc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICB0aGlzLmNbMl0uc3R5bGUuYm9yZGVyQ29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICB9XG5cbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAnY2xpY2snIF07XG5cbiAgICB0aGlzLmluaXQoKTtcblxufVxuXG5Cb29sLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogQm9vbCxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnY2xpY2snOiB0aGlzLmNsaWNrKGUpOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGNsaWNrOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGlmKHRoaXMudmFsdWUpIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgICAgICAgZWxzZSB0aGlzLnZhbHVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgdGhpcy5zZW5kKCk7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgcyA9IHRoaXMucztcblxuICAgICAgICBpZih0aGlzLnZhbHVlKXtcbiAgICAgICAgICAgIHNbNF0ubWFyZ2luTGVmdCA9ICcxOHB4JztcbiAgICAgICAgICAgIHNbMl0uYmFja2dyb3VuZCA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgc1syXS5ib3JkZXJDb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgc1s0XS5ib3JkZXJDb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc1s0XS5tYXJnaW5MZWZ0ID0gJzBweCc7XG4gICAgICAgICAgICBzWzJdLmJhY2tncm91bmQgPSBUb29scy5jb2xvcnMuYm9vbGJnO1xuICAgICAgICAgICAgc1syXS5ib3JkZXJDb2xvciA9IFRvb2xzLmNvbG9ycy5ib29sYmc7XG4gICAgICAgICAgICBzWzRdLmJvcmRlckNvbG9yID0gVG9vbHMuY29sb3JzLmJvcmRlcjtcbiAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgICBzWzJdLmxlZnQgPSB0aGlzLnNhICsgJ3B4JztcbiAgICAgICAgc1szXS5sZWZ0ID0gdGhpcy5zYSsxKyAncHgnO1xuICAgICAgICBzWzRdLmxlZnQgPSB0aGlzLnNhKzEgKyAncHgnO1xuXG4gICAgfVxuXG59ICk7XG5cbmZ1bmN0aW9uIEJ1dHRvbiAoIG8gKSB7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICB0aGlzLnZhbHVlID0gby52YWx1ZSB8fCBbdGhpcy50eHRdO1xuXG4gICAgdGhpcy5idXR0b25Db2xvciA9IG8uYkNvbG9yIHx8IFRvb2xzLmNvbG9ycy5idXR0b247XG5cbiAgICB0aGlzLmlzTG9hZEJ1dHRvbiA9IG8ubG9hZGVyIHx8IGZhbHNlO1xuICAgIHRoaXMuaXNEcmFnQnV0dG9uID0gby5kcmFnIHx8IGZhbHNlO1xuICAgIGlmKHRoaXMuaXNEcmFnQnV0dG9uICkgdGhpcy5pc0xvYWRCdXR0b24gPSB0cnVlO1xuICAgIC8vdGhpcy5yID0gby5yIHx8IDM7XG5cbiAgICB0aGlzLmxuZyA9IHRoaXMudmFsdWUubGVuZ3RoO1xuXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMubG5nOyBpKyspe1xuICAgICAgICAvL3RoaXMuY1tpKzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dCArICd0ZXh0LWFsaWduOmNlbnRlcjsgYm9yZGVyOjFweCBzb2xpZCAnICsgVG9vbHMuY29sb3JzLmJvcmRlcisnOyB0b3A6MXB4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgYmFja2dyb3VuZDonK3RoaXMuYnV0dG9uQ29sb3IrJzsgaGVpZ2h0OicrKHRoaXMuaC0yKSsncHg7IGJvcmRlci1yYWRpdXM6Jyt0aGlzLnIrJ3B4OyBsaW5lLWhlaWdodDonKyh0aGlzLmgtNCkrJ3B4OycgKTtcbiAgICAgICAgdGhpcy5jW2krMl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0ICsgJ3RleHQtYWxpZ246Y2VudGVyOyB0b3A6MXB4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgYmFja2dyb3VuZDonK3RoaXMuYnV0dG9uQ29sb3IrJzsgaGVpZ2h0OicrKHRoaXMuaC0yKSsncHg7IGJvcmRlci1yYWRpdXM6Jyt0aGlzLnJhZGl1cysncHg7IGxpbmUtaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7JyApO1xuICAgICAgICB0aGlzLmNbaSsyXS5zdHlsZS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuXG4gICAgICAgIHRoaXMuY1tpKzJdLmV2ZW50cyA9IFsgJ2NsaWNrJywgJ21vdXNlb3ZlcicsICdtb3VzZWRvd24nLCAnbW91c2V1cCcsICdtb3VzZW91dCcgXTtcbiAgICAgICAgdGhpcy5jW2krMl0uaW5uZXJIVE1MID0gdGhpcy52YWx1ZVtpXTsvL3RoaXMudHh0O1xuICAgICAgICB0aGlzLmNbaSsyXS5uYW1lID0gaTtcbiAgICB9XG5cbiAgICBpZiggdGhpcy5jWzFdICE9PSB1bmRlZmluZWQgKSB0aGlzLmNbMV0udGV4dENvbnRlbnQgPSAnJztcbiAgICBcblxuICAgIGlmKCB0aGlzLmlzTG9hZEJ1dHRvbiApIHRoaXMuaW5pdExvYWRlcigpO1xuICAgIGlmKCB0aGlzLmlzRHJhZ0J1dHRvbiApeyBcbiAgICAgICAgdGhpcy5sbmcgKys7XG4gICAgICAgIHRoaXMuaW5pdERyYWdlcigpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdCgpO1xuXG59XG5cbkJ1dHRvbi5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IEJ1dHRvbixcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnY2xpY2snOiB0aGlzLmNsaWNrKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdmVyJzogdGhpcy5tb2RlKCAxLCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5tb2RlKCAyLCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHRoaXMubW9kZSggMCwgZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3V0JzogdGhpcy5tb2RlKCAwLCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY2hhbmdlJzogdGhpcy5maWxlU2VsZWN0KCBlLnRhcmdldC5maWxlc1swXSApOyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZHJhZ292ZXInOiB0aGlzLmRyYWdvdmVyKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZHJhZ2VuZCc6IHRoaXMuZHJhZ2VuZCgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RyYWdsZWF2ZSc6IHRoaXMuZHJhZ2VuZCgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2Ryb3AnOiB0aGlzLmRyb3AoIGUgKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtb2RlOiBmdW5jdGlvbiAoIG1vZGUsIGUgKSB7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICAgIHZhciBpID0gZS50YXJnZXQubmFtZSB8fCAwO1xuICAgICAgICBpZihpPT09J2xvYWRlcicpIGkgPSAwO1xuXG4gICAgICAgIHN3aXRjaCggbW9kZSApe1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBiYXNlXG4gICAgICAgICAgICAgICAgc1tpKzJdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgc1tpKzJdLmJhY2tncm91bmQgPSB0aGlzLmJ1dHRvbkNvbG9yO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IC8vIG92ZXJcbiAgICAgICAgICAgICAgICBzW2krMl0uY29sb3IgPSAnI0ZGRic7XG4gICAgICAgICAgICAgICAgc1tpKzJdLmJhY2tncm91bmQgPSBUb29scy5jb2xvcnMuc2VsZWN0O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6IC8vIGVkaXQgLyBkb3duXG4gICAgICAgICAgICAgICAgc1tpKzJdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgc1tpKzJdLmJhY2tncm91bmQgPSBUb29scy5jb2xvcnMuZG93bjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZHJhZ292ZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLnNbNF0uYm9yZGVyQ29sb3IgPSBUb29scy5jb2xvcnMuc2VsZWN0O1xuICAgICAgICB0aGlzLnNbNF0uY29sb3IgPSBUb29scy5jb2xvcnMuc2VsZWN0O1xuXG4gICAgfSxcblxuICAgIGRyYWdlbmQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLnNbNF0uYm9yZGVyQ29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgdGhpcy5zWzRdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgfSxcblxuICAgIGRyb3A6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmRyYWdlbmQoKTtcbiAgICAgICAgdGhpcy5maWxlU2VsZWN0KCBlLmRhdGFUcmFuc2Zlci5maWxlc1swXSApO1xuXG4gICAgfSxcblxuICAgIFxuXG4gICAgaW5pdERyYWdlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHQgKycgdGV4dC1hbGlnbjpjZW50ZXI7IGxpbmUtaGVpZ2h0OicrKHRoaXMuaC04KSsncHg7IGJvcmRlcjoxcHggZGFzaGVkICcrdGhpcy5mb250Q29sb3IrJzsgdG9wOjJweDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOmRlZmF1bHQ7IGhlaWdodDonKyh0aGlzLmgtNCkrJ3B4OyBib3JkZXItcmFkaXVzOicrdGhpcy5yKydweDsnICk7XG4gICAgICAgIHRoaXMuY1s0XS50ZXh0Q29udGVudCA9ICdEUkFHJztcblxuICAgICAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAgXTtcbiAgICAgICAgdGhpcy5jWzRdLmV2ZW50cyA9IFsgJ2RyYWdvdmVyJywgJ2RyYWdlbmQnLCAnZHJhZ2xlYXZlJywgJ2Ryb3AnIF07XG5cblxuICAgIH0sXG5cbiAgICBpbml0TG9hZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5jWzNdID0gVG9vbHMuZG9tKCAnaW5wdXQnLCBUb29scy5jc3MuYmFzaWMgKydib3JkZXI6MXB4IHNvbGlkICcrVG9vbHMuY29sb3JzLmJvcmRlcisnOyB0b3A6MXB4OyBvcGFjaXR5OjA7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBoZWlnaHQ6JysodGhpcy5oLTIpKydweDsnICk7XG4gICAgICAgIHRoaXMuY1szXS5uYW1lID0gJ2xvYWRlcic7XG4gICAgICAgIHRoaXMuY1szXS50eXBlID0gXCJmaWxlXCI7XG5cbiAgICAgICAgdGhpcy5jWzJdLmV2ZW50cyA9IFsgIF07XG4gICAgICAgIHRoaXMuY1szXS5ldmVudHMgPSBbICdjaGFuZ2UnLCAnbW91c2VvdmVyJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlb3V0JyBdO1xuXG4gICAgICAgIC8vdGhpcy5oaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgIH0sXG5cbiAgICBmaWxlU2VsZWN0OiBmdW5jdGlvbiAoIGZpbGUgKSB7XG5cbiAgICAgICAgdmFyIGRhdGFVcmwgPSBbICdwbmcnLCAnanBnJywgJ21wNCcsICd3ZWJtJywgJ29nZycgXTtcbiAgICAgICAgdmFyIGRhdGFCdWYgPSBbICdzZWEnLCAnYnZoJywgJ0JWSCcsICd6JyBdO1xuXG4gICAgICAgIC8vaWYoICEgZS50YXJnZXQuZmlsZXMgKSByZXR1cm47XG5cbiAgICAgICAgLy92YXIgZmlsZSA9IGUudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgIFxuICAgICAgICAvL3RoaXMuY1szXS50eXBlID0gXCJudWxsXCI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCB0aGlzLmNbNF0gKVxuXG4gICAgICAgIGlmKCBmaWxlID09PSB1bmRlZmluZWQgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHZhciBmbmFtZSA9IGZpbGUubmFtZTtcbiAgICAgICAgdmFyIHR5cGUgPSBmbmFtZS5zdWJzdHJpbmcoZm5hbWUubGFzdEluZGV4T2YoJy4nKSsxLCBmbmFtZS5sZW5ndGggKTtcblxuICAgICAgICBpZiggZGF0YVVybC5pbmRleE9mKCB0eXBlICkgIT09IC0xICkgcmVhZGVyLnJlYWRBc0RhdGFVUkwoIGZpbGUgKTtcbiAgICAgICAgZWxzZSBpZiggZGF0YUJ1Zi5pbmRleE9mKCB0eXBlICkgIT09IC0xICkgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKCBmaWxlICk7XG4gICAgICAgIGVsc2UgcmVhZGVyLnJlYWRBc1RleHQoIGZpbGUgKTtcblxuICAgICAgICAvLyBpZiggdHlwZSA9PT0gJ3BuZycgfHwgdHlwZSA9PT0gJ2pwZycgfHwgdHlwZSA9PT0gJ21wNCcgfHwgdHlwZSA9PT0gJ3dlYm0nIHx8IHR5cGUgPT09ICdvZ2cnICkgcmVhZGVyLnJlYWRBc0RhdGFVUkwoIGZpbGUgKTtcbiAgICAgICAgLy9lbHNlIGlmKCB0eXBlID09PSAneicgKSByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKCBmaWxlICk7XG4gICAgICAgIC8vZWxzZSBpZiggdHlwZSA9PT0gJ3NlYScgfHwgdHlwZSA9PT0gJ2J2aCcgfHwgdHlwZSA9PT0gJ0JWSCcgfHwgdHlwZSA9PT0gJ3onKSByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGZpbGUgKTtcbiAgICAgICAgLy9lbHNlIGlmKCAgKSByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGZpbGUgKTtcbiAgICAgICAgLy9lbHNlIHJlYWRlci5yZWFkQXNUZXh0KCBmaWxlICk7XG5cbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIHRoaXMuY2FsbGJhY2sgKSB0aGlzLmNhbGxiYWNrKCBlLnRhcmdldC5yZXN1bHQsIGZuYW1lLCB0eXBlICk7XG4gICAgICAgICAgICAvL3RoaXMuY1szXS50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgICAgICAvL3RoaXMuc2VuZCggZS50YXJnZXQucmVzdWx0ICk7IFxuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB9LFxuXG4gICAgY2xpY2s6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB2YXIgaSA9IGUudGFyZ2V0Lm5hbWUgfHwgMDtcbiAgICAgICAgdmFyIHYgPSB0aGlzLnZhbHVlW2ldO1xuXG4gICAgICAgIHRoaXMuc2VuZCggdiApO1xuXG4gICAgfSxcblxuICAgIGxhYmVsOiBmdW5jdGlvbiAoIHN0cmluZywgbiApIHtcblxuICAgICAgICBuID0gbiB8fCAyO1xuICAgICAgICB0aGlzLmNbbl0udGV4dENvbnRlbnQgPSBzdHJpbmc7XG5cbiAgICB9LFxuXG4gICAgaWNvbjogZnVuY3Rpb24gKCBzdHJpbmcsIHksIG4gKSB7XG5cbiAgICAgICAgbiA9IG4gfHwgMjtcbiAgICAgICAgdGhpcy5zW25dLnBhZGRpbmcgPSAoIHkgfHwgMCApICsncHggMHB4JztcbiAgICAgICAgdGhpcy5jW25dLmlubmVySFRNTCA9IHN0cmluZztcblxuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICAgIHZhciB3ID0gdGhpcy5zYjtcbiAgICAgICAgdmFyIGQgPSB0aGlzLnNhO1xuXG4gICAgICAgIHZhciBpID0gdGhpcy5sbmc7XG4gICAgICAgIHZhciBkYyA9ICAzO1xuICAgICAgICB2YXIgc2l6ZSA9IE1hdGguZmxvb3IoICggdy0oZGMqKGktMSkpICkgLyBpICk7XG5cbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc1tpKzJdLndpZHRoID0gc2l6ZSArICdweCc7XG4gICAgICAgICAgICBzW2krMl0ubGVmdCA9IGQgKyAoIHNpemUgKiBpICkgKyAoIGRjICogaSkgKyAncHgnO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5pc0RyYWdCdXR0b24gKXsgXG4gICAgICAgICAgICBzWzRdLmxlZnQgPSAoZCtzaXplK2RjKSArICdweCc7XG4gICAgICAgICAgICBzWzRdLndpZHRoID0gc2l6ZSArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5pc0xvYWRCdXR0b24gKXtcbiAgICAgICAgICAgIHNbM10ubGVmdCA9IGQgKyAncHgnO1xuICAgICAgICAgICAgc1szXS53aWR0aCA9IHNpemUgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0gKTtcblxuZnVuY3Rpb24gQ2lyY3VsYXIgKCBvICkge1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgLy90aGlzLnR5cGUgPSAnY2lyY3VsYXInO1xuICAgIHRoaXMuYXV0b1dpZHRoID0gZmFsc2U7XG5cbiAgICB0aGlzLmJ1dHRvbkNvbG9yID0gVG9vbHMuY29sb3JzLmJ1dHRvbjtcblxuICAgIHRoaXMuc2V0VHlwZU51bWJlciggbyApO1xuXG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLmZsb29yKCh0aGlzLndpZHRoLTIwKSowLjUpO1xuXG4gICAgLyp0aGlzLnJhZGl1cyA9IG8ucmFkaXVzIHx8IDE1O1xuICAgIFxuICAgIHRoaXMud2lkdGggPSAodGhpcy5yYWRpdXMqMikrMjA7XG5cbiAgICBpZihvLndpZHRoICE9PSB1bmRlZmluZWQpe1xuICAgICAgICB0aGlzLndpZHRoID0gby53aWR0aDtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB+fiAodGhpcy53aWR0aC0yMCkqMC41O1xuICAgIH1cblxuICAgIGlmKG8uc2l6ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IG8uc2l6ZTtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB+fiAodGhpcy53aWR0aC0yMCkqMC41O1xuICAgIH0qL1xuXG4gICAgdGhpcy53ID0gdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDI7XG4gICAgdGhpcy5oID0gby5oZWlnaHQgfHwgKHRoaXMuaGVpZ2h0ICsgNDApO1xuXG4gICAgdGhpcy50d29QaSA9IE1hdGguUEkgKiAyO1xuXG4gICAgdGhpcy50b3AgPSAwO1xuXG4gICAgdGhpcy5jWzBdLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArJ3B4JztcblxuICAgIGlmKHRoaXMuY1sxXSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgdGhpcy5jWzFdLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArJ3B4JztcbiAgICAgICAgdGhpcy5jWzFdLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICB0aGlzLnRvcCA9IDIwO1xuXG4gICAgfVxuXG4gICAgdGhpcy5wZXJjZW50ID0gMDtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHRudW1iZXIgKyAndGV4dC1hbGlnbjpjZW50ZXI7IHRvcDonKyh0aGlzLmhlaWdodCsyNCkrJ3B4OyB3aWR0aDonK3RoaXMud2lkdGgrJ3B4OyBjb2xvcjonKyB0aGlzLmZvbnRDb2xvciApO1xuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2NpcmNsZScsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjEwcHg7IHRvcDonK3RoaXMudG9wKydweDsgd2lkdGg6Jyt0aGlzLncrJ3B4OyBoZWlnaHQ6Jyt0aGlzLmhlaWdodCsncHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOycsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzLCByOnRoaXMucmFkaXVzLCBmaWxsOidyZ2JhKDAsMCwwLDAuMyknIH0pO1xuICAgIHRoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ3BhdGgnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OycsIHsgZDp0aGlzLm1ha2VQYXRoKCksIGZpbGw6dGhpcy5mb250Q29sb3IgfSk7XG4gICAgdGhpcy5jWzVdID0gVG9vbHMuZG9tKCAnY2lyY2xlJywgVG9vbHMuY3NzLmJhc2ljICsgJ2xlZnQ6MTBweDsgdG9wOicrdGhpcy50b3ArJ3B4OyB3aWR0aDonK3RoaXMudysncHg7IGhlaWdodDonK3RoaXMuaGVpZ2h0KydweDsnLCB7IGN4OnRoaXMucmFkaXVzLCBjeTp0aGlzLnJhZGl1cywgcjp0aGlzLnJhZGl1cyowLjUsIGZpbGw6dGhpcy5idXR0b25Db2xvciwgJ3N0cm9rZS13aWR0aCc6MSwgc3Ryb2tlOlRvb2xzLmNvbG9ycy5zdHJva2UgfSk7XG5cbiAgICB0aGlzLmNbM10uZXZlbnRzID0gWyAnbW91c2VvdmVyJywgJ21vdXNlZG93bicsICdtb3VzZW91dCcgXTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy51cGRhdGUoKTtcblxufVxuXG5DaXJjdWxhci5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IENpcmN1bGFyLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW92ZXInOiB0aGlzLm92ZXIoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLmRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW91dCc6ICB0aGlzLm91dCggZSApOyAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ21vdXNldXAnOiAgIHRoaXMudXAoIGUgKTsgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlbW92ZSc6IHRoaXMubW92ZSggZSApOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIG1vZGU6IGZ1bmN0aW9uICggbW9kZSApIHtcblxuICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICBjYXNlIDA6IC8vIGJhc2VcbiAgICAgICAgICAgICAgICB0aGlzLnNbMl0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1szXSwgJ2ZpbGwnLCdyZ2JhKDAsMCwwLDAuMiknKTtcbiAgICAgICAgICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2ZpbGwnLCB0aGlzLmZvbnRDb2xvciApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IC8vIG92ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnNbMl0uY29sb3IgPSB0aGlzLmNvbG9yUGx1cztcbiAgICAgICAgICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1szXSwgJ2ZpbGwnLCdyZ2JhKDAsMCwwLDAuNiknKTtcbiAgICAgICAgICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2ZpbGwnLCB0aGlzLmNvbG9yUGx1cyApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBBQ1RJT05cblxuICAgIG92ZXI6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzT3ZlciA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kZSgxKTtcblxuICAgIH0sXG5cbiAgICBvdXQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzT3ZlciA9IGZhbHNlO1xuICAgICAgICBpZih0aGlzLmlzRG93bikgcmV0dXJuO1xuICAgICAgICB0aGlzLm1vZGUoMCk7XG5cbiAgICB9LFxuXG4gICAgdXA6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgICAgIGlmKHRoaXMuaXNPdmVyKSB0aGlzLm1vZGUoMSk7XG4gICAgICAgIGVsc2UgdGhpcy5tb2RlKDApO1xuXG4gICAgICAgIHRoaXMuc2VuZEVuZCgpO1xuXG4gICAgfSxcblxuICAgIGRvd246IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzRG93biA9IHRydWU7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG5cbiAgICAgICAgdGhpcy5yZWN0ID0gdGhpcy5jWzNdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLm9sZCA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMub2xkciA9IG51bGw7XG4gICAgICAgIHRoaXMubW92ZSggZSApO1xuXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBpZiggIXRoaXMuaXNEb3duICkgcmV0dXJuO1xuXG4gICAgICAgIHZhciB4ID0gdGhpcy5yYWRpdXMgLSAoZS5jbGllbnRYIC0gdGhpcy5yZWN0LmxlZnQpO1xuICAgICAgICB2YXIgeSA9IHRoaXMucmFkaXVzIC0gKGUuY2xpZW50WSAtIHRoaXMucmVjdC50b3ApO1xuXG4gICAgICAgIHRoaXMuciA9IE1hdGguYXRhbjIoIHksIHggKSAtIChNYXRoLlBJICogMC41KTtcbiAgICAgICAgdGhpcy5yID0gKCgodGhpcy5yJXRoaXMudHdvUGkpK3RoaXMudHdvUGkpJXRoaXMudHdvUGkpO1xuXG4gICAgICAgIGlmKCB0aGlzLm9sZHIgIT09IG51bGwgKXsgXG5cbiAgICAgICAgICAgIHZhciBkaWYgPSB0aGlzLnIgLSB0aGlzLm9sZHI7XG4gICAgICAgICAgICB0aGlzLnIgPSBNYXRoLmFicyhkaWYpID4gTWF0aC5QSSA/IHRoaXMub2xkciA6IHRoaXMucjtcblxuICAgICAgICAgICAgaWYoZGlmID4gNikgdGhpcy5yID0gMDtcbiAgICAgICAgICAgIGlmKGRpZiA8IC02KSB0aGlzLnIgPSB0aGlzLnR3b1BpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3RlcHMgPSAxIC8gdGhpcy50d29QaTtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5yICogc3RlcHM7XG5cbiAgICAgICAgdmFyIG4gPSAoICggdGhpcy5yYW5nZSAqIHZhbHVlICkgKyB0aGlzLm1pbiApIC0gdGhpcy5vbGQ7XG5cbiAgICAgICAgaWYobiA+PSB0aGlzLnN0ZXAgfHwgbiA8PSB0aGlzLnN0ZXApeyBcbiAgICAgICAgICAgIG4gPSB+fiAoIG4gLyB0aGlzLnN0ZXAgKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB0aGlzLm9sZCArICggbiAqIHRoaXMuc3RlcCApICk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSggdHJ1ZSApO1xuICAgICAgICAgICAgdGhpcy5vbGQgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5vbGRyID0gdGhpcy5yO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbWFrZVBhdGg6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgciA9IHRoaXMucmFkaXVzO1xuICAgICAgICAvL3ZhciBzdGFydCA9IDA7XG4gICAgICAgIHZhciBlbmQgPSB0aGlzLnBlcmNlbnQgKiB0aGlzLnR3b1BpIC0gMC4wMDE7XG4gICAgICAgIC8vdmFyIHgxID0gciArIHIgKiBNYXRoLnNpbihzdGFydCk7XG4gICAgICAgIC8vdmFyIHkxID0gciAtIHIgKiBNYXRoLmNvcyhzdGFydCk7XG4gICAgICAgIHZhciB4MiA9IHIgKyByICogTWF0aC5zaW4oZW5kKTtcbiAgICAgICAgdmFyIHkyID0gciAtIHIgKiBNYXRoLmNvcyhlbmQpO1xuICAgICAgICAvL3ZhciBiaWcgPSBlbmQgLSBzdGFydCA+IE1hdGguUEkgPyAxIDogMDtcbiAgICAgICAgdmFyIGJpZyA9IGVuZCA+IE1hdGguUEkgPyAxIDogMDtcbiAgICAgICAgcmV0dXJuIFwiTSBcIiArIHIgKyBcIixcIiArIHIgKyBcIiBMIFwiICsgciArIFwiLFwiICsgMCArIFwiIEEgXCIgKyByICsgXCIsXCIgKyByICsgXCIgMCBcIiArIGJpZyArIFwiIDEgXCIgKyB4MiArIFwiLFwiICsgeTIgKyBcIiBaXCI7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoIHVwICkge1xuXG4gICAgICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMucGVyY2VudCA9ICggdGhpcy52YWx1ZSAtIHRoaXMubWluICkgLyB0aGlzLnJhbmdlO1xuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2QnLCB0aGlzLm1ha2VQYXRoKCkgKTtcbiAgICAgICAgaWYoIHVwICkgdGhpcy5zZW5kKCk7XG4gICAgICAgIFxuICAgIH0sXG5cbn0gKTtcblxuZnVuY3Rpb24gQ29sb3IgKCBvICkge1xuICAgIFxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMuYXV0b0hlaWdodCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eXBlID0gby5jdHlwZSB8fCAnYXJyYXknO1xuICAgIHRoaXMud3cgPSB0aGlzLnNiO1xuICAgIHRoaXMub2xkV2lkdGggPSAwO1xuXG4gICAgLy8gY29sb3IgdXAgb3IgZG93blxuICAgIHRoaXMuc2lkZSA9IG8uc2lkZSB8fCAnZG93bic7XG4gICAgdGhpcy5ob2xkVG9wID0gMDtcbiAgICBcbiAgICB0aGlzLndoZWVsV2lkdGggPSB0aGlzLnd3KjAuMTtcbiAgICB0aGlzLmRlY2FsID0gdGhpcy5oICsgMjtcbiAgICBcbiAgICB0aGlzLmNvbG9yUmFkaXVzID0gKHRoaXMud3cgLSB0aGlzLndoZWVsV2lkdGgpICogMC41IC0gMTtcbiAgICB0aGlzLnNxdWFyZSA9IE1hdGguZmxvb3IoKHRoaXMuY29sb3JSYWRpdXMgLSB0aGlzLndoZWVsV2lkdGggKiAwLjUpICogMC43KSAtIDE7XG4gICAgdGhpcy5taWQgPSBNYXRoLmZsb29yKHRoaXMud3cgKiAwLjUgKTtcbiAgICB0aGlzLm1hcmtlclNpemUgPSB0aGlzLndoZWVsV2lkdGggKiAwLjM7XG5cbiAgICB0aGlzLmJhc2VIID0gdGhpcy5oO1xuXG4gICAgLy90aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCAgVG9vbHMuY3NzLnR4dCArICdoZWlnaHQ6JysodGhpcy5oLTQpKydweDsnICsgJ2JvcmRlci1yYWRpdXM6M3B4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgYm9yZGVyOjFweCBzb2xpZCAnKyBUb29scy5jb2xvcnMuYm9yZGVyICsgJzsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTgpKydweDsnICk7XG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgIFRvb2xzLmNzcy50eHQgKyAnaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7JyArICdib3JkZXItcmFkaXVzOicrdGhpcy5yYWRpdXMrJ3B4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTgpKydweDsnICk7XG5cbiAgICB0aGlzLnNbMl0gPSB0aGlzLmNbMl0uc3R5bGU7XG5cbiAgICBpZih0aGlzLnNpZGUgPT09ICd1cCcpe1xuICAgICAgICB0aGlzLmRlY2FsID0gNTtcbiAgICAgICAgdGhpcy5zWzJdLnRvcCA9ICdhdXRvJztcbiAgICAgICAgdGhpcy5zWzJdLmJvdHRvbSA9ICcycHgnO1xuICAgIH1cblxuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdkaXNwbGF5Om5vbmUnICk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAnY2FudmFzJywgVG9vbHMuY3NzLmJhc2ljICsgJ2Rpc3BsYXk6bm9uZTsnKTtcbiAgICB0aGlzLmNbNV0gPSBUb29scy5kb20oICdjYW52YXMnLCBUb29scy5jc3MuYmFzaWMgKyAncG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7IGRpc3BsYXk6bm9uZTsnKTtcblxuICAgIHRoaXMuc1szXSA9IHRoaXMuY1szXS5zdHlsZTtcbiAgICB0aGlzLnNbNV0gPSB0aGlzLmNbNV0uc3R5bGU7XG5cbiAgICBpZih0aGlzLnNpZGUgPT09ICd1cCcpIHRoaXMuc1s1XS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXG4gICAgdGhpcy5jWzRdLndpZHRoID0gdGhpcy5jWzRdLmhlaWdodCA9IHRoaXMud3c7XG4gICAgdGhpcy5jWzVdLndpZHRoID0gdGhpcy5jWzVdLmhlaWdodCA9IHRoaXMud3c7XG5cbiAgICB0aGlzLmN0eE1hc2sgPSB0aGlzLmNbNF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmN0eE92ZXJsYXkgPSB0aGlzLmNbNV0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmN0eE1hc2sudHJhbnNsYXRlKHRoaXMubWlkLCB0aGlzLm1pZCk7XG4gICAgdGhpcy5jdHhPdmVybGF5LnRyYW5zbGF0ZSh0aGlzLm1pZCwgdGhpcy5taWQpO1xuXG4gICAgdGhpcy5oc2wgPSBudWxsO1xuICAgIHRoaXMudmFsdWUgPSAnI2ZmZmZmZic7XG4gICAgaWYoIG8udmFsdWUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICBpZihvLnZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHRoaXMudmFsdWUgPSBUb29scy5yZ2JUb0hleCggby52YWx1ZSApO1xuICAgICAgICBlbHNlIGlmKCFpc05hTihvLnZhbHVlKSkgdGhpcy52YWx1ZSA9IFRvb2xzLmhleFRvSHRtbCggby52YWx1ZSApO1xuICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSBvLnZhbHVlO1xuICAgIH1cbiAgICB0aGlzLmJjb2xvciA9IG51bGw7XG4gICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcbiAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xuXG4gICAgdGhpcy5jWzJdLmV2ZW50cyA9IFsgJ2NsaWNrJyBdO1xuICAgIHRoaXMuY1s1XS5ldmVudHMgPSBbICdtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnLCAnbW91c2VvdXQnIF07XG5cbiAgICB0aGlzLnNldENvbG9yKCB0aGlzLnZhbHVlICk7XG5cbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmKCBvLm9wZW4gIT09IHVuZGVmaW5lZCApIHRoaXMub3BlbigpO1xuXG59XG5cbkNvbG9yLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogQ29sb3IsXG5cblx0aGFuZGxlRXZlbnQ6IGZ1bmN0aW9uKCBlICkge1xuXG5cdCAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdCAgICBzd2l0Y2goIGUudHlwZSApIHtcblx0ICAgICAgICBjYXNlICdjbGljayc6IHRoaXMuY2xpY2soZSk7IGJyZWFrO1xuXHQgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHRoaXMuZG93bihlKTsgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogdGhpcy5tb3ZlKGUpOyBicmVhaztcblx0ICAgICAgICBjYXNlICdtb3VzZXVwJzogdGhpcy51cChlKTsgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAnbW91c2VvdXQnOiB0aGlzLm91dChlKTsgYnJlYWs7XG5cdCAgICB9XG5cblx0fSxcblxuXHQvLyBBQ1RJT05cblxuXHRjbGljazogZnVuY3Rpb24oIGUgKXtcblxuXHQgICAgaWYoICF0aGlzLmlzT3BlbiApIHRoaXMub3BlbigpO1xuXHQgICAgZWxzZSB0aGlzLmNsb3NlKCk7XG5cblx0fSxcblxuXHR1cDogZnVuY3Rpb24oIGUgKXtcblxuXHQgICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcblxuXHR9LFxuXG5cdG91dDogZnVuY3Rpb24oIGUgKXtcblxuXHQgICAgaWYoIHRoaXMuaXNPcGVuICkgdGhpcy5jbG9zZSgpO1xuXG5cdH0sXG5cblx0ZG93bjogZnVuY3Rpb24oIGUgKXtcblxuXHQgICAgaWYoIXRoaXMuaXNPcGVuKSByZXR1cm47XG5cdCAgICB0aGlzLmlzRG93biA9IHRydWU7XG5cdCAgICB0aGlzLm1vdmUoIGUgKTtcblx0ICAgIC8vcmV0dXJuIGZhbHNlO1xuXG5cdH0sXG5cblx0bW92ZTogZnVuY3Rpb24oIGUgKXtcblxuXHQgICAgaWYoIXRoaXMuaXNEb3duKSByZXR1cm47XG5cblx0ICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5jWzVdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHQgICAgdmFyIHBvcyA9IHsgeDogZS5wYWdlWCAtIHRoaXMub2Zmc2V0LmxlZnQgLSB0aGlzLm1pZCwgeTogZS5wYWdlWSAtIHRoaXMub2Zmc2V0LnRvcCAtIHRoaXMubWlkIH07XG5cdCAgICB0aGlzLmNpcmNsZURyYWcgPSBNYXRoLm1heChNYXRoLmFicyhwb3MueCksIE1hdGguYWJzKHBvcy55KSkgPiAodGhpcy5zcXVhcmUgKyAyKTtcblxuXHQgICAgaWYgKCB0aGlzLmNpcmNsZURyYWcgKSB7XG5cdCAgICAgICAgdmFyIGh1ZSA9IE1hdGguYXRhbjIocG9zLngsIC1wb3MueSkgLyA2LjI4O1xuXHQgICAgICAgIHRoaXMuc2V0SFNMKFsoaHVlICsgMSkgJSAxLCB0aGlzLmhzbFsxXSwgdGhpcy5oc2xbMl1dKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdmFyIHNhdCA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIC0oIHBvcy54IC8gdGhpcy5zcXVhcmUgKiAwLjUpICsgLjUpICk7XG5cdCAgICAgICAgdmFyIGx1bSA9IE1hdGgubWF4KDAsIE1hdGgubWluKDEsIC0oIHBvcy55IC8gdGhpcy5zcXVhcmUgKiAwLjUpICsgLjUpICk7XG5cdCAgICAgICAgdGhpcy5zZXRIU0woW3RoaXMuaHNsWzBdLCBzYXQsIGx1bV0pO1xuXHQgICAgfVxuXG5cdH0sXG5cblxuXHQvLy8vLy9cblxuXHRyZWRyYXc6IGZ1bmN0aW9uKCl7XG5cblx0ICAgIFxuXHQgICAgdGhpcy5kcmF3Q2lyY2xlKCk7XG5cdCAgICB0aGlzLmRyYXdNYXNrKCk7XG5cdCAgICB0aGlzLmRyYXdNYXJrZXJzKCk7XG5cblx0ICAgIHRoaXMub2xkV2lkdGggPSB0aGlzLnd3O1xuXHQgICAgdGhpcy5pc0RyYXcgPSB0cnVlO1xuXG5cdCAgICAvL2NvbnNvbGUubG9nKHRoaXMuaXNEcmF3KVxuXG5cdH0sXG5cblx0b3BlbjogZnVuY3Rpb24oKXtcblxuXHRcdFByb3RvLnByb3RvdHlwZS5vcGVuLmNhbGwoIHRoaXMgKTtcblxuXHQgICAgaWYoIHRoaXMub2xkV2lkdGggIT09IHRoaXMud3cgKSB0aGlzLnJlZHJhdygpO1xuXG5cdCAgICB0aGlzLmggPSB0aGlzLnd3ICsgdGhpcy5iYXNlSCArIDEwO1xuXHQgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG5cblx0ICAgIGlmKCB0aGlzLnNpZGUgPT09ICd1cCcgKXsgXG5cdCAgICAgICAgdGhpcy5ob2xkVG9wID0gdGhpcy5zWzBdLnRvcC5zdWJzdHJpbmcoMCx0aGlzLnNbMF0udG9wLmxlbmd0aC0yKSAqIDEgfHwgJ2F1dG8nO1xuXHQgICAgICAgIGlmKCFpc05hTih0aGlzLmhvbGRUb3ApKSB0aGlzLnNbMF0udG9wID0gKHRoaXMuaG9sZFRvcC0odGhpcy5oLTIwKSkrJ3B4Jztcblx0ICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5zWzVdLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7fS5iaW5kKHRoaXMpLCAxMDApO1xuXHQgICAgfVxuXG5cdCAgICB0aGlzLnNbM10uZGlzcGxheSA9ICdibG9jayc7XG5cdCAgICB0aGlzLnNbNF0uZGlzcGxheSA9ICdibG9jayc7XG5cdCAgICB0aGlzLnNbNV0uZGlzcGxheSA9ICdibG9jayc7XG5cblx0ICAgIHZhciB0ID0gdGhpcy5oIC0gdGhpcy5iYXNlSDtcblxuXHQgICAgaWYgKCB0aGlzLnBhcmVudEdyb3VwICE9PSBudWxsICkgdGhpcy5wYXJlbnRHcm91cC5jYWxjKCB0ICk7XG5cdCAgICBlbHNlIGlmICggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNhbGMoIHQgKTtcblxuXHQgICAgY29uc29sZS5sb2coJ29wZW4nKTtcblxuXHR9LFxuXG5cdGNsb3NlOiBmdW5jdGlvbigpe1xuXG5cdCAgICBQcm90by5wcm90b3R5cGUuY2xvc2UuY2FsbCggdGhpcyApO1xuXG5cdCAgICB2YXIgdCA9IHRoaXMuaCAtIHRoaXMuYmFzZUg7XG5cblx0ICAgIGlmICggdGhpcy5wYXJlbnRHcm91cCAhPT0gbnVsbCApIHRoaXMucGFyZW50R3JvdXAuY2FsYyggLXQgKTtcblx0ICAgIGVsc2UgaWYgKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggLXQgKTsgXG5cblx0ICAgIFxuXHQgICAgdGhpcy5oID0gdGhpcy5iYXNlSDtcblx0ICAgIGlmKHRoaXMuc2lkZSA9PT0gJ3VwJyl7IFxuXHQgICAgICAgIGlmKCFpc05hTih0aGlzLmhvbGRUb3ApKSB0aGlzLnNbMF0udG9wID0gKHRoaXMuaG9sZFRvcCkrJ3B4Jztcblx0ICAgICAgICB0aGlzLnNbNV0ucG9pbnRlckV2ZW50cyA9ICdub25lJztcblx0ICAgIH1cblx0ICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmgrJ3B4Jztcblx0ICAgIHRoaXMuc1szXS5kaXNwbGF5ID0gJ25vbmUnO1xuXHQgICAgdGhpcy5zWzRdLmRpc3BsYXkgPSAnbm9uZSc7XG5cdCAgICB0aGlzLnNbNV0uZGlzcGxheSA9ICdub25lJztcblxuXHQgICAgY29uc29sZS5sb2coJ2Nsb3NlJyk7XG5cdCAgICBcblx0fSxcblxuXHR1cGRhdGU6IGZ1bmN0aW9uKCB1cCApe1xuXG5cdCAgICB0aGlzLnNbM10uYmFja2dyb3VuZCA9IFRvb2xzLnJnYlRvSGV4KCBUb29scy5oc2xUb1JnYihbdGhpcy5oc2xbMF0sIDEsIDAuNV0pICk7XG5cblx0ICAgIHRoaXMuZHJhd01hcmtlcnMoKTtcblx0ICAgIFxuXHQgICAgdGhpcy52YWx1ZSA9IHRoaXMuYmNvbG9yO1xuXG5cdCAgICB0aGlzLnNbMl0uYmFja2dyb3VuZCA9IHRoaXMuYmNvbG9yO1xuXHQgICAgdGhpcy5jWzJdLnRleHRDb250ZW50ID0gVG9vbHMuaHRtbFRvSGV4KCB0aGlzLmJjb2xvciApO1xuXG5cdCAgICB0aGlzLmludmVydCA9IFRvb2xzLmZpbmREZWVwSW52ZXIoIHRoaXMucmdiICk7XG5cdCAgICB0aGlzLnNbMl0uY29sb3IgPSB0aGlzLmludmVydCA/ICcjZmZmJyA6ICcjMDAwJztcblxuXHQgICAgaWYoIXVwKSByZXR1cm47XG5cblx0ICAgIGlmKCB0aGlzLmN0eXBlID09PSAnYXJyYXknICkgdGhpcy5zZW5kKCB0aGlzLnJnYiApO1xuXHQgICAgaWYoIHRoaXMuY3R5cGUgPT09ICdyZ2InICkgdGhpcy5zZW5kKCBUb29scy5odG1sUmdiKCB0aGlzLnJnYiApICk7XG5cdCAgICBpZiggdGhpcy5jdHlwZSA9PT0gJ2hleCcgKSB0aGlzLnNlbmQoIFRvb2xzLmh0bWxUb0hleCggdGhpcy52YWx1ZSApICk7XG5cdCAgICBpZiggdGhpcy5jdHlwZSA9PT0gJ2h0bWwnICkgdGhpcy5zZW5kKCk7XG5cblx0fSxcblxuXHRzZXRDb2xvcjogZnVuY3Rpb24oIGNvbG9yICl7XG5cblx0ICAgIHZhciB1bnBhY2sgPSBUb29scy51bnBhY2soY29sb3IpO1xuXHQgICAgaWYgKHRoaXMuYmNvbG9yICE9IGNvbG9yICYmIHVucGFjaykge1xuXHQgICAgICAgIHRoaXMuYmNvbG9yID0gY29sb3I7XG5cdCAgICAgICAgdGhpcy5yZ2IgPSB1bnBhY2s7XG5cdCAgICAgICAgdGhpcy5oc2wgPSBUb29scy5yZ2JUb0hzbCggdGhpcy5yZ2IgKTtcblx0ICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuIHRoaXM7XG5cblx0fSxcblxuXHRzZXRIU0w6IGZ1bmN0aW9uKCBoc2wgKXtcblxuXHQgICAgdGhpcy5oc2wgPSBoc2w7XG5cdCAgICB0aGlzLnJnYiA9IFRvb2xzLmhzbFRvUmdiKCBoc2wgKTtcblx0ICAgIHRoaXMuYmNvbG9yID0gVG9vbHMucmdiVG9IZXgoIHRoaXMucmdiICk7XG5cdCAgICB0aGlzLnVwZGF0ZSggdHJ1ZSApO1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cblx0fSxcblxuXHRjYWxjdWxhdGVNYXNrOiBmdW5jdGlvbiggc2l6ZXgsIHNpemV5LCBvdXRwdXRQaXhlbCApe1xuXG5cdCAgICB2YXIgaXN4ID0gMSAvIHNpemV4LCBpc3kgPSAxIC8gc2l6ZXk7XG5cdCAgICBmb3IgKHZhciB5ID0gMDsgeSA8PSBzaXpleTsgKyt5KSB7XG5cdCAgICAgICAgdmFyIGwgPSAxIC0geSAqIGlzeTtcblx0ICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8PSBzaXpleDsgKyt4KSB7XG5cdCAgICAgICAgICAgIHZhciBzID0gMSAtIHggKiBpc3g7XG5cdCAgICAgICAgICAgIHZhciBhID0gMSAtIDIgKiBNYXRoLm1pbihsICogcywgKDEgLSBsKSAqIHMpO1xuXHQgICAgICAgICAgICB2YXIgYyA9IChhID4gMCkgPyAoKDIgKiBsIC0gMSArIGEpICogLjUgLyBhKSA6IDA7XG5cdCAgICAgICAgICAgIG91dHB1dFBpeGVsKHgsIHksIGMsIGEpO1xuXHQgICAgICAgIH1cblx0ICAgIH1cblxuXHR9LFxuXG5cdGRyYXdNYXNrOiBmdW5jdGlvbigpe1xuXG5cdCAgICB2YXIgc2l6ZSA9IHRoaXMuc3F1YXJlICogMiwgc3EgPSB0aGlzLnNxdWFyZTtcblx0ICAgIHZhciBzeiA9IE1hdGguZmxvb3Ioc2l6ZSAvIDIpO1xuXHQgICAgdmFyIGJ1ZmZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXHQgICAgYnVmZmVyLndpZHRoID0gYnVmZmVyLmhlaWdodCA9IHN6ICsgMTtcblx0ICAgIHZhciBjdHggPSBidWZmZXIuZ2V0Q29udGV4dCgnMmQnKTtcblx0ICAgIHZhciBmcmFtZSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgc3ogKyAxLCBzeiArIDEpO1xuXG5cdCAgICB2YXIgaSA9IDA7XG5cdCAgICB0aGlzLmNhbGN1bGF0ZU1hc2soc3osIHN6LCBmdW5jdGlvbiAoeCwgeSwgYywgYSkge1xuXHQgICAgICAgIGZyYW1lLmRhdGFbaSsrXSA9IGZyYW1lLmRhdGFbaSsrXSA9IGZyYW1lLmRhdGFbaSsrXSA9IGMgKiAyNTU7XG5cdCAgICAgICAgZnJhbWUuZGF0YVtpKytdID0gYSAqIDI1NTtcblx0ICAgIH0pO1xuXG5cdCAgICBjdHgucHV0SW1hZ2VEYXRhKGZyYW1lLCAwLCAwKTtcblx0ICAgIHRoaXMuY3R4TWFzay5kcmF3SW1hZ2UoYnVmZmVyLCAwLCAwLCBzeiArIDEsIHN6ICsgMSwgLXNxLCAtc3EsIHNxICogMiwgc3EgKiAyKTtcblxuXHR9LFxuXG5cdGRyYXdDaXJjbGU6IGZ1bmN0aW9uKCl7XG5cblx0ICAgIHZhciBuID0gMjQsciA9IHRoaXMuY29sb3JSYWRpdXMsIHcgPSB0aGlzLndoZWVsV2lkdGgsIG51ZGdlID0gOCAvIHIgLyBuICogTWF0aC5QSSwgbSA9IHRoaXMuY3R4TWFzaywgYTEgPSAwLCBjb2xvcjEsIGQxO1xuXHQgICAgdmFyIHltLCBhbSwgdGFuLCB4bSwgY29sb3IyLCBkMiwgYTIsIGFyO1xuXHQgICAgbS5zYXZlKCk7XG5cdCAgICBtLmxpbmVXaWR0aCA9IHcgLyByO1xuXHQgICAgbS5zY2FsZShyLCByKTtcblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IG47ICsraSkge1xuXHQgICAgICAgIGQyID0gaSAvIG47XG5cdCAgICAgICAgYTIgPSBkMiAqIE1hdGguUEkgKiAyO1xuXHQgICAgICAgIGFyID0gW01hdGguc2luKGExKSwgLU1hdGguY29zKGExKSwgTWF0aC5zaW4oYTIpLCAtTWF0aC5jb3MoYTIpXTtcblx0ICAgICAgICBhbSA9IChhMSArIGEyKSAqIDAuNTtcblx0ICAgICAgICB0YW4gPSAxIC8gTWF0aC5jb3MoKGEyIC0gYTEpICogMC41KTtcblx0ICAgICAgICB4bSA9IE1hdGguc2luKGFtKSAqIHRhbiwgeW0gPSAtTWF0aC5jb3MoYW0pICogdGFuO1xuXHQgICAgICAgIGNvbG9yMiA9IFRvb2xzLnJnYlRvSGV4KCBUb29scy5oc2xUb1JnYihbZDIsIDEsIDAuNV0pICk7XG5cdCAgICAgICAgaWYgKGkgPiAwKSB7XG5cdCAgICAgICAgICAgIHZhciBncmFkID0gbS5jcmVhdGVMaW5lYXJHcmFkaWVudChhclswXSwgYXJbMV0sIGFyWzJdLCBhclszXSk7XG5cdCAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsIGNvbG9yMSk7XG5cdCAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsIGNvbG9yMik7XG5cdCAgICAgICAgICAgIG0uc3Ryb2tlU3R5bGUgPSBncmFkO1xuXHQgICAgICAgICAgICBtLmJlZ2luUGF0aCgpO1xuXHQgICAgICAgICAgICBtLm1vdmVUbyhhclswXSwgYXJbMV0pO1xuXHQgICAgICAgICAgICBtLnF1YWRyYXRpY0N1cnZlVG8oeG0sIHltLCBhclsyXSwgYXJbM10pO1xuXHQgICAgICAgICAgICBtLnN0cm9rZSgpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICBhMSA9IGEyIC0gbnVkZ2U7IFxuXHQgICAgICAgIGNvbG9yMSA9IGNvbG9yMjtcblx0ICAgICAgICBkMSA9IGQyO1xuXHQgICAgfVxuXHQgICAgbS5yZXN0b3JlKCk7XG5cblx0fSxcblxuXHRkcmF3TWFya2VyczogZnVuY3Rpb24oKXtcblxuXHQgICAgdmFyIG0gPSB0aGlzLm1hcmtlclNpemUsIHJhPXRoaXMuY29sb3JSYWRpdXMsIHN6ID0gdGhpcy53dywgbHcgPSBNYXRoLmNlaWwobS8gNCksIHIgPSBtIC0gbHcgKyAxLCBjMSA9IHRoaXMuaW52ZXJ0ID8gJyNmZmYnIDogJyMwMDAnLCBjMiA9IHRoaXMuaW52ZXJ0ID8gJyMwMDAnIDogJyNmZmYnO1xuXHQgICAgdmFyIGFuZ2xlID0gdGhpcy5oc2xbMF0gKiA2LjI4O1xuXHQgICAgdmFyIGFyID0gW01hdGguc2luKGFuZ2xlKSAqIHJhLCAtTWF0aC5jb3MoYW5nbGUpICogcmEsIDIgKiB0aGlzLnNxdWFyZSAqICguNSAtIHRoaXMuaHNsWzFdKSwgMiAqIHRoaXMuc3F1YXJlICogKC41IC0gdGhpcy5oc2xbMl0pIF07XG5cdCAgXG5cdCAgICB2YXIgY2lyY2xlcyA9IFtcblx0ICAgICAgICB7IHg6IGFyWzJdLCB5OiBhclszXSwgcjogbSwgYzogYzEsICAgICBsdzogbHcgfSxcblx0ICAgICAgICB7IHg6IGFyWzJdLCB5OiBhclszXSwgcjogciwgYzogYzIsICAgICBsdzogbHcgKyAxIH0sXG5cdCAgICAgICAgeyB4OiBhclswXSwgeTogYXJbMV0sIHI6IG0sIGM6ICcjZmZmJywgbHc6IGx3IH0sXG5cdCAgICAgICAgeyB4OiBhclswXSwgeTogYXJbMV0sIHI6IHIsIGM6ICcjMDAwJywgbHc6IGx3ICsgMSB9LFxuXHQgICAgXTtcblx0ICAgIHRoaXMuY3R4T3ZlcmxheS5jbGVhclJlY3QoLXRoaXMubWlkLCAtdGhpcy5taWQsIHN6LCBzeik7XG5cdCAgICB2YXIgaSA9IGNpcmNsZXMubGVuZ3RoO1xuXHQgICAgd2hpbGUoaS0tKXtcblx0ICAgICAgICB2YXIgYyA9IGNpcmNsZXNbaV07XG5cdCAgICAgICAgdGhpcy5jdHhPdmVybGF5LmxpbmVXaWR0aCA9IGMubHc7XG5cdCAgICAgICAgdGhpcy5jdHhPdmVybGF5LnN0cm9rZVN0eWxlID0gYy5jO1xuXHQgICAgICAgIHRoaXMuY3R4T3ZlcmxheS5iZWdpblBhdGgoKTtcblx0ICAgICAgICB0aGlzLmN0eE92ZXJsYXkuYXJjKGMueCwgYy55LCBjLnIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcblx0ICAgICAgICB0aGlzLmN0eE92ZXJsYXkuc3Ryb2tlKCk7XG5cdCAgICB9XG5cblx0fSxcblxuXHRyU2l6ZTogZnVuY3Rpb24oKXtcblxuXHQgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcblxuXHQgICAgdGhpcy53dyA9IHRoaXMuc2I7XG5cdCAgICB0aGlzLndoZWVsV2lkdGggPSB0aGlzLnd3KjAuMTtcblxuXHQgICAgaWYoIHRoaXMuc2lkZSA9PT0gJ3VwJyApIHRoaXMuZGVjYWwgPSA1O1xuXHQgICAgdGhpcy5jb2xvclJhZGl1cyA9ICh0aGlzLnd3IC0gdGhpcy53aGVlbFdpZHRoKSAqIDAuNSAtIDE7XG5cdCAgICB0aGlzLnNxdWFyZSA9IE1hdGguZmxvb3IoKHRoaXMuY29sb3JSYWRpdXMgLSB0aGlzLndoZWVsV2lkdGggKiAwLjUpICogMC43KSAtIDE7XG5cdCAgICB0aGlzLm1pZCA9IE1hdGguZmxvb3IodGhpcy53dyAqIDAuNSApO1xuXHQgICAgdGhpcy5tYXJrZXJTaXplID0gdGhpcy53aGVlbFdpZHRoICogMC4zO1xuXG5cdCAgICB2YXIgcyA9IHRoaXMucztcblxuXHQgICAgc1syXS53aWR0aCA9IHRoaXMuc2IgKyAncHgnO1xuXHQgICAgc1syXS5sZWZ0ID0gdGhpcy5zYSArICdweCc7XG5cblx0ICAgIHNbM10ud2lkdGggPSAodGhpcy5zcXVhcmUgKiAyIC0gMSkgKyAncHgnO1xuXHQgICAgc1szXS5oZWlnaHQgPSAodGhpcy5zcXVhcmUgKiAyIC0gMSkgKyAncHgnO1xuXHQgICAgc1szXS50b3AgPSAodGhpcy5taWQrdGhpcy5kZWNhbCApLXRoaXMuc3F1YXJlICsgJ3B4Jztcblx0ICAgIHNbM10ubGVmdCA9ICh0aGlzLm1pZCt0aGlzLnNhICktdGhpcy5zcXVhcmUgKyAncHgnO1xuXG5cdCAgICB0aGlzLmNbNF0ud2lkdGggPSB0aGlzLmNbNF0uaGVpZ2h0ID0gdGhpcy53dztcblx0ICAgIHNbNF0ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuXHQgICAgc1s0XS50b3AgPSB0aGlzLmRlY2FsICsgJ3B4JztcblxuXHQgICAgdGhpcy5jWzVdLndpZHRoID0gdGhpcy5jWzVdLmhlaWdodCA9IHRoaXMud3c7XG5cdCAgICBzWzVdLmxlZnQgPSB0aGlzLnNhICsgJ3B4Jztcblx0ICAgIHNbNV0udG9wID0gdGhpcy5kZWNhbCArICdweCc7XG5cblx0ICAgIHRoaXMuY3R4TWFzay50cmFuc2xhdGUodGhpcy5taWQsIHRoaXMubWlkKTtcblx0ICAgIHRoaXMuY3R4T3ZlcmxheS50cmFuc2xhdGUodGhpcy5taWQsIHRoaXMubWlkKTtcblxuXHQgICAgaWYoIHRoaXMuaXNPcGVuICl7IFxuXHQgICAgICAgIHRoaXMucmVkcmF3KCk7XG5cblx0ICAgICAgICAvL3RoaXMub3BlbigpO1xuXHQgICAgICAgIC8vdGhpcy5oID0gdGhpcy53dyszMDtcblx0ICAgICAgICAvL3RoaXMuY1swXS5oZWlnaHQgPSB0aGlzLmggKyAncHgnO1xuXHQgICAgICAgIC8vaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCk7XG5cdCAgICB9XG5cblx0fVxuXG59ICk7XG5cbmZ1bmN0aW9uIEZwcyAoIG8gKSB7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICB0aGlzLnJvdW5kID0gTWF0aC5yb3VuZDtcblxuICAgIHRoaXMuYXV0b0hlaWdodCA9IHRydWU7XG5cbiAgICB0aGlzLmJhc2VIID0gdGhpcy5oO1xuICAgIHRoaXMuaHBsdXMgPSA1MDtcblxuICAgIHRoaXMucmVzID0gby5yZXMgfHwgNDA7XG4gICAgdGhpcy5sID0gMTtcblxuICAgIHRoaXMucGExID0gW107XG4gICAgdGhpcy5wYTIgPSBbXTtcbiAgICB0aGlzLnBhMyA9IFtdO1xuXG4gICAgdmFyIGkgPSB0aGlzLnJlcysxO1xuICAgIHdoaWxlKGktLSl7XG4gICAgICAgIHRoaXMucGExLnB1c2goNTApO1xuICAgICAgICB0aGlzLnBhMi5wdXNoKDUwKTtcbiAgICAgICAgdGhpcy5wYTMucHVzaCg1MCk7XG4gICAgfVxuXG4gICAgdmFyIGZsdG9wID0gTWF0aC5mbG9vcih0aGlzLmgqMC41KS02O1xuXG4gICAgdGhpcy5jWzFdLnRleHRDb250ZW50ID0gJ0ZQUyc7XG4gICAgdGhpcy5jWzBdLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICB0aGlzLmNbMF0uc3R5bGUucG9pbnRlckV2ZW50cyA9ICdhdXRvJztcblxuICAgIHZhciBwYW5lbENzcyA9ICdkaXNwbGF5Om5vbmU7IGxlZnQ6MTBweDsgdG9wOicrIHRoaXMuaCArICdweDsgaGVpZ2h0OicrKHRoaXMuaHBsdXMgLSA4KSsncHg7IGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4yKTsnICsgJ2JvcmRlcjoxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpOyAnO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAncGF0aCcsIFRvb2xzLmNzcy5iYXNpYyArIHBhbmVsQ3NzICwgeyBmaWxsOidyZ2JhKDIwMCwyMDAsMjAwLDAuMyknLCAnc3Ryb2tlLXdpZHRoJzoxLCBzdHJva2U6dGhpcy5mb250Q29sb3IsICd2ZWN0b3ItZWZmZWN0Jzonbm9uLXNjYWxpbmctc3Ryb2tlJyB9KTtcblxuICAgIHRoaXMuY1syXS5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwICcrdGhpcy5yZXMrJyA0MicgKTtcbiAgICB0aGlzLmNbMl0uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScgKTtcbiAgICB0aGlzLmNbMl0uc2V0QXR0cmlidXRlKCd3aWR0aCcsICcxMDAlJyApO1xuICAgIHRoaXMuY1syXS5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAnbm9uZScgKTtcblxuICAgIFRvb2xzLmRvbSggJ3BhdGgnLCBudWxsLCB7IGZpbGw6J3JnYmEoMjU1LDI1NSwwLDAuMyknLCAnc3Ryb2tlLXdpZHRoJzoxLCBzdHJva2U6JyNGRjAnLCAndmVjdG9yLWVmZmVjdCc6J25vbi1zY2FsaW5nLXN0cm9rZScgfSwgdGhpcy5jWzJdICk7XG4gICAgVG9vbHMuZG9tKCAncGF0aCcsIG51bGwsIHsgZmlsbDoncmdiYSgwLDI1NSwyNTUsMC4zKScsICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTonIzBGRicsICd2ZWN0b3ItZWZmZWN0Jzonbm9uLXNjYWxpbmctc3Ryb2tlJyB9LCB0aGlzLmNbMl0gKTtcblxuXG4gICAgLy8gYm90dG9tIGxpbmVcbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnd2lkdGg6MTAwJTsgYm90dG9tOjBweDsgaGVpZ2h0OjFweDsgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpOycpO1xuXG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAncGF0aCcsIFRvb2xzLmNzcy5iYXNpYyArICdwb3NpdGlvbjphYnNvbHV0ZTsgd2lkdGg6MTBweDsgaGVpZ2h0OjEwcHg7IGxlZnQ6NHB4OyB0b3A6JytmbHRvcCsncHg7JywgeyBkOidNIDMgOCBMIDggNSAzIDIgMyA4IFonLCBmaWxsOnRoaXMuZm9udENvbG9yLCBzdHJva2U6J25vbmUnfSk7XG5cbiAgICB0aGlzLmlzU2hvdyA9IG8uc2hvdyB8fCBmYWxzZTtcblxuICAgIHRoaXMuY1sxXS5zdHlsZS5tYXJnaW5MZWZ0ID0gJzEwcHgnO1xuXG4gICAgdGhpcy5ub3cgPSAoIHNlbGYucGVyZm9ybWFuY2UgJiYgc2VsZi5wZXJmb3JtYW5jZS5ub3cgKSA/IHNlbGYucGVyZm9ybWFuY2Uubm93LmJpbmQoIHBlcmZvcm1hbmNlICkgOiBEYXRlLm5vdztcbiAgICB0aGlzLnN0YXJ0VGltZSA9IHRoaXMubm93KCk7XG4gICAgdGhpcy5wcmV2VGltZSA9IHRoaXMuc3RhcnRUaW1lO1xuICAgIHRoaXMuZnJhbWVzID0gMDtcblxuICAgIHRoaXMuaXNNZW0gPSBmYWxzZTtcblxuICAgIHRoaXMubXMgPSAwO1xuICAgIHRoaXMuZnBzID0gMDtcbiAgICB0aGlzLm1lbSA9IDA7XG4gICAgdGhpcy5tbSA9IDA7XG5cbiAgICBpZiAoIHNlbGYucGVyZm9ybWFuY2UgJiYgc2VsZi5wZXJmb3JtYW5jZS5tZW1vcnkgKSB0aGlzLmlzTWVtID0gdHJ1ZTtcblxuICAgIHRoaXMuY1swXS5ldmVudHMgPSBbICdjbGljaycsICdtb3VzZWRvd24nLCAnbW91c2VvdmVyJywgJ21vdXNlb3V0JyBdO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICAvL2lmKCB0aGlzLmlzU2hvdyApIHRoaXMuc2hvdygpO1xuXG59XG5cblxuRnBzLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogRnBzLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdjbGljayc6IHRoaXMuY2xpY2soZSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdmVyJzogdGhpcy5tb2RlKDEpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHRoaXMubW9kZSgyKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW91dCc6ICB0aGlzLm1vZGUoMCk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbW9kZTogZnVuY3Rpb24gKCBtb2RlICkge1xuXG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuXG4gICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgIGNhc2UgMDogLy8gYmFzZVxuICAgICAgICAgICAgICAgIHNbMV0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICAvL3NbMV0uYmFja2dyb3VuZCA9ICdub25lJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiAvLyBvdmVyXG4gICAgICAgICAgICAgICAgc1sxXS5jb2xvciA9ICcjRkZGJztcbiAgICAgICAgICAgICAgICAvL3NbMV0uYmFja2dyb3VuZCA9IFVJTC5TRUxFQ1Q7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogLy8gZWRpdCAvIGRvd25cbiAgICAgICAgICAgICAgICBzWzFdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgLy9zWzFdLmJhY2tncm91bmQgPSBVSUwuU0VMRUNURE9XTjtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY2xpY2s6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBpZiggdGhpcy5pc1Nob3cgKSB0aGlzLmhpZGUoKTtcbiAgICAgICAgZWxzZSB0aGlzLnNob3coKTtcblxuICAgIH0sXG5cbiAgICBtYWtlUGF0aDogZnVuY3Rpb24gKCBwb2ludCApIHtcblxuICAgICAgICB2YXIgcCA9ICcnO1xuICAgICAgICBwICs9ICdNICcgKyAoLTEpICsgJyAnICsgNTA7XG4gICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMucmVzICsgMTsgaSArKyApIHsgcCArPSAnIEwgJyArIGkgKyAnICcgKyBwb2ludFtpXTsgfVxuICAgICAgICBwICs9ICcgTCAnICsgKHRoaXMucmVzICsgMSkgKyAnICcgKyA1MDtcblxuICAgICAgICByZXR1cm4gcDtcblxuICAgIH0sXG5cbiAgICBkcmF3R3JhcGg6IGZ1bmN0aW9uKCApe1xuXG4gICAgICAgIHZhciBzdmcgPSB0aGlzLmNbMl07XG5cbiAgICAgICAgdGhpcy5wYTEuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5wYTEucHVzaCggOC41ICsgdGhpcy5yb3VuZCggKCAxIC0gKHRoaXMuZnBzIC8gMTAwKSkgKiAzMCApICk7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCBzdmcsICdkJywgdGhpcy5tYWtlUGF0aCggdGhpcy5wYTEgKSwgMCApO1xuXG4gICAgICAgIHRoaXMucGEyLnNoaWZ0KCk7XG4gICAgICAgIHRoaXMucGEyLnB1c2goIDguNSArIHRoaXMucm91bmQoICggMSAtICh0aGlzLm1zIC8gMjAwKSkgKiAzMCApICk7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCBzdmcsICdkJywgdGhpcy5tYWtlUGF0aCggdGhpcy5wYTIgKSwgMSApO1xuXG4gICAgICAgIGlmICggdGhpcy5pc01lbSApIHtcblxuICAgICAgICAgICAgdGhpcy5wYTMuc2hpZnQoKTtcbiAgICAgICAgICAgIHRoaXMucGEzLnB1c2goIDguNSArIHRoaXMucm91bmQoICggMSAtIHRoaXMubW0pICogMzAgKSApO1xuXG4gICAgICAgICAgICBUb29scy5zZXRTdmcoIHN2ZywgJ2QnLCB0aGlzLm1ha2VQYXRoKCB0aGlzLnBhMyApLCAyICk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHNob3c6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5oID0gdGhpcy5ocGx1cyArIHRoaXMuYmFzZUg7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdkJywnTSA1IDggTCA4IDMgMiAzIDUgOCBaJyk7XG5cblxuICAgICAgICBpZiggdGhpcy5wYXJlbnRHcm91cCAhPT0gbnVsbCApeyB0aGlzLnBhcmVudEdyb3VwLmNhbGMoIHRoaXMuaHBsdXMgKTt9XG4gICAgICAgIGVsc2UgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCB0aGlzLmhwbHVzICk7XG5cbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArJ3B4JztcbiAgICAgICAgdGhpcy5zWzJdLmRpc3BsYXkgPSAnYmxvY2snOyBcbiAgICAgICAgdGhpcy5pc1Nob3cgPSB0cnVlO1xuXG4gICAgICAgIFRvb2xzLmFkZExpc3RlbiggdGhpcyApO1xuXG4gICAgfSxcblxuICAgIGhpZGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5oID0gdGhpcy5iYXNlSDtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2QnLCdNIDMgOCBMIDggNSAzIDIgMyA4IFonKTtcblxuICAgICAgICBpZiggdGhpcy5wYXJlbnRHcm91cCAhPT0gbnVsbCApeyB0aGlzLnBhcmVudEdyb3VwLmNhbGMoIC10aGlzLmhwbHVzICk7fVxuICAgICAgICBlbHNlIGlmKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggLXRoaXMuaHBsdXMgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmggKydweCc7XG4gICAgICAgIHRoaXMuc1syXS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLmlzU2hvdyA9IGZhbHNlO1xuXG4gICAgICAgIFRvb2xzLnJlbW92ZUxpc3RlbiggdGhpcyApO1xuICAgICAgICB0aGlzLmNbMV0udGV4dENvbnRlbnQgPSAnRlBTJztcbiAgICAgICAgXG4gICAgfSxcblxuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGJlZ2luOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5ub3coKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIGVuZDogZnVuY3Rpb24oKXtcblxuXG4gICAgICAgIHZhciB0aW1lID0gdGhpcy5ub3coKTtcbiAgICAgICAgdGhpcy5tcyA9IHRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcblxuICAgICAgICB0aGlzLmZyYW1lcyArKztcblxuICAgICAgICBpZiAoIHRpbWUgPiB0aGlzLnByZXZUaW1lICsgMTAwMCApIHtcblxuICAgICAgICAgICAgdGhpcy5mcHMgPSB0aGlzLnJvdW5kKCAoIHRoaXMuZnJhbWVzICogMTAwMCApIC8gKCB0aW1lIC0gdGhpcy5wcmV2VGltZSApICk7XG5cbiAgICAgICAgICAgIHRoaXMucHJldlRpbWUgPSB0aW1lO1xuICAgICAgICAgICAgdGhpcy5mcmFtZXMgPSAwO1xuXG4gICAgICAgICAgICBpZiAoIHRoaXMuaXNNZW0gKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaGVhcFNpemUgPSBwZXJmb3JtYW5jZS5tZW1vcnkudXNlZEpTSGVhcFNpemU7XG4gICAgICAgICAgICAgICAgdmFyIGhlYXBTaXplTGltaXQgPSBwZXJmb3JtYW5jZS5tZW1vcnkuanNIZWFwU2l6ZUxpbWl0O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5tZW0gPSB0aGlzLnJvdW5kKCBoZWFwU2l6ZSAqIDAuMDAwMDAwOTU0ICk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1tID0gaGVhcFNpemUgLyBoZWFwU2l6ZUxpbWl0O1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhd0dyYXBoKCk7XG4gICAgICAgIHRoaXMuY1sxXS5pbm5lckhUTUwgPSAnRlBTICcgKyB0aGlzLmZwcyArICc8Zm9udCBjb2xvcj1cInllbGxvd1wiPiBNUyAnKyAoIHRoaXMubXMgfCAwICkgKyAnPC9mb250Pjxmb250IGNvbG9yPVwiY3lhblwiPiBNQiAnKyB0aGlzLm1lbSArICc8L2ZvbnQ+JztcblxuICAgICAgICByZXR1cm4gdGltZTtcblxuICAgICAgICBcbiAgICB9LFxuXG4gICAgbGlzdGVuaW5nOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5lbmQoKTtcbiAgICAgICAgXG4gICAgfSxcblxuXG4gICAgclNpemU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zWzBdLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gICAgICAgIHRoaXMuc1sxXS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICAgICAgICB0aGlzLnNbMl0ubGVmdCA9IDEwICsgJ3B4JztcbiAgICAgICAgdGhpcy5zWzJdLndpZHRoID0gKHRoaXMud2lkdGgtMjApICsgJ3B4JztcbiAgICAgICAgXG4gICAgfSxcbiAgICBcbn0gKTtcblxuZnVuY3Rpb24gR3JvdXAgKCBvICkge1xuIFxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMuYXV0b0hlaWdodCA9IHRydWU7XG4gICAgdGhpcy5pc0dyb3VwID0gdHJ1ZTtcblxuICAgIC8vdGhpcy5iZyA9IG8uYmcgfHwgbnVsbDtcbiAgICBcblxuICAgIC8vdGhpcy5oID0gMjU7XG4gICAgdGhpcy5iYXNlSCA9IHRoaXMuaDtcbiAgICB2YXIgZmx0b3AgPSBNYXRoLmZsb29yKHRoaXMuaCowLjUpLTY7XG5cblxuICAgIHRoaXMuaXNMaW5lID0gby5saW5lICE9PSB1bmRlZmluZWQgPyBvLmxpbmUgOiBmYWxzZTtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICd3aWR0aDoxMDAlOyBsZWZ0OjA7IGhlaWdodDphdXRvOyBvdmVyZmxvdzpoaWRkZW47IHRvcDonK3RoaXMuaCsncHgnKTtcbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdwYXRoJywgVG9vbHMuY3NzLmJhc2ljICsgJ3Bvc2l0aW9uOmFic29sdXRlOyB3aWR0aDoxMHB4OyBoZWlnaHQ6MTBweDsgbGVmdDowOyB0b3A6JytmbHRvcCsncHg7JywgeyBkOlRvb2xzLkdQQVRILCBmaWxsOnRoaXMuZm9udENvbG9yLCBzdHJva2U6J25vbmUnfSk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAncGF0aCcsIFRvb2xzLmNzcy5iYXNpYyArICdwb3NpdGlvbjphYnNvbHV0ZTsgd2lkdGg6MTBweDsgaGVpZ2h0OjEwcHg7IGxlZnQ6NHB4OyB0b3A6JytmbHRvcCsncHg7JywgeyBkOidNIDMgOCBMIDggNSAzIDIgMyA4IFonLCBmaWxsOnRoaXMuZm9udENvbG9yLCBzdHJva2U6J25vbmUnfSk7XG4gICAgLy8gYm90dG9tIGxpbmVcbiAgICBpZih0aGlzLmlzTGluZSkgdGhpcy5jWzVdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgICdiYWNrZ3JvdW5kOnJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yKTsgd2lkdGg6MTAwJTsgbGVmdDowOyBoZWlnaHQ6MXB4OyBib3R0b206MHB4Jyk7XG5cbiAgICB2YXIgcyA9IHRoaXMucztcblxuICAgIHNbMF0uaGVpZ2h0ID0gdGhpcy5oICsgJ3B4JztcbiAgICBzWzFdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG4gICAgLy9zWzFdLnRvcCA9IDQgKyAncHgnO1xuICAgIC8vc1sxXS5sZWZ0ID0gNCArICdweCc7XG4gICAgc1sxXS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuICAgIHNbMV0uY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIHRoaXMuY1sxXS5uYW1lID0gJ2dyb3VwJztcblxuICAgIHRoaXMuc1sxXS5tYXJnaW5MZWZ0ID0gJzEwcHgnO1xuICAgIHRoaXMuc1sxXS5saW5lSGVpZ2h0ID0gdGhpcy5oLTQ7XG4gICAgdGhpcy5zWzFdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgdGhpcy5zWzFdLmZvbnRXZWlnaHQgPSAnYm9sZCc7XG5cbiAgICB0aGlzLnVpcyA9IFtdO1xuXG4gICAgdGhpcy5jWzFdLmV2ZW50cyA9IFsgJ2NsaWNrJyBdO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICBpZiggby5iZyAhPT0gdW5kZWZpbmVkICkgdGhpcy5zZXRCRyhvLmJnKTtcbiAgICBpZiggby5vcGVuICE9PSB1bmRlZmluZWQgKSB0aGlzLm9wZW4oKTtcblxufVxuXG5Hcm91cC5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IEdyb3VwLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzogdGhpcy5jbGljayggZSApOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuXG4gICAgY2xpY2s6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBpZiggdGhpcy5pc09wZW4gKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2UgdGhpcy5vcGVuKCk7XG5cbiAgICB9LFxuXG4gICAgc2V0Qkc6IGZ1bmN0aW9uICggYyApIHtcblxuICAgICAgICB0aGlzLnNbMF0uYmFja2dyb3VuZCA9IGM7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5zZXRCRyggYyApO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbiggKXtcblxuICAgICAgICB2YXIgYSA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZiggdHlwZW9mIGFbMV0gPT09ICdvYmplY3QnICl7IFxuICAgICAgICAgICAgYVsxXS5pc1VJID0gdGhpcy5pc1VJO1xuICAgICAgICAgICAgYVsxXS50YXJnZXQgPSB0aGlzLmNbMl07XG4gICAgICAgICAgICBhWzFdLm1haW4gPSB0aGlzLm1haW47XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGlmKCBhWzJdID09PSB1bmRlZmluZWQgKSBbXS5wdXNoLmNhbGwoYSwgeyBpc1VJOnRydWUsIHRhcmdldDp0aGlzLmNbMl0sIG1haW46dGhpcy5tYWluIH0pO1xuICAgICAgICAgICAgZWxzZXsgXG4gICAgICAgICAgICAgICAgYVsyXS5pc1VJID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhWzJdLnRhcmdldCA9IHRoaXMuY1syXTtcbiAgICAgICAgICAgICAgICBhWzJdLm1haW4gPSB0aGlzLm1haW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbiA9IGFkZC5hcHBseSggdGhpcywgYSApO1xuICAgICAgICB0aGlzLnVpcy5wdXNoKCBuICk7XG5cbiAgICAgICAgaWYoIG4uYXV0b0hlaWdodCApIG4ucGFyZW50R3JvdXAgPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBuO1xuXG4gICAgfSxcblxuICAgIG9wZW46IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBQcm90by5wcm90b3R5cGUub3Blbi5jYWxsKCB0aGlzICk7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdkJywnTSA1IDggTCA4IDMgMiAzIDUgOCBaJyk7XG4gICAgICAgIC8vdGhpcy5zWzRdLmJhY2tncm91bmQgPSBVSUwuRjE7XG4gICAgICAgIHRoaXMuclNpemVDb250ZW50KCk7XG5cbiAgICAgICAgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCB0aGlzLmggLSB0aGlzLmJhc2VIICk7XG5cbiAgICB9LFxuXG4gICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBQcm90by5wcm90b3R5cGUuY2xvc2UuY2FsbCggdGhpcyApO1xuXG4gICAgICAgIGlmKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggLSggdGhpcy5oIC0gdGhpcy5iYXNlSCApICk7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdkJywnTSAzIDggTCA4IDUgMyAyIDMgOCBaJyk7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuYmFzZUg7XG4gICAgICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmggKyAncHgnO1xuXG4gICAgfSxcblxuICAgIGNsZWFyOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuY2xlYXJHcm91cCgpO1xuICAgICAgICBpZiggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNhbGMoIC0odGhpcy5oICsxICkpO1xuICAgICAgICBQcm90by5wcm90b3R5cGUuY2xlYXIuY2FsbCggdGhpcyApO1xuXG4gICAgfSxcblxuICAgIGNsZWFyR3JvdXA6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgICAgIHZhciBpID0gdGhpcy51aXMubGVuZ3RoO1xuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgdGhpcy51aXNbaV0uY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudWlzLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudWlzID0gW107XG4gICAgICAgIHRoaXMuaCA9IHRoaXMuYmFzZUg7XG5cbiAgICB9LFxuXG4gICAgY2FsYzogZnVuY3Rpb24oIHkgKXtcblxuICAgICAgICBpZiggIXRoaXMuaXNPcGVuICkgcmV0dXJuO1xuXG4gICAgICAgIGlmKCB5ICE9PSB1bmRlZmluZWQgKXsgXG4gICAgICAgICAgICB0aGlzLmggKz0geTtcbiAgICAgICAgICAgIGlmKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggeSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oID0gdGhpcy5jWzJdLm9mZnNldEhlaWdodCArIHRoaXMuYmFzZUg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG5cbiAgICB9LFxuXG4gICAgclNpemVDb250ZW50OiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpID0gdGhpcy51aXMubGVuZ3RoO1xuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgdGhpcy51aXNbaV0uc2V0U2l6ZSggdGhpcy53aWR0aCApO1xuICAgICAgICAgICAgdGhpcy51aXNbaV0uclNpemUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGMoKTtcblxuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24oKXtcblxuICAgICAgICBQcm90by5wcm90b3R5cGUuclNpemUuY2FsbCggdGhpcyApO1xuXG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuXG4gICAgICAgIHNbM10ubGVmdCA9ICggdGhpcy5zYSArIHRoaXMuc2IgLSAxNyApICsgJ3B4JztcbiAgICAgICAgc1sxXS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICAgICAgICBzWzJdLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG5cbiAgICAgICAgaWYodGhpcy5pc09wZW4pIHRoaXMuclNpemVDb250ZW50KCk7XG5cbiAgICB9XG5cbn0gKTtcblxuZnVuY3Rpb24gSm95c3RpY2sgKCBvICkge1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy5hdXRvV2lkdGggPSBmYWxzZTtcblxuICAgIHRoaXMudmFsdWUgPSBbMCwwXTtcblxuICAgIHRoaXMuam95VHlwZSA9ICdhbmFsb2dpcXVlJztcblxuICAgIHRoaXMucHJlY2lzaW9uID0gby5wcmVjaXNpb24gfHwgMjtcbiAgICB0aGlzLm11bHRpcGxpY2F0b3IgPSBvLm11bHRpcGxpY2F0b3IgfHwgMTtcblxuICAgIHRoaXMueCA9IDA7XG4gICAgdGhpcy55ID0gMDtcblxuICAgIHRoaXMub2xkeCA9IDA7XG4gICAgdGhpcy5vbGR5ID0gMDtcblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuXG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLmZsb29yKCh0aGlzLndpZHRoLTIwKSowLjUpO1xuXG4gICAgLyp0aGlzLnJhZGl1cyA9IG8ucmFkaXVzIHx8IDUwO1xuXG4gICAgdGhpcy53aWR0aCA9ICh0aGlzLnJhZGl1cyoyKSsyMDtcblxuICAgIGlmKG8ud2lkdGggIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMud2lkdGggPSBvLndpZHRoO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IH5+ICgoIHRoaXMud2lkdGgtMjAgKSowLjUpO1xuICAgIH1cbiAgICBpZihvLnNpemUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMud2lkdGggPSBvLnNpemU7XG4gICAgICAgIHRoaXMucmFkaXVzID0gfn4gKHRoaXMud2lkdGgtMjApKjAuNTtcbiAgICB9Ki9cblxuICAgIHRoaXMuaW5uZXJSYWRpdXMgPSBvLmlubmVyUmFkaXVzIHx8IHRoaXMucmFkaXVzKjAuNjtcbiAgICB0aGlzLm1heERpc3RhbmNlID0gdGhpcy5yYWRpdXMgLSB0aGlzLmlubmVyUmFkaXVzIC0gNTtcbiAgICB0aGlzLmhlaWdodCA9IHRoaXMucmFkaXVzKjI7XG4gICAgdGhpcy5oID0gby5oZWlnaHQgfHwgKHRoaXMuaGVpZ2h0ICsgNDApO1xuXG4gICAgdGhpcy50b3AgPSAwO1xuXG4gICAgdGhpcy5jWzBdLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArJ3B4JztcblxuICAgIGlmKHRoaXMuY1sxXSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgdGhpcy5jWzFdLnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArJ3B4JztcbiAgICAgICAgdGhpcy5jWzFdLnN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgICAgICB0aGlzLnRvcCA9IDIwO1xuXG4gICAgfVxuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnY2lyY2xlJywgVG9vbHMuY3NzLmJhc2ljICsgJ2xlZnQ6MTBweDsgdG9wOicrdGhpcy50b3ArJ3B4OyB3aWR0aDonK3RoaXMudysncHg7IGhlaWdodDonK3RoaXMuaGVpZ2h0KydweDsgIHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOycsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzLCByOnRoaXMucmFkaXVzLCBmaWxsOid1cmwoI2dyYWQpJyB9KTtcbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDowcHg7IHRvcDonKyh0aGlzLnRvcC0xMCkrJ3B4OyB3aWR0aDonKyh0aGlzLncrMjApKydweDsgaGVpZ2h0OicrKHRoaXMuaGVpZ2h0KzIwKSsncHg7JywgeyBjeDp0aGlzLnJhZGl1cysxMCwgY3k6dGhpcy5yYWRpdXMrMTAsIHI6dGhpcy5pbm5lclJhZGl1cysxMCwgZmlsbDondXJsKCNncmFkUyknfSk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAnY2lyY2xlJywgVG9vbHMuY3NzLmJhc2ljICsgJ2xlZnQ6MTBweDsgdG9wOicrdGhpcy50b3ArJ3B4OyB3aWR0aDonK3RoaXMudysncHg7IGhlaWdodDonK3RoaXMuaGVpZ2h0KydweDsnLCB7IGN4OnRoaXMucmFkaXVzLCBjeTp0aGlzLnJhZGl1cywgcjp0aGlzLmlubmVyUmFkaXVzLCBmaWxsOid1cmwoI2dyYWRJbiknLCAnc3Ryb2tlLXdpZHRoJzoxLCBzdHJva2U6JyMwMDAnICB9KTtcbiAgICB0aGlzLmNbNV0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0ICsgJ3RleHQtYWxpZ246Y2VudGVyOyB0b3A6JysodGhpcy5oZWlnaHQrMjApKydweDsgd2lkdGg6Jyt0aGlzLndpZHRoKydweDsgY29sb3I6JysgdGhpcy5mb250Q29sb3IgKTtcblxuICAgIC8vIGdyYWRpYW4gYmFrZ3JvdW5kXG4gICAgdmFyIHN2ZyA9IHRoaXMuY1syXTtcbiAgICBUb29scy5kb20oICdkZWZzJywgbnVsbCwge30sIHN2ZyApO1xuICAgIFRvb2xzLmRvbSggJ3JhZGlhbEdyYWRpZW50JywgbnVsbCwge2lkOidncmFkJywgY3g6JzUwJScsIGN5Oic1MCUnLCByOic1MCUnLCBmeDonNTAlJywgZnk6JzUwJScgfSwgc3ZnLCAxICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0Oic0MCUnLCBzdHlsZTonc3RvcC1jb2xvcjpyZ2IoMCwwLDApOyBzdG9wLW9wYWNpdHk6MC4zOycgfSwgc3ZnLCBbMSwwXSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonODAlJywgc3R5bGU6J3N0b3AtY29sb3I6cmdiKDAsMCwwKTsgc3RvcC1vcGFjaXR5OjA7JyB9LCBzdmcsIFsxLDBdICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0Oic5MCUnLCBzdHlsZTonc3RvcC1jb2xvcjpyZ2IoNTAsNTAsNTApOyBzdG9wLW9wYWNpdHk6MC40OycgfSwgc3ZnLCBbMSwwXSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonMTAwJScsIHN0eWxlOidzdG9wLWNvbG9yOnJnYig1MCw1MCw1MCk7IHN0b3Atb3BhY2l0eTowOycgfSwgc3ZnLCBbMSwwXSApO1xuXG4gICAgLy8gZ3JhZGlhbiBzaGFkb3dcbiAgICBzdmcgPSB0aGlzLmNbM107XG4gICAgVG9vbHMuZG9tKCAnZGVmcycsIG51bGwsIHt9LCBzdmcgKTtcbiAgICBUb29scy5kb20oICdyYWRpYWxHcmFkaWVudCcsIG51bGwsIHtpZDonZ3JhZFMnLCBjeDonNTAlJywgY3k6JzUwJScsIHI6JzUwJScsIGZ4Oic1MCUnLCBmeTonNTAlJyB9LCBzdmcsIDEgKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzYwJScsIHN0eWxlOidzdG9wLWNvbG9yOnJnYigwLDAsMCk7IHN0b3Atb3BhY2l0eTowLjU7JyB9LCBzdmcsIFsxLDBdICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0OicxMDAlJywgc3R5bGU6J3N0b3AtY29sb3I6cmdiKDAsMCwwKTsgc3RvcC1vcGFjaXR5OjA7JyB9LCBzdmcsIFsxLDBdICk7XG5cbiAgICAvLyBncmFkaWFuIHN0aWNrXG5cbiAgICB2YXIgY2MwID0gWydyZ2IoNDAsNDAsNDApJywgJ3JnYig0OCw0OCw0OCknLCAncmdiKDMwLDMwLDMwKSddO1xuICAgIHZhciBjYzEgPSBbJ3JnYigxLDkwLDE5NyknLCAncmdiKDMsOTUsMjA3KScsICdyZ2IoMCw2NSwxNjcpJ107XG5cbiAgICBzdmcgPSB0aGlzLmNbNF07XG4gICAgVG9vbHMuZG9tKCAnZGVmcycsIG51bGwsIHt9LCBzdmcgKTtcbiAgICBUb29scy5kb20oICdyYWRpYWxHcmFkaWVudCcsIG51bGwsIHtpZDonZ3JhZEluJywgY3g6JzUwJScsIGN5Oic1MCUnLCByOic1MCUnLCBmeDonNTAlJywgZnk6JzUwJScgfSwgc3ZnLCAxICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0OiczMCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMFswXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMF0gKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzYwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MwWzFdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwwXSAgKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzgwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MwWzFdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwwXSAgKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzEwMCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMFsyXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMF0gICk7XG5cbiAgICBUb29scy5kb20oICdyYWRpYWxHcmFkaWVudCcsIG51bGwsIHtpZDonZ3JhZEluMicsIGN4Oic1MCUnLCBjeTonNTAlJywgcjonNTAlJywgZng6JzUwJScsIGZ5Oic1MCUnIH0sIHRoaXMuY1s0XSwgMSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonMzAlJywgc3R5bGU6J3N0b3AtY29sb3I6JytjYzFbMF0rJzsgc3RvcC1vcGFjaXR5OjE7JyB9LCBzdmcsIFsxLDFdICApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonNjAlJywgc3R5bGU6J3N0b3AtY29sb3I6JytjYzFbMV0rJzsgc3RvcC1vcGFjaXR5OjE7JyB9LCBzdmcsIFsxLDFdICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0Oic4MCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMVsxXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMV0gKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzEwMCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMVsyXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMV0gKTtcblxuICAgIC8vY29uc29sZS5sb2coIHRoaXMuY1s0XSApXG5cbiAgICB0aGlzLmNbNV0udGV4dENvbnRlbnQgPSAneCcrIHRoaXMudmFsdWVbMF0gKycgeScgKyB0aGlzLnZhbHVlWzFdO1xuXG4gICAgdGhpcy5jWzJdLmV2ZW50cyA9IFsgJ21vdXNlb3ZlcicsICdtb3VzZWRvd24nLCAnbW91c2VvdXQnIF07XG5cbiAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMudXBkYXRlKGZhbHNlKTtcbn1cblxuSm95c3RpY2sucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBKb3lzdGljayxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdmVyJzogdGhpcy5vdmVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5kb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdXQnOiAgdGhpcy5vdXQoIGUgKTsgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6ICAgdGhpcy51cCggZSApOyAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogdGhpcy5tb3ZlKCBlICk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbW9kZTogZnVuY3Rpb24gKCBtb2RlICkge1xuXG4gICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgIGNhc2UgMDogLy8gYmFzZVxuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZmlsbCcsJ3VybCgjZ3JhZEluKScpO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnc3Ryb2tlJywgJyMwMDAnICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogLy8gb3ZlclxuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZmlsbCcsICd1cmwoI2dyYWRJbjIpJyApO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnc3Ryb2tlJywgJ3JnYmEoMCwwLDAsMCknICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogLy8gZWRpdFxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvdmVyOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RlKDEpO1xuXG4gICAgfSxcblxuICAgIG91dDogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICB0aGlzLmlzT3ZlciA9IGZhbHNlO1xuICAgICAgICBpZih0aGlzLmlzRG93bikgcmV0dXJuO1xuICAgICAgICB0aGlzLm1vZGUoMCk7XG5cbiAgICB9LFxuXG4gICAgdXA6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwodGhpcy51cGRhdGUuYmluZCh0aGlzKSwgMTApO1xuXG4gICAgICAgIGlmKHRoaXMuaXNPdmVyKSB0aGlzLm1vZGUoMSk7XG4gICAgICAgIGVsc2UgdGhpcy5tb2RlKDApO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgZG93bjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICB0aGlzLmlzRG93biA9IHRydWU7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG5cbiAgICAgICAgdGhpcy5yZWN0ID0gdGhpcy5jWzJdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB0aGlzLm1vdmUoIGUgKTtcbiAgICAgICAgdGhpcy5tb2RlKCAyICk7XG5cbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGlmKCAhdGhpcy5pc0Rvd24gKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHggPSB0aGlzLnJhZGl1cyAtICggZS5jbGllbnRYIC0gdGhpcy5yZWN0LmxlZnQgKTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnJhZGl1cyAtICggZS5jbGllbnRZIC0gdGhpcy5yZWN0LnRvcCApO1xuXG4gICAgICAgIHZhciBkaXN0YW5jZSA9IE1hdGguc3FydCggeCAqIHggKyB5ICogeSApO1xuXG4gICAgICAgIGlmICggZGlzdGFuY2UgPiB0aGlzLm1heERpc3RhbmNlICkge1xuICAgICAgICAgICAgdmFyIGFuZ2xlID0gTWF0aC5hdGFuMih4LCB5KTtcbiAgICAgICAgICAgIHggPSBNYXRoLnNpbihhbmdsZSkgKiB0aGlzLm1heERpc3RhbmNlO1xuICAgICAgICAgICAgeSA9IE1hdGguY29zKGFuZ2xlKSAqIHRoaXMubWF4RGlzdGFuY2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnggPSB4IC8gdGhpcy5tYXhEaXN0YW5jZTtcbiAgICAgICAgdGhpcy55ID0geSAvIHRoaXMubWF4RGlzdGFuY2U7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgIH0sXG5cbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gKCB4LCB5ICkge1xuXG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU1ZHKCk7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoIHVwICkge1xuXG4gICAgICAgIGlmKHVwID09PSB1bmRlZmluZWQpIHVwID0gdHJ1ZTtcblxuICAgICAgICBpZiggdGhpcy5pbnRlcnZhbCAhPT0gbnVsbCApe1xuXG4gICAgICAgICAgICBpZiggIXRoaXMuaXNEb3duICl7XG4gICAgICAgICAgICAgICAgdGhpcy54ICs9ICgwIC0gdGhpcy54KS8zO1xuICAgICAgICAgICAgICAgIHRoaXMueSArPSAoMCAtIHRoaXMueSkvMztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLngudG9GaXhlZCgyKSA9PT0gdGhpcy5vbGR4LnRvRml4ZWQoMikgJiYgdGhpcy55LnRvRml4ZWQoMikgPT09IHRoaXMub2xkeS50b0ZpeGVkKDIpKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlU1ZHKCk7XG5cbiAgICAgICAgaWYoIHVwICkgdGhpcy5zZW5kKCk7XG5cbiAgICAgICAgaWYoIHRoaXMuaW50ZXJ2YWwgIT09IG51bGwgJiYgdGhpcy54ID09PSAwICYmIHRoaXMueSA9PT0gMCApe1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCggdGhpcy5pbnRlcnZhbCApO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cGRhdGVTVkc6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcnggPSB0aGlzLnggKiB0aGlzLm1heERpc3RhbmNlO1xuICAgICAgICB2YXIgcnkgPSB0aGlzLnkgKiB0aGlzLm1heERpc3RhbmNlO1xuICAgICAgICB2YXIgeCA9IHRoaXMucmFkaXVzIC0gcng7XG4gICAgICAgIHZhciB5ID0gdGhpcy5yYWRpdXMgLSByeTtcbiAgICAgICAgdmFyIHN4ID0geCArICgoMS10aGlzLngpKjUpICsgNTtcbiAgICAgICAgdmFyIHN5ID0geSArICgoMS10aGlzLnkpKjUpICsgMTA7XG5cbiAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbM10sICdjeCcsIHN4ICk7XG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzNdLCAnY3knLCBzeSApO1xuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2N4JywgeCApO1xuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2N5JywgeSApO1xuXG4gICAgICAgIHRoaXMub2xkeCA9IHRoaXMueDtcbiAgICAgICAgdGhpcy5vbGR5ID0gdGhpcy55O1xuXG4gICAgICAgIHRoaXMudmFsdWVbMF0gPSAtKCB0aGlzLnggKiB0aGlzLm11bHRpcGxpY2F0b3IgKS50b0ZpeGVkKCB0aGlzLnByZWNpc2lvbiApICogMTtcbiAgICAgICAgdGhpcy52YWx1ZVsxXSA9ICAoIHRoaXMueSAqIHRoaXMubXVsdGlwbGljYXRvciApLnRvRml4ZWQoIHRoaXMucHJlY2lzaW9uICkgKiAxO1xuXG4gICAgICAgIHRoaXMuY1s1XS50ZXh0Q29udGVudCA9ICd4JysgdGhpcy52YWx1ZVswXSArJyB5JyArIHRoaXMudmFsdWVbMV07XG5cbiAgICB9LFxuXG59ICk7XG5cbmZ1bmN0aW9uIEtub2IgKCBvICkge1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgLy90aGlzLnR5cGUgPSAna25vYic7XG4gICAgdGhpcy5hdXRvV2lkdGggPSBmYWxzZTtcblxuICAgIHRoaXMuYnV0dG9uQ29sb3IgPSBUb29scy5jb2xvcnMuYnV0dG9uO1xuXG4gICAgdGhpcy5zZXRUeXBlTnVtYmVyKCBvICk7XG5cbiAgICB0aGlzLm1QSSA9IE1hdGguUEkgKiAwLjg7XG4gICAgdGhpcy50b0RlZyA9IDE4MCAvIE1hdGguUEk7XG4gICAgdGhpcy5jaXJSYW5nZSA9IHRoaXMubVBJICogMjtcblxuICAgIHRoaXMucmFkaXVzID0gTWF0aC5mbG9vcigodGhpcy53aWR0aC0yMCkqMC41KTtcblxuICAgIC8qdGhpcy5yYWRpdXMgPSBvLnJhZGl1cyB8fCAxNTtcbiAgICBcbiAgICB0aGlzLndpZHRoID0gKHRoaXMucmFkaXVzKjIpKzIwO1xuXG4gICAgaWYoby53aWR0aCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IG8ud2lkdGg7XG4gICAgICAgIHRoaXMucmFkaXVzID0gfn4gKHRoaXMud2lkdGgtMjApKjAuNTtcbiAgICB9XG5cbiAgICBpZihvLnNpemUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMud2lkdGggPSBvLnNpemU7XG4gICAgICAgIHRoaXMucmFkaXVzID0gfn4gKHRoaXMud2lkdGgtMjApKjAuNTtcbiAgICB9Ki9cblxuICAgIHRoaXMudyA9IHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMgKiAyO1xuICAgIHRoaXMuaCA9IG8uaGVpZ2h0IHx8ICh0aGlzLmhlaWdodCArIDQwKTtcbiAgICB0aGlzLnRvcCA9IDA7XG5cbiAgICB0aGlzLmNbMF0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuXG4gICAgaWYodGhpcy5jWzFdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICB0aGlzLmNbMV0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuICAgICAgICB0aGlzLmNbMV0uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMudG9wID0gMjA7XG5cbiAgICB9XG5cbiAgICB0aGlzLnBlcmNlbnQgPSAwO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dG51bWJlciArICd0ZXh0LWFsaWduOmNlbnRlcjsgdG9wOicrKHRoaXMuaGVpZ2h0KzI0KSsncHg7IHdpZHRoOicrdGhpcy53aWR0aCsncHg7IGNvbG9yOicrIHRoaXMuZm9udENvbG9yICk7XG5cbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OyAgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7JywgeyBjeDp0aGlzLnJhZGl1cywgY3k6dGhpcy5yYWRpdXMsIHI6dGhpcy5yYWRpdXMtNCwgZmlsbDoncmdiYSgwLDAsMCwwLjMpJyB9KTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OycsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzKjAuNSwgcjozLCBmaWxsOnRoaXMuZm9udENvbG9yIH0pO1xuICAgIHRoaXMuY1s1XSA9IFRvb2xzLmRvbSggJ3BhdGgnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OycsIHsgZDp0aGlzLm1ha2VHcmFkKCksICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTpUb29scy5jb2xvcnMuc3Ryb2tlIH0pO1xuICAgIFxuICAgIFRvb2xzLmRvbSggJ2NpcmNsZScsIG51bGwsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzLCByOnRoaXMucmFkaXVzKjAuNywgZmlsbDp0aGlzLmJ1dHRvbkNvbG9yLCAnc3Ryb2tlLXdpZHRoJzoxLCBzdHJva2U6VG9vbHMuY29sb3JzLnN0cm9rZSB9LCB0aGlzLmNbM10gKTtcblxuICAgIHRoaXMuY1szXS5ldmVudHMgPSBbICdtb3VzZW92ZXInLCAnbW91c2Vkb3duJywgJ21vdXNlb3V0JyBdO1xuXG4gICAgdGhpcy5yID0gMDtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy51cGRhdGUoKTtcblxufVxuXG5Lbm9iLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIENpcmN1bGFyLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogS25vYixcblxuICAgIG1vdmU6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoICF0aGlzLmlzRG93biApIHJldHVybjtcblxuICAgICAgICB2YXIgeCA9IHRoaXMucmFkaXVzIC0gKGUuY2xpZW50WCAtIHRoaXMucmVjdC5sZWZ0KTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnJhZGl1cyAtIChlLmNsaWVudFkgLSB0aGlzLnJlY3QudG9wKTtcbiAgICAgICAgdGhpcy5yID0gLSBNYXRoLmF0YW4yKCB4LCB5ICk7XG5cbiAgICAgICAgaWYoIHRoaXMub2xkciAhPT0gbnVsbCApIHRoaXMuciA9IE1hdGguYWJzKHRoaXMuciAtIHRoaXMub2xkcikgPiBNYXRoLlBJID8gdGhpcy5vbGRyIDogdGhpcy5yO1xuXG4gICAgICAgIHRoaXMuciA9IHRoaXMuciA+IHRoaXMubVBJID8gdGhpcy5tUEkgOiB0aGlzLnI7XG4gICAgICAgIHRoaXMuciA9IHRoaXMuciA8IC10aGlzLm1QSSA/IC10aGlzLm1QSSA6IHRoaXMucjtcblxuICAgICAgICB2YXIgc3RlcHMgPSAxIC8gdGhpcy5jaXJSYW5nZTtcbiAgICAgICAgdmFyIHZhbHVlID0gKHRoaXMuciArIHRoaXMubVBJKSAqIHN0ZXBzO1xuXG4gICAgICAgIHZhciBuID0gKCAoIHRoaXMucmFuZ2UgKiB2YWx1ZSApICsgdGhpcy5taW4gKSAtIHRoaXMub2xkO1xuXG4gICAgICAgIGlmKG4gPj0gdGhpcy5zdGVwIHx8IG4gPD0gdGhpcy5zdGVwKXsgXG4gICAgICAgICAgICBuID0gfn4gKCBuIC8gdGhpcy5zdGVwICk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5udW1WYWx1ZSggdGhpcy5vbGQgKyAoIG4gKiB0aGlzLnN0ZXAgKSApO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoIHRydWUgKTtcbiAgICAgICAgICAgIHRoaXMub2xkID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMub2xkciA9IHRoaXMucjtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIG1ha2VHcmFkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGQgPSAnJywgc3RlcCwgcmFuZ2UsIGEsIHgsIHksIHgyLCB5MiwgciA9IHRoaXMucmFkaXVzO1xuICAgICAgICB2YXIgc3RhcnRhbmdsZSA9IE1hdGguUEkgKyB0aGlzLm1QSTtcbiAgICAgICAgdmFyIGVuZGFuZ2xlID0gTWF0aC5QSSAtIHRoaXMubVBJO1xuXG4gICAgICAgIGlmKHRoaXMuc3RlcD41KXtcbiAgICAgICAgICAgIHJhbmdlID0gIHRoaXMucmFuZ2UgLyB0aGlzLnN0ZXA7XG4gICAgICAgICAgICBzdGVwID0gKCBzdGFydGFuZ2xlIC0gZW5kYW5nbGUgKSAvIHJhbmdlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlcCA9ICggc3RhcnRhbmdsZSAtIGVuZGFuZ2xlICkgLyByO1xuICAgICAgICAgICAgcmFuZ2UgPSByO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDw9IHJhbmdlOyArK2kgKSB7XG5cbiAgICAgICAgICAgIGEgPSBzdGFydGFuZ2xlIC0gKCBzdGVwICogaSApO1xuICAgICAgICAgICAgeCA9IHIgKyBNYXRoLnNpbiggYSApICogcjtcbiAgICAgICAgICAgIHkgPSByICsgTWF0aC5jb3MoIGEgKSAqIHI7XG4gICAgICAgICAgICB4MiA9IHIgKyBNYXRoLnNpbiggYSApICogKCByIC0gMyApO1xuICAgICAgICAgICAgeTIgPSByICsgTWF0aC5jb3MoIGEgKSAqICggciAtIDMgKTtcbiAgICAgICAgICAgIGQgKz0gJ00nICsgeCArICcgJyArIHkgKyAnIEwnICsgeDIgKyAnICcreTIgKyAnICc7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkO1xuXG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCB1cCApIHtcblxuICAgICAgICB0aGlzLmNbMl0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSAodGhpcy52YWx1ZSAtIHRoaXMubWluKSAvIHRoaXMucmFuZ2U7XG5cbiAgICAgICAgdmFyIHIgPSAoICh0aGlzLnBlcmNlbnQgKiB0aGlzLmNpclJhbmdlKSAtICh0aGlzLm1QSSkpICogdGhpcy50b0RlZztcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ3RyYW5zZm9ybScsICdyb3RhdGUoJysgciArJyAnK3RoaXMucmFkaXVzKycgJyt0aGlzLnJhZGl1cysnKScgKTtcblxuICAgICAgICBpZiggdXAgKSB0aGlzLnNlbmQoKTtcbiAgICAgICAgXG4gICAgfSxcblxufSApO1xuXG5mdW5jdGlvbiBMaXN0KG8pIHtcbiAgICBQcm90by5jYWxsKHRoaXMsIG8pO1xuXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gdHJ1ZTtcbiAgICB2YXIgYWxpZ24gPSBvLmFsaWduIHx8IFwiY2VudGVyXCI7XG5cbiAgICB0aGlzLmJ1dHRvbkNvbG9yID0gby5iQ29sb3IgfHwgVG9vbHMuY29sb3JzLmJ1dHRvbjtcblxuICAgIHZhciBmbHRvcCA9IE1hdGguZmxvb3IodGhpcy5oICogMC41KSAtIDU7XG5cbiAgICAvL3RoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICd0b3A6MDsgaGVpZ2h0OjkwcHg7IGN1cnNvcjpzLXJlc2l6ZTsgcG9pbnRlci1ldmVudHM6YXV0bzsgZGlzcGxheTpub25lOyBvdmVyZmxvdzpoaWRkZW47IGJvcmRlcjoxcHggc29saWQgJytUb29scy5jb2xvcnMuYm9yZGVyKyc7JyApO1xuICAgIC8vdGhpcy5jWzNdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dCArICd0ZXh0LWFsaWduOicrYWxpZ24rJzsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTQpKydweDsgYm9yZGVyOjFweCBzb2xpZCAnK1Rvb2xzLmNvbG9ycy5ib3JkZXIrJzsgdG9wOjFweDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7IGJhY2tncm91bmQ6Jyt0aGlzLmJ1dHRvbkNvbG9yKyc7IGhlaWdodDonKyh0aGlzLmgtMikrJ3B4OycgKTtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbShcbiAgICAgICAgXCJkaXZcIixcbiAgICAgICAgVG9vbHMuY3NzLmJhc2ljICtcbiAgICAgICAgICAgIFwidG9wOjA7IGhlaWdodDo5MHB4OyBjdXJzb3I6cy1yZXNpemU7IHBvaW50ZXItZXZlbnRzOmF1dG87IGRpc3BsYXk6bm9uZTsgb3ZlcmZsb3c6aGlkZGVuO1wiLFxuICAgICk7XG4gICAgdGhpcy5jWzNdID0gVG9vbHMuZG9tKFxuICAgICAgICBcImRpdlwiLFxuICAgICAgICBUb29scy5jc3MudHh0ICtcbiAgICAgICAgICAgIFwidGV4dC1hbGlnbjpcIiArXG4gICAgICAgICAgICBhbGlnbiArXG4gICAgICAgICAgICBcIjsgbGluZS1oZWlnaHQ6XCIgK1xuICAgICAgICAgICAgKHRoaXMuaCAtIDQpICtcbiAgICAgICAgICAgIFwicHg7IHRvcDoxcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBiYWNrZ3JvdW5kOlwiICtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29sb3IgK1xuICAgICAgICAgICAgXCI7IGhlaWdodDpcIiArXG4gICAgICAgICAgICAodGhpcy5oIC0gMikgK1xuICAgICAgICAgICAgXCJweDsgYm9yZGVyLXJhZGl1czpcIiArXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyArXG4gICAgICAgICAgICBcInB4O1wiLFxuICAgICk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKFxuICAgICAgICBcInBhdGhcIixcbiAgICAgICAgVG9vbHMuY3NzLmJhc2ljICtcbiAgICAgICAgICAgIFwicG9zaXRpb246YWJzb2x1dGU7IHdpZHRoOjEwcHg7IGhlaWdodDoxMHB4OyB0b3A6XCIgK1xuICAgICAgICAgICAgZmx0b3AgK1xuICAgICAgICAgICAgXCJweDtcIixcbiAgICAgICAgeyBkOiBcIk0gMyA4IEwgOCA1IDMgMiAzIDggWlwiLCBmaWxsOiB0aGlzLmZvbnRDb2xvciwgc3Ryb2tlOiBcIm5vbmVcIiB9LFxuICAgICk7XG5cbiAgICB0aGlzLnNjcm9sbGVyID0gVG9vbHMuZG9tKFxuICAgICAgICBcImRpdlwiLFxuICAgICAgICBUb29scy5jc3MuYmFzaWMgK1xuICAgICAgICAgICAgXCJyaWdodDo1cHg7ICB3aWR0aDoxMHB4OyBwb2ludGVyLWV2ZW50czpub25lOyBiYWNrZ3JvdW5kOiM2NjY7IGRpc3BsYXk6bm9uZTtcIixcbiAgICApO1xuXG4gICAgdGhpcy5jWzJdLm5hbWUgPSBcImxpc3RcIjtcbiAgICB0aGlzLmNbM10ubmFtZSA9IFwidGl0bGVcIjtcblxuICAgIC8vdGhpcy5jWzJdLnN0eWxlLmJvcmRlclRvcCA9IHRoaXMuaCArICdweCBzb2xpZCB0cmFuc3BhcmVudCc7XG4gICAgdGhpcy5jWzNdLnN0eWxlLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG5cbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gW1xuICAgICAgICBcIm1vdXNlZG93blwiLFxuICAgICAgICBcIm1vdXNlbW92ZVwiLFxuICAgICAgICBcIm1vdXNldXBcIixcbiAgICAgICAgXCJtb3VzZXdoZWVsXCIsXG4gICAgICAgIFwibW91c2VvdXRcIixcbiAgICAgICAgXCJtb3VzZW92ZXJcIixcbiAgICBdO1xuICAgIHRoaXMuY1szXS5ldmVudHMgPSBbXCJtb3VzZWRvd25cIiwgXCJtb3VzZW92ZXJcIiwgXCJtb3VzZW91dFwiXTtcblxuICAgIHRoaXMubGlzdCA9IG8ubGlzdCB8fCBbXTtcblxuICAgIHRoaXMuYmFzZUggPSB0aGlzLmg7XG5cbiAgICAvL3RoaXMubWF4SXRlbSA9IG8ubWF4SXRlbSB8fCA1O1xuICAgIHRoaXMuaXRlbUhlaWdodCA9IG8uaXRlbUhlaWdodCB8fCB0aGlzLmggLSAzO1xuICAgIC8vdGhpcy5sZW5ndGggPSB0aGlzLmxpc3QubGVuZ3RoO1xuXG4gICAgLy8gZm9yY2UgZnVsbCBsaXN0XG4gICAgdGhpcy5mdWxsID0gby5mdWxsIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5weSA9IDA7XG4gICAgdGhpcy53ID0gdGhpcy5zYjtcbiAgICB0aGlzLnNjcm9sbCA9IGZhbHNlO1xuICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XG5cbiAgICAvLyBsaXN0IHVwIG9yIGRvd25cbiAgICB0aGlzLnNpZGUgPSBvLnNpZGUgfHwgXCJkb3duXCI7XG4gICAgdGhpcy5ob2xkVG9wID0gMDtcblxuICAgIGlmICh0aGlzLnNpZGUgPT09IFwidXBcIikge1xuICAgICAgICB0aGlzLmNbMl0uc3R5bGUudG9wID0gXCJhdXRvXCI7XG4gICAgICAgIHRoaXMuY1szXS5zdHlsZS50b3AgPSBcImF1dG9cIjtcbiAgICAgICAgdGhpcy5jWzRdLnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuICAgICAgICAvL3RoaXMuY1s1XS5zdHlsZS50b3AgPSAnYXV0byc7XG5cbiAgICAgICAgdGhpcy5jWzJdLnN0eWxlLmJvdHRvbSA9IHRoaXMuaCAtIDIgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuY1szXS5zdHlsZS5ib3R0b20gPSBcIjFweFwiO1xuICAgICAgICB0aGlzLmNbNF0uc3R5bGUuYm90dG9tID0gZmx0b3AgKyBcInB4XCI7XG4gICAgICAgIC8vdGhpcy5jWzVdLnN0eWxlLmJvdHRvbSA9ICcycHgnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY1syXS5zdHlsZS50b3AgPSB0aGlzLmggLSAyICsgXCJweFwiO1xuICAgICAgICAvL3RoaXMuY1s2XS5zdHlsZS50b3AgPSB0aGlzLmggKyAncHgnO1xuICAgIH1cblxuICAgIHRoaXMubGlzdEluID0gVG9vbHMuZG9tKFxuICAgICAgICBcImRpdlwiLFxuICAgICAgICBUb29scy5jc3MuYmFzaWMgK1xuICAgICAgICAgICAgXCJsZWZ0OjA7IHRvcDowOyB3aWR0aDoxMDAlOyBiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC4yKTtcIixcbiAgICApO1xuICAgIHRoaXMubGlzdEluLm5hbWUgPSBcImxpc3RcIjtcblxuICAgIHRoaXMuY1syXS5hcHBlbmRDaGlsZCh0aGlzLmxpc3RJbik7XG4gICAgdGhpcy5jWzJdLmFwcGVuZENoaWxkKHRoaXMuc2Nyb2xsZXIpO1xuXG4gICAgLy8gcG9wdWxhdGUgbGlzdFxuXG4gICAgdGhpcy5zZXRMaXN0KHRoaXMubGlzdCwgby52YWx1ZSk7XG5cbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmIChvLm9wZW4gIT09IHVuZGVmaW5lZCkgdGhpcy5vcGVuKCk7XG59XG5cbkxpc3QucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFByb3RvLnByb3RvdHlwZSksIHtcbiAgICBjb25zdHJ1Y3RvcjogTGlzdCxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB2YXIgbmFtZSA9IGUudGFyZ2V0Lm5hbWUgfHwgXCJcIjtcbiAgICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJjbGlja1wiOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2soZSk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJtb3VzZW92ZXJcIjpcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJ0aXRsZVwiKSB0aGlzLm1vZGUoMSk7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmxpc3RvdmVyKGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwibW91c2Vkb3duXCI6XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwidGl0bGVcIikgdGhpcy50aXRsZUNsaWNrKGUpO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5saXN0ZG93bihlKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIm1vdXNldXBcIjpcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJ0aXRsZVwiKSB0aGlzLm1vZGUoMCk7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmxpc3R1cChlKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIm1vdXNlb3V0XCI6XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IFwidGl0bGVcIikgdGhpcy5tb2RlKDApO1xuICAgICAgICAgICAgICAgIGVsc2UgdGhpcy5saXN0b3V0KGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwibW91c2Vtb3ZlXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0bW92ZShlKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIm1vdXNld2hlZWxcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3R3aGVlbChlKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1vZGU6IGZ1bmN0aW9uKG1vZGUpIHtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG5cbiAgICAgICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDA6IC8vIGJhc2VcbiAgICAgICAgICAgICAgICBzWzNdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgc1szXS5iYWNrZ3JvdW5kID0gdGhpcy5idXR0b25Db2xvcjtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAxOiAvLyBvdmVyXG4gICAgICAgICAgICAgICAgc1szXS5jb2xvciA9IFwiI0ZGRlwiO1xuICAgICAgICAgICAgICAgIHNbM10uYmFja2dyb3VuZCA9IFRvb2xzLmNvbG9ycy5zZWxlY3Q7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgMjogLy8gZWRpdCAvIGRvd25cbiAgICAgICAgICAgICAgICBzWzNdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgc1szXS5iYWNrZ3JvdW5kID0gVG9vbHMuY29sb3JzLmRvd247XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGVhckxpc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5saXN0SW4uY2hpbGRyZW4ubGVuZ3RoKVxuICAgICAgICAgICAgdGhpcy5saXN0SW4ucmVtb3ZlQ2hpbGQodGhpcy5saXN0SW4ubGFzdENoaWxkKTtcbiAgICB9LFxuXG4gICAgc2V0TGlzdDogZnVuY3Rpb24obGlzdCwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5jbGVhckxpc3QoKTtcblxuICAgICAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGlzdC5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5tYXhJdGVtID0gdGhpcy5mdWxsID8gdGhpcy5sZW5ndGggOiA1O1xuICAgICAgICB0aGlzLm1heEl0ZW0gPSB0aGlzLmxlbmd0aCA8IHRoaXMubWF4SXRlbSA/IHRoaXMubGVuZ3RoIDogdGhpcy5tYXhJdGVtO1xuXG4gICAgICAgIHRoaXMubWF4SGVpZ2h0ID0gdGhpcy5tYXhJdGVtICogKHRoaXMuaXRlbUhlaWdodCArIDEpICsgMjtcblxuICAgICAgICB0aGlzLm1heCA9IHRoaXMubGVuZ3RoICogKHRoaXMuaXRlbUhlaWdodCArIDEpICsgMjtcbiAgICAgICAgdGhpcy5yYXRpbyA9IHRoaXMubWF4SGVpZ2h0IC8gdGhpcy5tYXg7XG4gICAgICAgIHRoaXMuc2ggPSB0aGlzLm1heEhlaWdodCAqIHRoaXMucmF0aW87XG4gICAgICAgIHRoaXMucmFuZ2UgPSB0aGlzLm1heEhlaWdodCAtIHRoaXMuc2g7XG5cbiAgICAgICAgdGhpcy5jWzJdLnN0eWxlLmhlaWdodCA9IHRoaXMubWF4SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB0aGlzLnNjcm9sbGVyLnN0eWxlLmhlaWdodCA9IHRoaXMuc2ggKyBcInB4XCI7XG5cbiAgICAgICAgaWYgKHRoaXMubWF4ID4gdGhpcy5tYXhIZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMudyA9IHRoaXMuc2IgLSAyMDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpdGVtLCBuOyAvLywgbCA9IHRoaXMuc2I7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbiA9IHRoaXMubGlzdFtpXTtcbiAgICAgICAgICAgIGl0ZW0gPSBUb29scy5kb20oXG4gICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICBUb29scy5jc3MuaXRlbSArXG4gICAgICAgICAgICAgICAgICAgIFwid2lkdGg6XCIgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLncgK1xuICAgICAgICAgICAgICAgICAgICBcInB4OyBoZWlnaHQ6XCIgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZW1IZWlnaHQgK1xuICAgICAgICAgICAgICAgICAgICBcInB4OyBsaW5lLWhlaWdodDpcIiArXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLml0ZW1IZWlnaHQgLSA1KSArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7XCIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBuID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgaXRlbS50ZXh0Q29udGVudCA9IG4ubGFiZWwgPyBuLmxhYmVsIDogbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS50ZXh0Q29udGVudCA9IG47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpdGVtLnN0eWxlLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICBpdGVtLm5hbWUgPSBcIml0ZW1cIjtcbiAgICAgICAgICAgIHRoaXMubGlzdEluLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmFsdWUpKSB0aGlzLnZhbHVlID0gdGhpcy5saXN0W3ZhbHVlXTtcbiAgICAgICAgICAgIGVsc2UgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubGlzdFswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY1szXS50ZXh0Q29udGVudCA9XG4gICAgICAgICAgICB0eXBlb2YgdGhpcy52YWx1ZSA9PT0gXCJvYmplY3RcIlxuICAgICAgICAgICAgICAgID8gdGhpcy52YWx1ZS5sYWJlbCA/IHRoaXMudmFsdWUubGFiZWwgOiB0aGlzLnZhbHVlXG4gICAgICAgICAgICAgICAgOiB0aGlzLnZhbHVlO1xuICAgIH0sXG5cbiAgICAvLyAtLS0tLVxuXG4gICAgY2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBlLnRhcmdldC5uYW1lO1xuICAgICAgICBpZiAobmFtZSAhPT0gXCJ0aXRsZVwiICYmIG5hbWUgIT09IFwibGlzdFwiKSB0aGlzLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIHRpdGxlQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB0aGlzLmNsb3NlKCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICB0aGlzLm1vZGUoMik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0gTElTVFxuXG4gICAgbGlzdG92ZXI6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBlLnRhcmdldC5uYW1lO1xuICAgICAgICAvL2NvbnNvbGUubG9nKG5hbWUpXG4gICAgICAgIGlmIChuYW1lID09PSBcIml0ZW1cIikge1xuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFRvb2xzLmNvbG9ycy5zZWxlY3Q7XG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IFwiI0ZGRlwiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxpc3Rkb3duOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBuYW1lID0gZS50YXJnZXQubmFtZTtcbiAgICAgICAgaWYgKG5hbWUgIT09IFwibGlzdFwiICYmIG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgbGFiZWwgPSBlLnRhcmdldC50ZXh0Q29udGVudDsgLy9uYW1lO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubGlzdC5maW5kKGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubGFiZWwgPT09IGxhYmVsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtID09PSBsYWJlbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuY1szXS50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgICAgICAvLyB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gXCJsaXN0XCIgJiYgdGhpcy5zY3JvbGwpIHtcbiAgICAgICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubGlzdG1vdmUoZSk7XG4gICAgICAgICAgICB0aGlzLmxpc3RJbi5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuNilcIjtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXIuc3R5bGUuYmFja2dyb3VuZCA9IFwiI0FBQVwiO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxpc3Rtb3ZlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRG93bikge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLmNbMl0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZShlLmNsaWVudFkgLSByZWN0LnRvcCAtIHRoaXMuc2ggKiAwLjUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGxpc3R1cDogZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxpc3RJbi5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuMilcIjtcbiAgICAgICAgdGhpcy5zY3JvbGxlci5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjNjY2XCI7XG4gICAgfSxcblxuICAgIGxpc3RvdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG4gPSBlLnRhcmdldC5uYW1lO1xuICAgICAgICBpZiAobiA9PT0gXCJpdGVtXCIpIHtcbiAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcInJnYmEoMCwwLDAsMC4yKVwiO1xuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVUkpIHRoaXMubWFpbi5sb2Nrd2hlZWwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5saXN0dXAoKTtcbiAgICAgICAgLy92YXIgbmFtZSA9IGUucmVsYXRlZFRhcmdldC5uYW1lO1xuICAgICAgICAvL2lmKCBuYW1lID09PSB1bmRlZmluZWQgKSB0aGlzLmNsb3NlKCk7XG4gICAgfSxcblxuICAgIGxpc3R3aGVlbDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsKSByZXR1cm5cbiAgICAgICAgaWYgKHRoaXMuaXNVSSkgdGhpcy5tYWluLmxvY2t3aGVlbCA9IHRydWU7XG4gICAgICAgIHZhciBkZWx0YSA9IDA7XG4gICAgICAgIGlmIChlLndoZWVsRGVsdGFZKSBkZWx0YSA9IC1lLndoZWVsRGVsdGFZICogMC4wNDtcbiAgICAgICAgZWxzZSBpZiAoZS53aGVlbERlbHRhKSBkZWx0YSA9IC1lLndoZWVsRGVsdGEgKiAwLjI7XG4gICAgICAgIGVsc2UgaWYgKGUuZGV0YWlsKSBkZWx0YSA9IGUuZGV0YWlsICogNC4wO1xuXG4gICAgICAgIHRoaXMucHkgKz0gZGVsdGE7XG5cbiAgICAgICAgdGhpcy51cGRhdGUodGhpcy5weSk7XG4gICAgfSxcblxuICAgIC8vIC0tLS0tIExJU1RcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24oeSkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsKSByZXR1cm5cblxuICAgICAgICB5ID0geSA8IDAgPyAwIDogeTtcbiAgICAgICAgeSA9IHkgPiB0aGlzLnJhbmdlID8gdGhpcy5yYW5nZSA6IHk7XG5cbiAgICAgICAgdGhpcy5saXN0SW4uc3R5bGUudG9wID0gLU1hdGguZmxvb3IoeSAvIHRoaXMucmF0aW8pICsgXCJweFwiO1xuICAgICAgICB0aGlzLnNjcm9sbGVyLnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoeSkgKyBcInB4XCI7XG5cbiAgICAgICAgdGhpcy5weSA9IHk7XG4gICAgfSxcblxuICAgIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICBQcm90by5wcm90b3R5cGUub3Blbi5jYWxsKHRoaXMpO1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoMCk7XG4gICAgICAgIHRoaXMuaCA9IHRoaXMubWF4SGVpZ2h0ICsgdGhpcy5iYXNlSCArIDEwO1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsKSB7XG4gICAgICAgICAgICB0aGlzLmggPSB0aGlzLmJhc2VIICsgMTAgKyB0aGlzLm1heDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuc1syXS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICBpZiAodGhpcy5zaWRlID09PSBcInVwXCIpXG4gICAgICAgICAgICBUb29scy5zZXRTdmcodGhpcy5jWzRdLCBcImRcIiwgXCJNIDUgMiBMIDIgNyA4IDcgNSAyIFpcIik7XG4gICAgICAgIGVsc2UgVG9vbHMuc2V0U3ZnKHRoaXMuY1s0XSwgXCJkXCIsIFwiTSA1IDggTCA4IDMgMiAzIDUgOCBaXCIpO1xuXG4gICAgICAgIHRoaXMuclNpemVDb250ZW50KCk7XG5cbiAgICAgICAgaWYgKHRoaXMucGFyZW50R3JvdXAgIT09IG51bGwpXG4gICAgICAgICAgICB0aGlzLnBhcmVudEdyb3VwLmNhbGModGhpcy5oIC0gdGhpcy5iYXNlSCk7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuaXNVSSkgdGhpcy5tYWluLmNhbGModGhpcy5oIC0gdGhpcy5iYXNlSCk7XG4gICAgfSxcblxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLmNsb3NlLmNhbGwodGhpcyk7XG5cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMsIGZhbHNlKTtcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnRHcm91cCAhPT0gbnVsbClcbiAgICAgICAgICAgIHRoaXMucGFyZW50R3JvdXAuY2FsYygtKHRoaXMuaCAtIHRoaXMuYmFzZUgpKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc1VJKSB0aGlzLm1haW4uY2FsYygtKHRoaXMuaCAtIHRoaXMuYmFzZUgpKTtcblxuICAgICAgICB0aGlzLmggPSB0aGlzLmJhc2VIO1xuICAgICAgICB0aGlzLnNbMF0uaGVpZ2h0ID0gdGhpcy5oICsgXCJweFwiO1xuICAgICAgICB0aGlzLnNbMl0uZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBUb29scy5zZXRTdmcodGhpcy5jWzRdLCBcImRcIiwgXCJNIDMgOCBMIDggNSAzIDIgMyA4IFpcIik7XG4gICAgfSxcblxuICAgIC8vIC0tLS0tXG5cbiAgICB0ZXh0OiBmdW5jdGlvbih0eHQpIHtcbiAgICAgICAgdGhpcy5jWzNdLnRleHRDb250ZW50ID0gdHh0O1xuICAgIH0sXG5cbiAgICByU2l6ZUNvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSB0aGlzLmxpc3RJbi5jaGlsZHJlbltpXS5zdHlsZS53aWR0aCA9IHRoaXMudyArIFwicHhcIjtcbiAgICB9LFxuXG4gICAgclNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBQcm90by5wcm90b3R5cGUuclNpemUuY2FsbCh0aGlzKTtcblxuICAgICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgICAgdmFyIHcgPSB0aGlzLnNiO1xuICAgICAgICB2YXIgZCA9IHRoaXMuc2E7XG5cbiAgICAgICAgc1syXS53aWR0aCA9IHcgKyBcInB4XCI7XG4gICAgICAgIHNbMl0ubGVmdCA9IGQgKyBcInB4XCI7XG5cbiAgICAgICAgc1szXS53aWR0aCA9IHcgKyBcInB4XCI7XG4gICAgICAgIHNbM10ubGVmdCA9IGQgKyBcInB4XCI7XG5cbiAgICAgICAgc1s0XS5sZWZ0ID0gZCArIHcgLSAxNyArIFwicHhcIjtcblxuICAgICAgICAvL3NbNV0ud2lkdGggPSB3ICsgJ3B4JztcbiAgICAgICAgLy9zWzVdLmxlZnQgPSBkICsgJ3B4JztcblxuICAgICAgICB0aGlzLncgPSB3O1xuICAgICAgICBpZiAodGhpcy5tYXggPiB0aGlzLm1heEhlaWdodCkgdGhpcy53ID0gdyAtIDIwO1xuXG4gICAgICAgIGlmICh0aGlzLmlzT3BlbikgdGhpcy5yU2l6ZUNvbnRlbnQoKTtcbiAgICB9LFxufSk7XG5cbmZ1bmN0aW9uIE51bWVyaWMoIG8gKXtcblxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMudHlwZSA9ICdudW1iZXInO1xuXG4gICAgdGhpcy5zZXRUeXBlTnVtYmVyKCBvICk7XG5cbiAgICB0aGlzLmFsbHdheSA9IG8uYWxsd2F5IHx8IGZhbHNlO1xuICAgIHRoaXMuaXNEcmFnID0gby5kcmFnID09PSB1bmRlZmluZWQgPyB0cnVlIDogby5kcmFnO1xuXG4gICAgdGhpcy52YWx1ZSA9IFswXTtcbiAgICB0aGlzLnRvUmFkID0gMTtcbiAgICB0aGlzLmlzTnVtYmVyID0gdHJ1ZTtcbiAgICB0aGlzLmlzQW5nbGUgPSBmYWxzZTtcbiAgICB0aGlzLmlzVmVjdG9yID0gZmFsc2U7XG4gICAgdGhpcy5pc1NlbGVjdCA9IGZhbHNlO1xuXG4gICAgaWYoIG8udmFsdWUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICBpZighaXNOYU4oby52YWx1ZSkpeyB0aGlzLnZhbHVlID0gW28udmFsdWVdO31cbiAgICAgICAgZWxzZSBpZihvLnZhbHVlIGluc3RhbmNlb2YgQXJyYXkgKXsgdGhpcy52YWx1ZSA9IG8udmFsdWU7IHRoaXMuaXNOdW1iZXI9ZmFsc2U7fVxuICAgICAgICBlbHNlIGlmKG8udmFsdWUgaW5zdGFuY2VvZiBPYmplY3QgKXsgXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gW107XG4gICAgICAgICAgICBpZihvLnZhbHVlLngpIHRoaXMudmFsdWVbMF0gPSBvLnZhbHVlLng7XG4gICAgICAgICAgICBpZihvLnZhbHVlLnkpIHRoaXMudmFsdWVbMV0gPSBvLnZhbHVlLnk7XG4gICAgICAgICAgICBpZihvLnZhbHVlLnopIHRoaXMudmFsdWVbMl0gPSBvLnZhbHVlLno7XG4gICAgICAgICAgICBpZihvLnZhbHVlLncpIHRoaXMudmFsdWVbM10gPSBvLnZhbHVlLnc7XG4gICAgICAgICAgICB0aGlzLmlzVmVjdG9yID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubGVuZ3RoID0gdGhpcy52YWx1ZS5sZW5ndGg7XG5cbiAgICBpZihvLmlzQW5nbGUpe1xuICAgICAgICB0aGlzLmlzQW5nbGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnRvUmFkID0gTWF0aC5QSS8xODA7XG4gICAgfVxuXG4gICAgLy90aGlzLncgPSAoKFRvb2xzLmJhc2UuQlcrNSkvKHRoaXMubGVuZ3RoKSktNTtcbiAgICB0aGlzLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG4gICAgXG4gICAgdmFyIGkgPSB0aGlzLmxlbmd0aDtcbiAgICB3aGlsZShpLS0pe1xuICAgICAgICBpZih0aGlzLmlzQW5nbGUpIHRoaXMudmFsdWVbaV0gPSAodGhpcy52YWx1ZVtpXSAqIDE4MCAvIE1hdGguUEkpLnRvRml4ZWQoIHRoaXMucHJlY2lzaW9uICk7XG4gICAgICAgIHRoaXMuY1syK2ldID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dHNlbGVjdCArICdsZXR0ZXItc3BhY2luZzotMXB4OyBjdXJzb3I6cG9pbnRlcjsgaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7IGxpbmUtaGVpZ2h0OicrKHRoaXMuaC04KSsncHg7Jyk7XG4gICAgICAgIHRoaXMuY1syK2ldLm5hbWUgPSBpO1xuICAgICAgICBpZih0aGlzLmlzRHJhZykgdGhpcy5jWzIraV0uc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuICAgICAgICBpZihvLmNlbnRlcikgdGhpcy5jWzIraV0uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG5cbiAgICAgICAgdGhpcy5jWzIraV0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgICB0aGlzLmNbMitpXS5zdHlsZS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAvL3RoaXMuY1syK2ldLmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuY1syK2ldLmV2ZW50cyA9IFsgJ2tleWRvd24nLCAna2V5dXAnLCAnbW91c2Vkb3duJywgJ2JsdXInLCAnZm9jdXMnIF07IC8vJ2NsaWNrJywgXG5cbiAgICB9XG5cbiAgICB0aGlzLmluaXQoKTtcbn1cblxuTnVtZXJpYy5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IE51bWVyaWMsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24oIGUgKSB7XG5cbiAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIC8vY2FzZSAnY2xpY2snOiB0aGlzLmNsaWNrKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5kb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6IHRoaXMua2V5ZG93biggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleXVwJzogdGhpcy5rZXl1cCggZSApOyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYmx1cic6IHRoaXMuYmx1ciggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzogdGhpcy5mb2N1cyggZSApOyBicmVhaztcblxuICAgICAgICAgICAgLy8gZG9jdW1lbnRcbiAgICAgICAgICAgIGNhc2UgJ21vdXNldXAnOiB0aGlzLnVwKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogdGhpcy5tb3ZlKCBlICk7IGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBzZXRWYWx1ZTogZnVuY3Rpb24gKCB2LCBuICkge1xuXG4gICAgICAgIG4gPSBuIHx8IDA7XG4gICAgICAgIHRoaXMudmFsdWVbbl0gPSB0aGlzLm51bVZhbHVlKCB2ICk7XG4gICAgICAgIHRoaXMuY1syK25dLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZVtuXTtcblxuICAgIH0sXG5cbiAgICBrZXlkb3duOiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiggZS5rZXlDb2RlID09PSAxMyApe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy50ZXN0VmFsdWUoIHBhcnNlRmxvYXQoZS50YXJnZXQubmFtZSkgKTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGUudGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGtleXVwOiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIFxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmKCB0aGlzLmFsbHdheSApeyBcbiAgICAgICAgICAgIHRoaXMudGVzdFZhbHVlKCBwYXJzZUZsb2F0KGUudGFyZ2V0Lm5hbWUpICk7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBibHVyOiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgdGhpcy5pc1NlbGVjdCA9IGZhbHNlO1xuICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFRvb2xzLmNvbG9ycy5ib3JkZXI7XG4gICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IGZhbHNlO1xuICAgICAgICAvL2UudGFyZ2V0LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjEpJztcbiAgICAgICAgaWYodGhpcy5pc0RyYWcpIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdtb3ZlJztcbiAgICAgICAgZWxzZSAgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuXG4gICAgfSxcblxuICAgIGZvY3VzOiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgdGhpcy5pc1NlbGVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBUb29scy5jb2xvcnMuYm9yZGVyU2VsZWN0O1xuICAgICAgICBcbiAgICAgICAgLy9lLnRhcmdldC5zdHlsZS5ib3JkZXIgPSAnMXB4IHNvbGlkICcgKyBVSUwuQm9yZGVyU2VsZWN0O1xuICAgICAgICBpZih0aGlzLmlzRHJhZykgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ2F1dG8nO1xuXG4gICAgfSxcblxuICAgIGRvd246IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBpZih0aGlzLmlzU2VsZWN0KSByZXR1cm47XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuY3VycmVudCA9IHBhcnNlRmxvYXQoZS50YXJnZXQubmFtZSk7XG5cbiAgICAgICAgdGhpcy5wcmV2ID0geyB4OmUuY2xpZW50WCwgeTplLmNsaWVudFksIGQ6MCwgaWQ6KHRoaXMuY3VycmVudCsyKX07XG4gICAgICAgIGlmKCB0aGlzLmlzTnVtYmVyICkgdGhpcy5wcmV2LnYgPSBwYXJzZUZsb2F0KHRoaXMudmFsdWUpO1xuICAgICAgICBlbHNlIHRoaXMucHJldi52ID0gcGFyc2VGbG9hdCggdGhpcy52YWx1ZVt0aGlzLmN1cnJlbnRdICk7XG5cblxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgaWYodGhpcy5pc0RyYWcpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgfSxcblxuICAgIC8vLy9cblxuICAgIHVwOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGlmKHRoaXMuaXNEcmFnKSBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICBpZih0aGlzLmN1cnJlbnQgIT09IHVuZGVmaW5lZCl7IFxuXG4gICAgICAgICAgICBpZiggdGhpcy5jdXJyZW50ID09PSBwYXJzZUZsb2F0KGUudGFyZ2V0Lm5hbWUpICl7IFxuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYoIHRoaXMuY3VycmVudCA9PT0gdW5kZWZpbmVkICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMucHJldi5kICs9ICggZS5jbGllbnRYIC0gdGhpcy5wcmV2LnggKSAtICggZS5jbGllbnRZIC0gdGhpcy5wcmV2LnkgKTtcbiAgICAgICAgdmFyIG4gPSB0aGlzLnByZXYudiArICggdGhpcy5wcmV2LmQgKiB0aGlzLnN0ZXApO1xuXG4gICAgICAgIHRoaXMudmFsdWVbdGhpcy5jdXJyZW50XSA9IHRoaXMubnVtVmFsdWUobik7XG4gICAgICAgIC8vdGhpcy5jWzIrdGhpcy5jdXJyZW50XS52YWx1ZSA9IHRoaXMudmFsdWVbdGhpcy5jdXJyZW50XTtcblxuICAgICAgICB0aGlzLmNbMit0aGlzLmN1cnJlbnRdLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZVt0aGlzLmN1cnJlbnRdO1xuXG4gICAgICAgIHRoaXMudmFsaWRhdGUoKTtcblxuICAgICAgICB0aGlzLnByZXYueCA9IGUuY2xpZW50WDtcbiAgICAgICAgdGhpcy5wcmV2LnkgPSBlLmNsaWVudFk7XG5cbiAgICB9LFxuXG4gICAgLy8vLy9cblxuICAgIHRlc3RWYWx1ZTogZnVuY3Rpb24oIG4gKXtcblxuICAgICAgICBpZighaXNOYU4oIHRoaXMuY1syK25dLnRleHRDb250ZW50ICkpeyBcbiAgICAgICAgICAgIHZhciBueCA9IHRoaXMubnVtVmFsdWUoIHRoaXMuY1syK25dLnRleHRDb250ZW50ICk7XG4gICAgICAgICAgICB0aGlzLmNbMituXS50ZXh0Q29udGVudCA9IG54O1xuICAgICAgICAgICAgdGhpcy52YWx1ZVtuXSA9IG54O1xuICAgICAgICB9IGVsc2UgeyAvLyBub3QgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLmNbMituXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWVbbl07XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgYXIgPSBbXTtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKSBhcltpXSA9IHRoaXMudmFsdWVbaV0qdGhpcy50b1JhZDtcblxuICAgICAgICBpZiggdGhpcy5pc051bWJlciApIHRoaXMuc2VuZCggYXJbMF0gKTtcbiAgICAgICAgZWxzZSB0aGlzLnNlbmQoIGFyICk7XG5cbiAgICB9LFxuXG4gICAgclNpemU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcblxuICAgICAgICB0aGlzLncgPSB+figgKCB0aGlzLnNiICsgNSApIC8gdGhpcy5sZW5ndGggKS01O1xuICAgICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgICAgdmFyIGkgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIHNbMitpXS5sZWZ0ID0gKH5+KCB0aGlzLnNhICsgKCB0aGlzLncgKiBpICkrKCA1ICogaSApKSkgKyAncHgnO1xuICAgICAgICAgICAgc1syK2ldLndpZHRoID0gdGhpcy53ICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgfVxuXG59ICk7XG5cbmZ1bmN0aW9uIFNsaWRlICggbyApe1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy5zZXRUeXBlTnVtYmVyKCBvICk7XG5cbiAgICB0aGlzLnN0eXBlID0gby5zdHlwZSB8fCAwO1xuICAgIHRoaXMuYnV0dG9uQ29sb3IgPSBvLmJDb2xvciB8fCBUb29scy5jb2xvcnMuYnV0dG9uO1xuXG4gICAgLy90aGlzLm9sZCA9IHRoaXMudmFsdWU7XG4gICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcbiAgICB0aGlzLmlzT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMuYWxsd2F5ID0gby5hbGx3YXkgfHwgZmFsc2U7XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0c2VsZWN0ICsgJ2xldHRlci1zcGFjaW5nOi0xcHg7IHBhZGRpbmc6MnB4IDVweDsgdGV4dC1hbGlnbjpyaWdodDsgY3Vyc29yOnBvaW50ZXI7IHdpZHRoOjQ3cHg7IGJvcmRlcjpub25lOyBjb2xvcjonKyB0aGlzLmZvbnRDb2xvciApO1xuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6dy1yZXNpemU7IHRvcDowOyBoZWlnaHQ6Jyt0aGlzLmgrJ3B4OycgKTtcbiAgICAvL3RoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdib3JkZXI6MXB4IHNvbGlkICcrdGhpcy5idXR0b25Db2xvcisnOyBwb2ludGVyLWV2ZW50czpub25lOyBiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC4zKTsgdG9wOjJweDsgaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7JyApO1xuICAgIHRoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdwb2ludGVyLWV2ZW50czpub25lOyBiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC4zKTsgdG9wOjJweDsgaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7JyApO1xuICAgIHRoaXMuY1s1XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjRweDsgdG9wOjVweDsgaGVpZ2h0OicrKHRoaXMuaC0xMCkrJ3B4OyBiYWNrZ3JvdW5kOicgKyB0aGlzLmZvbnRDb2xvciArJzsnICk7XG5cbiAgICB0aGlzLmNbMl0ubmFtZSA9ICd0ZXh0JztcbiAgICB0aGlzLmNbM10ubmFtZSA9ICdzY3JvbGwnO1xuXG4gICAgaWYodGhpcy5zdHlwZSAhPT0gMCl7XG4gICAgICAgIGlmKHRoaXMuc3R5cGUgPT09IDEgfHwgdGhpcy5zdHlwZSA9PT0gMyl7XG4gICAgICAgICAgICB2YXIgaDEgPSA0O1xuICAgICAgICAgICAgdmFyIGgyID0gODtcbiAgICAgICAgICAgIHZhciB3dyA9IHRoaXMuaC00O1xuICAgICAgICAgICAgdmFyIHJhID0gMjA7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnN0eXBlID09PSAyKXtcbiAgICAgICAgICAgIGgxID0gMjtcbiAgICAgICAgICAgIGgyID0gNDtcbiAgICAgICAgICAgIHJhID0gMjtcbiAgICAgICAgICAgIHd3ID0gKHRoaXMuaC00KSowLjU7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnN0eXBlID09PSAzKSB0aGlzLmNbNV0uc3R5bGUudmlzaWJsZSA9ICdub25lJztcblxuICAgICAgICB0aGlzLmNbNF0uc3R5bGUuYm9yZGVyUmFkaXVzID0gaDEgKyAncHgnO1xuICAgICAgICB0aGlzLmNbNF0uc3R5bGUuaGVpZ2h0ID0gaDIgKyAncHgnO1xuICAgICAgICB0aGlzLmNbNF0uc3R5bGUudG9wID0gKHRoaXMuaCowLjUpIC0gaDEgKyAncHgnO1xuICAgICAgICB0aGlzLmNbNV0uc3R5bGUuYm9yZGVyUmFkaXVzID0gKGgxKjAuNSkgKyAncHgnO1xuICAgICAgICB0aGlzLmNbNV0uc3R5bGUuaGVpZ2h0ID0gaDEgKyAncHgnO1xuICAgICAgICB0aGlzLmNbNV0uc3R5bGUudG9wID0gKHRoaXMuaCowLjUpLShoMSowLjUpICsgJ3B4JztcblxuICAgICAgICB0aGlzLmNbNl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnYm9yZGVyLXJhZGl1czonK3JhKydweDsgbWFyZ2luLWxlZnQ6JysoLXd3KjAuNSkrJ3B4OyBib3JkZXI6MXB4IHNvbGlkICcrVG9vbHMuY29sb3JzLmJvcmRlcisnOyBiYWNrZ3JvdW5kOicrdGhpcy5idXR0b25Db2xvcisnOyBsZWZ0OjRweDsgdG9wOjJweDsgaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7IHdpZHRoOicrd3crJ3B4OycgKTtcbiAgICB9XG5cbiAgICB0aGlzLmNbM10uZXZlbnRzID0gWyAnbW91c2VvdmVyJywgJ21vdXNlZG93bicsICdtb3VzZW91dCcgXTtcbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAna2V5ZG93bicsICdrZXl1cCcsICdtb3VzZWRvd24nLCAnYmx1cicsICdmb2N1cycgXTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG59XG5cblNsaWRlLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogU2xpZGUsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2coZS50YXJnZXQubmFtZSlcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3Zlcic6IHRoaXMub3ZlciggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IGUudGFyZ2V0Lm5hbWUgPT09ICd0ZXh0JyA/IHRoaXMudGV4dGRvd24oIGUgKSA6IHRoaXMuZG93biggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3V0JzogdGhpcy5vdXQoIGUgKTsgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ21vdXNldXAnOiB0aGlzLnVwKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogaWYodGhpcy5pc0Rvd24pIHRoaXMubW92ZSggZSApOyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnYmx1cic6IHRoaXMuYmx1ciggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzogdGhpcy5mb2N1cyggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOiB0aGlzLmtleWRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdrZXl1cCc6IHRoaXMua2V5dXAoIGUgKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtb2RlOiBmdW5jdGlvbiAoIG1vZGUgKSB7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG5cbiAgICAgICAgc3dpdGNoKG1vZGUpe1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBiYXNlXG4gICAgICAgICAgICAgICAgc1syXS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgICAgIHNbNF0uYmFja2dyb3VuZCA9ICdyZ2JhKDAsMCwwLDAuMyknO1xuICAgICAgICAgICAgICAgIHNbNV0uYmFja2dyb3VuZCA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IC8vIG92ZXJcbiAgICAgICAgICAgICAgICBzWzJdLmNvbG9yID0gdGhpcy5jb2xvclBsdXM7XG4gICAgICAgICAgICAgICAvLyBpZiggIXNbNl0gKSBzWzRdLmJhY2tncm91bmQgPSBVSUwuU2xpZGVCRztcbiAgICAgICAgICAgICAgIC8vIGVsc2UgXG4gICAgICAgICAgICAgICAgc1s0XS5iYWNrZ3JvdW5kID0gJ3JnYmEoMCwwLDAsMC42KSc7XG4gICAgICAgICAgICAgICAgc1s1XS5iYWNrZ3JvdW5kID0gdGhpcy5jb2xvclBsdXM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvdmVyOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLmlzT3ZlciA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kZSgxKTtcblxuICAgIH0sXG5cbiAgICBvdXQ6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMuaXNEb3duKSByZXR1cm47XG4gICAgICAgIHRoaXMubW9kZSgwKTtcblxuICAgIH0sXG5cbiAgICB1cDogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICBpZih0aGlzLmlzT3ZlcikgdGhpcy5tb2RlKDEpO1xuICAgICAgICBlbHNlIHRoaXMubW9kZSgwKTtcblxuICAgICAgICB0aGlzLnNlbmRFbmQoKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIGRvd246IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICB0aGlzLmxlZnQgPSB0aGlzLmNbM10uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgdGhpcy5vbGQgPSB0aGlzLnZhbHVlO1xuICAgICAgICB0aGlzLm1vdmUoIGUgKTtcblxuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIHZhciBuID0gKCgoIGUuY2xpZW50WCAtIHRoaXMubGVmdCAtIDMgKSAvIHRoaXMudyApICogdGhpcy5yYW5nZSArIHRoaXMubWluICkgLSB0aGlzLm9sZDtcbiAgICAgICAgaWYobiA+PSB0aGlzLnN0ZXAgfHwgbiA8PSB0aGlzLnN0ZXApeyBcbiAgICAgICAgICAgIG4gPSB+fiAoIG4gLyB0aGlzLnN0ZXAgKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB0aGlzLm9sZCArICggbiAqIHRoaXMuc3RlcCApICk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSggdHJ1ZSApO1xuICAgICAgICAgICAgdGhpcy5vbGQgPSB0aGlzLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiggdXAgKXtcblxuICAgICAgICB2YXIgd3cgPSB0aGlzLncgKiAoKCB0aGlzLnZhbHVlIC0gdGhpcy5taW4gKSAvIHRoaXMucmFuZ2UgKTtcbiAgICAgICBcbiAgICAgICAgaWYodGhpcy5zdHlwZSAhPT0gMykgdGhpcy5zWzVdLndpZHRoID0gfn4gd3cgKyAncHgnO1xuICAgICAgICBpZih0aGlzLnNbNl0pIHRoaXMuc1s2XS5sZWZ0ID0gfn4gKHRoaXMuc2EgK3d3ICsgMykgKyAncHgnO1xuICAgICAgICB0aGlzLmNbMl0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlO1xuXG4gICAgICAgIGlmKCB1cCApIHRoaXMuc2VuZCgpO1xuXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG5cbiAgICAgICAgdmFyIHcgPSB0aGlzLnNiIC0gdGhpcy5zYztcbiAgICAgICAgdGhpcy53ID0gdyAtIDY7XG5cbiAgICAgICAgdmFyIHR4ID0gdGhpcy5zYztcbiAgICAgICAgaWYodGhpcy5pc1VJIHx8ICF0aGlzLnNpbXBsZSkgdHggPSB0aGlzLnNjKzEwO1xuXG4gICAgICAgIHZhciB0eSA9IH5+KHRoaXMuaCAqIDAuNSkgLSA4O1xuXG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuXG4gICAgICAgIHNbMl0ud2lkdGggPSAodGhpcy5zYyAtMiApKyAncHgnO1xuICAgICAgICBzWzJdLmxlZnQgPSAodGhpcy53aWR0aCAtIHR4ICsyKSArICdweCc7XG4gICAgICAgIHNbMl0udG9wID0gdHkgKyAncHgnO1xuICAgICAgICBzWzNdLmxlZnQgPSB0aGlzLnNhICsgJ3B4JztcbiAgICAgICAgc1szXS53aWR0aCA9IHcgKyAncHgnO1xuICAgICAgICBzWzRdLmxlZnQgPSB0aGlzLnNhICsgJ3B4JztcbiAgICAgICAgc1s0XS53aWR0aCA9IHcgKyAncHgnO1xuICAgICAgICBzWzVdLmxlZnQgPSAodGhpcy5zYSArIDMpICsgJ3B4JztcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgfSxcblxuICAgIC8vIHRleHRcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGlmKCFpc05hTiggdGhpcy5jWzJdLnRleHRDb250ZW50ICkpeyBcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB0aGlzLmNbMl0udGV4dENvbnRlbnQgKTsgXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTsgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB0aGlzLmNbMl0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlO1xuXG4gICAgfSxcblxuICAgIHRleHRkb3duOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIHRoaXMuaXNFZGl0ID0gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICBrZXlkb3duOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYoIGUua2V5Q29kZSA9PT0gMTMgKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgICAgIGUudGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGtleXVwOiBmdW5jdGlvbiggZSApe1xuICAgICAgICBcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgaWYoIHRoaXMuYWxsd2F5ICkgdGhpcy52YWxpZGF0ZSgpO1xuXG4gICAgfSxcblxuICAgIGJsdXI6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS50YXJnZXQuc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgICAgICBlLnRhcmdldC5jb250ZW50RWRpdGFibGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0VkaXQgPSBmYWxzZTtcblxuICAgIH0sXG5cbiAgICBmb2N1czogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3JkZXIgPSAnMXB4IGRhc2hlZCAnICsgVG9vbHMuY29sb3JzLmJvcmRlclNlbGVjdDtcblxuICAgIH1cblxufSApO1xuXG5mdW5jdGlvbiBUZXh0SW5wdXQoIG8gKXtcblxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMudmFsdWUgPSBvLnZhbHVlIHx8ICcnO1xuICAgIHRoaXMuYWxsd2F5ID0gby5hbGx3YXkgfHwgZmFsc2U7XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCAgVG9vbHMuY3NzLnR4dHNlbGVjdCApO1xuICAgIHRoaXMuY1syXS5uYW1lID0gJ2lucHV0JztcbiAgICAvL3RoaXMuY1syXS5zdHlsZS5jb2xvciA9IDtcbiAgICB0aGlzLmNbMl0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlO1xuXG4gICAgdGhpcy5jWzJdLmV2ZW50cyA9IFsgJ21vdXNlZG93bicsICdrZXlkb3duJywgJ2tleXVwJywgJ2JsdXInLCAnZm9jdXMnIF07XG5cbiAgICB0aGlzLmluaXQoKTtcblxufVxuXG5UZXh0SW5wdXQucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBUZXh0SW5wdXQsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24oIGUgKSB7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLmRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdibHVyJzogdGhpcy5ibHVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOiB0aGlzLmZvY3VzKCBlICk7IGJyZWFrXG4gICAgICAgICAgICBjYXNlICdrZXlkb3duJzogdGhpcy5rZXlkb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5dXAnOiB0aGlzLmtleXVwKCBlICk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgZG93bjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnRhcmdldC5jb250ZW50RWRpdGFibGUgPSB0cnVlO1xuICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnYXV0byc7XG5cbiAgICB9LFxuXG4gICAgYmx1cjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFRvb2xzLmNvbG9ycy5ib3JkZXI7XG4gICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IGZhbHNlO1xuXG4gICAgfSxcblxuICAgIGZvY3VzOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gVG9vbHMuY29sb3JzLmJvcmRlclNlbGVjdDtcblxuICAgIH0sXG5cbiAgICBrZXlkb3duOiBmdW5jdGlvbiggZSApe1xuICAgICAgICBcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiggZS5rZXlDb2RlID09PSAxMyApeyBcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBlLnRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGUudGFyZ2V0LmJsdXIoKTtcbiAgICAgICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAga2V5dXA6IGZ1bmN0aW9uKCBlICl7XG4gICAgICAgIFxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSBlLnRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYoIHRoaXMuYWxsd2F5ICkgdGhpcy5zZW5kKCk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24oKXtcblxuICAgICAgICBQcm90by5wcm90b3R5cGUuclNpemUuY2FsbCggdGhpcyApO1xuICAgICAgICB0aGlzLnNbMl0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgdGhpcy5zWzJdLmxlZnQgPSB0aGlzLnNhICsgJ3B4JztcbiAgICAgICAgdGhpcy5zWzJdLndpZHRoID0gdGhpcy5zYiArICdweCc7XG4gICAgICAgIHRoaXMuc1syXS5oZWlnaHQgPSB0aGlzLmggLTQgKyAncHgnO1xuICAgICAgICB0aGlzLnNbMl0ubGluZUhlaWdodCA9IHRoaXMuaCAtIDggKyAncHgnO1xuICAgICBcbiAgICB9XG5cbn0gKTtcblxuZnVuY3Rpb24gVGl0bGUgKCBvICkge1xuICAgIFxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIC8vdmFyIGlkID0gby5pZCB8fCAwO1xuICAgIHZhciBwcmVmaXggPSBvLnByZWZpeCB8fCAnJztcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHQgKyAndGV4dC1hbGlnbjpyaWdodDsgd2lkdGg6NjBweDsgbGluZS1oZWlnaHQ6JysgKHRoaXMuaC04KSArICdweDsgY29sb3I6JyArIHRoaXMuZm9udENvbG9yICk7XG5cbiAgICBpZiggdGhpcy5oID09PSAzMSApe1xuXG4gICAgICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmggKyAncHgnO1xuICAgICAgICB0aGlzLnNbMV0udG9wID0gOCArICdweCc7XG4gICAgICAgIHRoaXMuY1syXS5zdHlsZS50b3AgPSA4ICsgJ3B4JztcblxuICAgIH1cblxuICAgIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9IHRoaXMudHh0LnN1YnN0cmluZygwLDEpLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnR4dC5zdWJzdHJpbmcoMSkucmVwbGFjZShcIi1cIiwgXCIgXCIpO1xuICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHByZWZpeDtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG59XG5cblRpdGxlLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogVGl0bGUsXG5cbiAgICB0ZXh0OiBmdW5jdGlvbiAoIHR4dCApIHtcblxuICAgICAgICB0aGlzLmNbMV0udGV4dENvbnRlbnQgPSB0eHQ7XG5cbiAgICB9LFxuXG4gICAgdGV4dDI6IGZ1bmN0aW9uICggdHh0ICkge1xuXG4gICAgICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHR4dDtcblxuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG4gICAgICAgIHRoaXMuc1sxXS53aWR0aCA9IHRoaXMud2lkdGgtNTAgKyAncHgnO1xuICAgICAgICB0aGlzLnNbMl0ubGVmdCA9IHRoaXMud2lkdGgtKDUwKzI2KSArICdweCc7XG5cbiAgICB9LFxuXG59ICk7XG5cbmZ1bmN0aW9uIGdldFR5cGUoIG5hbWUsIG8gKSB7XG5cbiAgICAgICAgdmFyIG4gPSBudWxsO1xuXG4gICAgICAgIHN3aXRjaCggbmFtZSApe1xuXG4gICAgICAgICAgICBjYXNlICdCb29sJzogY2FzZSAnYm9vbCc6IG4gPSBuZXcgQm9vbChvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdCdXR0b24nOiBjYXNlICdidXR0b24nOiBuID0gbmV3IEJ1dHRvbihvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdDaXJjdWxhcic6IGNhc2UgJ2NpcmN1bGFyJzogbiA9IG5ldyBDaXJjdWxhcihvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdDb2xvcic6IGNhc2UgJ2NvbG9yJzogbiA9IG5ldyBDb2xvcihvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdGcHMnOiBjYXNlICdmcHMnOiBuID0gbmV3IEZwcyhvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdHcm91cCc6IGNhc2UgJ2dyb3VwJzogbiA9IG5ldyBHcm91cChvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdKb3lzdGljayc6IGNhc2UgJ2pveXN0aWNrJzogbiA9IG5ldyBKb3lzdGljayhvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdLbm9iJzogY2FzZSAna25vYic6IG4gPSBuZXcgS25vYihvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdMaXN0JzogY2FzZSAnbGlzdCc6IG4gPSBuZXcgTGlzdChvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdOdW1lcmljJzpjYXNlICdOdW1iZXInOiBjYXNlICdudW1lcmljJzpjYXNlICdudW1iZXInOiBuID0gbmV3IE51bWVyaWMobyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnU2xpZGUnOiBjYXNlICdzbGlkZSc6IG4gPSBuZXcgU2xpZGUobyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnVGV4dElucHV0JzpjYXNlICdTdHJpbmcnOiBjYXNlICd0ZXh0SW5wdXQnOmNhc2UgJ3N0cmluZyc6IG4gPSBuZXcgVGV4dElucHV0KG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ1RpdGxlJzogY2FzZSAndGl0bGUnOiBuID0gbmV3IFRpdGxlKG8pOyBicmVhaztcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGFkZCAoKXtcblxuICAgIHZhciBhID0gYXJndW1lbnRzOyBcblxuICAgIHZhciB0eXBlLCBvLCByZWYgPSBmYWxzZTtcblxuICAgIGlmKCB0eXBlb2YgYVswXSA9PT0gJ3N0cmluZycgKXsgXG5cbiAgICAgICAgdHlwZSA9IGFbMF07Ly9bMF0udG9VcHBlckNhc2UoKSArIGFbMF0uc2xpY2UoMSk7XG4gICAgICAgIG8gPSBhWzFdIHx8IHt9O1xuXG4gICAgfSBlbHNlIGlmICggdHlwZW9mIGFbMF0gPT09ICdvYmplY3QnICl7IC8vIGxpa2UgZGF0IGd1aVxuXG4gICAgICAgIHJlZiA9IHRydWU7XG4gICAgICAgIGlmKCBhWzJdID09PSB1bmRlZmluZWQgKSBbXS5wdXNoLmNhbGwoYSwge30pO1xuXG4gICAgICAgIHR5cGUgPSBhdXRvVHlwZS5hcHBseSggdGhpcywgYSApO1xuXG4gICAgICAgIG8gPSBhWzJdO1xuXG4gICAgICAgIG8ubmFtZSA9IGFbMV07XG4gICAgICAgIG8udmFsdWUgPSBhWzBdW2FbMV1dO1xuXG4gICAgfVxuXG4gICAgdmFyIG4gPSBnZXRUeXBlKCB0eXBlLCBvICk7XG5cbiAgICBpZihuICE9PSBudWxsICl7XG4gICAgICAgIGlmKCByZWYgKSBuLnNldFJlZmVyZW5jeSggYVswXSwgYVsxXSApO1xuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG4gICAgXG5cbn1cblxuZnVuY3Rpb24gYXV0b1R5cGUgKCkge1xuXG4gICAgdmFyIGEgPSBhcmd1bWVudHM7XG5cbiAgICB2YXIgdHlwZSA9ICdTbGlkZSc7XG5cbiAgICBpZihhWzJdLnR5cGUpIHR5cGUgPSBhWzJdLnR5cGU7XG5cbiAgICByZXR1cm4gdHlwZTtcblxufVxuXG52YXIgUkVWSVNJT04gPSAnMS4wJztcblxuLyoqXG4gKiBAYXV0aG9yIGxvLXRoIC8gaHR0cHM6Ly9naXRodWIuY29tL2xvLXRoXG4gKi9cblxuZnVuY3Rpb24gR3VpICggbyApIHtcblxuICAgIG8gPSBvIHx8IHt9O1xuXG4gICAgLy8gY3NzIHBsdXNcbiAgICB0aGlzLmNzcyA9IG8uY3NzICE9PSB1bmRlZmluZWQgPyBvLmNzcyA6ICcnO1xuXG4gICAgLy8gc2l6ZSBkZWZpbmVcbiAgICB0aGlzLnNpemUgPSBUb29scy5zaXplO1xuICAgIGlmKCBvLnAgIT09IHVuZGVmaW5lZCApIHRoaXMuc2l6ZS5wID0gby5wO1xuICAgIGlmKCBvLncgIT09IHVuZGVmaW5lZCApIHRoaXMuc2l6ZS53ID0gby53O1xuICAgIGlmKCBvLmggIT09IHVuZGVmaW5lZCApIHRoaXMuc2l6ZS5oID0gby5oO1xuICAgIGlmKCBvLnMgIT09IHVuZGVmaW5lZCApIHRoaXMuc2l6ZS5zID0gby5zO1xuXG4gICAgdGhpcy5zaXplLmggPSB0aGlzLnNpemUuaCA8IDExID8gMTEgOiB0aGlzLnNpemUuaDtcblxuICAgIHRoaXMud2lkdGggPSB0aGlzLnNpemUudztcblxuICAgIC8vIGJvdHRvbSBoZWlnaHRcbiAgICB0aGlzLmJoID0gdGhpcy5zaXplLmg7XG5cblxuXG5cbiAgICAvL3RoaXMud2lkdGggPSBvLndpZHRoICE9PSB1bmRlZmluZWQgPyBvLndpZHRoIDogVG9vbHMuc2l6ZS53aWR0aDtcbiAgICAvL3RoaXMud2lkdGggPSBvLnNpemUgIT09IHVuZGVmaW5lZCA/IG8uc2l6ZSA6IHRoaXMud2lkdGg7XG5cblxuICAgIC8vIHRtcCB2YXJpYWJsZVxuICAgIHRoaXMuaGVpZ2h0ID0gMDtcbiAgICB0aGlzLmxlZnQgPSAwO1xuICAgIHRoaXMuaCA9IDA7XG4gICAgdGhpcy5wcmV2WSA9IC0xO1xuICAgIHRoaXMuc3cgPSAwO1xuXG5cbiAgICAvLyBjb2xvclxuICAgIHRoaXMuY29sb3JzID0gVG9vbHMuY29sb3JzO1xuICAgIHRoaXMuYmcgPSBvLmJnIHx8IFRvb2xzLmNvbG9ycy5iYWNrZ3JvdW5kO1xuXG4gICAgLy8gYm90dG9tIGFuZCBjbG9zZSBoZWlnaHRcbiAgICB0aGlzLmlzV2l0aENsb3NlID0gdHJ1ZTtcbiAgICBcblxuICAgIC8vdGhpcy5iYXNlSCA9IFRvb2xzLnNpemUuaGVpZ2h0O1xuXG4gICAgaWYoby5jbG9zZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIHRoaXMuaXNXaXRoQ2xvc2UgPSBvLmNsb3NlO1xuICAgICAgICB0aGlzLmJoID0gIXRoaXMuaXNXaXRoQ2xvc2UgPyAwIDogdGhpcy5iaDtcbiAgICB9XG5cblxuXG4gICAgXG5cbiAgICBUb29scy5tYWluID0gdGhpcztcblxuICAgIHRoaXMuY2FsbGJhY2sgPSBvLmNhbGxiYWNrICA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IG8uY2FsbGJhY2s7XG5cbiAgIFxuICAgIFxuICAgIHRoaXMuaXNDZW50ZXIgPSBvLmNlbnRlciB8fCBmYWxzZTtcbiAgICB0aGlzLmxvY2t3aGVlbCA9IGZhbHNlO1xuICAgIHRoaXMub25XaGVlbCA9IGZhbHNlO1xuICAgIHRoaXMuaXNPcGVuID0gdHJ1ZTtcblxuICAgIHRoaXMudWlzID0gW107XG5cbiAgICB0aGlzLmNvbnRlbnQgPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnZGlzcGxheTpibG9jazsgd2lkdGg6Jyt0aGlzLndpZHRoKydweDsgaGVpZ2h0OmF1dG87IHRvcDowOyByaWdodDoxMHB4OyB0cmFuc2l0aW9uOmhlaWdodCAwLjFzIGVhc2Utb3V0OycgKyB0aGlzLmNzcyApO1xuICAgIGlmKCBvLnBhcmVudCAhPT0gdW5kZWZpbmVkICkgby5wYXJlbnQuYXBwZW5kQ2hpbGQoIHRoaXMuY29udGVudCApO1xuICAgIGVsc2UgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggdGhpcy5jb250ZW50ICk7XG5cbiAgICB0aGlzLmlubmVyQ29udGVudCA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICd3aWR0aDoxMDAlOyB0b3A6MDsgbGVmdDowOyBoZWlnaHQ6YXV0bzsgb3ZlcmZsb3c6aGlkZGVuOycpO1xuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCggdGhpcy5pbm5lckNvbnRlbnQgKTtcblxuICAgIHRoaXMuaW5uZXIgPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAnd2lkdGg6MTAwJTsgdG9wOjA7IGxlZnQ6MDsgaGVpZ2h0OmF1dG87IGJhY2tncm91bmQ6Jyt0aGlzLmJnKyc7Jyk7XG4gICAgdGhpcy5pbm5lckNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5pbm5lcik7XG4gICAgdGhpcy5pbm5lci5uYW1lID0gJ2lubmVyJztcblxuICAgIC8vIHNjcm9sbCBiYWNrZ3JvdW5kXG4gICAgdGhpcy5zY3JvbGxCRyA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdyaWdodDowOyB0b3A6MDsgd2lkdGg6Jyt0aGlzLnNpemUucysncHg7IGhlaWdodDoxMHB4OyBjdXJzb3I6cy1yZXNpemU7IHBvaW50ZXItZXZlbnRzOmF1dG87IGRpc3BsYXk6bm9uZTsgYmFja2dyb3VuZDonK3RoaXMuYmcrJzsgYm9yZGVyLWxlZnQ6MXB4IHNvbGlkICcrdGhpcy5jb2xvcnMuc3Ryb2tlKyc7Jyk7XG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKCB0aGlzLnNjcm9sbEJHICk7XG4gICAgdGhpcy5zY3JvbGxCRy5uYW1lID0gJ3Njcm9sbCc7XG5cbiAgICAvLyBzY3JvbGxcbiAgICB0aGlzLnNjcm9sbCA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdiYWNrZ3JvdW5kOicrdGhpcy5jb2xvcnMuc2Nyb2xsKyc7IHJpZ2h0OjBweDsgdG9wOjA7IHdpZHRoOicrdGhpcy5zaXplLnMrJ3B4OyBoZWlnaHQ6MTBweDsnKTtcbiAgICB0aGlzLnNjcm9sbEJHLmFwcGVuZENoaWxkKCB0aGlzLnNjcm9sbCApO1xuXG4gICAgdGhpcy5ib3R0b20gPSBUb29scy5kb20oICdkaXYnLCAgVG9vbHMuY3NzLnR4dCArICd3aWR0aDoxMDAlOyB0b3A6YXV0bzsgYm90dG9tOjA7IGxlZnQ6MDsgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6MTBweDsgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6MTBweDsgdGV4dC1hbGlnbjpjZW50ZXI7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBoZWlnaHQ6Jyt0aGlzLmJoKydweDsgbGluZS1oZWlnaHQ6JysodGhpcy5iaC01KSsncHg7IGJvcmRlci10b3A6MXB4IHNvbGlkICcrVG9vbHMuY29sb3JzLnN0cm9rZSsnOycpO1xuICAgIHRoaXMuY29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmJvdHRvbSk7XG4gICAgdGhpcy5ib3R0b20udGV4dENvbnRlbnQgPSAnY2xvc2UnO1xuICAgIHRoaXMuYm90dG9tLm5hbWUgPSAnYm90dG9tJztcbiAgICB0aGlzLmJvdHRvbS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5iZztcbiAgICBcbiAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgIHRoaXMuaXNTY3JvbGwgPSBmYWxzZTtcblxuICAgIHRoaXMuY2FsbGJhY2tDbG9zZSA9IGZ1bmN0aW9uKCl7fTtcblxuICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vkb3duJywgdGhpcywgZmFsc2UgKTtcbiAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG4gICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW91dCcsICB0aGlzLCBmYWxzZSApO1xuICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsICAgdGhpcywgZmFsc2UgKTtcbiAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlb3ZlcicsIHRoaXMsIGZhbHNlICk7XG5cbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3ApO1xuXG4gICAgdGhpcy50b3AgPSBvLnRvcCB8fCB0aGlzLmNvbnRlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIC8vdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXdoZWVsJywgdGhpcywgZmFsc2UgKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXdoZWVsJywgZnVuY3Rpb24oZSl7dGhpcy53aGVlbChlKTt9LmJpbmQodGhpcyksIGZhbHNlICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgZnVuY3Rpb24oZSl7dGhpcy5yZXNpemUoZSk7fS5iaW5kKHRoaXMpLCBmYWxzZSApO1xuXG4gICAgLy9cblxuICAgIHRoaXMuc2V0V2lkdGgoIHRoaXMud2lkdGggKTtcblxufVxuXG5HdWkucHJvdG90eXBlID0ge1xuXG4gICAgY29uc3RydWN0b3I6IEd1aSxcblxuICAgIHNldFRleHQ6IGZ1bmN0aW9uICggc2l6ZSwgY29sb3IsIGZvbnQgKSB7XG5cbiAgICAgICAgVG9vbHMuc2V0VGV4dCggc2l6ZSwgY29sb3IsIGZvbnQgKTtcblxuICAgIH0sXG5cbiAgICBoaWRlIDogZnVuY3Rpb24gKGIpIHtcblxuICAgICAgICBpZihiKSB0aGlzLmNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZWxzZSB0aGlzLmNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBzZXRCRyA6IGZ1bmN0aW9uKGMpe1xuXG4gICAgICAgIHRoaXMuYmcgPSBjO1xuXG4gICAgICAgIC8qdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5zZXRCRyhjKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgdGhpcy5pbm5lcnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmJnO1xuICAgICAgICB0aGlzLmJvdHRvbS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5iZztcblxuICAgIH0sXG5cbiAgICBnZXRIVE1MIDogZnVuY3Rpb24oKXtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50O1xuXG4gICAgfSxcblxuICAgIG9uQ2hhbmdlIDogZnVuY3Rpb24oIGYgKXtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuXG4gICAgaGFuZGxlRXZlbnQgOiBmdW5jdGlvbiggZSApIHtcblxuICAgICAgICAvL2UucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5kb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdXQnOiB0aGlzLm91dCggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3Zlcic6IHRoaXMub3ZlciggZSApOyBicmVhaztcbiAgICAgICAgICAgIC8vY2FzZSAnbW91c2V3aGVlbCc6IHRoaXMud2hlZWwoIGUgKTsgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ21vdXNldXAnOiB0aGlzLnVwKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogdGhpcy5tb3ZlKCBlICk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gTW91c2UgZXZlbnRcblxuICAgIGRvd246IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoICFlLnRhcmdldC5uYW1lICkgcmV0dXJuO1xuXG4gICAgICAgIGlmKGUudGFyZ2V0Lm5hbWUgPT09ICdzY3JvbGwnKXtcbiAgICAgICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubW92ZSggZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZS50YXJnZXQubmFtZSA9PT0gJ2JvdHRvbScpe1xuICAgICAgICAgICAgdGhpcy5pc09wZW4gPSB0aGlzLmlzT3BlbiA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYm90dG9tLnRleHRDb250ZW50ID0gdGhpcy5pc09wZW4gPyAnY2xvc2UnIDogJ29wZW4nO1xuICAgICAgICAgICAgdGhpcy50ZXN0SGVpZ2h0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoIXRoaXMuaXNEb3duKSByZXR1cm47XG4gICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmNvbG9ycy5kb3duO1xuICAgICAgICB0aGlzLnVwZGF0ZSggKGUuY2xpZW50WS10aGlzLnRvcCktKHRoaXMuc2gqMC41KSApO1xuXG4gICAgfSxcblxuICAgIFxuXG4gICAgb3V0OiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGlmKCAhZS50YXJnZXQubmFtZSApIHJldHVybjtcblxuICAgICAgICBpZihlLnRhcmdldC5uYW1lID09PSAnc2Nyb2xsJyl7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbC5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5jb2xvcnMuc2Nyb2xsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoZS50YXJnZXQubmFtZSA9PT0gJ2JvdHRvbScpe1xuICAgICAgICAgICAgdGhpcy5ib3R0b20uc3R5bGUuY29sb3IgPSAnI0NDQyc7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cDogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNjcm9sbC5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5jb2xvcnMuc2Nyb2xsO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgfSxcblxuICAgIG92ZXI6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoICFlLnRhcmdldC5uYW1lICkgcmV0dXJuO1xuICAgICAgICBpZihlLnRhcmdldC5uYW1lID09PSAnc2Nyb2xsJyl7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbC5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5jb2xvcnMuc2VsZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmKGUudGFyZ2V0Lm5hbWUgPT09ICdib3R0b20nKXtcbiAgICAgICAgICAgIHRoaXMuYm90dG9tLnN0eWxlLmNvbG9yID0gJyNGRkYnO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gV2hlZWwgZXZlbnRcblxuICAgIHdoZWVsOiBmdW5jdGlvbiAoIGUgKXtcblxuICAgICAgICAvL2UucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmKCB0aGlzLmxvY2t3aGVlbCB8fCAhdGhpcy5pc1Njcm9sbCApIHJldHVybjtcblxuICAgICAgICAvL3RoaXMub25XaGVlbCA9IHRydWU7XG5cbiAgICAgICAgdmFyIHggPSBlLmNsaWVudFg7XG4gICAgICAgIHZhciBweCA9IHRoaXMuY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuXG4gICAgICAgIGlmKHg8cHgpIHJldHVybjtcbiAgICAgICAgaWYoeD4ocHgrdGhpcy53aWR0aCkpIHJldHVybjtcblxuICAgICAgICB2YXIgZGVsdGEgPSAwO1xuICAgICAgICBpZihlLndoZWVsRGVsdGFZKSBkZWx0YSA9IC1lLndoZWVsRGVsdGFZKjAuMDQ7XG4gICAgICAgIGVsc2UgaWYoZS53aGVlbERlbHRhKSBkZWx0YSA9IC1lLndoZWVsRGVsdGEqMC4yO1xuICAgICAgICBlbHNlIGlmKGUuZGV0YWlsKSBkZWx0YSA9IGUuZGV0YWlsKjQuMDtcblxuICAgICAgICB0aGlzLnB5ICs9IGRlbHRhO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCB0aGlzLnB5ICk7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIEFkZCBub2RlIHRvIGd1aVxuXG4gICAgYWRkOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGEgPSBhcmd1bWVudHM7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBhWzFdID09PSAnb2JqZWN0JyApeyBcblxuICAgICAgICAgICAgYVsxXS5pc1VJID0gdHJ1ZTtcbiAgICAgICAgICAgIGFbMV0ubWFpbiA9IHRoaXM7XG5cbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlb2YgYVsxXSA9PT0gJ3N0cmluZycgKXtcblxuICAgICAgICAgICAgaWYoIGFbMl0gPT09IHVuZGVmaW5lZCApIFtdLnB1c2guY2FsbChhLCB7IGlzVUk6dHJ1ZSwgbWFpbjp0aGlzIH0pO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYVsyXS5pc1VJID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhWzJdLm1haW4gPSB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0gXG5cblxuICAgICAgICB2YXIgbiA9IGFkZC5hcHBseSggdGhpcywgYSApO1xuICAgICAgICAvL3ZhciBuID0gVUlMLmFkZCggLi4uYXJncyApO1xuXG4gICAgICAgIHRoaXMudWlzLnB1c2goIG4gKTtcbiAgICAgICAgbi5weSA9IHRoaXMuaDtcblxuICAgICAgICBpZiggIW4uYXV0b1dpZHRoICl7XG4gICAgICAgICAgICB2YXIgeSA9IG4uY1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICBpZiggdGhpcy5wcmV2WSAhPT0geSApe1xuICAgICAgICAgICAgICAgIHRoaXMuY2FsYyggbi5oICsgMSApO1xuICAgICAgICAgICAgICAgIHRoaXMucHJldlkgPSB5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRoaXMucHJldlkgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuY2FsYyggbi5oICsgMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfSxcblxuICAgIC8vIHJlbW92ZSBvbmUgbm9kZVxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiAoIG4gKSB7IFxuXG4gICAgICAgIHZhciBpID0gdGhpcy51aXMuaW5kZXhPZiggbiApOyBcbiAgICAgICAgaWYgKCBpICE9PSAtMSApIHRoaXMudWlzW2ldLmNsZWFyKCk7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbCBhZnRlciB1aXMgY2xlYXJcblxuICAgIGNsZWFyT25lOiBmdW5jdGlvbiAoIG4gKSB7IFxuXG4gICAgICAgIHZhciBpID0gdGhpcy51aXMuaW5kZXhPZiggbiApOyBcbiAgICAgICAgaWYgKCBpICE9PSAtMSApIHtcbiAgICAgICAgICAgIHRoaXMuaW5uZXIucmVtb3ZlQ2hpbGQoIHRoaXMudWlzW2ldLmNbMF0gKTtcbiAgICAgICAgICAgIHRoaXMudWlzLnNwbGljZSggaSwgMSApOyBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIGNsZWFyIGFsbCBndWlcblxuICAgIGNsZWFyOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSkgdGhpcy51aXNbaV0uY2xlYXIoKTtcblxuICAgICAgICB0aGlzLnVpcyA9IFtdO1xuICAgICAgICBUb29scy5saXN0ZW5zID0gW107XG5cbiAgICAgICAgdGhpcy5jYWxjKCAtIHRoaXMuaCApO1xuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBTY3JvbGxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCB5ICl7XG5cbiAgICAgICAgeSA9IHkgPCAwID8gMCA6eTtcbiAgICAgICAgeSA9IHkgPiB0aGlzLnJhbmdlID8gdGhpcy5yYW5nZSA6IHk7XG5cbiAgICAgICAgdGhpcy5pbm5lci5zdHlsZS50b3AgPSAtIE1hdGguZmxvb3IoIHkgLyB0aGlzLnJhdGlvICkgKyAncHgnO1xuICAgICAgICB0aGlzLnNjcm9sbC5zdHlsZS50b3AgPSBNYXRoLmZsb29yKCB5ICkgKyAncHgnO1xuXG4gICAgICAgIHRoaXMucHkgPSB5O1xuXG4gICAgICAgIC8vdGhpcy5vbldoZWVsID0gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgc2hvd1Njcm9sbDpmdW5jdGlvbihoKXtcblxuICAgICAgICB0aGlzLmlzU2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zdyA9IHRoaXMuc2l6ZS5zO1xuXG4gICAgICAgIHRoaXMudG90YWwgPSB0aGlzLmg7XG4gICAgICAgIHRoaXMubWF4VmlldyA9IHRoaXMubWF4SGVpZ2h0Oy8vIC0gdGhpcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5yYXRpbyA9IHRoaXMubWF4VmlldyAvIHRoaXMudG90YWw7XG4gICAgICAgIHRoaXMuc2ggPSB0aGlzLm1heFZpZXcgKiB0aGlzLnJhdGlvO1xuXG4gICAgICAgIGlmKCB0aGlzLnNoIDwgMjAgKSB0aGlzLnNoID0gMjA7XG5cbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMubWF4VmlldyAtIHRoaXMuc2g7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxCRy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgdGhpcy5zY3JvbGxCRy5zdHlsZS5oZWlnaHQgPSB0aGlzLm1heFZpZXcgKyAncHgnO1xuICAgICAgICB0aGlzLnNjcm9sbC5zdHlsZS5oZWlnaHQgPSB0aGlzLnNoICsgJ3B4JztcblxuICAgICAgICBcblxuICAgICAgICB0aGlzLnNldEl0ZW1XaWR0aCggdGhpcy53aWR0aCAtIHRoaXMuc3cgKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSggMCApO1xuXG4gICAgfSxcblxuICAgIGhpZGVTY3JvbGw6ZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmlzU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3cgPSAwO1xuICAgICAgICBcblxuICAgICAgICB0aGlzLnNldEl0ZW1XaWR0aCggdGhpcy53aWR0aCAtIHRoaXMuc3cgKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSggMCApO1xuXG4gICAgICAgIHRoaXMuc2Nyb2xsQkcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgcmVzaXplOmZ1bmN0aW9uKGUpe1xuXG4gICAgICAgIHRoaXMudGVzdEhlaWdodCgpO1xuXG4gICAgfSxcblxuICAgIGNhbGM6ZnVuY3Rpb24oIHkgKSB7XG5cbiAgICAgICAgdGhpcy5oICs9IHk7XG4gICAgICAgIGNsZWFyVGltZW91dCggdGhpcy50bXAgKTtcbiAgICAgICAgdGhpcy50bXAgPSBzZXRUaW1lb3V0KCB0aGlzLnRlc3RIZWlnaHQuYmluZCh0aGlzKSwgMTAgKTtcblxuICAgIH0sXG5cbiAgICB0ZXN0SGVpZ2h0OmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYoIHRoaXMudG1wICkgY2xlYXJUaW1lb3V0KCB0aGlzLnRtcCApO1xuXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy50b3AgKyB0aGlzLmJoO1xuXG4gICAgICAgIGlmKCB0aGlzLmlzT3BlbiApe1xuXG4gICAgICAgICAgICB0aGlzLm1heEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMudG9wIC0gdGhpcy5iaDtcblxuICAgICAgICAgICAgaWYoIHRoaXMuaCA+IHRoaXMubWF4SGVpZ2h0ICl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMubWF4SGVpZ2h0ICsgdGhpcy5iaDtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dTY3JvbGwoKTtcblxuICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuaCArIHRoaXMuYmg7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlU2Nyb2xsKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuYmg7XG4gICAgICAgICAgICB0aGlzLmhpZGVTY3JvbGwoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbm5lckNvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgLSB0aGlzLmJoICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250ZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5ib3R0b20uc3R5bGUudG9wID0gdGhpcy5oZWlnaHQgLSB0aGlzLmJoICsgJ3B4JztcblxuICAgIH0sXG5cbiAgICBzZXRXaWR0aDogZnVuY3Rpb24oIHcgKSB7XG5cbiAgICAgICAgaWYoIHcgKSB0aGlzLndpZHRoID0gdztcbiAgICAgICAgdGhpcy5jb250ZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLndpZHRoKVxuXG5cbiAgICAgICAgaWYoIHRoaXMuaXNDZW50ZXIgKSB0aGlzLmNvbnRlbnQuc3R5bGUubWFyZ2luTGVmdCA9IC0ofn4gKHRoaXMud2lkdGgqMC41KSkgKyAncHgnO1xuXG4gICAgICAgIHRoaXMuc2V0SXRlbVdpZHRoKCB0aGlzLndpZHRoIC0gdGhpcy5zdyApO1xuXG4gICAgICAgIC8qdmFyIGwgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpID0gbDtcbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIHRoaXMudWlzW2ldLnNldFNpemUoIHRoaXMud2lkdGggKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGkgPSBsO1xuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgdGhpcy51aXNbaV0uclNpemUoKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgdGhpcy5yZXNpemUoKTtcblxuICAgIH0sXG5cbiAgICBzZXRJdGVtV2lkdGg6IGZ1bmN0aW9uKCB3ICl7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5zZXRTaXplKCB3ICk7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5yU2l6ZSgpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG5cbn07XG5cbmV4cG9ydCB7IFRvb2xzLCBHdWksIFByb3RvLCBCb29sLCBCdXR0b24sIENpcmN1bGFyLCBDb2xvciwgRnBzLCBHcm91cCwgSm95c3RpY2ssIEtub2IsIExpc3QsIE51bWVyaWMsIFNsaWRlLCBUZXh0SW5wdXQsIFRpdGxlLCBhZGQsIFJFVklTSU9OIH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAvVXNlcnMvbi52aW5heWFrYW4vd29ya3NwYWNlL3VpbC9idWlsZC91aWwubW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9