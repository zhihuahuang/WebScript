(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../../modules/es7.string.at');
module.exports = require('../../modules/_core').String.at;

},{"../../modules/_core":4,"../../modules/es7.string.at":23}],2:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],3:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":15}],4:[function(require,module,exports){
var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],5:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":2}],6:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],7:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":10}],8:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":11,"./_is-object":15}],9:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
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

},{"./_core":4,"./_ctx":5,"./_global":11,"./_hide":13,"./_redefine":18}],10:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],11:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],12:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],13:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":7,"./_object-dp":16,"./_property-desc":17}],14:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":7,"./_dom-create":8,"./_fails":10}],15:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],16:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":3,"./_descriptors":7,"./_ie8-dom-define":14,"./_to-primitive":21}],17:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],18:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":4,"./_global":11,"./_has":12,"./_hide":13,"./_uid":22}],19:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":6,"./_to-integer":20}],20:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],21:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":15}],22:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],23:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./_export');
var $at = require('./_string-at')(true);

$export($export.P, 'String', {
  at: function at(pos) {
    return $at(this, pos);
  }
});

},{"./_export":9,"./_string-at":19}],24:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this,require('_process'))
},{"_process":25}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
(function (process,global){
(function(c){function l(a){return a?"object"==typeof a||"function"==typeof a:!1}if(!c.Proxy){var m=null;c.a=function(a,b){function c(){}if(!l(a)||!l(b))throw new TypeError("Cannot create proxy with a non-object as target or handler");m=function(){c=function(a){throw new TypeError("Cannot perform '"+a+"' on a proxy that has been revoked");}};var e=b;b={get:null,set:null,apply:null,construct:null};for(var h in e){if(!(h in b))throw new TypeError("Proxy polyfill does not support trap '"+h+"'");b[h]=
e[h]}"function"==typeof e&&(b.apply=e.apply.bind(e));var d=this,n=!1,p="function"==typeof a;if(b.apply||b.construct||p)d=function(){var g=this&&this.constructor===d,f=Array.prototype.slice.call(arguments);c(g?"construct":"apply");if(g&&b.construct)return b.construct.call(this,a,f);if(!g&&b.apply)return b.apply(a,this,f);if(p)return g?(f.unshift(a),new (a.bind.apply(a,f))):a.apply(this,f);throw new TypeError(g?"not a constructor":"not a function");},n=!0;var q=b.get?function(a){c("get");return b.get(this,
a,d)}:function(a){c("get");return this[a]},t=b.set?function(a,f){c("set");b.set(this,a,f,d)}:function(a,b){c("set");this[a]=b},r={};Object.getOwnPropertyNames(a).forEach(function(b){n&&b in d||(Object.defineProperty(d,b,{enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:q.bind(a,b),set:t.bind(a,b)}),r[b]=!0)});e=!0;Object.setPrototypeOf?Object.setPrototypeOf(d,Object.getPrototypeOf(a)):d.__proto__?d.__proto__=a.__proto__:e=!1;if(b.get||!e)for(var k in a)r[k]||Object.defineProperty(d,
k,{get:q.bind(a,k)});Object.seal(a);Object.seal(d);return d};c.a.b=function(a,b){return{proxy:new c.a(a,b),revoke:m}};c.a.revocable=c.a.b;c.Proxy=c.a}})("undefined"!==typeof process&&"[object process]"=={}.toString.call(process)?global:self);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":25}],27:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":24}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = require("./is");
function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        }
        else if (is.primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        }
        else if (is.primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode_1.vnode(sel, data, children, text, undefined);
}
exports.h = h;
;
exports.default = h;

},{"./is":30,"./vnode":36}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
exports.htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
};
exports.default = exports.htmlDomApi;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
exports.classModule = { create: updateClass, update: updateClass };
exports.default = exports.classModule;

},{}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
exports.eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
exports.default = exports.eventListenersModule;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
exports.default = exports.propsModule;

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var is = require("./is");
var htmldomapi_1 = require("./htmldomapi");
function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
var h_1 = require("./h");
exports.h = h_1.h;
var thunk_1 = require("./thunk");
exports.thunk = thunk_1.thunk;
function init(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = api.createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}
exports.init = init;

},{"./h":28,"./htmldomapi":29,"./is":30,"./thunk":35,"./vnode":36}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = require("./h");
function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i, old = oldVnode.data, cur = thunk.data;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
};
exports.default = exports.thunk;

},{"./h":28}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;

},{}],37:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/************
 * Compiler *
 ************/

require('core-js/fn/string/at');

var CHAR_LT = "<";
var CHAR_GT = ">";
var CHAR_SINGLE_QUTO = "'";
var CHAR_DOUBLE_QUTO = '"';
var CHAR_ESCAPE = "\\";

