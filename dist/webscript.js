(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./is":3,"./vnode":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
exports.primitive = primitive;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./h":1,"./htmldomapi":2,"./is":3,"./thunk":8,"./vnode":9}],8:[function(require,module,exports){
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

},{"./h":1}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}
exports.vnode = vnode;
exports.default = vnode;

},{}],10:[function(require,module,exports){
var LT = "<";
var GT = ">";
var SINGLE_QUTO = "'";
var DOUBLE_QUTO = '"';
var TPL_QUTO = "`";
var ESCAPE_CHAR = "\\";

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
var STATE_SCRIPT_TPL_QUTO = 10;
var STATE_SCRIPT_CODE = 11;

var text = '';
var state = STATE_HTML;
var code;
var index = 0;

function transfer () {
     var char = text.charAt(index);

    switch (state) {
        case STATE_HTML:
            if (LT == char && '%' == text.charAt(index+1)) {
                state = STATE_CODE;
                code += "';";
                index++;
            }
            else if ('<' == char &&
                     's' == text.charAt(index+1) &&
                     'c' == text.charAt(index+2) &&
                     'r' == text.charAt(index+3) &&
                     'i' == text.charAt(index+4) &&
                     'p' == text.charAt(index+5) &&
                     't' == text.charAt(index+6) &&
                     /[>\s]/.test(text.charAt(index+7))) {
                state = STATE_SCRIPT_TAG;
                code += "<script";
                index += 6;
            }
            else if ('$' == char && '{' == text.charAt(index+1)) {
                state = STATE_OUTPUT;
                code += "'+(";
                index++;
            }
            else if ("\r" == char) {
                code += "\\r";
            }
            else if ("\n" == char) {
                code += "\\n";
            }
            else {
                code += char;
            }
            break;

        case STATE_CODE:
            if (SINGLE_QUTO == char) {
                state = STATE_CODE_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_CODE_DOUBLE_QUTO;
                code += char;
            }
            else if ('%' == char && '>' == text.charAt(index+1)) {
                state = STATE_HTML;
                code += ";html+='";
                index++;
            }
            else {
                code += char;
            }
            break;

        // 代码中的单引号
        case STATE_CODE_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

         // 代码中的双引号
        case STATE_CODE_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_OUTPUT:
            if (SINGLE_QUTO == char) {
                state = STATE_OUTPUT_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_OUTPUT_DOUBLE_QUTO;
                code += char;
            }
            else if ('}' == char) {
                state = STATE_HTML;
                code += ")+'";
            }
            else {
                code += char;
            }
            break;

        // 代码中的单引号
        case STATE_OUTPUT_SINGLE_QUTO:
        case STATE_SCRIPT_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_OUTPUT;
                code += char;
            }
            else {
                code += char;
            }
            break;

        // 代码中的双引号
        case STATE_OUTPUT_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_OUTPUT;
                code += char;
            }
            else {
                code += char;
            }
            break;

        // Script 代码
        case STATE_SCRIPT_TAG:
            if (SINGLE_QUTO == char) {
                state = STATE_SCRIPT_SINGLE_QUTO;
                code += char;
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_SCRIPT_DOUBLE_QUTO;
                code += char;
            }
            else if ('>' == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_CODE:
            if ('<' == char &&
                '/' == text.charAt(index+1) &&
                's' == text.charAt(index+2) &&
                'c' == text.charAt(index+3) &&
                'r' == text.charAt(index+4) &&
                'i' == text.charAt(index+5) &&
                'p' == text.charAt(index+6) &&
                't' == text.charAt(index+7) &&
                '>' == text.charAt(index+8)) {
                state = STATE_HTML;
                code += '</script>';
                index += 8;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_SINGLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (SINGLE_QUTO == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;

        case STATE_SCRIPT_DOUBLE_QUTO:
            if (ESCAPE_CHAR == char) {
                code += char + text.charAt(++index);
            }
            else if (DOUBLE_QUTO == char) {
                state = STATE_SCRIPT_CODE;
                code += char;
            }
            else {
                code += char;
            }
            break;
    }

    index++;
}

function compiler (txt) {
    code = "var html='";
    text = txt;
    var length = text.length;
    while (index < length) {
        transfer();
    }
    code += "';return html;";
    return code;
}

module.exports = compiler;

},{}],11:[function(require,module,exports){
var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/props').default,
    require('snabbdom/modules/attributes').default, // for setting properties on DOM elements
    require('snabbdom/modules/eventlisteners').default // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var compiler = require('./compiler');
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

window.WebScript = function (data, options) {
    __classCallCheck(this, WebScript);

    var element;

    options = options || {};
    if ('root' in options) {
        element = options.root;
    }
    else {
        element = document.body.children[0];
    }

    var code = compiler(element.outerHTML.replace(/&lt;/ig, '<').replace(/&gt;/ig, '>'));

    var observer = new Observer(data);
    var vnode;
    var timer;
    var visibilitychangeListener;

    observer.attach(redraw);

    redraw();

    function redraw() {
        var html = render(code, data);

        var vnodeTemp = parser(html, data, h);

        // 如果页面被隐藏了，则减少重绘
        if (documentHidden()) {
            if (!visibilitychangeListener) {
                addEventListener(document, 'visibilitychange', function fn () {
                    removeEventListener(document, 'visibilitychange', fn);
                    visibilitychangeListener();
                    visibilitychangeListener = null;
                });
            }

            visibilitychangeListener = function () {
                repatch(vnodeTemp);
            };
        }
        else {
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

        timer = requestAnimationFrame(function() {
            timer = null;
            patch(vnode || element, newVnode);
            vnode = newVnode;
        });
    }
};
},{"./compiler":10,"./observer":15,"./parser":16,"./render":17,"snabbdom":7,"snabbdom/h":1,"snabbdom/modules/attributes":4,"snabbdom/modules/eventlisteners":5,"snabbdom/modules/props":6}],12:[function(require,module,exports){
module.exports = function (array) {
    return toString.call(array) === '[object Array]';
};

},{}],13:[function(require,module,exports){
module.exports = function (fn) {
    return toString.call(fn) === '[object Function]';
};

},{}],14:[function(require,module,exports){
module.exports = function (obj) {
    return toString.call(obj) === '[object Object]';
};

},{}],15:[function(require,module,exports){
var isFunction = require('./lib/isFunction');
var isObject = require('./lib/isObject');
var isArray = require('./lib/isArray');

var METHODS = ['fill', 'push', 'pop', 'reverse', 'shift', 'splice', 'sort', 'unshift'];

module.exports = function Observer(obj) {
    var subscribes = [];

    recurseObject(obj);

    return {
        attach: attach,
        detach: detach
    };

    function attach (fn) {
        if (isFunction(fn)) {
            subscribes.push(fn);
        }
    }

    function detach (fn) {
        // TODO
    }

    function notify (event) {
        for (var i=0, length = subscribes.length; i < length; i++) {
            subscribes[i](event);
        }
    }

    function defineProperty (object, prop, target) {
        var value = object[prop];

        Object.defineProperty(object, prop, {
            get: function () {
                return value;
            },
            set: function (val) {
                if (isObject(val)) {
                    recurseObject(val, target);
                }
                value = val;
                notify({
                    target: target
                });
            }
        });
    }
//
    function recurseObject (object, target) {
        for (var prop in object) {
            var value = object[prop];

            defineProperty(object, prop);

            if (isObject(value)) {
                recurseObject(value, (target || '') + '["' + prop + '"]');
            }
            else if (isArray(value)) {
                recurseArray(value, (target || '') + '["' + prop + '"]');
            }
        }
    }

    function recurseArray (array, target) {
        METHODS.forEach(function (name) {
            var fn = array[name];
            Object.defineProperty(array, name, {
                value: function () {
                    var returnValue = fn.apply(this, arguments);
                    notify({
                        target: target
                    });
                    return returnValue;
                }
            });
        });
    }
};
},{"./lib/isArray":12,"./lib/isFunction":13,"./lib/isObject":14}],16:[function(require,module,exports){
var domParser = new DOMParser();

function parseFromString(string) {
    var doc = domParser.parseFromString(string, 'text/html');
    return doc.body.firstChild;
}

function parseDOM (dom, data, h) {
    var selector = tagName = dom.tagName,
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

    var i,
        length;

    for(i = 0, length = attributes.length; i < length; i++) {
        (function (name, value) {
            var eventMatch = /^on(.*)/.exec(name);
            var bindMatch = /^:(.*)/.exec(value);
            // Var Bind
            if (name == "name" && bindMatch && (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")) {
                value = bindMatch[1];
                if (dom.type == 'radio') {
                    hData.attrs.name = value;
                    hData.props.checked = (dom.value == getObject(data, value));
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    }
                }
                else if (dom.type == 'checkbox') {
                    hData.props.checked = getObject(data, value);
                    hData.on.change = function (event) {
                        setObject(data, value, event.target.checked);
                    }
                }
                else {
                    hData.props.value = getObject(data, value);
                    hData.on.input = hData.on.change = function (event) {
                        setObject(data, value, event.target.value);
                    }
                }
            }
            else if (bindMatch && eventMatch) {
                hData.on[eventMatch[1]] = getObject(data, bindMatch[1]);
            }
            else if (name != 'id' && name != 'class') {
                hData.attrs[parseName(name)] = value;
            }
        }(attributes[i].name, attributes[i].value));
    }

    for(i = 0, length = dom.childNodes.length; i < length; i++){
        var child = dom.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            children.push(child.textContent);
        }
        else {
            children.push(parseDOM(child, data, h));
        }
    }

    return h(selector, hData, children);
}

function isBindVar (value) {
    return /^:[$[a-z]/i.test(value.trim());
}

function parseName (name) {
    return name.replace(/-([a-z])/ig, function ($0, $1) {
        return $1.toUpperCase();
    });
}

function parseProp(prop) {
    var propList = [];
    if (prop.charAt(0) != '[') {
        propList = prop.split('.');
    }
    else {
        propList = prop.replace(/^\[[\'\"]?|[\'\"]?$/g, '').split(/[\'\"]?\]\[[\'\"]?/); // ['a'][0]
    }

    return propList;
}

function getObject (object, prop, defaultValue) {
    var propList = parseProp(prop);

    for(var i = 0, length = propList.length; i < length; i++) {
        if (propList[i] in object) {
            object = object[propList[i]];
        }
        else {
            return defaultValue;
        }
    }
    return object;
}

function setObject (object, prop, value) {
    var propList = parseProp(prop);

    for(var i = 0, length = propList.length; i < length; i++) {
        if (i == length-1) {
            object[propList[i]] = value;
        }
        else {
            object = object[propList[i]];
        }
    }
}

module.exports = function (html, data, h) {
    var dom = parseFromString(html);
    return parseDOM(dom, data, h);
};

},{}],17:[function(require,module,exports){
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
},{}]},{},[11]);
