(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],2:[function(require,module,exports){
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
},{"_process":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function (process,global){
(function(c){function l(a){return a?"object"==typeof a||"function"==typeof a:!1}if(!c.Proxy){var m=null;c.a=function(a,b){function c(){}if(!l(a)||!l(b))throw new TypeError("Cannot create proxy with a non-object as target or handler");m=function(){c=function(a){throw new TypeError("Cannot perform '"+a+"' on a proxy that has been revoked");}};var e=b;b={get:null,set:null,apply:null,construct:null};for(var h in e){if(!(h in b))throw new TypeError("Proxy polyfill does not support trap '"+h+"'");b[h]=
e[h]}"function"==typeof e&&(b.apply=e.apply.bind(e));var d=this,n=!1,p="function"==typeof a;if(b.apply||b.construct||p)d=function(){var g=this&&this.constructor===d,f=Array.prototype.slice.call(arguments);c(g?"construct":"apply");if(g&&b.construct)return b.construct.call(this,a,f);if(!g&&b.apply)return b.apply(a,this,f);if(p)return g?(f.unshift(a),new (a.bind.apply(a,f))):a.apply(this,f);throw new TypeError(g?"not a constructor":"not a function");},n=!0;var q=b.get?function(a){c("get");return b.get(this,
a,d)}:function(a){c("get");return this[a]},t=b.set?function(a,f){c("set");b.set(this,a,f,d)}:function(a,b){c("set");this[a]=b},r={};Object.getOwnPropertyNames(a).forEach(function(b){n&&b in d||(Object.defineProperty(d,b,{enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:q.bind(a,b),set:t.bind(a,b)}),r[b]=!0)});e=!0;Object.setPrototypeOf?Object.setPrototypeOf(d,Object.getPrototypeOf(a)):d.__proto__?d.__proto__=a.__proto__:e=!1;if(b.get||!e)for(var k in a)r[k]||Object.defineProperty(d,
k,{get:q.bind(a,k)});Object.seal(a);Object.seal(d);return d};c.a.b=function(a,b){return{proxy:new c.a(a,b),revoke:m}};c.a.revocable=c.a.b;c.Proxy=c.a}})("undefined"!==typeof process&&"[object process]"=={}.toString.call(process)?global:self);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":3}],5:[function(require,module,exports){
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
},{"performance-now":2}],6:[function(require,module,exports){
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

},{"./is":8,"./vnode":15}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
    "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
    "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
    "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
    "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
    "truespeed", "typemustmatch", "visible"];
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58;
var xChar = 120;
var booleanAttrsDict = Object.create(null);
for (var i = 0, len = booleanAttrs.length; i < len; i++) {
    booleanAttrsDict[booleanAttrs[i]] = true;
}
function updateAttrs(oldVnode, vnode) {
    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
    if (!oldAttrs && !attrs)
        return;
    if (oldAttrs === attrs)
        return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    // update modified attributes, add new attributes
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (booleanAttrsDict[key]) {
                if (cur) {
                    elm.setAttribute(key, "");
                }
                else {
                    elm.removeAttribute(key);
                }
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    // remove removed attributes
    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
    // the other option is to remove all attributes with value == undefined
    for (key in oldAttrs) {
        if (!(key in attrs)) {
            elm.removeAttribute(key);
        }
    }
}
exports.attributesModule = { create: updateAttrs, update: updateAttrs };
exports.default = exports.attributesModule;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./h":6,"./htmldomapi":7,"./is":8,"./thunk":14,"./vnode":15}],14:[function(require,module,exports){
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

},{"./h":6}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;

},{}],16:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/************
 * Compiler *
 ************/
var _private = require('./private');

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

        var _this = _private(this);

        _this.text = text;
        _this.state = STATE_HTML;
        _this.index = 0;
        _this.codeArray = ["var " + VAR_NAME + "='"];
        _this.code = ";" + VAR_NAME + "+='";

        while (_this.index < _this.text.length) {
            transfer(_this);
        }

        _this.codeArray.push("';return " + VAR_NAME + ";");
    }

    Compiler.prototype.getCode = function getCode() {
        return _private(this).codeArray.join('');
    };

    return Compiler;
}();

