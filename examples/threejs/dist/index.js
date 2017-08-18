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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
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
const terminal_1 = __webpack_require__(2);
const index_1 = __webpack_require__(6);
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __webpack_require__(3);
const color_1 = __webpack_require__(5);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBrowser = new Function("try {return this===window;}catch(e){ return false;}")();
exports.isWorker = new Function("try {return this===self && typeof importScripts !== 'undefined';}catch(e){return false;}")();
exports.isNode = typeof global !== "undefined" && typeof process !== "undefined" && typeof process.stdout !== "undefined";

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(0)))

/***/ }),
/* 4 */
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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const teapot_1 = __webpack_require__(11);
const orb_1 = __webpack_require__(7);
exports.demos = [
    orb_1.OrbRadeonRaysDemo,
    teapot_1.TeapotDemo,
];


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const demo_1 = __webpack_require__(8);
class OrbRadeonRaysDemo extends demo_1.Demo {
}
OrbRadeonRaysDemo.NAME = "Orb RadeonRays";
exports.OrbRadeonRaysDemo = OrbRadeonRaysDemo;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Demo {
}
exports.Demo = Demo;


/***/ }),
/* 9 */,
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




/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const demo_1 = __webpack_require__(8);
class TeapotDemo extends demo_1.Demo {
}
TeapotDemo.NAME = "Teapot";
exports.TeapotDemo = TeapotDemo;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDUyYzA3Yjg1NGI0N2IxMjY4ZDEiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL3Rlcm1pbmFsLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9lbnYudHMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvY29sb3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW9zL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9kZW1vcy9vcmIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW9zL2RlbW8udHMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy9uLnZpbmF5YWthbi93b3Jrc3BhY2UvdWlsL2J1aWxkL3VpbC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RlbW9zL3RlYXBvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7Ozs7OztBQ3ZM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akg7O0FBRUE7OztBQUdBLHVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0M7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsdUJBQXVCO0FBQ3ZCLHVCQUF1Qjs7QUFFdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUNBQXFDLFdBQVc7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsbUM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsbUM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMO0FB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QixHQUFHO0FBQzdGLDhCQUE4Qiw2Q0FBNkMsZ0JBQWdCLEdBQUc7O0FBRTlGOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQSw2Q0FBNkM7QUFDN0MsNkNBQTZDO0FBQzdDLDRDQUE0QztBQUM1QywyQ0FBMkM7QUFDM0MsNkNBQTZDO0FBQzdDOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTCxDQUFDOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBOztB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0EsS0FB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QztBQUM5QywwQ0FBMEM7QUFDMUM7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBLDZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUEsNEM7QUFDQSxnRTtBQUNBLDhCO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0EsNkNBQTZDO0FBQzdDLHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsOENBQThDO0FBQzlDLDBDQUEwQztBQUMxQzs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBLCtCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLG9FQUFvRSxZQUFZLGlDQUFpQzs7QUFFakg7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7O0FBRUEsc0RBQXNEO0FBQ3RELDREQUE0RDtBQUM1RCxrRUFBa0U7QUFDbEUseURBQXlEO0FBQ3pELG1EQUFtRDtBQUNuRCx5REFBeUQ7QUFDekQsa0VBQWtFO0FBQ2xFLHNEQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsMkZBQTJGO0FBQzNGLHlEQUF5RDtBQUN6RCxpR0FBaUc7QUFDakcseURBQXlEOztBQUV6RDs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHNCOztBQUVBOztBQUVBLG1DOztBQUVBLG9CQUFvQjtBQUNwQjs7QUFFQSxLQUFLLHNDQUFzQzs7QUFFM0M7QUFDQSxtREFBbUQ7O0FBRW5EOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOzs7OztBQUtBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHNFQUFzRSx3QkFBd0IsYUFBYSxPQUFPLFlBQVksaUNBQWlDO0FBQy9KO0FBQ0E7O0FBRUEsd0VBQXdFLE9BQU8sUUFBUSxhQUFhLGlCQUFpQjtBQUNySDs7QUFFQSxpRUFBaUUsT0FBTyxRQUFRLGFBQWEsd0JBQXdCO0FBQ3JIO0FBQ0E7O0FBRUE7QUFDQSxpRUFBaUUsT0FBTyx5QkFBeUIsYUFBYSxpQkFBaUIscUJBQXFCLGNBQWMsd0JBQXdCLDhDQUE4QztBQUN4TztBQUNBOztBQUVBO0FBQ0EseUZBQXlGLFdBQVcsT0FBTyx5QkFBeUIsYUFBYTtBQUNqSjs7QUFFQSxpRUFBaUUsVUFBVSxVQUFVLFFBQVEsaUNBQWlDLGlDQUFpQyxtQkFBbUIscUJBQXFCLGdCQUFnQixzQkFBc0IsK0JBQStCLDhDQUE4QztBQUMxVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSx5REFBeUQsZUFBZTtBQUN4RSxrREFBa0QsZ0JBQWdCOztBQUVsRTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MsaURBQWlEOztBQUVqRCx5Q0FBeUM7QUFDekMsNkNBQTZDO0FBQzdDOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOzs7O0FBSUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHVDOztBQUVBO0FBQ0E7O0FBRUEsU0FBUzs7QUFFVCxzREFBc0QsdUJBQXVCO0FBQzdFO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFM7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQSw0Qjs7QUFFQSxzQztBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUEsOEI7O0FBRUEsc0M7QUFDQTtBQUNBO0FBQ0Esb0M7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7O0FBSUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQTtBQUNBOzs7QUFHQTs7QUFFQTs7QUFFQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBOztBQUVBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUzs7QUFFVDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDs7QUFFQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7O0FBR0w7O0FBRVE7Ozs7Ozs7Ozs7QUM3dElSLHNDQUE4QjtBQUM5QixnQkFBd0IsU0FBUSxXQUFJOztBQUN6QixlQUFJLEdBQVUsUUFBUSxDQUFDO0FBRGxDLGdDQUVDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDUyYzA3Yjg1NGI0N2IxMjY4ZDEiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFRlcm1pbmFsIH0gZnJvbSAnLi91dGlscy90ZXJtaW5hbCc7XG5pbXBvcnQgeyBkZW1vcyB9IGZyb20gXCIuL2RlbW9zL2luZGV4XCJcbmltcG9ydCAqIGFzIFVJTCBmcm9tIFwiLi4vLi4vLi4vLi4vdWlsXCI7XG5leHBvcnQgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBjcmVhdGVHVUkoKTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRGVtbyhkZW1vKSB7XG4gICAgY29uc29sZS5sb2coZGVtbyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUdVSSgpIHtcbiAgICBjb25zdCBkZW1vTGlzdCA9IGRlbW9zLm1hcChkZW1vID0+ICh7bGFiZWw6ZGVtby5OQU1FLCBjbGFzczpkZW1vfSkpO1xuICAgIFRlcm1pbmFsLmluZm8oXCJDcmVhdGluZyBHVUlcIik7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5tYXJnaW4gPSBcIjBcIjtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzE0MTQxNFwiO1xuICAgIHZhciB1aTphbnkgPSBuZXcgVUlMLkd1aSggeyBjc3M6J3RvcDoxMHB4OyBsZWZ0OjEzMHB4OycsIHNpemU6MzAwLCBjZW50ZXI6dHJ1ZSB9ICk7XG4gICAgdWkuYWRkKCd0aXRsZScsIHsgbmFtZTonUmFkZW9uUmF5cyArIFRocmVlLmpzJ30pO1xuICAgIHVpLmFkZCgnbGlzdCcsIHsgbmFtZTonRGVtbycsIGNhbGxiYWNrOmNoYW5nZURlbW8sIGxpc3Q6ZGVtb0xpc3R9KTtcbn1cblxubWFpbigpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXgudHMiLCJpbXBvcnQge2lzTm9kZX0gZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQge0NvbG9yLCBIZXhDb2xvcn0gZnJvbSBcIi4vY29sb3JcIjtcbi8qKlxuICogQ3JlYXRlZCBieSBuLnZpbmF5YWthbiBvbiAwNi4wNi4xNy5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlcm1pbmFsIHtcblxuICAgIHN0YXRpYyBzaWxlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBzdGF0aWMgaGlzdG9yeTogc3RyaW5nID0gXCJcIjtcbiAgICBzdGF0aWMgYnJvd3NlclN0eWxlcyA9IHtcbiAgICAgICAgdGV4dDogSGV4Q29sb3JbQ29sb3IuREVGQVVMVF9URVhUXSxcbiAgICAgICAgYmFja2dyb3VuZDogSGV4Q29sb3JbQ29sb3IuREVGQVVMVF9CR10sXG4gICAgICAgIGJvbGQ6IGZhbHNlXG4gICAgfTtcbiAgICBzdGF0aWMgYnJvd3NlckJ1ZmZlciA9IFtdO1xuXG4gICAgc3RhdGljIGxvZyh0ZXh0KSB7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKHRleHQgKyBcIlxcblwiKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgd3JpdGUodGV4dCkge1xuICAgICAgICBUZXJtaW5hbC5oaXN0b3J5ICs9IHRleHQ7XG4gICAgICAgIGlmIChUZXJtaW5hbC5zaWxlbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSh0ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRzID0gW107XG4gICAgICAgICAgICAgICAgbGV0IHN0eWxlcyA9IFtdO1xuICAgICAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJCdWZmZXIuZm9yRWFjaChsb2cgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0cy5wdXNoKGxvZy50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzLnB1c2gobG9nLnN0eWxlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShudWxsLCBbdGV4dHMuam9pbihcIlwiKV0uY29uY2F0KHN0eWxlcykgKTtcbiAgICAgICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyQnVmZmVyID0gW107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJCdWZmZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGAlYyR7dGV4dH1gLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZTogYGJhY2tncm91bmQ6ICR7VGVybWluYWwuYnJvd3NlclN0eWxlcy5iYWNrZ3JvdW5kfTtgICtcbiAgICAgICAgICAgICAgICAgICAgYGNvbG9yOiAke1Rlcm1pbmFsLmJyb3dzZXJTdHlsZXMudGV4dH07YCArXG4gICAgICAgICAgICAgICAgICAgIGBmb250LXdlaWdodDogJHtUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJvbGQgPyBcIjcwMFwiIDogXCIxMDBcIn07YFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgdGltZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFUZXJtaW5hbC5zaWxlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUudGltZShuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyB0aW1lRW5kKG5hbWU6IHN0cmluZykge1xuICAgICAgICBpZiAoIVRlcm1pbmFsLnNpbGVudCkge1xuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJHQ29sb3IoY29sb3IpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3Rkb3V0LmlzVFRZKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFxceDFCWzQ4OzU7JHtjb2xvciA9PT0gbnVsbCA/IFwiXCIgOiBjb2xvcn1tYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJhY2tncm91bmQgPSBIZXhDb2xvcltjb2xvcl07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0VGV4dENvbG9yKGNvbG9yKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLnN0ZG91dC5pc1RUWSkge1xuICAgICAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKGBcXHgxQlszODs1OyR7Y29sb3J9bWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgVGVybWluYWwuYnJvd3NlclN0eWxlcy50ZXh0ID0gSGV4Q29sb3JbY29sb3JdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHNldEJvbGRUZXh0KCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5zdGRvdXQuaXNUVFkpIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShgXFx4MUJbMzg7MW1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFRlcm1pbmFsLmJyb3dzZXJTdHlsZXMuYm9sZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgY2xlYXJDb2xvcigpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgICAgaWYgKHByb2Nlc3Muc3Rkb3V0LmlzVFRZKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYFxceDFCWzBtYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLnRleHQgPSBIZXhDb2xvcltDb2xvci5ERUZBVUxUX1RFWFRdO1xuICAgICAgICAgICAgVGVybWluYWwuYnJvd3NlclN0eWxlcy5iYWNrZ3JvdW5kID0gXCJub25lXCI7XG4gICAgICAgICAgICBUZXJtaW5hbC5icm93c2VyU3R5bGVzLmJvbGQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXRpYyBlcnJvcihjb250ZW50OiBFcnJvciB8IHN0cmluZykge1xuICAgICAgICBUZXJtaW5hbC5zZXRCR0NvbG9yKENvbG9yLlJFRCk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5XSElURSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIEVSUk9SIFwiKTtcbiAgICAgICAgVGVybWluYWwuY2xlYXJDb2xvcigpO1xuICAgICAgICBUZXJtaW5hbC5zZXRUZXh0Q29sb3IoQ29sb3IuUkVEKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIHdhcm4oY29udGVudDogYW55KSB7XG4gICAgICAgIFRlcm1pbmFsLnNldEJHQ29sb3IoQ29sb3IuT1JBTkdFKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLldISVRFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgV0FSTklORyBcIik7XG4gICAgICAgIFRlcm1pbmFsLmNsZWFyQ29sb3IoKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLk9SQU5HRSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIFwiKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUodHlwZW9mIGNvbnRlbnQgIT09IFwic3RyaW5nXCIgPyBKU09OLnN0cmluZ2lmeShjb250ZW50KSA6IGNvbnRlbnQpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZShcIlxcblwiKTtcbiAgICAgICAgVGVybWluYWwuY2xlYXJDb2xvcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBzdWNjZXNzKGNvbnRlbnQ6IGFueSkge1xuICAgICAgICBUZXJtaW5hbC5zZXRCR0NvbG9yKENvbG9yLkdSRUVOKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLldISVRFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgU1VDQ0VTUyBcIik7XG4gICAgICAgIFRlcm1pbmFsLmNsZWFyQ29sb3IoKTtcbiAgICAgICAgVGVybWluYWwuc2V0VGV4dENvbG9yKENvbG9yLkdSRUVOKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxuXG4gICAgc3RhdGljIGluZm8oY29udGVudDogYW55KSB7XG4gICAgICAgIFRlcm1pbmFsLnNldEJHQ29sb3IoQ29sb3IuQkxVRSk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5XSElURSk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiIElORk8gXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgICAgIFRlcm1pbmFsLnNldFRleHRDb2xvcihDb2xvci5CTFVFKTtcbiAgICAgICAgVGVybWluYWwud3JpdGUoXCIgXCIpO1xuICAgICAgICBUZXJtaW5hbC53cml0ZSh0eXBlb2YgY29udGVudCAhPT0gXCJzdHJpbmdcIiA/IEpTT04uc3RyaW5naWZ5KGNvbnRlbnQpIDogY29udGVudCk7XG4gICAgICAgIFRlcm1pbmFsLndyaXRlKFwiXFxuXCIpO1xuICAgICAgICBUZXJtaW5hbC5jbGVhckNvbG9yKCk7XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzL3Rlcm1pbmFsLnRzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IG4udmluYXlha2FuIG9uIDA2LjA2LjE3LlxuICovXG4vL3RzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZXhwb3J0IGNvbnN0IGlzQnJvd3NlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT13aW5kb3c7fWNhdGNoKGUpeyByZXR1cm4gZmFsc2U7fVwiKSgpO1xuLy90c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmV4cG9ydCBjb25zdCBpc1dvcmtlciA9IG5ldyBGdW5jdGlvbihcInRyeSB7cmV0dXJuIHRoaXM9PT1zZWxmICYmIHR5cGVvZiBpbXBvcnRTY3JpcHRzICE9PSAndW5kZWZpbmVkJzt9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlO31cIikoKTtcbi8vdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5leHBvcnQgY29uc3QgaXNOb2RlID0gdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgcHJvY2Vzcy5zdGRvdXQgIT09IFwidW5kZWZpbmVkXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvZW52LnRzIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKlxuICogQ3JlYXRlZCBieSBuLnZpbmF5YWthbiBvbiAwNi4wNi4xNy5cbiAqL1xuZXhwb3J0IGNvbnN0IENvbG9yID0ge1xuICAgIERFRkFVTFRfVEVYVDogMTIsXG4gICAgREVGQVVMVF9CRzogOCxcbiAgICBCTEFDSzogMCxcbiAgICBXSElURTogMjU1LFxuICAgIEJPTEQ6IDEsXG4gICAgUkVEOiAxLFxuICAgIEdSRUVOOiAyLFxuICAgIFlFTExPVzogMyxcbiAgICBCTFVFOiA0LFxuICAgIE1BR0VOVEE6IDUsXG4gICAgT1JBTkdFOiAyMDgsXG59O1xuXG5jb25zdCBoZXhDb2xvciA9IHt9O1xuaGV4Q29sb3JbQ29sb3IuREVGQVVMVF9URVhUXSA9IFwiIzAwMDAwMFwiO1xuaGV4Q29sb3JbQ29sb3IuREVGQVVMVF9CR10gPSBcIiNGRkZGRkZcIjtcbmhleENvbG9yW0NvbG9yLkJMQUNLXSA9IFwiIzAwMDAwMFwiO1xuaGV4Q29sb3JbQ29sb3IuV0hJVEVdID0gXCIjRkZGRkZGXCI7XG5oZXhDb2xvcltDb2xvci5CT0xEXSA9IFwiXCI7XG5oZXhDb2xvcltDb2xvci5SRURdID0gXCIjRkYwMDAwXCI7XG5oZXhDb2xvcltDb2xvci5HUkVFTl0gPSBcIiMwMEZGMDBcIjtcbmhleENvbG9yW0NvbG9yLkJMVUVdID0gXCIjNGJhZGZmXCI7XG5oZXhDb2xvcltDb2xvci5ZRUxMT1ddID0gXCIjRkZGNjAwXCI7XG5oZXhDb2xvcltDb2xvci5NQUdFTlRBXSA9IFwiI0ZGMDBGRlwiO1xuaGV4Q29sb3JbQ29sb3IuT1JBTkdFXSA9IFwiI0ZGOEMwMFwiO1xuZXhwb3J0IGNvbnN0IEhleENvbG9yID0gaGV4Q29sb3I7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvY29sb3IudHMiLCJpbXBvcnQgeyBUZWFwb3REZW1vIH0gZnJvbSAnLi90ZWFwb3QnO1xuaW1wb3J0IHsgT3JiUmFkZW9uUmF5c0RlbW8gfSBmcm9tICcuL29yYic7XG5leHBvcnQgY29uc3QgZGVtb3MgPSBbXG4gICAgT3JiUmFkZW9uUmF5c0RlbW8sXG4gICAgVGVhcG90RGVtbyxcbl07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVtb3MvaW5kZXgudHMiLCJpbXBvcnQgeyBEZW1vIH0gZnJvbSAnLi9kZW1vJztcbmV4cG9ydCBjbGFzcyBPcmJSYWRlb25SYXlzRGVtbyBleHRlbmRzIERlbW8ge1xuICAgIHN0YXRpYyBOQU1FOnN0cmluZyA9IFwiT3JiIFJhZGVvblJheXNcIjtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZGVtb3Mvb3JiLnRzIiwiZXhwb3J0IGNsYXNzIERlbW8ge1xuICAgIFxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kZW1vcy9kZW1vLnRzIiwiLy8gUG9seWZpbGxzXG5cbmlmICggTnVtYmVyLkVQU0lMT04gPT09IHVuZGVmaW5lZCApIHtcblxuXHROdW1iZXIuRVBTSUxPTiA9IE1hdGgucG93KCAyLCAtIDUyICk7XG5cbn1cblxuLy9cblxuaWYgKCBNYXRoLnNpZ24gPT09IHVuZGVmaW5lZCApIHtcblxuXHQvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXRoL3NpZ25cblxuXHRNYXRoLnNpZ24gPSBmdW5jdGlvbiAoIHggKSB7XG5cblx0XHRyZXR1cm4gKCB4IDwgMCApID8gLSAxIDogKCB4ID4gMCApID8gMSA6ICsgeDtcblxuXHR9O1xuXG59XG5cbmlmICggRnVuY3Rpb24ucHJvdG90eXBlLm5hbWUgPT09IHVuZGVmaW5lZCApIHtcblxuXHQvLyBNaXNzaW5nIGluIElFOS0xMS5cblx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vbmFtZVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSggRnVuY3Rpb24ucHJvdG90eXBlLCAnbmFtZScsIHtcblxuXHRcdGdldDogZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRyZXR1cm4gdGhpcy50b1N0cmluZygpLm1hdGNoKCAvXlxccypmdW5jdGlvblxccyooW15cXChcXHNdKikvIClbIDEgXTtcblxuXHRcdH1cblxuXHR9ICk7XG5cbn1cblxuaWYgKCBPYmplY3QuYXNzaWduID09PSB1bmRlZmluZWQgKSB7XG5cblx0Ly8gTWlzc2luZyBpbiBJRS5cblx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuXG5cdCggZnVuY3Rpb24gKCkge1xuXG5cdFx0T2JqZWN0LmFzc2lnbiA9IGZ1bmN0aW9uICggdGFyZ2V0ICkge1xuXG5cdFx0XHQndXNlIHN0cmljdCc7XG5cblx0XHRcdGlmICggdGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsICkge1xuXG5cdFx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoICdDYW5ub3QgY29udmVydCB1bmRlZmluZWQgb3IgbnVsbCB0byBvYmplY3QnICk7XG5cblx0XHRcdH1cblxuXHRcdFx0dmFyIG91dHB1dCA9IE9iamVjdCggdGFyZ2V0ICk7XG5cblx0XHRcdGZvciAoIHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXggKysgKSB7XG5cblx0XHRcdFx0dmFyIHNvdXJjZSA9IGFyZ3VtZW50c1sgaW5kZXggXTtcblxuXHRcdFx0XHRpZiAoIHNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIHNvdXJjZSAhPT0gbnVsbCApIHtcblxuXHRcdFx0XHRcdGZvciAoIHZhciBuZXh0S2V5IGluIHNvdXJjZSApIHtcblxuXHRcdFx0XHRcdFx0aWYgKCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoIHNvdXJjZSwgbmV4dEtleSApICkge1xuXG5cdFx0XHRcdFx0XHRcdG91dHB1dFsgbmV4dEtleSBdID0gc291cmNlWyBuZXh0S2V5IF07XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG91dHB1dDtcblxuXHRcdH07XG5cblx0fSApKCk7XG5cbn1cblxuLyoqXG4gKiBAYXV0aG9yIGxvLXRoIC8gaHR0cHM6Ly9naXRodWIuY29tL2xvLXRoXG4gKi9cblxudmFyIFRvb2xzID0ge1xuXG4gICAgbWFpbjogbnVsbCxcblxuICAgIGRvYzogZG9jdW1lbnQsXG4gICAgZnJhZzogZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxuXG4gICAgVVJMOiB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwsXG5cbiAgICBpc0xvb3A6IGZhbHNlLFxuICAgIGxpc3RlbnM6IFtdLFxuXG4gICAgc3ZnbnM6IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICBodG1sczogXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsXG5cbiAgICBET01fU0laRTogWyAnaGVpZ2h0JywgJ3dpZHRoJywgJ3RvcCcsICdsZWZ0JywgJ2JvdHRvbScsICdyaWdodCcsICdtYXJnaW4tbGVmdCcsICdtYXJnaW4tcmlnaHQnLCAnbWFyZ2luLXRvcCcsICdtYXJnaW4tYm90dG9tJ10sXG4gICAgU1ZHX1RZUEVfRDogWyAncGF0dGVybicsICdkZWZzJywgJ3RyYW5zZm9ybScsICdzdG9wJywgJ2FuaW1hdGUnLCAncmFkaWFsR3JhZGllbnQnLCAnbGluZWFyR3JhZGllbnQnLCAnYW5pbWF0ZU1vdGlvbicgXSxcbiAgICBTVkdfVFlQRV9HOiBbICdyZWN0JywgJ2NpcmNsZScsICdwYXRoJywgJ3BvbHlnb24nLCAndGV4dCcsICdnJywgJ2xpbmUnLCAnZm9yZWlnbk9iamVjdCcgXSxcblxuICAgIHNpemU6IHtcbiAgICAgICAgXG4gICAgICAgIHc6IDI0MCxcbiAgICAgICAgaDogMjAsXG4gICAgICAgIHA6IDMwLFxuICAgICAgICBzOiAyMCxcblxuICAgIH0sXG5cbiAgICAvLyBjb2xvcnNcblxuICAgIGNvbG9yczoge1xuXG4gICAgICAgIHRleHQgOiAnI0MwQzBDMCcsXG4gICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDQ0LDQ0LDQ0LDAuMyknLFxuXG4gICAgICAgIGJvcmRlciA6ICcjNGY0ZjRmJyxcbiAgICAgICAgYm9yZGVyU2VsZWN0IDogJyMzMDhBRkYnLFxuXG4gICAgICAgIGJ1dHRvbiA6ICcjNDA0MDQwJyxcbiAgICAgICAgYm9vbGJnIDogJyMxODE4MTgnLFxuXG4gICAgICAgIHNlbGVjdCA6ICcjMzA4QUZGJyxcbiAgICAgICAgbW92aW5nIDogJyMwM2FmZmYnLFxuICAgICAgICBkb3duIDogJyMwMjQ2OTknLFxuXG4gICAgICAgIHN0cm9rZTogJyM2MDYwNjAnLC8vJ3JnYmEoMTIwLDEyMCwxMjAsMC42KScsXG4gICAgICAgIHNjcm9sbDogJyMzMzMzMzMnLFxuXG4gICAgfSxcblxuICAgIC8vIHN0eWxlIGNzc1xuXG4gICAgY3NzIDoge1xuICAgICAgICBiYXNpYzogJy1vLXVzZXItc2VsZWN0Om5vbmU7IC1tcy11c2VyLXNlbGVjdDpub25lOyAta2h0bWwtdXNlci1zZWxlY3Q6bm9uZTsgLXdlYmtpdC11c2VyLXNlbGVjdDpub25lOyAtbW96LXVzZXItc2VsZWN0Om5vbmU7JyArICdwb3NpdGlvbjphYnNvbHV0ZTsgcG9pbnRlci1ldmVudHM6bm9uZTsgYm94LXNpemluZzpib3JkZXItYm94OyBtYXJnaW46MDsgcGFkZGluZzowOyBib3JkZXI6bm9uZTsgb3ZlcmZsb3c6aGlkZGVuOyBiYWNrZ3JvdW5kOm5vbmU7JyxcbiAgICB9LFxuXG4gICAgLy8gc3ZnIHBhdGhcblxuICAgIEdQQVRIOiAnTSA3IDcgTCA3IDggOCA4IDggNyA3IDcgTSA1IDcgTCA1IDggNiA4IDYgNyA1IDcgTSAzIDcgTCAzIDggNCA4IDQgNyAzIDcgTSA3IDUgTCA3IDYgOCA2IDggNSA3IDUgTSA2IDYgTCA2IDUgNSA1IDUgNiA2IDYgTSA3IDMgTCA3IDQgOCA0IDggMyA3IDMgTSA2IDQgTCA2IDMgNSAzIDUgNCA2IDQgTSAzIDUgTCAzIDYgNCA2IDQgNSAzIDUgTSAzIDMgTCAzIDQgNCA0IDQgMyAzIDMgWicsXG5cbiAgICBzZXRUZXh0IDogZnVuY3Rpb24oIHNpemUsIGNvbG9yLCBmb250ICl7XG5cbiAgICAgICAgc2l6ZSA9IHNpemUgfHwgMTE7XG4gICAgICAgIGNvbG9yID0gY29sb3IgfHwgJyNDQ0MnO1xuICAgICAgICBmb250ID0gZm9udCB8fCAnXCJDb25zb2xhc1wiLCBcIkx1Y2lkYSBDb25zb2xlXCIsIE1vbmFjbywgbW9ub3NwYWNlJztcblxuICAgICAgICBUb29scy5jb2xvcnMudGV4dCA9IGNvbG9yO1xuXG4gICAgICAgIFRvb2xzLmNzcy50eHQgPSBUb29scy5jc3MuYmFzaWMgKyAnZm9udC1mYW1pbHk6Jytmb250Kyc7IGZvbnQtc2l6ZTonK3NpemUrJ3B4OyBjb2xvcjonK2NvbG9yKyc7IHBhZGRpbmc6MnB4IDEwcHg7IGxlZnQ6MDsgdG9wOjJweDsgaGVpZ2h0OjE2cHg7IHdpZHRoOjEwMHB4OyBvdmVyZmxvdzpoaWRkZW47IHdoaXRlLXNwYWNlOiBub3dyYXA7JztcbiAgICAgICAgVG9vbHMuY3NzLnR4dGVkaXQgPSBUb29scy5jc3MudHh0ICsgJ3BvaW50ZXItZXZlbnRzOmF1dG87IHBhZGRpbmc6MnB4IDVweDsgb3V0bGluZTpub25lOyAtd2Via2l0LWFwcGVhcmFuY2U6bm9uZTsgLW1vei1hcHBlYXJhbmNlOm5vbmU7IGJvcmRlcjoxcHggZGFzaGVkICM0ZjRmNGY7IC1tcy11c2VyLXNlbGVjdDplbGVtZW50Oyc7XG4gICAgICAgIFRvb2xzLmNzcy50eHRzZWxlY3QgPSBUb29scy5jc3MudHh0ICsgJ3BvaW50ZXItZXZlbnRzOmF1dG87IHBhZGRpbmc6MnB4IDVweDsgb3V0bGluZTpub25lOyAtd2Via2l0LWFwcGVhcmFuY2U6bm9uZTsgLW1vei1hcHBlYXJhbmNlOm5vbmU7IGJvcmRlcjoxcHggZGFzaGVkICcgKyBUb29scy5jb2xvcnMuYm9yZGVyKyc7IC1tcy11c2VyLXNlbGVjdDplbGVtZW50Oyc7XG4gICAgICAgIFRvb2xzLmNzcy50eHRudW1iZXIgPSBUb29scy5jc3MudHh0ICsgJ2xldHRlci1zcGFjaW5nOi0xcHg7IHBhZGRpbmc6MnB4IDVweDsnO1xuICAgICAgICBUb29scy5jc3MuaXRlbSA9IFRvb2xzLmNzcy50eHQgKyAncG9zaXRpb246cmVsYXRpdmU7IGJhY2tncm91bmQ6cmdiYSgwLDAsMCwwLjIpOyBtYXJnaW4tYm90dG9tOjFweDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7JztcblxuICAgIH0sXG5cbiAgICBzZXRTdmc6IGZ1bmN0aW9uKCBkb20sIHR5cGUsIHZhbHVlLCBpZCApe1xuXG4gICAgICAgIGlmKCBpZCA9PT0gLTEgKSBkb20uc2V0QXR0cmlidXRlTlMoIG51bGwsIHR5cGUsIHZhbHVlICk7XG4gICAgICAgIGVsc2UgZG9tLmNoaWxkTm9kZXNbIGlkIHx8IDAgXS5zZXRBdHRyaWJ1dGVOUyggbnVsbCwgdHlwZSwgdmFsdWUgKTtcblxuICAgIH0sXG5cbiAgICBzZXQ6IGZ1bmN0aW9uKCBnLCBvICl7XG5cbiAgICAgICAgZm9yKCB2YXIgYXR0IGluIG8gKXtcbiAgICAgICAgICAgIGlmKCBhdHQgPT09ICd0eHQnICkgZy50ZXh0Q29udGVudCA9IG9bIGF0dCBdO1xuICAgICAgICAgICAgZy5zZXRBdHRyaWJ1dGVOUyggbnVsbCwgYXR0LCBvWyBhdHQgXSApO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKCBkb20sIGlkICl7XG5cbiAgICAgICAgaWYoIGlkID09PSB1bmRlZmluZWQgKSByZXR1cm4gZG9tOyAvLyByb290XG4gICAgICAgIGVsc2UgaWYoICFpc05hTiggaWQgKSApIHJldHVybiBkb20uY2hpbGROb2Rlc1sgaWQgXTsgLy8gZmlyc3QgY2hpbGRcbiAgICAgICAgZWxzZSBpZiggaWQgaW5zdGFuY2VvZiBBcnJheSApe1xuICAgICAgICAgICAgaWYoaWQubGVuZ3RoID09PSAyKSByZXR1cm4gZG9tLmNoaWxkTm9kZXNbIGlkWzBdIF0uY2hpbGROb2Rlc1sgaWRbMV0gXTtcbiAgICAgICAgICAgIGlmKGlkLmxlbmd0aCA9PT0gMykgcmV0dXJuIGRvbS5jaGlsZE5vZGVzWyBpZFswXSBdLmNoaWxkTm9kZXNbIGlkWzFdIF0uY2hpbGROb2Rlc1sgaWRbMl0gXTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qc2V0RG9tIDogZnVuY3Rpb24oIGRvbSwgdHlwZSwgdmFsdWUgKXtcblxuICAgICAgICB2YXIgZXh0ID0gVG9vbHMuRE9NX1NJWkUuaW5kZXhPZih0eXBlKSAhPT0gLTEgPyAncHgnIDogJyc7XG4gICAgICAgIGRvbS5zdHlsZVt0eXBlXSA9IHZhbHVlICsgZXh0O1xuXG4gICAgfSwqL1xuXG4gICAgZG9tIDogZnVuY3Rpb24gKCB0eXBlLCBjc3MsIG9iaiwgZG9tLCBpZCApIHtcblxuICAgICAgICB0eXBlID0gdHlwZSB8fCAnZGl2JztcblxuICAgICAgICBpZiggVG9vbHMuU1ZHX1RZUEVfRC5pbmRleE9mKHR5cGUpICE9PSAtMSB8fCBUb29scy5TVkdfVFlQRV9HLmluZGV4T2YodHlwZSkgIT09IC0xICl7IC8vIGlzIHN2ZyBlbGVtZW50XG5cbiAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgc3ZnIGlmIG5vdCBkZWZcbiAgICAgICAgICAgIGlmKCBkb20gPT09IHVuZGVmaW5lZCApIGRvbSA9IFRvb2xzLmRvYy5jcmVhdGVFbGVtZW50TlMoIFRvb2xzLnN2Z25zLCAnc3ZnJyApO1xuXG4gICAgICAgICAgICBUb29scy5hZGRBdHRyaWJ1dGVzKCBkb20sIHR5cGUsIG9iaiwgaWQgKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgeyAvLyBpcyBodG1sIGVsZW1lbnRcblxuICAgICAgICAgICAgaWYoIGRvbSA9PT0gdW5kZWZpbmVkICkgZG9tID0gVG9vbHMuZG9jLmNyZWF0ZUVsZW1lbnROUyggVG9vbHMuaHRtbHMsIHR5cGUgKTtcbiAgICAgICAgICAgIGVsc2UgZG9tID0gZG9tLmFwcGVuZENoaWxkKCBUb29scy5kb2MuY3JlYXRlRWxlbWVudE5TKCBUb29scy5odG1scywgdHlwZSApICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBjc3MgKSBkb20uc3R5bGUuY3NzVGV4dCA9IGNzczsgXG5cbiAgICAgICAgaWYoIGlkID09PSB1bmRlZmluZWQgKSByZXR1cm4gZG9tO1xuICAgICAgICBlbHNlIHJldHVybiBkb20uY2hpbGROb2Rlc1sgaWQgfHwgMCBdO1xuXG4gICAgfSxcblxuICAgIGFkZEF0dHJpYnV0ZXMgOiBmdW5jdGlvbiggZG9tLCB0eXBlLCBvLCBpZCApe1xuXG4gICAgICAgIHZhciBnID0gVG9vbHMuZG9jLmNyZWF0ZUVsZW1lbnROUyggVG9vbHMuc3ZnbnMsIHR5cGUgKTtcbiAgICAgICAgVG9vbHMuc2V0KCBnLCBvICk7XG4gICAgICAgIFRvb2xzLmdldCggZG9tLCBpZCApLmFwcGVuZENoaWxkKCBnICk7XG4gICAgICAgIGlmKCBUb29scy5TVkdfVFlQRV9HLmluZGV4T2YodHlwZSkgIT09IC0xICkgZy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgICAgICByZXR1cm4gZztcblxuICAgIH0sXG5cbiAgICBjbGVhciA6IGZ1bmN0aW9uKCBkb20gKXtcblxuICAgICAgICBUb29scy5wdXJnZSggZG9tICk7XG4gICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgaWYgKCBkb20uZmlyc3RDaGlsZC5maXJzdENoaWxkICkgVG9vbHMuY2xlYXIoIGRvbS5maXJzdENoaWxkICk7XG4gICAgICAgICAgICBkb20ucmVtb3ZlQ2hpbGQoIGRvbS5maXJzdENoaWxkICk7IFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgcHVyZ2UgOiBmdW5jdGlvbiAoIGRvbSApIHtcblxuICAgICAgICB2YXIgYSA9IGRvbS5hdHRyaWJ1dGVzLCBpLCBuO1xuICAgICAgICBpZiAoYSkge1xuICAgICAgICAgICAgaSA9IGEubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgICAgICBuID0gYVtpXS5uYW1lO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZG9tW25dID09PSAnZnVuY3Rpb24nKSBkb21bbl0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGEgPSBkb20uY2hpbGROb2RlcztcbiAgICAgICAgaWYgKGEpIHtcbiAgICAgICAgICAgIGkgPSBhLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlKGktLSl7IFxuICAgICAgICAgICAgICAgIFRvb2xzLnB1cmdlKCBkb20uY2hpbGROb2Rlc1tpXSApOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxuXG5cbiAgICAvLyBMT09QXG5cbiAgICBsb29wIDogZnVuY3Rpb24oKXtcblxuICAgICAgICBpZiggVG9vbHMuaXNMb29wICkgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCBUb29scy5sb29wICk7XG4gICAgICAgIFRvb2xzLnVwZGF0ZSgpO1xuXG4gICAgfSxcblxuICAgIHVwZGF0ZSA6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGkgPSBUb29scy5saXN0ZW5zLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKSBUb29scy5saXN0ZW5zW2ldLmxpc3RlbmluZygpO1xuXG4gICAgfSxcblxuICAgIHJlbW92ZUxpc3RlbiA6IGZ1bmN0aW9uICggcHJvdG8gKXtcblxuICAgICAgICB2YXIgaWQgPSBUb29scy5saXN0ZW5zLmluZGV4T2YoIHByb3RvICk7XG4gICAgICAgIFRvb2xzLmxpc3RlbnMuc3BsaWNlKGlkLCAxKTtcblxuICAgICAgICBpZiggVG9vbHMubGlzdGVucy5sZW5ndGggPT09IDAgKSBUb29scy5pc0xvb3AgPSBmYWxzZTtcblxuICAgIH0sXG5cbiAgICBhZGRMaXN0ZW4gOiBmdW5jdGlvbiAoIHByb3RvICl7XG5cbiAgICAgICAgdmFyIGlkID0gVG9vbHMubGlzdGVucy5pbmRleE9mKCBwcm90byApO1xuXG4gICAgICAgIGlmKCBpZCAhPT0gLTEgKSByZXR1cm47IFxuXG4gICAgICAgIFRvb2xzLmxpc3RlbnMucHVzaCggcHJvdG8gKTtcblxuICAgICAgICBpZiggIVRvb2xzLmlzTG9vcCApe1xuICAgICAgICAgICAgVG9vbHMuaXNMb29wID0gdHJ1ZTtcbiAgICAgICAgICAgIFRvb2xzLmxvb3AoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyAgIENvbG9yIGZ1bmN0aW9uXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgQ29sb3JMdW1hIDogZnVuY3Rpb24gKCBoZXgsIGx1bSApIHtcblxuICAgICAgICAvLyB2YWxpZGF0ZSBoZXggc3RyaW5nXG4gICAgICAgIGhleCA9IFN0cmluZyhoZXgpLnJlcGxhY2UoL1teMC05YS1mXS9naSwgJycpO1xuICAgICAgICBpZiAoaGV4Lmxlbmd0aCA8IDYpIHtcbiAgICAgICAgICAgIGhleCA9IGhleFswXStoZXhbMF0raGV4WzFdK2hleFsxXStoZXhbMl0raGV4WzJdO1xuICAgICAgICB9XG4gICAgICAgIGx1bSA9IGx1bSB8fCAwO1xuXG4gICAgICAgIC8vIGNvbnZlcnQgdG8gZGVjaW1hbCBhbmQgY2hhbmdlIGx1bWlub3NpdHlcbiAgICAgICAgdmFyIHJnYiA9IFwiI1wiLCBjLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBjID0gcGFyc2VJbnQoaGV4LnN1YnN0cihpKjIsMiksIDE2KTtcbiAgICAgICAgICAgIGMgPSBNYXRoLnJvdW5kKE1hdGgubWluKE1hdGgubWF4KDAsIGMgKyAoYyAqIGx1bSkpLCAyNTUpKS50b1N0cmluZygxNik7XG4gICAgICAgICAgICByZ2IgKz0gKFwiMDBcIitjKS5zdWJzdHIoYy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJnYjtcblxuICAgIH0sXG5cbiAgICBmaW5kRGVlcEludmVyOiBmdW5jdGlvbiggcmdiICl7IFxuXG4gICAgICAgIHJldHVybiAocmdiWzBdICogMC4zICsgcmdiWzFdICogLjU5ICsgcmdiWzJdICogLjExKSA8PSAwLjY7XG4gICAgICAgIFxuICAgIH0sXG5cblxuICAgIGhleFRvSHRtbDogZnVuY3Rpb24odil7IFxuICAgICAgICB2ID0gdiA9PT0gdW5kZWZpbmVkID8gMHgwMDAwMDAgOiB2O1xuICAgICAgICByZXR1cm4gXCIjXCIgKyAoXCIwMDAwMDBcIiArIHYudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgaHRtbFRvSGV4OiBmdW5jdGlvbih2KXsgXG5cbiAgICAgICAgcmV0dXJuIHYudG9VcHBlckNhc2UoKS5yZXBsYWNlKFwiI1wiLCBcIjB4XCIpO1xuXG4gICAgfSxcblxuICAgIHUyNTU6IGZ1bmN0aW9uKGNvbG9yLCBpKXtcblxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoY29sb3Iuc3Vic3RyaW5nKGksIGkgKyAyKSwgMTYpIC8gMjU1O1xuXG4gICAgfSxcblxuICAgIHUxNjogZnVuY3Rpb24oIGNvbG9yLCBpICl7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGNvbG9yLnN1YnN0cmluZyhpLCBpICsgMSksIDE2KSAvIDE1O1xuXG4gICAgfSxcblxuICAgIHVucGFjazogZnVuY3Rpb24oIGNvbG9yICl7XG5cbiAgICAgICAgaWYgKGNvbG9yLmxlbmd0aCA9PSA3KSByZXR1cm4gWyBUb29scy51MjU1KGNvbG9yLCAxKSwgVG9vbHMudTI1NShjb2xvciwgMyksIFRvb2xzLnUyNTUoY29sb3IsIDUpIF07XG4gICAgICAgIGVsc2UgaWYgKGNvbG9yLmxlbmd0aCA9PSA0KSByZXR1cm4gWyBUb29scy51MTYoY29sb3IsMSksIFRvb2xzLnUxNihjb2xvciwyKSwgVG9vbHMudTE2KGNvbG9yLDMpIF07XG5cbiAgICB9LFxuXG4gICAgaHRtbFJnYjogZnVuY3Rpb24oIHJnYiApe1xuXG4gICAgICAgIHJldHVybiAncmdiKCcgKyBNYXRoLnJvdW5kKHJnYlswXSAqIDI1NSkgKyAnLCcrIE1hdGgucm91bmQocmdiWzFdICogMjU1KSArICcsJysgTWF0aC5yb3VuZChyZ2JbMl0gKiAyNTUpICsgJyknO1xuXG4gICAgfSxcblxuICAgIHJnYlRvSGV4IDogZnVuY3Rpb24oIHJnYiApe1xuXG4gICAgICAgIHJldHVybiAnIycgKyAoICcwMDAwMDAnICsgKCAoIHJnYlswXSAqIDI1NSApIDw8IDE2IF4gKCByZ2JbMV0gKiAyNTUgKSA8PCA4IF4gKCByZ2JbMl0gKiAyNTUgKSA8PCAwICkudG9TdHJpbmcoIDE2ICkgKS5zbGljZSggLSA2ICk7XG5cbiAgICB9LFxuXG4gICAgaHVlVG9SZ2I6IGZ1bmN0aW9uKCBwLCBxLCB0ICl7XG5cbiAgICAgICAgaWYgKCB0IDwgMCApIHQgKz0gMTtcbiAgICAgICAgaWYgKCB0ID4gMSApIHQgLT0gMTtcbiAgICAgICAgaWYgKCB0IDwgMSAvIDYgKSByZXR1cm4gcCArICggcSAtIHAgKSAqIDYgKiB0O1xuICAgICAgICBpZiAoIHQgPCAxIC8gMiApIHJldHVybiBxO1xuICAgICAgICBpZiAoIHQgPCAyIC8gMyApIHJldHVybiBwICsgKCBxIC0gcCApICogNiAqICggMiAvIDMgLSB0ICk7XG4gICAgICAgIHJldHVybiBwO1xuXG4gICAgfSxcblxuICAgIHJnYlRvSHNsOiBmdW5jdGlvbihyZ2Ipe1xuXG4gICAgICAgIHZhciByID0gcmdiWzBdLCBnID0gcmdiWzFdLCBiID0gcmdiWzJdLCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSwgbWF4ID0gTWF0aC5tYXgociwgZywgYiksIGRlbHRhID0gbWF4IC0gbWluLCBoID0gMCwgcyA9IDAsIGwgPSAobWluICsgbWF4KSAvIDI7XG4gICAgICAgIGlmIChsID4gMCAmJiBsIDwgMSkgcyA9IGRlbHRhIC8gKGwgPCAwLjUgPyAoMiAqIGwpIDogKDIgLSAyICogbCkpO1xuICAgICAgICBpZiAoZGVsdGEgPiAwKSB7XG4gICAgICAgICAgICBpZiAobWF4ID09IHIgJiYgbWF4ICE9IGcpIGggKz0gKGcgLSBiKSAvIGRlbHRhO1xuICAgICAgICAgICAgaWYgKG1heCA9PSBnICYmIG1heCAhPSBiKSBoICs9ICgyICsgKGIgLSByKSAvIGRlbHRhKTtcbiAgICAgICAgICAgIGlmIChtYXggPT0gYiAmJiBtYXggIT0gcikgaCArPSAoNCArIChyIC0gZykgLyBkZWx0YSk7XG4gICAgICAgICAgICBoIC89IDY7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFsgaCwgcywgbCBdO1xuXG4gICAgfSxcblxuICAgIGhzbFRvUmdiOiBmdW5jdGlvbiggaHNsICl7XG5cbiAgICAgICAgdmFyIHAsIHEsIGggPSBoc2xbMF0sIHMgPSBoc2xbMV0sIGwgPSBoc2xbMl07XG5cbiAgICAgICAgaWYgKCBzID09PSAwICkgcmV0dXJuIFsgbCwgbCwgbCBdO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHEgPSBsIDw9IDAuNSA/IGwgKiAocyArIDEpIDogbCArIHMgLSAoIGwgKiBzICk7XG4gICAgICAgICAgICBwID0gbCAqIDIgLSBxO1xuICAgICAgICAgICAgcmV0dXJuIFsgVG9vbHMuaHVlVG9SZ2IocCwgcSwgaCArIDAuMzMzMzMpLCBUb29scy5odWVUb1JnYihwLCBxLCBoKSwgVG9vbHMuaHVlVG9SZ2IocCwgcSwgaCAtIDAuMzMzMzMpIF07XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBzdmcgdG8gY2FudmFzIHRlc3QgXG5cbiAgICB0b0NhbnZhczogZnVuY3Rpb24oIGNhbnZhcywgY29udGVudCwgdywgaCApe1xuXG4gICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICAgIHZhciBkY29weSA9IG51bGw7XG5cbiAgICAgICAgaWYoIHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJyApe1xuXG4gICAgICAgICAgICBkY29weSA9IFRvb2xzLmRvbSggJ2lmcmFtZScsICdwb3NpdGlvbjphYm9sdXRlOyBsZWZ0OjA7IHRvcDowOyB3aWR0aDonK3crJ3B4OyBoZWlnaHQ6JytoKydweDsnICk7XG4gICAgICAgICAgICBkY29weS5zcmMgPSBjb250ZW50O1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZGNvcHkgPSBjb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGRjb3B5LnN0eWxlLmxlZnQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN2ZyA9IFRvb2xzLmRvbSggJ2ZvcmVpZ25PYmplY3QnLCAncG9zaXRpb246YWJvbHV0ZTsgbGVmdDowOyB0b3A6MDsnLCB7IHdpZHRoOncsIGhlaWdodDpoIH0pO1xuXG4gICAgICAgIHN2Zy5jaGlsZE5vZGVzWzBdLmFwcGVuZENoaWxkKCBkY29weSApO1xuICAgICAgICBcbiAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZShcInZlcnNpb25cIiwgXCIxLjFcIik7XG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zJywgJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyApO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKFwieG1sbnM6eGxpbmtcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIpO1xuXG4gICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgdyApO1xuICAgICAgICBzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoICk7XG4gICAgICAgIHN2Zy5jaGlsZE5vZGVzWzBdLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnMTAwJScgKTtcbiAgICAgICAgc3ZnLmNoaWxkTm9kZXNbMF0uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMTAwJScgKTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHN2ZylcblxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIFxuXG4gICAgICAgIHZhciBkYXRhID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsJysgd2luZG93LmJ0b2EoKG5ldyBYTUxTZXJpYWxpemVyKS5zZXJpYWxpemVUb1N0cmluZyhzdmcpKTtcbiAgICAgICAgZGNvcHkgPSBudWxsO1xuXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGN0eC5jbGVhclJlY3QoIDAsIDAsIHcsIGggKTtcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoIGltZywgMCwgMCwgdywgaCwgMCwgMCwgdywgaCApO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaW1nLnNyYyA9IGRhdGE7XG5cbiAgICAgICAgLypzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCggMCwgMCwgdywgaCApO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSggaW1nLCAwLCAwLCB3LCBoLCAwLCAwLCB3LCBoICk7XG4gICAgICAgIH0sIDApOyovXG5cbiAgICAgICAgLy8gYmxvYlxuXG4gICAgICAgIC8qdmFyIHN2Z0Jsb2IgPSBuZXcgQmxvYihbKG5ldyBYTUxTZXJpYWxpemVyKS5zZXJpYWxpemVUb1N0cmluZyhzdmcpXSwge3R5cGU6IFwiaW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04XCJ9KTtcbiAgICAgICAgdmFyIHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoc3ZnQmxvYik7XG5cbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCggMCwgMCwgdywgaCApO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSggaW1nLCAwLCAwLCB3LCBoLCAwLCAwLCB3LCBoICk7XG4gICAgICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5zcmMgPSB1cmw7Ki9cblxuICAgIH0sXG5cbn07XG5cblRvb2xzLnNldFRleHQoKTtcblxuLyoqXG4gKiBAYXV0aG9yIGxvLXRoIC8gaHR0cHM6Ly9naXRodWIuY29tL2xvLXRoXG4gKi9cblxuZnVuY3Rpb24gUHJvdG8gKCBvICkge1xuXG4gICAgbyA9IG8gfHwge307XG5cbiAgICB0aGlzLm1haW4gPSBvLm1haW4gfHwgbnVsbDtcbiAgICAvLyBpZiBpcyBvbiB1aSBwYW5uZWxcbiAgICB0aGlzLmlzVUkgPSBvLmlzVUkgfHwgZmFsc2U7XG5cbiAgICAvLyBwZXJjZW50IG9mIHRpdGxlXG4gICAgdGhpcy5wID0gby5wICE9PSB1bmRlZmluZWQgPyBvLnAgOiBUb29scy5zaXplLnA7XG5cbiAgICB0aGlzLndpZHRoID0gdGhpcy5pc1VJID8gdGhpcy5tYWluLnNpemUudyA6IFRvb2xzLnNpemUudztcbiAgICBpZiggby53ICE9PSB1bmRlZmluZWQgKSB0aGlzLndpZHRoID0gby53O1xuXG4gICAgdGhpcy5oID0gdGhpcy5pc1VJID8gdGhpcy5tYWluLnNpemUuaCA6IFRvb2xzLnNpemUuaDtcbiAgICBpZiggby5oICE9PSB1bmRlZmluZWQgKSB0aGlzLmggPSBvLmg7XG4gICAgdGhpcy5oID0gdGhpcy5oIDwgMTEgPyAxMSA6IHRoaXMuaDtcblxuICAgIC8vIGlmIG5lZWQgcmVzaXplIHdpZHRoXG4gICAgdGhpcy5hdXRvV2lkdGggPSB0cnVlO1xuXG4gICAgLy8gaWYgbmVlZCByZXNpemUgaGVpZ2h0XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcblxuICAgIHRoaXMuaXNHcm91cCA9IGZhbHNlO1xuICAgIHRoaXMucGFyZW50R3JvdXAgPSBudWxsO1xuXG4gICAgLy8gaWYgaGVpZ2h0IGNhbiBjaGFuZ2VcbiAgICB0aGlzLmF1dG9IZWlnaHQgPSBmYWxzZTtcblxuICAgIC8vIHJhZGl1cyBmb3IgdG9vbGJveFxuICAgIHRoaXMucmFkaXVzID0gby5yYWRpdXMgfHwgMDtcblxuICAgIFxuXG4gICAgLy8gb25seSBmb3IgbnVtYmVyXG4gICAgdGhpcy5pc051bWJlciA9IGZhbHNlO1xuXG4gICAgLy8gb25seSBtb3N0IHNpbXBsZSBcbiAgICB0aGlzLm1vbm8gPSBmYWxzZTtcblxuICAgIC8vIHN0b3AgbGlzdGVuaW5nIGZvciBlZGl0ZSBzbGlkZSB0ZXh0XG4gICAgdGhpcy5pc0VkaXQgPSBmYWxzZTtcblxuICAgIC8vIG5vIHRpdGxlIFxuICAgIHRoaXMuc2ltcGxlID0gby5zaW1wbGUgfHwgZmFsc2U7XG4gICAgaWYoIHRoaXMuc2ltcGxlICkgdGhpcy5zYSA9IDA7XG5cbiAgICAvLyBkZWZpbmUgb2JqIHNpemVcbiAgICB0aGlzLnNldFNpemUoIHRoaXMud2lkdGggKTtcblxuICAgIC8vIHRpdGxlIHNpemVcbiAgICBpZihvLnNhICE9PSB1bmRlZmluZWQgKSB0aGlzLnNhID0gby5zYTtcbiAgICBpZihvLnNiICE9PSB1bmRlZmluZWQgKSB0aGlzLnNiID0gby5zYjtcblxuICAgIGlmKCB0aGlzLnNpbXBsZSApIHRoaXMuc2IgPSB0aGlzLndpZHRoIC0gdGhpcy5zYTtcblxuICAgIC8vIGxhc3QgbnVtYmVyIHNpemUgZm9yIHNsaWRlXG4gICAgdGhpcy5zYyA9IG8uc2MgPT09IHVuZGVmaW5lZCA/IDQ3IDogby5zYztcblxuICAgIC8vIGxpa2UgZGF0IGd1aVxuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLnZhbCA9IG51bGw7XG4gICAgdGhpcy5pc1NlbmQgPSBmYWxzZTtcblxuICAgIFxuICAgIFxuICAgIC8vIEJhY2tncm91bmRcbiAgICB0aGlzLmJnID0gdGhpcy5pc1VJID8gdGhpcy5tYWluLmJnIDogVG9vbHMuY29sb3JzLmJhY2tncm91bmQ7XG4gICAgaWYoIG8uYmcgIT09IHVuZGVmaW5lZCApIHRoaXMuYmcgPSBvLmJnO1xuXG4gICAgLy8gRm9udCBDb2xvcjtcbiAgICB0aGlzLnRpdGxlQ29sb3IgPSBvLnRpdGxlQ29sb3IgfHwgVG9vbHMuY29sb3JzLnRleHQ7XG4gICAgdGhpcy5mb250Q29sb3IgPSBvLmZvbnRDb2xvciB8fCBUb29scy5jb2xvcnMudGV4dDtcbiAgICB0aGlzLmNvbG9yUGx1cyA9IFRvb2xzLkNvbG9yTHVtYSggdGhpcy5mb250Q29sb3IsIDAuMyApO1xuXG4gICAgdGhpcy5uYW1lID0gby5uYW1lIHx8ICdQcm90byc7XG4gICAgXG4gICAgdGhpcy50eHQgPSBvLm5hbWUgfHwgJ1Byb3RvJztcbiAgICB0aGlzLnJlbmFtZSA9IG8ucmVuYW1lIHx8ICcnO1xuICAgIHRoaXMudGFyZ2V0ID0gby50YXJnZXQgfHwgbnVsbDtcblxuICAgIHRoaXMuY2FsbGJhY2sgPSBvLmNhbGxiYWNrID09PSB1bmRlZmluZWQgPyBudWxsIDogby5jYWxsYmFjaztcbiAgICB0aGlzLmVuZENhbGxiYWNrID0gbnVsbDtcblxuICAgIGlmKCB0aGlzLmNhbGxiYWNrID09PSBudWxsICYmIHRoaXMuaXNVSSAmJiB0aGlzLm1haW4uY2FsbGJhY2sgIT09IG51bGwgKSB0aGlzLmNhbGxiYWNrID0gdGhpcy5tYWluLmNhbGxiYWNrO1xuXG4gICAgLy8gZWxlbWVudHNcblxuICAgIHRoaXMuYyA9IFtdO1xuXG4gICAgLy8gc3R5bGUgXG5cbiAgICB0aGlzLnMgPSBbXTtcblxuICAgIC8vdGhpcy5jWzBdID0gVG9vbHMuZG9tKCdVSUwnLCAnZGl2JywgJ3Bvc2l0aW9uOnJlbGF0aXZlOyBoZWlnaHQ6MjBweDsgZmxvYXQ6bGVmdDsnKTtcbiAgICB0aGlzLmNbMF0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAncG9zaXRpb246cmVsYXRpdmU7IGhlaWdodDoyMHB4OyBmbG9hdDpsZWZ0OyBvdmVyZmxvdzpoaWRkZW47Jyk7XG4gICAgdGhpcy5zWzBdID0gdGhpcy5jWzBdLnN0eWxlO1xuXG4gICAgaWYoIHRoaXMuaXNVSSApIHRoaXMuc1swXS5tYXJnaW5Cb3R0b20gPSAnMXB4JztcbiAgICBcblxuICAgIGlmKCAhdGhpcy5zaW1wbGUgKXsgXG4gICAgICAgIC8vdGhpcy5jWzFdID0gVG9vbHMuZG9tKCdVSUwgdGV4dCcpO1xuICAgICAgICB0aGlzLmNbMV0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0ICk7XG4gICAgICAgIHRoaXMuc1sxXSA9IHRoaXMuY1sxXS5zdHlsZTtcbiAgICAgICAgdGhpcy5jWzFdLnRleHRDb250ZW50ID0gdGhpcy5yZW5hbWUgPT09ICcnID8gdGhpcy50eHQgOiB0aGlzLnJlbmFtZTtcbiAgICAgICAgdGhpcy5zWzFdLmNvbG9yID0gdGhpcy50aXRsZUNvbG9yO1xuICAgIH1cblxuICAgIGlmKG8ucG9zKXtcbiAgICAgICAgdGhpcy5zWzBdLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZm9yKHZhciBwIGluIG8ucG9zKXtcbiAgICAgICAgICAgIHRoaXMuc1swXVtwXSA9IG8ucG9zW3BdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9ubyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYoby5jc3Mpe1xuICAgICAgICB0aGlzLnNbMF0uY3NzVGV4dCA9IG8uY3NzOyBcbiAgICB9XG5cbn1cblxuUHJvdG8ucHJvdG90eXBlID0ge1xuXG4gICAgY29uc3RydWN0b3I6IFByb3RvLFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIG1ha2UgZGUgbm9kZVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgcyA9IHRoaXMuczsgLy8gc3R5bGUgY2FjaGVcbiAgICAgICAgdmFyIGMgPSB0aGlzLmM7IC8vIGRpdiBjYWNoZVxuXG4gICAgICAgIHNbMF0uaGVpZ2h0ID0gdGhpcy5oICsgJ3B4JztcblxuICAgICAgICAvL2lmKCB0aGlzLmlzVUkgKSBzWzBdLmJhY2tncm91bmQgPSB0aGlzLmJnO1xuICAgICAgICBpZiggdGhpcy5hdXRvSGVpZ2h0ICkgc1swXS50cmFuc2l0aW9uID0gJ2hlaWdodCAwLjFzIGVhc2Utb3V0JztcbiAgICAgICAgaWYoIGNbMV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmF1dG9XaWR0aCApe1xuICAgICAgICAgICAgc1sxXSA9IGNbMV0uc3R5bGU7XG4gICAgICAgICAgICBzWzFdLmhlaWdodCA9ICh0aGlzLmgtNCkgKyAncHgnO1xuICAgICAgICAgICAgc1sxXS5saW5lSGVpZ2h0ID0gKHRoaXMuaC04KSArICdweCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZnJhZyA9IFRvb2xzLmZyYWc7XG5cbiAgICAgICAgZm9yKCB2YXIgaT0xLCBsbmcgPSBjLmxlbmd0aDsgaSAhPT0gbG5nOyBpKysgKXtcbiAgICAgICAgICAgIGlmKCBjW2ldICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgZnJhZy5hcHBlbmRDaGlsZCggY1tpXSApO1xuICAgICAgICAgICAgICAgIHNbaV0gPSBjW2ldLnN0eWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBpZiggdGhpcy50YXJnZXQgIT09IG51bGwgKXsgXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5hcHBlbmRDaGlsZCggY1swXSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5pbm5lci5hcHBlbmRDaGlsZCggY1swXSApO1xuICAgICAgICAgICAgZWxzZSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCBjWzBdICk7XG4gICAgICAgIH1cblxuICAgICAgICBjWzBdLmFwcGVuZENoaWxkKCBmcmFnICk7XG5cbiAgICAgICAgdGhpcy5yU2l6ZSgpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50KCk7XG5cbiAgICB9LFxuXG4gICAgcmVuYW1lOiBmdW5jdGlvbiAoIHMgKSB7XG5cbiAgICAgICAgdGhpcy5jWzFdLnRleHRDb250ZW50ID0gcztcblxuICAgIH0sXG5cbiAgICBzZXRCRzogZnVuY3Rpb24gKCBjICkge1xuXG4gICAgICAgIHRoaXMuYmcgPSBjO1xuICAgICAgICB0aGlzLnNbMF0uYmFja2dyb3VuZCA9IGM7XG5cbiAgICB9LFxuXG4gICAgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgVG9vbHMuYWRkTGlzdGVuKCB0aGlzICk7XG4gICAgICAgIFRvb2xzLmxpc3RlbnMucHVzaCggdGhpcyApO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICBsaXN0ZW5pbmc6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiggdGhpcy5wYXJlbnQgPT09IG51bGwgKSByZXR1cm47XG4gICAgICAgIGlmKCB0aGlzLmlzU2VuZCApIHJldHVybjtcbiAgICAgICAgaWYoIHRoaXMuaXNFZGl0ICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoIHRoaXMucGFyZW50WyB0aGlzLnZhbCBdICk7XG5cbiAgICB9LFxuXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uICggdiApIHtcblxuICAgICAgICBpZiggdGhpcy5pc051bWJlciApIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB2ICk7XG4gICAgICAgIGVsc2UgdGhpcy52YWx1ZSA9IHY7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gdXBkYXRlIGV2ZXJ5IGNoYW5nZVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAoIGYgKSB7XG5cbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IGY7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyB1cGRhdGUgb25seSBvbiBlbmRcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBvbkZpbmlzaENoYW5nZTogZnVuY3Rpb24gKCBmICkge1xuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB0aGlzLmVuZENhbGxiYWNrID0gZjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuXG4gICAgc2VuZDogZnVuY3Rpb24gKCB2ICkge1xuXG4gICAgICAgIHRoaXMuaXNTZW5kID0gdHJ1ZTtcbiAgICAgICAgaWYoIHRoaXMucGFyZW50ICE9PSBudWxsICkgdGhpcy5wYXJlbnRbIHRoaXMudmFsIF0gPSB2IHx8IHRoaXMudmFsdWU7XG4gICAgICAgIGlmKCB0aGlzLmNhbGxiYWNrICkgdGhpcy5jYWxsYmFjayggdiB8fCB0aGlzLnZhbHVlICk7XG4gICAgICAgIHRoaXMuaXNTZW5kID0gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgc2VuZEVuZDogZnVuY3Rpb24gKCB2ICkge1xuXG4gICAgICAgIGlmKCB0aGlzLmVuZENhbGxiYWNrICkgdGhpcy5lbmRDYWxsYmFjayggdiB8fCB0aGlzLnZhbHVlICk7XG4gICAgICAgIGlmKCB0aGlzLnBhcmVudCAhPT0gbnVsbCApIHRoaXMucGFyZW50WyB0aGlzLnZhbCBdID0gdiB8fCB0aGlzLnZhbHVlO1xuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBjbGVhciBub2RlXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFxuICAgIGNsZWFyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5jbGVhckV2ZW50KCk7XG4gICAgICAgIFRvb2xzLmNsZWFyKCB0aGlzLmNbMF0gKTtcblxuICAgICAgICBpZiggdGhpcy50YXJnZXQgIT09IG51bGwgKXsgXG4gICAgICAgICAgICB0aGlzLnRhcmdldC5yZW1vdmVDaGlsZCggdGhpcy5jWzBdICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNsZWFyT25lKCB0aGlzICk7XG4gICAgICAgICAgICBlbHNlIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoIHRoaXMuY1swXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jID0gbnVsbDtcbiAgICAgICAgdGhpcy5zID0gbnVsbDtcbiAgICAgICAgdGhpcy5jYWxsYmFjayA9IG51bGw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gY2hhbmdlIHNpemUgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgc2V0U2l6ZTogZnVuY3Rpb24gKCBzeCApIHtcblxuICAgICAgICBpZiggIXRoaXMuYXV0b1dpZHRoICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSBzeDtcblxuICAgICAgICBpZiggdGhpcy5zaW1wbGUgKXtcbiAgICAgICAgICAgIC8vdGhpcy5zYSA9IDA7XG4gICAgICAgICAgICB0aGlzLnNiID0gdGhpcy53aWR0aCAtIHRoaXMuc2E7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgcHAgPSB0aGlzLndpZHRoICogKCB0aGlzLnAgLyAxMDAgKTtcbiAgICAgICAgICAgIHRoaXMuc2EgPSB+fiBwcCArIDEwO1xuICAgICAgICAgICAgdGhpcy5zYiA9IH5+IHRoaXMud2lkdGggLSBwcCAtIDIwO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgclNpemU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpZiggIXRoaXMuYXV0b1dpZHRoICkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuc1swXS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICAgICAgICBpZiggIXRoaXMuc2ltcGxlICkgdGhpcy5zWzFdLndpZHRoID0gdGhpcy5zYSArICdweCc7XG4gICAgXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBmb3IgbnVtZXJpYyB2YWx1ZVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHNldFR5cGVOdW1iZXI6IGZ1bmN0aW9uICggbyApIHtcblxuICAgICAgICB0aGlzLmlzTnVtYmVyID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnZhbHVlID0gMDtcbiAgICAgICAgaWYoby52YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygby52YWx1ZSA9PT0gJ3N0cmluZycgKSB0aGlzLnZhbHVlID0gby52YWx1ZSAqIDE7XG4gICAgICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSBvLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5taW4gPSBvLm1pbiA9PT0gdW5kZWZpbmVkID8gLUluZmluaXR5IDogby5taW47XG4gICAgICAgIHRoaXMubWF4ID0gby5tYXggPT09IHVuZGVmaW5lZCA/ICBJbmZpbml0eSA6IG8ubWF4O1xuICAgICAgICB0aGlzLnByZWNpc2lvbiA9IG8ucHJlY2lzaW9uID09PSB1bmRlZmluZWQgPyAyIDogby5wcmVjaXNpb247XG5cbiAgICAgICAgdmFyIHM7XG5cbiAgICAgICAgc3dpdGNoKHRoaXMucHJlY2lzaW9uKXtcbiAgICAgICAgICAgIGNhc2UgMDogcyA9IDE7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiBzID0gMC4xOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogcyA9IDAuMDE7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBzID0gMC4wMDE7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OiBzID0gMC4wMDAxOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RlcCA9IG8uc3RlcCA9PT0gdW5kZWZpbmVkID8gIHMgOiBvLnN0ZXA7XG5cbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMubWF4IC0gdGhpcy5taW47XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubnVtVmFsdWUoIHRoaXMudmFsdWUgKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIG51bVZhbHVlOiBmdW5jdGlvbiAoIG4gKSB7XG5cbiAgICAgICAgcmV0dXJuIE1hdGgubWluKCB0aGlzLm1heCwgTWF0aC5tYXgoIHRoaXMubWluLCBuICkgKS50b0ZpeGVkKCB0aGlzLnByZWNpc2lvbiApICogMTtcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gICBFdmVudHMgZGlzcGF0Y2hcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBhZGRFdmVudDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBpID0gdGhpcy5jLmxlbmd0aCwgaiwgYztcbiAgICAgICAgd2hpbGUoIGktLSApe1xuICAgICAgICAgICAgYyA9IHRoaXMuY1tpXTtcbiAgICAgICAgICAgIGlmKCBjICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBpZiggYy5ldmVudHMgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgICAgICAgICBqID0gYy5ldmVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSggai0tICkgYy5hZGRFdmVudExpc3RlbmVyKCBjLmV2ZW50c1tqXSwgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBjbGVhckV2ZW50OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLmMubGVuZ3RoLCBqLCBjO1xuICAgICAgICB3aGlsZSggaS0tICl7XG4gICAgICAgICAgICBjID0gdGhpcy5jW2ldO1xuICAgICAgICAgICAgaWYoIGMgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgICAgIGlmKCBjLmV2ZW50cyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgICAgIGogPSBjLmV2ZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKCBqLS0gKSBjLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGMuZXZlbnRzW2pdLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoIGUgKSB7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gb2JqZWN0IHJlZmVyZW5jeVxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHNldFJlZmVyZW5jeTogZnVuY3Rpb24gKCBvYmosIHZhbCApIHtcblxuICAgICAgICB0aGlzLnBhcmVudCA9IG9iajtcbiAgICAgICAgdGhpcy52YWwgPSB2YWw7XG5cbiAgICB9LFxuXG4gICAgZGlzcGxheTogZnVuY3Rpb24gKCB2ICkge1xuXG4gICAgICAgIHRoaXMuc1swXS5kaXNwbGF5ID0gdiA/ICdibG9jaycgOiAnbm9uZSc7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIHJlc2l6ZSBoZWlnaHQgXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgb3BlbjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLmlzT3BlbiApIHJldHVybjtcbiAgICAgICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuXG4gICAgfSxcblxuICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaWYoICF0aGlzLmlzT3BlbiApIHJldHVybjtcbiAgICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcblxuICAgIH0sXG5cblxufTtcblxuZnVuY3Rpb24gQm9vbCAoIG8gKXtcblxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMudmFsdWUgPSBvLnZhbHVlIHx8IGZhbHNlO1xuXG4gICAgdGhpcy5idXR0b25Db2xvciA9IG8uYkNvbG9yIHx8IFRvb2xzLmNvbG9ycy5idXR0b247XG5cbiAgICB0aGlzLmluaCA9IG8uaW5oIHx8IHRoaXMuaDtcblxuICAgIHZhciB0ID0gfn4gKHRoaXMuaCowLjUpLSgodGhpcy5pbmgtMikqMC41KTtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdiYWNrZ3JvdW5kOicrIFRvb2xzLmNvbG9ycy5ib29sYmcgKyc7IGhlaWdodDonKyh0aGlzLmluaC0yKSsncHg7IHdpZHRoOjM2cHg7IHRvcDonK3QrJ3B4OyBib3JkZXItcmFkaXVzOjIwcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyB0cmFuc2l0aW9uOjAuMXMgZWFzZS1vdXQ7JyApO1xuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdvcGFzaXR5OjAsIGJhY2tncm91bmQ6JysgVG9vbHMuY29sb3JzLmJvb2xiZyArJzsgaGVpZ2h0OicrKHRoaXMuaW5oLTYpKydweDsgd2lkdGg6JysodGhpcy5pbmgtNikrJ3B4OyB0b3A6JysodCsyKSsncHg7IGJvcmRlci1yYWRpdXM6MjBweDsgJyApO1xuICAgIHRoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdib3JkZXI6MXB4IHNvbGlkICcrdGhpcy5idXR0b25Db2xvcisnOyBoZWlnaHQ6JysodGhpcy5pbmgtNCkrJ3B4OyB3aWR0aDoxNnB4OyB0b3A6JysodCsxKSsncHg7IGJvcmRlci1yYWRpdXM6MjBweDsgYmFja2dyb3VuZDonK3RoaXMuYnV0dG9uQ29sb3IrJzsgdHJhbnNpdGlvbjptYXJnaW4gMC4xcyBlYXNlLW91dDsnICk7XG5cbiAgICBpZih0aGlzLnZhbHVlKXtcbiAgICAgICAgdGhpcy5jWzRdLnN0eWxlLm1hcmdpbkxlZnQgPSAnMThweCc7XG4gICAgICAgIHRoaXMuY1syXS5zdHlsZS5iYWNrZ3JvdW5kID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgIHRoaXMuY1syXS5zdHlsZS5ib3JkZXJDb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgIH1cblxuICAgIHRoaXMuY1syXS5ldmVudHMgPSBbICdjbGljaycgXTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG59XG5cbkJvb2wucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBCb29sLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdjbGljayc6IHRoaXMuY2xpY2soZSk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgY2xpY2s6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYodGhpcy52YWx1ZSkgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB0aGlzLnNlbmQoKTtcblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuXG4gICAgICAgIGlmKHRoaXMudmFsdWUpe1xuICAgICAgICAgICAgc1s0XS5tYXJnaW5MZWZ0ID0gJzE4cHgnO1xuICAgICAgICAgICAgc1syXS5iYWNrZ3JvdW5kID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICBzWzJdLmJvcmRlckNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICBzWzRdLmJvcmRlckNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzWzRdLm1hcmdpbkxlZnQgPSAnMHB4JztcbiAgICAgICAgICAgIHNbMl0uYmFja2dyb3VuZCA9IFRvb2xzLmNvbG9ycy5ib29sYmc7XG4gICAgICAgICAgICBzWzJdLmJvcmRlckNvbG9yID0gVG9vbHMuY29sb3JzLmJvb2xiZztcbiAgICAgICAgICAgIHNbNF0uYm9yZGVyQ29sb3IgPSBUb29scy5jb2xvcnMuYm9yZGVyO1xuICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICB9LFxuXG4gICAgclNpemU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG4gICAgICAgIHNbMl0ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuICAgICAgICBzWzNdLmxlZnQgPSB0aGlzLnNhKzErICdweCc7XG4gICAgICAgIHNbNF0ubGVmdCA9IHRoaXMuc2ErMSArICdweCc7XG5cbiAgICB9XG5cbn0gKTtcblxuZnVuY3Rpb24gQnV0dG9uICggbyApIHtcblxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMudmFsdWUgPSBvLnZhbHVlIHx8IFt0aGlzLnR4dF07XG5cbiAgICB0aGlzLmJ1dHRvbkNvbG9yID0gby5iQ29sb3IgfHwgVG9vbHMuY29sb3JzLmJ1dHRvbjtcblxuICAgIHRoaXMuaXNMb2FkQnV0dG9uID0gby5sb2FkZXIgfHwgZmFsc2U7XG4gICAgdGhpcy5pc0RyYWdCdXR0b24gPSBvLmRyYWcgfHwgZmFsc2U7XG4gICAgaWYodGhpcy5pc0RyYWdCdXR0b24gKSB0aGlzLmlzTG9hZEJ1dHRvbiA9IHRydWU7XG4gICAgLy90aGlzLnIgPSBvLnIgfHwgMztcblxuICAgIHRoaXMubG5nID0gdGhpcy52YWx1ZS5sZW5ndGg7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sbmc7IGkrKyl7XG4gICAgICAgIC8vdGhpcy5jW2krMl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0ICsgJ3RleHQtYWxpZ246Y2VudGVyOyBib3JkZXI6MXB4IHNvbGlkICcgKyBUb29scy5jb2xvcnMuYm9yZGVyKyc7IHRvcDoxcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBiYWNrZ3JvdW5kOicrdGhpcy5idXR0b25Db2xvcisnOyBoZWlnaHQ6JysodGhpcy5oLTIpKydweDsgYm9yZGVyLXJhZGl1czonK3RoaXMucisncHg7IGxpbmUtaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7JyApO1xuICAgICAgICB0aGlzLmNbaSsyXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHQgKyAndGV4dC1hbGlnbjpjZW50ZXI7IHRvcDoxcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBiYWNrZ3JvdW5kOicrdGhpcy5idXR0b25Db2xvcisnOyBoZWlnaHQ6JysodGhpcy5oLTIpKydweDsgYm9yZGVyLXJhZGl1czonK3RoaXMucmFkaXVzKydweDsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTQpKydweDsnICk7XG4gICAgICAgIHRoaXMuY1tpKzJdLnN0eWxlLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG5cbiAgICAgICAgdGhpcy5jW2krMl0uZXZlbnRzID0gWyAnY2xpY2snLCAnbW91c2VvdmVyJywgJ21vdXNlZG93bicsICdtb3VzZXVwJywgJ21vdXNlb3V0JyBdO1xuICAgICAgICB0aGlzLmNbaSsyXS5pbm5lckhUTUwgPSB0aGlzLnZhbHVlW2ldOy8vdGhpcy50eHQ7XG4gICAgICAgIHRoaXMuY1tpKzJdLm5hbWUgPSBpO1xuICAgIH1cblxuICAgIGlmKCB0aGlzLmNbMV0gIT09IHVuZGVmaW5lZCApIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9ICcnO1xuICAgIFxuXG4gICAgaWYoIHRoaXMuaXNMb2FkQnV0dG9uICkgdGhpcy5pbml0TG9hZGVyKCk7XG4gICAgaWYoIHRoaXMuaXNEcmFnQnV0dG9uICl7IFxuICAgICAgICB0aGlzLmxuZyArKztcbiAgICAgICAgdGhpcy5pbml0RHJhZ2VyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuQnV0dG9uLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogQnV0dG9uLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdjbGljayc6IHRoaXMuY2xpY2soIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW92ZXInOiB0aGlzLm1vZGUoIDEsIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLm1vZGUoIDIsIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZXVwJzogdGhpcy5tb2RlKCAwLCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdXQnOiB0aGlzLm1vZGUoIDAsIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjaGFuZ2UnOiB0aGlzLmZpbGVTZWxlY3QoIGUudGFyZ2V0LmZpbGVzWzBdICk7IGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdkcmFnb3Zlcic6IHRoaXMuZHJhZ292ZXIoKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkcmFnZW5kJzogdGhpcy5kcmFnZW5kKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZHJhZ2xlYXZlJzogdGhpcy5kcmFnZW5kKCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZHJvcCc6IHRoaXMuZHJvcCggZSApOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIG1vZGU6IGZ1bmN0aW9uICggbW9kZSwgZSApIHtcblxuICAgICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgICAgdmFyIGkgPSBlLnRhcmdldC5uYW1lIHx8IDA7XG4gICAgICAgIGlmKGk9PT0nbG9hZGVyJykgaSA9IDA7XG5cbiAgICAgICAgc3dpdGNoKCBtb2RlICl7XG4gICAgICAgICAgICBjYXNlIDA6IC8vIGJhc2VcbiAgICAgICAgICAgICAgICBzW2krMl0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICBzW2krMl0uYmFja2dyb3VuZCA9IHRoaXMuYnV0dG9uQ29sb3I7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogLy8gb3ZlclxuICAgICAgICAgICAgICAgIHNbaSsyXS5jb2xvciA9ICcjRkZGJztcbiAgICAgICAgICAgICAgICBzW2krMl0uYmFja2dyb3VuZCA9IFRvb2xzLmNvbG9ycy5zZWxlY3Q7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjogLy8gZWRpdCAvIGRvd25cbiAgICAgICAgICAgICAgICBzW2krMl0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICBzW2krMl0uYmFja2dyb3VuZCA9IFRvb2xzLmNvbG9ycy5kb3duO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkcmFnb3ZlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuc1s0XS5ib3JkZXJDb2xvciA9IFRvb2xzLmNvbG9ycy5zZWxlY3Q7XG4gICAgICAgIHRoaXMuc1s0XS5jb2xvciA9IFRvb2xzLmNvbG9ycy5zZWxlY3Q7XG5cbiAgICB9LFxuXG4gICAgZHJhZ2VuZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuc1s0XS5ib3JkZXJDb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICB0aGlzLnNbNF0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICB9LFxuXG4gICAgZHJvcDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHRoaXMuZHJhZ2VuZCgpO1xuICAgICAgICB0aGlzLmZpbGVTZWxlY3QoIGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdICk7XG5cbiAgICB9LFxuXG4gICAgXG5cbiAgICBpbml0RHJhZ2VyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dCArJyB0ZXh0LWFsaWduOmNlbnRlcjsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTgpKydweDsgYm9yZGVyOjFweCBkYXNoZWQgJyt0aGlzLmZvbnRDb2xvcisnOyB0b3A6MnB4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6ZGVmYXVsdDsgaGVpZ2h0OicrKHRoaXMuaC00KSsncHg7IGJvcmRlci1yYWRpdXM6Jyt0aGlzLnIrJ3B4OycgKTtcbiAgICAgICAgdGhpcy5jWzRdLnRleHRDb250ZW50ID0gJ0RSQUcnO1xuXG4gICAgICAgIHRoaXMuY1syXS5ldmVudHMgPSBbICBdO1xuICAgICAgICB0aGlzLmNbNF0uZXZlbnRzID0gWyAnZHJhZ292ZXInLCAnZHJhZ2VuZCcsICdkcmFnbGVhdmUnLCAnZHJvcCcgXTtcblxuXG4gICAgfSxcblxuICAgIGluaXRMb2FkZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLmNbM10gPSBUb29scy5kb20oICdpbnB1dCcsIFRvb2xzLmNzcy5iYXNpYyArJ2JvcmRlcjoxcHggc29saWQgJytUb29scy5jb2xvcnMuYm9yZGVyKyc7IHRvcDoxcHg7IG9wYWNpdHk6MDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7IGhlaWdodDonKyh0aGlzLmgtMikrJ3B4OycgKTtcbiAgICAgICAgdGhpcy5jWzNdLm5hbWUgPSAnbG9hZGVyJztcbiAgICAgICAgdGhpcy5jWzNdLnR5cGUgPSBcImZpbGVcIjtcblxuICAgICAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAgXTtcbiAgICAgICAgdGhpcy5jWzNdLmV2ZW50cyA9IFsgJ2NoYW5nZScsICdtb3VzZW92ZXInLCAnbW91c2Vkb3duJywgJ21vdXNldXAnLCAnbW91c2VvdXQnIF07XG5cbiAgICAgICAgLy90aGlzLmhpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuXG4gICAgfSxcblxuICAgIGZpbGVTZWxlY3Q6IGZ1bmN0aW9uICggZmlsZSApIHtcblxuICAgICAgICB2YXIgZGF0YVVybCA9IFsgJ3BuZycsICdqcGcnLCAnbXA0JywgJ3dlYm0nLCAnb2dnJyBdO1xuICAgICAgICB2YXIgZGF0YUJ1ZiA9IFsgJ3NlYScsICdidmgnLCAnQlZIJywgJ3onIF07XG5cbiAgICAgICAgLy9pZiggISBlLnRhcmdldC5maWxlcyApIHJldHVybjtcblxuICAgICAgICAvL3ZhciBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XG4gICAgICAgXG4gICAgICAgIC8vdGhpcy5jWzNdLnR5cGUgPSBcIm51bGxcIjtcbiAgICAgICAgLy8gY29uc29sZS5sb2coIHRoaXMuY1s0XSApXG5cbiAgICAgICAgaWYoIGZpbGUgPT09IHVuZGVmaW5lZCApIHJldHVybjtcblxuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgdmFyIGZuYW1lID0gZmlsZS5uYW1lO1xuICAgICAgICB2YXIgdHlwZSA9IGZuYW1lLnN1YnN0cmluZyhmbmFtZS5sYXN0SW5kZXhPZignLicpKzEsIGZuYW1lLmxlbmd0aCApO1xuXG4gICAgICAgIGlmKCBkYXRhVXJsLmluZGV4T2YoIHR5cGUgKSAhPT0gLTEgKSByZWFkZXIucmVhZEFzRGF0YVVSTCggZmlsZSApO1xuICAgICAgICBlbHNlIGlmKCBkYXRhQnVmLmluZGV4T2YoIHR5cGUgKSAhPT0gLTEgKSByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoIGZpbGUgKTtcbiAgICAgICAgZWxzZSByZWFkZXIucmVhZEFzVGV4dCggZmlsZSApO1xuXG4gICAgICAgIC8vIGlmKCB0eXBlID09PSAncG5nJyB8fCB0eXBlID09PSAnanBnJyB8fCB0eXBlID09PSAnbXA0JyB8fCB0eXBlID09PSAnd2VibScgfHwgdHlwZSA9PT0gJ29nZycgKSByZWFkZXIucmVhZEFzRGF0YVVSTCggZmlsZSApO1xuICAgICAgICAvL2Vsc2UgaWYoIHR5cGUgPT09ICd6JyApIHJlYWRlci5yZWFkQXNCaW5hcnlTdHJpbmcoIGZpbGUgKTtcbiAgICAgICAgLy9lbHNlIGlmKCB0eXBlID09PSAnc2VhJyB8fCB0eXBlID09PSAnYnZoJyB8fCB0eXBlID09PSAnQlZIJyB8fCB0eXBlID09PSAneicpIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZmlsZSApO1xuICAgICAgICAvL2Vsc2UgaWYoICApIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlciggZmlsZSApO1xuICAgICAgICAvL2Vsc2UgcmVhZGVyLnJlYWRBc1RleHQoIGZpbGUgKTtcblxuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggdGhpcy5jYWxsYmFjayApIHRoaXMuY2FsbGJhY2soIGUudGFyZ2V0LnJlc3VsdCwgZm5hbWUsIHR5cGUgKTtcbiAgICAgICAgICAgIC8vdGhpcy5jWzNdLnR5cGUgPSBcImZpbGVcIjtcbiAgICAgICAgICAgIC8vdGhpcy5zZW5kKCBlLnRhcmdldC5yZXN1bHQgKTsgXG4gICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgIH0sXG5cbiAgICBjbGljazogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHZhciBpID0gZS50YXJnZXQubmFtZSB8fCAwO1xuICAgICAgICB2YXIgdiA9IHRoaXMudmFsdWVbaV07XG5cbiAgICAgICAgdGhpcy5zZW5kKCB2ICk7XG5cbiAgICB9LFxuXG4gICAgbGFiZWw6IGZ1bmN0aW9uICggc3RyaW5nLCBuICkge1xuXG4gICAgICAgIG4gPSBuIHx8IDI7XG4gICAgICAgIHRoaXMuY1tuXS50ZXh0Q29udGVudCA9IHN0cmluZztcblxuICAgIH0sXG5cbiAgICBpY29uOiBmdW5jdGlvbiAoIHN0cmluZywgeSwgbiApIHtcblxuICAgICAgICBuID0gbiB8fCAyO1xuICAgICAgICB0aGlzLnNbbl0ucGFkZGluZyA9ICggeSB8fCAwICkgKydweCAwcHgnO1xuICAgICAgICB0aGlzLmNbbl0uaW5uZXJIVE1MID0gc3RyaW5nO1xuXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcblxuICAgICAgICB2YXIgcyA9IHRoaXMucztcbiAgICAgICAgdmFyIHcgPSB0aGlzLnNiO1xuICAgICAgICB2YXIgZCA9IHRoaXMuc2E7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLmxuZztcbiAgICAgICAgdmFyIGRjID0gIDM7XG4gICAgICAgIHZhciBzaXplID0gTWF0aC5mbG9vciggKCB3LShkYyooaS0xKSkgKSAvIGkgKTtcblxuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzW2krMl0ud2lkdGggPSBzaXplICsgJ3B4JztcbiAgICAgICAgICAgIHNbaSsyXS5sZWZ0ID0gZCArICggc2l6ZSAqIGkgKSArICggZGMgKiBpKSArICdweCc7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLmlzRHJhZ0J1dHRvbiApeyBcbiAgICAgICAgICAgIHNbNF0ubGVmdCA9IChkK3NpemUrZGMpICsgJ3B4JztcbiAgICAgICAgICAgIHNbNF0ud2lkdGggPSBzaXplICsgJ3B4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLmlzTG9hZEJ1dHRvbiApe1xuICAgICAgICAgICAgc1szXS5sZWZ0ID0gZCArICdweCc7XG4gICAgICAgICAgICBzWzNdLndpZHRoID0gc2l6ZSArICdweCc7XG4gICAgICAgIH1cblxuICAgIH1cblxufSApO1xuXG5mdW5jdGlvbiBDaXJjdWxhciAoIG8gKSB7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICAvL3RoaXMudHlwZSA9ICdjaXJjdWxhcic7XG4gICAgdGhpcy5hdXRvV2lkdGggPSBmYWxzZTtcblxuICAgIHRoaXMuYnV0dG9uQ29sb3IgPSBUb29scy5jb2xvcnMuYnV0dG9uO1xuXG4gICAgdGhpcy5zZXRUeXBlTnVtYmVyKCBvICk7XG5cbiAgICB0aGlzLnJhZGl1cyA9IE1hdGguZmxvb3IoKHRoaXMud2lkdGgtMjApKjAuNSk7XG5cbiAgICAvKnRoaXMucmFkaXVzID0gby5yYWRpdXMgfHwgMTU7XG4gICAgXG4gICAgdGhpcy53aWR0aCA9ICh0aGlzLnJhZGl1cyoyKSsyMDtcblxuICAgIGlmKG8ud2lkdGggIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHRoaXMud2lkdGggPSBvLndpZHRoO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IH5+ICh0aGlzLndpZHRoLTIwKSowLjU7XG4gICAgfVxuXG4gICAgaWYoby5zaXplICE9PSB1bmRlZmluZWQpe1xuICAgICAgICB0aGlzLndpZHRoID0gby5zaXplO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IH5+ICh0aGlzLndpZHRoLTIwKSowLjU7XG4gICAgfSovXG5cbiAgICB0aGlzLncgPSB0aGlzLmhlaWdodCA9IHRoaXMucmFkaXVzICogMjtcbiAgICB0aGlzLmggPSBvLmhlaWdodCB8fCAodGhpcy5oZWlnaHQgKyA0MCk7XG5cbiAgICB0aGlzLnR3b1BpID0gTWF0aC5QSSAqIDI7XG5cbiAgICB0aGlzLnRvcCA9IDA7XG5cbiAgICB0aGlzLmNbMF0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuXG4gICAgaWYodGhpcy5jWzFdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICB0aGlzLmNbMV0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuICAgICAgICB0aGlzLmNbMV0uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMudG9wID0gMjA7XG5cbiAgICB9XG5cbiAgICB0aGlzLnBlcmNlbnQgPSAwO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dG51bWJlciArICd0ZXh0LWFsaWduOmNlbnRlcjsgdG9wOicrKHRoaXMuaGVpZ2h0KzI0KSsncHg7IHdpZHRoOicrdGhpcy53aWR0aCsncHg7IGNvbG9yOicrIHRoaXMuZm9udENvbG9yICk7XG4gICAgdGhpcy5jWzNdID0gVG9vbHMuZG9tKCAnY2lyY2xlJywgVG9vbHMuY3NzLmJhc2ljICsgJ2xlZnQ6MTBweDsgdG9wOicrdGhpcy50b3ArJ3B4OyB3aWR0aDonK3RoaXMudysncHg7IGhlaWdodDonK3RoaXMuaGVpZ2h0KydweDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7JywgeyBjeDp0aGlzLnJhZGl1cywgY3k6dGhpcy5yYWRpdXMsIHI6dGhpcy5yYWRpdXMsIGZpbGw6J3JnYmEoMCwwLDAsMC4zKScgfSk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAncGF0aCcsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjEwcHg7IHRvcDonK3RoaXMudG9wKydweDsgd2lkdGg6Jyt0aGlzLncrJ3B4OyBoZWlnaHQ6Jyt0aGlzLmhlaWdodCsncHg7JywgeyBkOnRoaXMubWFrZVBhdGgoKSwgZmlsbDp0aGlzLmZvbnRDb2xvciB9KTtcbiAgICB0aGlzLmNbNV0gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OycsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzLCByOnRoaXMucmFkaXVzKjAuNSwgZmlsbDp0aGlzLmJ1dHRvbkNvbG9yLCAnc3Ryb2tlLXdpZHRoJzoxLCBzdHJva2U6VG9vbHMuY29sb3JzLnN0cm9rZSB9KTtcblxuICAgIHRoaXMuY1szXS5ldmVudHMgPSBbICdtb3VzZW92ZXInLCAnbW91c2Vkb3duJywgJ21vdXNlb3V0JyBdO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG59XG5cbkNpcmN1bGFyLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogQ2lyY3VsYXIsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3Zlcic6IHRoaXMub3ZlciggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHRoaXMuZG93biggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3V0JzogIHRoaXMub3V0KCBlICk7ICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6ICAgdGhpcy51cCggZSApOyAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vtb3ZlJzogdGhpcy5tb3ZlKCBlICk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbW9kZTogZnVuY3Rpb24gKCBtb2RlICkge1xuXG4gICAgICAgIHN3aXRjaChtb2RlKXtcbiAgICAgICAgICAgIGNhc2UgMDogLy8gYmFzZVxuICAgICAgICAgICAgICAgIHRoaXMuc1syXS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzNdLCAnZmlsbCcsJ3JnYmEoMCwwLDAsMC4yKScpO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZmlsbCcsIHRoaXMuZm9udENvbG9yICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogLy8gb3ZlclxuICAgICAgICAgICAgICAgIHRoaXMuc1syXS5jb2xvciA9IHRoaXMuY29sb3JQbHVzO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzNdLCAnZmlsbCcsJ3JnYmEoMCwwLDAsMC42KScpO1xuICAgICAgICAgICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZmlsbCcsIHRoaXMuY29sb3JQbHVzICk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIEFDVElPTlxuXG4gICAgb3ZlcjogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RlKDEpO1xuXG4gICAgfSxcblxuICAgIG91dDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMuaXNEb3duKSByZXR1cm47XG4gICAgICAgIHRoaXMubW9kZSgwKTtcblxuICAgIH0sXG5cbiAgICB1cDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG5cbiAgICAgICAgaWYodGhpcy5pc092ZXIpIHRoaXMubW9kZSgxKTtcbiAgICAgICAgZWxzZSB0aGlzLm1vZGUoMCk7XG5cbiAgICAgICAgdGhpcy5zZW5kRW5kKCk7XG5cbiAgICB9LFxuXG4gICAgZG93bjogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICB0aGlzLnJlY3QgPSB0aGlzLmNbM10uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMub2xkID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy5vbGRyID0gbnVsbDtcbiAgICAgICAgdGhpcy5tb3ZlKCBlICk7XG5cbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGlmKCAhdGhpcy5pc0Rvd24gKSByZXR1cm47XG5cbiAgICAgICAgdmFyIHggPSB0aGlzLnJhZGl1cyAtIChlLmNsaWVudFggLSB0aGlzLnJlY3QubGVmdCk7XG4gICAgICAgIHZhciB5ID0gdGhpcy5yYWRpdXMgLSAoZS5jbGllbnRZIC0gdGhpcy5yZWN0LnRvcCk7XG5cbiAgICAgICAgdGhpcy5yID0gTWF0aC5hdGFuMiggeSwgeCApIC0gKE1hdGguUEkgKiAwLjUpO1xuICAgICAgICB0aGlzLnIgPSAoKCh0aGlzLnIldGhpcy50d29QaSkrdGhpcy50d29QaSkldGhpcy50d29QaSk7XG5cbiAgICAgICAgaWYoIHRoaXMub2xkciAhPT0gbnVsbCApeyBcblxuICAgICAgICAgICAgdmFyIGRpZiA9IHRoaXMuciAtIHRoaXMub2xkcjtcbiAgICAgICAgICAgIHRoaXMuciA9IE1hdGguYWJzKGRpZikgPiBNYXRoLlBJID8gdGhpcy5vbGRyIDogdGhpcy5yO1xuXG4gICAgICAgICAgICBpZihkaWYgPiA2KSB0aGlzLnIgPSAwO1xuICAgICAgICAgICAgaWYoZGlmIDwgLTYpIHRoaXMuciA9IHRoaXMudHdvUGk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdGVwcyA9IDEgLyB0aGlzLnR3b1BpO1xuICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnIgKiBzdGVwcztcblxuICAgICAgICB2YXIgbiA9ICggKCB0aGlzLnJhbmdlICogdmFsdWUgKSArIHRoaXMubWluICkgLSB0aGlzLm9sZDtcblxuICAgICAgICBpZihuID49IHRoaXMuc3RlcCB8fCBuIDw9IHRoaXMuc3RlcCl7IFxuICAgICAgICAgICAgbiA9IH5+ICggbiAvIHRoaXMuc3RlcCApO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubnVtVmFsdWUoIHRoaXMub2xkICsgKCBuICogdGhpcy5zdGVwICkgKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCB0cnVlICk7XG4gICAgICAgICAgICB0aGlzLm9sZCA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLm9sZHIgPSB0aGlzLnI7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtYWtlUGF0aDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciByID0gdGhpcy5yYWRpdXM7XG4gICAgICAgIC8vdmFyIHN0YXJ0ID0gMDtcbiAgICAgICAgdmFyIGVuZCA9IHRoaXMucGVyY2VudCAqIHRoaXMudHdvUGkgLSAwLjAwMTtcbiAgICAgICAgLy92YXIgeDEgPSByICsgciAqIE1hdGguc2luKHN0YXJ0KTtcbiAgICAgICAgLy92YXIgeTEgPSByIC0gciAqIE1hdGguY29zKHN0YXJ0KTtcbiAgICAgICAgdmFyIHgyID0gciArIHIgKiBNYXRoLnNpbihlbmQpO1xuICAgICAgICB2YXIgeTIgPSByIC0gciAqIE1hdGguY29zKGVuZCk7XG4gICAgICAgIC8vdmFyIGJpZyA9IGVuZCAtIHN0YXJ0ID4gTWF0aC5QSSA/IDEgOiAwO1xuICAgICAgICB2YXIgYmlnID0gZW5kID4gTWF0aC5QSSA/IDEgOiAwO1xuICAgICAgICByZXR1cm4gXCJNIFwiICsgciArIFwiLFwiICsgciArIFwiIEwgXCIgKyByICsgXCIsXCIgKyAwICsgXCIgQSBcIiArIHIgKyBcIixcIiArIHIgKyBcIiAwIFwiICsgYmlnICsgXCIgMSBcIiArIHgyICsgXCIsXCIgKyB5MiArIFwiIFpcIjtcblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICggdXAgKSB7XG5cbiAgICAgICAgdGhpcy5jWzJdLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZTtcbiAgICAgICAgdGhpcy5wZXJjZW50ID0gKCB0aGlzLnZhbHVlIC0gdGhpcy5taW4gKSAvIHRoaXMucmFuZ2U7XG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZCcsIHRoaXMubWFrZVBhdGgoKSApO1xuICAgICAgICBpZiggdXAgKSB0aGlzLnNlbmQoKTtcbiAgICAgICAgXG4gICAgfSxcblxufSApO1xuXG5mdW5jdGlvbiBDb2xvciAoIG8gKSB7XG4gICAgXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gdHJ1ZTtcblxuICAgIHRoaXMuY3R5cGUgPSBvLmN0eXBlIHx8ICdhcnJheSc7XG4gICAgdGhpcy53dyA9IHRoaXMuc2I7XG4gICAgdGhpcy5vbGRXaWR0aCA9IDA7XG5cbiAgICAvLyBjb2xvciB1cCBvciBkb3duXG4gICAgdGhpcy5zaWRlID0gby5zaWRlIHx8ICdkb3duJztcbiAgICB0aGlzLmhvbGRUb3AgPSAwO1xuICAgIFxuICAgIHRoaXMud2hlZWxXaWR0aCA9IHRoaXMud3cqMC4xO1xuICAgIHRoaXMuZGVjYWwgPSB0aGlzLmggKyAyO1xuICAgIFxuICAgIHRoaXMuY29sb3JSYWRpdXMgPSAodGhpcy53dyAtIHRoaXMud2hlZWxXaWR0aCkgKiAwLjUgLSAxO1xuICAgIHRoaXMuc3F1YXJlID0gTWF0aC5mbG9vcigodGhpcy5jb2xvclJhZGl1cyAtIHRoaXMud2hlZWxXaWR0aCAqIDAuNSkgKiAwLjcpIC0gMTtcbiAgICB0aGlzLm1pZCA9IE1hdGguZmxvb3IodGhpcy53dyAqIDAuNSApO1xuICAgIHRoaXMubWFya2VyU2l6ZSA9IHRoaXMud2hlZWxXaWR0aCAqIDAuMztcblxuICAgIHRoaXMuYmFzZUggPSB0aGlzLmg7XG5cbiAgICAvL3RoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsICBUb29scy5jc3MudHh0ICsgJ2hlaWdodDonKyh0aGlzLmgtNCkrJ3B4OycgKyAnYm9yZGVyLXJhZGl1czozcHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBib3JkZXI6MXB4IHNvbGlkICcrIFRvb2xzLmNvbG9ycy5ib3JkZXIgKyAnOyBsaW5lLWhlaWdodDonKyh0aGlzLmgtOCkrJ3B4OycgKTtcbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCAgVG9vbHMuY3NzLnR4dCArICdoZWlnaHQ6JysodGhpcy5oLTQpKydweDsnICsgJ2JvcmRlci1yYWRpdXM6Jyt0aGlzLnJhZGl1cysncHg7IHBvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjpwb2ludGVyOyBsaW5lLWhlaWdodDonKyh0aGlzLmgtOCkrJ3B4OycgKTtcblxuICAgIHRoaXMuc1syXSA9IHRoaXMuY1syXS5zdHlsZTtcblxuICAgIGlmKHRoaXMuc2lkZSA9PT0gJ3VwJyl7XG4gICAgICAgIHRoaXMuZGVjYWwgPSA1O1xuICAgICAgICB0aGlzLnNbMl0udG9wID0gJ2F1dG8nO1xuICAgICAgICB0aGlzLnNbMl0uYm90dG9tID0gJzJweCc7XG4gICAgfVxuXG4gICAgdGhpcy5jWzNdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ2Rpc3BsYXk6bm9uZScgKTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdjYW52YXMnLCBUb29scy5jc3MuYmFzaWMgKyAnZGlzcGxheTpub25lOycpO1xuICAgIHRoaXMuY1s1XSA9IFRvb2xzLmRvbSggJ2NhbnZhcycsIFRvb2xzLmNzcy5iYXNpYyArICdwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgZGlzcGxheTpub25lOycpO1xuXG4gICAgdGhpcy5zWzNdID0gdGhpcy5jWzNdLnN0eWxlO1xuICAgIHRoaXMuc1s1XSA9IHRoaXMuY1s1XS5zdHlsZTtcblxuICAgIGlmKHRoaXMuc2lkZSA9PT0gJ3VwJykgdGhpcy5zWzVdLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmNbNF0ud2lkdGggPSB0aGlzLmNbNF0uaGVpZ2h0ID0gdGhpcy53dztcbiAgICB0aGlzLmNbNV0ud2lkdGggPSB0aGlzLmNbNV0uaGVpZ2h0ID0gdGhpcy53dztcblxuICAgIHRoaXMuY3R4TWFzayA9IHRoaXMuY1s0XS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY3R4T3ZlcmxheSA9IHRoaXMuY1s1XS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuY3R4TWFzay50cmFuc2xhdGUodGhpcy5taWQsIHRoaXMubWlkKTtcbiAgICB0aGlzLmN0eE92ZXJsYXkudHJhbnNsYXRlKHRoaXMubWlkLCB0aGlzLm1pZCk7XG5cbiAgICB0aGlzLmhzbCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZSA9ICcjZmZmZmZmJztcbiAgICBpZiggby52YWx1ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIGlmKG8udmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgdGhpcy52YWx1ZSA9IFRvb2xzLnJnYlRvSGV4KCBvLnZhbHVlICk7XG4gICAgICAgIGVsc2UgaWYoIWlzTmFOKG8udmFsdWUpKSB0aGlzLnZhbHVlID0gVG9vbHMuaGV4VG9IdG1sKCBvLnZhbHVlICk7XG4gICAgICAgIGVsc2UgdGhpcy52YWx1ZSA9IG8udmFsdWU7XG4gICAgfVxuICAgIHRoaXMuYmNvbG9yID0gbnVsbDtcbiAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgIHRoaXMuaXNEcmF3ID0gZmFsc2U7XG5cbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAnY2xpY2snIF07XG4gICAgdGhpcy5jWzVdLmV2ZW50cyA9IFsgJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcsICdtb3VzZW91dCcgXTtcblxuICAgIHRoaXMuc2V0Q29sb3IoIHRoaXMudmFsdWUgKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYoIG8ub3BlbiAhPT0gdW5kZWZpbmVkICkgdGhpcy5vcGVuKCk7XG5cbn1cblxuQ29sb3IucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBDb2xvcixcblxuXHRoYW5kbGVFdmVudDogZnVuY3Rpb24oIGUgKSB7XG5cblx0ICAgIGUucHJldmVudERlZmF1bHQoKTtcblx0ICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0ICAgIHN3aXRjaCggZS50eXBlICkge1xuXHQgICAgICAgIGNhc2UgJ2NsaWNrJzogdGhpcy5jbGljayhlKTsgYnJlYWs7XG5cdCAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5kb3duKGUpOyBicmVhaztcblx0ICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB0aGlzLm1vdmUoZSk7IGJyZWFrO1xuXHQgICAgICAgIGNhc2UgJ21vdXNldXAnOiB0aGlzLnVwKGUpOyBicmVhaztcblx0ICAgICAgICBjYXNlICdtb3VzZW91dCc6IHRoaXMub3V0KGUpOyBicmVhaztcblx0ICAgIH1cblxuXHR9LFxuXG5cdC8vIEFDVElPTlxuXG5cdGNsaWNrOiBmdW5jdGlvbiggZSApe1xuXG5cdCAgICBpZiggIXRoaXMuaXNPcGVuICkgdGhpcy5vcGVuKCk7XG5cdCAgICBlbHNlIHRoaXMuY2xvc2UoKTtcblxuXHR9LFxuXG5cdHVwOiBmdW5jdGlvbiggZSApe1xuXG5cdCAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuXG5cdH0sXG5cblx0b3V0OiBmdW5jdGlvbiggZSApe1xuXG5cdCAgICBpZiggdGhpcy5pc09wZW4gKSB0aGlzLmNsb3NlKCk7XG5cblx0fSxcblxuXHRkb3duOiBmdW5jdGlvbiggZSApe1xuXG5cdCAgICBpZighdGhpcy5pc09wZW4pIHJldHVybjtcblx0ICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcblx0ICAgIHRoaXMubW92ZSggZSApO1xuXHQgICAgLy9yZXR1cm4gZmFsc2U7XG5cblx0fSxcblxuXHRtb3ZlOiBmdW5jdGlvbiggZSApe1xuXG5cdCAgICBpZighdGhpcy5pc0Rvd24pIHJldHVybjtcblxuXHQgICAgdGhpcy5vZmZzZXQgPSB0aGlzLmNbNV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdCAgICB2YXIgcG9zID0geyB4OiBlLnBhZ2VYIC0gdGhpcy5vZmZzZXQubGVmdCAtIHRoaXMubWlkLCB5OiBlLnBhZ2VZIC0gdGhpcy5vZmZzZXQudG9wIC0gdGhpcy5taWQgfTtcblx0ICAgIHRoaXMuY2lyY2xlRHJhZyA9IE1hdGgubWF4KE1hdGguYWJzKHBvcy54KSwgTWF0aC5hYnMocG9zLnkpKSA+ICh0aGlzLnNxdWFyZSArIDIpO1xuXG5cdCAgICBpZiAoIHRoaXMuY2lyY2xlRHJhZyApIHtcblx0ICAgICAgICB2YXIgaHVlID0gTWF0aC5hdGFuMihwb3MueCwgLXBvcy55KSAvIDYuMjg7XG5cdCAgICAgICAgdGhpcy5zZXRIU0woWyhodWUgKyAxKSAlIDEsIHRoaXMuaHNsWzFdLCB0aGlzLmhzbFsyXV0pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgICB2YXIgc2F0ID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgLSggcG9zLnggLyB0aGlzLnNxdWFyZSAqIDAuNSkgKyAuNSkgKTtcblx0ICAgICAgICB2YXIgbHVtID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgLSggcG9zLnkgLyB0aGlzLnNxdWFyZSAqIDAuNSkgKyAuNSkgKTtcblx0ICAgICAgICB0aGlzLnNldEhTTChbdGhpcy5oc2xbMF0sIHNhdCwgbHVtXSk7XG5cdCAgICB9XG5cblx0fSxcblxuXG5cdC8vLy8vL1xuXG5cdHJlZHJhdzogZnVuY3Rpb24oKXtcblxuXHQgICAgXG5cdCAgICB0aGlzLmRyYXdDaXJjbGUoKTtcblx0ICAgIHRoaXMuZHJhd01hc2soKTtcblx0ICAgIHRoaXMuZHJhd01hcmtlcnMoKTtcblxuXHQgICAgdGhpcy5vbGRXaWR0aCA9IHRoaXMud3c7XG5cdCAgICB0aGlzLmlzRHJhdyA9IHRydWU7XG5cblx0ICAgIC8vY29uc29sZS5sb2codGhpcy5pc0RyYXcpXG5cblx0fSxcblxuXHRvcGVuOiBmdW5jdGlvbigpe1xuXG5cdFx0UHJvdG8ucHJvdG90eXBlLm9wZW4uY2FsbCggdGhpcyApO1xuXG5cdCAgICBpZiggdGhpcy5vbGRXaWR0aCAhPT0gdGhpcy53dyApIHRoaXMucmVkcmF3KCk7XG5cblx0ICAgIHRoaXMuaCA9IHRoaXMud3cgKyB0aGlzLmJhc2VIICsgMTA7XG5cdCAgICB0aGlzLnNbMF0uaGVpZ2h0ID0gdGhpcy5oICsgJ3B4JztcblxuXHQgICAgaWYoIHRoaXMuc2lkZSA9PT0gJ3VwJyApeyBcblx0ICAgICAgICB0aGlzLmhvbGRUb3AgPSB0aGlzLnNbMF0udG9wLnN1YnN0cmluZygwLHRoaXMuc1swXS50b3AubGVuZ3RoLTIpICogMSB8fCAnYXV0byc7XG5cdCAgICAgICAgaWYoIWlzTmFOKHRoaXMuaG9sZFRvcCkpIHRoaXMuc1swXS50b3AgPSAodGhpcy5ob2xkVG9wLSh0aGlzLmgtMjApKSsncHgnO1xuXHQgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLnNbNV0ucG9pbnRlckV2ZW50cyA9ICdhdXRvJzt9LmJpbmQodGhpcyksIDEwMCk7XG5cdCAgICB9XG5cblx0ICAgIHRoaXMuc1szXS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0ICAgIHRoaXMuc1s0XS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0ICAgIHRoaXMuc1s1XS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuXHQgICAgdmFyIHQgPSB0aGlzLmggLSB0aGlzLmJhc2VIO1xuXG5cdCAgICBpZiAoIHRoaXMucGFyZW50R3JvdXAgIT09IG51bGwgKSB0aGlzLnBhcmVudEdyb3VwLmNhbGMoIHQgKTtcblx0ICAgIGVsc2UgaWYgKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggdCApO1xuXG5cdCAgICBjb25zb2xlLmxvZygnb3BlbicpO1xuXG5cdH0sXG5cblx0Y2xvc2U6IGZ1bmN0aW9uKCl7XG5cblx0ICAgIFByb3RvLnByb3RvdHlwZS5jbG9zZS5jYWxsKCB0aGlzICk7XG5cblx0ICAgIHZhciB0ID0gdGhpcy5oIC0gdGhpcy5iYXNlSDtcblxuXHQgICAgaWYgKCB0aGlzLnBhcmVudEdyb3VwICE9PSBudWxsICkgdGhpcy5wYXJlbnRHcm91cC5jYWxjKCAtdCApO1xuXHQgICAgZWxzZSBpZiAoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCAtdCApOyBcblxuXHQgICAgXG5cdCAgICB0aGlzLmggPSB0aGlzLmJhc2VIO1xuXHQgICAgaWYodGhpcy5zaWRlID09PSAndXAnKXsgXG5cdCAgICAgICAgaWYoIWlzTmFOKHRoaXMuaG9sZFRvcCkpIHRoaXMuc1swXS50b3AgPSAodGhpcy5ob2xkVG9wKSsncHgnO1xuXHQgICAgICAgIHRoaXMuc1s1XS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuXHQgICAgfVxuXHQgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCsncHgnO1xuXHQgICAgdGhpcy5zWzNdLmRpc3BsYXkgPSAnbm9uZSc7XG5cdCAgICB0aGlzLnNbNF0uZGlzcGxheSA9ICdub25lJztcblx0ICAgIHRoaXMuc1s1XS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdCAgICBjb25zb2xlLmxvZygnY2xvc2UnKTtcblx0ICAgIFxuXHR9LFxuXG5cdHVwZGF0ZTogZnVuY3Rpb24oIHVwICl7XG5cblx0ICAgIHRoaXMuc1szXS5iYWNrZ3JvdW5kID0gVG9vbHMucmdiVG9IZXgoIFRvb2xzLmhzbFRvUmdiKFt0aGlzLmhzbFswXSwgMSwgMC41XSkgKTtcblxuXHQgICAgdGhpcy5kcmF3TWFya2VycygpO1xuXHQgICAgXG5cdCAgICB0aGlzLnZhbHVlID0gdGhpcy5iY29sb3I7XG5cblx0ICAgIHRoaXMuc1syXS5iYWNrZ3JvdW5kID0gdGhpcy5iY29sb3I7XG5cdCAgICB0aGlzLmNbMl0udGV4dENvbnRlbnQgPSBUb29scy5odG1sVG9IZXgoIHRoaXMuYmNvbG9yICk7XG5cblx0ICAgIHRoaXMuaW52ZXJ0ID0gVG9vbHMuZmluZERlZXBJbnZlciggdGhpcy5yZ2IgKTtcblx0ICAgIHRoaXMuc1syXS5jb2xvciA9IHRoaXMuaW52ZXJ0ID8gJyNmZmYnIDogJyMwMDAnO1xuXG5cdCAgICBpZighdXApIHJldHVybjtcblxuXHQgICAgaWYoIHRoaXMuY3R5cGUgPT09ICdhcnJheScgKSB0aGlzLnNlbmQoIHRoaXMucmdiICk7XG5cdCAgICBpZiggdGhpcy5jdHlwZSA9PT0gJ3JnYicgKSB0aGlzLnNlbmQoIFRvb2xzLmh0bWxSZ2IoIHRoaXMucmdiICkgKTtcblx0ICAgIGlmKCB0aGlzLmN0eXBlID09PSAnaGV4JyApIHRoaXMuc2VuZCggVG9vbHMuaHRtbFRvSGV4KCB0aGlzLnZhbHVlICkgKTtcblx0ICAgIGlmKCB0aGlzLmN0eXBlID09PSAnaHRtbCcgKSB0aGlzLnNlbmQoKTtcblxuXHR9LFxuXG5cdHNldENvbG9yOiBmdW5jdGlvbiggY29sb3IgKXtcblxuXHQgICAgdmFyIHVucGFjayA9IFRvb2xzLnVucGFjayhjb2xvcik7XG5cdCAgICBpZiAodGhpcy5iY29sb3IgIT0gY29sb3IgJiYgdW5wYWNrKSB7XG5cdCAgICAgICAgdGhpcy5iY29sb3IgPSBjb2xvcjtcblx0ICAgICAgICB0aGlzLnJnYiA9IHVucGFjaztcblx0ICAgICAgICB0aGlzLmhzbCA9IFRvb2xzLnJnYlRvSHNsKCB0aGlzLnJnYiApO1xuXHQgICAgICAgIHRoaXMudXBkYXRlKCk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gdGhpcztcblxuXHR9LFxuXG5cdHNldEhTTDogZnVuY3Rpb24oIGhzbCApe1xuXG5cdCAgICB0aGlzLmhzbCA9IGhzbDtcblx0ICAgIHRoaXMucmdiID0gVG9vbHMuaHNsVG9SZ2IoIGhzbCApO1xuXHQgICAgdGhpcy5iY29sb3IgPSBUb29scy5yZ2JUb0hleCggdGhpcy5yZ2IgKTtcblx0ICAgIHRoaXMudXBkYXRlKCB0cnVlICk7XG5cdCAgICByZXR1cm4gdGhpcztcblxuXHR9LFxuXG5cdGNhbGN1bGF0ZU1hc2s6IGZ1bmN0aW9uKCBzaXpleCwgc2l6ZXksIG91dHB1dFBpeGVsICl7XG5cblx0ICAgIHZhciBpc3ggPSAxIC8gc2l6ZXgsIGlzeSA9IDEgLyBzaXpleTtcblx0ICAgIGZvciAodmFyIHkgPSAwOyB5IDw9IHNpemV5OyArK3kpIHtcblx0ICAgICAgICB2YXIgbCA9IDEgLSB5ICogaXN5O1xuXHQgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDw9IHNpemV4OyArK3gpIHtcblx0ICAgICAgICAgICAgdmFyIHMgPSAxIC0geCAqIGlzeDtcblx0ICAgICAgICAgICAgdmFyIGEgPSAxIC0gMiAqIE1hdGgubWluKGwgKiBzLCAoMSAtIGwpICogcyk7XG5cdCAgICAgICAgICAgIHZhciBjID0gKGEgPiAwKSA/ICgoMiAqIGwgLSAxICsgYSkgKiAuNSAvIGEpIDogMDtcblx0ICAgICAgICAgICAgb3V0cHV0UGl4ZWwoeCwgeSwgYywgYSk7XG5cdCAgICAgICAgfVxuXHQgICAgfVxuXG5cdH0sXG5cblx0ZHJhd01hc2s6IGZ1bmN0aW9uKCl7XG5cblx0ICAgIHZhciBzaXplID0gdGhpcy5zcXVhcmUgKiAyLCBzcSA9IHRoaXMuc3F1YXJlO1xuXHQgICAgdmFyIHN6ID0gTWF0aC5mbG9vcihzaXplIC8gMik7XG5cdCAgICB2YXIgYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cdCAgICBidWZmZXIud2lkdGggPSBidWZmZXIuaGVpZ2h0ID0gc3ogKyAxO1xuXHQgICAgdmFyIGN0eCA9IGJ1ZmZlci5nZXRDb250ZXh0KCcyZCcpO1xuXHQgICAgdmFyIGZyYW1lID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBzeiArIDEsIHN6ICsgMSk7XG5cblx0ICAgIHZhciBpID0gMDtcblx0ICAgIHRoaXMuY2FsY3VsYXRlTWFzayhzeiwgc3osIGZ1bmN0aW9uICh4LCB5LCBjLCBhKSB7XG5cdCAgICAgICAgZnJhbWUuZGF0YVtpKytdID0gZnJhbWUuZGF0YVtpKytdID0gZnJhbWUuZGF0YVtpKytdID0gYyAqIDI1NTtcblx0ICAgICAgICBmcmFtZS5kYXRhW2krK10gPSBhICogMjU1O1xuXHQgICAgfSk7XG5cblx0ICAgIGN0eC5wdXRJbWFnZURhdGEoZnJhbWUsIDAsIDApO1xuXHQgICAgdGhpcy5jdHhNYXNrLmRyYXdJbWFnZShidWZmZXIsIDAsIDAsIHN6ICsgMSwgc3ogKyAxLCAtc3EsIC1zcSwgc3EgKiAyLCBzcSAqIDIpO1xuXG5cdH0sXG5cblx0ZHJhd0NpcmNsZTogZnVuY3Rpb24oKXtcblxuXHQgICAgdmFyIG4gPSAyNCxyID0gdGhpcy5jb2xvclJhZGl1cywgdyA9IHRoaXMud2hlZWxXaWR0aCwgbnVkZ2UgPSA4IC8gciAvIG4gKiBNYXRoLlBJLCBtID0gdGhpcy5jdHhNYXNrLCBhMSA9IDAsIGNvbG9yMSwgZDE7XG5cdCAgICB2YXIgeW0sIGFtLCB0YW4sIHhtLCBjb2xvcjIsIGQyLCBhMiwgYXI7XG5cdCAgICBtLnNhdmUoKTtcblx0ICAgIG0ubGluZVdpZHRoID0gdyAvIHI7XG5cdCAgICBtLnNjYWxlKHIsIHIpO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gbjsgKytpKSB7XG5cdCAgICAgICAgZDIgPSBpIC8gbjtcblx0ICAgICAgICBhMiA9IGQyICogTWF0aC5QSSAqIDI7XG5cdCAgICAgICAgYXIgPSBbTWF0aC5zaW4oYTEpLCAtTWF0aC5jb3MoYTEpLCBNYXRoLnNpbihhMiksIC1NYXRoLmNvcyhhMildO1xuXHQgICAgICAgIGFtID0gKGExICsgYTIpICogMC41O1xuXHQgICAgICAgIHRhbiA9IDEgLyBNYXRoLmNvcygoYTIgLSBhMSkgKiAwLjUpO1xuXHQgICAgICAgIHhtID0gTWF0aC5zaW4oYW0pICogdGFuLCB5bSA9IC1NYXRoLmNvcyhhbSkgKiB0YW47XG5cdCAgICAgICAgY29sb3IyID0gVG9vbHMucmdiVG9IZXgoIFRvb2xzLmhzbFRvUmdiKFtkMiwgMSwgMC41XSkgKTtcblx0ICAgICAgICBpZiAoaSA+IDApIHtcblx0ICAgICAgICAgICAgdmFyIGdyYWQgPSBtLmNyZWF0ZUxpbmVhckdyYWRpZW50KGFyWzBdLCBhclsxXSwgYXJbMl0sIGFyWzNdKTtcblx0ICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMCwgY29sb3IxKTtcblx0ICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMSwgY29sb3IyKTtcblx0ICAgICAgICAgICAgbS5zdHJva2VTdHlsZSA9IGdyYWQ7XG5cdCAgICAgICAgICAgIG0uYmVnaW5QYXRoKCk7XG5cdCAgICAgICAgICAgIG0ubW92ZVRvKGFyWzBdLCBhclsxXSk7XG5cdCAgICAgICAgICAgIG0ucXVhZHJhdGljQ3VydmVUbyh4bSwgeW0sIGFyWzJdLCBhclszXSk7XG5cdCAgICAgICAgICAgIG0uc3Ryb2tlKCk7XG5cdCAgICAgICAgfVxuXHQgICAgICAgIGExID0gYTIgLSBudWRnZTsgXG5cdCAgICAgICAgY29sb3IxID0gY29sb3IyO1xuXHQgICAgICAgIGQxID0gZDI7XG5cdCAgICB9XG5cdCAgICBtLnJlc3RvcmUoKTtcblxuXHR9LFxuXG5cdGRyYXdNYXJrZXJzOiBmdW5jdGlvbigpe1xuXG5cdCAgICB2YXIgbSA9IHRoaXMubWFya2VyU2l6ZSwgcmE9dGhpcy5jb2xvclJhZGl1cywgc3ogPSB0aGlzLnd3LCBsdyA9IE1hdGguY2VpbChtLyA0KSwgciA9IG0gLSBsdyArIDEsIGMxID0gdGhpcy5pbnZlcnQgPyAnI2ZmZicgOiAnIzAwMCcsIGMyID0gdGhpcy5pbnZlcnQgPyAnIzAwMCcgOiAnI2ZmZic7XG5cdCAgICB2YXIgYW5nbGUgPSB0aGlzLmhzbFswXSAqIDYuMjg7XG5cdCAgICB2YXIgYXIgPSBbTWF0aC5zaW4oYW5nbGUpICogcmEsIC1NYXRoLmNvcyhhbmdsZSkgKiByYSwgMiAqIHRoaXMuc3F1YXJlICogKC41IC0gdGhpcy5oc2xbMV0pLCAyICogdGhpcy5zcXVhcmUgKiAoLjUgLSB0aGlzLmhzbFsyXSkgXTtcblx0ICBcblx0ICAgIHZhciBjaXJjbGVzID0gW1xuXHQgICAgICAgIHsgeDogYXJbMl0sIHk6IGFyWzNdLCByOiBtLCBjOiBjMSwgICAgIGx3OiBsdyB9LFxuXHQgICAgICAgIHsgeDogYXJbMl0sIHk6IGFyWzNdLCByOiByLCBjOiBjMiwgICAgIGx3OiBsdyArIDEgfSxcblx0ICAgICAgICB7IHg6IGFyWzBdLCB5OiBhclsxXSwgcjogbSwgYzogJyNmZmYnLCBsdzogbHcgfSxcblx0ICAgICAgICB7IHg6IGFyWzBdLCB5OiBhclsxXSwgcjogciwgYzogJyMwMDAnLCBsdzogbHcgKyAxIH0sXG5cdCAgICBdO1xuXHQgICAgdGhpcy5jdHhPdmVybGF5LmNsZWFyUmVjdCgtdGhpcy5taWQsIC10aGlzLm1pZCwgc3osIHN6KTtcblx0ICAgIHZhciBpID0gY2lyY2xlcy5sZW5ndGg7XG5cdCAgICB3aGlsZShpLS0pe1xuXHQgICAgICAgIHZhciBjID0gY2lyY2xlc1tpXTtcblx0ICAgICAgICB0aGlzLmN0eE92ZXJsYXkubGluZVdpZHRoID0gYy5sdztcblx0ICAgICAgICB0aGlzLmN0eE92ZXJsYXkuc3Ryb2tlU3R5bGUgPSBjLmM7XG5cdCAgICAgICAgdGhpcy5jdHhPdmVybGF5LmJlZ2luUGF0aCgpO1xuXHQgICAgICAgIHRoaXMuY3R4T3ZlcmxheS5hcmMoYy54LCBjLnksIGMuciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuXHQgICAgICAgIHRoaXMuY3R4T3ZlcmxheS5zdHJva2UoKTtcblx0ICAgIH1cblxuXHR9LFxuXG5cdHJTaXplOiBmdW5jdGlvbigpe1xuXG5cdCAgICBQcm90by5wcm90b3R5cGUuclNpemUuY2FsbCggdGhpcyApO1xuXG5cdCAgICB0aGlzLnd3ID0gdGhpcy5zYjtcblx0ICAgIHRoaXMud2hlZWxXaWR0aCA9IHRoaXMud3cqMC4xO1xuXG5cdCAgICBpZiggdGhpcy5zaWRlID09PSAndXAnICkgdGhpcy5kZWNhbCA9IDU7XG5cdCAgICB0aGlzLmNvbG9yUmFkaXVzID0gKHRoaXMud3cgLSB0aGlzLndoZWVsV2lkdGgpICogMC41IC0gMTtcblx0ICAgIHRoaXMuc3F1YXJlID0gTWF0aC5mbG9vcigodGhpcy5jb2xvclJhZGl1cyAtIHRoaXMud2hlZWxXaWR0aCAqIDAuNSkgKiAwLjcpIC0gMTtcblx0ICAgIHRoaXMubWlkID0gTWF0aC5mbG9vcih0aGlzLnd3ICogMC41ICk7XG5cdCAgICB0aGlzLm1hcmtlclNpemUgPSB0aGlzLndoZWVsV2lkdGggKiAwLjM7XG5cblx0ICAgIHZhciBzID0gdGhpcy5zO1xuXG5cdCAgICBzWzJdLndpZHRoID0gdGhpcy5zYiArICdweCc7XG5cdCAgICBzWzJdLmxlZnQgPSB0aGlzLnNhICsgJ3B4JztcblxuXHQgICAgc1szXS53aWR0aCA9ICh0aGlzLnNxdWFyZSAqIDIgLSAxKSArICdweCc7XG5cdCAgICBzWzNdLmhlaWdodCA9ICh0aGlzLnNxdWFyZSAqIDIgLSAxKSArICdweCc7XG5cdCAgICBzWzNdLnRvcCA9ICh0aGlzLm1pZCt0aGlzLmRlY2FsICktdGhpcy5zcXVhcmUgKyAncHgnO1xuXHQgICAgc1szXS5sZWZ0ID0gKHRoaXMubWlkK3RoaXMuc2EgKS10aGlzLnNxdWFyZSArICdweCc7XG5cblx0ICAgIHRoaXMuY1s0XS53aWR0aCA9IHRoaXMuY1s0XS5oZWlnaHQgPSB0aGlzLnd3O1xuXHQgICAgc1s0XS5sZWZ0ID0gdGhpcy5zYSArICdweCc7XG5cdCAgICBzWzRdLnRvcCA9IHRoaXMuZGVjYWwgKyAncHgnO1xuXG5cdCAgICB0aGlzLmNbNV0ud2lkdGggPSB0aGlzLmNbNV0uaGVpZ2h0ID0gdGhpcy53dztcblx0ICAgIHNbNV0ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuXHQgICAgc1s1XS50b3AgPSB0aGlzLmRlY2FsICsgJ3B4JztcblxuXHQgICAgdGhpcy5jdHhNYXNrLnRyYW5zbGF0ZSh0aGlzLm1pZCwgdGhpcy5taWQpO1xuXHQgICAgdGhpcy5jdHhPdmVybGF5LnRyYW5zbGF0ZSh0aGlzLm1pZCwgdGhpcy5taWQpO1xuXG5cdCAgICBpZiggdGhpcy5pc09wZW4gKXsgXG5cdCAgICAgICAgdGhpcy5yZWRyYXcoKTtcblxuXHQgICAgICAgIC8vdGhpcy5vcGVuKCk7XG5cdCAgICAgICAgLy90aGlzLmggPSB0aGlzLnd3KzMwO1xuXHQgICAgICAgIC8vdGhpcy5jWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG5cdCAgICAgICAgLy9pZiggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNhbGMoKTtcblx0ICAgIH1cblxuXHR9XG5cbn0gKTtcblxuZnVuY3Rpb24gRnBzICggbyApIHtcblxuICAgIFByb3RvLmNhbGwoIHRoaXMsIG8gKTtcblxuICAgIHRoaXMucm91bmQgPSBNYXRoLnJvdW5kO1xuXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gdHJ1ZTtcblxuICAgIHRoaXMuYmFzZUggPSB0aGlzLmg7XG4gICAgdGhpcy5ocGx1cyA9IDUwO1xuXG4gICAgdGhpcy5yZXMgPSBvLnJlcyB8fCA0MDtcbiAgICB0aGlzLmwgPSAxO1xuXG4gICAgdGhpcy5wYTEgPSBbXTtcbiAgICB0aGlzLnBhMiA9IFtdO1xuICAgIHRoaXMucGEzID0gW107XG5cbiAgICB2YXIgaSA9IHRoaXMucmVzKzE7XG4gICAgd2hpbGUoaS0tKXtcbiAgICAgICAgdGhpcy5wYTEucHVzaCg1MCk7XG4gICAgICAgIHRoaXMucGEyLnB1c2goNTApO1xuICAgICAgICB0aGlzLnBhMy5wdXNoKDUwKTtcbiAgICB9XG5cbiAgICB2YXIgZmx0b3AgPSBNYXRoLmZsb29yKHRoaXMuaCowLjUpLTY7XG5cbiAgICB0aGlzLmNbMV0udGV4dENvbnRlbnQgPSAnRlBTJztcbiAgICB0aGlzLmNbMF0uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xuICAgIHRoaXMuY1swXS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ2F1dG8nO1xuXG4gICAgdmFyIHBhbmVsQ3NzID0gJ2Rpc3BsYXk6bm9uZTsgbGVmdDoxMHB4OyB0b3A6JysgdGhpcy5oICsgJ3B4OyBoZWlnaHQ6JysodGhpcy5ocGx1cyAtIDgpKydweDsgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjIpOycgKyAnYm9yZGVyOjFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7ICc7XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdwYXRoJywgVG9vbHMuY3NzLmJhc2ljICsgcGFuZWxDc3MgLCB7IGZpbGw6J3JnYmEoMjAwLDIwMCwyMDAsMC4zKScsICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTp0aGlzLmZvbnRDb2xvciwgJ3ZlY3Rvci1lZmZlY3QnOidub24tc2NhbGluZy1zdHJva2UnIH0pO1xuXG4gICAgdGhpcy5jWzJdLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgJyt0aGlzLnJlcysnIDQyJyApO1xuICAgIHRoaXMuY1syXS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcxMDAlJyApO1xuICAgIHRoaXMuY1syXS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzEwMCUnICk7XG4gICAgdGhpcy5jWzJdLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICdub25lJyApO1xuXG4gICAgVG9vbHMuZG9tKCAncGF0aCcsIG51bGwsIHsgZmlsbDoncmdiYSgyNTUsMjU1LDAsMC4zKScsICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTonI0ZGMCcsICd2ZWN0b3ItZWZmZWN0Jzonbm9uLXNjYWxpbmctc3Ryb2tlJyB9LCB0aGlzLmNbMl0gKTtcbiAgICBUb29scy5kb20oICdwYXRoJywgbnVsbCwgeyBmaWxsOidyZ2JhKDAsMjU1LDI1NSwwLjMpJywgJ3N0cm9rZS13aWR0aCc6MSwgc3Ryb2tlOicjMEZGJywgJ3ZlY3Rvci1lZmZlY3QnOidub24tc2NhbGluZy1zdHJva2UnIH0sIHRoaXMuY1syXSApO1xuXG5cbiAgICAvLyBib3R0b20gbGluZVxuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICd3aWR0aDoxMDAlOyBib3R0b206MHB4OyBoZWlnaHQ6MXB4OyBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7Jyk7XG5cbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdwYXRoJywgVG9vbHMuY3NzLmJhc2ljICsgJ3Bvc2l0aW9uOmFic29sdXRlOyB3aWR0aDoxMHB4OyBoZWlnaHQ6MTBweDsgbGVmdDo0cHg7IHRvcDonK2ZsdG9wKydweDsnLCB7IGQ6J00gMyA4IEwgOCA1IDMgMiAzIDggWicsIGZpbGw6dGhpcy5mb250Q29sb3IsIHN0cm9rZTonbm9uZSd9KTtcblxuICAgIHRoaXMuaXNTaG93ID0gby5zaG93IHx8IGZhbHNlO1xuXG4gICAgdGhpcy5jWzFdLnN0eWxlLm1hcmdpbkxlZnQgPSAnMTBweCc7XG5cbiAgICB0aGlzLm5vdyA9ICggc2VsZi5wZXJmb3JtYW5jZSAmJiBzZWxmLnBlcmZvcm1hbmNlLm5vdyApID8gc2VsZi5wZXJmb3JtYW5jZS5ub3cuYmluZCggcGVyZm9ybWFuY2UgKSA6IERhdGUubm93O1xuICAgIHRoaXMuc3RhcnRUaW1lID0gdGhpcy5ub3coKTtcbiAgICB0aGlzLnByZXZUaW1lID0gdGhpcy5zdGFydFRpbWU7XG4gICAgdGhpcy5mcmFtZXMgPSAwO1xuXG4gICAgdGhpcy5pc01lbSA9IGZhbHNlO1xuXG4gICAgdGhpcy5tcyA9IDA7XG4gICAgdGhpcy5mcHMgPSAwO1xuICAgIHRoaXMubWVtID0gMDtcbiAgICB0aGlzLm1tID0gMDtcblxuICAgIGlmICggc2VsZi5wZXJmb3JtYW5jZSAmJiBzZWxmLnBlcmZvcm1hbmNlLm1lbW9yeSApIHRoaXMuaXNNZW0gPSB0cnVlO1xuXG4gICAgdGhpcy5jWzBdLmV2ZW50cyA9IFsgJ2NsaWNrJywgJ21vdXNlZG93bicsICdtb3VzZW92ZXInLCAnbW91c2VvdXQnIF07XG5cbiAgICB0aGlzLmluaXQoKTtcblxuICAgIC8vaWYoIHRoaXMuaXNTaG93ICkgdGhpcy5zaG93KCk7XG5cbn1cblxuXG5GcHMucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBGcHMsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzogdGhpcy5jbGljayhlKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW92ZXInOiB0aGlzLm1vZGUoMSk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogdGhpcy5tb2RlKDIpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlb3V0JzogIHRoaXMubW9kZSgwKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtb2RlOiBmdW5jdGlvbiAoIG1vZGUgKSB7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG5cbiAgICAgICAgc3dpdGNoKG1vZGUpe1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBiYXNlXG4gICAgICAgICAgICAgICAgc1sxXS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICAgICAgICAgIC8vc1sxXS5iYWNrZ3JvdW5kID0gJ25vbmUnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6IC8vIG92ZXJcbiAgICAgICAgICAgICAgICBzWzFdLmNvbG9yID0gJyNGRkYnO1xuICAgICAgICAgICAgICAgIC8vc1sxXS5iYWNrZ3JvdW5kID0gVUlMLlNFTEVDVDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiAvLyBlZGl0IC8gZG93blxuICAgICAgICAgICAgICAgIHNbMV0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICAvL3NbMV0uYmFja2dyb3VuZCA9IFVJTC5TRUxFQ1RET1dOO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjbGljazogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGlmKCB0aGlzLmlzU2hvdyApIHRoaXMuaGlkZSgpO1xuICAgICAgICBlbHNlIHRoaXMuc2hvdygpO1xuXG4gICAgfSxcblxuICAgIG1ha2VQYXRoOiBmdW5jdGlvbiAoIHBvaW50ICkge1xuXG4gICAgICAgIHZhciBwID0gJyc7XG4gICAgICAgIHAgKz0gJ00gJyArICgtMSkgKyAnICcgKyA1MDtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgdGhpcy5yZXMgKyAxOyBpICsrICkgeyBwICs9ICcgTCAnICsgaSArICcgJyArIHBvaW50W2ldOyB9XG4gICAgICAgIHAgKz0gJyBMICcgKyAodGhpcy5yZXMgKyAxKSArICcgJyArIDUwO1xuXG4gICAgICAgIHJldHVybiBwO1xuXG4gICAgfSxcblxuICAgIGRyYXdHcmFwaDogZnVuY3Rpb24oICl7XG5cbiAgICAgICAgdmFyIHN2ZyA9IHRoaXMuY1syXTtcblxuICAgICAgICB0aGlzLnBhMS5zaGlmdCgpO1xuICAgICAgICB0aGlzLnBhMS5wdXNoKCA4LjUgKyB0aGlzLnJvdW5kKCAoIDEgLSAodGhpcy5mcHMgLyAxMDApKSAqIDMwICkgKTtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHN2ZywgJ2QnLCB0aGlzLm1ha2VQYXRoKCB0aGlzLnBhMSApLCAwICk7XG5cbiAgICAgICAgdGhpcy5wYTIuc2hpZnQoKTtcbiAgICAgICAgdGhpcy5wYTIucHVzaCggOC41ICsgdGhpcy5yb3VuZCggKCAxIC0gKHRoaXMubXMgLyAyMDApKSAqIDMwICkgKTtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHN2ZywgJ2QnLCB0aGlzLm1ha2VQYXRoKCB0aGlzLnBhMiApLCAxICk7XG5cbiAgICAgICAgaWYgKCB0aGlzLmlzTWVtICkge1xuXG4gICAgICAgICAgICB0aGlzLnBhMy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5wYTMucHVzaCggOC41ICsgdGhpcy5yb3VuZCggKCAxIC0gdGhpcy5tbSkgKiAzMCApICk7XG5cbiAgICAgICAgICAgIFRvb2xzLnNldFN2Zyggc3ZnLCAnZCcsIHRoaXMubWFrZVBhdGgoIHRoaXMucGEzICksIDIgKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgc2hvdzogZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmggPSB0aGlzLmhwbHVzICsgdGhpcy5iYXNlSDtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2QnLCdNIDUgOCBMIDggMyAyIDMgNSA4IFonKTtcblxuXG4gICAgICAgIGlmKCB0aGlzLnBhcmVudEdyb3VwICE9PSBudWxsICl7IHRoaXMucGFyZW50R3JvdXAuY2FsYyggdGhpcy5ocGx1cyApO31cbiAgICAgICAgZWxzZSBpZiggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNhbGMoIHRoaXMuaHBsdXMgKTtcblxuICAgICAgICB0aGlzLnNbMF0uaGVpZ2h0ID0gdGhpcy5oICsncHgnO1xuICAgICAgICB0aGlzLnNbMl0uZGlzcGxheSA9ICdibG9jayc7IFxuICAgICAgICB0aGlzLmlzU2hvdyA9IHRydWU7XG5cbiAgICAgICAgVG9vbHMuYWRkTGlzdGVuKCB0aGlzICk7XG5cbiAgICB9LFxuXG4gICAgaGlkZTogZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmggPSB0aGlzLmJhc2VIO1xuXG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnZCcsJ00gMyA4IEwgOCA1IDMgMiAzIDggWicpO1xuXG4gICAgICAgIGlmKCB0aGlzLnBhcmVudEdyb3VwICE9PSBudWxsICl7IHRoaXMucGFyZW50R3JvdXAuY2FsYyggLXRoaXMuaHBsdXMgKTt9XG4gICAgICAgIGVsc2UgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCAtdGhpcy5ocGx1cyApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArJ3B4JztcbiAgICAgICAgdGhpcy5zWzJdLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuaXNTaG93ID0gZmFsc2U7XG5cbiAgICAgICAgVG9vbHMucmVtb3ZlTGlzdGVuKCB0aGlzICk7XG4gICAgICAgIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9ICdGUFMnO1xuICAgICAgICBcbiAgICB9LFxuXG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgYmVnaW46IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLm5vdygpO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgZW5kOiBmdW5jdGlvbigpe1xuXG5cbiAgICAgICAgdmFyIHRpbWUgPSB0aGlzLm5vdygpO1xuICAgICAgICB0aGlzLm1zID0gdGltZSAtIHRoaXMuc3RhcnRUaW1lO1xuXG4gICAgICAgIHRoaXMuZnJhbWVzICsrO1xuXG4gICAgICAgIGlmICggdGltZSA+IHRoaXMucHJldlRpbWUgKyAxMDAwICkge1xuXG4gICAgICAgICAgICB0aGlzLmZwcyA9IHRoaXMucm91bmQoICggdGhpcy5mcmFtZXMgKiAxMDAwICkgLyAoIHRpbWUgLSB0aGlzLnByZXZUaW1lICkgKTtcblxuICAgICAgICAgICAgdGhpcy5wcmV2VGltZSA9IHRpbWU7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcyA9IDA7XG5cbiAgICAgICAgICAgIGlmICggdGhpcy5pc01lbSApIHtcblxuICAgICAgICAgICAgICAgIHZhciBoZWFwU2l6ZSA9IHBlcmZvcm1hbmNlLm1lbW9yeS51c2VkSlNIZWFwU2l6ZTtcbiAgICAgICAgICAgICAgICB2YXIgaGVhcFNpemVMaW1pdCA9IHBlcmZvcm1hbmNlLm1lbW9yeS5qc0hlYXBTaXplTGltaXQ7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1lbSA9IHRoaXMucm91bmQoIGhlYXBTaXplICogMC4wMDAwMDA5NTQgKTtcblxuICAgICAgICAgICAgICAgIHRoaXMubW0gPSBoZWFwU2l6ZSAvIGhlYXBTaXplTGltaXQ7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmF3R3JhcGgoKTtcbiAgICAgICAgdGhpcy5jWzFdLmlubmVySFRNTCA9ICdGUFMgJyArIHRoaXMuZnBzICsgJzxmb250IGNvbG9yPVwieWVsbG93XCI+IE1TICcrICggdGhpcy5tcyB8IDAgKSArICc8L2ZvbnQ+PGZvbnQgY29sb3I9XCJjeWFuXCI+IE1CICcrIHRoaXMubWVtICsgJzwvZm9udD4nO1xuXG4gICAgICAgIHJldHVybiB0aW1lO1xuXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBsaXN0ZW5pbmc6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zdGFydFRpbWUgPSB0aGlzLmVuZCgpO1xuICAgICAgICBcbiAgICB9LFxuXG5cbiAgICByU2l6ZTogZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLnNbMF0ud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgICAgICAgdGhpcy5zWzFdLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gICAgICAgIHRoaXMuc1syXS5sZWZ0ID0gMTAgKyAncHgnO1xuICAgICAgICB0aGlzLnNbMl0ud2lkdGggPSAodGhpcy53aWR0aC0yMCkgKyAncHgnO1xuICAgICAgICBcbiAgICB9LFxuICAgIFxufSApO1xuXG5mdW5jdGlvbiBHcm91cCAoIG8gKSB7XG4gXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy5hdXRvSGVpZ2h0ID0gdHJ1ZTtcbiAgICB0aGlzLmlzR3JvdXAgPSB0cnVlO1xuXG4gICAgLy90aGlzLmJnID0gby5iZyB8fCBudWxsO1xuICAgIFxuXG4gICAgLy90aGlzLmggPSAyNTtcbiAgICB0aGlzLmJhc2VIID0gdGhpcy5oO1xuICAgIHZhciBmbHRvcCA9IE1hdGguZmxvb3IodGhpcy5oKjAuNSktNjtcblxuXG4gICAgdGhpcy5pc0xpbmUgPSBvLmxpbmUgIT09IHVuZGVmaW5lZCA/IG8ubGluZSA6IGZhbHNlO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3dpZHRoOjEwMCU7IGxlZnQ6MDsgaGVpZ2h0OmF1dG87IG92ZXJmbG93OmhpZGRlbjsgdG9wOicrdGhpcy5oKydweCcpO1xuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ3BhdGgnLCBUb29scy5jc3MuYmFzaWMgKyAncG9zaXRpb246YWJzb2x1dGU7IHdpZHRoOjEwcHg7IGhlaWdodDoxMHB4OyBsZWZ0OjA7IHRvcDonK2ZsdG9wKydweDsnLCB7IGQ6VG9vbHMuR1BBVEgsIGZpbGw6dGhpcy5mb250Q29sb3IsIHN0cm9rZTonbm9uZSd9KTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdwYXRoJywgVG9vbHMuY3NzLmJhc2ljICsgJ3Bvc2l0aW9uOmFic29sdXRlOyB3aWR0aDoxMHB4OyBoZWlnaHQ6MTBweDsgbGVmdDo0cHg7IHRvcDonK2ZsdG9wKydweDsnLCB7IGQ6J00gMyA4IEwgOCA1IDMgMiAzIDggWicsIGZpbGw6dGhpcy5mb250Q29sb3IsIHN0cm9rZTonbm9uZSd9KTtcbiAgICAvLyBib3R0b20gbGluZVxuICAgIGlmKHRoaXMuaXNMaW5lKSB0aGlzLmNbNV0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MuYmFzaWMgKyAgJ2JhY2tncm91bmQ6cmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpOyB3aWR0aDoxMDAlOyBsZWZ0OjA7IGhlaWdodDoxcHg7IGJvdHRvbTowcHgnKTtcblxuICAgIHZhciBzID0gdGhpcy5zO1xuXG4gICAgc1swXS5oZWlnaHQgPSB0aGlzLmggKyAncHgnO1xuICAgIHNbMV0uaGVpZ2h0ID0gdGhpcy5oICsgJ3B4JztcbiAgICAvL3NbMV0udG9wID0gNCArICdweCc7XG4gICAgLy9zWzFdLmxlZnQgPSA0ICsgJ3B4JztcbiAgICBzWzFdLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgc1sxXS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgdGhpcy5jWzFdLm5hbWUgPSAnZ3JvdXAnO1xuXG4gICAgdGhpcy5zWzFdLm1hcmdpbkxlZnQgPSAnMTBweCc7XG4gICAgdGhpcy5zWzFdLmxpbmVIZWlnaHQgPSB0aGlzLmgtNDtcbiAgICB0aGlzLnNbMV0uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICB0aGlzLnNbMV0uZm9udFdlaWdodCA9ICdib2xkJztcblxuICAgIHRoaXMudWlzID0gW107XG5cbiAgICB0aGlzLmNbMV0uZXZlbnRzID0gWyAnY2xpY2snIF07XG5cbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmKCBvLmJnICE9PSB1bmRlZmluZWQgKSB0aGlzLnNldEJHKG8uYmcpO1xuICAgIGlmKCBvLm9wZW4gIT09IHVuZGVmaW5lZCApIHRoaXMub3BlbigpO1xuXG59XG5cbkdyb3VwLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogR3JvdXAsXG5cbiAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnY2xpY2snOiB0aGlzLmNsaWNrKCBlICk7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG5cbiAgICBjbGljazogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGlmKCB0aGlzLmlzT3BlbiApIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB0aGlzLm9wZW4oKTtcblxuICAgIH0sXG5cbiAgICBzZXRCRzogZnVuY3Rpb24gKCBjICkge1xuXG4gICAgICAgIHRoaXMuc1swXS5iYWNrZ3JvdW5kID0gYztcblxuICAgICAgICB2YXIgaSA9IHRoaXMudWlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIHRoaXMudWlzW2ldLnNldEJHKCBjICk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBhZGQ6IGZ1bmN0aW9uKCApe1xuXG4gICAgICAgIHZhciBhID0gYXJndW1lbnRzO1xuXG4gICAgICAgIGlmKCB0eXBlb2YgYVsxXSA9PT0gJ29iamVjdCcgKXsgXG4gICAgICAgICAgICBhWzFdLmlzVUkgPSB0aGlzLmlzVUk7XG4gICAgICAgICAgICBhWzFdLnRhcmdldCA9IHRoaXMuY1syXTtcbiAgICAgICAgICAgIGFbMV0ubWFpbiA9IHRoaXMubWFpbjtcbiAgICAgICAgfSBlbHNlIGlmKCB0eXBlb2YgYXJndW1lbnRzWzFdID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIGFbMl0gPT09IHVuZGVmaW5lZCApIFtdLnB1c2guY2FsbChhLCB7IGlzVUk6dHJ1ZSwgdGFyZ2V0OnRoaXMuY1syXSwgbWFpbjp0aGlzLm1haW4gfSk7XG4gICAgICAgICAgICBlbHNleyBcbiAgICAgICAgICAgICAgICBhWzJdLmlzVUkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFbMl0udGFyZ2V0ID0gdGhpcy5jWzJdO1xuICAgICAgICAgICAgICAgIGFbMl0ubWFpbiA9IHRoaXMubWFpbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuID0gYWRkLmFwcGx5KCB0aGlzLCBhICk7XG4gICAgICAgIHRoaXMudWlzLnB1c2goIG4gKTtcblxuICAgICAgICBpZiggbi5hdXRvSGVpZ2h0ICkgbi5wYXJlbnRHcm91cCA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIG47XG5cbiAgICB9LFxuXG4gICAgb3BlbjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5vcGVuLmNhbGwoIHRoaXMgKTtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2QnLCdNIDUgOCBMIDggMyAyIDMgNSA4IFonKTtcbiAgICAgICAgLy90aGlzLnNbNF0uYmFja2dyb3VuZCA9IFVJTC5GMTtcbiAgICAgICAgdGhpcy5yU2l6ZUNvbnRlbnQoKTtcblxuICAgICAgICBpZiggdGhpcy5pc1VJICkgdGhpcy5tYWluLmNhbGMoIHRoaXMuaCAtIHRoaXMuYmFzZUggKTtcblxuICAgIH0sXG5cbiAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5jbG9zZS5jYWxsKCB0aGlzICk7XG5cbiAgICAgICAgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCAtKCB0aGlzLmggLSB0aGlzLmJhc2VIICkgKTtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1s0XSwgJ2QnLCdNIDMgOCBMIDggNSAzIDIgMyA4IFonKTtcbiAgICAgICAgdGhpcy5oID0gdGhpcy5iYXNlSDtcbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG5cbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5jbGVhckdyb3VwKCk7XG4gICAgICAgIGlmKCB0aGlzLmlzVUkgKSB0aGlzLm1haW4uY2FsYyggLSh0aGlzLmggKzEgKSk7XG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5jbGVhci5jYWxsKCB0aGlzICk7XG5cbiAgICB9LFxuXG4gICAgY2xlYXJHcm91cDogZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmNsb3NlKCk7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy51aXMucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51aXMgPSBbXTtcbiAgICAgICAgdGhpcy5oID0gdGhpcy5iYXNlSDtcblxuICAgIH0sXG5cbiAgICBjYWxjOiBmdW5jdGlvbiggeSApe1xuXG4gICAgICAgIGlmKCAhdGhpcy5pc09wZW4gKSByZXR1cm47XG5cbiAgICAgICAgaWYoIHkgIT09IHVuZGVmaW5lZCApeyBcbiAgICAgICAgICAgIHRoaXMuaCArPSB5O1xuICAgICAgICAgICAgaWYoIHRoaXMuaXNVSSApIHRoaXMubWFpbi5jYWxjKCB5ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmggPSB0aGlzLmNbMl0ub2Zmc2V0SGVpZ2h0ICsgdGhpcy5iYXNlSDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNbMF0uaGVpZ2h0ID0gdGhpcy5oICsgJ3B4JztcblxuICAgIH0sXG5cbiAgICByU2l6ZUNvbnRlbnQ6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5zZXRTaXplKCB0aGlzLndpZHRoICk7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5yU2l6ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2FsYygpO1xuXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG5cbiAgICAgICAgc1szXS5sZWZ0ID0gKCB0aGlzLnNhICsgdGhpcy5zYiAtIDE3ICkgKyAncHgnO1xuICAgICAgICBzWzFdLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gICAgICAgIHNbMl0ud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcblxuICAgICAgICBpZih0aGlzLmlzT3BlbikgdGhpcy5yU2l6ZUNvbnRlbnQoKTtcblxuICAgIH1cblxufSApO1xuXG5mdW5jdGlvbiBKb3lzdGljayAoIG8gKSB7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICB0aGlzLmF1dG9XaWR0aCA9IGZhbHNlO1xuXG4gICAgdGhpcy52YWx1ZSA9IFswLDBdO1xuXG4gICAgdGhpcy5qb3lUeXBlID0gJ2FuYWxvZ2lxdWUnO1xuXG4gICAgdGhpcy5wcmVjaXNpb24gPSBvLnByZWNpc2lvbiB8fCAyO1xuICAgIHRoaXMubXVsdGlwbGljYXRvciA9IG8ubXVsdGlwbGljYXRvciB8fCAxO1xuXG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuXG4gICAgdGhpcy5vbGR4ID0gMDtcbiAgICB0aGlzLm9sZHkgPSAwO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG5cbiAgICB0aGlzLnJhZGl1cyA9IE1hdGguZmxvb3IoKHRoaXMud2lkdGgtMjApKjAuNSk7XG5cbiAgICAvKnRoaXMucmFkaXVzID0gby5yYWRpdXMgfHwgNTA7XG5cbiAgICB0aGlzLndpZHRoID0gKHRoaXMucmFkaXVzKjIpKzIwO1xuXG4gICAgaWYoby53aWR0aCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IG8ud2lkdGg7XG4gICAgICAgIHRoaXMucmFkaXVzID0gfn4gKCggdGhpcy53aWR0aC0yMCApKjAuNSk7XG4gICAgfVxuICAgIGlmKG8uc2l6ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IG8uc2l6ZTtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB+fiAodGhpcy53aWR0aC0yMCkqMC41O1xuICAgIH0qL1xuXG4gICAgdGhpcy5pbm5lclJhZGl1cyA9IG8uaW5uZXJSYWRpdXMgfHwgdGhpcy5yYWRpdXMqMC42O1xuICAgIHRoaXMubWF4RGlzdGFuY2UgPSB0aGlzLnJhZGl1cyAtIHRoaXMuaW5uZXJSYWRpdXMgLSA1O1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5yYWRpdXMqMjtcbiAgICB0aGlzLmggPSBvLmhlaWdodCB8fCAodGhpcy5oZWlnaHQgKyA0MCk7XG5cbiAgICB0aGlzLnRvcCA9IDA7XG5cbiAgICB0aGlzLmNbMF0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuXG4gICAgaWYodGhpcy5jWzFdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICB0aGlzLmNbMV0uc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsncHgnO1xuICAgICAgICB0aGlzLmNbMV0uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgIHRoaXMudG9wID0gMjA7XG5cbiAgICB9XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OyAgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7JywgeyBjeDp0aGlzLnJhZGl1cywgY3k6dGhpcy5yYWRpdXMsIHI6dGhpcy5yYWRpdXMsIGZpbGw6J3VybCgjZ3JhZCknIH0pO1xuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2NpcmNsZScsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjBweDsgdG9wOicrKHRoaXMudG9wLTEwKSsncHg7IHdpZHRoOicrKHRoaXMudysyMCkrJ3B4OyBoZWlnaHQ6JysodGhpcy5oZWlnaHQrMjApKydweDsnLCB7IGN4OnRoaXMucmFkaXVzKzEwLCBjeTp0aGlzLnJhZGl1cysxMCwgcjp0aGlzLmlubmVyUmFkaXVzKzEwLCBmaWxsOid1cmwoI2dyYWRTKSd9KTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oICdjaXJjbGUnLCBUb29scy5jc3MuYmFzaWMgKyAnbGVmdDoxMHB4OyB0b3A6Jyt0aGlzLnRvcCsncHg7IHdpZHRoOicrdGhpcy53KydweDsgaGVpZ2h0OicrdGhpcy5oZWlnaHQrJ3B4OycsIHsgY3g6dGhpcy5yYWRpdXMsIGN5OnRoaXMucmFkaXVzLCByOnRoaXMuaW5uZXJSYWRpdXMsIGZpbGw6J3VybCgjZ3JhZEluKScsICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTonIzAwMCcgIH0pO1xuICAgIHRoaXMuY1s1XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHQgKyAndGV4dC1hbGlnbjpjZW50ZXI7IHRvcDonKyh0aGlzLmhlaWdodCsyMCkrJ3B4OyB3aWR0aDonK3RoaXMud2lkdGgrJ3B4OyBjb2xvcjonKyB0aGlzLmZvbnRDb2xvciApO1xuXG4gICAgLy8gZ3JhZGlhbiBiYWtncm91bmRcbiAgICB2YXIgc3ZnID0gdGhpcy5jWzJdO1xuICAgIFRvb2xzLmRvbSggJ2RlZnMnLCBudWxsLCB7fSwgc3ZnICk7XG4gICAgVG9vbHMuZG9tKCAncmFkaWFsR3JhZGllbnQnLCBudWxsLCB7aWQ6J2dyYWQnLCBjeDonNTAlJywgY3k6JzUwJScsIHI6JzUwJScsIGZ4Oic1MCUnLCBmeTonNTAlJyB9LCBzdmcsIDEgKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzQwJScsIHN0eWxlOidzdG9wLWNvbG9yOnJnYigwLDAsMCk7IHN0b3Atb3BhY2l0eTowLjM7JyB9LCBzdmcsIFsxLDBdICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0Oic4MCUnLCBzdHlsZTonc3RvcC1jb2xvcjpyZ2IoMCwwLDApOyBzdG9wLW9wYWNpdHk6MDsnIH0sIHN2ZywgWzEsMF0gKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzkwJScsIHN0eWxlOidzdG9wLWNvbG9yOnJnYig1MCw1MCw1MCk7IHN0b3Atb3BhY2l0eTowLjQ7JyB9LCBzdmcsIFsxLDBdICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0OicxMDAlJywgc3R5bGU6J3N0b3AtY29sb3I6cmdiKDUwLDUwLDUwKTsgc3RvcC1vcGFjaXR5OjA7JyB9LCBzdmcsIFsxLDBdICk7XG5cbiAgICAvLyBncmFkaWFuIHNoYWRvd1xuICAgIHN2ZyA9IHRoaXMuY1szXTtcbiAgICBUb29scy5kb20oICdkZWZzJywgbnVsbCwge30sIHN2ZyApO1xuICAgIFRvb2xzLmRvbSggJ3JhZGlhbEdyYWRpZW50JywgbnVsbCwge2lkOidncmFkUycsIGN4Oic1MCUnLCBjeTonNTAlJywgcjonNTAlJywgZng6JzUwJScsIGZ5Oic1MCUnIH0sIHN2ZywgMSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonNjAlJywgc3R5bGU6J3N0b3AtY29sb3I6cmdiKDAsMCwwKTsgc3RvcC1vcGFjaXR5OjAuNTsnIH0sIHN2ZywgWzEsMF0gKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzEwMCUnLCBzdHlsZTonc3RvcC1jb2xvcjpyZ2IoMCwwLDApOyBzdG9wLW9wYWNpdHk6MDsnIH0sIHN2ZywgWzEsMF0gKTtcblxuICAgIC8vIGdyYWRpYW4gc3RpY2tcblxuICAgIHZhciBjYzAgPSBbJ3JnYig0MCw0MCw0MCknLCAncmdiKDQ4LDQ4LDQ4KScsICdyZ2IoMzAsMzAsMzApJ107XG4gICAgdmFyIGNjMSA9IFsncmdiKDEsOTAsMTk3KScsICdyZ2IoMyw5NSwyMDcpJywgJ3JnYigwLDY1LDE2NyknXTtcblxuICAgIHN2ZyA9IHRoaXMuY1s0XTtcbiAgICBUb29scy5kb20oICdkZWZzJywgbnVsbCwge30sIHN2ZyApO1xuICAgIFRvb2xzLmRvbSggJ3JhZGlhbEdyYWRpZW50JywgbnVsbCwge2lkOidncmFkSW4nLCBjeDonNTAlJywgY3k6JzUwJScsIHI6JzUwJScsIGZ4Oic1MCUnLCBmeTonNTAlJyB9LCBzdmcsIDEgKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzMwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MwWzBdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwwXSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonNjAlJywgc3R5bGU6J3N0b3AtY29sb3I6JytjYzBbMV0rJzsgc3RvcC1vcGFjaXR5OjE7JyB9LCBzdmcsIFsxLDBdICApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonODAlJywgc3R5bGU6J3N0b3AtY29sb3I6JytjYzBbMV0rJzsgc3RvcC1vcGFjaXR5OjE7JyB9LCBzdmcsIFsxLDBdICApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonMTAwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MwWzJdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwwXSAgKTtcblxuICAgIFRvb2xzLmRvbSggJ3JhZGlhbEdyYWRpZW50JywgbnVsbCwge2lkOidncmFkSW4yJywgY3g6JzUwJScsIGN5Oic1MCUnLCByOic1MCUnLCBmeDonNTAlJywgZnk6JzUwJScgfSwgdGhpcy5jWzRdLCAxICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0OiczMCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMVswXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMV0gICk7XG4gICAgVG9vbHMuZG9tKCAnc3RvcCcsIG51bGwsIHsgb2Zmc2V0Oic2MCUnLCBzdHlsZTonc3RvcC1jb2xvcjonK2NjMVsxXSsnOyBzdG9wLW9wYWNpdHk6MTsnIH0sIHN2ZywgWzEsMV0gKTtcbiAgICBUb29scy5kb20oICdzdG9wJywgbnVsbCwgeyBvZmZzZXQ6JzgwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MxWzFdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwxXSApO1xuICAgIFRvb2xzLmRvbSggJ3N0b3AnLCBudWxsLCB7IG9mZnNldDonMTAwJScsIHN0eWxlOidzdG9wLWNvbG9yOicrY2MxWzJdKyc7IHN0b3Atb3BhY2l0eToxOycgfSwgc3ZnLCBbMSwxXSApO1xuXG4gICAgLy9jb25zb2xlLmxvZyggdGhpcy5jWzRdIClcblxuICAgIHRoaXMuY1s1XS50ZXh0Q29udGVudCA9ICd4JysgdGhpcy52YWx1ZVswXSArJyB5JyArIHRoaXMudmFsdWVbMV07XG5cbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAnbW91c2VvdmVyJywgJ21vdXNlZG93bicsICdtb3VzZW91dCcgXTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy51cGRhdGUoZmFsc2UpO1xufVxuXG5Kb3lzdGljay5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IEpveXN0aWNrLFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW92ZXInOiB0aGlzLm92ZXIoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLmRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW91dCc6ICB0aGlzLm91dCggZSApOyAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZXVwJzogICB0aGlzLnVwKCBlICk7ICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB0aGlzLm1vdmUoIGUgKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtb2RlOiBmdW5jdGlvbiAoIG1vZGUgKSB7XG5cbiAgICAgICAgc3dpdGNoKG1vZGUpe1xuICAgICAgICAgICAgY2FzZSAwOiAvLyBiYXNlXG4gICAgICAgICAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdmaWxsJywndXJsKCNncmFkSW4pJyk7XG4gICAgICAgICAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdzdHJva2UnLCAnIzAwMCcgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOiAvLyBvdmVyXG4gICAgICAgICAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdmaWxsJywgJ3VybCgjZ3JhZEluMiknICk7XG4gICAgICAgICAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbNF0sICdzdHJva2UnLCAncmdiYSgwLDAsMCwwKScgKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOiAvLyBlZGl0XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG92ZXI6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgdGhpcy5pc092ZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vZGUoMSk7XG5cbiAgICB9LFxuXG4gICAgb3V0OiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMuaXNEb3duKSByZXR1cm47XG4gICAgICAgIHRoaXMubW9kZSgwKTtcblxuICAgIH0sXG5cbiAgICB1cDogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpLCAxMCk7XG5cbiAgICAgICAgaWYodGhpcy5pc092ZXIpIHRoaXMubW9kZSgxKTtcbiAgICAgICAgZWxzZSB0aGlzLm1vZGUoMCk7XG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBkb3duOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIHRoaXMuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcblxuICAgICAgICB0aGlzLnJlY3QgPSB0aGlzLmNbMl0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMubW92ZSggZSApO1xuICAgICAgICB0aGlzLm1vZGUoIDIgKTtcblxuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgaWYoICF0aGlzLmlzRG93biApIHJldHVybjtcblxuICAgICAgICB2YXIgeCA9IHRoaXMucmFkaXVzIC0gKCBlLmNsaWVudFggLSB0aGlzLnJlY3QubGVmdCApO1xuICAgICAgICB2YXIgeSA9IHRoaXMucmFkaXVzIC0gKCBlLmNsaWVudFkgLSB0aGlzLnJlY3QudG9wICk7XG5cbiAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KCB4ICogeCArIHkgKiB5ICk7XG5cbiAgICAgICAgaWYgKCBkaXN0YW5jZSA+IHRoaXMubWF4RGlzdGFuY2UgKSB7XG4gICAgICAgICAgICB2YXIgYW5nbGUgPSBNYXRoLmF0YW4yKHgsIHkpO1xuICAgICAgICAgICAgeCA9IE1hdGguc2luKGFuZ2xlKSAqIHRoaXMubWF4RGlzdGFuY2U7XG4gICAgICAgICAgICB5ID0gTWF0aC5jb3MoYW5nbGUpICogdGhpcy5tYXhEaXN0YW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMueCA9IHggLyB0aGlzLm1heERpc3RhbmNlO1xuICAgICAgICB0aGlzLnkgPSB5IC8gdGhpcy5tYXhEaXN0YW5jZTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAoIHgsIHkgKSB7XG5cbiAgICAgICAgdGhpcy54ID0geCB8fCAwO1xuICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTVkcoKTtcblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uICggdXAgKSB7XG5cbiAgICAgICAgaWYodXAgPT09IHVuZGVmaW5lZCkgdXAgPSB0cnVlO1xuXG4gICAgICAgIGlmKCB0aGlzLmludGVydmFsICE9PSBudWxsICl7XG5cbiAgICAgICAgICAgIGlmKCAhdGhpcy5pc0Rvd24gKXtcbiAgICAgICAgICAgICAgICB0aGlzLnggKz0gKDAgLSB0aGlzLngpLzM7XG4gICAgICAgICAgICAgICAgdGhpcy55ICs9ICgwIC0gdGhpcy55KS8zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIHRoaXMueC50b0ZpeGVkKDIpID09PSB0aGlzLm9sZHgudG9GaXhlZCgyKSAmJiB0aGlzLnkudG9GaXhlZCgyKSA9PT0gdGhpcy5vbGR5LnRvRml4ZWQoMikpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMueCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTVkcoKTtcblxuICAgICAgICBpZiggdXAgKSB0aGlzLnNlbmQoKTtcblxuICAgICAgICBpZiggdGhpcy5pbnRlcnZhbCAhPT0gbnVsbCAmJiB0aGlzLnggPT09IDAgJiYgdGhpcy55ID09PSAwICl7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKCB0aGlzLmludGVydmFsICk7XG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHVwZGF0ZVNWRzogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciByeCA9IHRoaXMueCAqIHRoaXMubWF4RGlzdGFuY2U7XG4gICAgICAgIHZhciByeSA9IHRoaXMueSAqIHRoaXMubWF4RGlzdGFuY2U7XG4gICAgICAgIHZhciB4ID0gdGhpcy5yYWRpdXMgLSByeDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnJhZGl1cyAtIHJ5O1xuICAgICAgICB2YXIgc3ggPSB4ICsgKCgxLXRoaXMueCkqNSkgKyA1O1xuICAgICAgICB2YXIgc3kgPSB5ICsgKCgxLXRoaXMueSkqNSkgKyAxMDtcblxuICAgICAgICBUb29scy5zZXRTdmcoIHRoaXMuY1szXSwgJ2N4Jywgc3ggKTtcbiAgICAgICAgVG9vbHMuc2V0U3ZnKCB0aGlzLmNbM10sICdjeScsIHN5ICk7XG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnY3gnLCB4ICk7XG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAnY3knLCB5ICk7XG5cbiAgICAgICAgdGhpcy5vbGR4ID0gdGhpcy54O1xuICAgICAgICB0aGlzLm9sZHkgPSB0aGlzLnk7XG5cbiAgICAgICAgdGhpcy52YWx1ZVswXSA9IC0oIHRoaXMueCAqIHRoaXMubXVsdGlwbGljYXRvciApLnRvRml4ZWQoIHRoaXMucHJlY2lzaW9uICkgKiAxO1xuICAgICAgICB0aGlzLnZhbHVlWzFdID0gICggdGhpcy55ICogdGhpcy5tdWx0aXBsaWNhdG9yICkudG9GaXhlZCggdGhpcy5wcmVjaXNpb24gKSAqIDE7XG5cbiAgICAgICAgdGhpcy5jWzVdLnRleHRDb250ZW50ID0gJ3gnKyB0aGlzLnZhbHVlWzBdICsnIHknICsgdGhpcy52YWx1ZVsxXTtcblxuICAgIH0sXG5cbn0gKTtcblxuZnVuY3Rpb24gS25vYiAoIG8gKSB7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICAvL3RoaXMudHlwZSA9ICdrbm9iJztcbiAgICB0aGlzLmF1dG9XaWR0aCA9IGZhbHNlO1xuXG4gICAgdGhpcy5idXR0b25Db2xvciA9IFRvb2xzLmNvbG9ycy5idXR0b247XG5cbiAgICB0aGlzLnNldFR5cGVOdW1iZXIoIG8gKTtcblxuICAgIHRoaXMubVBJID0gTWF0aC5QSSAqIDAuODtcbiAgICB0aGlzLnRvRGVnID0gMTgwIC8gTWF0aC5QSTtcbiAgICB0aGlzLmNpclJhbmdlID0gdGhpcy5tUEkgKiAyO1xuXG4gICAgdGhpcy5yYWRpdXMgPSBNYXRoLmZsb29yKCh0aGlzLndpZHRoLTIwKSowLjUpO1xuXG4gICAgLyp0aGlzLnJhZGl1cyA9IG8ucmFkaXVzIHx8IDE1O1xuICAgIFxuICAgIHRoaXMud2lkdGggPSAodGhpcy5yYWRpdXMqMikrMjA7XG5cbiAgICBpZihvLndpZHRoICE9PSB1bmRlZmluZWQpe1xuICAgICAgICB0aGlzLndpZHRoID0gby53aWR0aDtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB+fiAodGhpcy53aWR0aC0yMCkqMC41O1xuICAgIH1cblxuICAgIGlmKG8uc2l6ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgdGhpcy53aWR0aCA9IG8uc2l6ZTtcbiAgICAgICAgdGhpcy5yYWRpdXMgPSB+fiAodGhpcy53aWR0aC0yMCkqMC41O1xuICAgIH0qL1xuXG4gICAgdGhpcy53ID0gdGhpcy5oZWlnaHQgPSB0aGlzLnJhZGl1cyAqIDI7XG4gICAgdGhpcy5oID0gby5oZWlnaHQgfHwgKHRoaXMuaGVpZ2h0ICsgNDApO1xuICAgIHRoaXMudG9wID0gMDtcblxuICAgIHRoaXMuY1swXS5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKydweCc7XG5cbiAgICBpZih0aGlzLmNbMV0gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgIHRoaXMuY1sxXS5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKydweCc7XG4gICAgICAgIHRoaXMuY1sxXS5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgdGhpcy50b3AgPSAyMDtcblxuICAgIH1cblxuICAgIHRoaXMucGVyY2VudCA9IDA7XG5cbiAgICB0aGlzLmNbMl0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0bnVtYmVyICsgJ3RleHQtYWxpZ246Y2VudGVyOyB0b3A6JysodGhpcy5oZWlnaHQrMjQpKydweDsgd2lkdGg6Jyt0aGlzLndpZHRoKydweDsgY29sb3I6JysgdGhpcy5mb250Q29sb3IgKTtcblxuICAgIHRoaXMuY1szXSA9IFRvb2xzLmRvbSggJ2NpcmNsZScsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjEwcHg7IHRvcDonK3RoaXMudG9wKydweDsgd2lkdGg6Jyt0aGlzLncrJ3B4OyBoZWlnaHQ6Jyt0aGlzLmhlaWdodCsncHg7ICBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsnLCB7IGN4OnRoaXMucmFkaXVzLCBjeTp0aGlzLnJhZGl1cywgcjp0aGlzLnJhZGl1cy00LCBmaWxsOidyZ2JhKDAsMCwwLDAuMyknIH0pO1xuICAgIHRoaXMuY1s0XSA9IFRvb2xzLmRvbSggJ2NpcmNsZScsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjEwcHg7IHRvcDonK3RoaXMudG9wKydweDsgd2lkdGg6Jyt0aGlzLncrJ3B4OyBoZWlnaHQ6Jyt0aGlzLmhlaWdodCsncHg7JywgeyBjeDp0aGlzLnJhZGl1cywgY3k6dGhpcy5yYWRpdXMqMC41LCByOjMsIGZpbGw6dGhpcy5mb250Q29sb3IgfSk7XG4gICAgdGhpcy5jWzVdID0gVG9vbHMuZG9tKCAncGF0aCcsIFRvb2xzLmNzcy5iYXNpYyArICdsZWZ0OjEwcHg7IHRvcDonK3RoaXMudG9wKydweDsgd2lkdGg6Jyt0aGlzLncrJ3B4OyBoZWlnaHQ6Jyt0aGlzLmhlaWdodCsncHg7JywgeyBkOnRoaXMubWFrZUdyYWQoKSwgJ3N0cm9rZS13aWR0aCc6MSwgc3Ryb2tlOlRvb2xzLmNvbG9ycy5zdHJva2UgfSk7XG4gICAgXG4gICAgVG9vbHMuZG9tKCAnY2lyY2xlJywgbnVsbCwgeyBjeDp0aGlzLnJhZGl1cywgY3k6dGhpcy5yYWRpdXMsIHI6dGhpcy5yYWRpdXMqMC43LCBmaWxsOnRoaXMuYnV0dG9uQ29sb3IsICdzdHJva2Utd2lkdGgnOjEsIHN0cm9rZTpUb29scy5jb2xvcnMuc3Ryb2tlIH0sIHRoaXMuY1szXSApO1xuXG4gICAgdGhpcy5jWzNdLmV2ZW50cyA9IFsgJ21vdXNlb3ZlcicsICdtb3VzZWRvd24nLCAnbW91c2VvdXQnIF07XG5cbiAgICB0aGlzLnIgPSAwO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG59XG5cbktub2IucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggQ2lyY3VsYXIucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBLbm9iLFxuXG4gICAgbW92ZTogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBpZiggIXRoaXMuaXNEb3duICkgcmV0dXJuO1xuXG4gICAgICAgIHZhciB4ID0gdGhpcy5yYWRpdXMgLSAoZS5jbGllbnRYIC0gdGhpcy5yZWN0LmxlZnQpO1xuICAgICAgICB2YXIgeSA9IHRoaXMucmFkaXVzIC0gKGUuY2xpZW50WSAtIHRoaXMucmVjdC50b3ApO1xuICAgICAgICB0aGlzLnIgPSAtIE1hdGguYXRhbjIoIHgsIHkgKTtcblxuICAgICAgICBpZiggdGhpcy5vbGRyICE9PSBudWxsICkgdGhpcy5yID0gTWF0aC5hYnModGhpcy5yIC0gdGhpcy5vbGRyKSA+IE1hdGguUEkgPyB0aGlzLm9sZHIgOiB0aGlzLnI7XG5cbiAgICAgICAgdGhpcy5yID0gdGhpcy5yID4gdGhpcy5tUEkgPyB0aGlzLm1QSSA6IHRoaXMucjtcbiAgICAgICAgdGhpcy5yID0gdGhpcy5yIDwgLXRoaXMubVBJID8gLXRoaXMubVBJIDogdGhpcy5yO1xuXG4gICAgICAgIHZhciBzdGVwcyA9IDEgLyB0aGlzLmNpclJhbmdlO1xuICAgICAgICB2YXIgdmFsdWUgPSAodGhpcy5yICsgdGhpcy5tUEkpICogc3RlcHM7XG5cbiAgICAgICAgdmFyIG4gPSAoICggdGhpcy5yYW5nZSAqIHZhbHVlICkgKyB0aGlzLm1pbiApIC0gdGhpcy5vbGQ7XG5cbiAgICAgICAgaWYobiA+PSB0aGlzLnN0ZXAgfHwgbiA8PSB0aGlzLnN0ZXApeyBcbiAgICAgICAgICAgIG4gPSB+fiAoIG4gLyB0aGlzLnN0ZXAgKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLm51bVZhbHVlKCB0aGlzLm9sZCArICggbiAqIHRoaXMuc3RlcCApICk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSggdHJ1ZSApO1xuICAgICAgICAgICAgdGhpcy5vbGQgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy5vbGRyID0gdGhpcy5yO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgbWFrZUdyYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZCA9ICcnLCBzdGVwLCByYW5nZSwgYSwgeCwgeSwgeDIsIHkyLCByID0gdGhpcy5yYWRpdXM7XG4gICAgICAgIHZhciBzdGFydGFuZ2xlID0gTWF0aC5QSSArIHRoaXMubVBJO1xuICAgICAgICB2YXIgZW5kYW5nbGUgPSBNYXRoLlBJIC0gdGhpcy5tUEk7XG5cbiAgICAgICAgaWYodGhpcy5zdGVwPjUpe1xuICAgICAgICAgICAgcmFuZ2UgPSAgdGhpcy5yYW5nZSAvIHRoaXMuc3RlcDtcbiAgICAgICAgICAgIHN0ZXAgPSAoIHN0YXJ0YW5nbGUgLSBlbmRhbmdsZSApIC8gcmFuZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGVwID0gKCBzdGFydGFuZ2xlIC0gZW5kYW5nbGUgKSAvIHI7XG4gICAgICAgICAgICByYW5nZSA9IHI7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPD0gcmFuZ2U7ICsraSApIHtcblxuICAgICAgICAgICAgYSA9IHN0YXJ0YW5nbGUgLSAoIHN0ZXAgKiBpICk7XG4gICAgICAgICAgICB4ID0gciArIE1hdGguc2luKCBhICkgKiByO1xuICAgICAgICAgICAgeSA9IHIgKyBNYXRoLmNvcyggYSApICogcjtcbiAgICAgICAgICAgIHgyID0gciArIE1hdGguc2luKCBhICkgKiAoIHIgLSAzICk7XG4gICAgICAgICAgICB5MiA9IHIgKyBNYXRoLmNvcyggYSApICogKCByIC0gMyApO1xuICAgICAgICAgICAgZCArPSAnTScgKyB4ICsgJyAnICsgeSArICcgTCcgKyB4MiArICcgJyt5MiArICcgJztcblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGQ7XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoIHVwICkge1xuXG4gICAgICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMucGVyY2VudCA9ICh0aGlzLnZhbHVlIC0gdGhpcy5taW4pIC8gdGhpcy5yYW5nZTtcblxuICAgICAgICB2YXIgciA9ICggKHRoaXMucGVyY2VudCAqIHRoaXMuY2lyUmFuZ2UpIC0gKHRoaXMubVBJKSkgKiB0aGlzLnRvRGVnO1xuXG4gICAgICAgIFRvb2xzLnNldFN2ZyggdGhpcy5jWzRdLCAndHJhbnNmb3JtJywgJ3JvdGF0ZSgnKyByICsnICcrdGhpcy5yYWRpdXMrJyAnK3RoaXMucmFkaXVzKycpJyApO1xuXG4gICAgICAgIGlmKCB1cCApIHRoaXMuc2VuZCgpO1xuICAgICAgICBcbiAgICB9LFxuXG59ICk7XG5cbmZ1bmN0aW9uIExpc3Qobykge1xuICAgIFByb3RvLmNhbGwodGhpcywgbyk7XG5cbiAgICB0aGlzLmF1dG9IZWlnaHQgPSB0cnVlO1xuICAgIHZhciBhbGlnbiA9IG8uYWxpZ24gfHwgXCJjZW50ZXJcIjtcblxuICAgIHRoaXMuYnV0dG9uQ29sb3IgPSBvLmJDb2xvciB8fCBUb29scy5jb2xvcnMuYnV0dG9uO1xuXG4gICAgdmFyIGZsdG9wID0gTWF0aC5mbG9vcih0aGlzLmggKiAwLjUpIC0gNTtcblxuICAgIC8vdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3RvcDowOyBoZWlnaHQ6OTBweDsgY3Vyc29yOnMtcmVzaXplOyBwb2ludGVyLWV2ZW50czphdXRvOyBkaXNwbGF5Om5vbmU7IG92ZXJmbG93OmhpZGRlbjsgYm9yZGVyOjFweCBzb2xpZCAnK1Rvb2xzLmNvbG9ycy5ib3JkZXIrJzsnICk7XG4gICAgLy90aGlzLmNbM10gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0ICsgJ3RleHQtYWxpZ246JythbGlnbisnOyBsaW5lLWhlaWdodDonKyh0aGlzLmgtNCkrJ3B4OyBib3JkZXI6MXB4IHNvbGlkICcrVG9vbHMuY29sb3JzLmJvcmRlcisnOyB0b3A6MXB4OyBwb2ludGVyLWV2ZW50czphdXRvOyBjdXJzb3I6cG9pbnRlcjsgYmFja2dyb3VuZDonK3RoaXMuYnV0dG9uQ29sb3IrJzsgaGVpZ2h0OicrKHRoaXMuaC0yKSsncHg7JyApO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKFxuICAgICAgICBcImRpdlwiLFxuICAgICAgICBUb29scy5jc3MuYmFzaWMgK1xuICAgICAgICAgICAgXCJ0b3A6MDsgaGVpZ2h0OjkwcHg7IGN1cnNvcjpzLXJlc2l6ZTsgcG9pbnRlci1ldmVudHM6YXV0bzsgZGlzcGxheTpub25lOyBvdmVyZmxvdzpoaWRkZW47XCIsXG4gICAgKTtcbiAgICB0aGlzLmNbM10gPSBUb29scy5kb20oXG4gICAgICAgIFwiZGl2XCIsXG4gICAgICAgIFRvb2xzLmNzcy50eHQgK1xuICAgICAgICAgICAgXCJ0ZXh0LWFsaWduOlwiICtcbiAgICAgICAgICAgIGFsaWduICtcbiAgICAgICAgICAgIFwiOyBsaW5lLWhlaWdodDpcIiArXG4gICAgICAgICAgICAodGhpcy5oIC0gNCkgK1xuICAgICAgICAgICAgXCJweDsgdG9wOjFweDsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7IGJhY2tncm91bmQ6XCIgK1xuICAgICAgICAgICAgdGhpcy5idXR0b25Db2xvciArXG4gICAgICAgICAgICBcIjsgaGVpZ2h0OlwiICtcbiAgICAgICAgICAgICh0aGlzLmggLSAyKSArXG4gICAgICAgICAgICBcInB4OyBib3JkZXItcmFkaXVzOlwiICtcbiAgICAgICAgICAgIHRoaXMucmFkaXVzICtcbiAgICAgICAgICAgIFwicHg7XCIsXG4gICAgKTtcbiAgICB0aGlzLmNbNF0gPSBUb29scy5kb20oXG4gICAgICAgIFwicGF0aFwiLFxuICAgICAgICBUb29scy5jc3MuYmFzaWMgK1xuICAgICAgICAgICAgXCJwb3NpdGlvbjphYnNvbHV0ZTsgd2lkdGg6MTBweDsgaGVpZ2h0OjEwcHg7IHRvcDpcIiArXG4gICAgICAgICAgICBmbHRvcCArXG4gICAgICAgICAgICBcInB4O1wiLFxuICAgICAgICB7IGQ6IFwiTSAzIDggTCA4IDUgMyAyIDMgOCBaXCIsIGZpbGw6IHRoaXMuZm9udENvbG9yLCBzdHJva2U6IFwibm9uZVwiIH0sXG4gICAgKTtcblxuICAgIHRoaXMuc2Nyb2xsZXIgPSBUb29scy5kb20oXG4gICAgICAgIFwiZGl2XCIsXG4gICAgICAgIFRvb2xzLmNzcy5iYXNpYyArXG4gICAgICAgICAgICBcInJpZ2h0OjVweDsgIHdpZHRoOjEwcHg7IHBvaW50ZXItZXZlbnRzOm5vbmU7IGJhY2tncm91bmQ6IzY2NjsgZGlzcGxheTpub25lO1wiLFxuICAgICk7XG5cbiAgICB0aGlzLmNbMl0ubmFtZSA9IFwibGlzdFwiO1xuICAgIHRoaXMuY1szXS5uYW1lID0gXCJ0aXRsZVwiO1xuXG4gICAgLy90aGlzLmNbMl0uc3R5bGUuYm9yZGVyVG9wID0gdGhpcy5oICsgJ3B4IHNvbGlkIHRyYW5zcGFyZW50JztcbiAgICB0aGlzLmNbM10uc3R5bGUuY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcblxuICAgIHRoaXMuY1syXS5ldmVudHMgPSBbXG4gICAgICAgIFwibW91c2Vkb3duXCIsXG4gICAgICAgIFwibW91c2Vtb3ZlXCIsXG4gICAgICAgIFwibW91c2V1cFwiLFxuICAgICAgICBcIm1vdXNld2hlZWxcIixcbiAgICAgICAgXCJtb3VzZW91dFwiLFxuICAgICAgICBcIm1vdXNlb3ZlclwiLFxuICAgIF07XG4gICAgdGhpcy5jWzNdLmV2ZW50cyA9IFtcIm1vdXNlZG93blwiLCBcIm1vdXNlb3ZlclwiLCBcIm1vdXNlb3V0XCJdO1xuXG4gICAgdGhpcy5saXN0ID0gby5saXN0IHx8IFtdO1xuXG4gICAgdGhpcy5iYXNlSCA9IHRoaXMuaDtcblxuICAgIC8vdGhpcy5tYXhJdGVtID0gby5tYXhJdGVtIHx8IDU7XG4gICAgdGhpcy5pdGVtSGVpZ2h0ID0gby5pdGVtSGVpZ2h0IHx8IHRoaXMuaCAtIDM7XG4gICAgLy90aGlzLmxlbmd0aCA9IHRoaXMubGlzdC5sZW5ndGg7XG5cbiAgICAvLyBmb3JjZSBmdWxsIGxpc3RcbiAgICB0aGlzLmZ1bGwgPSBvLmZ1bGwgfHwgZmFsc2U7XG5cbiAgICB0aGlzLnB5ID0gMDtcbiAgICB0aGlzLncgPSB0aGlzLnNiO1xuICAgIHRoaXMuc2Nyb2xsID0gZmFsc2U7XG4gICAgdGhpcy5pc0Rvd24gPSBmYWxzZTtcblxuICAgIC8vIGxpc3QgdXAgb3IgZG93blxuICAgIHRoaXMuc2lkZSA9IG8uc2lkZSB8fCBcImRvd25cIjtcbiAgICB0aGlzLmhvbGRUb3AgPSAwO1xuXG4gICAgaWYgKHRoaXMuc2lkZSA9PT0gXCJ1cFwiKSB7XG4gICAgICAgIHRoaXMuY1syXS5zdHlsZS50b3AgPSBcImF1dG9cIjtcbiAgICAgICAgdGhpcy5jWzNdLnN0eWxlLnRvcCA9IFwiYXV0b1wiO1xuICAgICAgICB0aGlzLmNbNF0uc3R5bGUudG9wID0gXCJhdXRvXCI7XG4gICAgICAgIC8vdGhpcy5jWzVdLnN0eWxlLnRvcCA9ICdhdXRvJztcblxuICAgICAgICB0aGlzLmNbMl0uc3R5bGUuYm90dG9tID0gdGhpcy5oIC0gMiArIFwicHhcIjtcbiAgICAgICAgdGhpcy5jWzNdLnN0eWxlLmJvdHRvbSA9IFwiMXB4XCI7XG4gICAgICAgIHRoaXMuY1s0XS5zdHlsZS5ib3R0b20gPSBmbHRvcCArIFwicHhcIjtcbiAgICAgICAgLy90aGlzLmNbNV0uc3R5bGUuYm90dG9tID0gJzJweCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jWzJdLnN0eWxlLnRvcCA9IHRoaXMuaCAtIDIgKyBcInB4XCI7XG4gICAgICAgIC8vdGhpcy5jWzZdLnN0eWxlLnRvcCA9IHRoaXMuaCArICdweCc7XG4gICAgfVxuXG4gICAgdGhpcy5saXN0SW4gPSBUb29scy5kb20oXG4gICAgICAgIFwiZGl2XCIsXG4gICAgICAgIFRvb2xzLmNzcy5iYXNpYyArXG4gICAgICAgICAgICBcImxlZnQ6MDsgdG9wOjA7IHdpZHRoOjEwMCU7IGJhY2tncm91bmQ6cmdiYSgwLDAsMCwwLjIpO1wiLFxuICAgICk7XG4gICAgdGhpcy5saXN0SW4ubmFtZSA9IFwibGlzdFwiO1xuXG4gICAgdGhpcy5jWzJdLmFwcGVuZENoaWxkKHRoaXMubGlzdEluKTtcbiAgICB0aGlzLmNbMl0uYXBwZW5kQ2hpbGQodGhpcy5zY3JvbGxlcik7XG5cbiAgICAvLyBwb3B1bGF0ZSBsaXN0XG5cbiAgICB0aGlzLnNldExpc3QodGhpcy5saXN0LCBvLnZhbHVlKTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKG8ub3BlbiAhPT0gdW5kZWZpbmVkKSB0aGlzLm9wZW4oKTtcbn1cblxuTGlzdC5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoUHJvdG8ucHJvdG90eXBlKSwge1xuICAgIGNvbnN0cnVjdG9yOiBMaXN0LFxuXG4gICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHZhciBuYW1lID0gZS50YXJnZXQubmFtZSB8fCBcIlwiO1xuICAgICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcImNsaWNrXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGljayhlKTtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSBcIm1vdXNlb3ZlclwiOlxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcInRpdGxlXCIpIHRoaXMubW9kZSgxKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubGlzdG92ZXIoZSk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJtb3VzZWRvd25cIjpcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJ0aXRsZVwiKSB0aGlzLnRpdGxlQ2xpY2soZSk7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmxpc3Rkb3duKGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwibW91c2V1cFwiOlxuICAgICAgICAgICAgICAgIGlmIChuYW1lID09PSBcInRpdGxlXCIpIHRoaXMubW9kZSgwKTtcbiAgICAgICAgICAgICAgICBlbHNlIHRoaXMubGlzdHVwKGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwibW91c2VvdXRcIjpcbiAgICAgICAgICAgICAgICBpZiAobmFtZSA9PT0gXCJ0aXRsZVwiKSB0aGlzLm1vZGUoMCk7XG4gICAgICAgICAgICAgICAgZWxzZSB0aGlzLmxpc3RvdXQoZSk7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgXCJtb3VzZW1vdmVcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3Rtb3ZlKGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFwibW91c2V3aGVlbFwiOlxuICAgICAgICAgICAgICAgIHRoaXMubGlzdHdoZWVsKGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbW9kZTogZnVuY3Rpb24obW9kZSkge1xuICAgICAgICB2YXIgcyA9IHRoaXMucztcblxuICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMDogLy8gYmFzZVxuICAgICAgICAgICAgICAgIHNbM10uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICBzWzNdLmJhY2tncm91bmQgPSB0aGlzLmJ1dHRvbkNvbG9yO1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIDE6IC8vIG92ZXJcbiAgICAgICAgICAgICAgICBzWzNdLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgICAgICAgICAgICAgc1szXS5iYWNrZ3JvdW5kID0gVG9vbHMuY29sb3JzLnNlbGVjdDtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAyOiAvLyBlZGl0IC8gZG93blxuICAgICAgICAgICAgICAgIHNbM10uY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgICAgICBzWzNdLmJhY2tncm91bmQgPSBUb29scy5jb2xvcnMuZG93bjtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyTGlzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLmxpc3RJbi5jaGlsZHJlbi5sZW5ndGgpXG4gICAgICAgICAgICB0aGlzLmxpc3RJbi5yZW1vdmVDaGlsZCh0aGlzLmxpc3RJbi5sYXN0Q2hpbGQpO1xuICAgIH0sXG5cbiAgICBzZXRMaXN0OiBmdW5jdGlvbihsaXN0LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmNsZWFyTGlzdCgpO1xuXG4gICAgICAgIHRoaXMubGlzdCA9IGxpc3Q7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy5saXN0Lmxlbmd0aDtcblxuICAgICAgICB0aGlzLm1heEl0ZW0gPSB0aGlzLmZ1bGwgPyB0aGlzLmxlbmd0aCA6IDU7XG4gICAgICAgIHRoaXMubWF4SXRlbSA9IHRoaXMubGVuZ3RoIDwgdGhpcy5tYXhJdGVtID8gdGhpcy5sZW5ndGggOiB0aGlzLm1heEl0ZW07XG5cbiAgICAgICAgdGhpcy5tYXhIZWlnaHQgPSB0aGlzLm1heEl0ZW0gKiAodGhpcy5pdGVtSGVpZ2h0ICsgMSkgKyAyO1xuXG4gICAgICAgIHRoaXMubWF4ID0gdGhpcy5sZW5ndGggKiAodGhpcy5pdGVtSGVpZ2h0ICsgMSkgKyAyO1xuICAgICAgICB0aGlzLnJhdGlvID0gdGhpcy5tYXhIZWlnaHQgLyB0aGlzLm1heDtcbiAgICAgICAgdGhpcy5zaCA9IHRoaXMubWF4SGVpZ2h0ICogdGhpcy5yYXRpbztcbiAgICAgICAgdGhpcy5yYW5nZSA9IHRoaXMubWF4SGVpZ2h0IC0gdGhpcy5zaDtcblxuICAgICAgICB0aGlzLmNbMl0uc3R5bGUuaGVpZ2h0ID0gdGhpcy5tYXhIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXIuc3R5bGUuaGVpZ2h0ID0gdGhpcy5zaCArIFwicHhcIjtcblxuICAgICAgICBpZiAodGhpcy5tYXggPiB0aGlzLm1heEhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy53ID0gdGhpcy5zYiAtIDIwO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGwgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGl0ZW0sIG47IC8vLCBsID0gdGhpcy5zYjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBuID0gdGhpcy5saXN0W2ldO1xuICAgICAgICAgICAgaXRlbSA9IFRvb2xzLmRvbShcbiAgICAgICAgICAgICAgICBcImRpdlwiLFxuICAgICAgICAgICAgICAgIFRvb2xzLmNzcy5pdGVtICtcbiAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aDpcIiArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudyArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7IGhlaWdodDpcIiArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbUhlaWdodCArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7IGxpbmUtaGVpZ2h0OlwiICtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuaXRlbUhlaWdodCAtIDUpICtcbiAgICAgICAgICAgICAgICAgICAgXCJweDtcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG4gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpdGVtLnRleHRDb250ZW50ID0gbi5sYWJlbCA/IG4ubGFiZWwgOiBuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLnRleHRDb250ZW50ID0gbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGl0ZW0uc3R5bGUuY29sb3IgPSB0aGlzLmZvbnRDb2xvcjtcbiAgICAgICAgICAgIGl0ZW0ubmFtZSA9IFwiaXRlbVwiO1xuICAgICAgICAgICAgdGhpcy5saXN0SW4uYXBwZW5kQ2hpbGQoaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKCFpc05hTih2YWx1ZSkpIHRoaXMudmFsdWUgPSB0aGlzLmxpc3RbdmFsdWVdO1xuICAgICAgICAgICAgZWxzZSB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5saXN0WzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jWzNdLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIHR5cGVvZiB0aGlzLnZhbHVlID09PSBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgPyB0aGlzLnZhbHVlLmxhYmVsID8gdGhpcy52YWx1ZS5sYWJlbCA6IHRoaXMudmFsdWVcbiAgICAgICAgICAgICAgICA6IHRoaXMudmFsdWU7XG4gICAgfSxcblxuICAgIC8vIC0tLS0tXG5cbiAgICBjbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbmFtZSA9IGUudGFyZ2V0Lm5hbWU7XG4gICAgICAgIGlmIChuYW1lICE9PSBcInRpdGxlXCIgJiYgbmFtZSAhPT0gXCJsaXN0XCIpIHRoaXMuY2xvc2UoKTtcbiAgICB9LFxuXG4gICAgdGl0bGVDbGljazogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAodGhpcy5pc09wZW4pIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICAgIHRoaXMubW9kZSgyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyAtLS0tLSBMSVNUXG5cbiAgICBsaXN0b3ZlcjogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbmFtZSA9IGUudGFyZ2V0Lm5hbWU7XG4gICAgICAgIC8vY29uc29sZS5sb2cobmFtZSlcbiAgICAgICAgaWYgKG5hbWUgPT09IFwiaXRlbVwiKSB7XG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gVG9vbHMuY29sb3JzLnNlbGVjdDtcbiAgICAgICAgICAgIGUudGFyZ2V0LnN0eWxlLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGlzdGRvd246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBlLnRhcmdldC5uYW1lO1xuICAgICAgICBpZiAobmFtZSAhPT0gXCJsaXN0XCIgJiYgbmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGUudGFyZ2V0LnRleHRDb250ZW50OyAvL25hbWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5saXN0LmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5sYWJlbCA9PT0gbGFiZWw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPT09IGxhYmVsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5jWzNdLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgICAgICAgIC8vIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSBcImxpc3RcIiAmJiB0aGlzLnNjcm9sbCkge1xuICAgICAgICAgICAgdGhpcy5pc0Rvd24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5saXN0bW92ZShlKTtcbiAgICAgICAgICAgIHRoaXMubGlzdEluLnN0eWxlLmJhY2tncm91bmQgPSBcInJnYmEoMCwwLDAsMC42KVwiO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlci5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjQUFBXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGlzdG1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEb3duKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IHRoaXMuY1syXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKGUuY2xpZW50WSAtIHJlY3QudG9wIC0gdGhpcy5zaCAqIDAuNSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGlzdHVwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGlzdEluLnN0eWxlLmJhY2tncm91bmQgPSBcInJnYmEoMCwwLDAsMC4yKVwiO1xuICAgICAgICB0aGlzLnNjcm9sbGVyLnN0eWxlLmJhY2tncm91bmQgPSBcIiM2NjZcIjtcbiAgICB9LFxuXG4gICAgbGlzdG91dDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbiA9IGUudGFyZ2V0Lm5hbWU7XG4gICAgICAgIGlmIChuID09PSBcIml0ZW1cIikge1xuICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwicmdiYSgwLDAsMCwwLjIpXCI7XG4gICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNVSSkgdGhpcy5tYWluLmxvY2t3aGVlbCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxpc3R1cCgpO1xuICAgICAgICAvL3ZhciBuYW1lID0gZS5yZWxhdGVkVGFyZ2V0Lm5hbWU7XG4gICAgICAgIC8vaWYoIG5hbWUgPT09IHVuZGVmaW5lZCApIHRoaXMuY2xvc2UoKTtcbiAgICB9LFxuXG4gICAgbGlzdHdoZWVsOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGwpIHJldHVyblxuICAgICAgICBpZiAodGhpcy5pc1VJKSB0aGlzLm1haW4ubG9ja3doZWVsID0gdHJ1ZTtcbiAgICAgICAgdmFyIGRlbHRhID0gMDtcbiAgICAgICAgaWYgKGUud2hlZWxEZWx0YVkpIGRlbHRhID0gLWUud2hlZWxEZWx0YVkgKiAwLjA0O1xuICAgICAgICBlbHNlIGlmIChlLndoZWVsRGVsdGEpIGRlbHRhID0gLWUud2hlZWxEZWx0YSAqIDAuMjtcbiAgICAgICAgZWxzZSBpZiAoZS5kZXRhaWwpIGRlbHRhID0gZS5kZXRhaWwgKiA0LjA7XG5cbiAgICAgICAgdGhpcy5weSArPSBkZWx0YTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnB5KTtcbiAgICB9LFxuXG4gICAgLy8gLS0tLS0gTElTVFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbih5KSB7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGwpIHJldHVyblxuXG4gICAgICAgIHkgPSB5IDwgMCA/IDAgOiB5O1xuICAgICAgICB5ID0geSA+IHRoaXMucmFuZ2UgPyB0aGlzLnJhbmdlIDogeTtcblxuICAgICAgICB0aGlzLmxpc3RJbi5zdHlsZS50b3AgPSAtTWF0aC5mbG9vcih5IC8gdGhpcy5yYXRpbykgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXIuc3R5bGUudG9wID0gTWF0aC5mbG9vcih5KSArIFwicHhcIjtcblxuICAgICAgICB0aGlzLnB5ID0geTtcbiAgICB9LFxuXG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5vcGVuLmNhbGwodGhpcyk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZSgwKTtcbiAgICAgICAgdGhpcy5oID0gdGhpcy5tYXhIZWlnaHQgKyB0aGlzLmJhc2VIICsgMTA7XG4gICAgICAgIGlmICghdGhpcy5zY3JvbGwpIHtcbiAgICAgICAgICAgIHRoaXMuaCA9IHRoaXMuYmFzZUggKyAxMCArIHRoaXMubWF4O1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5zWzJdLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIGlmICh0aGlzLnNpZGUgPT09IFwidXBcIilcbiAgICAgICAgICAgIFRvb2xzLnNldFN2Zyh0aGlzLmNbNF0sIFwiZFwiLCBcIk0gNSAyIEwgMiA3IDggNyA1IDIgWlwiKTtcbiAgICAgICAgZWxzZSBUb29scy5zZXRTdmcodGhpcy5jWzRdLCBcImRcIiwgXCJNIDUgOCBMIDggMyAyIDMgNSA4IFpcIik7XG5cbiAgICAgICAgdGhpcy5yU2l6ZUNvbnRlbnQoKTtcblxuICAgICAgICBpZiAodGhpcy5wYXJlbnRHcm91cCAhPT0gbnVsbClcbiAgICAgICAgICAgIHRoaXMucGFyZW50R3JvdXAuY2FsYyh0aGlzLmggLSB0aGlzLmJhc2VIKTtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5pc1VJKSB0aGlzLm1haW4uY2FsYyh0aGlzLmggLSB0aGlzLmJhc2VIKTtcbiAgICB9LFxuXG4gICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBQcm90by5wcm90b3R5cGUuY2xvc2UuY2FsbCh0aGlzKTtcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcywgZmFsc2UpO1xuXG4gICAgICAgIGlmICh0aGlzLnBhcmVudEdyb3VwICE9PSBudWxsKVxuICAgICAgICAgICAgdGhpcy5wYXJlbnRHcm91cC5jYWxjKC0odGhpcy5oIC0gdGhpcy5iYXNlSCkpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLmlzVUkpIHRoaXMubWFpbi5jYWxjKC0odGhpcy5oIC0gdGhpcy5iYXNlSCkpO1xuXG4gICAgICAgIHRoaXMuaCA9IHRoaXMuYmFzZUg7XG4gICAgICAgIHRoaXMuc1swXS5oZWlnaHQgPSB0aGlzLmggKyBcInB4XCI7XG4gICAgICAgIHRoaXMuc1syXS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIFRvb2xzLnNldFN2Zyh0aGlzLmNbNF0sIFwiZFwiLCBcIk0gMyA4IEwgOCA1IDMgMiAzIDggWlwiKTtcbiAgICB9LFxuXG4gICAgLy8gLS0tLS1cblxuICAgIHRleHQ6IGZ1bmN0aW9uKHR4dCkge1xuICAgICAgICB0aGlzLmNbM10udGV4dENvbnRlbnQgPSB0eHQ7XG4gICAgfSxcblxuICAgIHJTaXplQ29udGVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHRoaXMubGlzdEluLmNoaWxkcmVuW2ldLnN0eWxlLndpZHRoID0gdGhpcy53ICsgXCJweFwiO1xuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKHRoaXMpO1xuXG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgICB2YXIgdyA9IHRoaXMuc2I7XG4gICAgICAgIHZhciBkID0gdGhpcy5zYTtcblxuICAgICAgICBzWzJdLndpZHRoID0gdyArIFwicHhcIjtcbiAgICAgICAgc1syXS5sZWZ0ID0gZCArIFwicHhcIjtcblxuICAgICAgICBzWzNdLndpZHRoID0gdyArIFwicHhcIjtcbiAgICAgICAgc1szXS5sZWZ0ID0gZCArIFwicHhcIjtcblxuICAgICAgICBzWzRdLmxlZnQgPSBkICsgdyAtIDE3ICsgXCJweFwiO1xuXG4gICAgICAgIC8vc1s1XS53aWR0aCA9IHcgKyAncHgnO1xuICAgICAgICAvL3NbNV0ubGVmdCA9IGQgKyAncHgnO1xuXG4gICAgICAgIHRoaXMudyA9IHc7XG4gICAgICAgIGlmICh0aGlzLm1heCA+IHRoaXMubWF4SGVpZ2h0KSB0aGlzLncgPSB3IC0gMjA7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNPcGVuKSB0aGlzLnJTaXplQ29udGVudCgpO1xuICAgIH0sXG59KTtcblxuZnVuY3Rpb24gTnVtZXJpYyggbyApe1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy50eXBlID0gJ251bWJlcic7XG5cbiAgICB0aGlzLnNldFR5cGVOdW1iZXIoIG8gKTtcblxuICAgIHRoaXMuYWxsd2F5ID0gby5hbGx3YXkgfHwgZmFsc2U7XG4gICAgdGhpcy5pc0RyYWcgPSBvLmRyYWcgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvLmRyYWc7XG5cbiAgICB0aGlzLnZhbHVlID0gWzBdO1xuICAgIHRoaXMudG9SYWQgPSAxO1xuICAgIHRoaXMuaXNOdW1iZXIgPSB0cnVlO1xuICAgIHRoaXMuaXNBbmdsZSA9IGZhbHNlO1xuICAgIHRoaXMuaXNWZWN0b3IgPSBmYWxzZTtcbiAgICB0aGlzLmlzU2VsZWN0ID0gZmFsc2U7XG5cbiAgICBpZiggby52YWx1ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgIGlmKCFpc05hTihvLnZhbHVlKSl7IHRoaXMudmFsdWUgPSBbby52YWx1ZV07fVxuICAgICAgICBlbHNlIGlmKG8udmFsdWUgaW5zdGFuY2VvZiBBcnJheSApeyB0aGlzLnZhbHVlID0gby52YWx1ZTsgdGhpcy5pc051bWJlcj1mYWxzZTt9XG4gICAgICAgIGVsc2UgaWYoby52YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCApeyBcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBbXTtcbiAgICAgICAgICAgIGlmKG8udmFsdWUueCkgdGhpcy52YWx1ZVswXSA9IG8udmFsdWUueDtcbiAgICAgICAgICAgIGlmKG8udmFsdWUueSkgdGhpcy52YWx1ZVsxXSA9IG8udmFsdWUueTtcbiAgICAgICAgICAgIGlmKG8udmFsdWUueikgdGhpcy52YWx1ZVsyXSA9IG8udmFsdWUuejtcbiAgICAgICAgICAgIGlmKG8udmFsdWUudykgdGhpcy52YWx1ZVszXSA9IG8udmFsdWUudztcbiAgICAgICAgICAgIHRoaXMuaXNWZWN0b3IgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLnZhbHVlLmxlbmd0aDtcblxuICAgIGlmKG8uaXNBbmdsZSl7XG4gICAgICAgIHRoaXMuaXNBbmdsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudG9SYWQgPSBNYXRoLlBJLzE4MDtcbiAgICB9XG5cbiAgICAvL3RoaXMudyA9ICgoVG9vbHMuYmFzZS5CVys1KS8odGhpcy5sZW5ndGgpKS01O1xuICAgIHRoaXMuY3VycmVudCA9IHVuZGVmaW5lZDtcbiAgICBcbiAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgIHdoaWxlKGktLSl7XG4gICAgICAgIGlmKHRoaXMuaXNBbmdsZSkgdGhpcy52YWx1ZVtpXSA9ICh0aGlzLnZhbHVlW2ldICogMTgwIC8gTWF0aC5QSSkudG9GaXhlZCggdGhpcy5wcmVjaXNpb24gKTtcbiAgICAgICAgdGhpcy5jWzIraV0gPSBUb29scy5kb20oICdkaXYnLCBUb29scy5jc3MudHh0c2VsZWN0ICsgJ2xldHRlci1zcGFjaW5nOi0xcHg7IGN1cnNvcjpwb2ludGVyOyBoZWlnaHQ6JysodGhpcy5oLTQpKydweDsgbGluZS1oZWlnaHQ6JysodGhpcy5oLTgpKydweDsnKTtcbiAgICAgICAgdGhpcy5jWzIraV0ubmFtZSA9IGk7XG4gICAgICAgIGlmKHRoaXMuaXNEcmFnKSB0aGlzLmNbMitpXS5zdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgIGlmKG8uY2VudGVyKSB0aGlzLmNbMitpXS5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcblxuICAgICAgICB0aGlzLmNbMitpXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWVbaV07XG4gICAgICAgIHRoaXMuY1syK2ldLnN0eWxlLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgIC8vdGhpcy5jWzIraV0uY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jWzIraV0uZXZlbnRzID0gWyAna2V5ZG93bicsICdrZXl1cCcsICdtb3VzZWRvd24nLCAnYmx1cicsICdmb2N1cycgXTsgLy8nY2xpY2snLCBcblxuICAgIH1cblxuICAgIHRoaXMuaW5pdCgpO1xufVxuXG5OdW1lcmljLnByb3RvdHlwZSA9IE9iamVjdC5hc3NpZ24oIE9iamVjdC5jcmVhdGUoIFByb3RvLnByb3RvdHlwZSApLCB7XG5cbiAgICBjb25zdHJ1Y3RvcjogTnVtZXJpYyxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiggZSApIHtcblxuICAgICAgICAvL2UucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy9lLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgLy9jYXNlICdjbGljayc6IHRoaXMuY2xpY2soIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLmRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdrZXlkb3duJzogdGhpcy5rZXlkb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5dXAnOiB0aGlzLmtleXVwKCBlICk7IGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdibHVyJzogdGhpcy5ibHVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOiB0aGlzLmZvY3VzKCBlICk7IGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBkb2N1bWVudFxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHRoaXMudXAoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB0aGlzLm1vdmUoIGUgKTsgYnJlYWs7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAoIHYsIG4gKSB7XG5cbiAgICAgICAgbiA9IG4gfHwgMDtcbiAgICAgICAgdGhpcy52YWx1ZVtuXSA9IHRoaXMubnVtVmFsdWUoIHYgKTtcbiAgICAgICAgdGhpcy5jWzIrbl0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlW25dO1xuXG4gICAgfSxcblxuICAgIGtleWRvd246IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmKCBlLmtleUNvZGUgPT09IDEzICl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnRlc3RWYWx1ZSggcGFyc2VGbG9hdChlLnRhcmdldC5uYW1lKSApO1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgZS50YXJnZXQuYmx1cigpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAga2V5dXA6IGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYoIHRoaXMuYWxsd2F5ICl7IFxuICAgICAgICAgICAgdGhpcy50ZXN0VmFsdWUoIHBhcnNlRmxvYXQoZS50YXJnZXQubmFtZSkgKTtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGJsdXI6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzU2VsZWN0ID0gZmFsc2U7XG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gVG9vbHMuY29sb3JzLmJvcmRlcjtcbiAgICAgICAgZS50YXJnZXQuY29udGVudEVkaXRhYmxlID0gZmFsc2U7XG4gICAgICAgIC8vZS50YXJnZXQuc3R5bGUuYm9yZGVyID0gJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMSknO1xuICAgICAgICBpZih0aGlzLmlzRHJhZykgZS50YXJnZXQuc3R5bGUuY3Vyc29yID0gJ21vdmUnO1xuICAgICAgICBlbHNlICBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG5cbiAgICB9LFxuXG4gICAgZm9jdXM6IGZ1bmN0aW9uICggZSApIHtcblxuICAgICAgICB0aGlzLmlzU2VsZWN0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFRvb2xzLmNvbG9ycy5ib3JkZXJTZWxlY3Q7XG4gICAgICAgIFxuICAgICAgICAvL2UudGFyZ2V0LnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgJyArIFVJTC5Cb3JkZXJTZWxlY3Q7XG4gICAgICAgIGlmKHRoaXMuaXNEcmFnKSBlLnRhcmdldC5zdHlsZS5jdXJzb3IgPSAnYXV0byc7XG5cbiAgICB9LFxuXG4gICAgZG93bjogZnVuY3Rpb24gKCBlICkge1xuXG4gICAgICAgIGlmKHRoaXMuaXNTZWxlY3QpIHJldHVybjtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50ID0gcGFyc2VGbG9hdChlLnRhcmdldC5uYW1lKTtcblxuICAgICAgICB0aGlzLnByZXYgPSB7IHg6ZS5jbGllbnRYLCB5OmUuY2xpZW50WSwgZDowLCBpZDoodGhpcy5jdXJyZW50KzIpfTtcbiAgICAgICAgaWYoIHRoaXMuaXNOdW1iZXIgKSB0aGlzLnByZXYudiA9IHBhcnNlRmxvYXQodGhpcy52YWx1ZSk7XG4gICAgICAgIGVsc2UgdGhpcy5wcmV2LnYgPSBwYXJzZUZsb2F0KCB0aGlzLnZhbHVlW3RoaXMuY3VycmVudF0gKTtcblxuXG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNldXAnLCB0aGlzLCBmYWxzZSApO1xuICAgICAgICBpZih0aGlzLmlzRHJhZykgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG5cbiAgICB9LFxuXG4gICAgLy8vL1xuXG4gICAgdXA6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgaWYodGhpcy5pc0RyYWcpIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgICAgIGlmKHRoaXMuY3VycmVudCAhPT0gdW5kZWZpbmVkKXsgXG5cbiAgICAgICAgICAgIGlmKCB0aGlzLmN1cnJlbnQgPT09IHBhcnNlRmxvYXQoZS50YXJnZXQubmFtZSkgKXsgXG4gICAgICAgICAgICAgICAgZS50YXJnZXQuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBlLnRhcmdldC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBtb3ZlOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBpZiggdGhpcy5jdXJyZW50ID09PSB1bmRlZmluZWQgKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5wcmV2LmQgKz0gKCBlLmNsaWVudFggLSB0aGlzLnByZXYueCApIC0gKCBlLmNsaWVudFkgLSB0aGlzLnByZXYueSApO1xuICAgICAgICB2YXIgbiA9IHRoaXMucHJldi52ICsgKCB0aGlzLnByZXYuZCAqIHRoaXMuc3RlcCk7XG5cbiAgICAgICAgdGhpcy52YWx1ZVt0aGlzLmN1cnJlbnRdID0gdGhpcy5udW1WYWx1ZShuKTtcbiAgICAgICAgLy90aGlzLmNbMit0aGlzLmN1cnJlbnRdLnZhbHVlID0gdGhpcy52YWx1ZVt0aGlzLmN1cnJlbnRdO1xuXG4gICAgICAgIHRoaXMuY1syK3RoaXMuY3VycmVudF0udGV4dENvbnRlbnQgPSB0aGlzLnZhbHVlW3RoaXMuY3VycmVudF07XG5cbiAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuXG4gICAgICAgIHRoaXMucHJldi54ID0gZS5jbGllbnRYO1xuICAgICAgICB0aGlzLnByZXYueSA9IGUuY2xpZW50WTtcblxuICAgIH0sXG5cbiAgICAvLy8vL1xuXG4gICAgdGVzdFZhbHVlOiBmdW5jdGlvbiggbiApe1xuXG4gICAgICAgIGlmKCFpc05hTiggdGhpcy5jWzIrbl0udGV4dENvbnRlbnQgKSl7IFxuICAgICAgICAgICAgdmFyIG54ID0gdGhpcy5udW1WYWx1ZSggdGhpcy5jWzIrbl0udGV4dENvbnRlbnQgKTtcbiAgICAgICAgICAgIHRoaXMuY1syK25dLnRleHRDb250ZW50ID0gbng7XG4gICAgICAgICAgICB0aGlzLnZhbHVlW25dID0gbng7XG4gICAgICAgIH0gZWxzZSB7IC8vIG5vdCBudW1iZXJcbiAgICAgICAgICAgIHRoaXMuY1syK25dLnRleHRDb250ZW50ID0gdGhpcy52YWx1ZVtuXTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBhciA9IFtdO1xuICAgICAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB3aGlsZShpLS0pIGFyW2ldID0gdGhpcy52YWx1ZVtpXSp0aGlzLnRvUmFkO1xuXG4gICAgICAgIGlmKCB0aGlzLmlzTnVtYmVyICkgdGhpcy5zZW5kKCBhclswXSApO1xuICAgICAgICBlbHNlIHRoaXMuc2VuZCggYXIgKTtcblxuICAgIH0sXG5cbiAgICByU2l6ZTogZnVuY3Rpb24oKXtcblxuICAgICAgICBQcm90by5wcm90b3R5cGUuclNpemUuY2FsbCggdGhpcyApO1xuXG4gICAgICAgIHRoaXMudyA9IH5+KCAoIHRoaXMuc2IgKyA1ICkgLyB0aGlzLmxlbmd0aCApLTU7XG4gICAgICAgIHZhciBzID0gdGhpcy5zO1xuICAgICAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgc1syK2ldLmxlZnQgPSAofn4oIHRoaXMuc2EgKyAoIHRoaXMudyAqIGkgKSsoIDUgKiBpICkpKSArICdweCc7XG4gICAgICAgICAgICBzWzIraV0ud2lkdGggPSB0aGlzLncgKyAncHgnO1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0gKTtcblxuZnVuY3Rpb24gU2xpZGUgKCBvICl7XG5cbiAgICBQcm90by5jYWxsKCB0aGlzLCBvICk7XG5cbiAgICB0aGlzLnNldFR5cGVOdW1iZXIoIG8gKTtcblxuICAgIHRoaXMuc3R5cGUgPSBvLnN0eXBlIHx8IDA7XG4gICAgdGhpcy5idXR0b25Db2xvciA9IG8uYkNvbG9yIHx8IFRvb2xzLmNvbG9ycy5idXR0b247XG5cbiAgICAvL3RoaXMub2xkID0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgIHRoaXMuaXNPdmVyID0gZmFsc2U7XG4gICAgdGhpcy5hbGx3YXkgPSBvLmFsbHdheSB8fCBmYWxzZTtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy50eHRzZWxlY3QgKyAnbGV0dGVyLXNwYWNpbmc6LTFweDsgcGFkZGluZzoycHggNXB4OyB0ZXh0LWFsaWduOnJpZ2h0OyBjdXJzb3I6cG9pbnRlcjsgd2lkdGg6NDdweDsgYm9yZGVyOm5vbmU7IGNvbG9yOicrIHRoaXMuZm9udENvbG9yICk7XG4gICAgdGhpcy5jWzNdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3BvaW50ZXItZXZlbnRzOmF1dG87IGN1cnNvcjp3LXJlc2l6ZTsgdG9wOjA7IGhlaWdodDonK3RoaXMuaCsncHg7JyApO1xuICAgIC8vdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ2JvcmRlcjoxcHggc29saWQgJyt0aGlzLmJ1dHRvbkNvbG9yKyc7IHBvaW50ZXItZXZlbnRzOm5vbmU7IGJhY2tncm91bmQ6cmdiYSgwLDAsMCwwLjMpOyB0b3A6MnB4OyBoZWlnaHQ6JysodGhpcy5oLTQpKydweDsnICk7XG4gICAgdGhpcy5jWzRdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3BvaW50ZXItZXZlbnRzOm5vbmU7IGJhY2tncm91bmQ6cmdiYSgwLDAsMCwwLjMpOyB0b3A6MnB4OyBoZWlnaHQ6JysodGhpcy5oLTQpKydweDsnICk7XG4gICAgdGhpcy5jWzVdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ2xlZnQ6NHB4OyB0b3A6NXB4OyBoZWlnaHQ6JysodGhpcy5oLTEwKSsncHg7IGJhY2tncm91bmQ6JyArIHRoaXMuZm9udENvbG9yICsnOycgKTtcblxuICAgIHRoaXMuY1syXS5uYW1lID0gJ3RleHQnO1xuICAgIHRoaXMuY1szXS5uYW1lID0gJ3Njcm9sbCc7XG5cbiAgICBpZih0aGlzLnN0eXBlICE9PSAwKXtcbiAgICAgICAgaWYodGhpcy5zdHlwZSA9PT0gMSB8fCB0aGlzLnN0eXBlID09PSAzKXtcbiAgICAgICAgICAgIHZhciBoMSA9IDQ7XG4gICAgICAgICAgICB2YXIgaDIgPSA4O1xuICAgICAgICAgICAgdmFyIHd3ID0gdGhpcy5oLTQ7XG4gICAgICAgICAgICB2YXIgcmEgPSAyMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuc3R5cGUgPT09IDIpe1xuICAgICAgICAgICAgaDEgPSAyO1xuICAgICAgICAgICAgaDIgPSA0O1xuICAgICAgICAgICAgcmEgPSAyO1xuICAgICAgICAgICAgd3cgPSAodGhpcy5oLTQpKjAuNTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMuc3R5cGUgPT09IDMpIHRoaXMuY1s1XS5zdHlsZS52aXNpYmxlID0gJ25vbmUnO1xuXG4gICAgICAgIHRoaXMuY1s0XS5zdHlsZS5ib3JkZXJSYWRpdXMgPSBoMSArICdweCc7XG4gICAgICAgIHRoaXMuY1s0XS5zdHlsZS5oZWlnaHQgPSBoMiArICdweCc7XG4gICAgICAgIHRoaXMuY1s0XS5zdHlsZS50b3AgPSAodGhpcy5oKjAuNSkgLSBoMSArICdweCc7XG4gICAgICAgIHRoaXMuY1s1XS5zdHlsZS5ib3JkZXJSYWRpdXMgPSAoaDEqMC41KSArICdweCc7XG4gICAgICAgIHRoaXMuY1s1XS5zdHlsZS5oZWlnaHQgPSBoMSArICdweCc7XG4gICAgICAgIHRoaXMuY1s1XS5zdHlsZS50b3AgPSAodGhpcy5oKjAuNSktKGgxKjAuNSkgKyAncHgnO1xuXG4gICAgICAgIHRoaXMuY1s2XSA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdib3JkZXItcmFkaXVzOicrcmErJ3B4OyBtYXJnaW4tbGVmdDonKygtd3cqMC41KSsncHg7IGJvcmRlcjoxcHggc29saWQgJytUb29scy5jb2xvcnMuYm9yZGVyKyc7IGJhY2tncm91bmQ6Jyt0aGlzLmJ1dHRvbkNvbG9yKyc7IGxlZnQ6NHB4OyB0b3A6MnB4OyBoZWlnaHQ6JysodGhpcy5oLTQpKydweDsgd2lkdGg6Jyt3dysncHg7JyApO1xuICAgIH1cblxuICAgIHRoaXMuY1szXS5ldmVudHMgPSBbICdtb3VzZW92ZXInLCAnbW91c2Vkb3duJywgJ21vdXNlb3V0JyBdO1xuICAgIHRoaXMuY1syXS5ldmVudHMgPSBbICdrZXlkb3duJywgJ2tleXVwJywgJ21vdXNlZG93bicsICdibHVyJywgJ2ZvY3VzJyBdO1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuU2xpZGUucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBTbGlkZSxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoIGUgKSB7XG5cbiAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhlLnRhcmdldC5uYW1lKVxuXG4gICAgICAgIHN3aXRjaCggZS50eXBlICkge1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdmVyJzogdGhpcy5vdmVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2Vkb3duJzogZS50YXJnZXQubmFtZSA9PT0gJ3RleHQnID8gdGhpcy50ZXh0ZG93biggZSApIDogdGhpcy5kb3duKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdXQnOiB0aGlzLm91dCggZSApOyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHRoaXMudXAoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiBpZih0aGlzLmlzRG93bikgdGhpcy5tb3ZlKCBlICk7IGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdibHVyJzogdGhpcy5ibHVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOiB0aGlzLmZvY3VzKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAna2V5ZG93bic6IHRoaXMua2V5ZG93biggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2tleXVwJzogdGhpcy5rZXl1cCggZSApOyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIG1vZGU6IGZ1bmN0aW9uICggbW9kZSApIHtcblxuICAgICAgICB2YXIgcyA9IHRoaXMucztcblxuICAgICAgICBzd2l0Y2gobW9kZSl7XG4gICAgICAgICAgICBjYXNlIDA6IC8vIGJhc2VcbiAgICAgICAgICAgICAgICBzWzJdLmNvbG9yID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICAgICAgc1s0XS5iYWNrZ3JvdW5kID0gJ3JnYmEoMCwwLDAsMC4zKSc7XG4gICAgICAgICAgICAgICAgc1s1XS5iYWNrZ3JvdW5kID0gdGhpcy5mb250Q29sb3I7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTogLy8gb3ZlclxuICAgICAgICAgICAgICAgIHNbMl0uY29sb3IgPSB0aGlzLmNvbG9yUGx1cztcbiAgICAgICAgICAgICAgIC8vIGlmKCAhc1s2XSApIHNbNF0uYmFja2dyb3VuZCA9IFVJTC5TbGlkZUJHO1xuICAgICAgICAgICAgICAgLy8gZWxzZSBcbiAgICAgICAgICAgICAgICBzWzRdLmJhY2tncm91bmQgPSAncmdiYSgwLDAsMCwwLjYpJztcbiAgICAgICAgICAgICAgICBzWzVdLmJhY2tncm91bmQgPSB0aGlzLmNvbG9yUGx1cztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG92ZXI6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuaXNPdmVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RlKDEpO1xuXG4gICAgfSxcblxuICAgIG91dDogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5pc092ZXIgPSBmYWxzZTtcbiAgICAgICAgaWYodGhpcy5pc0Rvd24pIHJldHVybjtcbiAgICAgICAgdGhpcy5tb2RlKDApO1xuXG4gICAgfSxcblxuICAgIHVwOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICB0aGlzLmlzRG93biA9IGZhbHNlO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgICAgIGlmKHRoaXMuaXNPdmVyKSB0aGlzLm1vZGUoMSk7XG4gICAgICAgIGVsc2UgdGhpcy5tb2RlKDApO1xuXG4gICAgICAgIHRoaXMuc2VuZEVuZCgpO1xuICAgICAgICBcbiAgICB9LFxuXG4gICAgZG93bjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5pc0Rvd24gPSB0cnVlO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZW1vdmUnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgICAgIHRoaXMubGVmdCA9IHRoaXMuY1szXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgICB0aGlzLm9sZCA9IHRoaXMudmFsdWU7XG4gICAgICAgIHRoaXMubW92ZSggZSApO1xuXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgdmFyIG4gPSAoKCggZS5jbGllbnRYIC0gdGhpcy5sZWZ0IC0gMyApIC8gdGhpcy53ICkgKiB0aGlzLnJhbmdlICsgdGhpcy5taW4gKSAtIHRoaXMub2xkO1xuICAgICAgICBpZihuID49IHRoaXMuc3RlcCB8fCBuIDw9IHRoaXMuc3RlcCl7IFxuICAgICAgICAgICAgbiA9IH5+ICggbiAvIHRoaXMuc3RlcCApO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubnVtVmFsdWUoIHRoaXMub2xkICsgKCBuICogdGhpcy5zdGVwICkgKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCB0cnVlICk7XG4gICAgICAgICAgICB0aGlzLm9sZCA9IHRoaXMudmFsdWU7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCB1cCApe1xuXG4gICAgICAgIHZhciB3dyA9IHRoaXMudyAqICgoIHRoaXMudmFsdWUgLSB0aGlzLm1pbiApIC8gdGhpcy5yYW5nZSApO1xuICAgICAgIFxuICAgICAgICBpZih0aGlzLnN0eXBlICE9PSAzKSB0aGlzLnNbNV0ud2lkdGggPSB+fiB3dyArICdweCc7XG4gICAgICAgIGlmKHRoaXMuc1s2XSkgdGhpcy5zWzZdLmxlZnQgPSB+fiAodGhpcy5zYSArd3cgKyAzKSArICdweCc7XG4gICAgICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWU7XG5cbiAgICAgICAgaWYoIHVwICkgdGhpcy5zZW5kKCk7XG5cbiAgICB9LFxuXG4gICAgclNpemU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcblxuICAgICAgICB2YXIgdyA9IHRoaXMuc2IgLSB0aGlzLnNjO1xuICAgICAgICB0aGlzLncgPSB3IC0gNjtcblxuICAgICAgICB2YXIgdHggPSB0aGlzLnNjO1xuICAgICAgICBpZih0aGlzLmlzVUkgfHwgIXRoaXMuc2ltcGxlKSB0eCA9IHRoaXMuc2MrMTA7XG5cbiAgICAgICAgdmFyIHR5ID0gfn4odGhpcy5oICogMC41KSAtIDg7XG5cbiAgICAgICAgdmFyIHMgPSB0aGlzLnM7XG5cbiAgICAgICAgc1syXS53aWR0aCA9ICh0aGlzLnNjIC0yICkrICdweCc7XG4gICAgICAgIHNbMl0ubGVmdCA9ICh0aGlzLndpZHRoIC0gdHggKzIpICsgJ3B4JztcbiAgICAgICAgc1syXS50b3AgPSB0eSArICdweCc7XG4gICAgICAgIHNbM10ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuICAgICAgICBzWzNdLndpZHRoID0gdyArICdweCc7XG4gICAgICAgIHNbNF0ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuICAgICAgICBzWzRdLndpZHRoID0gdyArICdweCc7XG4gICAgICAgIHNbNV0ubGVmdCA9ICh0aGlzLnNhICsgMykgKyAncHgnO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICB9LFxuXG4gICAgLy8gdGV4dFxuXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoIWlzTmFOKCB0aGlzLmNbMl0udGV4dENvbnRlbnQgKSl7IFxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMubnVtVmFsdWUoIHRoaXMuY1syXS50ZXh0Q29udGVudCApOyBcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRydWUpOyBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWU7XG5cbiAgICB9LFxuXG4gICAgdGV4dGRvd246IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS50YXJnZXQuY29udGVudEVkaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgZS50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5pc0VkaXQgPSB0cnVlO1xuXG4gICAgfSxcblxuICAgIGtleWRvd246IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBpZiggZS5rZXlDb2RlID09PSAxMyApe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSgpO1xuICAgICAgICAgICAgZS50YXJnZXQuYmx1cigpO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAga2V5dXA6IGZ1bmN0aW9uKCBlICl7XG4gICAgICAgIFxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBpZiggdGhpcy5hbGx3YXkgKSB0aGlzLnZhbGlkYXRlKCk7XG5cbiAgICB9LFxuXG4gICAgYmx1cjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBlLnRhcmdldC5zdHlsZS5ib3JkZXIgPSAnbm9uZSc7XG4gICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRWRpdCA9IGZhbHNlO1xuXG4gICAgfSxcblxuICAgIGZvY3VzOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmJvcmRlciA9ICcxcHggZGFzaGVkICcgKyBUb29scy5jb2xvcnMuYm9yZGVyU2VsZWN0O1xuXG4gICAgfVxuXG59ICk7XG5cbmZ1bmN0aW9uIFRleHRJbnB1dCggbyApe1xuXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgdGhpcy52YWx1ZSA9IG8udmFsdWUgfHwgJyc7XG4gICAgdGhpcy5hbGx3YXkgPSBvLmFsbHdheSB8fCBmYWxzZTtcblxuICAgIHRoaXMuY1syXSA9IFRvb2xzLmRvbSggJ2RpdicsICBUb29scy5jc3MudHh0c2VsZWN0ICk7XG4gICAgdGhpcy5jWzJdLm5hbWUgPSAnaW5wdXQnO1xuICAgIC8vdGhpcy5jWzJdLnN0eWxlLmNvbG9yID0gO1xuICAgIHRoaXMuY1syXS50ZXh0Q29udGVudCA9IHRoaXMudmFsdWU7XG5cbiAgICB0aGlzLmNbMl0uZXZlbnRzID0gWyAnbW91c2Vkb3duJywgJ2tleWRvd24nLCAna2V5dXAnLCAnYmx1cicsICdmb2N1cycgXTtcblxuICAgIHRoaXMuaW5pdCgpO1xuXG59XG5cblRleHRJbnB1dC5wcm90b3R5cGUgPSBPYmplY3QuYXNzaWduKCBPYmplY3QuY3JlYXRlKCBQcm90by5wcm90b3R5cGUgKSwge1xuXG4gICAgY29uc3RydWN0b3I6IFRleHRJbnB1dCxcblxuICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiggZSApIHtcblxuICAgICAgICBzd2l0Y2goIGUudHlwZSApIHtcbiAgICAgICAgICAgIGNhc2UgJ21vdXNlZG93bic6IHRoaXMuZG93biggZSApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2JsdXInOiB0aGlzLmJsdXIoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6IHRoaXMuZm9jdXMoIGUgKTsgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2tleWRvd24nOiB0aGlzLmtleWRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdrZXl1cCc6IHRoaXMua2V5dXAoIGUgKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBkb3duOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUudGFyZ2V0LmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgICAgIGUudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdhdXRvJztcblxuICAgIH0sXG5cbiAgICBibHVyOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gVG9vbHMuY29sb3JzLmJvcmRlcjtcbiAgICAgICAgZS50YXJnZXQuY29udGVudEVkaXRhYmxlID0gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgZm9jdXM6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBUb29scy5jb2xvcnMuYm9yZGVyU2VsZWN0O1xuXG4gICAgfSxcblxuICAgIGtleWRvd246IGZ1bmN0aW9uKCBlICl7XG4gICAgICAgIFxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmKCBlLmtleUNvZGUgPT09IDEzICl7IFxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGUudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICAgICAgZS50YXJnZXQuYmx1cigpO1xuICAgICAgICAgICAgdGhpcy5zZW5kKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBrZXl1cDogZnVuY3Rpb24oIGUgKXtcbiAgICAgICAgXG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IGUudGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICBpZiggdGhpcy5hbGx3YXkgKSB0aGlzLnNlbmQoKTtcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIFByb3RvLnByb3RvdHlwZS5yU2l6ZS5jYWxsKCB0aGlzICk7XG4gICAgICAgIHRoaXMuc1syXS5jb2xvciA9IHRoaXMuZm9udENvbG9yO1xuICAgICAgICB0aGlzLnNbMl0ubGVmdCA9IHRoaXMuc2EgKyAncHgnO1xuICAgICAgICB0aGlzLnNbMl0ud2lkdGggPSB0aGlzLnNiICsgJ3B4JztcbiAgICAgICAgdGhpcy5zWzJdLmhlaWdodCA9IHRoaXMuaCAtNCArICdweCc7XG4gICAgICAgIHRoaXMuc1syXS5saW5lSGVpZ2h0ID0gdGhpcy5oIC0gOCArICdweCc7XG4gICAgIFxuICAgIH1cblxufSApO1xuXG5mdW5jdGlvbiBUaXRsZSAoIG8gKSB7XG4gICAgXG4gICAgUHJvdG8uY2FsbCggdGhpcywgbyApO1xuXG4gICAgLy92YXIgaWQgPSBvLmlkIHx8IDA7XG4gICAgdmFyIHByZWZpeCA9IG8ucHJlZml4IHx8ICcnO1xuXG4gICAgdGhpcy5jWzJdID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLnR4dCArICd0ZXh0LWFsaWduOnJpZ2h0OyB3aWR0aDo2MHB4OyBsaW5lLWhlaWdodDonKyAodGhpcy5oLTgpICsgJ3B4OyBjb2xvcjonICsgdGhpcy5mb250Q29sb3IgKTtcblxuICAgIGlmKCB0aGlzLmggPT09IDMxICl7XG5cbiAgICAgICAgdGhpcy5zWzBdLmhlaWdodCA9IHRoaXMuaCArICdweCc7XG4gICAgICAgIHRoaXMuc1sxXS50b3AgPSA4ICsgJ3B4JztcbiAgICAgICAgdGhpcy5jWzJdLnN0eWxlLnRvcCA9IDggKyAncHgnO1xuXG4gICAgfVxuXG4gICAgdGhpcy5jWzFdLnRleHRDb250ZW50ID0gdGhpcy50eHQuc3Vic3RyaW5nKDAsMSkudG9VcHBlckNhc2UoKSArIHRoaXMudHh0LnN1YnN0cmluZygxKS5yZXBsYWNlKFwiLVwiLCBcIiBcIik7XG4gICAgdGhpcy5jWzJdLnRleHRDb250ZW50ID0gcHJlZml4O1xuXG4gICAgdGhpcy5pbml0KCk7XG5cbn1cblxuVGl0bGUucHJvdG90eXBlID0gT2JqZWN0LmFzc2lnbiggT2JqZWN0LmNyZWF0ZSggUHJvdG8ucHJvdG90eXBlICksIHtcblxuICAgIGNvbnN0cnVjdG9yOiBUaXRsZSxcblxuICAgIHRleHQ6IGZ1bmN0aW9uICggdHh0ICkge1xuXG4gICAgICAgIHRoaXMuY1sxXS50ZXh0Q29udGVudCA9IHR4dDtcblxuICAgIH0sXG5cbiAgICB0ZXh0MjogZnVuY3Rpb24gKCB0eHQgKSB7XG5cbiAgICAgICAgdGhpcy5jWzJdLnRleHRDb250ZW50ID0gdHh0O1xuXG4gICAgfSxcblxuICAgIHJTaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgUHJvdG8ucHJvdG90eXBlLnJTaXplLmNhbGwoIHRoaXMgKTtcbiAgICAgICAgdGhpcy5zWzFdLndpZHRoID0gdGhpcy53aWR0aC01MCArICdweCc7XG4gICAgICAgIHRoaXMuc1syXS5sZWZ0ID0gdGhpcy53aWR0aC0oNTArMjYpICsgJ3B4JztcblxuICAgIH0sXG5cbn0gKTtcblxuZnVuY3Rpb24gZ2V0VHlwZSggbmFtZSwgbyApIHtcblxuICAgICAgICB2YXIgbiA9IG51bGw7XG5cbiAgICAgICAgc3dpdGNoKCBuYW1lICl7XG5cbiAgICAgICAgICAgIGNhc2UgJ0Jvb2wnOiBjYXNlICdib29sJzogbiA9IG5ldyBCb29sKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0J1dHRvbic6IGNhc2UgJ2J1dHRvbic6IG4gPSBuZXcgQnV0dG9uKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0NpcmN1bGFyJzogY2FzZSAnY2lyY3VsYXInOiBuID0gbmV3IENpcmN1bGFyKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0NvbG9yJzogY2FzZSAnY29sb3InOiBuID0gbmV3IENvbG9yKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0Zwcyc6IGNhc2UgJ2Zwcyc6IG4gPSBuZXcgRnBzKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0dyb3VwJzogY2FzZSAnZ3JvdXAnOiBuID0gbmV3IEdyb3VwKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0pveXN0aWNrJzogY2FzZSAnam95c3RpY2snOiBuID0gbmV3IEpveXN0aWNrKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0tub2InOiBjYXNlICdrbm9iJzogbiA9IG5ldyBLbm9iKG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ0xpc3QnOiBjYXNlICdsaXN0JzogbiA9IG5ldyBMaXN0KG8pOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ051bWVyaWMnOmNhc2UgJ051bWJlcic6IGNhc2UgJ251bWVyaWMnOmNhc2UgJ251bWJlcic6IG4gPSBuZXcgTnVtZXJpYyhvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdTbGlkZSc6IGNhc2UgJ3NsaWRlJzogbiA9IG5ldyBTbGlkZShvKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdUZXh0SW5wdXQnOmNhc2UgJ1N0cmluZyc6IGNhc2UgJ3RleHRJbnB1dCc6Y2FzZSAnc3RyaW5nJzogbiA9IG5ldyBUZXh0SW5wdXQobyk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnVGl0bGUnOiBjYXNlICd0aXRsZSc6IG4gPSBuZXcgVGl0bGUobyk7IGJyZWFrO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbn1cblxuZnVuY3Rpb24gYWRkICgpe1xuXG4gICAgdmFyIGEgPSBhcmd1bWVudHM7IFxuXG4gICAgdmFyIHR5cGUsIG8sIHJlZiA9IGZhbHNlO1xuXG4gICAgaWYoIHR5cGVvZiBhWzBdID09PSAnc3RyaW5nJyApeyBcblxuICAgICAgICB0eXBlID0gYVswXTsvL1swXS50b1VwcGVyQ2FzZSgpICsgYVswXS5zbGljZSgxKTtcbiAgICAgICAgbyA9IGFbMV0gfHwge307XG5cbiAgICB9IGVsc2UgaWYgKCB0eXBlb2YgYVswXSA9PT0gJ29iamVjdCcgKXsgLy8gbGlrZSBkYXQgZ3VpXG5cbiAgICAgICAgcmVmID0gdHJ1ZTtcbiAgICAgICAgaWYoIGFbMl0gPT09IHVuZGVmaW5lZCApIFtdLnB1c2guY2FsbChhLCB7fSk7XG5cbiAgICAgICAgdHlwZSA9IGF1dG9UeXBlLmFwcGx5KCB0aGlzLCBhICk7XG5cbiAgICAgICAgbyA9IGFbMl07XG5cbiAgICAgICAgby5uYW1lID0gYVsxXTtcbiAgICAgICAgby52YWx1ZSA9IGFbMF1bYVsxXV07XG5cbiAgICB9XG5cbiAgICB2YXIgbiA9IGdldFR5cGUoIHR5cGUsIG8gKTtcblxuICAgIGlmKG4gIT09IG51bGwgKXtcbiAgICAgICAgaWYoIHJlZiApIG4uc2V0UmVmZXJlbmN5KCBhWzBdLCBhWzFdICk7XG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgICBcblxufVxuXG5mdW5jdGlvbiBhdXRvVHlwZSAoKSB7XG5cbiAgICB2YXIgYSA9IGFyZ3VtZW50cztcblxuICAgIHZhciB0eXBlID0gJ1NsaWRlJztcblxuICAgIGlmKGFbMl0udHlwZSkgdHlwZSA9IGFbMl0udHlwZTtcblxuICAgIHJldHVybiB0eXBlO1xuXG59XG5cbnZhciBSRVZJU0lPTiA9ICcxLjAnO1xuXG4vKipcbiAqIEBhdXRob3IgbG8tdGggLyBodHRwczovL2dpdGh1Yi5jb20vbG8tdGhcbiAqL1xuXG5mdW5jdGlvbiBHdWkgKCBvICkge1xuXG4gICAgbyA9IG8gfHwge307XG5cbiAgICAvLyBjc3MgcGx1c1xuICAgIHRoaXMuY3NzID0gby5jc3MgIT09IHVuZGVmaW5lZCA/IG8uY3NzIDogJyc7XG5cbiAgICAvLyBzaXplIGRlZmluZVxuICAgIHRoaXMuc2l6ZSA9IFRvb2xzLnNpemU7XG4gICAgaWYoIG8ucCAhPT0gdW5kZWZpbmVkICkgdGhpcy5zaXplLnAgPSBvLnA7XG4gICAgaWYoIG8udyAhPT0gdW5kZWZpbmVkICkgdGhpcy5zaXplLncgPSBvLnc7XG4gICAgaWYoIG8uaCAhPT0gdW5kZWZpbmVkICkgdGhpcy5zaXplLmggPSBvLmg7XG4gICAgaWYoIG8ucyAhPT0gdW5kZWZpbmVkICkgdGhpcy5zaXplLnMgPSBvLnM7XG5cbiAgICB0aGlzLnNpemUuaCA9IHRoaXMuc2l6ZS5oIDwgMTEgPyAxMSA6IHRoaXMuc2l6ZS5oO1xuXG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc2l6ZS53O1xuXG4gICAgLy8gYm90dG9tIGhlaWdodFxuICAgIHRoaXMuYmggPSB0aGlzLnNpemUuaDtcblxuXG5cblxuICAgIC8vdGhpcy53aWR0aCA9IG8ud2lkdGggIT09IHVuZGVmaW5lZCA/IG8ud2lkdGggOiBUb29scy5zaXplLndpZHRoO1xuICAgIC8vdGhpcy53aWR0aCA9IG8uc2l6ZSAhPT0gdW5kZWZpbmVkID8gby5zaXplIDogdGhpcy53aWR0aDtcblxuXG4gICAgLy8gdG1wIHZhcmlhYmxlXG4gICAgdGhpcy5oZWlnaHQgPSAwO1xuICAgIHRoaXMubGVmdCA9IDA7XG4gICAgdGhpcy5oID0gMDtcbiAgICB0aGlzLnByZXZZID0gLTE7XG4gICAgdGhpcy5zdyA9IDA7XG5cblxuICAgIC8vIGNvbG9yXG4gICAgdGhpcy5jb2xvcnMgPSBUb29scy5jb2xvcnM7XG4gICAgdGhpcy5iZyA9IG8uYmcgfHwgVG9vbHMuY29sb3JzLmJhY2tncm91bmQ7XG5cbiAgICAvLyBib3R0b20gYW5kIGNsb3NlIGhlaWdodFxuICAgIHRoaXMuaXNXaXRoQ2xvc2UgPSB0cnVlO1xuICAgIFxuXG4gICAgLy90aGlzLmJhc2VIID0gVG9vbHMuc2l6ZS5oZWlnaHQ7XG5cbiAgICBpZihvLmNsb3NlICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgdGhpcy5pc1dpdGhDbG9zZSA9IG8uY2xvc2U7XG4gICAgICAgIHRoaXMuYmggPSAhdGhpcy5pc1dpdGhDbG9zZSA/IDAgOiB0aGlzLmJoO1xuICAgIH1cblxuXG5cbiAgICBcblxuICAgIFRvb2xzLm1haW4gPSB0aGlzO1xuXG4gICAgdGhpcy5jYWxsYmFjayA9IG8uY2FsbGJhY2sgID09PSB1bmRlZmluZWQgPyBudWxsIDogby5jYWxsYmFjaztcblxuICAgXG4gICAgXG4gICAgdGhpcy5pc0NlbnRlciA9IG8uY2VudGVyIHx8IGZhbHNlO1xuICAgIHRoaXMubG9ja3doZWVsID0gZmFsc2U7XG4gICAgdGhpcy5vbldoZWVsID0gZmFsc2U7XG4gICAgdGhpcy5pc09wZW4gPSB0cnVlO1xuXG4gICAgdGhpcy51aXMgPSBbXTtcblxuICAgIHRoaXMuY29udGVudCA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICdkaXNwbGF5OmJsb2NrOyB3aWR0aDonK3RoaXMud2lkdGgrJ3B4OyBoZWlnaHQ6YXV0bzsgdG9wOjA7IHJpZ2h0OjEwcHg7IHRyYW5zaXRpb246aGVpZ2h0IDAuMXMgZWFzZS1vdXQ7JyArIHRoaXMuY3NzICk7XG4gICAgaWYoIG8ucGFyZW50ICE9PSB1bmRlZmluZWQgKSBvLnBhcmVudC5hcHBlbmRDaGlsZCggdGhpcy5jb250ZW50ICk7XG4gICAgZWxzZSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKCB0aGlzLmNvbnRlbnQgKTtcblxuICAgIHRoaXMuaW5uZXJDb250ZW50ID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3dpZHRoOjEwMCU7IHRvcDowOyBsZWZ0OjA7IGhlaWdodDphdXRvOyBvdmVyZmxvdzpoaWRkZW47Jyk7XG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKCB0aGlzLmlubmVyQ29udGVudCApO1xuXG4gICAgdGhpcy5pbm5lciA9IFRvb2xzLmRvbSggJ2RpdicsIFRvb2xzLmNzcy5iYXNpYyArICd3aWR0aDoxMDAlOyB0b3A6MDsgbGVmdDowOyBoZWlnaHQ6YXV0bzsgYmFja2dyb3VuZDonK3RoaXMuYmcrJzsnKTtcbiAgICB0aGlzLmlubmVyQ29udGVudC5hcHBlbmRDaGlsZCh0aGlzLmlubmVyKTtcbiAgICB0aGlzLmlubmVyLm5hbWUgPSAnaW5uZXInO1xuXG4gICAgLy8gc2Nyb2xsIGJhY2tncm91bmRcbiAgICB0aGlzLnNjcm9sbEJHID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ3JpZ2h0OjA7IHRvcDowOyB3aWR0aDonK3RoaXMuc2l6ZS5zKydweDsgaGVpZ2h0OjEwcHg7IGN1cnNvcjpzLXJlc2l6ZTsgcG9pbnRlci1ldmVudHM6YXV0bzsgZGlzcGxheTpub25lOyBiYWNrZ3JvdW5kOicrdGhpcy5iZysnOyBib3JkZXItbGVmdDoxcHggc29saWQgJyt0aGlzLmNvbG9ycy5zdHJva2UrJzsnKTtcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoIHRoaXMuc2Nyb2xsQkcgKTtcbiAgICB0aGlzLnNjcm9sbEJHLm5hbWUgPSAnc2Nyb2xsJztcblxuICAgIC8vIHNjcm9sbFxuICAgIHRoaXMuc2Nyb2xsID0gVG9vbHMuZG9tKCAnZGl2JywgVG9vbHMuY3NzLmJhc2ljICsgJ2JhY2tncm91bmQ6Jyt0aGlzLmNvbG9ycy5zY3JvbGwrJzsgcmlnaHQ6MHB4OyB0b3A6MDsgd2lkdGg6Jyt0aGlzLnNpemUucysncHg7IGhlaWdodDoxMHB4OycpO1xuICAgIHRoaXMuc2Nyb2xsQkcuYXBwZW5kQ2hpbGQoIHRoaXMuc2Nyb2xsICk7XG5cbiAgICB0aGlzLmJvdHRvbSA9IFRvb2xzLmRvbSggJ2RpdicsICBUb29scy5jc3MudHh0ICsgJ3dpZHRoOjEwMCU7IHRvcDphdXRvOyBib3R0b206MDsgbGVmdDowOyBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czoxMHB4OyAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czoxMHB4OyB0ZXh0LWFsaWduOmNlbnRlcjsgcG9pbnRlci1ldmVudHM6YXV0bzsgY3Vyc29yOnBvaW50ZXI7IGhlaWdodDonK3RoaXMuYmgrJ3B4OyBsaW5lLWhlaWdodDonKyh0aGlzLmJoLTUpKydweDsgYm9yZGVyLXRvcDoxcHggc29saWQgJytUb29scy5jb2xvcnMuc3Ryb2tlKyc7Jyk7XG4gICAgdGhpcy5jb250ZW50LmFwcGVuZENoaWxkKHRoaXMuYm90dG9tKTtcbiAgICB0aGlzLmJvdHRvbS50ZXh0Q29udGVudCA9ICdjbG9zZSc7XG4gICAgdGhpcy5ib3R0b20ubmFtZSA9ICdib3R0b20nO1xuICAgIHRoaXMuYm90dG9tLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmJnO1xuICAgIFxuICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XG4gICAgdGhpcy5pc1Njcm9sbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jYWxsYmFja0Nsb3NlID0gZnVuY3Rpb24oKXt9O1xuXG4gICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZWRvd24nLCB0aGlzLCBmYWxzZSApO1xuICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcbiAgICB0aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNlb3V0JywgIHRoaXMsIGZhbHNlICk7XG4gICAgdGhpcy5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgICB0aGlzLCBmYWxzZSApO1xuICAgIHRoaXMuY29udGVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2VvdmVyJywgdGhpcywgZmFsc2UgKTtcblxuICAgIC8vY29uc29sZS5sb2codGhpcy5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCk7XG5cbiAgICB0aGlzLnRvcCA9IG8udG9wIHx8IHRoaXMuY29udGVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgLy90aGlzLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCB0aGlzLCBmYWxzZSApO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCBmdW5jdGlvbihlKXt0aGlzLndoZWVsKGUpO30uYmluZCh0aGlzKSwgZmFsc2UgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbihlKXt0aGlzLnJlc2l6ZShlKTt9LmJpbmQodGhpcyksIGZhbHNlICk7XG5cbiAgICAvL1xuXG4gICAgdGhpcy5zZXRXaWR0aCggdGhpcy53aWR0aCApO1xuXG59XG5cbkd1aS5wcm90b3R5cGUgPSB7XG5cbiAgICBjb25zdHJ1Y3RvcjogR3VpLFxuXG4gICAgc2V0VGV4dDogZnVuY3Rpb24gKCBzaXplLCBjb2xvciwgZm9udCApIHtcblxuICAgICAgICBUb29scy5zZXRUZXh0KCBzaXplLCBjb2xvciwgZm9udCApO1xuXG4gICAgfSxcblxuICAgIGhpZGUgOiBmdW5jdGlvbiAoYikge1xuXG4gICAgICAgIGlmKGIpIHRoaXMuY29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBlbHNlIHRoaXMuY29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgXG4gICAgfSxcblxuICAgIHNldEJHIDogZnVuY3Rpb24oYyl7XG5cbiAgICAgICAgdGhpcy5iZyA9IGM7XG5cbiAgICAgICAgLyp2YXIgaSA9IHRoaXMudWlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIHRoaXMudWlzW2ldLnNldEJHKGMpO1xuICAgICAgICB9Ki9cblxuICAgICAgICB0aGlzLmlubmVyc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuYmc7XG4gICAgICAgIHRoaXMuYm90dG9tLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmJnO1xuXG4gICAgfSxcblxuICAgIGdldEhUTUwgOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnQ7XG5cbiAgICB9LFxuXG4gICAgb25DaGFuZ2UgOiBmdW5jdGlvbiggZiApe1xuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sgPSBmO1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG5cbiAgICBoYW5kbGVFdmVudCA6IGZ1bmN0aW9uKCBlICkge1xuXG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgc3dpdGNoKCBlLnR5cGUgKSB7XG4gICAgICAgICAgICBjYXNlICdtb3VzZWRvd24nOiB0aGlzLmRvd24oIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW91dCc6IHRoaXMub3V0KCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbW91c2VvdmVyJzogdGhpcy5vdmVyKCBlICk7IGJyZWFrO1xuICAgICAgICAgICAgLy9jYXNlICdtb3VzZXdoZWVsJzogdGhpcy53aGVlbCggZSApOyBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbW91c2V1cCc6IHRoaXMudXAoIGUgKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdtb3VzZW1vdmUnOiB0aGlzLm1vdmUoIGUgKTsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBNb3VzZSBldmVudFxuXG4gICAgZG93bjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBpZiggIWUudGFyZ2V0Lm5hbWUgKSByZXR1cm47XG5cbiAgICAgICAgaWYoZS50YXJnZXQubmFtZSA9PT0gJ3Njcm9sbCcpe1xuICAgICAgICAgICAgdGhpcy5pc0Rvd24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5tb3ZlKCBlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V1cCcsIHRoaXMsIGZhbHNlICk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgfVxuICAgICAgICBpZihlLnRhcmdldC5uYW1lID09PSAnYm90dG9tJyl7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbiA9IHRoaXMuaXNPcGVuID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ib3R0b20udGV4dENvbnRlbnQgPSB0aGlzLmlzT3BlbiA/ICdjbG9zZScgOiAnb3Blbic7XG4gICAgICAgICAgICB0aGlzLnRlc3RIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LFxuXG4gICAgbW92ZTogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBpZighdGhpcy5pc0Rvd24pIHJldHVybjtcbiAgICAgICAgdGhpcy5zY3JvbGwuc3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuY29sb3JzLmRvd247XG4gICAgICAgIHRoaXMudXBkYXRlKCAoZS5jbGllbnRZLXRoaXMudG9wKS0odGhpcy5zaCowLjUpICk7XG5cbiAgICB9LFxuXG4gICAgXG5cbiAgICBvdXQ6IGZ1bmN0aW9uKCBlICl7XG5cbiAgICAgICAgaWYoICFlLnRhcmdldC5uYW1lICkgcmV0dXJuO1xuXG4gICAgICAgIGlmKGUudGFyZ2V0Lm5hbWUgPT09ICdzY3JvbGwnKXtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmNvbG9ycy5zY3JvbGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZihlLnRhcmdldC5uYW1lID09PSAnYm90dG9tJyl7XG4gICAgICAgICAgICB0aGlzLmJvdHRvbS5zdHlsZS5jb2xvciA9ICcjQ0NDJztcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIHVwOiBmdW5jdGlvbiggZSApe1xuXG4gICAgICAgIHRoaXMuaXNEb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmNvbG9ycy5zY3JvbGw7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXVwJywgdGhpcywgZmFsc2UgKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNlbW92ZScsIHRoaXMsIGZhbHNlICk7XG5cbiAgICB9LFxuXG4gICAgb3ZlcjogZnVuY3Rpb24oIGUgKXtcblxuICAgICAgICBpZiggIWUudGFyZ2V0Lm5hbWUgKSByZXR1cm47XG4gICAgICAgIGlmKGUudGFyZ2V0Lm5hbWUgPT09ICdzY3JvbGwnKXtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLmJhY2tncm91bmQgPSB0aGlzLmNvbG9ycy5zZWxlY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYoZS50YXJnZXQubmFtZSA9PT0gJ2JvdHRvbScpe1xuICAgICAgICAgICAgdGhpcy5ib3R0b20uc3R5bGUuY29sb3IgPSAnI0ZGRic7XG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBXaGVlbCBldmVudFxuXG4gICAgd2hlZWw6IGZ1bmN0aW9uICggZSApe1xuXG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvL2Uuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgaWYoIHRoaXMubG9ja3doZWVsIHx8ICF0aGlzLmlzU2Nyb2xsICkgcmV0dXJuO1xuXG4gICAgICAgIC8vdGhpcy5vbldoZWVsID0gdHJ1ZTtcblxuICAgICAgICB2YXIgeCA9IGUuY2xpZW50WDtcbiAgICAgICAgdmFyIHB4ID0gdGhpcy5jb250ZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XG5cbiAgICAgICAgaWYoeDxweCkgcmV0dXJuO1xuICAgICAgICBpZih4PihweCt0aGlzLndpZHRoKSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBkZWx0YSA9IDA7XG4gICAgICAgIGlmKGUud2hlZWxEZWx0YVkpIGRlbHRhID0gLWUud2hlZWxEZWx0YVkqMC4wNDtcbiAgICAgICAgZWxzZSBpZihlLndoZWVsRGVsdGEpIGRlbHRhID0gLWUud2hlZWxEZWx0YSowLjI7XG4gICAgICAgIGVsc2UgaWYoZS5kZXRhaWwpIGRlbHRhID0gZS5kZXRhaWwqNC4wO1xuXG4gICAgICAgIHRoaXMucHkgKz0gZGVsdGE7XG5cbiAgICAgICAgdGhpcy51cGRhdGUoIHRoaXMucHkgKTtcblxuICAgIH0sXG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLy8gQWRkIG5vZGUgdG8gZ3VpXG5cbiAgICBhZGQ6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgYSA9IGFyZ3VtZW50cztcblxuICAgICAgICBpZiggdHlwZW9mIGFbMV0gPT09ICdvYmplY3QnICl7IFxuXG4gICAgICAgICAgICBhWzFdLmlzVUkgPSB0cnVlO1xuICAgICAgICAgICAgYVsxXS5tYWluID0gdGhpcztcblxuICAgICAgICB9IGVsc2UgaWYoIHR5cGVvZiBhWzFdID09PSAnc3RyaW5nJyApe1xuXG4gICAgICAgICAgICBpZiggYVsyXSA9PT0gdW5kZWZpbmVkICkgW10ucHVzaC5jYWxsKGEsIHsgaXNVSTp0cnVlLCBtYWluOnRoaXMgfSk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhWzJdLmlzVUkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFbMl0ubWFpbiA9IHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfSBcblxuXG4gICAgICAgIHZhciBuID0gYWRkLmFwcGx5KCB0aGlzLCBhICk7XG4gICAgICAgIC8vdmFyIG4gPSBVSUwuYWRkKCAuLi5hcmdzICk7XG5cbiAgICAgICAgdGhpcy51aXMucHVzaCggbiApO1xuICAgICAgICBuLnB5ID0gdGhpcy5oO1xuXG4gICAgICAgIGlmKCAhbi5hdXRvV2lkdGggKXtcbiAgICAgICAgICAgIHZhciB5ID0gbi5jWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgICAgICAgIGlmKCB0aGlzLnByZXZZICE9PSB5ICl7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjKCBuLmggKyAxICk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2WSA9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdGhpcy5wcmV2WSA9IC0xO1xuICAgICAgICAgICAgdGhpcy5jYWxjKCBuLmggKyAxICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbjtcbiAgICB9LFxuXG4gICAgLy8gcmVtb3ZlIG9uZSBub2RlXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uICggbiApIHsgXG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5pbmRleE9mKCBuICk7IFxuICAgICAgICBpZiAoIGkgIT09IC0xICkgdGhpcy51aXNbaV0uY2xlYXIoKTtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsIGFmdGVyIHVpcyBjbGVhclxuXG4gICAgY2xlYXJPbmU6IGZ1bmN0aW9uICggbiApIHsgXG5cbiAgICAgICAgdmFyIGkgPSB0aGlzLnVpcy5pbmRleE9mKCBuICk7IFxuICAgICAgICBpZiAoIGkgIT09IC0xICkge1xuICAgICAgICAgICAgdGhpcy5pbm5lci5yZW1vdmVDaGlsZCggdGhpcy51aXNbaV0uY1swXSApO1xuICAgICAgICAgICAgdGhpcy51aXMuc3BsaWNlKCBpLCAxICk7IFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gY2xlYXIgYWxsIGd1aVxuXG4gICAgY2xlYXI6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaSA9IHRoaXMudWlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKSB0aGlzLnVpc1tpXS5jbGVhcigpO1xuXG4gICAgICAgIHRoaXMudWlzID0gW107XG4gICAgICAgIFRvb2xzLmxpc3RlbnMgPSBbXTtcblxuICAgICAgICB0aGlzLmNhbGMoIC0gdGhpcy5oICk7XG5cbiAgICB9LFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIFNjcm9sbFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoIHkgKXtcblxuICAgICAgICB5ID0geSA8IDAgPyAwIDp5O1xuICAgICAgICB5ID0geSA+IHRoaXMucmFuZ2UgPyB0aGlzLnJhbmdlIDogeTtcblxuICAgICAgICB0aGlzLmlubmVyLnN0eWxlLnRvcCA9IC0gTWF0aC5mbG9vciggeSAvIHRoaXMucmF0aW8gKSArICdweCc7XG4gICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLnRvcCA9IE1hdGguZmxvb3IoIHkgKSArICdweCc7XG5cbiAgICAgICAgdGhpcy5weSA9IHk7XG5cbiAgICAgICAgLy90aGlzLm9uV2hlZWwgPSBmYWxzZTtcblxuICAgIH0sXG5cbiAgICBzaG93U2Nyb2xsOmZ1bmN0aW9uKGgpe1xuXG4gICAgICAgIHRoaXMuaXNTY3JvbGwgPSB0cnVlO1xuICAgICAgICB0aGlzLnN3ID0gdGhpcy5zaXplLnM7XG5cbiAgICAgICAgdGhpcy50b3RhbCA9IHRoaXMuaDtcbiAgICAgICAgdGhpcy5tYXhWaWV3ID0gdGhpcy5tYXhIZWlnaHQ7Ly8gLSB0aGlzLmhlaWdodDtcblxuICAgICAgICB0aGlzLnJhdGlvID0gdGhpcy5tYXhWaWV3IC8gdGhpcy50b3RhbDtcbiAgICAgICAgdGhpcy5zaCA9IHRoaXMubWF4VmlldyAqIHRoaXMucmF0aW87XG5cbiAgICAgICAgaWYoIHRoaXMuc2ggPCAyMCApIHRoaXMuc2ggPSAyMDtcblxuICAgICAgICB0aGlzLnJhbmdlID0gdGhpcy5tYXhWaWV3IC0gdGhpcy5zaDtcblxuICAgICAgICB0aGlzLnNjcm9sbEJHLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB0aGlzLnNjcm9sbEJHLnN0eWxlLmhlaWdodCA9IHRoaXMubWF4VmlldyArICdweCc7XG4gICAgICAgIHRoaXMuc2Nyb2xsLnN0eWxlLmhlaWdodCA9IHRoaXMuc2ggKyAncHgnO1xuXG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuc2V0SXRlbVdpZHRoKCB0aGlzLndpZHRoIC0gdGhpcy5zdyApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCAwICk7XG5cbiAgICB9LFxuXG4gICAgaGlkZVNjcm9sbDpmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuaXNTY3JvbGwgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zdyA9IDA7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuc2V0SXRlbVdpZHRoKCB0aGlzLndpZHRoIC0gdGhpcy5zdyApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlKCAwICk7XG5cbiAgICAgICAgdGhpcy5zY3JvbGxCRy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgfSxcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICByZXNpemU6ZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgdGhpcy50ZXN0SGVpZ2h0KCk7XG5cbiAgICB9LFxuXG4gICAgY2FsYzpmdW5jdGlvbiggeSApIHtcblxuICAgICAgICB0aGlzLmggKz0geTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KCB0aGlzLnRtcCApO1xuICAgICAgICB0aGlzLnRtcCA9IHNldFRpbWVvdXQoIHRoaXMudGVzdEhlaWdodC5iaW5kKHRoaXMpLCAxMCApO1xuXG4gICAgfSxcblxuICAgIHRlc3RIZWlnaHQ6ZnVuY3Rpb24oKXtcblxuICAgICAgICBpZiggdGhpcy50bXAgKSBjbGVhclRpbWVvdXQoIHRoaXMudG1wICk7XG5cbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLnRvcCArIHRoaXMuYmg7XG5cbiAgICAgICAgaWYoIHRoaXMuaXNPcGVuICl7XG5cbiAgICAgICAgICAgIHRoaXMubWF4SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy50b3AgLSB0aGlzLmJoO1xuXG4gICAgICAgICAgICBpZiggdGhpcy5oID4gdGhpcy5tYXhIZWlnaHQgKXtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5tYXhIZWlnaHQgKyB0aGlzLmJoO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1Njcm9sbCgpO1xuXG4gICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5oICsgdGhpcy5iaDtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVTY3JvbGwoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5iaDtcbiAgICAgICAgICAgIHRoaXMuaGlkZVNjcm9sbCgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlubmVyQ29udGVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmhlaWdodCAtIHRoaXMuYmggKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnO1xuICAgICAgICB0aGlzLmJvdHRvbS5zdHlsZS50b3AgPSB0aGlzLmhlaWdodCAtIHRoaXMuYmggKyAncHgnO1xuXG4gICAgfSxcblxuICAgIHNldFdpZHRoOiBmdW5jdGlvbiggdyApIHtcblxuICAgICAgICBpZiggdyApIHRoaXMud2lkdGggPSB3O1xuICAgICAgICB0aGlzLmNvbnRlbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMud2lkdGgpXG5cblxuICAgICAgICBpZiggdGhpcy5pc0NlbnRlciApIHRoaXMuY29udGVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gLSh+fiAodGhpcy53aWR0aCowLjUpKSArICdweCc7XG5cbiAgICAgICAgdGhpcy5zZXRJdGVtV2lkdGgoIHRoaXMud2lkdGggLSB0aGlzLnN3ICk7XG5cbiAgICAgICAgLyp2YXIgbCA9IHRoaXMudWlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGkgPSBsO1xuICAgICAgICB3aGlsZShpLS0pe1xuICAgICAgICAgICAgdGhpcy51aXNbaV0uc2V0U2l6ZSggdGhpcy53aWR0aCApO1xuICAgICAgICB9XG5cbiAgICAgICAgaSA9IGw7XG4gICAgICAgIHdoaWxlKGktLSl7XG4gICAgICAgICAgICB0aGlzLnVpc1tpXS5yU2l6ZSgpO1xuICAgICAgICB9Ki9cblxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuXG4gICAgfSxcblxuICAgIHNldEl0ZW1XaWR0aDogZnVuY3Rpb24oIHcgKXtcblxuICAgICAgICB2YXIgaSA9IHRoaXMudWlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUoaS0tKXtcbiAgICAgICAgICAgIHRoaXMudWlzW2ldLnNldFNpemUoIHcgKTtcbiAgICAgICAgICAgIHRoaXMudWlzW2ldLnJTaXplKCk7XG4gICAgICAgIH1cblxuICAgIH0sXG5cblxufTtcblxuZXhwb3J0IHsgVG9vbHMsIEd1aSwgUHJvdG8sIEJvb2wsIEJ1dHRvbiwgQ2lyY3VsYXIsIENvbG9yLCBGcHMsIEdyb3VwLCBKb3lzdGljaywgS25vYiwgTGlzdCwgTnVtZXJpYywgU2xpZGUsIFRleHRJbnB1dCwgVGl0bGUsIGFkZCwgUkVWSVNJT04gfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC9Vc2Vycy9uLnZpbmF5YWthbi93b3Jrc3BhY2UvdWlsL2J1aWxkL3VpbC5tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IERlbW8gfSBmcm9tICcuL2RlbW8nO1xuZXhwb3J0IGNsYXNzIFRlYXBvdERlbW8gZXh0ZW5kcyBEZW1vIHtcbiAgICBzdGF0aWMgTkFNRTpzdHJpbmcgPSBcIlRlYXBvdFwiO1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9kZW1vcy90ZWFwb3QudHMiXSwic291cmNlUm9vdCI6IiJ9