var STATE_HTML = 0;

var STATE_CODE = 1;
var STATE_CODE_SINGLE_QUTO = 2;
var STATE_CODE_DOUBLE_QUTO = 3;

var STATE_OUTPUT = 4;
var STATE_OUTPUT_SINGLE_QUTO = 5;
var STATE_OUTPUT_DOUBLE_QUTO = 6;

var STATE_SCRIPT_TAG = 7;
var STATE_SCRIPT_SINGLE_QUTO = 8;
var STATE_SCRIPT_DOUBLE_QUTO = 9;
var STATE_SCRIPT_CODE = 10;

var Compiler = function () {
    function Compiler(text) {
        _classCallCheck(this, Compiler);

        var VAR_NAME = "_html_" + Date.now();

        var self = this;

        self.text = text;
        self.state = STATE_HTML;
        self.index = 0;
        self.codeArray = ["var " + VAR_NAME + "='"];

        while (self.index < self.text.length) {
            self.transfer(";" + VAR_NAME + "+='");
        }

        self.append("';return " + VAR_NAME + ";");
    }

    _createClass(Compiler, [{
        key: "getChar",
        value: function getChar() {
            var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            return this.text.at(this.index + offset);
        }
    }, {
        key: "getCode",
        value: function getCode() {
            return this.codeArray.join('');
        }
    }, {
        key: "append",
        value: function append(code) {
            this.codeArray.push(code);
        }
    }, {
        key: "transfer",
        value: function transfer(code) {
            var self = this;
            var char = self.getChar();

            switch (self.state) {
                case STATE_HTML:
                    if (CHAR_LT === char && '%' === self.getChar(1)) {
                        self.state = STATE_CODE;
                        self.append("';");
                        self.index++;
                    } else if ('<' === char && 's' === toLowerCase(self.getChar(1)) && 'c' === toLowerCase(self.getChar(2)) && 'r' === toLowerCase(self.getChar(3)) && 'i' === toLowerCase(self.getChar(4)) && 'p' === toLowerCase(self.getChar(5)) && 't' === toLowerCase(self.getChar(6)) && /[>\s]/.test(self.getChar(7))) {
                        self.state = STATE_SCRIPT_TAG;
                        self.append("<script");
                        self.index += 6;
                    } else if ('$' === char && '{' === self.getChar(1)) {
                        self.state = STATE_OUTPUT;
                        self.append("'+(");
                        self.index++;
                    } else if ("\r" === char) {
                        self.append("\\r");
                    } else if ("\n" === char) {
                        self.append("\\n");
                    } else {
                        self.append(char);
                    }
                    break;

                case STATE_CODE:
                    if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_CODE_SINGLE_QUTO;
                        self.append(char);
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_CODE_DOUBLE_QUTO;
                        self.append(char);
                    } else if ('%' === char && CHAR_GT === self.getChar(1)) {
                        self.state = STATE_HTML;
                        self.append(code);
                        self.index++;
                    } else {
                        self.append(char);
                    }
                    break;

                // 代码中的单引号
                case STATE_CODE_SINGLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + self.getChar(1));
                        self.index++;
                    } else if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_CODE;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                // 代码中的双引号
                case STATE_CODE_DOUBLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + self.getChar(1));
                        self.index++;
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_CODE;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                case STATE_OUTPUT:
                    if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_OUTPUT_SINGLE_QUTO;
                        self.append(char);
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_OUTPUT_DOUBLE_QUTO;
                        self.append(char);
                    } else if ('}' === char) {
                        self.state = STATE_HTML;
                        self.append(")+'");
                    } else {
                        self.append(char);
                    }
                    break;

                // 代码中的单引号
                case STATE_OUTPUT_SINGLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + charAt(self.text, ++self.index));
                    } else if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_OUTPUT;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                // 代码中的双引号
                case STATE_OUTPUT_DOUBLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + self.getChar(1));
                        self.index++;
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_OUTPUT;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                // Script 代码
                case STATE_SCRIPT_TAG:
                    if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_SCRIPT_SINGLE_QUTO;
                        self.append(char);
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_SCRIPT_DOUBLE_QUTO;
                        self.append(char);
                    } else if (CHAR_GT === char) {
                        self.state = STATE_SCRIPT_CODE;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                case STATE_SCRIPT_CODE:
                    if ('<' === char && '/' === self.getChar(1) && 's' === toLowerCase(self.getChar(2)) && 'c' === toLowerCase(self.getChar(3)) && 'r' === toLowerCase(self.getChar(4)) && 'i' === toLowerCase(self.getChar(5)) && 'p' === toLowerCase(self.getChar(6)) && 't' === toLowerCase(self.getChar(7)) && '>' === self.getChar(8)) {
                        self.state = STATE_HTML;
                        self.append('</script>');
                        self.index += 8;
                    } else {
                        self.append(char);
                    }
                    break;

                case STATE_SCRIPT_SINGLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + self.getChar(1));
                        self.index++;
                    } else if (CHAR_SINGLE_QUTO === char) {
                        self.state = STATE_SCRIPT_CODE;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;

                case STATE_SCRIPT_DOUBLE_QUTO:
                    if (CHAR_ESCAPE === char) {
                        self.append(char + self.getChar(1));
                        self.index++;
                    } else if (CHAR_DOUBLE_QUTO === char) {
                        self.state = STATE_SCRIPT_CODE;
                        self.append(char);
                    } else {
                        self.append(char);
                    }
                    break;
            }

            self.index++;
        }
    }]);

    return Compiler;
}();