/**
 * @private
 *
 * @param _this
 * @param offset
 *
 * @returns {*}
 */


function getChar(_this) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    return _this.text.at(_this.index + offset);
}

/**
 * @private
 *
 * @param _this
 * @param code
 */
function transfer(_this) {
    var char = getChar(_this);

    var state = _this.state,
        appendCode = char,
        step = 1;

    switch (state) {
        case STATE_HTML:
            if (equal(CHAR_LT, char) && equal('%', getChar(_this, 1))) {
                state = STATE_CODE;
                appendCode = "';";
                step++;
            } else if ('<' === char && equal('s', toLowerCase(getChar(_this, 1))) && equal('c', toLowerCase(getChar(_this, 2))) && equal('r', toLowerCase(getChar(_this, 3))) && equal('i', toLowerCase(getChar(_this, 4))) && equal('p', toLowerCase(getChar(_this, 5))) && equal('t', toLowerCase(getChar(_this, 6))) && /[>\s]/.test(getChar(_this, 7))) {
                state = STATE_SCRIPT_TAG;
                appendCode = "<script";
                step += 6;
            } else if (equal('$', char) && equal('{', getChar(_this, 1))) {
                state = STATE_OUTPUT;
                appendCode = "'+(";
                step++;
            } else if (equal("\r", char)) {
                appendCode = "\\r";
            } else if (equal("\n", char)) {
                appendCode = "\\n";
            }
            break;

        case STATE_CODE:
            if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_CODE_SINGLE_QUTO;
            } else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_CODE_DOUBLE_QUTO;
            } else if (equal('%', char) && equal(CHAR_GT, getChar(_this, 1))) {
                state = STATE_HTML;
                step++;
                appendCode = _this.code;
            }
            break;

        // 代码中的单引号
        case STATE_CODE_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_CODE;
            }
            break;

        // 代码中的双引号
        case STATE_CODE_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_CODE;
            }
            break;

        case STATE_OUTPUT:
            if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_OUTPUT_SINGLE_QUTO;
            } else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_OUTPUT_DOUBLE_QUTO;
            } else if (equal('}', char)) {
                state = STATE_HTML;
                appendCode = ")+'";
            }
            break;

        // 代码中的单引号
        case STATE_OUTPUT_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_OUTPUT;
            }
            break;

        // 代码中的双引号
        case STATE_OUTPUT_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_OUTPUT;
            }
            break;

        // Script 代码
        case STATE_SCRIPT_TAG:
            if (CHAR_SINGLE_QUTO === char) {
                state = STATE_SCRIPT_SINGLE_QUTO;
            } else if (CHAR_DOUBLE_QUTO === char) {
                state = STATE_SCRIPT_DOUBLE_QUTO;
            } else if (CHAR_GT === char) {
                state = STATE_SCRIPT_CODE;
            }
            break;

        case STATE_SCRIPT_CODE:
            if (equal('<', char) && equal('/', getChar(_this, 1)) && equal('s', toLowerCase(getChar(_this, 2))) && equal('c', toLowerCase(getChar(_this, 3))) && equal('r', toLowerCase(getChar(_this, 4))) && equal('i', toLowerCase(getChar(_this, 5))) && equal('p', toLowerCase(getChar(_this, 6))) && equal('t', toLowerCase(getChar(_this, 7))) && equal('>', getChar(_this, 8))) {
                state = STATE_HTML;
                appendCode = '</script>';
                step += 8;
            }
            break;

        case STATE_SCRIPT_SINGLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_SINGLE_QUTO, char)) {
                state = STATE_SCRIPT_CODE;
            }
            break;

        case STATE_SCRIPT_DOUBLE_QUTO:
            if (equal(CHAR_ESCAPE, char)) {
                appendCode += getChar(_this, 1);
                step++;
            } else if (equal(CHAR_DOUBLE_QUTO, char)) {
                state = STATE_SCRIPT_CODE;
            }
            break;
    }

    _this.state = state;
    _this.index += step;
    _this.codeArray.push(appendCode);
}

module.exports = Compiler;

function toLowerCase(string) {
    return string.toLowerCase();
}

function equal(left, right) {
    return left === right;
}

},{"./private":21}],17:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var patch = require('snabbdom').init([require('snabbdom/modules/class').default, require('snabbdom/modules/props').default, require('snabbdom/modules/attributes').default, require('snabbdom/modules/eventlisteners').default]);

