(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function (process,global){
(function(c){function l(a){return a?"object"==typeof a||"function"==typeof a:!1}if(!c.Proxy){var m=null;c.a=function(a,b){function c(){}if(!l(a)||!l(b))throw new TypeError("Cannot create proxy with a non-object as target or handler");m=function(){c=function(a){throw new TypeError("Cannot perform '"+a+"' on a proxy that has been revoked");}};var e=b;b={get:null,set:null,apply:null,construct:null};for(var h in e){if(!(h in b))throw new TypeError("Proxy polyfill does not support trap '"+h+"'");b[h]=
e[h]}"function"==typeof e&&(b.apply=e.apply.bind(e));var d=this,n=!1,p="function"==typeof a;if(b.apply||b.construct||p)d=function(){var g=this&&this.constructor===d,f=Array.prototype.slice.call(arguments);c(g?"construct":"apply");if(g&&b.construct)return b.construct.call(this,a,f);if(!g&&b.apply)return b.apply(a,this,f);if(p)return g?(f.unshift(a),new (a.bind.apply(a,f))):a.apply(this,f);throw new TypeError(g?"not a constructor":"not a function");},n=!0;var q=b.get?function(a){c("get");return b.get(this,
a,d)}:function(a){c("get");return this[a]},t=b.set?function(a,f){c("set");b.set(this,a,f,d)}:function(a,b){c("set");this[a]=b},r={};Object.getOwnPropertyNames(a).forEach(function(b){n&&b in d||(Object.defineProperty(d,b,{enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:q.bind(a,b),set:t.bind(a,b)}),r[b]=!0)});e=!0;Object.setPrototypeOf?Object.setPrototypeOf(d,Object.getPrototypeOf(a)):d.__proto__?d.__proto__=a.__proto__:e=!1;if(b.get||!e)for(var k in a)r[k]||Object.defineProperty(d,
k,{get:q.bind(a,k)});Object.seal(a);Object.seal(d);return d};c.a.b=function(a,b){return{proxy:new c.a(a,b),revoke:m}};c.a.revocable=c.a.b;c.Proxy=c.a}})("undefined"!==typeof process&&"[object process]"=={}.toString.call(process)?global:self);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],3:[function(require,module,exports){
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

},{"./is":5,"./vnode":11}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"./h":3,"./htmldomapi":4,"./is":5,"./thunk":10,"./vnode":11}],10:[function(require,module,exports){
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

},{"./h":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;

},{}],12:[function(require,module,exports){
"use strict";

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

module.exports = Compiler;

/**
 *
 * @param text
 * @returns {{getCode: string}}
 * @constructor
 */
function Compiler(text) {
    var _var = '_html' + Date.now();
    var state = STATE_HTML;
    var codeList = ["var " + _var + "='"];
    var index = 0;
    var length = text.length;

    while (index < length) {
        transfer();
    }
    pushCode("';return " + _var + ";");

    return {
        getCode: getCode
    };

    /**
     *
     * @returns {string}
     */
    function getCode() {
        return codeList.join('');
    }

    function pushCode(string) {
        codeList.push(string);
    }

    function charAt(string, index) {
        return string.charAt(index);
    }

    function toLowerCase(string) {
        return string.toLowerCase();
    }

    /**
     *
     */
    function transfer() {
        var char = charAt(text, index);

        switch (state) {
            case STATE_HTML:
                if (CHAR_LT == char && '%' == charAt(text, index + 1)) {
                    state = STATE_CODE;
                    pushCode("';");
                    index++;
                } else if ('<' == char && 's' == toLowerCase(charAt(text, index + 1)) && 'c' == toLowerCase(charAt(text, index + 2)) && 'r' == toLowerCase(charAt(text, index + 3)) && 'i' == toLowerCase(charAt(text, index + 4)) && 'p' == toLowerCase(charAt(text, index + 5)) && 't' == toLowerCase(charAt(text, index + 6)) && /[>\s]/.test(charAt(text, index + 7))) {
                    state = STATE_SCRIPT_TAG;
                    pushCode("<script");
                    index += 6;
                } else if ('$' == char && '{' == charAt(text, index + 1)) {
                    state = STATE_OUTPUT;
                    pushCode("'+(");
                    index++;
                } else if ("\r" == char) {
                    pushCode("\\r");
                } else if ("\n" == char) {
                    pushCode("\\n");
                } else {
                    pushCode(char);
                }
                break;

            case STATE_CODE:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_CODE_SINGLE_QUTO;
                    pushCode(char);
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_CODE_DOUBLE_QUTO;
                    pushCode(char);
                } else if ('%' == char && CHAR_GT == charAt(text, index + 1)) {
                    state = STATE_HTML;
                    pushCode(";" + _var + "+='");
                    index++;
                } else {
                    pushCode(char);
                }
                break;

            // 代码中的单引号
            case STATE_CODE_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_CODE;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            // 代码中的双引号
            case STATE_CODE_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_CODE;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            case STATE_OUTPUT:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_OUTPUT_SINGLE_QUTO;
                    pushCode(char);
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_OUTPUT_DOUBLE_QUTO;
                    pushCode(char);
                } else if ('}' == char) {
                    state = STATE_HTML;
                    pushCode(")+'");
                } else {
                    pushCode(char);
                }
                break;

            // 代码中的单引号
            case STATE_OUTPUT_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_OUTPUT;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            // 代码中的双引号
            case STATE_OUTPUT_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_OUTPUT;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            // Script 代码
            case STATE_SCRIPT_TAG:
                if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_SCRIPT_SINGLE_QUTO;
                    pushCode(char);
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_SCRIPT_DOUBLE_QUTO;
                    pushCode(char);
                } else if (CHAR_GT == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_CODE:
                if ('<' == char && '/' == charAt(text, index + 1) && 's' == toLowerCase(charAt(text, index + 2)) && 'c' == toLowerCase(charAt(text, index + 3)) && 'r' == toLowerCase(charAt(text, index + 4)) && 'i' == toLowerCase(charAt(text, index + 5)) && 'p' == toLowerCase(charAt(text, index + 6)) && 't' == toLowerCase(charAt(text, index + 7)) && '>' == charAt(text, index + 8)) {
                    state = STATE_HTML;
                    pushCode('</script>');
                    index += 8;
                } else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_SINGLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_SINGLE_QUTO == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;

            case STATE_SCRIPT_DOUBLE_QUTO:
                if (CHAR_ESCAPE == char) {
                    pushCode(char);
                    pushCode(charAt(text, ++index));
                } else if (CHAR_DOUBLE_QUTO == char) {
                    state = STATE_SCRIPT_CODE;
                    pushCode(char);
                } else {
                    pushCode(char);
                }
                break;
        }

        index++;
    }
}

},{}],13:[function(require,module,exports){
'use strict';

var snabbdom = require('snabbdom');
var patch = snabbdom.init([// Init patch function with chosen modules
require('snabbdom/modules/props').default, require('snabbdom/modules/attributes').default, // for setting properties on DOM elements
require('snabbdom/modules/eventlisteners').default // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var Compiler = require('./compiler');
var render = require('./render');
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

/**
 * document.hidden
 *
 * @returns {*}
 */
function documentHidden() {
    var props = ['hidden', 'mozHidden', 'webkitHidden'];
    for (var i = 0, length = props.length; i < length; i++) {
        if (props[i] in document) {
            return document[props[i]];
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

window.WebScript = function (options) {
    __classCallCheck(this, WebScript);

    var element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    } else {
        element = document.body.children[0];
    }

    var template = element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>');

    var compiler = new Compiler(template);

    var code = compiler.getCode();

    var observer = new Observer(options.data || {});

    var vnode;
    var timer;
    var visibilitychangeListener;

    observer.attach(redraw);

    redraw();

    return {
        data: observer.target,
        on: function on() {}
    };

    function redraw() {
        var html = render(code, options.data);

        var vnodeTemp = parser(html, options.data, h);

        // 如果页面被隐藏了，则减少重绘
        if (documentHidden()) {
            if (!visibilitychangeListener) {
                addEventListener(document, 'visibilitychange', function fn() {
                    removeEventListener(document, 'visibilitychange', fn);
                    visibilitychangeListener();
                    visibilitychangeListener = null;
                });
            }

            visibilitychangeListener = function visibilitychangeListener() {
                repatch(vnodeTemp);
            };
        } else {
            repatch(vnodeTemp);
        }
    }

    /**
     * @param newVnode
     */
    function repatch(newVnode) {
        if (timer) {
            cancelAnimationFrame(timer);
        }

        timer = requestAnimationFrame(function () {
            timer = null;
            patch(vnode || element, newVnode);
            vnode = newVnode;
        });
    }
};

},{"./compiler":12,"./observer":17,"./parser":18,"./render":19,"snabbdom":9,"snabbdom/h":3,"snabbdom/modules/attributes":6,"snabbdom/modules/eventlisteners":7,"snabbdom/modules/props":8}],14:[function(require,module,exports){
'use strict';

module.exports = function (array) {
    return toString.call(array) === '[object Array]';
};

},{}],15:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
    return toString.call(fn) === '[object Function]';
};

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function (obj) {
    return toString.call(obj) === '[object Object]';
};

},{}],17:[function(require,module,exports){
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
        for (var i = 0, length = subscribes.length; i < length; i++) {
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
},{"./lib/isArray":14,"./lib/isFunction":15,"./lib/isObject":16,"proxy-polyfill/proxy.min":2}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

/**
 * Render Function
 *
 * @param code
 * @param data
 * @returns {*}
 */
module.exports = function (code, data) {
  var fn;
  code = 'fn=function(' + Object.keys(data).join(',') + '){' + code + '}';
  eval(code);
  return fn.apply(this, Object.values(data));
};

},{}]},{},[13]);