module.exports = Compiler;

function toLowerCase(string) {
    return string.toLowerCase();
}

},{"core-js/fn/string/at":1}],38:[function(require,module,exports){
'use strict';

var patch = require('snabbdom').init([// Init patch function with chosen modules
require('snabbdom/modules/class').default, // makes it easy to toggle classes
require('snabbdom/modules/props').default, // for setting properties on DOM elements
//require('snabbdom/modules/style').default, // handles styling on elements with support for animations
require('snabbdom/modules/eventlisteners').default] // attaches event listeners
);
var h = require('snabbdom/h').default; // helper function for creating vnodes

require('raf'); // requestAnimationFrame

var Template = require('./template');
var Observer = require('./observer');
var parser = require('./parser');

/**
 * From Babel
 *
 * @param instance
 * @param Constructor
 * @private
 */
function __classCallCheck(instance, Constructor) {
    // check if we create a new Object
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var HIDDEN = ['hidden', 'mozHidden', 'webkitHidden'];

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = HIDDEN[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var hidden = _step.value;

            if (hidden in document) {
                return document[hidden];
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return false;
}

function addEventListener(element, event, handler) {
    event.trim().split(/\s+/).forEach(function (name) {
        element.addEventListener(name, handler);
    });
}

function removeEventListener(element, event, handler) {
    event.trim().split(/\s+/).forEach(function (name) {
        element.removeEventListener(name, handler);
    });
}

var EVENT_VISIBILITY_CHANGE = 'visibilitychange';

window.WebScript = function (options) {
    __classCallCheck(this, WebScript);

    var element = void 0;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    } else {
        element = document.body.children[0];
    }

    var template = new Template(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));

    var observer = new Observer(options.data || {});

    var vnode = void 0;

    var isOnVisibilityChange = false;
    var frame = null;

    observer.attach(function () {
        // 如果页面被隐藏了，则减少重绘
        if (documentHidden()) {
            if (!isOnVisibilityChange) {
                addEventListener(document, EVENT_VISIBILITY_CHANGE, function fn() {
                    removeEventListener(document, EVENT_VISIBILITY_CHANGE, fn);
                    isOnVisibilityChange = false;
                    redraw();
                });
                isOnVisibilityChange = true;
            }
        } else {
            redraw();
        }
    });

    redraw();

    return {
        data: observer.target,
        on: function on() {}
    };

    function redraw() {
        if (frame) {
            return;
        }

        frame = requestAnimationFrame(function () {
            var data = observer.target;

            var html = template.render(data);

            var vnodeTemp = parser(html, data, h);

            patch(vnode || element, vnodeTemp);

            vnode = vnodeTemp;

            vnodeTemp = null;

            frame = null;
        });
    }
};

},{"./observer":42,"./parser":43,"./template":44,"raf":27,"snabbdom":34,"snabbdom/h":28,"snabbdom/modules/class":31,"snabbdom/modules/eventlisteners":32,"snabbdom/modules/props":33}],39:[function(require,module,exports){
'use strict';

module.exports = function (array) {
    return toString.call(array) === '[object Array]';
};

},{}],40:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    return toString.call(fn) === '[object Function]';
};

},{}],41:[function(require,module,exports){
'use strict';

module.exports = function (obj) {
    return toString.call(obj) === '[object Object]';
};

},{}],42:[function(require,module,exports){
(function (global){
'use strict';

var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');
var isArray = require('./lib/isArray');

var METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];

var isSupportProxy = !!(global || self).Proxy;

if (!isSupportProxy) {
    require('proxy-polyfill/proxy.min');
}

module.exports = function Observer(target) {
    var subscribes = [];

    target = proxyObject(target, {
        set: function set(target, prop, value) {
            target[prop] = value;
            notify(target, prop, value);
            return true;
        }
    });

    return {
        attach: attach,
        detach: detach,
        target: target
    };

    function attach(fn) {
        if (isFunction(fn)) {
            subscribes.push(fn);
        }
    }

    function detach(fn) {
        // TODO
    }

    function notify(event) {
        for (var i = 0; i < subscribes.length; i++) {
            subscribes[i](event);
        }
    }
};

/**
 *
 * @param obj
 * @returns {Proxy}
 */
function proxyObject(obj, handler) {
    for (var prop in obj) {
        if (isArray(obj[prop])) {
            obj[prop] = proxyArray(obj[prop], handler);
        } else if (isObject(obj[prop])) {
            obj[prop] = proxyObject(obj[prop], handler);
        }
    }

    return new Proxy(obj, handler);
}

/**
 *
 * @param array
 * @param handler
 * @returns {*}
 */
function proxyArray(array, handler) {
    if (isSupportProxy) {
        return new Proxy(array, handler);
    } else {
        METHODS.forEach(function (name) {
            var fn = array[name];
            Object.defineProperty(array, name, {
                value: function value() {
                    var returnValue = fn.apply(this, arguments);
                    handler.set(array, 'length', array.length, array);
                    return returnValue;
                }
            });
        });
    }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/isArray":39,"./lib/isFunction":40,"./lib/isObject":41,"proxy-polyfill/proxy.min":26}],43:[function(require,module,exports){
'use strict';

var domParser = new DOMParser();

function parseFromString(string) {
    var doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM(dom, data, h) {
    var tagName = dom.tagName,
        selector = tagName,
        hData = {
        attrs: {},
        props: {},
        on: {}
    },
        children = [];

    if (dom.id) {
        selector += '#' + dom.id;
    }
    if (dom.className) {
        selector += '.' + dom.className.trim().replace(/\s+/, '.');
    }

    // 解析属性
    var attributes = dom.attributes;

    var i, length;

    for (i = 0, length = attributes.length; i < length; i++) {
        (function (name, value) {
            var eventMatch = /^on(.*)/.exec(name);
            var bindMatch = /^:(.*)/.exec(value);
            // Var Bind
            if (name == "name" && bindMatch && (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")) {
                value = bindMatch[1];
                if (dom.type == 'radio') {
                    hData.attrs.name = value;
                    hData.props.checked = dom.value == getObject(data, value);
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    };
                } else if (dom.type == 'checkbox') {
                    hData.props.checked = getObject(data, value);
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.checked);
                    };
                } else {
                    hData.props.value = getObject(data, value);
                    hData.on.input = hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    };
                }
            } else if (bindMatch && eventMatch) {
                hData.on[eventMatch[1]] = getObject(data, bindMatch[1]);
            } else if (name != 'id' && name != 'class') {
                hData.attrs[parseName(name)] = value;
            }
        })(attributes[i].name, attributes[i].value);
    }

    for (i = 0, length = dom.childNodes.length; i < length; i++) {
        var child = dom.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            children.push(child.textContent);
        } else {
            children.push(parseDOM(child, data, h));
        }
    }

    return h(selector, hData, children);
}

function parseName(name) {
    return name.replace(/-([a-z])/ig, function ($0, $1) {
        return $1.toUpperCase();
    });
}

function parseProp(prop) {
    var propList = [];
    if (prop.charAt(0) != '[') {
        propList = prop.split('.');
    } else {
        propList = prop.replace(/^\[[\'\"]?|[\'\"]?$/g, '').split(/[\'\"]?\]\[[\'\"]?/); // ['a'][0]
    }

    return propList;
}

function getObject(object, prop, defaultValue) {
    var propList = parseProp(prop);

    for (var i = 0, length = propList.length; i < length; i++) {
        if (propList[i] in object) {
            object = object[propList[i]];
        } else {
            return defaultValue;
        }
    }
    return object;
}

function setObject(object, prop, value) {
    var propList = parseProp(prop);

    for (var i = 0, length = propList.length; i < length; i++) {
        if (i == length - 1) {
            object[propList[i]] = value;
        } else {
            object = object[propList[i]];
        }
    }
}

module.exports = function (html, data, h) {
    var dom = parseFromString(html);
    return parseDOM(dom, data, h);
};

},{}],44:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/************
 * Template *
 ************/

var Compiler = require('./compiler');

var Template = function () {
    function Template(text) {
        _classCallCheck(this, Template);

        var compiler = new Compiler(text);
        this.code = compiler.getCode();
    }

    _createClass(Template, [{
        key: 'render',
        value: function render(data) {
            var fn = function fn() {
                return '';
            };
            var code = 'fn=function(' + Object.keys(data).join(',') + '){' + this.code + '}';
            eval(code);
            return fn.apply(this, Object.values(data));
        }
    }]);

    return Template;
}();

module.exports = Template;

},{"./compiler":37}]},{},[38]);