var EventEmitter = require('eventemitter3');

require('./polyfill');

var Template = require('./template');
var Observer = require('./observer');
var parser = require('./parser');
var _private = require('./private');

var HIDDEN = ['hidden', 'mozHidden', 'webkitHidden'];

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    for (var i = 0; i < HIDDEN.length; i++) {
        if (HIDDEN[i] in document) {
            return document[HIDDEN[i]];
        }
    }
    return false;
}

var EVENT_VISIBILITY_CHANGE = 'visibilitychange';

var WebScript = function () {
    function WebScript() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, WebScript);

        var $this = this;
        var _this = _private(this);

        var element = void 0;
        if ('root' in options) {
            element = options.root;
        } else {
            element = document.body.children[0];
        }

        _this.classes = options.classes || {};
        _this.style = options.style || {};
        _this.attrs = options.attrs || {};
        _this.props = options.props || {};
        _this.on = options.on || {};

        _this.isOnVisibilityChange = false;

        _this.template = new Template(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));
        var observer = _this.observer = new Observer(options.data || {});

        observer.attach(function () {
            // 如果页面被隐藏了，则减少重绘
            if (documentHidden()) {
                if (!_this.isOnVisibilityChange) {
                    document.addEventListener(EVENT_VISIBILITY_CHANGE, function handler() {
                        document.removeEventListener(EVENT_VISIBILITY_CHANGE, handler);
                        _this.isOnVisibilityChange = false;
                        $this.render();
                    });

                    _this.isOnVisibilityChange = true;
                }
            } else {
                $this.render();
            }
        });

        $this.render();

        _this.emitter = new EventEmitter();

        $this.element = element;
        $this.data = observer.target;
    }

    WebScript.prototype.render = function render() {
        var $this = this;
        var _this = _private($this);

        if (_this.frame) {
            return;
        }

        _this.frame = requestAnimationFrame(function () {
            var data = _this.observer.target;

            var html = _this.template.render(data);

            var vnodeTemp = parser.call($this, html);

            patch(_this.vnode || $this.element, vnodeTemp);

            _this.vnode = vnodeTemp;

            vnodeTemp = null;

            _this.frame = null;
        });
    };

    WebScript.prototype.on = function on(event, listener) {
        _private(this).emitter.addListener(event, listener);
        return this;
    };

    WebScript.prototype.off = function off(event, listener) {
        _private(this).emitter.removeListener(event, listener);
    };

    return WebScript;
}();

window.WebScript = WebScript;

},{"./observer":18,"./parser":19,"./polyfill":20,"./private":21,"./template":22,"eventemitter3":1,"snabbdom":13,"snabbdom/modules/attributes":9,"snabbdom/modules/class":10,"snabbdom/modules/eventlisteners":11,"snabbdom/modules/props":12}],18:[function(require,module,exports){
(function (global){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('eventemitter3');

var METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];
var EVENT_DATA_CHANGE = 'datachange';

var isSupportProxy = !!(global || self).Proxy;

if (!isSupportProxy) {
    require('proxy-polyfill/proxy.min');
}

var utils = require('./utils');

var _private = require('./private');

var Observer = function () {
    function Observer(data) {
        _classCallCheck(this, Observer);

        var $this = this;
        var _this = _private($this);

        _this.emitter = new EventEmitter();

        // Handler
        var handler = {
            set: function set(target, property, value) {
                target[property] = value;
                notify.call(_this);
                return true;
            }
        };

        if (isSupportProxy) {
            handler['deleteProperty'] = function (target, property) {
                delete target[property];
                notify.call(_this);
                return true;
            };
        }

        this.target = proxy(data, handler);
    }

    Observer.prototype.attach = function attach(handler) {
        _private(this).emitter.on(EVENT_DATA_CHANGE, handler);
    };

    Observer.prototype.detach = function detach(handler) {
        _private(this).emitter.removeListener(EVENT_DATA_CHANGE, handler);
    };

    return Observer;
}();

/**
 * @private
 *
 * @param target
 * @param property
 * @param value
 */


function notify(target, property, value) {
    var _this = this;
    if (!_this.timer) {
        _this.timer = setTimeout(function () {
            _this.timer = null;
            _this.emitter.emit(EVENT_DATA_CHANGE, target, property, value);
        }, 0);
    }
}

module.exports = Observer;

/**
 *
 * @param target
 * @param handler
 * @returns {*}
 */
function proxy(target, handler) {
    if (utils.isArray(target)) {
        target = proxyArray(target, handler);
    } else if (utils.isObject(target)) {
        target = proxyObject(target, handler);
    }

    return target;
}

/**
 * @param obj
 * @param handler
 * @returns {Proxy}
 */
function proxyObject(obj, handler) {
    for (var prop in obj) {
        obj[prop] = proxy(obj[prop], handler);
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
    array.forEach(function (value, index) {
        if (utils.isObject(value)) {
            array[index] = new Proxy(value, handler);
        }
    });
    if (isSupportProxy) {
        array.forEach(function (value, index) {
            if (utils.isObject(value)) {
                array[index] = new Proxy(value, handler);
            }
        });
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
        return array;
    }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./private":21,"./utils":23,"eventemitter3":1,"proxy-polyfill/proxy.min":4}],19:[function(require,module,exports){
'use strict';

var h = require('snabbdom/h').default;

var _ = require('./utils');
var _private = require('./private');

var domParser = new DOMParser();

function parseFromString(string) {
    var doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM(dom) {
    var $this = this;

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

    var i = void 0,
        length = void 0;

    for (i = 0, length = attributes.length; i < length; i++) {
        (function (name, value) {
            var eventMatch = /^on-([a-z].*)/i.exec(name);
            var bindMatch = /^::(.*)/.exec(value);
            // Var Bind
            if (name == "name" && bindMatch && (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")) {
                value = bindMatch[1];
                if (dom.type == 'radio') {
                    hData.attrs.name = value;
                    hData.props.checked = dom.value == _.getObject($this.data, value);
                    hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.value);
                    };
                } else if (dom.type == 'checkbox') {
                    hData.props.checked = _.getObject($this.data, value);
                    hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.checked);
                    };
                } else {
                    hData.props.value = _.getObject($this.data, value);
                    hData.on.input = hData.on.change = function (event) {
                        _.setObject($this.data, value, event.target.value);
                    };
                }
            } else if (eventMatch) {
                hData.on[eventMatch[1]] = _.getObject($this.data, value, function () {}).bind($this);
            } else if (name != 'id' && name != 'class') {
                hData.attrs[_.toCamelCase(name)] = value;
            }
        })(attributes[i].name, attributes[i].value);
    }

    for (i = 0, length = dom.childNodes.length; i < length; i++) {
        var child = dom.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            children.push(child.textContent);
        } else {
            children.push(parseDOM.call(this, child));
        }
    }

    return h(selector, hData, children);
}

module.exports = function (html) {
    var dom = parseFromString(html);
    console.log(this);

    /* Class */
    parseSelector.apply(this, [dom, _private(this).classes, function (element, name, value) {
        if (value) {
            element.classList.add(name);
        }
    }]);

    /* Style */
    parseSelector.apply(this, [dom, _private(this).style, function (element, name, value) {
        element.style[name] = value;
    }]);

    /* Attr */
    parseSelector.apply(this, [dom, _private(this).attrs, function (element, name, value) {
        if (value || !/^hidden|disabled$/i.test(name)) {
            element.setAttribute(name, value);
        }
    }]);

    /* Prop */
    parseSelector.apply(this, [dom, _private(this).props, function (element, name, value) {
        element[name] = value;
    }]);

    return parseDOM.call(this, dom);
};

function parseSelector(dom, selectores, handler) {
    var _this = this;

    for (var selector in selectores) {
        var elementList = dom.querySelectorAll(selector);

        if (elementList.length > 0) {
            var _loop = function _loop(name) {
                var value = selectores[selector][name];

                if (_.isFunction(value)) {
                    value = value.call(_this);
                }

                _.each(elementList, function (element) {
                    handler.apply(this, [element, name, value]);
                });
            };

            for (var name in selectores[selector]) {
                _loop(name);
            }
        }
    }
}

},{"./private":21,"./utils":23,"snabbdom/h":6}],20:[function(require,module,exports){
(function (global){
"use strict";

require('raf').polyfill(); // requestAnimationFrame

/*
 * DOMParser HTML extension
 * 2012-09-04
 *
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function (DOMParser) {
    var proto = DOMParser.prototype,
        nativeParse = proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if (new DOMParser().parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (e) {}

    proto.parseFromString = function (markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument("");
            if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                doc.documentElement.innerHTML = markup;
            } else {
                doc.body.innerHTML = markup;
            }
            return doc;
        } else {
            return nativeParse.apply(this, arguments);
        }
    };
})(DOMParser);

var self = global || window;

/**
 * String.prototype.at Polyfill
 */
if (!String.prototype.at) {
    String.prototype.at = String.prototype.charAt;
}

/**
 * Array.isArray Polyfill
 */
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

/**
 * Object.values Polyfill
 */
if (!Object.values) {
    Object.values = function (arg) {
        var vals = [];
        for (var key in arg) {
            vals.push(arg[key]);
        }
        return vals;
    };
}

/**
 * Object.setPrototypeOf Polyfill
 */
if (!Object.setPrototypeOf) {
    Object.setPrototypeOf = function (obj, proto) {
        obj.__proto__ = proto;
        return obj;
    };
}

/**
 * WeakMap Polyfill
 */
if (!self.WeakMap) {
    (function () {
        var publicMaps = [];
        var privateMaps = [];

        function getPrivateMap(thisArg) {
            return privateMaps[publicMaps.indexOf(thisArg)];
        }

        function WeakMap() {
            publicMaps.unshift(this);
            privateMaps.unshift({
                keys: [],
                vals: []
            });
        }

        WeakMap.prototype.has = function (key) {
            return getPrivateMap(this).keys.indexOf(key) >= 0;
        };

        WeakMap.prototype.get = function (key) {
            var map = getPrivateMap(this);
            var index = map.keys.indexOf(key);
            return index >= 0 ? map.vals[index] : undefined;
        };

        WeakMap.prototype.set = function (key, value) {
            var map = getPrivateMap(this);
            var index = map.keys.indexOf(key);
            if (index >= 0) {
                map.vals[index] = value;
            } else {
                map.keys.unshift(key);
                map.vals.unshift(value);
            }
            return this;
        };

        self.WeakMap = WeakMap;
    })();
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"raf":5}],21:[function(require,module,exports){
"use strict";

/**********************
 * Class Private This *
 **********************/

var thisMap = new WeakMap();

/**
 * @param thisArg
 * @returns {}
 */
function _private(thisArg) {
    if (thisMap.has(thisArg)) {
        return thisMap.get(thisArg);
    } else {
        var privateThis = {};
        thisMap.set(thisArg, privateThis);
        return privateThis;
    }
}

module.exports = _private;

},{}],22:[function(require,module,exports){
'use strict';

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

    Template.prototype.render = function render(data) {
        var fn = function fn() {
            return '';
        };
        var code = 'fn=function(' + Object.keys(data).join(',') + '){' + this.code + '}';
        eval(code);
        return fn.apply(this, Object.values(data));
    };

    return Template;
}();

module.exports = Template;

},{"./compiler":16}],23:[function(require,module,exports){
'use strict';

function isType(value, type) {
    return Object.prototype.toString.call(value) === '[object ' + type + ']';
}

function isString(string) {
    return isType(string, 'String');
}

function isArray(array) {
    return Array.isArray(array);
}

function isObject(object) {
    return isType(object, 'Object');
}

function isFunction(fn) {
    return isType(fn, 'Function');
}

function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
}

function parseProp(prop) {
    var propList = [];

    var match = void 0,
        pattern = /\[['"](.+?)['"]\]|\.(.+?)|^([^.[]+)/g;

    while (match = pattern.exec(prop)) {
        propList.push(match[1] || match[2] || match[3]);
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

function toCamelCase(name) {
    return name.replace(/-([a-z])/ig, function ($0, $1) {
        return $1.toUpperCase();
    });
}

module.exports = {
    isString: isString,
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    each: each,
    getObject: getObject,
    setObject: setObject,
    toCamelCase: toCamelCase
};

},{}]},{},[17]);
