/*!
 * jQuery JavaScript Library v3.3.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call(Object);

var support = {};

var isFunction = function isFunction(obj) {
    // Support: Chrome <=57, Firefox <=52
    // In some browsers, typeof returns "function" for HTML <object> elements
    // (i.e., `typeof document.createElement( "object" ) === "function"`).
    // We don't want to classify *any* DOM node as a function.
    return typeof obj === "function" && typeof obj.nodeType !== "number";
};

var isWindow = function isWindow(obj) {
    return obj != null && obj === obj.window;
};

var preservedScriptAttributes = {
    type: true,
    src: true,
    noModule: true,
};

function DOMEval(code, doc, node) {
    doc = doc || document;

    var i,
        script = doc.createElement("script");

    script.text = code;
    if (node) {
        for (i in preservedScriptAttributes) {
            if (node[i]) {
                script[i] = node[i];
            }
        }
    }
    doc.head.appendChild(script).parentNode.removeChild(script);
}

function toType(obj) {
    if (obj == null) {
        return obj + "";
    }

    // Support: Android <=2.3 only (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function"
        ? class2type[toString.call(obj)] || "object"
        : typeof obj;
}

// global Symbol
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module

var version =
        "3.3.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector",
    // Define a local copy of jQuery
    jQuery = function (selector, context) {
        // The jQuery object is actually just the init constructor 'enhanced'
        // Need init if jQuery is called (just allow error to be thrown if not included)
        return new jQuery.fn.init(selector, context);
    },
    // Support: Android <=4.0 only
    // Make sure we trim BOM and NBSP
    rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: version,

    constructor: jQuery,

    // The default length of a jQuery object is 0
    length: 0,

    toArray: function () {
        return slice.call(this);
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function (num) {
        // Return all the elements in a clean array
        if (num == null) {
            return slice.call(this);
        }

        // Return just the one element from the set
        return num < 0 ? this[num + this.length] : this[num];
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function (elems) {
        // Build a new jQuery matched element set
        var ret = jQuery.merge(this.constructor(), elems);

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    each: function (callback) {
        return jQuery.each(this, callback);
    },

    map: function (callback) {
        return this.pushStack(
            jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem);
            })
        );
    },

    slice: function () {
        return this.pushStack(slice.apply(this, arguments));
    },

    first: function () {
        return this.eq(0);
    },

    last: function () {
        return this.eq(-1);
    },

    eq: function (i) {
        var len = this.length,
            j = +i + (i < 0 ? len : 0);
        return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },

    end: function () {
        return this.prevObject || this.constructor();
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: arr.sort,
    splice: arr.splice,
};

jQuery.extend = jQuery.fn.extend = function () {
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = jQuery.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend({
    // Unique for each copy of jQuery on the page
    expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

    // Assume jQuery is ready without the ready module
    isReady: true,

    error: function (msg) {
        throw new Error(msg);
    },

    noop: function () {},

    isPlainObject: function (obj) {
        var proto, Ctor;

        // Detect obvious negatives
        // Use toString instead of jQuery.type to catch host objects
        if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
        }

        proto = getProto(obj);

        // Objects with no prototype (e.g., `Object.create( null )`) are plain
        if (!proto) {
            return true;
        }

        // Objects with prototype are plain iff they were constructed by a global Object function
        Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
        return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
    },

    isEmptyObject: function (obj) {
        /* eslint-disable no-unused-vars */
        // See https://github.com/eslint/eslint/issues/6125
        var name;

        for (name in obj) {
            return false;
        }
        return true;
    },

    // Evaluates a script in a global context
    globalEval: function (code) {
        DOMEval(code);
    },

    each: function (obj, callback) {
        var length,
            i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                    break;
                }
            }
        }

        return obj;
    },

    // Support: Android <=4.0 only
    trim: function (text) {
        return text == null ? "" : (text + "").replace(rtrim, "");
    },

    // results is for internal usage only
    makeArray: function (arr, results) {
        var ret = results || [];

        if (arr != null) {
            if (isArrayLike(Object(arr))) {
                jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
            } else {
                push.call(ret, arr);
            }
        }

        return ret;
    },

    inArray: function (elem, arr, i) {
        return arr == null ? -1 : indexOf.call(arr, elem, i);
    },

    // Support: Android <=4.0 only, PhantomJS 1 only
    // push.apply(_, arraylike) throws on ancient WebKit
    merge: function (first, second) {
        var len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    },

    grep: function (elems, callback, invert) {
        var callbackInverse,
            matches = [],
            i = 0,
            length = elems.length,
            callbackExpect = !invert;

        // Go through the array, only saving the items
        // that pass the validator function
        for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
            }
        }

        return matches;
    },

    // arg is for internal usage only
    map: function (elems, callback, arg) {
        var length,
            value,
            i = 0,
            ret = [];

        // Go through the array, translating each of the items to their new values
        if (isArrayLike(elems)) {
            length = elems.length;
            for (; i < length; i++) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret.push(value);
                }
            }

            // Go through every key on the object,
        } else {
            for (i in elems) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret.push(value);
                }
            }
        }

        // Flatten any nested arrays
        return concat.apply([], ret);
    },

    // A global GUID counter for objects
    guid: 1,

    // jQuery.support is not used in Core but other projects attach their
    // properties to it so it needs to exist.
    support: support,
});

if (typeof Symbol === "function") {
    jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
});

function isArrayLike(obj) {
    // Support: real iOS 8.2 only (not reproducible in simulator)
    // `in` check used to prevent JIT error (gh-2145)
    // hasOwn isn't used here due to false negatives
    // regarding Nodelist length in IE
    var length = !!obj && "length" in obj && obj.length,
        type = toType(obj);

    if (isFunction(obj) || isWindow(obj)) {
        return false;
    }

    return type === "array" || length === 0 || (typeof length === "number" && length > 0 && length - 1 in obj);
}

var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.3.3
     * https://sizzlejs.com/
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2016-08-08
     */
    (function (window) {
        var i,
            support,
            Expr,
            getText,
            isXML,
            tokenize,
            compile,
            select,
            outermostContext,
            sortInput,
            hasDuplicate,
            // Local document vars
            setDocument,
            document,
            docElem,
            documentIsHTML,
            rbuggyQSA,
            rbuggyMatches,
            matches,
            contains,
            // Instance-specific data
            expando = "sizzle" + 1 * new Date(),
            preferredDoc = window.document,
            dirruns = 0,
            done = 0,
            classCache = createCache(),
            tokenCache = createCache(),
            compilerCache = createCache(),
            sortOrder = function (a, b) {
                if (a === b) {
                    hasDuplicate = true;
                }
                return 0;
            },
            // Instance methods
            hasOwn = {}.hasOwnProperty,
            arr = [],
            pop = arr.pop,
            push_native = arr.push,
            push = arr.push,
            slice = arr.slice,
            // Use a stripped-down indexOf as it's faster than native
            // https://jsperf.com/thor-indexof-vs-for/5
            indexOf = function (list, elem) {
                var i = 0,
                    len = list.length;
                for (; i < len; i++) {
                    if (list[i] === elem) {
                        return i;
                    }
                }
                return -1;
            },
            booleans =
                "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            // Regular expressions

            // http://www.w3.org/TR/css3-selectors/#whitespace
            whitespace = "[\\x20\\t\\r\\n\\f]",
            // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
            identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
            attributes =
                "\\[" +
                whitespace +
                "*(" +
                identifier +
                ")(?:" +
                whitespace +
                // Operator (capture 2)
                "*([*^$|!~]?=)" +
                whitespace +
                // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
                "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
                identifier +
                "))|)" +
                whitespace +
                "*\\]",
            pseudos =
                ":(" +
                identifier +
                ")(?:\\((" +
                // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
                // 1. quoted (capture 3; capture 4 or capture 5)
                "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
                // 2. simple (capture 6)
                "((?:\\\\.|[^\\\\()[\\]]|" +
                attributes +
                ")*)|" +
                // 3. anything else (capture 2)
                ".*" +
                ")\\)|)",
            // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
            rwhitespace = new RegExp(whitespace + "+", "g"),
            rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
            rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
            rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
            rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),
            rpseudo = new RegExp(pseudos),
            ridentifier = new RegExp("^" + identifier + "$"),
            matchExpr = {
                ID: new RegExp("^#(" + identifier + ")"),
                CLASS: new RegExp("^\\.(" + identifier + ")"),
                TAG: new RegExp("^(" + identifier + "|[*])"),
                ATTR: new RegExp("^" + attributes),
                PSEUDO: new RegExp("^" + pseudos),
                CHILD: new RegExp(
                    "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                        whitespace +
                        "*(even|odd|(([+-]|)(\\d*)n|)" +
                        whitespace +
                        "*(?:([+-]|)" +
                        whitespace +
                        "*(\\d+)|))" +
                        whitespace +
                        "*\\)|)",
                    "i"
                ),
                bool: new RegExp("^(?:" + booleans + ")$", "i"),
                // For use in libraries implementing .is()
                // We use this for POS matching in `select`
                needsContext: new RegExp(
                    "^" +
                        whitespace +
                        "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                        whitespace +
                        "*((?:-\\d)?\\d*)" +
                        whitespace +
                        "*\\)|)(?=[^-]|$)",
                    "i"
                ),
            },
            rinputs = /^(?:input|select|textarea|button)$/i,
            rheader = /^h\d$/i,
            rnative = /^[^{]+\{\s*\[native \w/,
            // Easily-parseable/retrievable ID or TAG or CLASS selectors
            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            rsibling = /[+~]/,
            // CSS escapes
            // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
            runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
            funescape = function (_, escaped, escapedWhitespace) {
                var high = "0x" + escaped - 0x10000;
                // NaN means non-codepoint
                // Support: Firefox<24
                // Workaround erroneous numeric interpretation of +"0x"
                return high !== high || escapedWhitespace
                    ? escaped
                    : high < 0
                    ? // BMP codepoint
                      String.fromCharCode(high + 0x10000)
                    : // Supplemental Plane codepoint (surrogate pair)
                      String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
            },
            // CSS string/identifier serialization
            // https://drafts.csswg.org/cssom/#common-serializing-idioms
            // eslint-disable-next-line no-control-regex
            rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            fcssescape = function (ch, asCodePoint) {
                if (asCodePoint) {
                    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                    if (ch === "\0") {
                        return "\uFFFD";
                    }

                    // Control characters and (dependent upon position) numbers get escaped as code points
                    return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
                }

                // Other potentially-special ASCII characters get backslash-escaped
                return "\\" + ch;
            },
            // Used for iframes
            // See setDocument()
            // Removing the function wrapper causes a "Permission Denied"
            // error in IE
            unloadHandler = function () {
                setDocument();
            },
            disabledAncestor = addCombinator(
                function (elem) {
                    return elem.disabled === true && ("form" in elem || "label" in elem);
                },
                { dir: "parentNode", next: "legend" }
            );

        // Optimize for push.apply( _, NodeList )
        try {
            push.apply((arr = slice.call(preferredDoc.childNodes)), preferredDoc.childNodes);
            // Support: Android<4.0
            // Detect silently failing push.apply
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length
                    ? // Leverage slice if possible
                      function (target, els) {
                          push_native.apply(target, slice.call(els));
                      }
                    : // Support: IE<9
                      // Otherwise append directly
                      function (target, els) {
                          var j = target.length,
                              i = 0;
                          // Can't trust NodeList.length
                          while ((target[j++] = els[i++])) {}
                          target.length = j - 1;
                      },
            };
        }

        function Sizzle(selector, context, results, seed) {
            var m,
                i,
                elem,
                nid,
                match,
                groups,
                newSelector,
                newContext = context && context.ownerDocument,
                // nodeType defaults to 9, since context defaults to document
                nodeType = context ? context.nodeType : 9;

            results = results || [];

            // Return early from calls with invalid selector or context
            if (typeof selector !== "string" || !selector || (nodeType !== 1 && nodeType !== 9 && nodeType !== 11)) {
                return results;
            }

            // Try to shortcut find operations (as opposed to filters) in HTML documents
            if (!seed) {
                if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                    setDocument(context);
                }
                context = context || document;

                if (documentIsHTML) {
                    // If the selector is sufficiently simple, try using a "get*By*" DOM method
                    // (excepting DocumentFragment context, where the methods don't exist)
                    if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {
                        // ID selector
                        if ((m = match[1])) {
                            // Document context
                            if (nodeType === 9) {
                                if ((elem = context.getElementById(m))) {
                                    // Support: IE, Opera, Webkit
                                    // TODO: identify versions
                                    // getElementById can match elements by name instead of ID
                                    if (elem.id === m) {
                                        results.push(elem);
                                        return results;
                                    }
                                } else {
                                    return results;
                                }

                                // Element context
                            } else {
                                // Support: IE, Opera, Webkit
                                // TODO: identify versions
                                // getElementById can match elements by name instead of ID
                                if (
                                    newContext &&
                                    (elem = newContext.getElementById(m)) &&
                                    contains(context, elem) &&
                                    elem.id === m
                                ) {
                                    results.push(elem);
                                    return results;
                                }
                            }

                            // Type selector
                        } else if (match[2]) {
                            push.apply(results, context.getElementsByTagName(selector));
                            return results;

                            // Class selector
                        } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                            push.apply(results, context.getElementsByClassName(m));
                            return results;
                        }
                    }

                    // Take advantage of querySelectorAll
                    if (support.qsa && !compilerCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                        if (nodeType !== 1) {
                            newContext = context;
                            newSelector = selector;

                            // qSA looks outside Element context, which is not what we want
                            // Thanks to Andrew Dupont for this workaround technique
                            // Support: IE <=8
                            // Exclude object elements
                        } else if (context.nodeName.toLowerCase() !== "object") {
                            // Capture the context ID, setting it first if necessary
                            if ((nid = context.getAttribute("id"))) {
                                nid = nid.replace(rcssescape, fcssescape);
                            } else {
                                context.setAttribute("id", (nid = expando));
                            }

                            // Prefix every selector in the list
                            groups = tokenize(selector);
                            i = groups.length;
                            while (i--) {
                                groups[i] = "#" + nid + " " + toSelector(groups[i]);
                            }
                            newSelector = groups.join(",");

                            // Expand context for sibling selectors
                            newContext = (rsibling.test(selector) && testContext(context.parentNode)) || context;
                        }

                        if (newSelector) {
                            try {
                                push.apply(results, newContext.querySelectorAll(newSelector));
                                return results;
                            } catch (qsaError) {
                            } finally {
                                if (nid === expando) {
                                    context.removeAttribute("id");
                                }
                            }
                        }
                    }
                }
            }

            // All others
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }

        /**
         * Create key-value caches of limited size
         * @returns {function(string, object)} Returns the Object data after storing it on itself with
         *    property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
         *    deleting the oldest entry
         */
        function createCache() {
            var keys = [];

            function cache(key, value) {
                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
                if (keys.push(key + " ") > Expr.cacheLength) {
                    // Only keep the most recent entries
                    delete cache[keys.shift()];
                }
                return (cache[key + " "] = value);
            }

            return cache;
        }

        /**
         * Mark a function for special use by Sizzle
         * @param {Function} fn The function to mark
         */
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }

        /**
         * Support testing using an element
         * @param {Function} fn Passed the created element and returns a boolean result
         */
        function assert(fn) {
            var el = document.createElement("fieldset");

            try {
                return !!fn(el);
            } catch (e) {
                return false;
            } finally {
                // Remove from its parent by default
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
                // release memory in IE
                el = null;
            }
        }

        /**
         * Adds the same handler for all of the specified attrs
         * @param {String} attrs Pipe-separated list of attributes
         * @param {Function} handler The method that will be applied
         */
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"),
                i = arr.length;

            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }

        /**
         * Checks document order of two siblings
         * @param {Element} a
         * @param {Element} b
         * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
         */
        function siblingCheck(a, b) {
            var cur = b && a,
                diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

            // Use IE sourceIndex if available on both nodes
            if (diff) {
                return diff;
            }

            // Check if b follows a
            if (cur) {
                while ((cur = cur.nextSibling)) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }

            return a ? 1 : -1;
        }

        /**
         * Returns a function to use in pseudos for input types
         * @param {String} type
         */
        function createInputPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for buttons
         * @param {String} type
         */
        function createButtonPseudo(type) {
            return function (elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }

        /**
         * Returns a function to use in pseudos for :enabled/:disabled
         * @param {Boolean} disabled true for :disabled; false for :enabled
         */
        function createDisabledPseudo(disabled) {
            // Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
            return function (elem) {
                // Only certain elements can match :enabled or :disabled
                // https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
                // https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
                if ("form" in elem) {
                    // Check for inherited disabledness on relevant non-disabled elements:
                    // * listed form-associated elements in a disabled fieldset
                    //   https://html.spec.whatwg.org/multipage/forms.html#category-listed
                    //   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
                    // * option elements in a disabled optgroup
                    //   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
                    // All such elements have a "form" property.
                    if (elem.parentNode && elem.disabled === false) {
                        // Option elements defer to a parent optgroup if present
                        if ("label" in elem) {
                            if ("label" in elem.parentNode) {
                                return elem.parentNode.disabled === disabled;
                            } else {
                                return elem.disabled === disabled;
                            }
                        }

                        // Support: IE 6 - 11
                        // Use the isDisabled shortcut property to check for disabled fieldset ancestors
                        return (
                            elem.isDisabled === disabled ||
                            // Where there is no isDisabled, check manually
                            /* jshint -W018 */
                            (elem.isDisabled !== !disabled && disabledAncestor(elem) === disabled)
                        );
                    }

                    return elem.disabled === disabled;

                    // Try to winnow out elements that can't be disabled before trusting the disabled property.
                    // Some victims get caught in our net (label, legend, menu, track), but it shouldn't
                    // even exist on them, let alone have a boolean value.
                } else if ("label" in elem) {
                    return elem.disabled === disabled;
                }

                // Remaining elements are neither :enabled nor :disabled
                return false;
            };
        }

        /**
         * Returns a function to use in pseudos for positionals
         * @param {Function} fn
         */
        function createPositionalPseudo(fn) {
            return markFunction(function (argument) {
                argument = +argument;
                return markFunction(function (seed, matches) {
                    var j,
                        matchIndexes = fn([], seed.length, argument),
                        i = matchIndexes.length;

                    // Match elements found at the specified indexes
                    while (i--) {
                        if (seed[(j = matchIndexes[i])]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }

        /**
         * Checks a node for validity as a Sizzle context
         * @param {Element|Object=} context
         * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
         */
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
        }

        // Expose support vars for convenience
        support = Sizzle.support = {};

        /**
         * Detects XML nodes
         * @param {Element|Object} elem An element or a document
         * @returns {Boolean} True iff elem is a non-HTML XML node
         */
        isXML = Sizzle.isXML = function (elem) {
            // documentElement is verified for cases where it doesn't yet exist
            // (such as loading iframes in IE - #4833)
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };

        /**
         * Sets document-related variables once based on the current document
         * @param {Element|Object} [doc] An element or document object to use to set the document
         * @returns {Object} Returns the current document
         */
        setDocument = Sizzle.setDocument = function (node) {
            var hasCompare,
                subWindow,
                doc = node ? node.ownerDocument || node : preferredDoc;

            // Return early if doc is invalid or already selected
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }

            // Update global variables
            document = doc;
            docElem = document.documentElement;
            documentIsHTML = !isXML(document);

            // Support: IE 9-11, Edge
            // Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
            if (preferredDoc !== document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {
                // Support: IE 11, Edge
                if (subWindow.addEventListener) {
                    subWindow.addEventListener("unload", unloadHandler, false);

                    // Support: IE 9 - 10 only
                } else if (subWindow.attachEvent) {
                    subWindow.attachEvent("onunload", unloadHandler);
                }
            }

            /* Attributes
	---------------------------------------------------------------------- */

            // Support: IE<8
            // Verify that getAttribute really returns attributes and not properties
            // (excepting IE8 booleans)
            support.attributes = assert(function (el) {
                el.className = "i";
                return !el.getAttribute("className");
            });

            /* getElement(s)By*
	---------------------------------------------------------------------- */

            // Check if getElementsByTagName("*") returns only elements
            support.getElementsByTagName = assert(function (el) {
                el.appendChild(document.createComment(""));
                return !el.getElementsByTagName("*").length;
            });

            // Support: IE<9
            support.getElementsByClassName = rnative.test(document.getElementsByClassName);

            // Support: IE<10
            // Check if getElementById returns elements by name
            // The broken getElementById methods don't pick up programmatically-set names,
            // so use a roundabout getElementsByName test
            support.getById = assert(function (el) {
                docElem.appendChild(el).id = expando;
                return !document.getElementsByName || !document.getElementsByName(expando).length;
            });

            // ID filter and find
            if (support.getById) {
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                        var elem = context.getElementById(id);
                        return elem ? [elem] : [];
                    }
                };
            } else {
                Expr.filter["ID"] = function (id) {
                    var attrId = id.replace(runescape, funescape);
                    return function (elem) {
                        var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };

                // Support: IE 6 - 7 only
                // getElementById is not reliable as a find shortcut
                Expr.find["ID"] = function (id, context) {
                    if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                        var node,
                            i,
                            elems,
                            elem = context.getElementById(id);

                        if (elem) {
                            // Verify the id attribute
                            node = elem.getAttributeNode("id");
                            if (node && node.value === id) {
                                return [elem];
                            }

                            // Fall back on getElementsByName
                            elems = context.getElementsByName(id);
                            i = 0;
                            while ((elem = elems[i++])) {
                                node = elem.getAttributeNode("id");
                                if (node && node.value === id) {
                                    return [elem];
                                }
                            }
                        }

                        return [];
                    }
                };
            }

            // Tag
            Expr.find["TAG"] = support.getElementsByTagName
                ? function (tag, context) {
                      if (typeof context.getElementsByTagName !== "undefined") {
                          return context.getElementsByTagName(tag);

                          // DocumentFragment nodes don't have gEBTN
                      } else if (support.qsa) {
                          return context.querySelectorAll(tag);
                      }
                  }
                : function (tag, context) {
                      var elem,
                          tmp = [],
                          i = 0,
                          // By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
                          results = context.getElementsByTagName(tag);

                      // Filter out possible comments
                      if (tag === "*") {
                          while ((elem = results[i++])) {
                              if (elem.nodeType === 1) {
                                  tmp.push(elem);
                              }
                          }

                          return tmp;
                      }
                      return results;
                  };

            // Class
            Expr.find["CLASS"] =
                support.getElementsByClassName &&
                function (className, context) {
                    if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                        return context.getElementsByClassName(className);
                    }
                };

            /* QSA/matchesSelector
	---------------------------------------------------------------------- */

            // QSA and matchesSelector support

            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
            rbuggyMatches = [];

            // qSa(:focus) reports false when true (Chrome 21)
            // We allow this because of a bug in IE8/9 that throws an error
            // whenever `document.activeElement` is accessed on an iframe
            // So, we allow :focus to pass through QSA all the time to avoid the IE error
            // See https://bugs.jquery.com/ticket/13378
            rbuggyQSA = [];

            if ((support.qsa = rnative.test(document.querySelectorAll))) {
                // Build QSA regex
                // Regex strategy adopted from Diego Perini
                assert(function (el) {
                    // Select is set to empty string on purpose
                    // This is to test IE's treatment of not explicitly
                    // setting a boolean content attribute,
                    // since its presence should be enough
                    // https://bugs.jquery.com/ticket/12359
                    docElem.appendChild(el).innerHTML =
                        "<a id='" +
                        expando +
                        "'></a>" +
                        "<select id='" +
                        expando +
                        "-\r\\' msallowcapture=''>" +
                        "<option selected=''></option></select>";

                    // Support: IE8, Opera 11-12.16
                    // Nothing should be selected when empty strings follow ^= or $= or *=
                    // The test attribute must be unknown in Opera but "safe" for WinRT
                    // https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
                    if (el.querySelectorAll("[msallowcapture^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }

                    // Support: IE8
                    // Boolean attributes and "value" are not treated correctly
                    if (!el.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }

                    // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
                    if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                        rbuggyQSA.push("~=");
                    }

                    // Webkit/Opera - :checked should return selected option elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    // IE8 throws error here and will not see later tests
                    if (!el.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }

                    // Support: Safari 8+, iOS 8+
                    // https://bugs.webkit.org/show_bug.cgi?id=136851
                    // In-page `selector#id sibling-combinator selector` fails
                    if (!el.querySelectorAll("a#" + expando + "+*").length) {
                        rbuggyQSA.push(".#.+[+~]");
                    }
                });

                assert(function (el) {
                    el.innerHTML =
                        "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

                    // Support: Windows 8 Native Apps
                    // The type and name attributes are restricted during .innerHTML assignment
                    var input = document.createElement("input");
                    input.setAttribute("type", "hidden");
                    el.appendChild(input).setAttribute("name", "D");

                    // Support: IE8
                    // Enforce case-sensitivity of name attribute
                    if (el.querySelectorAll("[name=d]").length) {
                        rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                    }

                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                    // IE8 throws error here and will not see later tests
                    if (el.querySelectorAll(":enabled").length !== 2) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }

                    // Support: IE9-11+
                    // IE's :disabled selector does not pick up the children of disabled fieldsets
                    docElem.appendChild(el).disabled = true;
                    if (el.querySelectorAll(":disabled").length !== 2) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }

                    // Opera 10-11 does not throw on post-comma invalid pseudos
                    el.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }

            if (
                (support.matchesSelector = rnative.test(
                    (matches =
                        docElem.matches ||
                        docElem.webkitMatchesSelector ||
                        docElem.mozMatchesSelector ||
                        docElem.oMatchesSelector ||
                        docElem.msMatchesSelector)
                ))
            ) {
                assert(function (el) {
                    // Check to see if it's possible to do matchesSelector
                    // on a disconnected node (IE 9)
                    support.disconnectedMatch = matches.call(el, "*");

                    // This should fail with an exception
                    // Gecko does not error, returns false instead
                    matches.call(el, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }

            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

            /* Contains
	---------------------------------------------------------------------- */
            hasCompare = rnative.test(docElem.compareDocumentPosition);

            // Element contains another
            // Purposefully self-exclusive
            // As in, an element does not contain itself
            contains =
                hasCompare || rnative.test(docElem.contains)
                    ? function (a, b) {
                          var adown = a.nodeType === 9 ? a.documentElement : a,
                              bup = b && b.parentNode;
                          return (
                              a === bup ||
                              !!(
                                  bup &&
                                  bup.nodeType === 1 &&
                                  (adown.contains
                                      ? adown.contains(bup)
                                      : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16)
                              )
                          );
                      }
                    : function (a, b) {
                          if (b) {
                              while ((b = b.parentNode)) {
                                  if (b === a) {
                                      return true;
                                  }
                              }
                          }
                          return false;
                      };

            /* Sorting
	---------------------------------------------------------------------- */

            // Document order sorting
            sortOrder = hasCompare
                ? function (a, b) {
                      // Flag for duplicate removal
                      if (a === b) {
                          hasDuplicate = true;
                          return 0;
                      }

                      // Sort on method existence if only one input has compareDocumentPosition
                      var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                      if (compare) {
                          return compare;
                      }

                      // Calculate position if both inputs belong to the same document
                      compare =
                          (a.ownerDocument || a) === (b.ownerDocument || b)
                              ? a.compareDocumentPosition(b)
                              : // Otherwise we know they are disconnected
                                1;

                      // Disconnected nodes
                      if (compare & 1 || (!support.sortDetached && b.compareDocumentPosition(a) === compare)) {
                          // Choose the first element that is related to our preferred document
                          if (a === document || (a.ownerDocument === preferredDoc && contains(preferredDoc, a))) {
                              return -1;
                          }
                          if (b === document || (b.ownerDocument === preferredDoc && contains(preferredDoc, b))) {
                              return 1;
                          }

                          // Maintain original order
                          return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
                      }

                      return compare & 4 ? -1 : 1;
                  }
                : function (a, b) {
                      // Exit early if the nodes are identical
                      if (a === b) {
                          hasDuplicate = true;
                          return 0;
                      }

                      var cur,
                          i = 0,
                          aup = a.parentNode,
                          bup = b.parentNode,
                          ap = [a],
                          bp = [b];

                      // Parentless nodes are either documents or disconnected
                      if (!aup || !bup) {
                          return a === document
                              ? -1
                              : b === document
                              ? 1
                              : aup
                              ? -1
                              : bup
                              ? 1
                              : sortInput
                              ? indexOf(sortInput, a) - indexOf(sortInput, b)
                              : 0;

                          // If the nodes are siblings, we can do a quick check
                      } else if (aup === bup) {
                          return siblingCheck(a, b);
                      }

                      // Otherwise we need full lists of their ancestors for comparison
                      cur = a;
                      while ((cur = cur.parentNode)) {
                          ap.unshift(cur);
                      }
                      cur = b;
                      while ((cur = cur.parentNode)) {
                          bp.unshift(cur);
                      }

                      // Walk down the tree looking for a discrepancy
                      while (ap[i] === bp[i]) {
                          i++;
                      }

                      return i
                          ? // Do a sibling check if the nodes have a common ancestor
                            siblingCheck(ap[i], bp[i])
                          : // Otherwise nodes in our document sort first
                          ap[i] === preferredDoc
                          ? -1
                          : bp[i] === preferredDoc
                          ? 1
                          : 0;
                  };

            return document;
        };

        Sizzle.matches = function (expr, elements) {
            return Sizzle(expr, null, null, elements);
        };

        Sizzle.matchesSelector = function (elem, expr) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            // Make sure that attribute selectors are quoted
            expr = expr.replace(rattributeQuotes, "='$1']");

            if (
                support.matchesSelector &&
                documentIsHTML &&
                !compilerCache[expr + " "] &&
                (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
                (!rbuggyQSA || !rbuggyQSA.test(expr))
            ) {
                try {
                    var ret = matches.call(elem, expr);

                    // IE 9's matchesSelector returns false on disconnected nodes
                    if (
                        ret ||
                        support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        (elem.document && elem.document.nodeType !== 11)
                    ) {
                        return ret;
                    }
                } catch (e) {}
            }

            return Sizzle(expr, document, null, [elem]).length > 0;
        };

        Sizzle.contains = function (context, elem) {
            // Set document vars if needed
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };

        Sizzle.attr = function (elem, name) {
            // Set document vars if needed
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }

            var fn = Expr.attrHandle[name.toLowerCase()],
                // Don't get fooled by Object.prototype properties (jQuery #13807)
                val =
                    fn && hasOwn.call(Expr.attrHandle, name.toLowerCase())
                        ? fn(elem, name, !documentIsHTML)
                        : undefined;

            return val !== undefined
                ? val
                : support.attributes || !documentIsHTML
                ? elem.getAttribute(name)
                : (val = elem.getAttributeNode(name)) && val.specified
                ? val.value
                : null;
        };

        Sizzle.escape = function (sel) {
            return (sel + "").replace(rcssescape, fcssescape);
        };

        Sizzle.error = function (msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };

        /**
         * Document sorting and removing duplicates
         * @param {ArrayLike} results
         */
        Sizzle.uniqueSort = function (results) {
            var elem,
                duplicates = [],
                j = 0,
                i = 0;

            // Unless we *know* we can detect duplicates, assume their presence
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);

            if (hasDuplicate) {
                while ((elem = results[i++])) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }

            // Clear input after sorting to release objects
            // See https://github.com/jquery/sizzle/pull/225
            sortInput = null;

            return results;
        };

        /**
         * Utility function for retrieving the text value of an array of DOM nodes
         * @param {Array|Element} elem
         */
        getText = Sizzle.getText = function (elem) {
            var node,
                ret = "",
                i = 0,
                nodeType = elem.nodeType;

            if (!nodeType) {
                // If no nodeType, this is expected to be an array
                while ((node = elem[i++])) {
                    // Do not traverse comment nodes
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines (jQuery #11153)
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    // Traverse its children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            // Do not include comment or processing instruction nodes

            return ret;
        };

        Expr = Sizzle.selectors = {
            // Can be adjusted by the user
            cacheLength: 50,

            createPseudo: markFunction,

            match: matchExpr,

            attrHandle: {},

            find: {},

            relative: {
                ">": { dir: "parentNode", first: true },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: true },
                "~": { dir: "previousSibling" },
            },

            preFilter: {
                ATTR: function (match) {
                    match[1] = match[1].replace(runescape, funescape);

                    // Move the given value to match[3] whether quoted or unquoted
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }

                    return match.slice(0, 4);
                },

                CHILD: function (match) {
                    /* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
                    match[1] = match[1].toLowerCase();

                    if (match[1].slice(0, 3) === "nth") {
                        // nth-* requires argument
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }

                        // numeric x and y parameters for Expr.filter.CHILD
                        // remember that false/true cast respectively to 0/1
                        match[4] = +(match[4]
                            ? match[5] + (match[6] || 1)
                            : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +(match[7] + match[8] || match[3] === "odd");

                        // other types prohibit arguments
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }

                    return match;
                },

                PSEUDO: function (match) {
                    var excess,
                        unquoted = !match[6] && match[2];

                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }

                    // Accept quoted arguments as-is
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";

                        // Strip excess characters from unquoted arguments
                    } else if (
                        unquoted &&
                        rpseudo.test(unquoted) &&
                        // Get excess from tokenize (recursively)
                        (excess = tokenize(unquoted, true)) &&
                        // advance to the next closing parenthesis
                        (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)
                    ) {
                        // excess is a negative index
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }

                    // Return only captures needed by the pseudo filter method (type and argument)
                    return match.slice(0, 3);
                },
            },

            filter: {
                TAG: function (nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*"
                        ? function () {
                              return true;
                          }
                        : function (elem) {
                              return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                          };
                },

                CLASS: function (className) {
                    var pattern = classCache[className + " "];

                    return (
                        pattern ||
                        ((pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
                            classCache(className, function (elem) {
                                return pattern.test(
                                    (typeof elem.className === "string" && elem.className) ||
                                        (typeof elem.getAttribute !== "undefined" && elem.getAttribute("class")) ||
                                        ""
                                );
                            }))
                    );
                },

                ATTR: function (name, operator, check) {
                    return function (elem) {
                        var result = Sizzle.attr(elem, name);

                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }

                        result += "";

                        return operator === "="
                            ? result === check
                            : operator === "!="
                            ? result !== check
                            : operator === "^="
                            ? check && result.indexOf(check) === 0
                            : operator === "*="
                            ? check && result.indexOf(check) > -1
                            : operator === "$="
                            ? check && result.slice(-check.length) === check
                            : operator === "~="
                            ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1
                            : operator === "|="
                            ? result === check || result.slice(0, check.length + 1) === check + "-"
                            : false;
                    };
                },

                CHILD: function (type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth",
                        forward = type.slice(-4) !== "last",
                        ofType = what === "of-type";

                    return first === 1 && last === 0
                        ? // Shortcut for :nth-*(n)
                          function (elem) {
                              return !!elem.parentNode;
                          }
                        : function (elem, context, xml) {
                              var cache,
                                  uniqueCache,
                                  outerCache,
                                  node,
                                  nodeIndex,
                                  start,
                                  dir = simple !== forward ? "nextSibling" : "previousSibling",
                                  parent = elem.parentNode,
                                  name = ofType && elem.nodeName.toLowerCase(),
                                  useCache = !xml && !ofType,
                                  diff = false;

                              if (parent) {
                                  // :(first|last|only)-(child|of-type)
                                  if (simple) {
                                      while (dir) {
                                          node = elem;
                                          while ((node = node[dir])) {
                                              if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                                  return false;
                                              }
                                          }
                                          // Reverse direction for :only-* (if we haven't yet done so)
                                          start = dir = type === "only" && !start && "nextSibling";
                                      }
                                      return true;
                                  }

                                  start = [forward ? parent.firstChild : parent.lastChild];

                                  // non-xml :nth-child(...) stores cache data on `parent`
                                  if (forward && useCache) {
                                      // Seek `elem` from a previously-cached index

                                      // ...in a gzip-friendly way
                                      node = parent;
                                      outerCache = node[expando] || (node[expando] = {});

                                      // Support: IE <9 only
                                      // Defend against cloned attroperties (jQuery gh-1709)
                                      uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                      cache = uniqueCache[type] || [];
                                      nodeIndex = cache[0] === dirruns && cache[1];
                                      diff = nodeIndex && cache[2];
                                      node = nodeIndex && parent.childNodes[nodeIndex];

                                      while (
                                          (node =
                                              (++nodeIndex && node && node[dir]) ||
                                              // Fallback to seeking `elem` from the start
                                              (diff = nodeIndex = 0) ||
                                              start.pop())
                                      ) {
                                          // When found, cache indexes on `parent` and break
                                          if (node.nodeType === 1 && ++diff && node === elem) {
                                              uniqueCache[type] = [dirruns, nodeIndex, diff];
                                              break;
                                          }
                                      }
                                  } else {
                                      // Use previously-cached element index if available
                                      if (useCache) {
                                          // ...in a gzip-friendly way
                                          node = elem;
                                          outerCache = node[expando] || (node[expando] = {});

                                          // Support: IE <9 only
                                          // Defend against cloned attroperties (jQuery gh-1709)
                                          uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                          cache = uniqueCache[type] || [];
                                          nodeIndex = cache[0] === dirruns && cache[1];
                                          diff = nodeIndex;
                                      }

                                      // xml :nth-child(...)
                                      // or :nth-last-child(...) or :nth(-last)?-of-type(...)
                                      if (diff === false) {
                                          // Use the same loop as above to seek `elem` from the start
                                          while (
                                              (node =
                                                  (++nodeIndex && node && node[dir]) ||
                                                  (diff = nodeIndex = 0) ||
                                                  start.pop())
                                          ) {
                                              if (
                                                  (ofType
                                                      ? node.nodeName.toLowerCase() === name
                                                      : node.nodeType === 1) &&
                                                  ++diff
                                              ) {
                                                  // Cache the index of each encountered element
                                                  if (useCache) {
                                                      outerCache = node[expando] || (node[expando] = {});

                                                      // Support: IE <9 only
                                                      // Defend against cloned attroperties (jQuery gh-1709)
                                                      uniqueCache =
                                                          outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

                                                      uniqueCache[type] = [dirruns, diff];
                                                  }

                                                  if (node === elem) {
                                                      break;
                                                  }
                                              }
                                          }
                                      }
                                  }

                                  // Incorporate the offset, then check against cycle size
                                  diff -= last;
                                  return diff === first || (diff % first === 0 && diff / first >= 0);
                              }
                          };
                },

                PSEUDO: function (pseudo, argument) {
                    // pseudo-class names are case-insensitive
                    // http://www.w3.org/TR/selectors/#pseudo-classes
                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                    // Remember that setFilters inherits from pseudos
                    var args,
                        fn =
                            Expr.pseudos[pseudo] ||
                            Expr.setFilters[pseudo.toLowerCase()] ||
                            Sizzle.error("unsupported pseudo: " + pseudo);

                    // The user may use createPseudo to indicate that
                    // arguments are needed to create the filter function
                    // just as Sizzle does
                    if (fn[expando]) {
                        return fn(argument);
                    }

                    // But maintain support for old signatures
                    if (fn.length > 1) {
                        args = [pseudo, pseudo, "", argument];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())
                            ? markFunction(function (seed, matches) {
                                  var idx,
                                      matched = fn(seed, argument),
                                      i = matched.length;
                                  while (i--) {
                                      idx = indexOf(seed, matched[i]);
                                      seed[idx] = !(matches[idx] = matched[i]);
                                  }
                              })
                            : function (elem) {
                                  return fn(elem, 0, args);
                              };
                    }

                    return fn;
                },
            },

            pseudos: {
                // Potentially complex pseudos
                not: markFunction(function (selector) {
                    // Trim the selector passed to compile
                    // to avoid treating leading and trailing
                    // spaces as combinators
                    var input = [],
                        results = [],
                        matcher = compile(selector.replace(rtrim, "$1"));

                    return matcher[expando]
                        ? markFunction(function (seed, matches, context, xml) {
                              var elem,
                                  unmatched = matcher(seed, null, xml, []),
                                  i = seed.length;

                              // Match elements unmatched by `matcher`
                              while (i--) {
                                  if ((elem = unmatched[i])) {
                                      seed[i] = !(matches[i] = elem);
                                  }
                              }
                          })
                        : function (elem, context, xml) {
                              input[0] = elem;
                              matcher(input, null, xml, results);
                              // Don't keep the element (issue #299)
                              input[0] = null;
                              return !results.pop();
                          };
                }),

                has: markFunction(function (selector) {
                    return function (elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),

                contains: markFunction(function (text) {
                    text = text.replace(runescape, funescape);
                    return function (elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),

                // "Whether an element is represented by a :lang() selector
                // is based solely on the element's language value
                // being equal to the identifier C,
                // or beginning with the identifier C immediately followed by "-".
                // The matching of C against the element's language value is performed case-insensitively.
                // The identifier C does not have to be a valid language name."
                // http://www.w3.org/TR/selectors/#lang-pseudo
                lang: markFunction(function (lang) {
                    // lang value must be a valid identifier
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function (elem) {
                        var elemLang;
                        do {
                            if (
                                (elemLang = documentIsHTML
                                    ? elem.lang
                                    : elem.getAttribute("xml:lang") || elem.getAttribute("lang"))
                            ) {
                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),

                // Miscellaneous
                target: function (elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },

                root: function (elem) {
                    return elem === docElem;
                },

                focus: function (elem) {
                    return (
                        elem === document.activeElement &&
                        (!document.hasFocus || document.hasFocus()) &&
                        !!(elem.type || elem.href || ~elem.tabIndex)
                    );
                },

                // Boolean properties
                enabled: createDisabledPseudo(false),
                disabled: createDisabledPseudo(true),

                checked: function (elem) {
                    // In CSS3, :checked should return both checked and selected elements
                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                    var nodeName = elem.nodeName.toLowerCase();
                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
                },

                selected: function (elem) {
                    // Accessing this property makes selected-by-default
                    // options in Safari work properly
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }

                    return elem.selected === true;
                },

                // Contents
                empty: function (elem) {
                    // http://www.w3.org/TR/selectors/#empty-pseudo
                    // :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
                    //   but not by others (comment: 8; processing instruction: 7; etc.)
                    // nodeType < 6 works because attributes (2) do not appear as children
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },

                parent: function (elem) {
                    return !Expr.pseudos["empty"](elem);
                },

                // Element/input types
                header: function (elem) {
                    return rheader.test(elem.nodeName);
                },

                input: function (elem) {
                    return rinputs.test(elem.nodeName);
                },

                button: function (elem) {
                    var name = elem.nodeName.toLowerCase();
                    return (name === "input" && elem.type === "button") || name === "button";
                },

                text: function (elem) {
                    var attr;
                    return (
                        elem.nodeName.toLowerCase() === "input" &&
                        elem.type === "text" &&
                        // Support: IE<8
                        // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
                        ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text")
                    );
                },

                // Position-in-collection
                first: createPositionalPseudo(function () {
                    return [0];
                }),

                last: createPositionalPseudo(function (matchIndexes, length) {
                    return [length - 1];
                }),

                eq: createPositionalPseudo(function (matchIndexes, length, argument) {
                    return [argument < 0 ? argument + length : argument];
                }),

                even: createPositionalPseudo(function (matchIndexes, length) {
                    var i = 0;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                odd: createPositionalPseudo(function (matchIndexes, length) {
                    var i = 1;
                    for (; i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                lt: createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; --i >= 0; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),

                gt: createPositionalPseudo(function (matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (; ++i < length; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
            },
        };

        Expr.pseudos["nth"] = Expr.pseudos["eq"];

        // Add button/input type pseudos
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }

        // Easy API for creating new setFilters
        function setFilters() {}

        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();

        tokenize = Sizzle.tokenize = function (selector, parseOnly) {
            var matched,
                match,
                tokens,
                type,
                soFar,
                groups,
                preFilters,
                cached = tokenCache[selector + " "];

            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }

            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;

            while (soFar) {
                // Comma and first run
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        // Don't consume trailing commas as valid
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push((tokens = []));
                }

                matched = false;

                // Combinators
                if ((match = rcombinators.exec(soFar))) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        // Cast descendant combinators to space
                        type: match[0].replace(rtrim, " "),
                    });
                    soFar = soFar.slice(matched.length);
                }

                // Filters
                for (type in Expr.filter) {
                    if (
                        (match = matchExpr[type].exec(soFar)) &&
                        (!preFilters[type] || (match = preFilters[type](match)))
                    ) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match,
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }

                if (!matched) {
                    break;
                }
            }

            // Return the length of the invalid excess
            // if we're just parsing
            // Otherwise, throw an error or return tokens
            return parseOnly
                ? soFar.length
                : soFar
                ? Sizzle.error(selector)
                : // Cache the tokens
                  tokenCache(selector, groups).slice(0);
        };

        function toSelector(tokens) {
            var i = 0,
                len = tokens.length,
                selector = "";
            for (; i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }

        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir,
                skip = combinator.next,
                key = skip || dir,
                checkNonElements = base && key === "parentNode",
                doneName = done++;

            return combinator.first
                ? // Check against closest ancestor/preceding element
                  function (elem, context, xml) {
                      while ((elem = elem[dir])) {
                          if (elem.nodeType === 1 || checkNonElements) {
                              return matcher(elem, context, xml);
                          }
                      }
                      return false;
                  }
                : // Check against all ancestor/preceding elements
                  function (elem, context, xml) {
                      var oldCache,
                          uniqueCache,
                          outerCache,
                          newCache = [dirruns, doneName];

                      // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
                      if (xml) {
                          while ((elem = elem[dir])) {
                              if (elem.nodeType === 1 || checkNonElements) {
                                  if (matcher(elem, context, xml)) {
                                      return true;
                                  }
                              }
                          }
                      } else {
                          while ((elem = elem[dir])) {
                              if (elem.nodeType === 1 || checkNonElements) {
                                  outerCache = elem[expando] || (elem[expando] = {});

                                  // Support: IE <9 only
                                  // Defend against cloned attroperties (jQuery gh-1709)
                                  uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

                                  if (skip && skip === elem.nodeName.toLowerCase()) {
                                      elem = elem[dir] || elem;
                                  } else if (
                                      (oldCache = uniqueCache[key]) &&
                                      oldCache[0] === dirruns &&
                                      oldCache[1] === doneName
                                  ) {
                                      // Assign to newCache so results back-propagate to previous elements
                                      return (newCache[2] = oldCache[2]);
                                  } else {
                                      // Reuse newcache so results back-propagate to previous elements
                                      uniqueCache[key] = newCache;

                                      // A match means we're done; a fail means we have to keep checking
                                      if ((newCache[2] = matcher(elem, context, xml))) {
                                          return true;
                                      }
                                  }
                              }
                          }
                      }
                      return false;
                  };
        }

        function elementMatcher(matchers) {
            return matchers.length > 1
                ? function (elem, context, xml) {
                      var i = matchers.length;
                      while (i--) {
                          if (!matchers[i](elem, context, xml)) {
                              return false;
                          }
                      }
                      return true;
                  }
                : matchers[0];
        }

        function multipleContexts(selector, contexts, results) {
            var i = 0,
                len = contexts.length;
            for (; i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }

        function condense(unmatched, map, filter, context, xml) {
            var elem,
                newUnmatched = [],
                i = 0,
                len = unmatched.length,
                mapped = map != null;

            for (; i < len; i++) {
                if ((elem = unmatched[i])) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }

            return newUnmatched;
        }

        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function (seed, results, context, xml) {
                var temp,
                    i,
                    elem,
                    preMap = [],
                    postMap = [],
                    preexisting = results.length,
                    // Get initial elements from seed or context
                    elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),
                    // Prefilter to get matcher input, preserving a map for seed-results synchronization
                    matcherIn =
                        preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
                    matcherOut = matcher
                        ? // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                          postFinder || (seed ? preFilter : preexisting || postFilter)
                            ? // ...intermediate processing is necessary
                              []
                            : // ...otherwise use results directly
                              results
                        : matcherIn;

                // Find primary matches
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }

                // Apply postFilter
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);

                    // Un-match failing elements by moving them back to matcherIn
                    i = temp.length;
                    while (i--) {
                        if ((elem = temp[i])) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }

                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if ((elem = matcherOut[i])) {
                                    // Restore matcherIn since elem is not yet a final match
                                    temp.push((matcherIn[i] = elem));
                                }
                            }
                            postFinder(null, (matcherOut = []), temp, xml);
                        }

                        // Move matched elements from seed to results to keep them synchronized
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }

                    // Add elements to results, through postFinder if defined
                } else {
                    matcherOut = condense(
                        matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                    );
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }

        function matcherFromTokens(tokens) {
            var checkContext,
                matcher,
                j,
                len = tokens.length,
                leadingRelative = Expr.relative[tokens[0].type],
                implicitRelative = leadingRelative || Expr.relative[" "],
                i = leadingRelative ? 1 : 0,
                // The foundational matcher ensures that elements are reachable from top-level context(s)
                matchContext = addCombinator(
                    function (elem) {
                        return elem === checkContext;
                    },
                    implicitRelative,
                    true
                ),
                matchAnyContext = addCombinator(
                    function (elem) {
                        return indexOf(checkContext, elem) > -1;
                    },
                    implicitRelative,
                    true
                ),
                matchers = [
                    function (elem, context, xml) {
                        var ret =
                            (!leadingRelative && (xml || context !== outermostContext)) ||
                            ((checkContext = context).nodeType
                                ? matchContext(elem, context, xml)
                                : matchAnyContext(elem, context, xml));
                        // Avoid hanging onto element (issue #299)
                        checkContext = null;
                        return ret;
                    },
                ];

            for (; i < len; i++) {
                if ((matcher = Expr.relative[tokens[i].type])) {
                    matchers = [addCombinator(elementMatcher(matchers), matcher)];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

                    // Return special upon seeing a positional matcher
                    if (matcher[expando]) {
                        // Find the next relative operator (if any) for proper handling
                        j = ++i;
                        for (; j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(
                            i > 1 && elementMatcher(matchers),
                            i > 1 &&
                                toSelector(
                                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                                    tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
                                ).replace(rtrim, "$1"),
                            matcher,
                            i < j && matcherFromTokens(tokens.slice(i, j)),
                            j < len && matcherFromTokens((tokens = tokens.slice(j))),
                            j < len && toSelector(tokens)
                        );
                    }
                    matchers.push(matcher);
                }
            }

            return elementMatcher(matchers);
        }

        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0,
                byElement = elementMatchers.length > 0,
                superMatcher = function (seed, context, xml, results, outermost) {
                    var elem,
                        j,
                        matcher,
                        matchedCount = 0,
                        i = "0",
                        unmatched = seed && [],
                        setMatched = [],
                        contextBackup = outermostContext,
                        // We must always have either seed elements or outermost context
                        elems = seed || (byElement && Expr.find["TAG"]("*", outermost)),
                        // Use integer dirruns iff this is the outermost matcher
                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
                        len = elems.length;

                    if (outermost) {
                        outermostContext = context === document || context || outermost;
                    }

                    // Add elements passing elementMatchers directly to results
                    // Support: IE<9, Safari
                    // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
                    for (; i !== len && (elem = elems[i]) != null; i++) {
                        if (byElement && elem) {
                            j = 0;
                            if (!context && elem.ownerDocument !== document) {
                                setDocument(elem);
                                xml = !documentIsHTML;
                            }
                            while ((matcher = elementMatchers[j++])) {
                                if (matcher(elem, context || document, xml)) {
                                    results.push(elem);
                                    break;
                                }
                            }
                            if (outermost) {
                                dirruns = dirrunsUnique;
                            }
                        }

                        // Track unmatched elements for set filters
                        if (bySet) {
                            // They will have gone through all possible matchers
                            if ((elem = !matcher && elem)) {
                                matchedCount--;
                            }

                            // Lengthen the array for every element, matched or not
                            if (seed) {
                                unmatched.push(elem);
                            }
                        }
                    }

                    // `i` is now the count of elements visited above, and adding it to `matchedCount`
                    // makes the latter nonnegative.
                    matchedCount += i;

                    // Apply set filters to unmatched elements
                    // NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
                    // equals `i`), unless we didn't visit _any_ elements in the above loop because we have
                    // no element matchers and no seed.
                    // Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
                    // case, which will result in a "00" `matchedCount` that differs from `i` but is also
                    // numerically zero.
                    if (bySet && i !== matchedCount) {
                        j = 0;
                        while ((matcher = setMatchers[j++])) {
                            matcher(unmatched, setMatched, context, xml);
                        }

                        if (seed) {
                            // Reintegrate element matches to eliminate the need for sorting
                            if (matchedCount > 0) {
                                while (i--) {
                                    if (!(unmatched[i] || setMatched[i])) {
                                        setMatched[i] = pop.call(results);
                                    }
                                }
                            }

                            // Discard index placeholder values to get only actual matches
                            setMatched = condense(setMatched);
                        }

                        // Add matches to results
                        push.apply(results, setMatched);

                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
                        if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                            Sizzle.uniqueSort(results);
                        }
                    }

                    // Override manipulation of globals by nested matchers
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        outermostContext = contextBackup;
                    }

                    return unmatched;
                };

            return bySet ? markFunction(superMatcher) : superMatcher;
        }

        compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
            var i,
                setMatchers = [],
                elementMatchers = [],
                cached = compilerCache[selector + " "];

            if (!cached) {
                // Generate a function of recursive functions that can be used to check each element
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }

                // Cache the compiled function
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

                // Save selector and tokenization
                cached.selector = selector;
            }
            return cached;
        };

        /**
         * A low-level selection function that works with Sizzle's compiled
         *  selector functions
         * @param {String|Function} selector A selector or a pre-compiled
         *  selector function built with Sizzle.compile
         * @param {Element} context
         * @param {Array} [results]
         * @param {Array} [seed] A set of elements to match against
         */
        select = Sizzle.select = function (selector, context, results, seed) {
            var i,
                tokens,
                token,
                type,
                find,
                compiled = typeof selector === "function" && selector,
                match = !seed && tokenize((selector = compiled.selector || selector));

            results = results || [];

            // Try to minimize operations if there is only one selector in the list and no seed
            // (the latter of which guarantees us context)
            if (match.length === 1) {
                // Reduce context if the leading compound selector is an ID
                tokens = match[0] = match[0].slice(0);
                if (
                    tokens.length > 2 &&
                    (token = tokens[0]).type === "ID" &&
                    context.nodeType === 9 &&
                    documentIsHTML &&
                    Expr.relative[tokens[1].type]
                ) {
                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;

                        // Precompiled matchers will still verify ancestry, so step up a level
                    } else if (compiled) {
                        context = context.parentNode;
                    }

                    selector = selector.slice(tokens.shift().value.length);
                }

                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];

                    // Abort if we hit a combinator
                    if (Expr.relative[(type = token.type)]) {
                        break;
                    }
                    if ((find = Expr.find[type])) {
                        // Search, expanding context for leading sibling combinators
                        if (
                            (seed = find(
                                token.matches[0].replace(runescape, funescape),
                                (rsibling.test(tokens[0].type) && testContext(context.parentNode)) || context
                            ))
                        ) {
                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }

                            break;
                        }
                    }
                }
            }

            // Compile and execute a filtering function if one is not provided
            // Provide `match` to avoid retokenization if we modified the selector above
            (compiled || compile(selector, match))(
                seed,
                context,
                !documentIsHTML,
                results,
                !context || (rsibling.test(selector) && testContext(context.parentNode)) || context
            );
            return results;
        };

        // One-time assignments

        // Sort stability
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

        // Support: Chrome 14-35+
        // Always assume duplicates if they aren't passed to the comparison function
        support.detectDuplicates = !!hasDuplicate;

        // Initialize against the default document
        setDocument();

        // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
        // Detached nodes confoundingly follow *each other*
        support.sortDetached = assert(function (el) {
            // Should return 1, but returns 4 (following)
            return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
        });

        // Support: IE<8
        // Prevent attribute/property "interpolation"
        // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        if (
            !assert(function (el) {
                el.innerHTML = "<a href='#'></a>";
                return el.firstChild.getAttribute("href") === "#";
            })
        ) {
            addHandle("type|href|height|width", function (elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }

        // Support: IE<9
        // Use defaultValue in place of getAttribute("value")
        if (
            !support.attributes ||
            !assert(function (el) {
                el.innerHTML = "<input/>";
                el.firstChild.setAttribute("value", "");
                return el.firstChild.getAttribute("value") === "";
            })
        ) {
            addHandle("value", function (elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }

        // Support: IE<9
        // Use getAttributeNode to fetch booleans when getAttribute lies
        if (
            !assert(function (el) {
                return el.getAttribute("disabled") == null;
            })
        ) {
            addHandle(booleans, function (elem, name, isXML) {
                var val;
                if (!isXML) {
                    return elem[name] === true
                        ? name.toLowerCase()
                        : (val = elem.getAttributeNode(name)) && val.specified
                        ? val.value
                        : null;
                }
            });
        }

        return Sizzle;
    })(window);

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;

var dir = function (elem, dir, until) {
    var matched = [],
        truncate = until !== undefined;

    while ((elem = elem[dir]) && elem.nodeType !== 9) {
        if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
                break;
            }
            matched.push(elem);
        }
    }
    return matched;
};

var siblings = function (n, elem) {
    var matched = [];

    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
            matched.push(n);
        }
    }

    return matched;
};

var rneedsContext = jQuery.expr.match.needsContext;

function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
}
var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

// Implement the identical functionality for filter and not
function winnow(elements, qualifier, not) {
    if (isFunction(qualifier)) {
        return jQuery.grep(elements, function (elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
        });
    }

    // Single element
    if (qualifier.nodeType) {
        return jQuery.grep(elements, function (elem) {
            return (elem === qualifier) !== not;
        });
    }

    // Arraylike of elements (jQuery, arguments, Array)
    if (typeof qualifier !== "string") {
        return jQuery.grep(elements, function (elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
        });
    }

    // Filtered directly for both simple and complex selectors
    return jQuery.filter(qualifier, elements, not);
}

jQuery.filter = function (expr, elems, not) {
    var elem = elems[0];

    if (not) {
        expr = ":not(" + expr + ")";
    }

    if (elems.length === 1 && elem.nodeType === 1) {
        return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
    }

    return jQuery.find.matches(
        expr,
        jQuery.grep(elems, function (elem) {
            return elem.nodeType === 1;
        })
    );
};

jQuery.fn.extend({
    find: function (selector) {
        var i,
            ret,
            len = this.length,
            self = this;

        if (typeof selector !== "string") {
            return this.pushStack(
                jQuery(selector).filter(function () {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                })
            );
        }

        ret = this.pushStack([]);

        for (i = 0; i < len; i++) {
            jQuery.find(selector, self[i], ret);
        }

        return len > 1 ? jQuery.uniqueSort(ret) : ret;
    },
    filter: function (selector) {
        return this.pushStack(winnow(this, selector || [], false));
    },
    not: function (selector) {
        return this.pushStack(winnow(this, selector || [], true));
    },
    is: function (selector) {
        return !!winnow(
            this,

            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
        ).length;
    },
});

// Initialize a jQuery object

// A central reference to the root jQuery(document)
var rootjQuery,
    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    // Shortcut simple #id case for speed
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    init = (jQuery.fn.init = function (selector, context, root) {
        var match, elem;

        // HANDLE: $(""), $(null), $(undefined), $(false)
        if (!selector) {
            return this;
        }

        // Method init() accepts an alternate rootjQuery
        // so migrate can support jQuery.sub (gh-2101)
        root = root || rootjQuery;

        // Handle HTML strings
        if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [null, selector, null];
            } else {
                match = rquickExpr.exec(selector);
            }

            // Match html or make sure no context is specified for #id
            if (match && (match[1] || !context)) {
                // HANDLE: $(html) -> $(array)
                if (match[1]) {
                    context = context instanceof jQuery ? context[0] : context;

                    // Option to run scripts is true for back-compat
                    // Intentionally let the error be thrown if parseHTML is not present
                    jQuery.merge(
                        this,
                        jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        )
                    );

                    // HANDLE: $(html, props)
                    if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                        for (match in context) {
                            // Properties of context are called as methods if possible
                            if (isFunction(this[match])) {
                                this[match](context[match]);

                                // ...and otherwise set as attributes
                            } else {
                                this.attr(match, context[match]);
                            }
                        }
                    }

                    return this;

                    // HANDLE: $(#id)
                } else {
                    elem = document.getElementById(match[2]);

                    if (elem) {
                        // Inject the element directly into the jQuery object
                        this[0] = elem;
                        this.length = 1;
                    }
                    return this;
                }

                // HANDLE: $(expr, $(...))
            } else if (!context || context.jquery) {
                return (context || root).find(selector);

                // HANDLE: $(expr, context)
                // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor(context).find(selector);
            }

            // HANDLE: $(DOMElement)
        } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;

            // HANDLE: $(function)
            // Shortcut for document ready
        } else if (isFunction(selector)) {
            return root.ready !== undefined
                ? root.ready(selector)
                : // Execute immediately if ready is not present
                  selector(jQuery);
        }

        return jQuery.makeArray(selector, this);
    });

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery(document);

var rparentsprev = /^(?:parents|prev(?:Until|All))/,
    // Methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true,
    };

jQuery.fn.extend({
    has: function (target) {
        var targets = jQuery(target, this),
            l = targets.length;

        return this.filter(function () {
            var i = 0;
            for (; i < l; i++) {
                if (jQuery.contains(this, targets[i])) {
                    return true;
                }
            }
        });
    },

    closest: function (selectors, context) {
        var cur,
            i = 0,
            l = this.length,
            matched = [],
            targets = typeof selectors !== "string" && jQuery(selectors);

        // Positional selectors never match, since there's no _selection_ context
        if (!rneedsContext.test(selectors)) {
            for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                    // Always skip document fragments
                    if (
                        cur.nodeType < 11 &&
                        (targets
                            ? targets.index(cur) > -1
                            : // Don't pass non-elements to Sizzle
                              cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))
                    ) {
                        matched.push(cur);
                        break;
                    }
                }
            }
        }

        return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
    },

    // Determine the position of an element within the set
    index: function (elem) {
        // No argument, return index in parent
        if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        }

        // Index in selector
        if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
        }

        // Locate the position of the desired element
        return indexOf.call(
            this,

            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
        );
    },

    add: function (selector, context) {
        return this.pushStack(jQuery.uniqueSort(jQuery.merge(this.get(), jQuery(selector, context))));
    },

    addBack: function (selector) {
        return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
    },
});

function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}
    return cur;
}

jQuery.each(
    {
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return dir(elem, "parentNode");
        },
        parentsUntil: function (elem, i, until) {
            return dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function (elem) {
            return siblings(elem.firstChild);
        },
        contents: function (elem) {
            if (nodeName(elem, "iframe")) {
                return elem.contentDocument;
            }

            // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
            // Treat the template element as a regular one in browsers that
            // don't support it.
            if (nodeName(elem, "template")) {
                elem = elem.content || elem;
            }

            return jQuery.merge([], elem.childNodes);
        },
    },
    function (name, fn) {
        jQuery.fn[name] = function (until, selector) {
            var matched = jQuery.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                matched = jQuery.filter(selector, matched);
            }

            if (this.length > 1) {
                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    jQuery.uniqueSort(matched);
                }

                // Reverse order for parents* and prev-derivatives
                if (rparentsprev.test(name)) {
                    matched.reverse();
                }
            }

            return this.pushStack(matched);
        };
    }
);
var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

// Convert String-formatted options into Object-formatted ones
function createOptions(options) {
    var object = {};
    jQuery.each(options.match(rnothtmlwhite) || [], function (_, flag) {
        object[flag] = true;
    });
    return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function (options) {
    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);

    var // Flag to know if list is currently firing
        firing,
        // Last fire value for non-forgettable lists
        memory,
        // Flag to know if list was already fired
        fired,
        // Flag to prevent firing
        locked,
        // Actual callback list
        list = [],
        // Queue of execution data for repeatable lists
        queue = [],
        // Index of currently firing callback (modified by add/remove as needed)
        firingIndex = -1,
        // Fire callbacks
        fire = function () {
            // Enforce single-firing
            locked = locked || options.once;

            // Execute callbacks for all pending executions,
            // respecting firingIndex overrides and runtime changes
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
                memory = queue.shift();
                while (++firingIndex < list.length) {
                    // Run callback and check for early termination
                    if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                        // Jump to end and forget the data so .add doesn't re-fire
                        firingIndex = list.length;
                        memory = false;
                    }
                }
            }

            // Forget the data if we're done with it
            if (!options.memory) {
                memory = false;
            }

            firing = false;

            // Clean up if we're done firing for good
            if (locked) {
                // Keep an empty list if we have data for future add calls
                if (memory) {
                    list = [];

                    // Otherwise, this object is spent
                } else {
                    list = "";
                }
            }
        },
        // Actual Callbacks object
        self = {
            // Add a callback or a collection of callbacks to the list
            add: function () {
                if (list) {
                    // If we have memory from a past run, we should fire after adding
                    if (memory && !firing) {
                        firingIndex = list.length - 1;
                        queue.push(memory);
                    }

                    (function add(args) {
                        jQuery.each(args, function (_, arg) {
                            if (isFunction(arg)) {
                                if (!options.unique || !self.has(arg)) {
                                    list.push(arg);
                                }
                            } else if (arg && arg.length && toType(arg) !== "string") {
                                // Inspect recursively
                                add(arg);
                            }
                        });
                    })(arguments);

                    if (memory && !firing) {
                        fire();
                    }
                }
                return this;
            },

            // Remove a callback from the list
            remove: function () {
                jQuery.each(arguments, function (_, arg) {
                    var index;
                    while ((index = jQuery.inArray(arg, list, index)) > -1) {
                        list.splice(index, 1);

                        // Handle firing indexes
                        if (index <= firingIndex) {
                            firingIndex--;
                        }
                    }
                });
                return this;
            },

            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function (fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
            },

            // Remove all callbacks from the list
            empty: function () {
                if (list) {
                    list = [];
                }
                return this;
            },

            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function () {
                locked = queue = [];
                list = memory = "";
                return this;
            },
            disabled: function () {
                return !list;
            },

            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function () {
                locked = queue = [];
                if (!memory && !firing) {
                    list = memory = "";
                }
                return this;
            },
            locked: function () {
                return !!locked;
            },

            // Call all callbacks with the given context and arguments
            fireWith: function (context, args) {
                if (!locked) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    queue.push(args);
                    if (!firing) {
                        fire();
                    }
                }
                return this;
            },

            // Call all the callbacks with the given arguments
            fire: function () {
                self.fireWith(this, arguments);
                return this;
            },

            // To know if the callbacks have already been called at least once
            fired: function () {
                return !!fired;
            },
        };

    return self;
};

function Identity(v) {
    return v;
}

function Thrower(ex) {
    throw ex;
}

function adoptValue(value, resolve, reject, noValue) {
    var method;

    try {
        // Check for promise aspect first to privilege synchronous behavior
        if (value && isFunction((method = value.promise))) {
            method.call(value).done(resolve).fail(reject);

            // Other thenables
        } else if (value && isFunction((method = value.then))) {
            method.call(value, resolve, reject);

            // Other non-thenables
        } else {
            // Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
            // * false: [ value ].slice( 0 ) => resolve( value )
            // * true: [ value ].slice( 1 ) => resolve()
            resolve.apply(undefined, [value].slice(noValue));
        }

        // For Promises/A+, convert exceptions into rejections
        // Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
        // Deferred#then to conditionally suppress rejection.
    } catch (value) {
        // Support: Android 4.0 only
        // Strict mode functions invoked without .call/.apply get global-object context
        reject.apply(undefined, [value]);
    }
}

jQuery.extend({
    Deferred: function (func) {
        var tuples = [
                // action, add listener, callbacks,
                // ... .then handlers, argument index, [final state]
                ["notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory"), 2],
                ["resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 0, "resolved"],
                ["reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), 1, "rejected"],
            ],
            state = "pending",
            promise = {
                state: function () {
                    return state;
                },
                always: function () {
                    deferred.done(arguments).fail(arguments);
                    return this;
                },
                catch: function (fn) {
                    return promise.then(null, fn);
                },

                // Keep pipe for back-compat
                pipe: function (/* fnDone, fnFail, fnProgress */) {
                    var fns = arguments;

                    return jQuery
                        .Deferred(function (newDefer) {
                            jQuery.each(tuples, function (i, tuple) {
                                // Map tuples (progress, done, fail) to arguments (done, fail, progress)
                                var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];

                                // deferred.progress(function() { bind to newDefer or newDefer.notify })
                                // deferred.done(function() { bind to newDefer or newDefer.resolve })
                                // deferred.fail(function() { bind to newDefer or newDefer.reject })
                                deferred[tuple[1]](function () {
                                    var returned = fn && fn.apply(this, arguments);
                                    if (returned && isFunction(returned.promise)) {
                                        returned
                                            .promise()
                                            .progress(newDefer.notify)
                                            .done(newDefer.resolve)
                                            .fail(newDefer.reject);
                                    } else {
                                        newDefer[tuple[0] + "With"](this, fn ? [returned] : arguments);
                                    }
                                });
                            });
                            fns = null;
                        })
                        .promise();
                },
                then: function (onFulfilled, onRejected, onProgress) {
                    var maxDepth = 0;

                    function resolve(depth, deferred, handler, special) {
                        return function () {
                            var that = this,
                                args = arguments,
                                mightThrow = function () {
                                    var returned, then;

                                    // Support: Promises/A+ section 2.3.3.3.3
                                    // https://promisesaplus.com/#point-59
                                    // Ignore double-resolution attempts
                                    if (depth < maxDepth) {
                                        return;
                                    }

                                    returned = handler.apply(that, args);

                                    // Support: Promises/A+ section 2.3.1
                                    // https://promisesaplus.com/#point-48
                                    if (returned === deferred.promise()) {
                                        throw new TypeError("Thenable self-resolution");
                                    }

                                    // Support: Promises/A+ sections 2.3.3.1, 3.5
                                    // https://promisesaplus.com/#point-54
                                    // https://promisesaplus.com/#point-75
                                    // Retrieve `then` only once
                                    then =
                                        returned &&
                                        // Support: Promises/A+ section 2.3.4
                                        // https://promisesaplus.com/#point-64
                                        // Only check objects and functions for thenability
                                        (typeof returned === "object" || typeof returned === "function") &&
                                        returned.then;

                                    // Handle a returned thenable
                                    if (isFunction(then)) {
                                        // Special processors (notify) just wait for resolution
                                        if (special) {
                                            then.call(
                                                returned,
                                                resolve(maxDepth, deferred, Identity, special),
                                                resolve(maxDepth, deferred, Thrower, special)
                                            );

                                            // Normal processors (resolve) also hook into progress
                                        } else {
                                            // ...and disregard older resolution values
                                            maxDepth++;

                                            then.call(
                                                returned,
                                                resolve(maxDepth, deferred, Identity, special),
                                                resolve(maxDepth, deferred, Thrower, special),
                                                resolve(maxDepth, deferred, Identity, deferred.notifyWith)
                                            );
                                        }

                                        // Handle all other returned values
                                    } else {
                                        // Only substitute handlers pass on context
                                        // and multiple values (non-spec behavior)
                                        if (handler !== Identity) {
                                            that = undefined;
                                            args = [returned];
                                        }

                                        // Process the value(s)
                                        // Default process is resolve
                                        (special || deferred.resolveWith)(that, args);
                                    }
                                },
                                // Only normal processors (resolve) catch and reject exceptions
                                process = special
                                    ? mightThrow
                                    : function () {
                                          try {
                                              mightThrow();
                                          } catch (e) {
                                              if (jQuery.Deferred.exceptionHook) {
                                                  jQuery.Deferred.exceptionHook(e, process.stackTrace);
                                              }

                                              // Support: Promises/A+ section 2.3.3.3.4.1
                                              // https://promisesaplus.com/#point-61
                                              // Ignore post-resolution exceptions
                                              if (depth + 1 >= maxDepth) {
                                                  // Only substitute handlers pass on context
                                                  // and multiple values (non-spec behavior)
                                                  if (handler !== Thrower) {
                                                      that = undefined;
                                                      args = [e];
                                                  }

                                                  deferred.rejectWith(that, args);
                                              }
                                          }
                                      };

                            // Support: Promises/A+ section 2.3.3.3.1
                            // https://promisesaplus.com/#point-57
                            // Re-resolve promises immediately to dodge false rejection from
                            // subsequent errors
                            if (depth) {
                                process();
                            } else {
                                // Call an optional hook to record the stack, in case of exception
                                // since it's otherwise lost when execution goes async
                                if (jQuery.Deferred.getStackHook) {
                                    process.stackTrace = jQuery.Deferred.getStackHook();
                                }
                                window.setTimeout(process);
                            }
                        };
                    }

                    return jQuery
                        .Deferred(function (newDefer) {
                            // progress_handlers.add( ... )
                            tuples[0][3].add(
                                resolve(
                                    0,
                                    newDefer,
                                    isFunction(onProgress) ? onProgress : Identity,
                                    newDefer.notifyWith
                                )
                            );

                            // fulfilled_handlers.add( ... )
                            tuples[1][3].add(resolve(0, newDefer, isFunction(onFulfilled) ? onFulfilled : Identity));

                            // rejected_handlers.add( ... )
                            tuples[2][3].add(resolve(0, newDefer, isFunction(onRejected) ? onRejected : Thrower));
                        })
                        .promise();
                },

                // Get a promise for this deferred
                // If obj is provided, the promise aspect is added to the object
                promise: function (obj) {
                    return obj != null ? jQuery.extend(obj, promise) : promise;
                },
            },
            deferred = {};

        // Add list-specific methods
        jQuery.each(tuples, function (i, tuple) {
            var list = tuple[2],
                stateString = tuple[5];

            // promise.progress = list.add
            // promise.done = list.add
            // promise.fail = list.add
            promise[tuple[1]] = list.add;

            // Handle state
            if (stateString) {
                list.add(
                    function () {
                        // state = "resolved" (i.e., fulfilled)
                        // state = "rejected"
                        state = stateString;
                    },

                    // rejected_callbacks.disable
                    // fulfilled_callbacks.disable
                    tuples[3 - i][2].disable,

                    // rejected_handlers.disable
                    // fulfilled_handlers.disable
                    tuples[3 - i][3].disable,

                    // progress_callbacks.lock
                    tuples[0][2].lock,

                    // progress_handlers.lock
                    tuples[0][3].lock
                );
            }

            // progress_handlers.fire
            // fulfilled_handlers.fire
            // rejected_handlers.fire
            list.add(tuple[3].fire);

            // deferred.notify = function() { deferred.notifyWith(...) }
            // deferred.resolve = function() { deferred.resolveWith(...) }
            // deferred.reject = function() { deferred.rejectWith(...) }
            deferred[tuple[0]] = function () {
                deferred[tuple[0] + "With"](this === deferred ? undefined : this, arguments);
                return this;
            };

            // deferred.notifyWith = list.fireWith
            // deferred.resolveWith = list.fireWith
            // deferred.rejectWith = list.fireWith
            deferred[tuple[0] + "With"] = list.fireWith;
        });

        // Make the deferred a promise
        promise.promise(deferred);

        // Call given func if any
        if (func) {
            func.call(deferred, deferred);
        }

        // All done!
        return deferred;
    },

    // Deferred helper
    when: function (singleValue) {
        var // count of uncompleted subordinates
            remaining = arguments.length,
            // count of unprocessed arguments
            i = remaining,
            // subordinate fulfillment data
            resolveContexts = Array(i),
            resolveValues = slice.call(arguments),
            // the master Deferred
            master = jQuery.Deferred(),
            // subordinate callback factory
            updateFunc = function (i) {
                return function (value) {
                    resolveContexts[i] = this;
                    resolveValues[i] = arguments.length > 1 ? slice.call(arguments) : value;
                    if (!--remaining) {
                        master.resolveWith(resolveContexts, resolveValues);
                    }
                };
            };

        // Single- and empty arguments are adopted like Promise.resolve
        if (remaining <= 1) {
            adoptValue(singleValue, master.done(updateFunc(i)).resolve, master.reject, !remaining);

            // Use .then() to unwrap secondary thenables (cf. gh-3000)
            if (master.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
                return master.then();
            }
        }

        // Multiple arguments are aggregated like Promise.all array elements
        while (i--) {
            adoptValue(resolveValues[i], updateFunc(i), master.reject);
        }

        return master.promise();
    },
});

// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function (error, stack) {
    // Support: IE 8 - 9 only
    // Console exists when dev tools are open, which can happen at any time
    if (window.console && window.console.warn && error && rerrorNames.test(error.name)) {
        window.console.warn("jQuery.Deferred exception: " + error.message, error.stack, stack);
    }
};

jQuery.readyException = function (error) {
    window.setTimeout(function () {
        throw error;
    });
};

// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function (fn) {
    readyList
        .then(fn)

        // Wrap jQuery.readyException in a function so that the lookup
        // happens at the time of error handling instead of callback
        // registration.
        .catch(function (error) {
            jQuery.readyException(error);
        });

    return this;
};

jQuery.extend({
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Handle when the DOM is ready
    ready: function (wait) {
        // Abort if there are pending holds or we're already ready
        if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
        }

        // Remember that the DOM is ready
        jQuery.isReady = true;

        // If a normal DOM Ready event fired, decrement, and wait if need be
        if (wait !== true && --jQuery.readyWait > 0) {
            return;
        }

        // If there are functions bound, to execute
        readyList.resolveWith(document, [jQuery]);
    },
});

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
    document.removeEventListener("DOMContentLoaded", completed);
    window.removeEventListener("load", completed);
    jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    // Handle it asynchronously to allow scripts the opportunity to delay ready
    window.setTimeout(jQuery.ready);
} else {
    // Use the handy event callback
    document.addEventListener("DOMContentLoaded", completed);

    // A fallback to window.onload, that will always work
    window.addEventListener("load", completed);
}

// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
    var i = 0,
        len = elems.length,
        bulk = key == null;

    // Sets many values
    if (toType(key) === "object") {
        chainable = true;
        for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
        }

        // Sets one value
    } else if (value !== undefined) {
        chainable = true;

        if (!isFunction(value)) {
            raw = true;
        }

        if (bulk) {
            // Bulk operations run against the entire set
            if (raw) {
                fn.call(elems, value);
                fn = null;

                // ...except when executing function values
            } else {
                bulk = fn;
                fn = function (elem, key, value) {
                    return bulk.call(jQuery(elem), value);
                };
            }
        }

        if (fn) {
            for (; i < len; i++) {
                fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
        }
    }

    if (chainable) {
        return elems;
    }

    // Gets
    if (bulk) {
        return fn.call(elems);
    }

    return len ? fn(elems[0], key) : emptyGet;
};

// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
    rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase(all, letter) {
    return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase(string) {
    return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
}

var acceptData = function (owner) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
};

function Data() {
    this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {
    cache: function (owner) {
        // Check if the owner object already has a cache
        var value = owner[this.expando];

        // If not, create one
        if (!value) {
            value = {};

            // We can accept data for non-element nodes in modern browsers,
            // but we should not, see #8335.
            // Always return an empty object.
            if (acceptData(owner)) {
                // If it is a node unlikely to be stringify-ed or looped over
                // use plain assignment
                if (owner.nodeType) {
                    owner[this.expando] = value;

                    // Otherwise secure it in a non-enumerable property
                    // configurable must be true to allow the property to be
                    // deleted when data is removed
                } else {
                    Object.defineProperty(owner, this.expando, {
                        value: value,
                        configurable: true,
                    });
                }
            }
        }

        return value;
    },
    set: function (owner, data, value) {
        var prop,
            cache = this.cache(owner);

        // Handle: [ owner, key, value ] args
        // Always use camelCase key (gh-2257)
        if (typeof data === "string") {
            cache[camelCase(data)] = value;

            // Handle: [ owner, { properties } ] args
        } else {
            // Copy the properties one-by-one to the cache object
            for (prop in data) {
                cache[camelCase(prop)] = data[prop];
            }
        }
        return cache;
    },
    get: function (owner, key) {
        return key === undefined
            ? this.cache(owner)
            : // Always use camelCase key (gh-2257)
              owner[this.expando] && owner[this.expando][camelCase(key)];
    },
    access: function (owner, key, value) {
        // In cases where either:
        //
        //   1. No key was specified
        //   2. A string key was specified, but no value provided
        //
        // Take the "read" path and allow the get method to determine
        // which value to return, respectively either:
        //
        //   1. The entire cache object
        //   2. The data stored at the key
        //
        if (key === undefined || (key && typeof key === "string" && value === undefined)) {
            return this.get(owner, key);
        }

        // When the key is not a string, or both a key and value
        // are specified, set or extend (existing objects) with either:
        //
        //   1. An object of properties
        //   2. A key and value
        //
        this.set(owner, key, value);

        // Since the "set" path can have two possible entry points
        // return the expected data based on which path was taken[*]
        return value !== undefined ? value : key;
    },
    remove: function (owner, key) {
        var i,
            cache = owner[this.expando];

        if (cache === undefined) {
            return;
        }

        if (key !== undefined) {
            // Support array or space separated string of keys
            if (Array.isArray(key)) {
                // If key is an array of keys...
                // We always set camelCase keys, so remove that.
                key = key.map(camelCase);
            } else {
                key = camelCase(key);

                // If a key with the spaces exists, use it.
                // Otherwise, create an array by matching non-whitespace
                key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }

            i = key.length;

            while (i--) {
                delete cache[key[i]];
            }
        }

        // Remove the expando if there's no more data
        if (key === undefined || jQuery.isEmptyObject(cache)) {
            // Support: Chrome <=35 - 45
            // Webkit & Blink performance suffers when deleting properties
            // from DOM nodes, so set to undefined instead
            // https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
            if (owner.nodeType) {
                owner[this.expando] = undefined;
            } else {
                delete owner[this.expando];
            }
        }
    },
    hasData: function (owner) {
        var cache = owner[this.expando];
        return cache !== undefined && !jQuery.isEmptyObject(cache);
    },
};
var dataPriv = new Data();

var dataUser = new Data();

//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    rmultiDash = /[A-Z]/g;

function getData(data) {
    if (data === "true") {
        return true;
    }

    if (data === "false") {
        return false;
    }

    if (data === "null") {
        return null;
    }

    // Only convert to a number if it doesn't change the string
    if (data === +data + "") {
        return +data;
    }

    if (rbrace.test(data)) {
        return JSON.parse(data);
    }

    return data;
}

function dataAttr(elem, key, data) {
    var name;

    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if (data === undefined && elem.nodeType === 1) {
        name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
        data = elem.getAttribute(name);

        if (typeof data === "string") {
            try {
                data = getData(data);
            } catch (e) {}

            // Make sure we set the data so it isn't changed later
            dataUser.set(elem, key, data);
        } else {
            data = undefined;
        }
    }
    return data;
}

jQuery.extend({
    hasData: function (elem) {
        return dataUser.hasData(elem) || dataPriv.hasData(elem);
    },

    data: function (elem, name, data) {
        return dataUser.access(elem, name, data);
    },

    removeData: function (elem, name) {
        dataUser.remove(elem, name);
    },

    // TODO: Now that all calls to _data and _removeData have been replaced
    // with direct calls to dataPriv methods, these can be deprecated.
    _data: function (elem, name, data) {
        return dataPriv.access(elem, name, data);
    },

    _removeData: function (elem, name) {
        dataPriv.remove(elem, name);
    },
});

jQuery.fn.extend({
    data: function (key, value) {
        var i,
            name,
            data,
            elem = this[0],
            attrs = elem && elem.attributes;

        // Gets all values
        if (key === undefined) {
            if (this.length) {
                data = dataUser.get(elem);

                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                    i = attrs.length;
                    while (i--) {
                        // Support: IE 11 only
                        // The attrs elements can be null (#14894)
                        if (attrs[i]) {
                            name = attrs[i].name;
                            if (name.indexOf("data-") === 0) {
                                name = camelCase(name.slice(5));
                                dataAttr(elem, name, data[name]);
                            }
                        }
                    }
                    dataPriv.set(elem, "hasDataAttrs", true);
                }
            }

            return data;
        }

        // Sets multiple values
        if (typeof key === "object") {
            return this.each(function () {
                dataUser.set(this, key);
            });
        }

        return access(
            this,
            function (value) {
                var data;

                // The calling jQuery object (element matches) is not empty
                // (and therefore has an element appears at this[ 0 ]) and the
                // `value` parameter was not undefined. An empty jQuery object
                // will result in `undefined` for elem = this[ 0 ] which will
                // throw an exception if an attempt to read a data cache is made.
                if (elem && value === undefined) {
                    // Attempt to get data from the cache
                    // The key will always be camelCased in Data
                    data = dataUser.get(elem, key);
                    if (data !== undefined) {
                        return data;
                    }

                    // Attempt to "discover" the data in
                    // HTML5 custom data-* attrs
                    data = dataAttr(elem, key);
                    if (data !== undefined) {
                        return data;
                    }

                    // We tried really hard, but the data doesn't exist.
                    return;
                }

                // Set the data...
                this.each(function () {
                    // We always store the camelCased key
                    dataUser.set(this, key, value);
                });
            },
            null,
            value,
            arguments.length > 1,
            null,
            true
        );
    },

    removeData: function (key) {
        return this.each(function () {
            dataUser.remove(this, key);
        });
    },
});

jQuery.extend({
    queue: function (elem, type, data) {
        var queue;

        if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);

            // Speed up dequeue by getting out quickly if this is just a lookup
            if (data) {
                if (!queue || Array.isArray(data)) {
                    queue = dataPriv.access(elem, type, jQuery.makeArray(data));
                } else {
                    queue.push(data);
                }
            }
            return queue || [];
        }
    },

    dequeue: function (elem, type) {
        type = type || "fx";

        var queue = jQuery.queue(elem, type),
            startLength = queue.length,
            fn = queue.shift(),
            hooks = jQuery._queueHooks(elem, type),
            next = function () {
                jQuery.dequeue(elem, type);
            };

        // If the fx queue is dequeued, always remove the progress sentinel
        if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
        }

        if (fn) {
            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if (type === "fx") {
                queue.unshift("inprogress");
            }

            // Clear up the last queue stop function
            delete hooks.stop;
            fn.call(elem, next, hooks);
        }

        if (!startLength && hooks) {
            hooks.empty.fire();
        }
    },

    // Not public - generate a queueHooks object, or return the current one
    _queueHooks: function (elem, type) {
        var key = type + "queueHooks";
        return (
            dataPriv.get(elem, key) ||
            dataPriv.access(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function () {
                    dataPriv.remove(elem, [type + "queue", key]);
                }),
            })
        );
    },
});

jQuery.fn.extend({
    queue: function (type, data) {
        var setter = 2;

        if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
        }

        if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
        }

        return data === undefined
            ? this
            : this.each(function () {
                  var queue = jQuery.queue(this, type, data);

                  // Ensure a hooks for this queue
                  jQuery._queueHooks(this, type);

                  if (type === "fx" && queue[0] !== "inprogress") {
                      jQuery.dequeue(this, type);
                  }
              });
    },
    dequeue: function (type) {
        return this.each(function () {
            jQuery.dequeue(this, type);
        });
    },
    clearQueue: function (type) {
        return this.queue(type || "fx", []);
    },

    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function (type, obj) {
        var tmp,
            count = 1,
            defer = jQuery.Deferred(),
            elements = this,
            i = this.length,
            resolve = function () {
                if (!--count) {
                    defer.resolveWith(elements, [elements]);
                }
            };

        if (typeof type !== "string") {
            obj = type;
            type = undefined;
        }
        type = type || "fx";

        while (i--) {
            tmp = dataPriv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
            }
        }
        resolve();
        return defer.promise(obj);
    },
});
var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");

var cssExpand = ["Top", "Right", "Bottom", "Left"];

var isHiddenWithinTree = function (elem, el) {
    // isHiddenWithinTree might be called from jQuery#filter function;
    // in that case, element will be second argument
    elem = el || elem;

    // Inline style trumps all
    return (
        elem.style.display === "none" ||
        (elem.style.display === "" &&
            // Otherwise, check computed style
            // Support: Firefox <=43 - 45
            // Disconnected elements can have computed display: none, so first confirm that elem is
            // in the document.
            jQuery.contains(elem.ownerDocument, elem) &&
            jQuery.css(elem, "display") === "none")
    );
};

var swap = function (elem, options, callback, args) {
    var ret,
        name,
        old = {};

    // Remember the old values, and insert the new ones
    for (name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
    }

    ret = callback.apply(elem, args || []);

    // Revert the old values
    for (name in options) {
        elem.style[name] = old[name];
    }

    return ret;
};

function adjustCSS(elem, prop, valueParts, tween) {
    var adjusted,
        scale,
        maxIterations = 20,
        currentValue = tween
            ? function () {
                  return tween.cur();
              }
            : function () {
                  return jQuery.css(elem, prop, "");
              },
        initial = currentValue(),
        unit = (valueParts && valueParts[3]) || (jQuery.cssNumber[prop] ? "" : "px"),
        // Starting value computation is required for potential unit mismatches
        initialInUnit = (jQuery.cssNumber[prop] || (unit !== "px" && +initial)) && rcssNum.exec(jQuery.css(elem, prop));

    if (initialInUnit && initialInUnit[3] !== unit) {
        // Support: Firefox <=54
        // Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
        initial = initial / 2;

        // Trust units reported by jQuery.css
        unit = unit || initialInUnit[3];

        // Iteratively approximate from a nonzero starting point
        initialInUnit = +initial || 1;

        while (maxIterations--) {
            // Evaluate and update our best guess (doubling guesses that zero out).
            // Finish if the scale equals or crosses 1 (making the old*new product non-positive).
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
        }

        initialInUnit = initialInUnit * 2;
        jQuery.style(elem, prop, initialInUnit + unit);

        // Make sure we update the tween properties later on
        valueParts = valueParts || [];
    }

    if (valueParts) {
        initialInUnit = +initialInUnit || +initial || 0;

        // Apply relative offset (+=/-=) if specified
        adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
        if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
        }
    }
    return adjusted;
}

var defaultDisplayMap = {};

function getDefaultDisplay(elem) {
    var temp,
        doc = elem.ownerDocument,
        nodeName = elem.nodeName,
        display = defaultDisplayMap[nodeName];

    if (display) {
        return display;
    }

    temp = doc.body.appendChild(doc.createElement(nodeName));
    display = jQuery.css(temp, "display");

    temp.parentNode.removeChild(temp);

    if (display === "none") {
        display = "block";
    }
    defaultDisplayMap[nodeName] = display;

    return display;
}

function showHide(elements, show) {
    var display,
        elem,
        values = [],
        index = 0,
        length = elements.length;

    // Determine new display value for elements that need to change
    for (; index < length; index++) {
        elem = elements[index];
        if (!elem.style) {
            continue;
        }

        display = elem.style.display;
        if (show) {
            // Since we force visibility upon cascade-hidden elements, an immediate (and slow)
            // check is required in this first loop unless we have a nonempty display value (either
            // inline or about-to-be-restored)
            if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                    elem.style.display = "";
                }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
            }
        } else {
            if (display !== "none") {
                values[index] = "none";

                // Remember what we're overwriting
                dataPriv.set(elem, "display", display);
            }
        }
    }

    // Set the display of the elements in a second loop to avoid constant reflow
    for (index = 0; index < length; index++) {
        if (values[index] != null) {
            elements[index].style.display = values[index];
        }
    }

    return elements;
}

jQuery.fn.extend({
    show: function () {
        return showHide(this, true);
    },
    hide: function () {
        return showHide(this);
    },
    toggle: function (state) {
        if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
        }

        return this.each(function () {
            if (isHiddenWithinTree(this)) {
                jQuery(this).show();
            } else {
                jQuery(this).hide();
            }
        });
    },
});
var rcheckableType = /^(?:checkbox|radio)$/i;

var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;

var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;

// We have to close these tags to support XHTML (#13200)
var wrapMap = {
    // Support: IE <=9 only
    option: [1, "<select multiple='multiple'>", "</select>"],

    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do. So we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

    _default: [0, "", ""],
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

function getAll(context, tag) {
    // Support: IE <=9 - 11 only
    // Use typeof to avoid zero-argument method invocation on host objects (#15151)
    var ret;

    if (typeof context.getElementsByTagName !== "undefined") {
        ret = context.getElementsByTagName(tag || "*");
    } else if (typeof context.querySelectorAll !== "undefined") {
        ret = context.querySelectorAll(tag || "*");
    } else {
        ret = [];
    }

    if (tag === undefined || (tag && nodeName(context, tag))) {
        return jQuery.merge([context], ret);
    }

    return ret;
}

// Mark scripts as having already been evaluated
function setGlobalEval(elems, refElements) {
    var i = 0,
        l = elems.length;

    for (; i < l; i++) {
        dataPriv.set(elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
    }
}

var rhtml = /<|&#?\w+;/;

function buildFragment(elems, context, scripts, selection, ignored) {
    var elem,
        tmp,
        tag,
        wrap,
        contains,
        j,
        fragment = context.createDocumentFragment(),
        nodes = [],
        i = 0,
        l = elems.length;

    for (; i < l; i++) {
        elem = elems[i];

        if (elem || elem === 0) {
            // Add nodes directly
            if (toType(elem) === "object") {
                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                // Convert non-html into a text node
            } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));

                // Convert html into DOM nodes
            } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));

                // Deserialize a standard representation
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

                // Descend through wrappers to the right content
                j = wrap[0];
                while (j--) {
                    tmp = tmp.lastChild;
                }

                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, tmp.childNodes);

                // Remember the top-level container
                tmp = fragment.firstChild;

                // Ensure the created nodes are orphaned (#12392)
                tmp.textContent = "";
            }
        }
    }

    // Remove wrapper from fragment
    fragment.textContent = "";

    i = 0;
    while ((elem = nodes[i++])) {
        // Skip elements already in the context collection (trac-4087)
        if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
                ignored.push(elem);
            }
            continue;
        }

        contains = jQuery.contains(elem.ownerDocument, elem);

        // Append to fragment
        tmp = getAll(fragment.appendChild(elem), "script");

        // Preserve script evaluation history
        if (contains) {
            setGlobalEval(tmp);
        }

        // Capture executables
        if (scripts) {
            j = 0;
            while ((elem = tmp[j++])) {
                if (rscriptType.test(elem.type || "")) {
                    scripts.push(elem);
                }
            }
        }
    }

    return fragment;
}

(function () {
    var fragment = document.createDocumentFragment(),
        div = fragment.appendChild(document.createElement("div")),
        input = document.createElement("input");

    // Support: Android 4.0 - 4.3 only
    // Check state lost if the name is set (#11217)
    // Support: Windows Web Apps (WWA)
    // `name` and `type` must use .setAttribute for WWA (#14901)
    input.setAttribute("type", "radio");
    input.setAttribute("checked", "checked");
    input.setAttribute("name", "t");

    div.appendChild(input);

    // Support: Android <=4.1 only
    // Older WebKit doesn't clone checked state correctly in fragments
    support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

    // Support: IE <=11 only
    // Make sure textarea (and checkbox) defaultValue is properly cloned
    div.innerHTML = "<textarea>x</textarea>";
    support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
})();
var documentElement = document.documentElement;

var rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
    return true;
}

function returnFalse() {
    return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
    try {
        return document.activeElement;
    } catch (err) {}
}

function on(elem, types, selector, data, fn, one) {
    var origFn, type;

    // Types can be a map of types/handlers
    if (typeof types === "object") {
        // ( types-Object, selector, data )
        if (typeof selector !== "string") {
            // ( types-Object, data )
            data = data || selector;
            selector = undefined;
        }
        for (type in types) {
            on(elem, type, selector, data, types[type], one);
        }
        return elem;
    }

    if (data == null && fn == null) {
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
    } else if (fn == null) {
        if (typeof selector === "string") {
            // ( types, selector, fn )
            fn = data;
            data = undefined;
        } else {
            // ( types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }
    if (fn === false) {
        fn = returnFalse;
    } else if (!fn) {
        return elem;
    }

    if (one === 1) {
        origFn = fn;
        fn = function (event) {
            // Can use an empty set, since event contains the info
            jQuery().off(event);
            return origFn.apply(this, arguments);
        };

        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
    }
    return elem.each(function () {
        jQuery.event.add(this, types, fn, data, selector);
    });
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {
    global: {},

    add: function (elem, types, handler, data, selector) {
        var handleObjIn,
            eventHandle,
            tmp,
            events,
            t,
            handleObj,
            special,
            handlers,
            type,
            namespaces,
            origType,
            elemData = dataPriv.get(elem);

        // Don't attach events to noData or text/comment nodes (but allow plain objects)
        if (!elemData) {
            return;
        }

        // Caller can pass in an object of custom data in lieu of the handler
        if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
        }

        // Ensure that invalid selectors throw exceptions at attach time
        // Evaluate against documentElement in case elem is a non-element node (e.g., document)
        if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
        }

        // Make sure that the handler has a unique ID, used to find/remove it later
        if (!handler.guid) {
            handler.guid = jQuery.guid++;
        }

        // Init the element's event structure and main handler, if this is the first
        if (!(events = elemData.events)) {
            events = elemData.events = {};
        }
        if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function (e) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type
                    ? jQuery.event.dispatch.apply(elem, arguments)
                    : undefined;
            };
        }

        // Handle multiple events separated by a space
        types = (types || "").match(rnothtmlwhite) || [""];
        t = types.length;
        while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();

            // There *must* be a type, no attaching namespace-only handlers
            if (!type) {
                continue;
            }

            // If event changes its type, use the special event handlers for the changed type
            special = jQuery.event.special[type] || {};

            // If selector defined, determine special event api type, otherwise given type
            type = (selector ? special.delegateType : special.bindType) || type;

            // Update special based on newly reset type
            special = jQuery.event.special[type] || {};

            // handleObj is passed to all event handlers
            handleObj = jQuery.extend(
                {
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join("."),
                },
                handleObjIn
            );

            // Init the event handler queue if we're the first
            if (!(handlers = events[type])) {
                handlers = events[type] = [];
                handlers.delegateCount = 0;

                // Only use addEventListener if the special events handler returns false
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                    if (elem.addEventListener) {
                        elem.addEventListener(type, eventHandle);
                    }
                }
            }

            if (special.add) {
                special.add.call(elem, handleObj);

                if (!handleObj.handler.guid) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            // Add to the element's handler list, delegates in front
            if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
                handlers.push(handleObj);
            }

            // Keep track of which events have ever been used, for event optimization
            jQuery.event.global[type] = true;
        }
    },

    // Detach an event or set of events from an element
    remove: function (elem, types, handler, selector, mappedTypes) {
        var j,
            origCount,
            tmp,
            events,
            t,
            handleObj,
            special,
            handlers,
            type,
            namespaces,
            origType,
            elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

        if (!elemData || !(events = elemData.events)) {
            return;
        }

        // Once for each type.namespace in types; type may be omitted
        types = (types || "").match(rnothtmlwhite) || [""];
        t = types.length;
        while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();

            // Unbind all events (on this namespace, if provided) for the element
            if (!type) {
                for (type in events) {
                    jQuery.event.remove(elem, type + types[t], handler, selector, true);
                }
                continue;
            }

            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

            // Remove matching events
            origCount = j = handlers.length;
            while (j--) {
                handleObj = handlers[j];

                if (
                    (mappedTypes || origType === handleObj.origType) &&
                    (!handler || handler.guid === handleObj.guid) &&
                    (!tmp || tmp.test(handleObj.namespace)) &&
                    (!selector || selector === handleObj.selector || (selector === "**" && handleObj.selector))
                ) {
                    handlers.splice(j, 1);

                    if (handleObj.selector) {
                        handlers.delegateCount--;
                    }
                    if (special.remove) {
                        special.remove.call(elem, handleObj);
                    }
                }
            }

            // Remove generic event handler if we removed something and no more handlers exist
            // (avoids potential for endless recursion during removal of special event handlers)
            if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                    jQuery.removeEvent(elem, type, elemData.handle);
                }

                delete events[type];
            }
        }

        // Remove data and the expando if it's no longer used
        if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
        }
    },

    dispatch: function (nativeEvent) {
        // Make a writable jQuery.Event from the native event object
        var event = jQuery.event.fix(nativeEvent);

        var i,
            j,
            ret,
            matched,
            handleObj,
            handlerQueue,
            args = new Array(arguments.length),
            handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
            special = jQuery.event.special[event.type] || {};

        // Use the fix-ed jQuery.Event rather than the (read-only) native event
        args[0] = event;

        for (i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
        }

        event.delegateTarget = this;

        // Call the preDispatch hook for the mapped type, and let it bail if desired
        if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
        }

        // Determine handlers
        handlerQueue = jQuery.event.handlers.call(this, event, handlers);

        // Run delegates first; they may want to stop propagation beneath us
        i = 0;
        while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;

            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                // Triggered event must either 1) have no namespace, or 2) have namespace(s)
                // a subset or equal to those in the bound event (both can have no namespace).
                if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {
                    event.handleObj = handleObj;
                    event.data = handleObj.data;

                    ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(
                        matched.elem,
                        args
                    );

                    if (ret !== undefined) {
                        if ((event.result = ret) === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                }
            }
        }

        // Call the postDispatch hook for the mapped type
        if (special.postDispatch) {
            special.postDispatch.call(this, event);
        }

        return event.result;
    },

    handlers: function (event, handlers) {
        var i,
            handleObj,
            sel,
            matchedHandlers,
            matchedSelectors,
            handlerQueue = [],
            delegateCount = handlers.delegateCount,
            cur = event.target;

        // Find delegate handlers
        if (
            delegateCount &&
            // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType &&
            // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !(event.type === "click" && event.button >= 1)
        ) {
            for (; cur !== this; cur = cur.parentNode || this) {
                // Don't check non-elements (#13208)
                // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                    matchedHandlers = [];
                    matchedSelectors = {};
                    for (i = 0; i < delegateCount; i++) {
                        handleObj = handlers[i];

                        // Don't conflict with Object.prototype properties (#13203)
                        sel = handleObj.selector + " ";

                        if (matchedSelectors[sel] === undefined) {
                            matchedSelectors[sel] = handleObj.needsContext
                                ? jQuery(sel, this).index(cur) > -1
                                : jQuery.find(sel, this, null, [cur]).length;
                        }
                        if (matchedSelectors[sel]) {
                            matchedHandlers.push(handleObj);
                        }
                    }
                    if (matchedHandlers.length) {
                        handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                    }
                }
            }
        }

        // Add the remaining (directly-bound) handlers
        cur = this;
        if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
        }

        return handlerQueue;
    },

    addProp: function (name, hook) {
        Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,

            get: isFunction(hook)
                ? function () {
                      if (this.originalEvent) {
                          return hook(this.originalEvent);
                      }
                  }
                : function () {
                      if (this.originalEvent) {
                          return this.originalEvent[name];
                      }
                  },

            set: function (value) {
                Object.defineProperty(this, name, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: value,
                });
            },
        });
    },

    fix: function (originalEvent) {
        return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
    },

    special: {
        load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true,
        },
        focus: {
            // Fire native event if possible so blur/focus sequence is correct
            trigger: function () {
                if (this !== safeActiveElement() && this.focus) {
                    this.focus();
                    return false;
                }
            },
            delegateType: "focusin",
        },
        blur: {
            trigger: function () {
                if (this === safeActiveElement() && this.blur) {
                    this.blur();
                    return false;
                }
            },
            delegateType: "focusout",
        },
        click: {
            // For checkbox, fire native event so checked state will be right
            trigger: function () {
                if (this.type === "checkbox" && this.click && nodeName(this, "input")) {
                    this.click();
                    return false;
                }
            },

            // For cross-browser consistency, don't fire native .click() on links
            _default: function (event) {
                return nodeName(event.target, "a");
            },
        },

        beforeunload: {
            postDispatch: function (event) {
                // Support: Firefox 20+
                // Firefox doesn't alert if the returnValue field is not set.
                if (event.result !== undefined && event.originalEvent) {
                    event.originalEvent.returnValue = event.result;
                }
            },
        },
    },
};

jQuery.removeEvent = function (elem, type, handle) {
    // This "if" is needed for plain objects
    if (elem.removeEventListener) {
        elem.removeEventListener(type, handle);
    }
};

jQuery.Event = function (src, props) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof jQuery.Event)) {
        return new jQuery.Event(src, props);
    }

    // Event object
    if (src && src.type) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented =
            src.defaultPrevented ||
            (src.defaultPrevented === undefined &&
                // Support: Android <=2.3 only
                src.returnValue === false)
                ? returnTrue
                : returnFalse;

        // Create target properties
        // Support: Safari <=6 - 7 only
        // Target should not be a text node (#504, #13143)
        this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;

        this.currentTarget = src.currentTarget;
        this.relatedTarget = src.relatedTarget;

        // Event type
    } else {
        this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if (props) {
        jQuery.extend(this, props);
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = (src && src.timeStamp) || Date.now();

    // Mark it as fixed
    this[jQuery.expando] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    constructor: jQuery.Event,
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,
    isSimulated: false,

    preventDefault: function () {
        var e = this.originalEvent;

        this.isDefaultPrevented = returnTrue;

        if (e && !this.isSimulated) {
            e.preventDefault();
        }
    },
    stopPropagation: function () {
        var e = this.originalEvent;

        this.isPropagationStopped = returnTrue;

        if (e && !this.isSimulated) {
            e.stopPropagation();
        }
    },
    stopImmediatePropagation: function () {
        var e = this.originalEvent;

        this.isImmediatePropagationStopped = returnTrue;

        if (e && !this.isSimulated) {
            e.stopImmediatePropagation();
        }

        this.stopPropagation();
    },
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each(
    {
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        char: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,

        which: function (event) {
            var button = event.button;

            // Add which for key events
            if (event.which == null && rkeyEvent.test(event.type)) {
                return event.charCode != null ? event.charCode : event.keyCode;
            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            if (!event.which && button !== undefined && rmouseEvent.test(event.type)) {
                if (button & 1) {
                    return 1;
                }

                if (button & 2) {
                    return 3;
                }

                if (button & 4) {
                    return 2;
                }

                return 0;
            }

            return event.which;
        },
    },
    jQuery.event.addProp
);

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each(
    {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout",
    },
    function (orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,

            handle: function (event) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;

                // For mouseenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if (!related || (related !== target && !jQuery.contains(target, related))) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            },
        };
    }
);

jQuery.fn.extend({
    on: function (types, selector, data, fn) {
        return on(this, types, selector, data, fn);
    },
    one: function (types, selector, data, fn) {
        return on(this, types, selector, data, fn, 1);
    },
    off: function (types, selector, fn) {
        var handleObj, type;
        if (types && types.preventDefault && types.handleObj) {
            // ( event )  dispatched jQuery.Event
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
            );
            return this;
        }
        if (typeof types === "object") {
            // ( types-object [, selector] )
            for (type in types) {
                this.off(type, selector, types[type]);
            }
            return this;
        }
        if (selector === false || typeof selector === "function") {
            // ( types [, fn] )
            fn = selector;
            selector = undefined;
        }
        if (fn === false) {
            fn = returnFalse;
        }
        return this.each(function () {
            jQuery.event.remove(this, types, fn, selector);
        });
    },
});

var /* eslint-disable max-len */

    // See https://github.com/eslint/eslint/issues/3229
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    /* eslint-enable */

    // Support: IE <=10 - 11, Edge 12 - 13 only
    // In IE/Edge using regex groups here causes severe slowdowns.
    // See https://connect.microsoft.com/IE/feedback/details/1736512/
    rnoInnerhtml = /<script|<style|<link/i,
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget(elem, content) {
    if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
        return jQuery(elem).children("tbody")[0] || elem;
    }

    return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
}

function restoreScript(elem) {
    if ((elem.type || "").slice(0, 5) === "true/") {
        elem.type = elem.type.slice(5);
    } else {
        elem.removeAttribute("type");
    }

    return elem;
}

function cloneCopyEvent(src, dest) {
    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

    if (dest.nodeType !== 1) {
        return;
    }

    // 1. Copy private data: events, handlers, etc.
    if (dataPriv.hasData(src)) {
        pdataOld = dataPriv.access(src);
        pdataCur = dataPriv.set(dest, pdataOld);
        events = pdataOld.events;

        if (events) {
            delete pdataCur.handle;
            pdataCur.events = {};

            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }
    }

    // 2. Copy user data
    if (dataUser.hasData(src)) {
        udataOld = dataUser.access(src);
        udataCur = jQuery.extend({}, udataOld);

        dataUser.set(dest, udataCur);
    }
}

// Fix IE bugs, see support tests
function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();

    // Fails to persist the checked state of a cloned checkbox or radio button.
    if (nodeName === "input" && rcheckableType.test(src.type)) {
        dest.checked = src.checked;

        // Fails to return the selected option to the default selected state when cloning options
    } else if (nodeName === "input" || nodeName === "textarea") {
        dest.defaultValue = src.defaultValue;
    }
}

function domManip(collection, args, callback, ignored) {
    // Flatten any nested arrays
    args = concat.apply([], args);

    var fragment,
        first,
        scripts,
        hasScripts,
        node,
        doc,
        i = 0,
        l = collection.length,
        iNoClone = l - 1,
        value = args[0],
        valueIsFunction = isFunction(value);

    // We can't cloneNode fragments that contain checked, in WebKit
    if (valueIsFunction || (l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value))) {
        return collection.each(function (index) {
            var self = collection.eq(index);
            if (valueIsFunction) {
                args[0] = value.call(this, index, self.html());
            }
            domManip(self, args, callback, ignored);
        });
    }

    if (l) {
        fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
        first = fragment.firstChild;

        if (fragment.childNodes.length === 1) {
            fragment = first;
        }

        // Require either new content or an interest in ignored elements to invoke the callback
        if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;

            // Use the original fragment for the last item
            // instead of the first because it can end up
            // being emptied incorrectly in certain situations (#8070).
            for (; i < l; i++) {
                node = fragment;

                if (i !== iNoClone) {
                    node = jQuery.clone(node, true, true);

                    // Keep references to cloned scripts for later restoration
                    if (hasScripts) {
                        // Support: Android <=4.0 only, PhantomJS 1 only
                        // push.apply(_, arraylike) throws on ancient WebKit
                        jQuery.merge(scripts, getAll(node, "script"));
                    }
                }

                callback.call(collection[i], node, i);
            }

            if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;

                // Reenable scripts
                jQuery.map(scripts, restoreScript);

                // Evaluate executable scripts on first document insertion
                for (i = 0; i < hasScripts; i++) {
                    node = scripts[i];
                    if (
                        rscriptType.test(node.type || "") &&
                        !dataPriv.access(node, "globalEval") &&
                        jQuery.contains(doc, node)
                    ) {
                        if (node.src && (node.type || "").toLowerCase() !== "module") {
                            // Optional AJAX dependency, but won't run scripts if not present
                            if (jQuery._evalUrl) {
                                jQuery._evalUrl(node.src);
                            }
                        } else {
                            DOMEval(node.textContent.replace(rcleanScript, ""), doc, node);
                        }
                    }
                }
            }
        }
    }

    return collection;
}

function remove(elem, selector, keepData) {
    var node,
        nodes = selector ? jQuery.filter(selector, elem) : elem,
        i = 0;

    for (; (node = nodes[i]) != null; i++) {
        if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
        }

        if (node.parentNode) {
            if (keepData && jQuery.contains(node.ownerDocument, node)) {
                setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
        }
    }

    return elem;
}

jQuery.extend({
    htmlPrefilter: function (html) {
        return html.replace(rxhtmlTag, "<$1></$2>");
    },

    clone: function (elem, dataAndEvents, deepDataAndEvents) {
        var i,
            l,
            srcElements,
            destElements,
            clone = elem.cloneNode(true),
            inPage = jQuery.contains(elem.ownerDocument, elem);

        // Fix IE cloning issues
        if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            // We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
            destElements = getAll(clone);
            srcElements = getAll(elem);

            for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
            }
        }

        // Copy the events from the original to the clone
        if (dataAndEvents) {
            if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);

                for (i = 0, l = srcElements.length; i < l; i++) {
                    cloneCopyEvent(srcElements[i], destElements[i]);
                }
            } else {
                cloneCopyEvent(elem, clone);
            }
        }

        // Preserve script evaluation history
        destElements = getAll(clone, "script");
        if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
        }

        // Return the cloned set
        return clone;
    },

    cleanData: function (elems) {
        var data,
            elem,
            type,
            special = jQuery.event.special,
            i = 0;

        for (; (elem = elems[i]) !== undefined; i++) {
            if (acceptData(elem)) {
                if ((data = elem[dataPriv.expando])) {
                    if (data.events) {
                        for (type in data.events) {
                            if (special[type]) {
                                jQuery.event.remove(elem, type);

                                // This is a shortcut to avoid jQuery.event.remove's overhead
                            } else {
                                jQuery.removeEvent(elem, type, data.handle);
                            }
                        }
                    }

                    // Support: Chrome <=35 - 45+
                    // Assign undefined instead of using delete, see Data#remove
                    elem[dataPriv.expando] = undefined;
                }
                if (elem[dataUser.expando]) {
                    // Support: Chrome <=35 - 45+
                    // Assign undefined instead of using delete, see Data#remove
                    elem[dataUser.expando] = undefined;
                }
            }
        }
    },
});

jQuery.fn.extend({
    detach: function (selector) {
        return remove(this, selector, true);
    },

    remove: function (selector) {
        return remove(this, selector);
    },

    text: function (value) {
        return access(
            this,
            function (value) {
                return value === undefined
                    ? jQuery.text(this)
                    : this.empty().each(function () {
                          if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                              this.textContent = value;
                          }
                      });
            },
            null,
            value,
            arguments.length
        );
    },

    append: function () {
        return domManip(this, arguments, function (elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
            }
        });
    },

    prepend: function () {
        return domManip(this, arguments, function (elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
            }
        });
    },

    before: function () {
        return domManip(this, arguments, function (elem) {
            if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
            }
        });
    },

    after: function () {
        return domManip(this, arguments, function (elem) {
            if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
            }
        });
    },

    empty: function () {
        var elem,
            i = 0;

        for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {
                // Prevent memory leaks
                jQuery.cleanData(getAll(elem, false));

                // Remove any remaining nodes
                elem.textContent = "";
            }
        }

        return this;
    },

    clone: function (dataAndEvents, deepDataAndEvents) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map(function () {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
        });
    },

    html: function (value) {
        return access(
            this,
            function (value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined && elem.nodeType === 1) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if (
                    typeof value === "string" &&
                    !rnoInnerhtml.test(value) &&
                    !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]
                ) {
                    value = jQuery.htmlPrefilter(value);

                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};

                            // Remove element nodes and prevent memory leaks
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (e) {}
                }

                if (elem) {
                    this.empty().append(value);
                }
            },
            null,
            value,
            arguments.length
        );
    },

    replaceWith: function () {
        var ignored = [];

        // Make the changes, replacing each non-ignored context element with the new content
        return domManip(
            this,
            arguments,
            function (elem) {
                var parent = this.parentNode;

                if (jQuery.inArray(this, ignored) < 0) {
                    jQuery.cleanData(getAll(this));
                    if (parent) {
                        parent.replaceChild(elem, this);
                    }
                }

                // Force callback invocation
            },
            ignored
        );
    },
});

jQuery.each(
    {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
    },
    function (name, original) {
        jQuery.fn[name] = function (selector) {
            var elems,
                ret = [],
                insert = jQuery(selector),
                last = insert.length - 1,
                i = 0;

            for (; i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);

                // Support: Android <=4.0 only, PhantomJS 1 only
                // .get() because push.apply(_, arraylike) throws on ancient WebKit
                push.apply(ret, elems.get());
            }

            return this.pushStack(ret);
        };
    }
);
var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

var getStyles = function (elem) {
    // Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = elem.ownerDocument.defaultView;

    if (!view || !view.opener) {
        view = window;
    }

    return view.getComputedStyle(elem);
};

var rboxStyle = new RegExp(cssExpand.join("|"), "i");

(function () {
    // Executing both pixelPosition & boxSizingReliable tests require only one layout
    // so they're executed at the same time to save the second computation.
    function computeStyleTests() {
        // This is a singleton, we need to execute it only once
        if (!div) {
            return;
        }

        container.style.cssText = "position:absolute;left:-11111px;width:60px;" + "margin-top:1px;padding:0;border:0";
        div.style.cssText =
            "position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
            "margin:auto;border:1px;padding:1px;" +
            "width:60%;top:1%";
        documentElement.appendChild(container).appendChild(div);

        var divStyle = window.getComputedStyle(div);
        pixelPositionVal = divStyle.top !== "1%";

        // Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
        reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;

        // Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
        // Some styles come back with percentage values, even though they shouldn't
        div.style.right = "60%";
        pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;

        // Support: IE 9 - 11 only
        // Detect misreporting of content dimensions for box-sizing:border-box elements
        boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;

        // Support: IE 9 only
        // Detect overflow:scroll screwiness (gh-3699)
        div.style.position = "absolute";
        scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

        documentElement.removeChild(container);

        // Nullify the div so it wouldn't be stored in the memory and
        // it will also be a sign that checks already performed
        div = null;
    }

    function roundPixelMeasures(measure) {
        return Math.round(parseFloat(measure));
    }

    var pixelPositionVal,
        boxSizingReliableVal,
        scrollboxSizeVal,
        pixelBoxStylesVal,
        reliableMarginLeftVal,
        container = document.createElement("div"),
        div = document.createElement("div");

    // Finish early in limited (non-browser) environments
    if (!div.style) {
        return;
    }

    // Support: IE <=9 - 11 only
    // Style of cloned element affects source element cloned (#8908)
    div.style.backgroundClip = "content-box";
    div.cloneNode(true).style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";

    jQuery.extend(support, {
        boxSizingReliable: function () {
            computeStyleTests();
            return boxSizingReliableVal;
        },
        pixelBoxStyles: function () {
            computeStyleTests();
            return pixelBoxStylesVal;
        },
        pixelPosition: function () {
            computeStyleTests();
            return pixelPositionVal;
        },
        reliableMarginLeft: function () {
            computeStyleTests();
            return reliableMarginLeftVal;
        },
        scrollboxSize: function () {
            computeStyleTests();
            return scrollboxSizeVal;
        },
    });
})();

function curCSS(elem, name, computed) {
    var width,
        minWidth,
        maxWidth,
        ret,
        // Support: Firefox 51+
        // Retrieving style before computed somehow
        // fixes an issue with getting wrong values
        // on detached elements
        style = elem.style;

    computed = computed || getStyles(elem);

    // getPropertyValue is needed for:
    //   .css('filter') (IE 9 only, #12537)
    //   .css('--customProperty) (#3144)
    if (computed) {
        ret = computed.getPropertyValue(name) || computed[name];

        if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
            ret = jQuery.style(elem, name);
        }

        // A tribute to the "awesome hack by Dean Edwards"
        // Android Browser returns percentage for some values,
        // but width seems to be reliably pixels.
        // This is against the CSSOM draft spec:
        // https://drafts.csswg.org/cssom/#resolved-values
        if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            // Remember the original values
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;

            // Put in the new values to get a computed value out
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;

            // Revert the changed values
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
        }
    }

    return ret !== undefined
        ? // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        : ret;
}

function addGetHookIf(conditionFn, hookFn) {
    // Define the hook, we'll check on the first run if it's really needed.
    return {
        get: function () {
            if (conditionFn()) {
                // Hook not needed (or it's not possible to use it due
                // to missing dependency), remove it.
                delete this.get;
                return;
            }

            // Hook needed; redefine it so that the support test is not executed again.
            return (this.get = hookFn).apply(this, arguments);
        },
    };
}

var // Swappable if display is none or starts with table
    // except "table", "table-cell", or "table-caption"
    // See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    rcustomProp = /^--/,
    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400",
    },
    cssPrefixes = ["Webkit", "Moz", "ms"],
    emptyStyle = document.createElement("div").style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName(name) {
    // Shortcut for names that are not vendor prefixed
    if (name in emptyStyle) {
        return name;
    }

    // Check for vendor prefixed names
    var capName = name[0].toUpperCase() + name.slice(1),
        i = cssPrefixes.length;

    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName(name) {
    var ret = jQuery.cssProps[name];
    if (!ret) {
        ret = jQuery.cssProps[name] = vendorPropName(name) || name;
    }
    return ret;
}

function setPositiveNumber(elem, value, subtract) {
    // Any relative (+/-) values have already been
    // normalized at this point
    var matches = rcssNum.exec(value);
    return matches
        ? // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        : value;
}

function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
    var i = dimension === "width" ? 1 : 0,
        extra = 0,
        delta = 0;

    // Adjustment may not be necessary
    if (box === (isBorderBox ? "border" : "content")) {
        return 0;
    }

    for (; i < 4; i += 2) {
        // Both box models exclude margin
        if (box === "margin") {
            delta += jQuery.css(elem, box + cssExpand[i], true, styles);
        }

        // If we get here with a content-box, we're seeking "padding" or "border" or "margin"
        if (!isBorderBox) {
            // Add padding
            delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

            // For "border" or "margin", add border
            if (box !== "padding") {
                delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);

                // But still keep track of it otherwise
            } else {
                extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }

            // If we get here with a border-box (content + padding + border), we're seeking "content" or
            // "padding" or "margin"
        } else {
            // For "content", subtract padding
            if (box === "content") {
                delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            }

            // For "content" or "padding", subtract border
            if (box !== "margin") {
                delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
        }
    }

    // Account for positive content-box scroll gutter when requested by providing computedVal
    if (!isBorderBox && computedVal >= 0) {
        // offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
        // Assuming integer scroll gutter, subtract the rest and round down
        delta += Math.max(
            0,
            Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            )
        );
    }

    return delta;
}

function getWidthOrHeight(elem, dimension, extra) {
    // Start with computed style
    var styles = getStyles(elem),
        val = curCSS(elem, dimension, styles),
        isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box",
        valueIsBorderBox = isBorderBox;

    // Support: Firefox <=54
    // Return a confounding non-pixel value or feign ignorance, as appropriate.
    if (rnumnonpx.test(val)) {
        if (!extra) {
            return val;
        }
        val = "auto";
    }

    // Check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style
    valueIsBorderBox = valueIsBorderBox && (support.boxSizingReliable() || val === elem.style[dimension]);

    // Fall back to offsetWidth/offsetHeight when value is "auto"
    // This happens for inline elements with no explicit setting (gh-3571)
    // Support: Android <=4.1 - 4.3 only
    // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    if (val === "auto" || (!parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline")) {
        val = elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)];

        // offsetWidth/offsetHeight provide border-box values
        valueIsBorderBox = true;
    }

    // Normalize "" and auto
    val = parseFloat(val) || 0;

    // Adjust for the element's box model
    return (
        val +
        boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,

            // Provide the current computed size to request scroll gutter calculation (gh-3589)
            val
        ) +
        "px"
    );
}

jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
        opacity: {
            get: function (elem, computed) {
                if (computed) {
                    // We should always get a number back from opacity
                    var ret = curCSS(elem, "opacity");
                    return ret === "" ? "1" : ret;
                }
            },
        },
    },

    // Don't automatically add "px" to these possibly-unitless properties
    cssNumber: {
        animationIterationCount: true,
        columnCount: true,
        fillOpacity: true,
        flexGrow: true,
        flexShrink: true,
        fontWeight: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        widows: true,
        zIndex: true,
        zoom: true,
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {},

    // Get and set the style property on a DOM Node
    style: function (elem, name, value, extra) {
        // Don't set styles on text and comment nodes
        if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
        }

        // Make sure that we're working with the right name
        var ret,
            type,
            hooks,
            origName = camelCase(name),
            isCustomProp = rcustomProp.test(name),
            style = elem.style;

        // Make sure that we're working with the right name. We don't
        // want to query the value if it is a CSS custom property
        // since they are user-defined.
        if (!isCustomProp) {
            name = finalPropName(origName);
        }

        // Gets hook for the prefixed version, then unprefixed version
        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

        // Check if we're setting a value
        if (value !== undefined) {
            type = typeof value;

            // Convert "+=" or "-=" to relative numbers (#7345)
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);

                // Fixes bug #9237
                type = "number";
            }

            // Make sure that null and NaN values aren't set (#7116)
            if (value == null || value !== value) {
                return;
            }

            // If a number was passed in, add the unit (except for certain CSS properties)
            if (type === "number") {
                value += (ret && ret[3]) || (jQuery.cssNumber[origName] ? "" : "px");
            }

            // background-* props affect original clone's values
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                if (isCustomProp) {
                    style.setProperty(name, value);
                } else {
                    style[name] = value;
                }
            }
        } else {
            // If a hook was provided get the non-computed value from there
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                return ret;
            }

            // Otherwise just get the value from the style object
            return style[name];
        }
    },

    css: function (elem, name, extra, styles) {
        var val,
            num,
            hooks,
            origName = camelCase(name),
            isCustomProp = rcustomProp.test(name);

        // Make sure that we're working with the right name. We don't
        // want to modify the value if it is a CSS custom property
        // since they are user-defined.
        if (!isCustomProp) {
            name = finalPropName(origName);
        }

        // Try prefixed name followed by the unprefixed name
        hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

        // If a hook was provided get the computed value from there
        if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
        }

        // Otherwise, if a way to get the computed value exists, use that
        if (val === undefined) {
            val = curCSS(elem, name, styles);
        }

        // Convert "normal" to computed value
        if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
        }

        // Make numeric if forced or a qualifier was provided and val looks numeric
        if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
        }

        return val;
    },
});

jQuery.each(["height", "width"], function (i, dimension) {
    jQuery.cssHooks[dimension] = {
        get: function (elem, computed, extra) {
            if (computed) {
                // Certain elements can have dimension info if we invisibly show them
                // but it must have a current display style that would benefit
                return rdisplayswap.test(jQuery.css(elem, "display")) &&
                    // Support: Safari 8+
                    // Table columns in Safari have non-zero offsetWidth & zero
                    // getBoundingClientRect().width unless display is changed.
                    // Support: IE <=11 only
                    // Running getBoundingClientRect on a disconnected node
                    // in IE throws an error.
                    (!elem.getClientRects().length || !elem.getBoundingClientRect().width)
                    ? swap(elem, cssShow, function () {
                          return getWidthOrHeight(elem, dimension, extra);
                      })
                    : getWidthOrHeight(elem, dimension, extra);
            }
        },

        set: function (elem, value, extra) {
            var matches,
                styles = getStyles(elem),
                isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box",
                subtract = extra && boxModelAdjustment(elem, dimension, extra, isBorderBox, styles);

            // Account for unreliable border-box dimensions by comparing offset* to computed and
            // faking a content-box to get border and padding (gh-3699)
            if (isBorderBox && support.scrollboxSize() === styles.position) {
                subtract -= Math.ceil(
                    elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] -
                        parseFloat(styles[dimension]) -
                        boxModelAdjustment(elem, dimension, "border", false, styles) -
                        0.5
                );
            }

            // Convert to pixels if value adjustment is needed
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery.css(elem, dimension);
            }

            return setPositiveNumber(elem, value, subtract);
        },
    };
});

jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft, function (elem, computed) {
    if (computed) {
        return (
            (parseFloat(curCSS(elem, "marginLeft")) ||
                elem.getBoundingClientRect().left -
                    swap(elem, { marginLeft: 0 }, function () {
                        return elem.getBoundingClientRect().left;
                    })) + "px"
        );
    }
});

// These hooks are used by animate to expand properties
jQuery.each(
    {
        margin: "",
        padding: "",
        border: "Width",
    },
    function (prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function (value) {
                var i = 0,
                    expanded = {},
                    // Assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [value];

                for (; i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }

                return expanded;
            },
        };

        if (prefix !== "margin") {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    }
);

jQuery.fn.extend({
    css: function (name, value) {
        return access(
            this,
            function (elem, name, value) {
                var styles,
                    len,
                    map = {},
                    i = 0;

                if (Array.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;

                    for (; i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }

                    return map;
                }

                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            },
            name,
            value,
            arguments.length > 1
        );
    },
});

// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function (time, type) {
    time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
    type = type || "fx";

    return this.queue(type, function (next, hooks) {
        var timeout = window.setTimeout(next, time);
        hooks.stop = function () {
            window.clearTimeout(timeout);
        };
    });
};

(function () {
    var input = document.createElement("input"),
        select = document.createElement("select"),
        opt = select.appendChild(document.createElement("option"));

    input.type = "checkbox";

    // Support: Android <=4.3 only
    // Default value for a checkbox should be "on"
    support.checkOn = input.value !== "";

    // Support: IE <=11 only
    // Must access selectedIndex to make default options select
    support.optSelected = opt.selected;

    // Support: IE <=11 only
    // An input loses its value after becoming a radio
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";
})();

var boolHook,
    attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
    attr: function (name, value) {
        return access(this, jQuery.attr, name, value, arguments.length > 1);
    },

    removeAttr: function (name) {
        return this.each(function () {
            jQuery.removeAttr(this, name);
        });
    },
});

jQuery.extend({
    attr: function (elem, name, value) {
        var ret,
            hooks,
            nType = elem.nodeType;

        // Don't get/set attributes on text, comment and attribute nodes
        if (nType === 3 || nType === 8 || nType === 2) {
            return;
        }

        // Fallback to prop when attributes are not supported
        if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
        }

        // Attribute hooks are determined by the lowercase version
        // Grab necessary hook if one is defined
        if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : undefined);
        }

        if (value !== undefined) {
            if (value === null) {
                jQuery.removeAttr(elem, name);
                return;
            }

            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                return ret;
            }

            elem.setAttribute(name, value + "");
            return value;
        }

        if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
        }

        ret = jQuery.find.attr(elem, name);

        // Non-existent attributes return null, we normalize to undefined
        return ret == null ? undefined : ret;
    },

    attrHooks: {
        type: {
            set: function (elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                    var val = elem.value;
                    elem.setAttribute("type", value);
                    if (val) {
                        elem.value = val;
                    }
                    return value;
                }
            },
        },
    },

    removeAttr: function (elem, value) {
        var name,
            i = 0,
            // Attribute names can contain non-HTML whitespace characters
            // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
            attrNames = value && value.match(rnothtmlwhite);

        if (attrNames && elem.nodeType === 1) {
            while ((name = attrNames[i++])) {
                elem.removeAttribute(name);
            }
        }
    },
});

// Hooks for boolean attributes
boolHook = {
    set: function (elem, value, name) {
        if (value === false) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr(elem, name);
        } else {
            elem.setAttribute(name, name);
        }
        return name;
    },
};

jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
    var getter = attrHandle[name] || jQuery.find.attr;

    attrHandle[name] = function (elem, name, isXML) {
        var ret,
            handle,
            lowercaseName = name.toLowerCase();

        if (!isXML) {
            // Avoid an infinite loop by temporarily removing this function from the getter
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
        }
        return ret;
    };
});

var rfocusable = /^(?:input|select|textarea|button)$/i,
    rclickable = /^(?:a|area)$/i;

jQuery.fn.extend({
    prop: function (name, value) {
        return access(this, jQuery.prop, name, value, arguments.length > 1);
    },

    removeProp: function (name) {
        return this.each(function () {
            delete this[jQuery.propFix[name] || name];
        });
    },
});

jQuery.extend({
    prop: function (elem, name, value) {
        var ret,
            hooks,
            nType = elem.nodeType;

        // Don't get/set properties on text, comment and attribute nodes
        if (nType === 3 || nType === 8 || nType === 2) {
            return;
        }

        if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            // Fix name and attach hooks
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
        }

        if (value !== undefined) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                return ret;
            }

            return (elem[name] = value);
        }

        if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
        }

        return elem[name];
    },

    propHooks: {
        tabIndex: {
            get: function (elem) {
                // Support: IE <=9 - 11 only
                // elem.tabIndex doesn't always return the
                // correct value when it hasn't been explicitly set
                // https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                // Use proper attribute retrieval(#12072)
                var tabindex = jQuery.find.attr(elem, "tabindex");

                if (tabindex) {
                    return parseInt(tabindex, 10);
                }

                if (rfocusable.test(elem.nodeName) || (rclickable.test(elem.nodeName) && elem.href)) {
                    return 0;
                }

                return -1;
            },
        },
    },

    propFix: {
        for: "htmlFor",
        class: "className",
    },
});

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if (!support.optSelected) {
    jQuery.propHooks.selected = {
        get: function (elem) {
            /* eslint no-unused-expressions: "off" */

            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
            }
            return null;
        },
        set: function (elem) {
            /* eslint no-unused-expressions: "off" */

            var parent = elem.parentNode;
            if (parent) {
                parent.selectedIndex;

                if (parent.parentNode) {
                    parent.parentNode.selectedIndex;
                }
            }
        },
    };
}

jQuery.each(
    [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
    ],
    function () {
        jQuery.propFix[this.toLowerCase()] = this;
    }
);

// Strip and collapse whitespace according to HTML spec
// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
function stripAndCollapse(value) {
    var tokens = value.match(rnothtmlwhite) || [];
    return tokens.join(" ");
}

function getClass(elem) {
    return (elem.getAttribute && elem.getAttribute("class")) || "";
}

function classesToArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "string") {
        return value.match(rnothtmlwhite) || [];
    }
    return [];
}

jQuery.fn.extend({
    addClass: function (value) {
        var classes,
            elem,
            cur,
            curValue,
            clazz,
            j,
            finalValue,
            i = 0;

        if (isFunction(value)) {
            return this.each(function (j) {
                jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
        }

        classes = classesToArray(value);

        if (classes.length) {
            while ((elem = this[i++])) {
                curValue = getClass(elem);
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        if (cur.indexOf(" " + clazz + " ") < 0) {
                            cur += clazz + " ";
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = stripAndCollapse(cur);
                    if (curValue !== finalValue) {
                        elem.setAttribute("class", finalValue);
                    }
                }
            }
        }

        return this;
    },

    removeClass: function (value) {
        var classes,
            elem,
            cur,
            curValue,
            clazz,
            j,
            finalValue,
            i = 0;

        if (isFunction(value)) {
            return this.each(function (j) {
                jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
        }

        if (!arguments.length) {
            return this.attr("class", "");
        }

        classes = classesToArray(value);

        if (classes.length) {
            while ((elem = this[i++])) {
                curValue = getClass(elem);

                // This expression is here for better compressibility (see addClass)
                cur = elem.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";

                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        // Remove *all* instances
                        while (cur.indexOf(" " + clazz + " ") > -1) {
                            cur = cur.replace(" " + clazz + " ", " ");
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = stripAndCollapse(cur);
                    if (curValue !== finalValue) {
                        elem.setAttribute("class", finalValue);
                    }
                }
            }
        }

        return this;
    },

    toggleClass: function (value, stateVal) {
        var type = typeof value,
            isValidValue = type === "string" || Array.isArray(value);

        if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
        }

        if (isFunction(value)) {
            return this.each(function (i) {
                jQuery(this).toggleClass(value.call(this, i, getClass(this), stateVal), stateVal);
            });
        }

        return this.each(function () {
            var className, i, self, classNames;

            if (isValidValue) {
                // Toggle individual class names
                i = 0;
                self = jQuery(this);
                classNames = classesToArray(value);

                while ((className = classNames[i++])) {
                    // Check each className given, space separated list
                    if (self.hasClass(className)) {
                        self.removeClass(className);
                    } else {
                        self.addClass(className);
                    }
                }

                // Toggle whole class name
            } else if (value === undefined || type === "boolean") {
                className = getClass(this);
                if (className) {
                    // Store className if set
                    dataPriv.set(this, "__className__", className);
                }

                // If the element has a class name or if we're passed `false`,
                // then remove the whole classname (if there was one, the above saved it).
                // Otherwise bring back whatever was previously saved (if anything),
                // falling back to the empty string if nothing was stored.
                if (this.setAttribute) {
                    this.setAttribute(
                        "class",
                        className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                    );
                }
            }
        });
    },

    hasClass: function (selector) {
        var className,
            elem,
            i = 0;

        className = " " + selector + " ";
        while ((elem = this[i++])) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
            }
        }

        return false;
    },
});

var rreturn = /\r/g;

jQuery.fn.extend({
    val: function (value) {
        var hooks,
            ret,
            valueIsFunction,
            elem = this[0];

        if (!arguments.length) {
            if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];

                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                    return ret;
                }

                ret = elem.value;

                // Handle most common string cases
                if (typeof ret === "string") {
                    return ret.replace(rreturn, "");
                }

                // Handle cases where value is null/undef or number
                return ret == null ? "" : ret;
            }

            return;
        }

        valueIsFunction = isFunction(value);

        return this.each(function (i) {
            var val;

            if (this.nodeType !== 1) {
                return;
            }

            if (valueIsFunction) {
                val = value.call(this, i, jQuery(this).val());
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if (val == null) {
                val = "";
            } else if (typeof val === "number") {
                val += "";
            } else if (Array.isArray(val)) {
                val = jQuery.map(val, function (value) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

            // If set returns undefined, fall back to normal setting
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                this.value = val;
            }
        });
    },
});

jQuery.extend({
    valHooks: {
        option: {
            get: function (elem) {
                var val = jQuery.find.attr(elem, "value");
                return val != null
                    ? val
                    : // Support: IE <=10 - 11 only
                      // option.text throws exceptions (#14686, #14858)
                      // Strip and collapse whitespace
                      // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                      stripAndCollapse(jQuery.text(elem));
            },
        },
        select: {
            get: function (elem) {
                var value,
                    option,
                    i,
                    options = elem.options,
                    index = elem.selectedIndex,
                    one = elem.type === "select-one",
                    values = one ? null : [],
                    max = one ? index + 1 : options.length;

                if (index < 0) {
                    i = max;
                } else {
                    i = one ? index : 0;
                }

                // Loop through all the selected options
                for (; i < max; i++) {
                    option = options[i];

                    // Support: IE <=9 only
                    // IE8-9 doesn't update selected after form reset (#2551)
                    if (
                        (option.selected || i === index) &&
                        // Don't return options that are disabled or in a disabled optgroup
                        !option.disabled &&
                        (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))
                    ) {
                        // Get the specific value for the option
                        value = jQuery(option).val();

                        // We don't need an array for one selects
                        if (one) {
                            return value;
                        }

                        // Multi-Selects return an array
                        values.push(value);
                    }
                }

                return values;
            },

            set: function (elem, value) {
                var optionSet,
                    option,
                    options = elem.options,
                    values = jQuery.makeArray(value),
                    i = options.length;

                while (i--) {
                    option = options[i];

                    /* eslint-disable no-cond-assign */

                    if ((option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1)) {
                        optionSet = true;
                    }

                    /* eslint-enable no-cond-assign */
                }

                // Force browsers to behave consistently when non-matching value is set
                if (!optionSet) {
                    elem.selectedIndex = -1;
                }
                return values;
            },
        },
    },
});

// Radios and checkboxes getter/setter
jQuery.each(["radio", "checkbox"], function () {
    jQuery.valHooks[this] = {
        set: function (elem, value) {
            if (Array.isArray(value)) {
                return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
            }
        },
    };
    if (!support.checkOn) {
        jQuery.valHooks[this].get = function (elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
        };
    }
});

// Return jQuery for attributes-only inclusion

support.focusin = "onfocusin" in window;

var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    stopPropagationCallback = function (e) {
        e.stopPropagation();
    };

jQuery.extend(jQuery.event, {
    trigger: function (event, data, elem, onlyHandlers) {
        var i,
            cur,
            tmp,
            bubbleType,
            ontype,
            handle,
            special,
            lastElement,
            eventPath = [elem || document],
            type = hasOwn.call(event, "type") ? event.type : event,
            namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

        cur = lastElement = tmp = elem = elem || document;

        // Don't do events on text and comment nodes
        if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
        }

        // focus/blur morphs to focusin/out; ensure we're not firing them right now
        if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
        }

        if (type.indexOf(".") > -1) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }
        ontype = type.indexOf(":") < 0 && "on" + type;

        // Caller can pass in a jQuery.Event object, Object, or just an event type string
        event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);

        // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
        event.isTrigger = onlyHandlers ? 2 : 3;
        event.namespace = namespaces.join(".");
        event.rnamespace = event.namespace
            ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null;

        // Clean up the event in case it is being reused
        event.result = undefined;
        if (!event.target) {
            event.target = elem;
        }

        // Clone any incoming data and prepend the event, creating the handler arg list
        data = data == null ? [event] : jQuery.makeArray(data, [event]);

        // Allow special events to draw outside the lines
        special = jQuery.event.special[type] || {};
        if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
        }

        // Determine event propagation path in advance, per W3C events spec (#9951)
        // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
        if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
                cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
            }

            // Only add window if we got to document (e.g., not plain obj or detached DOM)
            if (tmp === (elem.ownerDocument || document)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window);
            }
        }

        // Fire handlers on the event path
        i = 0;
        while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i > 1 ? bubbleType : special.bindType || type;

            // jQuery handler
            handle = (dataPriv.get(cur, "events") || {})[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
                handle.apply(cur, data);
            }

            // Native handler
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                    event.preventDefault();
                }
            }
        }
        event.type = type;

        // If nobody prevented the default action, do it now
        if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                // Call a native DOM method on the target with the same name as the event.
                // Don't do default actions on window, that's where global variables be (#6170)
                if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                    // Don't re-trigger an onFOO event when we call its FOO() method
                    tmp = elem[ontype];

                    if (tmp) {
                        elem[ontype] = null;
                    }

                    // Prevent re-triggering of the same event, since we already bubbled it above
                    jQuery.event.triggered = type;

                    if (event.isPropagationStopped()) {
                        lastElement.addEventListener(type, stopPropagationCallback);
                    }

                    elem[type]();

                    if (event.isPropagationStopped()) {
                        lastElement.removeEventListener(type, stopPropagationCallback);
                    }

                    jQuery.event.triggered = undefined;

                    if (tmp) {
                        elem[ontype] = tmp;
                    }
                }
            }
        }

        return event.result;
    },

    // Piggyback on a donor event to simulate a different one
    // Used only for `focus(in | out)` events
    simulate: function (type, elem, event) {
        var e = jQuery.extend(new jQuery.Event(), event, {
            type: type,
            isSimulated: true,
        });

        jQuery.event.trigger(e, null, elem);
    },
});

jQuery.fn.extend({
    trigger: function (type, data) {
        return this.each(function () {
            jQuery.event.trigger(type, data, this);
        });
    },
    triggerHandler: function (type, data) {
        var elem = this[0];
        if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
        }
    },
});

// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if (!support.focusin) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {
        // Attach a single capturing handler on the document while someone wants focusin/focusout
        var handler = function (event) {
            jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
        };

        jQuery.event.special[fix] = {
            setup: function () {
                var doc = this.ownerDocument || this,
                    attaches = dataPriv.access(doc, fix);

                if (!attaches) {
                    doc.addEventListener(orig, handler, true);
                }
                dataPriv.access(doc, fix, (attaches || 0) + 1);
            },
            teardown: function () {
                var doc = this.ownerDocument || this,
                    attaches = dataPriv.access(doc, fix) - 1;

                if (!attaches) {
                    doc.removeEventListener(orig, handler, true);
                    dataPriv.remove(doc, fix);
                } else {
                    dataPriv.access(doc, fix, attaches);
                }
            },
        };
    });
}

var rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams(prefix, obj, traditional, add) {
    var name;

    if (Array.isArray(obj)) {
        // Serialize array item.
        jQuery.each(obj, function (i, v) {
            if (traditional || rbracket.test(prefix)) {
                // Treat each array item as a scalar.
                add(prefix, v);
            } else {
                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]", v, traditional, add);
            }
        });
    } else if (!traditional && toType(obj) === "object") {
        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }
    } else {
        // Serialize scalar item.
        add(prefix, obj);
    }
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function (a, traditional) {
    var prefix,
        s = [],
        add = function (key, valueOrFunction) {
            // If value is a function, invoke it and use its return value
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;

            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };

    // If an array was passed in, assume that it is an array of form elements.
    if (Array.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
        // Serialize the form elements
        jQuery.each(a, function () {
            add(this.name, this.value);
        });
    } else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
        }
    }

    // Return the resulting serialization
    return s.join("&");
};

jQuery.fn.extend({
    serialize: function () {
        return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
        return this.map(function () {
            // Can add propHook for "elements" to filter or add form elements
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
        })
            .filter(function () {
                var type = this.type;

                // Use .is( ":disabled" ) so that fieldset[disabled] works
                return (
                    this.name &&
                    !jQuery(this).is(":disabled") &&
                    rsubmittable.test(this.nodeName) &&
                    !rsubmitterTypes.test(type) &&
                    (this.checked || !rcheckableType.test(type))
                );
            })
            .map(function (i, elem) {
                var val = jQuery(this).val();

                if (val == null) {
                    return null;
                }

                if (Array.isArray(val)) {
                    return jQuery.map(val, function (val) {
                        return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
                    });
                }

                return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            })
            .get();
    },
});

jQuery.fn.extend({
    wrapAll: function (html) {
        var wrap;

        if (this[0]) {
            if (isFunction(html)) {
                html = html.call(this[0]);
            }

            // The elements to wrap the target around
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

            if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
            }

            wrap.map(function () {
                var elem = this;

                while (elem.firstElementChild) {
                    elem = elem.firstElementChild;
                }

                return elem;
            }).append(this);
        }

        return this;
    },

    wrapInner: function (html) {
        if (isFunction(html)) {
            return this.each(function (i) {
                jQuery(this).wrapInner(html.call(this, i));
            });
        }

        return this.each(function () {
            var self = jQuery(this),
                contents = self.contents();

            if (contents.length) {
                contents.wrapAll(html);
            } else {
                self.append(html);
            }
        });
    },

    wrap: function (html) {
        var htmlIsFunction = isFunction(html);

        return this.each(function (i) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
        });
    },

    unwrap: function (selector) {
        this.parent(selector)
            .not("body")
            .each(function () {
                jQuery(this).replaceWith(this.childNodes);
            });
        return this;
    },
});

jQuery.expr.pseudos.hidden = function (elem) {
    return !jQuery.expr.pseudos.visible(elem);
};
jQuery.expr.pseudos.visible = function (elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};

// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = (function () {
    var body = document.implementation.createHTMLDocument("").body;
    body.innerHTML = "<form></form><form></form>";
    return body.childNodes.length === 2;
})();

// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function (data, context, keepScripts) {
    if (typeof data !== "string") {
        return [];
    }
    if (typeof context === "boolean") {
        keepScripts = context;
        context = false;
    }

    var base, parsed, scripts;

    if (!context) {
        // Stop scripts or inline event handlers from being executed immediately
        // by using document.implementation
        if (support.createHTMLDocument) {
            context = document.implementation.createHTMLDocument("");

            // Set the base href for the created document
            // so any parsed elements with URLs
            // are based on the document's URL (gh-2965)
            base = context.createElement("base");
            base.href = document.location.href;
            context.head.appendChild(base);
        } else {
            context = document;
        }
    }

    parsed = rsingleTag.exec(data);
    scripts = !keepScripts && [];

    // Single tag
    if (parsed) {
        return [context.createElement(parsed[1])];
    }

    parsed = buildFragment([data], context, scripts);

    if (scripts && scripts.length) {
        jQuery(scripts).remove();
    }

    return jQuery.merge([], parsed.childNodes);
};

jQuery.offset = {
    setOffset: function (elem, options, i) {
        var curPosition,
            curLeft,
            curCSSTop,
            curTop,
            curOffset,
            curCSSLeft,
            calculatePosition,
            position = jQuery.css(elem, "position"),
            curElem = jQuery(elem),
            props = {};

        // Set position first, in-case top/left are set even on static elem
        if (position === "static") {
            elem.style.position = "relative";
        }

        curOffset = curElem.offset();
        curCSSTop = jQuery.css(elem, "top");
        curCSSLeft = jQuery.css(elem, "left");
        calculatePosition =
            (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

        // Need to be able to calculate position if either
        // top or left is auto and position is either absolute or fixed
        if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
        }

        if (isFunction(options)) {
            // Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
            options = options.call(elem, i, jQuery.extend({}, curOffset));
        }

        if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
        }
        if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
        }

        if ("using" in options) {
            options.using.call(elem, props);
        } else {
            curElem.css(props);
        }
    },
};

jQuery.fn.extend({
    // offset() relates an element's border box to the document origin
    offset: function (options) {
        // Preserve chaining for setter
        if (arguments.length) {
            return options === undefined
                ? this
                : this.each(function (i) {
                      jQuery.offset.setOffset(this, options, i);
                  });
        }

        var rect,
            win,
            elem = this[0];

        if (!elem) {
            return;
        }

        // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
        // Support: IE <=11 only
        // Running getBoundingClientRect on a
        // disconnected node in IE throws an error
        if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
        }

        // Get document-relative position by adding viewport scroll to viewport-relative gBCR
        rect = elem.getBoundingClientRect();
        win = elem.ownerDocument.defaultView;
        return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset,
        };
    },

    // position() relates an element's margin box to its offset parent's padding box
    // This corresponds to the behavior of CSS absolute positioning
    position: function () {
        if (!this[0]) {
            return;
        }

        var offsetParent,
            offset,
            doc,
            elem = this[0],
            parentOffset = { top: 0, left: 0 };

        // position:fixed elements are offset from the viewport, which itself always has zero offset
        if (jQuery.css(elem, "position") === "fixed") {
            // Assume position:fixed implies availability of getBoundingClientRect
            offset = elem.getBoundingClientRect();
        } else {
            offset = this.offset();

            // Account for the *real* offset parent, which can be the document or its root element
            // when a statically positioned element is identified
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (
                offsetParent &&
                (offsetParent === doc.body || offsetParent === doc.documentElement) &&
                jQuery.css(offsetParent, "position") === "static"
            ) {
                offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                // Incorporate borders into its offset, since they are outside its content origin
                parentOffset = jQuery(offsetParent).offset();
                parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
        }

        // Subtract parent offsets and element margins
        return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true),
        };
    },

    // This method will return documentElement in the following cases:
    // 1) For the element inside the iframe without offsetParent, this method will return
    //    documentElement of the parent window
    // 2) For the hidden or detached element
    // 3) For body or html element, i.e. in case of the html node - it will return itself
    //
    // but those exceptions were never presented as a real life use-cases
    // and might be considered as more preferable results.
    //
    // This logic, however, is not guaranteed and can change at any point in the future
    offsetParent: function () {
        return this.map(function () {
            var offsetParent = this.offsetParent;

            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
            }

            return offsetParent || documentElement;
        });
    },
});

// Create scrollLeft and scrollTop methods
jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
    var top = "pageYOffset" === prop;

    jQuery.fn[method] = function (val) {
        return access(
            this,
            function (elem, method, val) {
                // Coalesce documents and windows
                var win;
                if (isWindow(elem)) {
                    win = elem;
                } else if (elem.nodeType === 9) {
                    win = elem.defaultView;
                }

                if (val === undefined) {
                    return win ? win[prop] : elem[method];
                }

                if (win) {
                    win.scrollTo(!top ? val : win.pageXOffset, top ? val : win.pageYOffset);
                } else {
                    elem[method] = val;
                }
            },
            method,
            val,
            arguments.length
        );
    };
});

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each(["top", "left"], function (i, prop) {
    jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function (elem, computed) {
        if (computed) {
            computed = curCSS(elem, prop);

            // If curCSS returns percentage, fallback to offset
            return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
        }
    });
});

// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
    jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name }, function (defaultExtra, funcName) {
        // Margin is only for outerHeight, outerWidth
        jQuery.fn[funcName] = function (margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
                extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

            return access(
                this,
                function (elem, type, value) {
                    var doc;

                    if (isWindow(elem)) {
                        // $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
                        return funcName.indexOf("outer") === 0
                            ? elem["inner" + name]
                            : elem.document.documentElement["client" + name];
                    }

                    // Get document width or height
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;

                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
                        // whichever is greatest
                        return Math.max(
                            elem.body["scroll" + name],
                            doc["scroll" + name],
                            elem.body["offset" + name],
                            doc["offset" + name],
                            doc["client" + name]
                        );
                    }

                    return value === undefined
                        ? // Get width or height on the element, requesting but not forcing parseFloat
                          jQuery.css(elem, type, extra)
                        : // Set width or height on the element
                          jQuery.style(elem, type, value, extra);
                },
                type,
                chainable ? margin : undefined,
                chainable
            );
        };
    });
});

jQuery.each(
    (
        "blur focus focusin focusout resize scroll click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup contextmenu"
    ).split(" "),
    function (i, name) {
        // Handle event binding
        jQuery.fn[name] = function (data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    }
);

jQuery.fn.extend({
    hover: function (fnOver, fnOut) {
        return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
    },
});

jQuery.fn.extend({
    bind: function (types, data, fn) {
        return this.on(types, null, data, fn);
    },
    unbind: function (types, fn) {
        return this.off(types, null, fn);
    },

    delegate: function (selector, types, data, fn) {
        return this.on(types, selector, data, fn);
    },
    undelegate: function (selector, types, fn) {
        // ( namespace ) or ( selector, types [, fn] )
        return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
    },
});

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function (fn, context) {
    var tmp, args, proxy;

    if (typeof context === "string") {
        tmp = fn[context];
        context = fn;
        fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if (!isFunction(fn)) {
        return undefined;
    }

    // Simulated bind
    args = slice.call(arguments, 2);
    proxy = function () {
        return fn.apply(context || this, args.concat(slice.call(arguments)));
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
};

jQuery.holdReady = function (hold) {
    if (hold) {
        jQuery.readyWait++;
    } else {
        jQuery.ready(true);
    }
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function (obj) {
    // As of jQuery 3.0, isNumeric is limited to
    // strings and numbers (primitives or objects)
    // that can be coerced to finite numbers (gh-2662)
    var type = jQuery.type(obj);
    return (
        (type === "number" || type === "string") &&
        // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj))
    );
};

const $ = jQuery;

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const httpMessages = {
    "401": "Access unauthorized",
    "403": "Access forbidden",
    "404": "Not found",
};

const AlertDialog = function ($parent) {
    const self = this;

    // container
    this.$container = $("<div>", { class: "igv-alert-dialog-container" });
    $parent.append(this.$container);

    // header
    let $header = $("<div>");
    this.$container.append($header);

    // body container
    let $div = $("<div>", { id: "igv-alert-dialog-body" });
    this.$container.append($div);

    // body copy
    this.$body = $("<div>", { id: "igv-alert-dialog-body-copy" });
    $div.append(this.$body);

    // ok container
    let $ok_container = $("<div>");
    this.$container.append($ok_container);

    // ok
    this.$ok = $("<div>");
    $ok_container.append(this.$ok);
    this.$ok.text("OK");
    this.$ok.on("click", function () {
        self.$body.html("");
        self.$container.hide();
    });

    this.$container.hide();
};

AlertDialog.prototype.configure = function (config) {
    this.$body.html(config.label);
};

AlertDialog.prototype.present = function (alert, callback) {
    const self = this;
    let string = alert.message || alert;
    if (httpMessages.hasOwnProperty(string)) {
        string = httpMessages[string];
    }
    this.$body.html(string);
    this.$ok.on("click", function () {
        if (typeof callback === "function") {
            callback("OK");
        }
        self.$body.html("");
        self.$container.hide();
    });
    this.$container.show();
};

// The global Alert dialog

let alertDialog;

const Alert = {
    init($root) {
        if (!alertDialog) {
            alertDialog = new AlertDialog($root);
        }
    },

    presentAlert: function (alert, callback) {
        alertDialog.present(alert, callback);
    },
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var BLACK = 1;
var RED = 2;

var NIL = {};
NIL.color = BLACK;
NIL.parent = NIL;
NIL.left = NIL;
NIL.right = NIL;

const IntervalTree = function () {
    this.root = NIL;
};

IntervalTree.prototype.insert = function (start, end, value) {
    var interval = new Interval(start, end, value);
    var x = new Node(interval);
    this.treeInsert(x);
    x.color = RED;
    while (x !== this.root && x.parent.color === RED) {
        if (x.parent === x.parent.parent.left) {
            let y = x.parent.parent.right;
            if (y.color === RED) {
                x.parent.color = BLACK;
                y.color = BLACK;
                x.parent.parent.color = RED;
                x = x.parent.parent;
            } else {
                if (x === x.parent.right) {
                    x = x.parent;
                    leftRotate.call(this, x);
                }
                x.parent.color = BLACK;
                x.parent.parent.color = RED;
                rightRotate.call(this, x.parent.parent);
            }
        } else {
            let y = x.parent.parent.left;
            if (y.color === RED) {
                x.parent.color = BLACK;
                y.color = BLACK;
                x.parent.parent.color = RED;
                x = x.parent.parent;
            } else {
                if (x === x.parent.left) {
                    x = x.parent;
                    rightRotate.call(this, x);
                }
                x.parent.color = BLACK;
                x.parent.parent.color = RED;
                leftRotate.call(this, x.parent.parent);
            }
        }
    }
    this.root.color = BLACK;
};

/**
 *
 * @param start - query interval
 * @param end - query interval
 * @returns Array of all intervals overlapping the query region
 */
IntervalTree.prototype.findOverlapping = function (start, end) {
    var searchInterval = new Interval(start, end, 0);

    if (this.root === NIL) return [];

    var intervals = searchAll.call(this, searchInterval, this.root, []);

    if (intervals.length > 1) {
        intervals.sort(function (i1, i2) {
            return i1.low - i2.low;
        });
    }

    return intervals;
};

/**
 * Dump info on intervals to console.  For debugging.
 */
IntervalTree.prototype.logIntervals = function () {
    logNode(this.root);

    function logNode(node, indent) {
        if (node.left !== NIL) logNode(node.left);
        if (node.right !== NIL) logNode(node.right);
    }
};

IntervalTree.prototype.mapIntervals = function (func) {
    applyInterval(this.root);

    function applyInterval(node) {
        func(node.interval);

        if (node.left !== NIL) applyInterval(node.left);
        if (node.right !== NIL) applyInterval(node.right);
    }
};

function searchAll(interval, node, results) {
    if (node.interval.overlaps(interval)) {
        results.push(node.interval);
    }

    if (node.left !== NIL && node.left.max >= interval.low) {
        searchAll.call(this, interval, node.left, results);
    }

    if (node.right !== NIL && node.right.min <= interval.high) {
        searchAll.call(this, interval, node.right, results);
    }

    return results;
}

function leftRotate(x) {
    var y = x.right;
    x.right = y.left;
    if (y.left !== NIL) {
        y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === NIL) {
        this.root = y;
    } else {
        if (x.parent.left === x) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
    }
    y.left = x;
    x.parent = y;

    applyUpdate.call(this, x);
    // no need to apply update on y, since it'll y is an ancestor
    // of x, and will be touched by applyUpdate().
}

function rightRotate(x) {
    var y = x.left;
    x.left = y.right;
    if (y.right !== NIL) {
        y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === NIL) {
        this.root = y;
    } else {
        if (x.parent.right === x) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
    }
    y.right = x;
    x.parent = y;

    applyUpdate.call(this, x);
    // no need to apply update on y, since it'll y is an ancestor
    // of x, and will be touched by applyUpdate().
}

/**
 * Note:  Does not maintain RB constraints,  this is done post insert
 *
 * @param x  a Node
 */
IntervalTree.prototype.treeInsert = function (x) {
    var node = this.root;
    var y = NIL;
    while (node !== NIL) {
        y = node;
        if (x.interval.low <= node.interval.low) {
            node = node.left;
        } else {
            node = node.right;
        }
    }
    x.parent = y;

    if (y === NIL) {
        this.root = x;
        x.left = x.right = NIL;
    } else {
        if (x.interval.low <= y.interval.low) {
            y.left = x;
        } else {
            y.right = x;
        }
    }

    applyUpdate.call(this, x);
};

// Applies the statistic update on the node and its ancestors.
function applyUpdate(node) {
    while (node !== NIL) {
        var nodeMax = node.left.max > node.right.max ? node.left.max : node.right.max;
        var intervalHigh = node.interval.high;
        node.max = nodeMax > intervalHigh ? nodeMax : intervalHigh;

        var nodeMin = node.left.min < node.right.min ? node.left.min : node.right.min;
        var intervalLow = node.interval.low;
        node.min = nodeMin < intervalLow ? nodeMin : intervalLow;

        node = node.parent;
    }
}

function Interval(low, high, value) {
    this.low = low;
    this.high = high;
    this.value = value;
}

Interval.prototype.equals = function (other) {
    if (!other) {
        return false;
    }
    if (this === other) {
        return true;
    }
    return this.low === other.low && this.high === other.high;
};

Interval.prototype.compareTo = function (other) {
    if (this.low < other.low) return -1;
    if (this.low > other.low) return 1;

    if (this.high < other.high) return -1;
    if (this.high > other.high) return 1;

    return 0;
};

/**
 * Returns true if this interval overlaps the other.
 */
Interval.prototype.overlaps = function (other) {
    try {
        return this.low <= other.high && other.low <= this.high;
    } catch (e) {
        //alert(e);
        Alert.presentAlert(e, undefined);
    }
};

function Node(interval) {
    this.parent = NIL;
    this.left = NIL;
    this.right = NIL;
    this.interval = interval;
    this.color = RED;
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 The Regents of the University of California
 * Author: Jim Robinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const FeatureUtils = {
    packFeatures: function (features, maxRows, sorted) {
        var start;
        var end;

        if (!features) return;

        maxRows = maxRows || 10000;

        if (!sorted) {
            features.sort(function (a, b) {
                return a.start - b.start;
            });
        }

        if (features.length === 0) {
            return [];
        } else {
            var bucketList = [],
                allocatedCount = 0,
                lastAllocatedCount = 0,
                nextStart,
                row,
                index,
                bucket,
                feature,
                gap = 2,
                bucketStart;

            start = features[0].start;
            end = features[features.length - 1].start;

            bucketStart = Math.max(start, features[0].start);
            nextStart = bucketStart;

            features.forEach(function (alignment) {
                var buckListIndex = Math.max(0, alignment.start - bucketStart);
                if (bucketList[buckListIndex] === undefined) {
                    bucketList[buckListIndex] = [];
                }
                bucketList[buckListIndex].push(alignment);
            });

            row = 0;

            while (allocatedCount < features.length && row <= maxRows) {
                while (nextStart <= end) {
                    bucket = undefined;

                    while (!bucket && nextStart <= end) {
                        index = nextStart - bucketStart;
                        if (bucketList[index] === undefined) {
                            ++nextStart; // No buckets at this index
                        } else {
                            bucket = bucketList[index];
                        }
                    } // while (bucket)

                    if (!bucket) {
                        break;
                    }
                    feature = bucket.pop();
                    if (0 === bucket.length) {
                        bucketList[index] = undefined;
                    }

                    feature.row = row;

                    nextStart = feature.end + gap;
                    ++allocatedCount;
                } // while (nextStart)

                row++;
                nextStart = bucketStart;

                if (allocatedCount === lastAllocatedCount) break; // Protect from infinite loops

                lastAllocatedCount = allocatedCount;
            } // while (allocatedCount)
        }
    },

    /**
     * Find features overlapping the given interval.  It is assumed that all features share the same chromosome.
     *
     * TODO -- significant overlap with FeatureCache, refactor to combine
     *
     * @param featureList
     * @param start
     * @param end
     */
    findOverlapping: function (featureList, start, end) {
        if (!featureList || featureList.length === 0) {
            return [];
        } else {
            const tree = buildIntervalTree(featureList);
            const intervals = tree.findOverlapping(start, end);

            if (intervals.length === 0) {
                return [];
            } else {
                // Trim the list of features in the intervals to those
                // overlapping the requested range.
                // Assumption: features are sorted by start position

                featureList = [];

                intervals.forEach(function (interval) {
                    const intervalFeatures = interval.value;
                    const len = intervalFeatures.length;
                    for (let i = 0; i < len; i++) {
                        const feature = intervalFeatures[i];
                        if (feature.start > end) break;
                        else if (feature.end > start) {
                            featureList.push(feature);
                        }
                    }
                });

                featureList.sort(function (a, b) {
                    return a.start - b.start;
                });

                return featureList;
            }
        }
    },
};

/**
 * Build an interval tree from the feature list for fast interval based queries.   We lump features in groups
 * of 10, or total size / 100,   to reduce size of the tree.
 *
 * @param featureList
 */
function buildIntervalTree(featureList) {
    const tree = new IntervalTree();
    const len = featureList.length;
    const chunkSize = Math.max(10, Math.round(len / 100));

    featureList.sort(function (f1, f2) {
        return f1.start === f2.start ? 0 : f1.start > f2.start ? 1 : -1;
    });

    for (let i = 0; i < len; i += chunkSize) {
        const e = Math.min(len, i + chunkSize);
        const subArray = featureList.slice(i, e);
        const iStart = subArray[0].start;
        let iEnd = iStart;
        subArray.forEach(function (feature) {
            iEnd = Math.max(iEnd, feature.end);
        });
        tree.insert(iStart, iEnd, subArray);
    }

    return tree;
}

/**
 * Return the filename from the path.   Example
 *   https://foo.com/bar.bed?param=2   => bar.bed
 * @param path
 */

function getFilename(path) {
    var index, filename;

    if (path instanceof File) {
        return path.name;
    } else {
        index = path.lastIndexOf("/");
        filename = index < 0 ? path : path.substr(index + 1);

        //Strip parameters -- handle local files later
        index = filename.indexOf("?");
        if (index > 0) {
            filename = filename.substr(0, index);
        }
        return filename;
    }
}

function isFilePath(path) {
    return path instanceof File;
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const extend = function (parent, child) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
    child.prototype._super = Object.getPrototypeOf(child.prototype);
    return child;
};

/**
 * Test if the given value is a string or number.  Not using typeof as it fails on boxed primitives.
 *
 * @param value
 * @returns boolean
 */

function isSimpleType(value) {
    const simpleTypes = new Set(["boolean", "number", "string", "symbol"]);
    const valueType = typeof value;
    return value !== undefined && (simpleTypes.has(valueType) || value.substring || value.toFixed);
}

function buildOptions(config, options) {
    var defaultOptions = {
        oauthToken: config.oauthToken,
        headers: config.headers,
        withCredentials: config.withCredentials,
        filename: config.filename,
    };

    return Object.assign(defaultOptions, options);
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Regents of the University of California
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * A collection of properties and methods shared by all (or most) track types.   Used as a mixin
 * by prototype chaining.
 *
 * @param config
 * @param browser
 * @constructor
 */
const TrackBase = function (config, browser) {
    if (config.displayMode) {
        config.displayMode = config.displayMode.toUpperCase();
    }

    this.config = config;
    this.browser = browser;
    this.url = config.url;
    this.type = config.type;
    this.description = config.description;
    this.supportHiDPI = config.supportHiDPI === undefined ? true : config.supportHiDPI;

    config.name = config.name || config.label; // synonym for name, label is deprecated
    if (config.name) {
        this.name = config.name;
    } else {
        if (isFilePath(config.url)) this.name = config.url.name;
        else this.name = config.url;
    }

    this.order = config.order;

    if ("civic-ws" === config.sourceType) {
        // Ugly proxy for specialized track type
        this.color = "rgb(155,20,20)";
    } else {
        this.color = config.color || config.defaultColor || "rgb(0,0,150)";
    }

    this.autoscaleGroup = config.autoscaleGroup;

    this.removable = config.removable === undefined ? true : config.removable; // Defaults to true

    this.height = config.height || 100;
    this.autoHeight = config.autoHeight;
    this.minHeight = config.minHeight || Math.min(25, this.height);
    this.maxHeight = config.maxHeight || Math.max(1000, this.height);

    this.visibilityWindow = config.visibilityWindow;
};

/**
 * Default implementation -- return the current state of the "this" object, which should be a this.  Used
 * to create session object for bookmarking, sharing.  Updates the track "config" object to reflect the
 * current state.  Only simple properties (string, number, boolean) are updated.
 */
TrackBase.prototype.getState = function () {
    const config = Object.assign({}, this.config);
    const self = this;

    Object.keys(config).forEach(function (key) {
        const value = self[key];
        if (value && (isSimpleType(value) || typeof value === "boolean")) {
            config[key] = value;
        }
    });

    return config;
};

TrackBase.prototype.supportsWholeGenome = function () {
    return false;
};

TrackBase.prototype.clickedFeatures = function (clickState) {
    // We use the cached features rather than method to avoid async load.  If the
    // feature is not already loaded this won't work,  but the user wouldn't be mousing over it either.
    const features = clickState.viewport.getCachedFeatures();

    if (!features || features.length === 0) {
        return [];
    }

    const genomicLocation = clickState.genomicLocation;

    // When zoomed out we need some tolerance around genomicLocation
    const tolerance = clickState.referenceFrame.bpPerPixel > 0.2 ? 3 * clickState.referenceFrame.bpPerPixel : 0;
    const ss = Math.floor(genomicLocation) - tolerance;
    const ee = Math.floor(genomicLocation) + tolerance;
    return FeatureUtils.findOverlapping(features, ss, ee);
};

/**
 * Set certain track properties, usually from a "track" line.  Not all UCSC properties are supported.
 * @param properties
 */
TrackBase.prototype.setTrackProperties = function (properties) {
    for (let key of Object.keys(properties)) {
        switch (key) {
            case "name":
            case "useScore":
                this[key] = properties[key];
                break;
            case "visibility":
                //0 - hide, 1 - dense, 2 - full, 3 - pack, and 4 - squish
                switch (properties[key]) {
                    case "2":
                    case "3":
                    case "pack":
                    case "full":
                        this.displayMode = "EXPANDED";
                        break;
                    case "4":
                    case "squish":
                        this.displayMode = "SQUISHED";
                        break;
                    case "1":
                    case "dense":
                        this.displayMode = "COLLAPSED";
                }
                break;
            case "color":
            case "altColor":
                this[key] = "rgb(" + properties[key] + ")";
                break;
            case "featureVisiblityWindow":
                this.visibilityWindow = Number.parseInt(properties[key]);
        }
    }
};

TrackBase.prototype.getVisibilityWindow = function () {
    return this.visibilityWindow;
};

/**
 * Default popup text function -- just extracts string and number properties in random order.
 * @param feature
 * @returns {Array}
 */
TrackBase.extractPopupData = function (feature, genomeId) {
    const filteredProperties = new Set(["row", "color"]);
    const data = [];

    let alleles, alleleFreqs;
    for (var property in feature) {
        if (feature.hasOwnProperty(property) && !filteredProperties.has(property) && isSimpleType(feature[property])) {
            let value = feature[property];
            if ("start" === property) value = value + 1;
            data.push({ name: property, value: value });

            if (property === "alleles") {
                alleles = feature[property];
            } else if (property === "alleleFreqs") {
                alleleFreqs = feature[property];
            }
        }
    }

    //const genomeId = this.getGenomeId()
    if (alleles && alleleFreqs) {
        if (alleles.endsWith(",")) {
            alleles = alleles.substr(0, alleles.length - 1);
        }
        if (alleleFreqs.endsWith(",")) {
            alleleFreqs = alleleFreqs.substr(0, alleleFreqs.length - 1);
        }

        let a = alleles.split(",");
        let af = alleleFreqs.split(",");
        if (af.length > 1) {
            let b = [];
            for (let i = 0; i < af.length; i++) {
                b.push({ a: a[i], af: Number.parseFloat(af[i]) });
            }
            b.sort(function (x, y) {
                return x.af - y.af;
            });

            let ref = b[b.length - 1].a;
            if (ref.length === 1) {
                for (let i = b.length - 2; i >= 0; i--) {
                    let alt = b[i].a;
                    if (alt.length === 1) {
                        const cravatLink = TrackBase.getCravatLink(feature.chr, feature.start + 1, ref, alt, genomeId);
                        if (cravatLink) {
                            data.push("<hr/>");
                            data.push(cravatLink);
                        }
                    }
                }
            }
        }
    }

    if (feature.attributes) {
        for (let key of Object.keys(feature.attributes)) {
            data.push({ name: key, value: feature.attributes[key] });
        }
    }

    return data;
};

TrackBase.prototype.getGenomeId = function () {
    return this.browser.genome ? this.browser.genome.id : undefined;
};

TrackBase.getCravatLink = function (chr, position, ref, alt, genomeID) {
    if ("hg38" === genomeID || "GRCh38" === genomeID) {
        const cravatChr = chr.startsWith("chr") ? chr : "chr" + chr;

        return (
            "<a target='_blank' " +
            "href='https://www.cravat.us/CRAVAT/variant.html?variant=" +
            cravatChr +
            "_" +
            position +
            "_+_" +
            ref +
            "_" +
            alt +
            "'>Cravat " +
            ref +
            "->" +
            alt +
            "</a>"
        );
    } else {
        return undefined;
    }
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of ctx software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and ctx permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const IGVGraphics = {
    setProperties: function (ctx, properties) {
        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var value = properties[key];
                ctx[key] = value;
            }
        }
    },

    strokeLine: function (ctx, x1, y1, x2, y2, properties) {
        x1 = Math.floor(x1) + 0.5;
        y1 = Math.floor(y1) + 0.5;
        x2 = Math.floor(x2) + 0.5;
        y2 = Math.floor(y2) + 0.5;

        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        if (properties) ctx.restore();
    },

    fillRect: function (ctx, x, y, w, h, properties) {
        x = Math.round(x);
        y = Math.round(y);

        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }

        ctx.fillRect(x, y, w, h);

        if (properties) ctx.restore();
    },

    fillPolygon: function (ctx, x, y, properties) {
        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }
        doPath(ctx, x, y);
        ctx.fill();
        if (properties) ctx.restore();
    },

    strokePolygon: function (ctx, x, y, properties) {
        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }
        doPath(ctx, x, y);
        ctx.stroke();
        if (properties) ctx.restore();
    },

    fillText: function (ctx, text, x, y, properties, transforms) {
        if (properties || transforms) {
            ctx.save();
        }

        if (properties) {
            IGVGraphics.setProperties(ctx, properties);
        }

        if (transforms) {
            // Slow path with context saving and extra translate
            ctx.translate(x, y);

            for (var transform in transforms) {
                var value = transforms[transform];

                // TODO: Add error checking for robustness
                if (transform === "translate") {
                    ctx.translate(value["x"], value["y"]);
                }
                if (transform === "rotate") {
                    ctx.rotate((value["angle"] * Math.PI) / 180);
                }
            }

            ctx.fillText(text, 0, 0);
        } else {
            ctx.fillText(text, x, y);
        }

        if (properties || transforms) ctx.restore();
    },

    strokeText: function (ctx, text, x, y, properties, transforms) {
        if (properties || transforms) {
            ctx.save();
        }

        if (properties) {
            IGVGraphics.setProperties(ctx, properties);
        }

        if (transforms) {
            ctx.translate(x, y);

            for (var transform in transforms) {
                var value = transforms[transform];

                // TODO: Add error checking for robustness
                if (transform === "translate") {
                    ctx.translate(value["x"], value["y"]);
                }
                if (transform === "rotate") {
                    ctx.rotate((value["angle"] * Math.PI) / 180);
                }
            }

            ctx.strokeText(text, 0, 0);
        } else {
            ctx.strokeText(text, x, y);
        }

        if (properties || transforms) ctx.restore();
    },

    strokeCircle: function (ctx, x, y, radius, properties) {
        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (properties) ctx.restore();
    },

    fillCircle: function (ctx, x, y, radius, properties) {
        if (properties) {
            ctx.save();
            IGVGraphics.setProperties(ctx, properties);
        }
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        if (properties) ctx.restore();
    },

    drawArrowhead: function (ctx, x, y, size, lineWidth) {
        ctx.save();
        if (!size) {
            size = 5;
        }
        if (lineWidth) {
            ctx.lineWidth = lineWidth;
        }
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x, y + size / 2);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y - size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },

    dashedLine: function (ctx, x1, y1, x2, y2, dashLen, properties = {}) {
        if (dashLen === undefined) dashLen = 2;
        ctx.setLineDash([dashLen, dashLen]);
        IGVGraphics.strokeLine(ctx, x1, y1, x2, y2, properties);
        ctx.setLineDash([]);
    },

    roundRect: function (ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke == "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
    },
    polygon: function (ctx, x, y, fill, stroke) {
        if (typeof stroke == "undefined") {
            stroke = true;
        }

        ctx.beginPath();
        var len = x.length;
        ctx.moveTo(x[0], y[0]);
        for (var i = 1; i < len; i++) {
            ctx.lineTo(x[i], y[i]);
            // this.moveTo(x[i], y[i]);
        }

        ctx.closePath();
        if (stroke) {
            ctx.stroke();
        }
        if (fill) {
            ctx.fill();
        }
    },
};

function doPath(ctx, x, y) {
    var i,
        len = x.length;
    for (i = 0; i < len; i++) {
        x[i] = Math.round(x[i]);
        y[i] = Math.round(y[i]);
    }

    ctx.beginPath();
    ctx.moveTo(x[0], y[0]);
    for (i = 1; i < len; i++) {
        ctx.lineTo(x[i], y[i]);
    }
    ctx.closePath();
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2017 The Regents of the University of California
 * Author: Jim Robinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const IGVMath = {
    lerp: (v0, v1, t) => {
        return (1 - t) * v0 + t * v1;
    },

    mean: function (array) {
        var t = 0,
            n = 0,
            i;
        for (i = 0; i < array.length; i++) {
            if (!isNaN(array[i])) {
                t += array[i];
                n++;
            }
        }
        return n > 0 ? t / n : 0;
    },

    meanAndStdev: function (array) {
        var v,
            t = 0,
            t2 = 0,
            n = 0,
            i;

        for (i = 0; i < array.length; i++) {
            v = array[i];

            if (!isNaN(v)) {
                t += v;
                t2 += v * v;
                n++;
            }
        }
        return n > 0 ? { mean: t / n, stdev: Math.sqrt(t2 - (t * t) / n) } : { mean: 0, stdev: 0 };
    },

    median: function (numbers) {
        // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
        var median = 0,
            numsLen = numbers.length;
        numbers.sort();

        if (
            numsLen % 2 ===
            0 // is even
        ) {
            // average of two middle numbers
            median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
        } else {
            // is odd
            // middle number only
            median = numbers[(numsLen - 1) / 2];
        }

        return median;
    },

    // Fast percentile function for "p" near edges.  This needs profiled for p in middle (e.g. median)
    percentile: function (array, p) {
        if (array.length === 0) return undefined;

        var k = Math.floor(array.length * ((100 - p) / 100));
        if (k === 0) {
            array.sort(function (a, b) {
                return b - a;
            });
            return array[k];
        } else {
            return selectElement(array, k);
        }
    },

    clamp: function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    log2: function (x) {
        return Math.log(x) / Math.LN2;
    },
};

function selectElement(array, k) {
    // Credit Steve Hanov http://stevehanov.ca/blog/index.php?id=122
    var heap = new BinaryHeap(),
        i;

    for (i = 0; i < array.length; i++) {
        var item = array[i];

        // If we have not yet found k items, or the current item is larger than
        // the smallest item on the heap, add current item
        if (heap.content.length < k || item > heap.content[0]) {
            // If the heap is full, remove the smallest element on the heap.
            if (heap.content.length === k) {
                var r = heap.pop();
            }
            heap.push(item);
        }
    }

    return heap.content[0];
}

function BinaryHeap() {
    this.content = [];
}

BinaryHeap.prototype = {
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);
        // Allow it to bubble up.
        this.bubbleUp(this.content.length - 1);
    },

    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it sink down.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },

    remove: function (node) {
        var length = this.content.length;
        // To remove a value, we must search through the array to find
        // it.
        for (var i = 0; i < length; i++) {
            if (this.content[i] !== node) continue;
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            // If the element we popped was the one we needed to remove,
            // we're done.
            if (i === length - 1) break;
            // Otherwise, we replace the removed element with the popped
            // one, and allow it to float up or sink down as appropriate.
            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },

    size: function () {
        return this.content.length;
    },

    bubbleUp: function (n) {
        // Fetch the element that has to be moved.
        var element = this.content[n],
            score = element;
        // When at 0, an element can not go up any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            var parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= parent) break;

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    },

    sinkDown: function (n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = element;

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2,
                child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = child1;
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = child2;
                if (child2Score < (swap == null ? elemScore : child1Score)) swap = child2N;
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    },
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Object for caching lists of features.  Supports effecient queries for sub-range  (chr, start, end)
 *
 * @param featureList
 * @param The genomic range spanned by featureList (optional)
 * @constructor
 */

const FeatureCache = function (featureList, genome, range) {
    this.treeMap = this.buildTreeMap(featureList, genome);
    this.range = range;
    this.count = featureList.length;
};

FeatureCache.prototype.containsRange = function (genomicRange) {
    // No range means cache contains all features
    return this.range === undefined || this.range.contains(genomicRange.chr, genomicRange.start, genomicRange.end);
};

FeatureCache.prototype.queryFeatures = function (chr, start, end) {
    const tree = this.treeMap[chr];

    if (!tree) return [];

    const intervals = tree.findOverlapping(start, end);

    if (intervals.length === 0) {
        return [];
    } else {
        // Trim the list of features in the intervals to those
        // overlapping the requested range.
        // Assumption: features are sorted by start position

        const featureList = [];
        const all = this.allFeatures[chr];
        if (all) {
            for (let interval of intervals) {
                const indexRange = interval.value;
                for (let i = indexRange.start; i < indexRange.end; i++) {
                    let feature = all[i];
                    if (feature.start > end) break;
                    else if (feature.end >= start) {
                        featureList.push(feature);
                    }
                }
            }
            featureList.sort(function (a, b) {
                return a.start - b.start;
            });
        }
        return featureList;
    }
};

/**
 * Returns all features, unsorted.
 *
 * @returns {Array}
 */
FeatureCache.prototype.getAllFeatures = function () {
    return this.allFeatures;
};

FeatureCache.prototype.buildTreeMap = function (featureList, genome) {
    const treeMap = {};
    const chromosomes = [];
    this.allFeatures = {};

    if (featureList) {
        for (let feature of featureList) {
            let chr = feature.chr;
            // Translate to "official" name
            if (genome) {
                chr = genome.getChromosomeName(chr);
            }

            let geneList = this.allFeatures[chr];
            if (!geneList) {
                chromosomes.push(chr);
                geneList = [];
                this.allFeatures[chr] = geneList;
            }
            geneList.push(feature);
        }

        // Now build interval tree for each chromosome
        for (let chr of chromosomes) {
            const chrFeatures = this.allFeatures[chr];
            chrFeatures.sort(function (f1, f2) {
                return f1.start === f2.start ? 0 : f1.start > f2.start ? 1 : -1;
            });
            treeMap[chr] = buildIntervalTree$1(chrFeatures);
        }
    }

    return treeMap;
};

/**
 * Build an interval tree from the feature list for fast interval based queries.   We lump features in groups
 * of 10, or total size / 100,   to reduce size of the tree.
 *
 * @param featureList
 */
function buildIntervalTree$1(featureList) {
    const tree = new IntervalTree();
    const len = featureList.length;
    const chunkSize = Math.max(10, Math.round(len / 10));

    for (let i = 0; i < len; i += chunkSize) {
        const e = Math.min(len, i + chunkSize);
        const subArray = new IndexRange(i, e); //featureList.slice(i, e);
        const iStart = featureList[i].start;
        //
        let iEnd = iStart;
        for (let j = i; j < e; j++) {
            iEnd = Math.max(iEnd, featureList[j].end);
        }
        tree.insert(iStart, iEnd, subArray);
    }

    return tree;
}

class IndexRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

const GenomicInterval = function (chr, start, end, features) {
    this.chr = chr;
    this.start = start;
    this.end = end;
    this.features = features;
};

GenomicInterval.prototype.contains = function (chr, start, end) {
    return this.chr === chr && this.start <= start && this.end >= end;
};

GenomicInterval.prototype.containsRange = function (range) {
    return this.chr === range.chr && this.start <= range.start && this.end >= range.end;
};

/**
 * Configure item list for track "gear" menu.
 * @param trackView
 */
const MenuUtils = {
    trackMenuItemList: function (trackView) {
        const vizWindowTypes = new Set(["alignment", "annotation", "variant", "eqtl", "snp"]);

        const hasVizWindow = trackView.track.config && trackView.track.config.visibilityWindow !== undefined;

        let menuItems = [];

        if (trackView.track.config.type !== "sequence") {
            menuItems.push(trackRenameMenuItem(trackView));
            menuItems.push(trackHeightMenuItem(trackView));
        }

        if (doProvideColoSwatchWidget(trackView.track)) {
            menuItems.push(colorPickerMenuItem(trackView));
        }

        if (trackView.track.menuItemList) {
            menuItems = menuItems.concat(trackView.track.menuItemList());
        }

        if (hasVizWindow || vizWindowTypes.has(trackView.track.config.type)) {
            menuItems.push("<hr/>");
            menuItems.push(visibilityWindowMenuItem(trackView));
        }

        if (trackView.track.removable !== false) {
            menuItems.push("<hr/>");
            menuItems.push(trackRemovalMenuItem(trackView));
        }

        return menuItems;
    },

    dataRangeMenuItem: function (trackView) {
        var $e, clickHandler;

        $e = $("<div>");
        $e.text("Set data range");

        clickHandler = function () {
            trackView.browser.dataRangeDialog.configure({ trackView: trackView });
            trackView.browser.dataRangeDialog.present($(trackView.trackDiv));
        };

        return { object: $e, click: clickHandler };
    },

    trackMenuItemListHelper: function (itemList, $popover) {
        var list = [];

        if (itemList.length > 0) {
            list = itemList.map(function (item, i) {
                var $e;

                // name and object fields checked for backward compatibility
                if (item.name) {
                    $e = $("<div>");
                    $e.text(item.name);
                } else if (item.object) {
                    $e = item.object;
                } else if (typeof item.label === "string") {
                    $e = $("<div>");
                    $e.html(item.label);
                } else if (typeof item === "string") {
                    if (item.startsWith("<")) {
                        $e = $(item);
                    } else {
                        $e = $("<div>" + item + "</div>");
                    }
                }

                if (0 === i) {
                    $e.addClass("igv-track-menu-border-top");
                }

                if (item.click) {
                    $e.on("click", handleClick);
                    $e.on("touchend", function (e) {
                        handleClick(e);
                    });
                    $e.on("mouseup", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });

                    // eslint-disable-next-line no-inner-declarations
                    function handleClick(e) {
                        item.click(e);
                        $popover.hide();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }

                return { object: $e, init: item.init || undefined };
            });
        }

        return list;
    },
};

function doProvideColoSwatchWidget(track) {
    return (
        "alignment" === track.type || "annotation" === track.type || "variant" === track.type || "wig" === track.type
    );
}

function visibilityWindowMenuItem(trackView) {
    const menuClickHandler = function () {
        const dialogClickHandler = function () {
            let value = trackView.browser.inputDialog.$input.val().trim();

            if ("" === value || undefined === value) {
                value = -1;
            }

            value = Number.parseInt(value);

            trackView.track.visibilityWindow = value;
            trackView.track.config.visibilityWindow = value;

            trackView.updateViews();
        };

        trackView.browser.inputDialog.configure({
            label: "Visibility Window",
            input: trackView.track.visibilityWindow,
            click: dialogClickHandler,
        });
        trackView.browser.inputDialog.present($(trackView.trackDiv));
    };

    const $e = $("<div>");
    $e.text("Set visibility window");

    return { object: $e, click: menuClickHandler };
}

function trackRemovalMenuItem(trackView) {
    var $e, menuClickHandler;

    $e = $("<div>");
    $e.text("Remove track");

    menuClickHandler = function () {
        trackView.browser.removeTrack(trackView.track);
    };

    return { object: $e, click: menuClickHandler };
}

function colorPickerMenuItem(trackView) {
    var $e, clickHandler;

    $e = $("<div>");
    $e.text("Set track color");

    clickHandler = function () {
        trackView.presentColorPicker();
    };

    return {
        object: $e,
        click: clickHandler,
    };
}

function trackRenameMenuItem(trackView) {
    var $e, menuClickHandler;

    $e = $("<div>");
    $e.text("Set track name");

    menuClickHandler = function () {
        var dialogClickHandler;

        dialogClickHandler = function () {
            var value;

            value = trackView.browser.inputDialog.$input.val().trim();

            value = "" === value || undefined === value ? "untitled" : value;

            trackView.browser.setTrackLabelName(trackView, value);
        };

        trackView.browser.inputDialog.configure({
            label: "Track Name",
            input: getTrackLabelText(trackView.track) || "unnamed",
            click: dialogClickHandler,
        });
        trackView.browser.inputDialog.present($(trackView.trackDiv));
    };

    return { object: $e, click: menuClickHandler };
}

function trackHeightMenuItem(trackView) {
    var $e, menuClickHandler;

    $e = $("<div>");
    $e.text("Set track height");

    menuClickHandler = function () {
        var dialogClickHandler;

        dialogClickHandler = function () {
            var number;

            number = parseFloat(trackView.browser.inputDialog.$input.val(), 10);

            if (undefined !== number) {
                // If explicitly setting the height adust min or max, if neccessary.
                if (trackView.track.minHeight !== undefined && trackView.track.minHeight > number) {
                    trackView.track.minHeight = number;
                }
                if (trackView.track.maxHeight !== undefined && trackView.track.maxHeight < number) {
                    trackView.track.minHeight = number;
                }
                trackView.setTrackHeight(number, true, true);

                // Explicitly setting track height turns off autoHeight
                trackView.track.autoHeight = false;
            }
        };

        trackView.browser.inputDialog.configure({
            label: "Track Height",
            input: trackView.trackDiv.clientHeight,
            click: dialogClickHandler,
        });
        trackView.browser.inputDialog.present($(trackView.trackDiv));
    };

    return { object: $e, click: menuClickHandler };
}

function getTrackLabelText(track) {
    var vp, txt;

    vp = track.trackView.viewports[0];
    txt = vp.$trackLabel.text();

    return txt;
}

/**
 * Configure item list for contextual (right-click) track popup menu.
 * @param viewport
 * @param genomicLocation - (bp)
 * @param xOffset - (pixels) within track extent
 * @param yOffset - (pixels) within track extent
 */
// igv.trackContextMenuItemList = function (viewport, genomicLocation, xOffset, yOffset) {
//
//     var config,
//         menuItems;
//
//     config =
//         {
//             viewport: viewport,
//             genomicState: viewport.genomicState,
//             genomicLocation: genomicLocation,
//             x: xOffset,
//             y: yOffset
//         };
//
//     menuItems = [];
//     if (typeof viewport.trackView.track.contextMenuItemList === "function") {
//         menuItems = viewport.trackView.track.contextMenuItemList(config);
//     }
//
//     return menuItems;
// };

/**
 * Configure item for track "gear" menu.
 * @param trackView
 * @param menuItemLabel - menu item string
 * @param dialogLabelHandler - dialog label creation handler
 * @param dialogInputValue
 * @param dialogClickHandler
 */
// function trackMenuItem(trackView, menuItemLabel, dialogLabelHandler, dialogInputValue, dialogClickHandler) {
//
//     var $e,
//         clickHandler;
//
//     $e = $('<div>');
//
//     $e.text(menuItemLabel);
//
//     clickHandler = function () {
//
//         trackView.browser.inputDialog.configure(dialogLabelHandler, dialogInputValue, dialogClickHandler, undefined, undefined);
//         trackView.browser.inputDialog.show($(trackView.trackDiv));
//
//     };
//
//     return {object: $e, click: clickHandler};
// };

/**
 * @fileoverview Zlib namespace. Zlib の仕様に準拠した圧縮は Zlib.Deflate で実装
 * されている. これは Inflate との共存を考慮している為.
 */
const ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE = 65000;

var Zlib = {
    Huffman: {},
    Util: {},
    CRC32: {},
};

/**
 * Compression Method
 * @enum {number}
 */
Zlib.CompressionMethod = {
    DEFLATE: 8,
    RESERVED: 15,
};

/**
 * @param {Object=} opt_params options.
 * @constructor
 */
Zlib.Zip = function (opt_params) {
    opt_params = opt_params || {};
    /** @type {Array.<{
     *   buffer: !(Array.<number>|Uint8Array),
     *   option: Object,
     *   compressed: boolean,
     *   encrypted: boolean,
     *   size: number,
     *   crc32: number
     * }>} */
    this.files = [];
    /** @type {(Array.<number>|Uint8Array)} */
    this.comment = opt_params["comment"];
    /** @type {(Array.<number>|Uint8Array)} */
    this.password;
};

/**
 * @enum {number}
 */
Zlib.Zip.CompressionMethod = {
    STORE: 0,
    DEFLATE: 8,
};

/**
 * @enum {number}
 */
Zlib.Zip.OperatingSystem = {
    MSDOS: 0,
    UNIX: 3,
    MACINTOSH: 7,
};

/**
 * @enum {number}
 */
Zlib.Zip.Flags = {
    ENCRYPT: 0x0001,
    DESCRIPTOR: 0x0008,
    UTF8: 0x0800,
};

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.FileHeaderSignature = [0x50, 0x4b, 0x01, 0x02];

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.LocalFileHeaderSignature = [0x50, 0x4b, 0x03, 0x04];

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Zip.CentralDirectorySignature = [0x50, 0x4b, 0x05, 0x06];

/**
 * @param {Array.<number>|Uint8Array} input
 * @param {Object=} opt_params options.
 */
Zlib.Zip.prototype.addFile = function (input, opt_params) {
    opt_params = opt_params || {};
    /** @type {string} */
    var filename = opt_params["filename"];
    /** @type {boolean} */
    var compressed;
    /** @type {number} */
    var size = input.length;
    /** @type {number} */
    var crc32 = 0;

    if (input instanceof Array) {
        input = new Uint8Array(input);
    }

    // default
    if (typeof opt_params["compressionMethod"] !== "number") {
        opt_params["compressionMethod"] = Zlib.Zip.CompressionMethod.DEFLATE;
    }

    // その場で圧縮する場合
    if (opt_params["compress"]) {
        switch (opt_params["compressionMethod"]) {
            case Zlib.Zip.CompressionMethod.STORE:
                break;
            case Zlib.Zip.CompressionMethod.DEFLATE:
                crc32 = Zlib.CRC32.calc(input);
                input = this.deflateWithOption(input, opt_params);
                compressed = true;
                break;
            default:
                throw new Error("unknown compression method:" + opt_params["compressionMethod"]);
        }
    }

    this.files.push({
        buffer: input,
        option: opt_params,
        compressed: compressed,
        encrypted: false,
        size: size,
        crc32: crc32,
    });
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 */
Zlib.Zip.prototype.setPassword = function (password) {
    this.password = password;
};

Zlib.Zip.prototype.compress = function () {
    /** @type {Array.<{
     *   buffer: !(Array.<number>|Uint8Array),
     *   option: Object,
     *   compressed: boolean,
     *   encrypted: boolean,
     *   size: number,
     *   crc32: number
     * }>} */
    var files = this.files;
    /** @type {{
     *   buffer: !(Array.<number>|Uint8Array),
     *   option: Object,
     *   compressed: boolean,
     *   encrypted: boolean,
     *   size: number,
     *   crc32: number
     * }} */
    var file;
    /** @type {!(Array.<number>|Uint8Array)} */
    var output;
    /** @type {number} */
    var op1;
    /** @type {number} */
    var op2;
    /** @type {number} */
    var op3;
    /** @type {number} */
    var localFileSize = 0;
    /** @type {number} */
    var centralDirectorySize = 0;
    /** @type {number} */
    var endOfCentralDirectorySize;
    /** @type {number} */
    var offset;
    /** @type {number} */
    var needVersion;
    /** @type {number} */
    var flags;
    /** @type {Zlib.Zip.CompressionMethod} */
    var compressionMethod;
    /** @type {Date} */
    var date;
    /** @type {number} */
    var crc32;
    /** @type {number} */
    var size;
    /** @type {number} */
    var plainSize;
    /** @type {number} */
    var filenameLength;
    /** @type {number} */
    var extraFieldLength;
    /** @type {number} */
    var commentLength;
    /** @type {(Array.<number>|Uint8Array)} */
    var filename;
    /** @type {(Array.<number>|Uint8Array)} */
    var extraField;
    /** @type {(Array.<number>|Uint8Array)} */
    var comment;
    /** @type {(Array.<number>|Uint8Array)} */
    var buffer;
    /** @type {*} */
    var tmp;
    /** @type {Array.<number>|Uint32Array|Object} */
    var key;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {number} */
    var j;
    /** @type {number} */
    var jl;

    // ファイルの圧縮
    for (i = 0, il = files.length; i < il; ++i) {
        file = files[i];
        filenameLength = file.option["filename"] ? file.option["filename"].length : 0;
        extraFieldLength = file.option["extraField"] ? file.option["extraField"].length : 0;
        commentLength = file.option["comment"] ? file.option["comment"].length : 0;

        // 圧縮されていなかったら圧縮
        if (!file.compressed) {
            // 圧縮前に CRC32 の計算をしておく
            file.crc32 = Zlib.CRC32.calc(file.buffer);

            switch (file.option["compressionMethod"]) {
                case Zlib.Zip.CompressionMethod.STORE:
                    break;
                case Zlib.Zip.CompressionMethod.DEFLATE:
                    file.buffer = this.deflateWithOption(file.buffer, file.option);
                    file.compressed = true;
                    break;
                default:
                    throw new Error("unknown compression method:" + file.option["compressionMethod"]);
            }
        }

        // encryption
        if (file.option["password"] !== void 0 || this.password !== void 0) {
            // init encryption
            key = this.createEncryptionKey(file.option["password"] || this.password);

            // add header
            buffer = file.buffer;
            {
                tmp = new Uint8Array(buffer.length + 12);
                tmp.set(buffer, 12);
                buffer = tmp;
            }

            for (j = 0; j < 12; ++j) {
                buffer[j] = this.encode(key, i === 11 ? file.crc32 & 0xff : (Math.random() * 256) | 0);
            }

            // data encryption
            for (jl = buffer.length; j < jl; ++j) {
                buffer[j] = this.encode(key, buffer[j]);
            }
            file.buffer = buffer;
        }

        // 必要バッファサイズの計算
        localFileSize +=
            // local file header
            30 +
            filenameLength +
            // file data
            file.buffer.length;

        centralDirectorySize +=
            // file header
            46 + filenameLength + commentLength;
    }

    // end of central directory
    endOfCentralDirectorySize = 22 + (this.comment ? this.comment.length : 0);
    output = new Uint8Array(localFileSize + centralDirectorySize + endOfCentralDirectorySize);
    op1 = 0;
    op2 = localFileSize;
    op3 = op2 + centralDirectorySize;

    // ファイルの圧縮
    for (i = 0, il = files.length; i < il; ++i) {
        file = files[i];
        filenameLength = file.option["filename"] ? file.option["filename"].length : 0;
        extraFieldLength = 0; // TODO
        commentLength = file.option["comment"] ? file.option["comment"].length : 0;

        //-------------------------------------------------------------------------
        // local file header & file header
        //-------------------------------------------------------------------------

        offset = op1;

        // signature
        // local file header
        output[op1++] = Zlib.Zip.LocalFileHeaderSignature[0];
        output[op1++] = Zlib.Zip.LocalFileHeaderSignature[1];
        output[op1++] = Zlib.Zip.LocalFileHeaderSignature[2];
        output[op1++] = Zlib.Zip.LocalFileHeaderSignature[3];
        // file header
        output[op2++] = Zlib.Zip.FileHeaderSignature[0];
        output[op2++] = Zlib.Zip.FileHeaderSignature[1];
        output[op2++] = Zlib.Zip.FileHeaderSignature[2];
        output[op2++] = Zlib.Zip.FileHeaderSignature[3];

        // compressor info
        needVersion = 20;
        output[op2++] = needVersion & 0xff;
        output[op2++] =
            /** @type {Zlib.Zip.OperatingSystem} */
            (file.option["os"]) || Zlib.Zip.OperatingSystem.MSDOS;

        // need version
        output[op1++] = output[op2++] = needVersion & 0xff;
        output[op1++] = output[op2++] = (needVersion >> 8) & 0xff;

        // general purpose bit flag
        flags = 0;
        if (file.option["password"] || this.password) {
            flags |= Zlib.Zip.Flags.ENCRYPT;
        }
        output[op1++] = output[op2++] = flags & 0xff;
        output[op1++] = output[op2++] = (flags >> 8) & 0xff;

        // compression method
        compressionMethod =
            /** @type {Zlib.Zip.CompressionMethod} */
            (file.option["compressionMethod"]);
        output[op1++] = output[op2++] = compressionMethod & 0xff;
        output[op1++] = output[op2++] = (compressionMethod >> 8) & 0xff;

        // date
        date = /** @type {(Date|undefined)} */ (file.option["date"]) || new Date();
        output[op1++] = output[op2++] = ((date.getMinutes() & 0x7) << 5) | ((date.getSeconds() / 2) | 0);
        output[op1++] = output[op2++] = (date.getHours() << 3) | (date.getMinutes() >> 3);
        //
        output[op1++] = output[op2++] = (((date.getMonth() + 1) & 0x7) << 5) | date.getDate();
        output[op1++] = output[op2++] = (((date.getFullYear() - 1980) & 0x7f) << 1) | ((date.getMonth() + 1) >> 3);

        // CRC-32
        crc32 = file.crc32;
        output[op1++] = output[op2++] = crc32 & 0xff;
        output[op1++] = output[op2++] = (crc32 >> 8) & 0xff;
        output[op1++] = output[op2++] = (crc32 >> 16) & 0xff;
        output[op1++] = output[op2++] = (crc32 >> 24) & 0xff;

        // compressed size
        size = file.buffer.length;
        output[op1++] = output[op2++] = size & 0xff;
        output[op1++] = output[op2++] = (size >> 8) & 0xff;
        output[op1++] = output[op2++] = (size >> 16) & 0xff;
        output[op1++] = output[op2++] = (size >> 24) & 0xff;

        // uncompressed size
        plainSize = file.size;
        output[op1++] = output[op2++] = plainSize & 0xff;
        output[op1++] = output[op2++] = (plainSize >> 8) & 0xff;
        output[op1++] = output[op2++] = (plainSize >> 16) & 0xff;
        output[op1++] = output[op2++] = (plainSize >> 24) & 0xff;

        // filename length
        output[op1++] = output[op2++] = filenameLength & 0xff;
        output[op1++] = output[op2++] = (filenameLength >> 8) & 0xff;

        // extra field length
        output[op1++] = output[op2++] = extraFieldLength & 0xff;
        output[op1++] = output[op2++] = (extraFieldLength >> 8) & 0xff;

        // file comment length
        output[op2++] = commentLength & 0xff;
        output[op2++] = (commentLength >> 8) & 0xff;

        // disk number start
        output[op2++] = 0;
        output[op2++] = 0;

        // internal file attributes
        output[op2++] = 0;
        output[op2++] = 0;

        // external file attributes
        output[op2++] = 0;
        output[op2++] = 0;
        output[op2++] = 0;
        output[op2++] = 0;

        // relative offset of local header
        output[op2++] = offset & 0xff;
        output[op2++] = (offset >> 8) & 0xff;
        output[op2++] = (offset >> 16) & 0xff;
        output[op2++] = (offset >> 24) & 0xff;

        // filename
        filename = file.option["filename"];
        if (filename) {
            {
                output.set(filename, op1);
                output.set(filename, op2);
                op1 += filenameLength;
                op2 += filenameLength;
            }
        }

        // extra field
        extraField = file.option["extraField"];
        if (extraField) {
            {
                output.set(extraField, op1);
                output.set(extraField, op2);
                op1 += extraFieldLength;
                op2 += extraFieldLength;
            }
        }

        // comment
        comment = file.option["comment"];
        if (comment) {
            {
                output.set(comment, op2);
                op2 += commentLength;
            }
        }

        //-------------------------------------------------------------------------
        // file data
        //-------------------------------------------------------------------------

        {
            output.set(file.buffer, op1);
            op1 += file.buffer.length;
        }
    }

    //-------------------------------------------------------------------------
    // end of central directory
    //-------------------------------------------------------------------------

    // signature
    output[op3++] = Zlib.Zip.CentralDirectorySignature[0];
    output[op3++] = Zlib.Zip.CentralDirectorySignature[1];
    output[op3++] = Zlib.Zip.CentralDirectorySignature[2];
    output[op3++] = Zlib.Zip.CentralDirectorySignature[3];

    // number of this disk
    output[op3++] = 0;
    output[op3++] = 0;

    // number of the disk with the start of the central directory
    output[op3++] = 0;
    output[op3++] = 0;

    // total number of entries in the central directory on this disk
    output[op3++] = il & 0xff;
    output[op3++] = (il >> 8) & 0xff;

    // total number of entries in the central directory
    output[op3++] = il & 0xff;
    output[op3++] = (il >> 8) & 0xff;

    // size of the central directory
    output[op3++] = centralDirectorySize & 0xff;
    output[op3++] = (centralDirectorySize >> 8) & 0xff;
    output[op3++] = (centralDirectorySize >> 16) & 0xff;
    output[op3++] = (centralDirectorySize >> 24) & 0xff;

    // offset of start of central directory with respect to the starting disk number
    output[op3++] = localFileSize & 0xff;
    output[op3++] = (localFileSize >> 8) & 0xff;
    output[op3++] = (localFileSize >> 16) & 0xff;
    output[op3++] = (localFileSize >> 24) & 0xff;

    // .ZIP file comment length
    commentLength = this.comment ? this.comment.length : 0;
    output[op3++] = commentLength & 0xff;
    output[op3++] = (commentLength >> 8) & 0xff;

    // .ZIP file comment
    if (this.comment) {
        {
            output.set(this.comment, op3);
            op3 += commentLength;
        }
    }

    return output;
};

/**
 * @param {!(Array.<number>|Uint8Array)} input
 * @param {Object=} opt_params options.
 * @return {!(Array.<number>|Uint8Array)}
 */
Zlib.Zip.prototype.deflateWithOption = function (input, opt_params) {
    /** @type {Zlib.RawDeflate} */
    var deflator = new Zlib.RawDeflate(input, opt_params["deflateOption"]);

    return deflator.compress();
};

/**
 * @param {(Array.<number>|Uint32Array)} key
 * @return {number}
 */
Zlib.Zip.prototype.getByte = function (key) {
    /** @type {number} */
    var tmp = (key[2] & 0xffff) | 2;

    return ((tmp * (tmp ^ 1)) >> 8) & 0xff;
};

/**
 * @param {(Array.<number>|Uint32Array|Object)} key
 * @param {number} n
 * @return {number}
 */
Zlib.Zip.prototype.encode = function (key, n) {
    /** @type {number} */
    var tmp = this.getByte(/** @type {(Array.<number>|Uint32Array)} */ (key));

    this.updateKeys(/** @type {(Array.<number>|Uint32Array)} */ (key), n);

    return tmp ^ n;
};

/**
 * @param {(Array.<number>|Uint32Array)} key
 * @param {number} n
 */
Zlib.Zip.prototype.updateKeys = function (key, n) {
    key[0] = Zlib.CRC32.single(key[0], n);
    key[1] = ((((((key[1] + (key[0] & 0xff)) * 20173) >>> 0) * 6681) >>> 0) + 1) >>> 0;
    key[2] = Zlib.CRC32.single(key[2], key[1] >>> 24);
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 * @return {!(Array.<number>|Uint32Array|Object)}
 */
Zlib.Zip.prototype.createEncryptionKey = function (password) {
    /** @type {!(Array.<number>|Uint32Array)} */
    var key = [305419896, 591751049, 878082192];
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    {
        key = new Uint32Array(key);
    }

    for (i = 0, il = password.length; i < il; ++i) {
        this.updateKeys(key, password[i] & 0xff);
    }

    return key;
};

/**
 * build huffman table from length list.
 * @param {!(Array.<number>|Uint8Array)} lengths length list.
 * @return {!Array} huffman table.
 */
Zlib.Huffman.buildHuffmanTable = function (lengths) {
    /** @type {number} length list size. */
    var listSize = lengths.length;
    /** @type {number} max code length for table size. */
    var maxCodeLength = 0;
    /** @type {number} min code length for table size. */
    var minCodeLength = Number.POSITIVE_INFINITY;
    /** @type {number} table size. */
    var size;
    /** @type {!(Array|Uint8Array)} huffman code table. */
    var table;
    /** @type {number} bit length. */
    var bitLength;
    /** @type {number} huffman code. */
    var code;
    /**
     * サイズが 2^maxlength 個のテーブルを埋めるためのスキップ長.
     * @type {number} skip length for table filling.
     */
    var skip;
    /** @type {number} reversed code. */
    var reversed;
    /** @type {number} reverse temp. */
    var rtemp;
    /** @type {number} loop counter. */
    var i;
    /** @type {number} loop limit. */
    var il;
    /** @type {number} loop counter. */
    var j;
    /** @type {number} table value. */
    var value;

    // Math.max は遅いので最長の値は for-loop で取得する
    for (i = 0, il = listSize; i < il; ++i) {
        if (lengths[i] > maxCodeLength) {
            maxCodeLength = lengths[i];
        }
        if (lengths[i] < minCodeLength) {
            minCodeLength = lengths[i];
        }
    }

    size = 1 << maxCodeLength;
    table = new Uint32Array(size);

    // ビット長の短い順からハフマン符号を割り当てる
    for (bitLength = 1, code = 0, skip = 2; bitLength <= maxCodeLength; ) {
        for (i = 0; i < listSize; ++i) {
            if (lengths[i] === bitLength) {
                // ビットオーダーが逆になるためビット長分並びを反転する
                for (reversed = 0, rtemp = code, j = 0; j < bitLength; ++j) {
                    reversed = (reversed << 1) | (rtemp & 1);
                    rtemp >>= 1;
                }

                // 最大ビット長をもとにテーブルを作るため、
                // 最大ビット長以外では 0 / 1 どちらでも良い箇所ができる
                // そのどちらでも良い場所は同じ値で埋めることで
                // 本来のビット長以上のビット数取得しても問題が起こらないようにする
                value = (bitLength << 16) | i;
                for (j = reversed; j < size; j += skip) {
                    table[j] = value;
                }

                ++code;
            }
        }

        // 次のビット長へ
        ++bitLength;
        code <<= 1;
        skip <<= 1;
    }

    return [table, maxCodeLength, minCodeLength];
};

//-----------------------------------------------------------------------------

/** @define {number} buffer block size. */
var ZLIB_RAW_INFLATE_BUFFER_SIZE = 0x8000; // [ 0x8000 >= ZLIB_BUFFER_BLOCK_SIZE ]

//-----------------------------------------------------------------------------

var buildHuffmanTable = Zlib.Huffman.buildHuffmanTable;

/**
 * @constructor
 * @param {!(Uint8Array|Array.<number>)} input input buffer.
 * @param {Object} opt_params option parameter.
 *
 * opt_params は以下のプロパティを指定する事ができます。
 *   - index: input buffer の deflate コンテナの開始位置.
 *   - blockSize: バッファのブロックサイズ.
 *   - bufferType: Zlib.RawInflate.BufferType の値によってバッファの管理方法を指定する.
 *   - resize: 確保したバッファが実際の大きさより大きかった場合に切り詰める.
 */
Zlib.RawInflate = function (input, opt_params) {
    /** @type {!(Array.<number>|Uint8Array)} inflated buffer */
    this.buffer;
    /** @type {!Array.<(Array.<number>|Uint8Array)>} */
    this.blocks = [];
    /** @type {number} block size. */
    this.bufferSize = ZLIB_RAW_INFLATE_BUFFER_SIZE;
    /** @type {!number} total output buffer pointer. */
    this.totalpos = 0;
    /** @type {!number} input buffer pointer. */
    this.ip = 0;
    /** @type {!number} bit stream reader buffer. */
    this.bitsbuf = 0;
    /** @type {!number} bit stream reader buffer size. */
    this.bitsbuflen = 0;
    /** @type {!(Array.<number>|Uint8Array)} input buffer. */
    this.input = new Uint8Array(input);
    /** @type {!(Uint8Array|Array.<number>)} output buffer. */
    this.output;
    /** @type {!number} output buffer pointer. */
    this.op;
    /** @type {boolean} is final block flag. */
    this.bfinal = false;
    /** @type {Zlib.RawInflate.BufferType} buffer management. */
    this.bufferType = Zlib.RawInflate.BufferType.ADAPTIVE;
    /** @type {boolean} resize flag for memory size optimization. */
    this.resize = false;

    // option parameters
    if (opt_params || !(opt_params = {})) {
        if (opt_params["index"]) {
            this.ip = opt_params["index"];
        }
        if (opt_params["bufferSize"]) {
            this.bufferSize = opt_params["bufferSize"];
        }
        if (opt_params["bufferType"]) {
            this.bufferType = opt_params["bufferType"];
        }
        if (opt_params["resize"]) {
            this.resize = opt_params["resize"];
        }
    }

    // initialize
    switch (this.bufferType) {
        case Zlib.RawInflate.BufferType.BLOCK:
            this.op = Zlib.RawInflate.MaxBackwardLength;
            this.output = new Uint8Array(
                Zlib.RawInflate.MaxBackwardLength + this.bufferSize + Zlib.RawInflate.MaxCopyLength
            );
            break;
        case Zlib.RawInflate.BufferType.ADAPTIVE:
            this.op = 0;
            this.output = new Uint8Array(this.bufferSize);
            break;
        default:
            throw new Error("invalid inflate mode");
    }
};

/**
 * @enum {number}
 */
Zlib.RawInflate.BufferType = {
    BLOCK: 0,
    ADAPTIVE: 1,
};

/**
 * decompress.
 * @return {!(Uint8Array|Array.<number>)} inflated buffer.
 */
Zlib.RawInflate.prototype.decompress = function () {
    while (!this.bfinal) {
        this.parseBlock();
    }

    switch (this.bufferType) {
        case Zlib.RawInflate.BufferType.BLOCK:
            return this.concatBufferBlock();
        case Zlib.RawInflate.BufferType.ADAPTIVE:
            return this.concatBufferDynamic();
        default:
            throw new Error("invalid inflate mode");
    }
};

/**
 * @const
 * @type {number} max backward length for LZ77.
 */
Zlib.RawInflate.MaxBackwardLength = 32768;

/**
 * @const
 * @type {number} max copy length for LZ77.
 */
Zlib.RawInflate.MaxCopyLength = 258;

/**
 * huffman order
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.Order = (function (table) {
    return new Uint16Array(table);
})([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

/**
 * huffman length code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflate.LengthCodeTable = (function (table) {
    return new Uint16Array(table);
})([
    0x0003,
    0x0004,
    0x0005,
    0x0006,
    0x0007,
    0x0008,
    0x0009,
    0x000a,
    0x000b,
    0x000d,
    0x000f,
    0x0011,
    0x0013,
    0x0017,
    0x001b,
    0x001f,
    0x0023,
    0x002b,
    0x0033,
    0x003b,
    0x0043,
    0x0053,
    0x0063,
    0x0073,
    0x0083,
    0x00a3,
    0x00c3,
    0x00e3,
    0x0102,
    0x0102,
    0x0102,
]);

/**
 * huffman length extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.LengthExtraTable = (function (table) {
    return new Uint8Array(table);
})([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0]);

/**
 * huffman dist code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflate.DistCodeTable = (function (table) {
    return new Uint16Array(table);
})([
    0x0001,
    0x0002,
    0x0003,
    0x0004,
    0x0005,
    0x0007,
    0x0009,
    0x000d,
    0x0011,
    0x0019,
    0x0021,
    0x0031,
    0x0041,
    0x0061,
    0x0081,
    0x00c1,
    0x0101,
    0x0181,
    0x0201,
    0x0301,
    0x0401,
    0x0601,
    0x0801,
    0x0c01,
    0x1001,
    0x1801,
    0x2001,
    0x3001,
    0x4001,
    0x6001,
]);

/**
 * huffman dist extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflate.DistExtraTable = (function (table) {
    return new Uint8Array(table);
})([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);

/**
 * fixed huffman length code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflate.FixedLiteralLengthTable = (function (table) {
    return table;
})(
    (function () {
        var lengths = new Uint8Array(288);
        var i, il;

        for (i = 0, il = lengths.length; i < il; ++i) {
            lengths[i] = i <= 143 ? 8 : i <= 255 ? 9 : i <= 279 ? 7 : 8;
        }

        return buildHuffmanTable(lengths);
    })()
);

/**
 * fixed huffman distance code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflate.FixedDistanceTable = (function (table) {
    return table;
})(
    (function () {
        var lengths = new Uint8Array(30);
        var i, il;

        for (i = 0, il = lengths.length; i < il; ++i) {
            lengths[i] = 5;
        }

        return buildHuffmanTable(lengths);
    })()
);

/**
 * parse deflated block.
 */
Zlib.RawInflate.prototype.parseBlock = function () {
    /** @type {number} header */
    var hdr = this.readBits(3);

    // BFINAL
    if (hdr & 0x1) {
        this.bfinal = true;
    }

    // BTYPE
    hdr >>>= 1;
    switch (hdr) {
        // uncompressed
        case 0:
            this.parseUncompressedBlock();
            break;
        // fixed huffman
        case 1:
            this.parseFixedHuffmanBlock();
            break;
        // dynamic huffman
        case 2:
            this.parseDynamicHuffmanBlock();
            break;
        // reserved or other
        default:
            throw new Error("unknown BTYPE: " + hdr);
    }
};

/**
 * read inflate bits
 * @param {number} length bits length.
 * @return {number} read bits.
 */
Zlib.RawInflate.prototype.readBits = function (length) {
    var bitsbuf = this.bitsbuf;
    var bitsbuflen = this.bitsbuflen;
    var input = this.input;
    var ip = this.ip;

    /** @type {number} */
    var inputLength = input.length;
    /** @type {number} input and output byte. */
    var octet;

    // input byte
    if (ip + ((length - bitsbuflen + 7) >> 3) >= inputLength) {
        throw new Error("input buffer is broken");
    }

    // not enough buffer
    while (bitsbuflen < length) {
        bitsbuf |= input[ip++] << bitsbuflen;
        bitsbuflen += 8;
    }

    // output byte
    octet = bitsbuf & /* MASK */ ((1 << length) - 1);
    bitsbuf >>>= length;
    bitsbuflen -= length;

    this.bitsbuf = bitsbuf;
    this.bitsbuflen = bitsbuflen;
    this.ip = ip;

    return octet;
};

/**
 * read huffman code using table
 * @param {!(Array.<number>|Uint8Array|Uint16Array)} table huffman code table.
 * @return {number} huffman code.
 */
Zlib.RawInflate.prototype.readCodeByTable = function (table) {
    var bitsbuf = this.bitsbuf;
    var bitsbuflen = this.bitsbuflen;
    var input = this.input;
    var ip = this.ip;

    /** @type {number} */
    var inputLength = input.length;
    /** @type {!(Array.<number>|Uint8Array)} huffman code table */
    var codeTable = table[0];
    /** @type {number} */
    var maxCodeLength = table[1];
    /** @type {number} code length & code (16bit, 16bit) */
    var codeWithLength;
    /** @type {number} code bits length */
    var codeLength;

    // not enough buffer
    while (bitsbuflen < maxCodeLength) {
        if (ip >= inputLength) {
            break;
        }
        bitsbuf |= input[ip++] << bitsbuflen;
        bitsbuflen += 8;
    }

    // read max length
    codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
    codeLength = codeWithLength >>> 16;

    if (codeLength > bitsbuflen) {
        throw new Error("invalid code length: " + codeLength);
    }

    this.bitsbuf = bitsbuf >> codeLength;
    this.bitsbuflen = bitsbuflen - codeLength;
    this.ip = ip;

    return codeWithLength & 0xffff;
};

/**
 * parse uncompressed block.
 */
Zlib.RawInflate.prototype.parseUncompressedBlock = function () {
    var input = this.input;
    var ip = this.ip;
    var output = this.output;
    var op = this.op;

    /** @type {number} */
    var inputLength = input.length;
    /** @type {number} block length */
    var len;
    /** @type {number} number for check block length */
    var nlen;
    /** @type {number} output buffer length */
    var olength = output.length;
    /** @type {number} copy counter */
    var preCopy;

    // skip buffered header bits
    this.bitsbuf = 0;
    this.bitsbuflen = 0;

    // len
    if (ip + 1 >= inputLength) {
        throw new Error("invalid uncompressed block header: LEN");
    }
    len = input[ip++] | (input[ip++] << 8);

    // nlen
    if (ip + 1 >= inputLength) {
        throw new Error("invalid uncompressed block header: NLEN");
    }
    nlen = input[ip++] | (input[ip++] << 8);

    // check len & nlen
    if (len === ~nlen) {
        throw new Error("invalid uncompressed block header: length verify");
    }

    // check size
    if (ip + len > input.length) {
        throw new Error("input buffer is broken");
    }

    // expand buffer
    switch (this.bufferType) {
        case Zlib.RawInflate.BufferType.BLOCK:
            // pre copy
            while (op + len > output.length) {
                preCopy = olength - op;
                len -= preCopy;
                {
                    output.set(input.subarray(ip, ip + preCopy), op);
                    op += preCopy;
                    ip += preCopy;
                }
                this.op = op;
                output = this.expandBufferBlock();
                op = this.op;
            }
            break;
        case Zlib.RawInflate.BufferType.ADAPTIVE:
            while (op + len > output.length) {
                output = this.expandBufferAdaptive({ fixRatio: 2 });
            }
            break;
        default:
            throw new Error("invalid inflate mode");
    }

    // copy
    {
        output.set(input.subarray(ip, ip + len), op);
        op += len;
        ip += len;
    }

    this.ip = ip;
    this.op = op;
    this.output = output;
};

/**
 * parse fixed huffman block.
 */
Zlib.RawInflate.prototype.parseFixedHuffmanBlock = function () {
    switch (this.bufferType) {
        case Zlib.RawInflate.BufferType.ADAPTIVE:
            this.decodeHuffmanAdaptive(Zlib.RawInflate.FixedLiteralLengthTable, Zlib.RawInflate.FixedDistanceTable);
            break;
        case Zlib.RawInflate.BufferType.BLOCK:
            this.decodeHuffmanBlock(Zlib.RawInflate.FixedLiteralLengthTable, Zlib.RawInflate.FixedDistanceTable);
            break;
        default:
            throw new Error("invalid inflate mode");
    }
};

/**
 * parse dynamic huffman block.
 */
Zlib.RawInflate.prototype.parseDynamicHuffmanBlock = function () {
    /** @type {number} number of literal and length codes. */
    var hlit = this.readBits(5) + 257;
    /** @type {number} number of distance codes. */
    var hdist = this.readBits(5) + 1;
    /** @type {number} number of code lengths. */
    var hclen = this.readBits(4) + 4;
    /** @type {!(Uint8Array|Array.<number>)} code lengths. */
    var codeLengths = new Uint8Array(Zlib.RawInflate.Order.length);
    /** @type {!Array} code lengths table. */
    var codeLengthsTable;
    /** @type {!(Uint8Array|Array.<number>)} literal and length code table. */
    var litlenTable;
    /** @type {!(Uint8Array|Array.<number>)} distance code table. */
    var distTable;
    /** @type {!(Uint8Array|Array.<number>)} code length table. */
    var lengthTable;
    /** @type {number} */
    var code;
    /** @type {number} */
    var prev;
    /** @type {number} */
    var repeat;
    /** @type {number} loop counter. */
    var i;
    /** @type {number} loop limit. */
    var il;

    // decode code lengths
    for (i = 0; i < hclen; ++i) {
        codeLengths[Zlib.RawInflate.Order[i]] = this.readBits(3);
    }

    // decode length table
    codeLengthsTable = buildHuffmanTable(codeLengths);
    lengthTable = new Uint8Array(hlit + hdist);
    for (i = 0, il = hlit + hdist; i < il; ) {
        code = this.readCodeByTable(codeLengthsTable);
        switch (code) {
            case 16:
                repeat = 3 + this.readBits(2);
                while (repeat--) {
                    lengthTable[i++] = prev;
                }
                break;
            case 17:
                repeat = 3 + this.readBits(3);
                while (repeat--) {
                    lengthTable[i++] = 0;
                }
                prev = 0;
                break;
            case 18:
                repeat = 11 + this.readBits(7);
                while (repeat--) {
                    lengthTable[i++] = 0;
                }
                prev = 0;
                break;
            default:
                lengthTable[i++] = code;
                prev = code;
                break;
        }
    }

    litlenTable = buildHuffmanTable(lengthTable.subarray(0, hlit));
    distTable = buildHuffmanTable(lengthTable.subarray(hlit));

    switch (this.bufferType) {
        case Zlib.RawInflate.BufferType.ADAPTIVE:
            this.decodeHuffmanAdaptive(litlenTable, distTable);
            break;
        case Zlib.RawInflate.BufferType.BLOCK:
            this.decodeHuffmanBlock(litlenTable, distTable);
            break;
        default:
            throw new Error("invalid inflate mode");
    }
};

/**
 * decode huffman code
 * @param {!(Array.<number>|Uint16Array)} litlen literal and length code table.
 * @param {!(Array.<number>|Uint8Array)} dist distination code table.
 */
Zlib.RawInflate.prototype.decodeHuffmanBlock = function (litlen, dist) {
    var output = this.output;
    var op = this.op;

    this.currentLitlenTable = litlen;

    /** @type {number} output position limit. */
    var olength = output.length - Zlib.RawInflate.MaxCopyLength;
    /** @type {number} huffman code. */
    var code;
    /** @type {number} table index. */
    var ti;
    /** @type {number} huffman code distination. */
    var codeDist;
    /** @type {number} huffman code length. */
    var codeLength;

    var lengthCodeTable = Zlib.RawInflate.LengthCodeTable;
    var lengthExtraTable = Zlib.RawInflate.LengthExtraTable;
    var distCodeTable = Zlib.RawInflate.DistCodeTable;
    var distExtraTable = Zlib.RawInflate.DistExtraTable;

    while ((code = this.readCodeByTable(litlen)) !== 256) {
        // literal
        if (code < 256) {
            if (op >= olength) {
                this.op = op;
                output = this.expandBufferBlock();
                op = this.op;
            }
            output[op++] = code;

            continue;
        }

        // length code
        ti = code - 257;
        codeLength = lengthCodeTable[ti];
        if (lengthExtraTable[ti] > 0) {
            codeLength += this.readBits(lengthExtraTable[ti]);
        }

        // dist code
        code = this.readCodeByTable(dist);
        codeDist = distCodeTable[code];
        if (distExtraTable[code] > 0) {
            codeDist += this.readBits(distExtraTable[code]);
        }

        // lz77 decode
        if (op >= olength) {
            this.op = op;
            output = this.expandBufferBlock();
            op = this.op;
        }
        while (codeLength--) {
            output[op] = output[op++ - codeDist];
        }
    }

    while (this.bitsbuflen >= 8) {
        this.bitsbuflen -= 8;
        this.ip--;
    }
    this.op = op;
};

/**
 * decode huffman code (adaptive)
 * @param {!(Array.<number>|Uint16Array)} litlen literal and length code table.
 * @param {!(Array.<number>|Uint8Array)} dist distination code table.
 */
Zlib.RawInflate.prototype.decodeHuffmanAdaptive = function (litlen, dist) {
    var output = this.output;
    var op = this.op;

    this.currentLitlenTable = litlen;

    /** @type {number} output position limit. */
    var olength = output.length;
    /** @type {number} huffman code. */
    var code;
    /** @type {number} table index. */
    var ti;
    /** @type {number} huffman code distination. */
    var codeDist;
    /** @type {number} huffman code length. */
    var codeLength;

    var lengthCodeTable = Zlib.RawInflate.LengthCodeTable;
    var lengthExtraTable = Zlib.RawInflate.LengthExtraTable;
    var distCodeTable = Zlib.RawInflate.DistCodeTable;
    var distExtraTable = Zlib.RawInflate.DistExtraTable;

    while ((code = this.readCodeByTable(litlen)) !== 256) {
        // literal
        if (code < 256) {
            if (op >= olength) {
                output = this.expandBufferAdaptive();
                olength = output.length;
            }
            output[op++] = code;

            continue;
        }

        // length code
        ti = code - 257;
        codeLength = lengthCodeTable[ti];
        if (lengthExtraTable[ti] > 0) {
            codeLength += this.readBits(lengthExtraTable[ti]);
        }

        // dist code
        code = this.readCodeByTable(dist);
        codeDist = distCodeTable[code];
        if (distExtraTable[code] > 0) {
            codeDist += this.readBits(distExtraTable[code]);
        }

        // lz77 decode
        if (op + codeLength > olength) {
            output = this.expandBufferAdaptive();
            olength = output.length;
        }
        while (codeLength--) {
            output[op] = output[op++ - codeDist];
        }
    }

    while (this.bitsbuflen >= 8) {
        this.bitsbuflen -= 8;
        this.ip--;
    }
    this.op = op;
};

/**
 * expand output buffer.
 * @param {Object=} opt_param option parameters.
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.expandBufferBlock = function (opt_param) {
    /** @type {!(Array.<number>|Uint8Array)} store buffer. */
    var buffer = new Uint8Array(this.op - Zlib.RawInflate.MaxBackwardLength);
    /** @type {number} backward base point */
    var backward = this.op - Zlib.RawInflate.MaxBackwardLength;

    var output = this.output;

    // copy to output buffer
    {
        buffer.set(output.subarray(Zlib.RawInflate.MaxBackwardLength, buffer.length));
    }

    this.blocks.push(buffer);
    this.totalpos += buffer.length;

    // copy to backward buffer
    {
        output.set(output.subarray(backward, backward + Zlib.RawInflate.MaxBackwardLength));
    }

    this.op = Zlib.RawInflate.MaxBackwardLength;

    return output;
};

/**
 * expand output buffer. (adaptive)
 * @param {Object=} opt_param option parameters.
 * @return {!(Array.<number>|Uint8Array)} output buffer pointer.
 */
Zlib.RawInflate.prototype.expandBufferAdaptive = function (opt_param) {
    /** @type {!(Array.<number>|Uint8Array)} store buffer. */
    var buffer;
    /** @type {number} expantion ratio. */
    var ratio = (this.input.length / this.ip + 1) | 0;
    /** @type {number} maximum number of huffman code. */
    var maxHuffCode;
    /** @type {number} new output buffer size. */
    var newSize;
    /** @type {number} max inflate size. */
    var maxInflateSize;

    var input = this.input;
    var output = this.output;

    if (opt_param) {
        if (typeof opt_param.fixRatio === "number") {
            ratio = opt_param.fixRatio;
        }
        if (typeof opt_param.addRatio === "number") {
            ratio += opt_param.addRatio;
        }
    }

    // calculate new buffer size
    if (ratio < 2) {
        maxHuffCode = (input.length - this.ip) / this.currentLitlenTable[2];
        maxInflateSize = ((maxHuffCode / 2) * 258) | 0;
        newSize = maxInflateSize < output.length ? output.length + maxInflateSize : output.length << 1;
    } else {
        newSize = output.length * ratio;
    }

    // buffer expantion
    {
        buffer = new Uint8Array(newSize);
        buffer.set(output);
    }

    this.output = buffer;

    return this.output;
};

/**
 * concat output buffer.
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.concatBufferBlock = function () {
    /** @type {number} buffer pointer. */
    var pos = 0;
    /** @type {number} buffer pointer. */
    var limit = this.totalpos + (this.op - Zlib.RawInflate.MaxBackwardLength);
    /** @type {!(Array.<number>|Uint8Array)} output block array. */
    var output = this.output;
    /** @type {!Array} blocks array. */
    var blocks = this.blocks;
    /** @type {!(Array.<number>|Uint8Array)} output block array. */
    var block;
    /** @type {!(Array.<number>|Uint8Array)} output buffer. */
    var buffer = new Uint8Array(limit);
    /** @type {number} loop counter. */
    var i;
    /** @type {number} loop limiter. */
    var il;
    /** @type {number} loop counter. */
    var j;
    /** @type {number} loop limiter. */
    var jl;

    // single buffer
    if (blocks.length === 0) {
        return this.output.subarray(Zlib.RawInflate.MaxBackwardLength, this.op);
    }

    // copy to buffer
    for (i = 0, il = blocks.length; i < il; ++i) {
        block = blocks[i];
        for (j = 0, jl = block.length; j < jl; ++j) {
            buffer[pos++] = block[j];
        }
    }

    // current buffer
    for (i = Zlib.RawInflate.MaxBackwardLength, il = this.op; i < il; ++i) {
        buffer[pos++] = output[i];
    }

    this.blocks = [];
    this.buffer = buffer;

    return this.buffer;
};

/**
 * concat output buffer. (dynamic)
 * @return {!(Array.<number>|Uint8Array)} output buffer.
 */
Zlib.RawInflate.prototype.concatBufferDynamic = function () {
    /** @type {Array.<number>|Uint8Array} output buffer. */
    var buffer;
    var op = this.op;

    {
        if (this.resize) {
            buffer = new Uint8Array(op);
            buffer.set(this.output.subarray(0, op));
        } else {
            buffer = this.output.subarray(0, op);
        }
    }

    this.buffer = buffer;

    return this.buffer;
};

var buildHuffmanTable = Zlib.Huffman.buildHuffmanTable;

/**
 * @param {!(Uint8Array|Array.<number>)} input input buffer.
 * @param {number} ip input buffer pointer.
 * @param {number=} opt_buffersize buffer block size.
 * @constructor
 */
Zlib.RawInflateStream = function (input, ip, opt_buffersize) {
    /** @type {!Array.<(Array|Uint8Array)>} */
    this.blocks = [];
    /** @type {number} block size. */
    this.bufferSize = opt_buffersize ? opt_buffersize : ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE;
    /** @type {!number} total output buffer pointer. */
    this.totalpos = 0;
    /** @type {!number} input buffer pointer. */
    this.ip = ip === void 0 ? 0 : ip;
    /** @type {!number} bit stream reader buffer. */
    this.bitsbuf = 0;
    /** @type {!number} bit stream reader buffer size. */
    this.bitsbuflen = 0;
    /** @type {!(Array|Uint8Array)} input buffer. */
    this.input = new Uint8Array(input);
    /** @type {!(Uint8Array|Array)} output buffer. */
    this.output = new Uint8Array(this.bufferSize);
    /** @type {!number} output buffer pointer. */
    this.op = 0;
    /** @type {boolean} is final block flag. */
    this.bfinal = false;
    /** @type {number} uncompressed block length. */
    this.blockLength;
    /** @type {boolean} resize flag for memory size optimization. */
    this.resize = false;
    /** @type {Array} */
    this.litlenTable;
    /** @type {Array} */
    this.distTable;
    /** @type {number} */
    this.sp = 0; // stream pointer
    /** @type {Zlib.RawInflateStream.Status} */
    this.status = Zlib.RawInflateStream.Status.INITIALIZED;

    //
    // backup
    //
    /** @type {!number} */
    this.ip_;
    /** @type {!number} */
    this.bitsbuflen_;
    /** @type {!number} */
    this.bitsbuf_;
};

/**
 * @enum {number}
 */
Zlib.RawInflateStream.BlockType = {
    UNCOMPRESSED: 0,
    FIXED: 1,
    DYNAMIC: 2,
};

/**
 * @enum {number}
 */
Zlib.RawInflateStream.Status = {
    INITIALIZED: 0,
    BLOCK_HEADER_START: 1,
    BLOCK_HEADER_END: 2,
    BLOCK_BODY_START: 3,
    BLOCK_BODY_END: 4,
    DECODE_BLOCK_START: 5,
    DECODE_BLOCK_END: 6,
};

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.RawInflateStream.prototype.decompress = function (newInput, ip) {
    /** @type {boolean} */
    var stop = false;

    if (newInput !== void 0) {
        this.input = newInput;
    }

    if (ip !== void 0) {
        this.ip = ip;
    }

    // decompress
    while (!stop) {
        switch (this.status) {
            // block header
            case Zlib.RawInflateStream.Status.INITIALIZED:
            case Zlib.RawInflateStream.Status.BLOCK_HEADER_START:
                if (this.readBlockHeader() < 0) {
                    stop = true;
                }
                break;
            // block body
            case Zlib.RawInflateStream.Status.BLOCK_HEADER_END: /* FALLTHROUGH */
            case Zlib.RawInflateStream.Status.BLOCK_BODY_START:
                switch (this.currentBlockType) {
                    case Zlib.RawInflateStream.BlockType.UNCOMPRESSED:
                        if (this.readUncompressedBlockHeader() < 0) {
                            stop = true;
                        }
                        break;
                    case Zlib.RawInflateStream.BlockType.FIXED:
                        if (this.parseFixedHuffmanBlock() < 0) {
                            stop = true;
                        }
                        break;
                    case Zlib.RawInflateStream.BlockType.DYNAMIC:
                        if (this.parseDynamicHuffmanBlock() < 0) {
                            stop = true;
                        }
                        break;
                }
                break;
            // decode data
            case Zlib.RawInflateStream.Status.BLOCK_BODY_END:
            case Zlib.RawInflateStream.Status.DECODE_BLOCK_START:
                switch (this.currentBlockType) {
                    case Zlib.RawInflateStream.BlockType.UNCOMPRESSED:
                        if (this.parseUncompressedBlock() < 0) {
                            stop = true;
                        }
                        break;
                    case Zlib.RawInflateStream.BlockType.FIXED: /* FALLTHROUGH */
                    case Zlib.RawInflateStream.BlockType.DYNAMIC:
                        if (this.decodeHuffman() < 0) {
                            stop = true;
                        }
                        break;
                }
                break;
            case Zlib.RawInflateStream.Status.DECODE_BLOCK_END:
                if (this.bfinal) {
                    stop = true;
                } else {
                    this.status = Zlib.RawInflateStream.Status.INITIALIZED;
                }
                break;
        }
    }

    return this.concatBuffer();
};

/**
 * @const
 * @type {number} max backward length for LZ77.
 */
Zlib.RawInflateStream.MaxBackwardLength = 32768;

/**
 * @const
 * @type {number} max copy length for LZ77.
 */
Zlib.RawInflateStream.MaxCopyLength = 258;

/**
 * huffman order
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.Order = (function (table) {
    return new Uint16Array(table);
})([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);

/**
 * huffman length code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflateStream.LengthCodeTable = (function (table) {
    return new Uint16Array(table);
})([
    0x0003,
    0x0004,
    0x0005,
    0x0006,
    0x0007,
    0x0008,
    0x0009,
    0x000a,
    0x000b,
    0x000d,
    0x000f,
    0x0011,
    0x0013,
    0x0017,
    0x001b,
    0x001f,
    0x0023,
    0x002b,
    0x0033,
    0x003b,
    0x0043,
    0x0053,
    0x0063,
    0x0073,
    0x0083,
    0x00a3,
    0x00c3,
    0x00e3,
    0x0102,
    0x0102,
    0x0102,
]);

/**
 * huffman length extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.LengthExtraTable = (function (table) {
    return new Uint8Array(table);
})([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0]);

/**
 * huffman dist code table.
 * @const
 * @type {!(Array.<number>|Uint16Array)}
 */
Zlib.RawInflateStream.DistCodeTable = (function (table) {
    return new Uint16Array(table);
})([
    0x0001,
    0x0002,
    0x0003,
    0x0004,
    0x0005,
    0x0007,
    0x0009,
    0x000d,
    0x0011,
    0x0019,
    0x0021,
    0x0031,
    0x0041,
    0x0061,
    0x0081,
    0x00c1,
    0x0101,
    0x0181,
    0x0201,
    0x0301,
    0x0401,
    0x0601,
    0x0801,
    0x0c01,
    0x1001,
    0x1801,
    0x2001,
    0x3001,
    0x4001,
    0x6001,
]);

/**
 * huffman dist extra-bits table.
 * @const
 * @type {!(Array.<number>|Uint8Array)}
 */
Zlib.RawInflateStream.DistExtraTable = (function (table) {
    return new Uint8Array(table);
})([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);

/**
 * fixed huffman length code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflateStream.FixedLiteralLengthTable = (function (table) {
    return table;
})(
    (function () {
        var lengths = new Uint8Array(288);
        var i, il;

        for (i = 0, il = lengths.length; i < il; ++i) {
            lengths[i] = i <= 143 ? 8 : i <= 255 ? 9 : i <= 279 ? 7 : 8;
        }

        return buildHuffmanTable(lengths);
    })()
);

/**
 * fixed huffman distance code table
 * @const
 * @type {!Array}
 */
Zlib.RawInflateStream.FixedDistanceTable = (function (table) {
    return table;
})(
    (function () {
        var lengths = new Uint8Array(30);
        var i, il;

        for (i = 0, il = lengths.length; i < il; ++i) {
            lengths[i] = 5;
        }

        return buildHuffmanTable(lengths);
    })()
);

/**
 * parse deflated block.
 */
Zlib.RawInflateStream.prototype.readBlockHeader = function () {
    /** @type {number} header */
    var hdr;

    this.status = Zlib.RawInflateStream.Status.BLOCK_HEADER_START;

    this.save_();
    if ((hdr = this.readBits(3)) < 0) {
        this.restore_();
        return -1;
    }

    // BFINAL
    if (hdr & 0x1) {
        this.bfinal = true;
    }

    // BTYPE
    hdr >>>= 1;
    switch (hdr) {
        case 0: // uncompressed
            this.currentBlockType = Zlib.RawInflateStream.BlockType.UNCOMPRESSED;
            break;
        case 1: // fixed huffman
            this.currentBlockType = Zlib.RawInflateStream.BlockType.FIXED;
            break;
        case 2: // dynamic huffman
            this.currentBlockType = Zlib.RawInflateStream.BlockType.DYNAMIC;
            break;
        default:
            // reserved or other
            throw new Error("unknown BTYPE: " + hdr);
    }

    this.status = Zlib.RawInflateStream.Status.BLOCK_HEADER_END;
};

/**
 * read inflate bits
 * @param {number} length bits length.
 * @return {number} read bits.
 */
Zlib.RawInflateStream.prototype.readBits = function (length) {
    var bitsbuf = this.bitsbuf;
    var bitsbuflen = this.bitsbuflen;
    var input = this.input;
    var ip = this.ip;

    /** @type {number} input and output byte. */
    var octet;

    // not enough buffer
    while (bitsbuflen < length) {
        // input byte
        if (input.length <= ip) {
            return -1;
        }
        octet = input[ip++];

        // concat octet
        bitsbuf |= octet << bitsbuflen;
        bitsbuflen += 8;
    }

    // output byte
    octet = bitsbuf & /* MASK */ ((1 << length) - 1);
    bitsbuf >>>= length;
    bitsbuflen -= length;

    this.bitsbuf = bitsbuf;
    this.bitsbuflen = bitsbuflen;
    this.ip = ip;

    return octet;
};

/**
 * read huffman code using table
 * @param {Array} table huffman code table.
 * @return {number} huffman code.
 */
Zlib.RawInflateStream.prototype.readCodeByTable = function (table) {
    var bitsbuf = this.bitsbuf;
    var bitsbuflen = this.bitsbuflen;
    var input = this.input;
    var ip = this.ip;

    /** @type {!(Array|Uint8Array)} huffman code table */
    var codeTable = table[0];
    /** @type {number} */
    var maxCodeLength = table[1];
    /** @type {number} input byte */
    var octet;
    /** @type {number} code length & code (16bit, 16bit) */
    var codeWithLength;
    /** @type {number} code bits length */
    var codeLength;

    // not enough buffer
    while (bitsbuflen < maxCodeLength) {
        if (input.length <= ip) {
            return -1;
        }
        octet = input[ip++];
        bitsbuf |= octet << bitsbuflen;
        bitsbuflen += 8;
    }

    // read max length
    codeWithLength = codeTable[bitsbuf & ((1 << maxCodeLength) - 1)];
    codeLength = codeWithLength >>> 16;

    if (codeLength > bitsbuflen) {
        throw new Error("invalid code length: " + codeLength);
    }

    this.bitsbuf = bitsbuf >> codeLength;
    this.bitsbuflen = bitsbuflen - codeLength;
    this.ip = ip;

    return codeWithLength & 0xffff;
};

/**
 * read uncompressed block header
 */
Zlib.RawInflateStream.prototype.readUncompressedBlockHeader = function () {
    /** @type {number} block length */
    var len;
    /** @type {number} number for check block length */
    var nlen;

    var input = this.input;
    var ip = this.ip;

    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

    if (ip + 4 >= input.length) {
        return -1;
    }

    len = input[ip++] | (input[ip++] << 8);
    nlen = input[ip++] | (input[ip++] << 8);

    // check len & nlen
    if (len === ~nlen) {
        throw new Error("invalid uncompressed block header: length verify");
    }

    // skip buffered header bits
    this.bitsbuf = 0;
    this.bitsbuflen = 0;

    this.ip = ip;
    this.blockLength = len;
    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;
};

/**
 * parse uncompressed block.
 */
Zlib.RawInflateStream.prototype.parseUncompressedBlock = function () {
    var input = this.input;
    var ip = this.ip;
    var output = this.output;
    var op = this.op;
    var len = this.blockLength;

    this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_START;

    // copy
    // XXX: とりあえず素直にコピー
    while (len--) {
        if (op === output.length) {
            output = this.expandBuffer({ fixRatio: 2 });
        }

        // not enough input buffer
        if (ip >= input.length) {
            this.ip = ip;
            this.op = op;
            this.blockLength = len + 1; // コピーしてないので戻す
            return -1;
        }

        output[op++] = input[ip++];
    }

    if (len < 0) {
        this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_END;
    }

    this.ip = ip;
    this.op = op;

    return 0;
};

/**
 * parse fixed huffman block.
 */
Zlib.RawInflateStream.prototype.parseFixedHuffmanBlock = function () {
    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

    this.litlenTable = Zlib.RawInflateStream.FixedLiteralLengthTable;
    this.distTable = Zlib.RawInflateStream.FixedDistanceTable;

    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;

    return 0;
};

/**
 * オブジェクトのコンテキストを別のプロパティに退避する.
 * @private
 */
Zlib.RawInflateStream.prototype.save_ = function () {
    this.ip_ = this.ip;
    this.bitsbuflen_ = this.bitsbuflen;
    this.bitsbuf_ = this.bitsbuf;
};

/**
 * 別のプロパティに退避したコンテキストを復元する.
 * @private
 */
Zlib.RawInflateStream.prototype.restore_ = function () {
    this.ip = this.ip_;
    this.bitsbuflen = this.bitsbuflen_;
    this.bitsbuf = this.bitsbuf_;
};

/**
 * parse dynamic huffman block.
 */
Zlib.RawInflateStream.prototype.parseDynamicHuffmanBlock = function () {
    /** @type {number} number of literal and length codes. */
    var hlit;
    /** @type {number} number of distance codes. */
    var hdist;
    /** @type {number} number of code lengths. */
    var hclen;
    /** @type {!(Uint8Array|Array)} code lengths. */
    var codeLengths = new Uint8Array(Zlib.RawInflateStream.Order.length);
    /** @type {!Array} code lengths table. */
    var codeLengthsTable;

    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_START;

    this.save_();
    hlit = this.readBits(5) + 257;
    hdist = this.readBits(5) + 1;
    hclen = this.readBits(4) + 4;
    if (hlit < 0 || hdist < 0 || hclen < 0) {
        this.restore_();
        return -1;
    }

    try {
        parseDynamicHuffmanBlockImpl.call(this);
    } catch (e) {
        this.restore_();
        return -1;
    }

    function parseDynamicHuffmanBlockImpl() {
        /** @type {number} */
        var bits;
        var code;
        var prev = 0;
        var repeat;
        /** @type {!(Uint8Array|Array.<number>)} code length table. */
        var lengthTable;
        /** @type {number} loop counter. */
        var i;
        /** @type {number} loop limit. */
        var il;

        // decode code lengths
        for (i = 0; i < hclen; ++i) {
            if ((bits = this.readBits(3)) < 0) {
                throw new Error("not enough input");
            }
            codeLengths[Zlib.RawInflateStream.Order[i]] = bits;
        }

        // decode length table
        codeLengthsTable = buildHuffmanTable(codeLengths);
        lengthTable = new Uint8Array(hlit + hdist);
        for (i = 0, il = hlit + hdist; i < il; ) {
            code = this.readCodeByTable(codeLengthsTable);
            if (code < 0) {
                throw new Error("not enough input");
            }
            switch (code) {
                case 16:
                    if ((bits = this.readBits(2)) < 0) {
                        throw new Error("not enough input");
                    }
                    repeat = 3 + bits;
                    while (repeat--) {
                        lengthTable[i++] = prev;
                    }
                    break;
                case 17:
                    if ((bits = this.readBits(3)) < 0) {
                        throw new Error("not enough input");
                    }
                    repeat = 3 + bits;
                    while (repeat--) {
                        lengthTable[i++] = 0;
                    }
                    prev = 0;
                    break;
                case 18:
                    if ((bits = this.readBits(7)) < 0) {
                        throw new Error("not enough input");
                    }
                    repeat = 11 + bits;
                    while (repeat--) {
                        lengthTable[i++] = 0;
                    }
                    prev = 0;
                    break;
                default:
                    lengthTable[i++] = code;
                    prev = code;
                    break;
            }
        }

        this.litlenTable = buildHuffmanTable(lengthTable.subarray(0, hlit));
        this.distTable = buildHuffmanTable(lengthTable.subarray(hlit));
    }

    this.status = Zlib.RawInflateStream.Status.BLOCK_BODY_END;

    return 0;
};

/**
 * decode huffman code (dynamic)
 * @return {(number|undefined)} -1 is error.
 */
Zlib.RawInflateStream.prototype.decodeHuffman = function () {
    var output = this.output;
    var op = this.op;

    /** @type {number} huffman code. */
    var code;
    /** @type {number} table index. */
    var ti;
    /** @type {number} huffman code distination. */
    var codeDist;
    /** @type {number} huffman code length. */
    var codeLength;

    var litlen = this.litlenTable;
    var dist = this.distTable;

    var olength = output.length;
    var bits;

    this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_START;

    while (true) {
        this.save_();

        code = this.readCodeByTable(litlen);
        if (code < 0) {
            this.op = op;
            this.restore_();
            return -1;
        }

        if (code === 256) {
            break;
        }

        // literal
        if (code < 256) {
            if (op === olength) {
                output = this.expandBuffer();
                olength = output.length;
            }
            output[op++] = code;

            continue;
        }

        // length code
        ti = code - 257;
        codeLength = Zlib.RawInflateStream.LengthCodeTable[ti];
        if (Zlib.RawInflateStream.LengthExtraTable[ti] > 0) {
            bits = this.readBits(Zlib.RawInflateStream.LengthExtraTable[ti]);
            if (bits < 0) {
                this.op = op;
                this.restore_();
                return -1;
            }
            codeLength += bits;
        }

        // dist code
        code = this.readCodeByTable(dist);
        if (code < 0) {
            this.op = op;
            this.restore_();
            return -1;
        }
        codeDist = Zlib.RawInflateStream.DistCodeTable[code];
        if (Zlib.RawInflateStream.DistExtraTable[code] > 0) {
            bits = this.readBits(Zlib.RawInflateStream.DistExtraTable[code]);
            if (bits < 0) {
                this.op = op;
                this.restore_();
                return -1;
            }
            codeDist += bits;
        }

        // lz77 decode
        if (op + codeLength >= olength) {
            output = this.expandBuffer();
            olength = output.length;
        }

        while (codeLength--) {
            output[op] = output[op++ - codeDist];
        }

        // break
        if (this.ip === this.input.length) {
            this.op = op;
            return -1;
        }
    }

    while (this.bitsbuflen >= 8) {
        this.bitsbuflen -= 8;
        this.ip--;
    }

    this.op = op;
    this.status = Zlib.RawInflateStream.Status.DECODE_BLOCK_END;
};

/**
 * expand output buffer. (dynamic)
 * @param {Object=} opt_param option parameters.
 * @return {!(Array|Uint8Array)} output buffer pointer.
 */
Zlib.RawInflateStream.prototype.expandBuffer = function (opt_param) {
    /** @type {!(Array|Uint8Array)} store buffer. */
    var buffer;
    /** @type {number} expantion ratio. */
    var ratio = (this.input.length / this.ip + 1) | 0;
    /** @type {number} maximum number of huffman code. */
    var maxHuffCode;
    /** @type {number} new output buffer size. */
    var newSize;
    /** @type {number} max inflate size. */
    var maxInflateSize;

    var input = this.input;
    var output = this.output;

    if (opt_param) {
        if (typeof opt_param.fixRatio === "number") {
            ratio = opt_param.fixRatio;
        }
        if (typeof opt_param.addRatio === "number") {
            ratio += opt_param.addRatio;
        }
    }

    // calculate new buffer size
    if (ratio < 2) {
        maxHuffCode = (input.length - this.ip) / this.litlenTable[2];
        maxInflateSize = ((maxHuffCode / 2) * 258) | 0;
        newSize = maxInflateSize < output.length ? output.length + maxInflateSize : output.length << 1;
    } else {
        newSize = output.length * ratio;
    }

    // buffer expantion
    {
        buffer = new Uint8Array(newSize);
        buffer.set(output);
    }

    this.output = buffer;

    return this.output;
};

/**
 * concat output buffer. (dynamic)
 * @return {!(Array|Uint8Array)} output buffer.
 */
Zlib.RawInflateStream.prototype.concatBuffer = function () {
    /** @type {!(Array|Uint8Array)} output buffer. */
    var buffer;
    /** @type {number} */
    var op = this.op;
    /** @type {Uint8Array} */
    var tmp;

    if (this.resize) {
        {
            buffer = new Uint8Array(this.output.subarray(this.sp, op));
        }
    } else {
        buffer = this.output.subarray(this.sp, op);
    }

    this.sp = op;

    // compaction
    if (op > Zlib.RawInflateStream.MaxBackwardLength + this.bufferSize) {
        this.op = this.sp = Zlib.RawInflateStream.MaxBackwardLength;
        {
            tmp = /** @type {Uint8Array} */ (this.output);
            this.output = new Uint8Array(this.bufferSize + Zlib.RawInflateStream.MaxBackwardLength);
            this.output.set(tmp.subarray(op - Zlib.RawInflateStream.MaxBackwardLength, op));
        }
    }

    return buffer;
};

/**
 * @constructor
 * @param {!(Uint8Array|Array)} input deflated buffer.
 * @param {Object=} opt_params option parameters.
 *
 * opt_params は以下のプロパティを指定する事ができます。
 *   - index: input buffer の deflate コンテナの開始位置.
 *   - blockSize: バッファのブロックサイズ.
 *   - verify: 伸張が終わった後 adler-32 checksum の検証を行うか.
 *   - bufferType: Zlib.Inflate.BufferType の値によってバッファの管理方法を指定する.
 *       Zlib.Inflate.BufferType は Zlib.RawInflate.BufferType のエイリアス.
 */
Zlib.Inflate = function (input, opt_params) {
    /** @type {number} */
    var cmf;
    /** @type {number} */
    var flg;

    /** @type {!(Uint8Array|Array)} */
    this.input = input;
    /** @type {number} */
    this.ip = 0;
    /** @type {Zlib.RawInflate} */
    this.rawinflate;
    /** @type {(boolean|undefined)} verify flag. */
    this.verify;

    // option parameters
    if (opt_params || !(opt_params = {})) {
        if (opt_params["index"]) {
            this.ip = opt_params["index"];
        }
        if (opt_params["verify"]) {
            this.verify = opt_params["verify"];
        }
    }

    // Compression Method and Flags
    cmf = input[this.ip++];
    flg = input[this.ip++];

    // compression method
    switch (cmf & 0x0f) {
        case Zlib.CompressionMethod.DEFLATE:
            this.method = Zlib.CompressionMethod.DEFLATE;
            break;
        default:
            throw new Error("unsupported compression method");
    }

    // fcheck
    if (((cmf << 8) + flg) % 31 !== 0) {
        throw new Error("invalid fcheck flag:" + (((cmf << 8) + flg) % 31));
    }

    // fdict (not supported)
    if (flg & 0x20) {
        throw new Error("fdict flag is not supported");
    }

    // RawInflate
    this.rawinflate = new Zlib.RawInflate(input, {
        index: this.ip,
        bufferSize: opt_params["bufferSize"],
        bufferType: opt_params["bufferType"],
        resize: opt_params["resize"],
    });
};

/**
 * @enum {number}
 */
Zlib.Inflate.BufferType = Zlib.RawInflate.BufferType;

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.Inflate.prototype.decompress = function () {
    /** @type {!(Array|Uint8Array)} input buffer. */
    var input = this.input;
    /** @type {!(Uint8Array|Array)} inflated buffer. */
    var buffer;
    /** @type {number} adler-32 checksum */
    var adler32;

    buffer = this.rawinflate.decompress();
    this.ip = this.rawinflate.ip;

    // verify adler-32
    if (this.verify) {
        adler32 =
            ((input[this.ip++] << 24) | (input[this.ip++] << 16) | (input[this.ip++] << 8) | input[this.ip++]) >>> 0;

        if (adler32 !== Zlib.Adler32(buffer)) {
            throw new Error("invalid adler-32 checksum");
        }
    }

    return buffer;
};

/* vim:set expandtab ts=2 sw=2 tw=80: */

/**
 * @param {!(Uint8Array|Array)} input deflated buffer.
 * @constructor
 */
Zlib.InflateStream = function (input) {
    /** @type {!(Uint8Array|Array)} */
    this.input = input === void 0 ? new Uint8Array() : input;
    /** @type {number} */
    this.ip = 0;
    /** @type {Zlib.RawInflateStream} */
    this.rawinflate = new Zlib.RawInflateStream(this.input, this.ip);
    /** @type {Zlib.CompressionMethod} */
    this.method;
    /** @type {!(Array|Uint8Array)} */
    this.output = this.rawinflate.output;
};

/**
 * decompress.
 * @return {!(Uint8Array|Array)} inflated buffer.
 */
Zlib.InflateStream.prototype.decompress = function (input) {
    /** @type {!(Uint8Array|Array)} inflated buffer. */
    var buffer;

    // 新しい入力を入力バッファに結合する
    // XXX Array, Uint8Array のチェックを行うか確認する
    if (input !== void 0) {
        {
            var tmp = new Uint8Array(this.input.length + input.length);
            tmp.set(this.input, 0);
            tmp.set(input, this.input.length);
            this.input = tmp;
        }
    }

    if (this.method === void 0) {
        if (this.readHeader() < 0) {
            return new Uint8Array();
        }
    }

    buffer = this.rawinflate.decompress(this.input, this.ip);
    if (this.rawinflate.ip !== 0) {
        this.input = this.input.subarray(this.rawinflate.ip);
        this.ip = 0;
    }

    // verify adler-32
    /*
  if (this.verify) {
    adler32 =
      input[this.ip++] << 24 | input[this.ip++] << 16 |
      input[this.ip++] << 8 | input[this.ip++];

    if (adler32 !== Zlib.Adler32(buffer)) {
      throw new Error('invalid adler-32 checksum');
    }
  }
  */

    return buffer;
};

Zlib.InflateStream.prototype.readHeader = function () {
    var ip = this.ip;
    var input = this.input;

    // Compression Method and Flags
    var cmf = input[ip++];
    var flg = input[ip++];

    if (cmf === void 0 || flg === void 0) {
        return -1;
    }

    // compression method
    switch (cmf & 0x0f) {
        case Zlib.CompressionMethod.DEFLATE:
            this.method = Zlib.CompressionMethod.DEFLATE;
            break;
        default:
            throw new Error("unsupported compression method");
    }

    // fcheck
    if (((cmf << 8) + flg) % 31 !== 0) {
        throw new Error("invalid fcheck flag:" + (((cmf << 8) + flg) % 31));
    }

    // fdict (not supported)
    if (flg & 0x20) {
        throw new Error("fdict flag is not supported");
    }

    this.ip = ip;
};

/**
 * @fileoverview GZIP (RFC1952) 展開コンテナ実装.
 */

/**
 * @constructor
 * @param {!(Array|Uint8Array)} input input buffer.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Gunzip = function (input, opt_params) {
    /** @type {!(Array.<number>|Uint8Array)} input buffer. */
    this.input = input;
    /** @type {number} input buffer pointer. */
    this.ip = 0;
    /** @type {Array.<Zlib.GunzipMember>} */
    this.member = [];
    /** @type {boolean} */
    this.decompressed = false;
};

/**
 * @return {Array.<Zlib.GunzipMember>}
 */
Zlib.Gunzip.prototype.getMembers = function () {
    if (!this.decompressed) {
        this.decompress();
    }

    return this.member.slice();
};

/**
 * inflate gzip data.
 * @return {!(Array.<number>|Uint8Array)} inflated buffer.
 */
Zlib.Gunzip.prototype.decompress = function () {
    /** @type {number} input length. */
    var il = this.input.length;

    while (this.ip < il) {
        this.decodeMember();
    }

    this.decompressed = true;

    return this.concatMember();
};

/**
 * decode gzip member.
 */
Zlib.Gunzip.prototype.decodeMember = function () {
    /** @type {Zlib.GunzipMember} */
    var member = new Zlib.GunzipMember();
    /** @type {number} */
    var isize;
    /** @type {Zlib.RawInflate} RawInflate implementation. */
    var rawinflate;
    /** @type {!(Array.<number>|Uint8Array)} inflated data. */
    var inflated;
    /** @type {number} inflate size */
    var inflen;
    /** @type {number} character code */
    var c;
    /** @type {number} character index in string. */
    var ci;
    /** @type {Array.<string>} character array. */
    var str;
    /** @type {number} modification time. */
    var mtime;
    /** @type {number} */
    var crc32;

    var input = this.input;
    var ip = this.ip;

    member.id1 = input[ip++];
    member.id2 = input[ip++];

    // check signature
    if (member.id1 !== 0x1f || member.id2 !== 0x8b) {
        throw new Error("invalid file signature:" + member.id1 + "," + member.id2);
    }

    // check compression method
    member.cm = input[ip++];
    switch (member.cm) {
        case 8 /* XXX: use Zlib const */:
            break;
        default:
            throw new Error("unknown compression method: " + member.cm);
    }

    // flags
    member.flg = input[ip++];

    // modification time
    mtime = input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24);
    member.mtime = new Date(mtime * 1000);

    // extra flags
    member.xfl = input[ip++];

    // operating system
    member.os = input[ip++];

    // extra
    if ((member.flg & Zlib.Gzip.FlagsMask.FEXTRA) > 0) {
        member.xlen = input[ip++] | (input[ip++] << 8);
        ip = this.decodeSubField(ip, member.xlen);
    }

    // fname
    if ((member.flg & Zlib.Gzip.FlagsMask.FNAME) > 0) {
        for (str = [], ci = 0; (c = input[ip++]) > 0; ) {
            str[ci++] = String.fromCharCode(c);
        }
        member.name = str.join("");
    }

    // fcomment
    if ((member.flg & Zlib.Gzip.FlagsMask.FCOMMENT) > 0) {
        for (str = [], ci = 0; (c = input[ip++]) > 0; ) {
            str[ci++] = String.fromCharCode(c);
        }
        member.comment = str.join("");
    }

    // fhcrc
    if ((member.flg & Zlib.Gzip.FlagsMask.FHCRC) > 0) {
        member.crc16 = Zlib.CRC32.calc(input, 0, ip) & 0xffff;
        if (member.crc16 !== (input[ip++] | (input[ip++] << 8))) {
            throw new Error("invalid header crc16");
        }
    }

    // isize を事前に取得すると展開後のサイズが分かるため、
    // inflate処理のバッファサイズが事前に分かり、高速になる
    isize =
        input[input.length - 4] |
        (input[input.length - 3] << 8) |
        (input[input.length - 2] << 16) |
        (input[input.length - 1] << 24);

    // isize の妥当性チェック
    // ハフマン符号では最小 2-bit のため、最大で 1/4 になる
    // LZ77 符号では 長さと距離 2-Byte で最大 258-Byte を表現できるため、
    // 1/128 になるとする
    // ここから入力バッファの残りが isize の 512 倍以上だったら
    // サイズ指定のバッファ確保は行わない事とする
    if (input.length - ip - /* CRC-32 */ 4 - /* ISIZE */ 4 < isize * 512) {
        inflen = isize;
    }

    // compressed block
    rawinflate = new Zlib.RawInflate(input, { index: ip, bufferSize: inflen });
    member.data = inflated = rawinflate.decompress();
    ip = rawinflate.ip;

    // crc32
    member.crc32 = crc32 = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
    if (Zlib.CRC32.calc(inflated) !== crc32) {
        throw new Error(
            "invalid CRC-32 checksum: 0x" + Zlib.CRC32.calc(inflated).toString(16) + " / 0x" + crc32.toString(16)
        );
    }

    // input size
    member.isize = isize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;
    if ((inflated.length & 0xffffffff) !== isize) {
        throw new Error("invalid input size: " + (inflated.length & 0xffffffff) + " / " + isize);
    }

    this.member.push(member);
    this.ip = ip;
};

/**
 * サブフィールドのデコード
 * XXX: 現在は何もせずスキップする
 */
Zlib.Gunzip.prototype.decodeSubField = function (ip, length) {
    return ip + length;
};

/**
 * @return {!(Array.<number>|Uint8Array)}
 */
Zlib.Gunzip.prototype.concatMember = function () {
    /** @type {Array.<Zlib.GunzipMember>} */
    var member = this.member;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {number} */
    var p = 0;
    /** @type {number} */
    var size = 0;
    /** @type {!(Array.<number>|Uint8Array)} */
    var buffer;

    for (i = 0, il = member.length; i < il; ++i) {
        size += member[i].data.length;
    }

    {
        buffer = new Uint8Array(size);
        for (i = 0; i < il; ++i) {
            buffer.set(member[i].data, p);
            p += member[i].data.length;
        }
    }

    return buffer;
};

/**
 * @constructor
 */
Zlib.GunzipMember = function () {
    /** @type {number} signature first byte. */
    this.id1;
    /** @type {number} signature second byte. */
    this.id2;
    /** @type {number} compression method. */
    this.cm;
    /** @type {number} flags. */
    this.flg;
    /** @type {Date} modification time. */
    this.mtime;
    /** @type {number} extra flags. */
    this.xfl;
    /** @type {number} operating system number. */
    this.os;
    /** @type {number} CRC-16 value for FHCRC flag. */
    this.crc16;
    /** @type {number} extra length. */
    this.xlen;
    /** @type {number} CRC-32 value for verification. */
    this.crc32;
    /** @type {number} input size modulo 32 value. */
    this.isize;
    /** @type {string} filename. */
    this.name;
    /** @type {string} comment. */
    this.comment;
    /** @type {!(Uint8Array|Array.<number>)} */
    this.data;
};

Zlib.GunzipMember.prototype.getName = function () {
    return this.name;
};

Zlib.GunzipMember.prototype.getData = function () {
    return this.data;
};

Zlib.GunzipMember.prototype.getMtime = function () {
    return this.mtime;
};

/**
 * @fileoverview GZIP (RFC1952) 実装.
 */

/**
 * @constructor
 * @param {!(Array|Uint8Array)} input input buffer.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Gzip = function (input, opt_params) {
    /** @type {!(Array.<number>|Uint8Array)} input buffer. */
    this.input = input;
    /** @type {number} input buffer pointer. */
    this.ip = 0;
    /** @type {!(Array.<number>|Uint8Array)} output buffer. */
    this.output;
    /** @type {number} output buffer. */
    this.op = 0;
    /** @type {!Object} flags option flags. */
    this.flags = {};
    /** @type {!string} filename. */
    this.filename;
    /** @type {!string} comment. */
    this.comment;
    /** @type {!Object} deflate options. */
    this.deflateOptions;

    // option parameters
    if (opt_params) {
        if (opt_params["flags"]) {
            this.flags = opt_params["flags"];
        }
        if (typeof opt_params["filename"] === "string") {
            this.filename = opt_params["filename"];
        }
        if (typeof opt_params["comment"] === "string") {
            this.comment = opt_params["comment"];
        }
        if (opt_params["deflateOptions"]) {
            this.deflateOptions = opt_params["deflateOptions"];
        }
    }

    if (!this.deflateOptions) {
        this.deflateOptions = {};
    }
};

/**
 * @type {number}
 * @const
 */
Zlib.Gzip.DefaultBufferSize = 0x8000;

/**
 * encode gzip members.
 * @return {!(Array|Uint8Array)} gzip binary array.
 */
Zlib.Gzip.prototype.compress = function () {
    /** @type {number} flags. */
    var flg;
    /** @type {number} modification time. */
    var mtime;
    /** @type {number} CRC-16 value for FHCRC flag. */
    var crc16;
    /** @type {number} CRC-32 value for verification. */
    var crc32;
    /** @type {!Zlib.RawDeflate} raw deflate object. */
    var rawdeflate;
    /** @type {number} character code */
    var c;
    /** @type {number} loop counter. */
    var i;
    /** @type {number} loop limiter. */
    var il;
    /** @type {!(Array|Uint8Array)} output buffer. */
    var output = new Uint8Array(Zlib.Gzip.DefaultBufferSize);
    /** @type {number} output buffer pointer. */
    var op = 0;

    var input = this.input;
    var ip = this.ip;
    var filename = this.filename;
    var comment = this.comment;

    // check signature
    output[op++] = 0x1f;
    output[op++] = 0x8b;

    // check compression method
    output[op++] = 8; /* XXX: use Zlib const */

    // flags
    flg = 0;
    if (this.flags["fname"]) flg |= Zlib.Gzip.FlagsMask.FNAME;
    if (this.flags["fcomment"]) flg |= Zlib.Gzip.FlagsMask.FCOMMENT;
    if (this.flags["fhcrc"]) flg |= Zlib.Gzip.FlagsMask.FHCRC;
    // XXX: FTEXT
    // XXX: FEXTRA
    output[op++] = flg;

    // modification time
    mtime = ((Date.now ? Date.now() : +new Date()) / 1000) | 0;
    output[op++] = mtime & 0xff;
    output[op++] = (mtime >>> 8) & 0xff;
    output[op++] = (mtime >>> 16) & 0xff;
    output[op++] = (mtime >>> 24) & 0xff;

    // extra flags
    output[op++] = 0;

    // operating system
    output[op++] = Zlib.Gzip.OperatingSystem.UNKNOWN;

    // extra
    /* NOP */

    // fname
    if (this.flags["fname"] !== void 0) {
        for (i = 0, il = filename.length; i < il; ++i) {
            c = filename.charCodeAt(i);
            if (c > 0xff) {
                output[op++] = (c >>> 8) & 0xff;
            }
            output[op++] = c & 0xff;
        }
        output[op++] = 0; // null termination
    }

    // fcomment
    if (this.flags["comment"]) {
        for (i = 0, il = comment.length; i < il; ++i) {
            c = comment.charCodeAt(i);
            if (c > 0xff) {
                output[op++] = (c >>> 8) & 0xff;
            }
            output[op++] = c & 0xff;
        }
        output[op++] = 0; // null termination
    }

    // fhcrc
    if (this.flags["fhcrc"]) {
        crc16 = Zlib.CRC32.calc(output, 0, op) & 0xffff;
        output[op++] = crc16 & 0xff;
        output[op++] = (crc16 >>> 8) & 0xff;
    }

    // add compress option
    this.deflateOptions["outputBuffer"] = output;
    this.deflateOptions["outputIndex"] = op;

    // compress
    rawdeflate = new Zlib.RawDeflate(input, this.deflateOptions);
    output = rawdeflate.compress();
    op = rawdeflate.op;

    // expand buffer
    {
        if (op + 8 > output.buffer.byteLength) {
            this.output = new Uint8Array(op + 8);
            this.output.set(new Uint8Array(output.buffer));
            output = this.output;
        } else {
            output = new Uint8Array(output.buffer);
        }
    }

    // crc32
    crc32 = Zlib.CRC32.calc(input);
    output[op++] = crc32 & 0xff;
    output[op++] = (crc32 >>> 8) & 0xff;
    output[op++] = (crc32 >>> 16) & 0xff;
    output[op++] = (crc32 >>> 24) & 0xff;

    // input size
    il = input.length;
    output[op++] = il & 0xff;
    output[op++] = (il >>> 8) & 0xff;
    output[op++] = (il >>> 16) & 0xff;
    output[op++] = (il >>> 24) & 0xff;

    this.ip = ip;

    if (op < output.length) {
        this.output = output = output.subarray(0, op);
    }

    return output;
};

/** @enum {number} */
Zlib.Gzip.OperatingSystem = {
    FAT: 0,
    AMIGA: 1,
    VMS: 2,
    UNIX: 3,
    VM_CMS: 4,
    ATARI_TOS: 5,
    HPFS: 6,
    MACINTOSH: 7,
    Z_SYSTEM: 8,
    CP_M: 9,
    TOPS_20: 10,
    NTFS: 11,
    QDOS: 12,
    ACORN_RISCOS: 13,
    UNKNOWN: 255,
};

/** @enum {number} */
Zlib.Gzip.FlagsMask = {
    FTEXT: 0x01,
    FHCRC: 0x02,
    FEXTRA: 0x04,
    FNAME: 0x08,
    FCOMMENT: 0x10,
};

/**
 * @fileoverview Heap Sort 実装. ハフマン符号化で使用する.
 */

/**
 * カスタムハフマン符号で使用するヒープ実装
 * @param {number} length ヒープサイズ.
 * @constructor
 */
Zlib.Heap = function (length) {
    this.buffer = new Uint16Array(length * 2);
    this.length = 0;
};

/**
 * 親ノードの index 取得
 * @param {number} index 子ノードの index.
 * @return {number} 親ノードの index.
 *
 */
Zlib.Heap.prototype.getParent = function (index) {
    return (((index - 2) / 4) | 0) * 2;
};

/**
 * 子ノードの index 取得
 * @param {number} index 親ノードの index.
 * @return {number} 子ノードの index.
 */
Zlib.Heap.prototype.getChild = function (index) {
    return 2 * index + 2;
};

/**
 * Heap に値を追加する
 * @param {number} index キー index.
 * @param {number} value 値.
 * @return {number} 現在のヒープ長.
 */
Zlib.Heap.prototype.push = function (index, value) {
    var current,
        parent,
        heap = this.buffer,
        swap;

    current = this.length;
    heap[this.length++] = value;
    heap[this.length++] = index;

    // ルートノードにたどり着くまで入れ替えを試みる
    while (current > 0) {
        parent = this.getParent(current);

        // 親ノードと比較して親の方が小さければ入れ替える
        if (heap[current] > heap[parent]) {
            swap = heap[current];
            heap[current] = heap[parent];
            heap[parent] = swap;

            swap = heap[current + 1];
            heap[current + 1] = heap[parent + 1];
            heap[parent + 1] = swap;

            current = parent;
            // 入れ替えが必要なくなったらそこで抜ける
        } else {
            break;
        }
    }

    return this.length;
};

/**
 * Heapから一番大きい値を返す
 * @return {{index: number, value: number, length: number}} {index: キーindex,
 *     value: 値, length: ヒープ長} の Object.
 */
Zlib.Heap.prototype.pop = function () {
    var index,
        value,
        heap = this.buffer,
        swap,
        current,
        parent;

    value = heap[0];
    index = heap[1];

    // 後ろから値を取る
    this.length -= 2;
    heap[0] = heap[this.length];
    heap[1] = heap[this.length + 1];

    parent = 0;
    // ルートノードから下がっていく
    while (true) {
        current = this.getChild(parent);

        // 範囲チェック
        if (current >= this.length) {
            break;
        }

        // 隣のノードと比較して、隣の方が値が大きければ隣を現在ノードとして選択
        if (current + 2 < this.length && heap[current + 2] > heap[current]) {
            current += 2;
        }

        // 親ノードと比較して親の方が小さい場合は入れ替える
        if (heap[current] > heap[parent]) {
            swap = heap[parent];
            heap[parent] = heap[current];
            heap[current] = swap;

            swap = heap[parent + 1];
            heap[parent + 1] = heap[current + 1];
            heap[current + 1] = swap;
        } else {
            break;
        }

        parent = current;
    }

    return { index: index, value: value, length: this.length };
};

/* vim:set expandtab ts=2 sw=2 tw=80: */

/**
 * @fileoverview Deflate (RFC1951) 符号化アルゴリズム実装.
 */

/**
 * Raw Deflate 実装
 *
 * @constructor
 * @param {!(Array.<number>|Uint8Array)} input 符号化する対象のバッファ.
 * @param {Object=} opt_params option parameters.
 *
 * typed array が使用可能なとき、outputBuffer が Array は自動的に Uint8Array に
 * 変換されます.
 * 別のオブジェクトになるため出力バッファを参照している変数などは
 * 更新する必要があります.
 */
Zlib.RawDeflate = function (input, opt_params) {
    /** @type {Zlib.RawDeflate.CompressionType} */
    this.compressionType = Zlib.RawDeflate.CompressionType.DYNAMIC;
    /** @type {number} */
    this.lazy = 0;
    /** @type {!(Array.<number>|Uint32Array)} */
    this.freqsLitLen;
    /** @type {!(Array.<number>|Uint32Array)} */
    this.freqsDist;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.input = input instanceof Array ? new Uint8Array(input) : input;
    /** @type {!(Array.<number>|Uint8Array)} output output buffer. */
    this.output;
    /** @type {number} pos output buffer position. */
    this.op = 0;

    // option parameters
    if (opt_params) {
        if (opt_params["lazy"]) {
            this.lazy = opt_params["lazy"];
        }
        if (typeof opt_params["compressionType"] === "number") {
            this.compressionType = opt_params["compressionType"];
        }
        if (opt_params["outputBuffer"]) {
            this.output =
                opt_params["outputBuffer"] instanceof Array
                    ? new Uint8Array(opt_params["outputBuffer"])
                    : opt_params["outputBuffer"];
        }
        if (typeof opt_params["outputIndex"] === "number") {
            this.op = opt_params["outputIndex"];
        }
    }

    if (!this.output) {
        this.output = new Uint8Array(0x8000);
    }
};

/**
 * @enum {number}
 */
Zlib.RawDeflate.CompressionType = {
    NONE: 0,
    FIXED: 1,
    DYNAMIC: 2,
    RESERVED: 3,
};

/**
 * LZ77 の最小マッチ長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.Lz77MinLength = 3;

/**
 * LZ77 の最大マッチ長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.Lz77MaxLength = 258;

/**
 * LZ77 のウィンドウサイズ
 * @const
 * @type {number}
 */
Zlib.RawDeflate.WindowSize = 0x8000;

/**
 * 最長の符号長
 * @const
 * @type {number}
 */
Zlib.RawDeflate.MaxCodeLength = 16;

/**
 * ハフマン符号の最大数値
 * @const
 * @type {number}
 */
Zlib.RawDeflate.HUFMAX = 286;

/**
 * 固定ハフマン符号の符号化テーブル
 * @const
 * @type {Array.<Array.<number, number>>}
 */
Zlib.RawDeflate.FixedHuffmanTable = (function () {
    var table = [],
        i;

    for (i = 0; i < 288; i++) {
        switch (true) {
            case i <= 143:
                table.push([i + 0x030, 8]);
                break;
            case i <= 255:
                table.push([i - 144 + 0x190, 9]);
                break;
            case i <= 279:
                table.push([i - 256 + 0x000, 7]);
                break;
            case i <= 287:
                table.push([i - 280 + 0x0c0, 8]);
                break;
            default:
                throw "invalid literal: " + i;
        }
    }

    return table;
})();

/**
 * DEFLATE ブロックの作成
 * @return {!(Array.<number>|Uint8Array)} 圧縮済み byte array.
 */
Zlib.RawDeflate.prototype.compress = function () {
    /** @type {!(Array.<number>|Uint8Array)} */
    var blockArray;
    /** @type {number} */
    var position;
    /** @type {number} */
    var length;

    var input = this.input;

    // compression
    switch (this.compressionType) {
        case Zlib.RawDeflate.CompressionType.NONE:
            // each 65535-Byte (length header: 16-bit)
            for (position = 0, length = input.length; position < length; ) {
                blockArray = input.subarray(position, position + 0xffff);
                position += blockArray.length;
                this.makeNocompressBlock(blockArray, position === length);
            }
            break;
        case Zlib.RawDeflate.CompressionType.FIXED:
            this.output = this.makeFixedHuffmanBlock(input, true);
            this.op = this.output.length;
            break;
        case Zlib.RawDeflate.CompressionType.DYNAMIC:
            this.output = this.makeDynamicHuffmanBlock(input, true);
            this.op = this.output.length;
            break;
        default:
            throw "invalid compression type";
    }

    return this.output;
};

/**
 * 非圧縮ブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 非圧縮ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeNocompressBlock = function (blockArray, isFinalBlock) {
    /** @type {number} */
    var bfinal;
    /** @type {Zlib.RawDeflate.CompressionType} */
    var btype;
    /** @type {number} */
    var len;
    /** @type {number} */
    var nlen;

    var output = this.output;
    var op = this.op;

    // expand buffer
    {
        output = new Uint8Array(this.output.buffer);
        while (output.length <= op + blockArray.length + 5) {
            output = new Uint8Array(output.length << 1);
        }
        output.set(this.output);
    }

    // header
    bfinal = isFinalBlock ? 1 : 0;
    btype = Zlib.RawDeflate.CompressionType.NONE;
    output[op++] = bfinal | (btype << 1);

    // length
    len = blockArray.length;
    nlen = (~len + 0x10000) & 0xffff;
    output[op++] = len & 0xff;
    output[op++] = (len >>> 8) & 0xff;
    output[op++] = nlen & 0xff;
    output[op++] = (nlen >>> 8) & 0xff;

    // copy buffer
    {
        output.set(blockArray, op);
        op += blockArray.length;
        output = output.subarray(0, op);
    }

    this.op = op;
    this.output = output;

    return output;
};

/**
 * 固定ハフマンブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 固定ハフマン符号化ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeFixedHuffmanBlock = function (blockArray, isFinalBlock) {
    /** @type {Zlib.BitStream} */
    var stream = new Zlib.BitStream(new Uint8Array(this.output.buffer), this.op);
    /** @type {number} */
    var bfinal;
    /** @type {Zlib.RawDeflate.CompressionType} */
    var btype;
    /** @type {!(Array.<number>|Uint16Array)} */
    var data;

    // header
    bfinal = isFinalBlock ? 1 : 0;
    btype = Zlib.RawDeflate.CompressionType.FIXED;

    stream.writeBits(bfinal, 1, true);
    stream.writeBits(btype, 2, true);

    data = this.lz77(blockArray);
    this.fixedHuffman(data, stream);

    return stream.finish();
};

/**
 * 動的ハフマンブロックの作成
 * @param {!(Array.<number>|Uint8Array)} blockArray ブロックデータ byte array.
 * @param {!boolean} isFinalBlock 最後のブロックならばtrue.
 * @return {!(Array.<number>|Uint8Array)} 動的ハフマン符号ブロック byte array.
 */
Zlib.RawDeflate.prototype.makeDynamicHuffmanBlock = function (blockArray, isFinalBlock) {
    /** @type {Zlib.BitStream} */
    var stream = new Zlib.BitStream(new Uint8Array(this.output.buffer), this.op);
    /** @type {number} */
    var bfinal;
    /** @type {Zlib.RawDeflate.CompressionType} */
    var btype;
    /** @type {!(Array.<number>|Uint16Array)} */
    var data;
    /** @type {number} */
    var hlit;
    /** @type {number} */
    var hdist;
    /** @type {number} */
    var hclen;
    /** @const @type {Array.<number>} */
    var hclenOrder = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    /** @type {!(Array.<number>|Uint8Array)} */
    var litLenLengths;
    /** @type {!(Array.<number>|Uint16Array)} */
    var litLenCodes;
    /** @type {!(Array.<number>|Uint8Array)} */
    var distLengths;
    /** @type {!(Array.<number>|Uint16Array)} */
    var distCodes;
    /** @type {{
     *   codes: !(Array.<number>|Uint32Array),
     *   freqs: !(Array.<number>|Uint8Array)
     * }} */
    var treeSymbols;
    /** @type {!(Array.<number>|Uint8Array)} */
    var treeLengths;
    /** @type {Array} */
    var transLengths = new Array(19);
    /** @type {!(Array.<number>|Uint16Array)} */
    var treeCodes;
    /** @type {number} */
    var code;
    /** @type {number} */
    var bitlen;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    // header
    bfinal = isFinalBlock ? 1 : 0;
    btype = Zlib.RawDeflate.CompressionType.DYNAMIC;

    stream.writeBits(bfinal, 1, true);
    stream.writeBits(btype, 2, true);

    data = this.lz77(blockArray);

    // リテラル・長さ, 距離のハフマン符号と符号長の算出
    litLenLengths = this.getLengths_(this.freqsLitLen, 15);
    litLenCodes = this.getCodesFromLengths_(litLenLengths);
    distLengths = this.getLengths_(this.freqsDist, 7);
    distCodes = this.getCodesFromLengths_(distLengths);

    // HLIT, HDIST の決定
    for (hlit = 286; hlit > 257 && litLenLengths[hlit - 1] === 0; hlit--) {}
    for (hdist = 30; hdist > 1 && distLengths[hdist - 1] === 0; hdist--) {}

    // HCLEN
    treeSymbols = this.getTreeSymbols_(hlit, litLenLengths, hdist, distLengths);
    treeLengths = this.getLengths_(treeSymbols.freqs, 7);
    for (i = 0; i < 19; i++) {
        transLengths[i] = treeLengths[hclenOrder[i]];
    }
    for (hclen = 19; hclen > 4 && transLengths[hclen - 1] === 0; hclen--) {}

    treeCodes = this.getCodesFromLengths_(treeLengths);

    // 出力
    stream.writeBits(hlit - 257, 5, true);
    stream.writeBits(hdist - 1, 5, true);
    stream.writeBits(hclen - 4, 4, true);
    for (i = 0; i < hclen; i++) {
        stream.writeBits(transLengths[i], 3, true);
    }

    // ツリーの出力
    for (i = 0, il = treeSymbols.codes.length; i < il; i++) {
        code = treeSymbols.codes[i];

        stream.writeBits(treeCodes[code], treeLengths[code], true);

        // extra bits
        if (code >= 16) {
            i++;
            switch (code) {
                case 16:
                    bitlen = 2;
                    break;
                case 17:
                    bitlen = 3;
                    break;
                case 18:
                    bitlen = 7;
                    break;
                default:
                    throw "invalid code: " + code;
            }

            stream.writeBits(treeSymbols.codes[i], bitlen, true);
        }
    }

    this.dynamicHuffman(data, [litLenCodes, litLenLengths], [distCodes, distLengths], stream);

    return stream.finish();
};

/**
 * 動的ハフマン符号化(カスタムハフマンテーブル)
 * @param {!(Array.<number>|Uint16Array)} dataArray LZ77 符号化済み byte array.
 * @param {!Zlib.BitStream} stream 書き込み用ビットストリーム.
 * @return {!Zlib.BitStream} ハフマン符号化済みビットストリームオブジェクト.
 */
Zlib.RawDeflate.prototype.dynamicHuffman = function (dataArray, litLen, dist, stream) {
    /** @type {number} */
    var index;
    /** @type {number} */
    var length;
    /** @type {number} */
    var literal;
    /** @type {number} */
    var code;
    /** @type {number} */
    var litLenCodes;
    /** @type {number} */
    var litLenLengths;
    /** @type {number} */
    var distCodes;
    /** @type {number} */
    var distLengths;

    litLenCodes = litLen[0];
    litLenLengths = litLen[1];
    distCodes = dist[0];
    distLengths = dist[1];

    // 符号を BitStream に書き込んでいく
    for (index = 0, length = dataArray.length; index < length; ++index) {
        literal = dataArray[index];

        // literal or length
        stream.writeBits(litLenCodes[literal], litLenLengths[literal], true);

        // 長さ・距離符号
        if (literal > 256) {
            // length extra
            stream.writeBits(dataArray[++index], dataArray[++index], true);
            // distance
            code = dataArray[++index];
            stream.writeBits(distCodes[code], distLengths[code], true);
            // distance extra
            stream.writeBits(dataArray[++index], dataArray[++index], true);
            // 終端
        } else if (literal === 256) {
            break;
        }
    }

    return stream;
};

/**
 * 固定ハフマン符号化
 * @param {!(Array.<number>|Uint16Array)} dataArray LZ77 符号化済み byte array.
 * @param {!Zlib.BitStream} stream 書き込み用ビットストリーム.
 * @return {!Zlib.BitStream} ハフマン符号化済みビットストリームオブジェクト.
 */
Zlib.RawDeflate.prototype.fixedHuffman = function (dataArray, stream) {
    /** @type {number} */
    var index;
    /** @type {number} */
    var length;
    /** @type {number} */
    var literal;

    // 符号を BitStream に書き込んでいく
    for (index = 0, length = dataArray.length; index < length; index++) {
        literal = dataArray[index];

        // 符号の書き込み
        Zlib.BitStream.prototype.writeBits.apply(stream, Zlib.RawDeflate.FixedHuffmanTable[literal]);

        // 長さ・距離符号
        if (literal > 0x100) {
            // length extra
            stream.writeBits(dataArray[++index], dataArray[++index], true);
            // distance
            stream.writeBits(dataArray[++index], 5);
            // distance extra
            stream.writeBits(dataArray[++index], dataArray[++index], true);
            // 終端
        } else if (literal === 0x100) {
            break;
        }
    }

    return stream;
};

/**
 * マッチ情報
 * @param {!number} length マッチした長さ.
 * @param {!number} backwardDistance マッチ位置との距離.
 * @constructor
 */
Zlib.RawDeflate.Lz77Match = function (length, backwardDistance) {
    /** @type {number} match length. */
    this.length = length;
    /** @type {number} backward distance. */
    this.backwardDistance = backwardDistance;
};

/**
 * 長さ符号テーブル.
 * [コード, 拡張ビット, 拡張ビット長] の配列となっている.
 * @const
 * @type {!(Array.<number>|Uint32Array)}
 */
Zlib.RawDeflate.Lz77Match.LengthCodeTable = (function (table) {
    return new Uint32Array(table);
})(
    (function () {
        /** @type {!Array} */
        var table = [];
        /** @type {number} */
        var i;
        /** @type {!Array.<number>} */
        var c;

        for (i = 3; i <= 258; i++) {
            c = code(i);
            table[i] = (c[2] << 24) | (c[1] << 16) | c[0];
        }

        /**
         * @param {number} length lz77 length.
         * @return {!Array.<number>} lz77 codes.
         */
        function code(length) {
            switch (true) {
                case length === 3:
                    return [257, length - 3, 0];
                case length === 4:
                    return [258, length - 4, 0];
                case length === 5:
                    return [259, length - 5, 0];
                case length === 6:
                    return [260, length - 6, 0];
                case length === 7:
                    return [261, length - 7, 0];
                case length === 8:
                    return [262, length - 8, 0];
                case length === 9:
                    return [263, length - 9, 0];
                case length === 10:
                    return [264, length - 10, 0];
                case length <= 12:
                    return [265, length - 11, 1];
                case length <= 14:
                    return [266, length - 13, 1];
                case length <= 16:
                    return [267, length - 15, 1];
                case length <= 18:
                    return [268, length - 17, 1];
                case length <= 22:
                    return [269, length - 19, 2];
                case length <= 26:
                    return [270, length - 23, 2];
                case length <= 30:
                    return [271, length - 27, 2];
                case length <= 34:
                    return [272, length - 31, 2];
                case length <= 42:
                    return [273, length - 35, 3];
                case length <= 50:
                    return [274, length - 43, 3];
                case length <= 58:
                    return [275, length - 51, 3];
                case length <= 66:
                    return [276, length - 59, 3];
                case length <= 82:
                    return [277, length - 67, 4];
                case length <= 98:
                    return [278, length - 83, 4];
                case length <= 114:
                    return [279, length - 99, 4];
                case length <= 130:
                    return [280, length - 115, 4];
                case length <= 162:
                    return [281, length - 131, 5];
                case length <= 194:
                    return [282, length - 163, 5];
                case length <= 226:
                    return [283, length - 195, 5];
                case length <= 257:
                    return [284, length - 227, 5];
                case length === 258:
                    return [285, length - 258, 0];
                default:
                    throw "invalid length: " + length;
            }
        }

        return table;
    })()
);

/**
 * 距離符号テーブル
 * @param {!number} dist 距離.
 * @return {!Array.<number>} コード、拡張ビット、拡張ビット長の配列.
 * @private
 */
Zlib.RawDeflate.Lz77Match.prototype.getDistanceCode_ = function (dist) {
    /** @type {!Array.<number>} distance code table. */
    var r;

    switch (true) {
        case dist === 1:
            r = [0, dist - 1, 0];
            break;
        case dist === 2:
            r = [1, dist - 2, 0];
            break;
        case dist === 3:
            r = [2, dist - 3, 0];
            break;
        case dist === 4:
            r = [3, dist - 4, 0];
            break;
        case dist <= 6:
            r = [4, dist - 5, 1];
            break;
        case dist <= 8:
            r = [5, dist - 7, 1];
            break;
        case dist <= 12:
            r = [6, dist - 9, 2];
            break;
        case dist <= 16:
            r = [7, dist - 13, 2];
            break;
        case dist <= 24:
            r = [8, dist - 17, 3];
            break;
        case dist <= 32:
            r = [9, dist - 25, 3];
            break;
        case dist <= 48:
            r = [10, dist - 33, 4];
            break;
        case dist <= 64:
            r = [11, dist - 49, 4];
            break;
        case dist <= 96:
            r = [12, dist - 65, 5];
            break;
        case dist <= 128:
            r = [13, dist - 97, 5];
            break;
        case dist <= 192:
            r = [14, dist - 129, 6];
            break;
        case dist <= 256:
            r = [15, dist - 193, 6];
            break;
        case dist <= 384:
            r = [16, dist - 257, 7];
            break;
        case dist <= 512:
            r = [17, dist - 385, 7];
            break;
        case dist <= 768:
            r = [18, dist - 513, 8];
            break;
        case dist <= 1024:
            r = [19, dist - 769, 8];
            break;
        case dist <= 1536:
            r = [20, dist - 1025, 9];
            break;
        case dist <= 2048:
            r = [21, dist - 1537, 9];
            break;
        case dist <= 3072:
            r = [22, dist - 2049, 10];
            break;
        case dist <= 4096:
            r = [23, dist - 3073, 10];
            break;
        case dist <= 6144:
            r = [24, dist - 4097, 11];
            break;
        case dist <= 8192:
            r = [25, dist - 6145, 11];
            break;
        case dist <= 12288:
            r = [26, dist - 8193, 12];
            break;
        case dist <= 16384:
            r = [27, dist - 12289, 12];
            break;
        case dist <= 24576:
            r = [28, dist - 16385, 13];
            break;
        case dist <= 32768:
            r = [29, dist - 24577, 13];
            break;
        default:
            throw "invalid distance";
    }

    return r;
};

/**
 * マッチ情報を LZ77 符号化配列で返す.
 * なお、ここでは以下の内部仕様で符号化している
 * [ CODE, EXTRA-BIT-LEN, EXTRA, CODE, EXTRA-BIT-LEN, EXTRA ]
 * @return {!Array.<number>} LZ77 符号化 byte array.
 */
Zlib.RawDeflate.Lz77Match.prototype.toLz77Array = function () {
    /** @type {number} */
    var length = this.length;
    /** @type {number} */
    var dist = this.backwardDistance;
    /** @type {Array} */
    var codeArray = [];
    /** @type {number} */
    var pos = 0;
    /** @type {!Array.<number>} */
    var code;

    // length
    code = Zlib.RawDeflate.Lz77Match.LengthCodeTable[length];
    codeArray[pos++] = code & 0xffff;
    codeArray[pos++] = (code >> 16) & 0xff;
    codeArray[pos++] = code >> 24;

    // distance
    code = this.getDistanceCode_(dist);
    codeArray[pos++] = code[0];
    codeArray[pos++] = code[1];
    codeArray[pos++] = code[2];

    return codeArray;
};

/**
 * LZ77 実装
 * @param {!(Array.<number>|Uint8Array)} dataArray LZ77 符号化するバイト配列.
 * @return {!(Array.<number>|Uint16Array)} LZ77 符号化した配列.
 */
Zlib.RawDeflate.prototype.lz77 = function (dataArray) {
    /** @type {number} input position */
    var position;
    /** @type {number} input length */
    var length;
    /** @type {number} loop counter */
    var i;
    /** @type {number} loop limiter */
    var il;
    /** @type {number} chained-hash-table key */
    var matchKey;
    /** @type {Object.<number, Array.<number>>} chained-hash-table */
    var table = {};
    /** @const @type {number} */
    var windowSize = Zlib.RawDeflate.WindowSize;
    /** @type {Array.<number>} match list */
    var matchList;
    /** @type {Zlib.RawDeflate.Lz77Match} longest match */
    var longestMatch;
    /** @type {Zlib.RawDeflate.Lz77Match} previous longest match */
    var prevMatch;
    /** @type {!(Array.<number>|Uint16Array)} lz77 buffer */
    var lz77buf = new Uint16Array(dataArray.length * 2);
    /** @type {number} lz77 output buffer pointer */
    var pos = 0;
    /** @type {number} lz77 skip length */
    var skipLength = 0;
    /** @type {!(Array.<number>|Uint32Array)} */
    var freqsLitLen = new Uint32Array(286);
    /** @type {!(Array.<number>|Uint32Array)} */
    var freqsDist = new Uint32Array(30);
    /** @type {number} */
    var lazy = this.lazy;
    /** @type {*} temporary variable */
    var tmp;
    freqsLitLen[256] = 1; // EOB の最低出現回数は 1

    /**
     * マッチデータの書き込み
     * @param {Zlib.RawDeflate.Lz77Match} match LZ77 Match data.
     * @param {!number} offset スキップ開始位置(相対指定).
     * @private
     */
    function writeMatch(match, offset) {
        /** @type {Array.<number>} */
        var lz77Array = match.toLz77Array();
        /** @type {number} */
        var i;
        /** @type {number} */
        var il;

        for (i = 0, il = lz77Array.length; i < il; ++i) {
            lz77buf[pos++] = lz77Array[i];
        }
        freqsLitLen[lz77Array[0]]++;
        freqsDist[lz77Array[3]]++;
        skipLength = match.length + offset - 1;
        prevMatch = null;
    }

    // LZ77 符号化
    for (position = 0, length = dataArray.length; position < length; ++position) {
        // ハッシュキーの作成
        for (matchKey = 0, i = 0, il = Zlib.RawDeflate.Lz77MinLength; i < il; ++i) {
            if (position + i === length) {
                break;
            }
            matchKey = (matchKey << 8) | dataArray[position + i];
        }

        // テーブルが未定義だったら作成する
        if (table[matchKey] === void 0) {
            table[matchKey] = [];
        }
        matchList = table[matchKey];

        // skip
        if (skipLength-- > 0) {
            matchList.push(position);
            continue;
        }

        // マッチテーブルの更新 (最大戻り距離を超えているものを削除する)
        while (matchList.length > 0 && position - matchList[0] > windowSize) {
            matchList.shift();
        }

        // データ末尾でマッチしようがない場合はそのまま流しこむ
        if (position + Zlib.RawDeflate.Lz77MinLength >= length) {
            if (prevMatch) {
                writeMatch(prevMatch, -1);
            }

            for (i = 0, il = length - position; i < il; ++i) {
                tmp = dataArray[position + i];
                lz77buf[pos++] = tmp;
                ++freqsLitLen[tmp];
            }
            break;
        }

        // マッチ候補から最長のものを探す
        if (matchList.length > 0) {
            longestMatch = this.searchLongestMatch_(dataArray, position, matchList);

            if (prevMatch) {
                // 現在のマッチの方が前回のマッチよりも長い
                if (prevMatch.length < longestMatch.length) {
                    // write previous literal
                    tmp = dataArray[position - 1];
                    lz77buf[pos++] = tmp;
                    ++freqsLitLen[tmp];

                    // write current match
                    writeMatch(longestMatch, 0);
                } else {
                    // write previous match
                    writeMatch(prevMatch, -1);
                }
            } else if (longestMatch.length < lazy) {
                prevMatch = longestMatch;
            } else {
                writeMatch(longestMatch, 0);
            }
            // 前回マッチしていて今回マッチがなかったら前回のを採用
        } else if (prevMatch) {
            writeMatch(prevMatch, -1);
        } else {
            tmp = dataArray[position];
            lz77buf[pos++] = tmp;
            ++freqsLitLen[tmp];
        }

        matchList.push(position); // マッチテーブルに現在の位置を保存
    }

    // 終端処理
    lz77buf[pos++] = 256;
    freqsLitLen[256]++;
    this.freqsLitLen = freqsLitLen;
    this.freqsDist = freqsDist;

    return /** @type {!(Uint16Array|Array.<number>)} */ (lz77buf.subarray(0, pos));
};

/**
 * マッチした候補の中から最長一致を探す
 * @param {!Object} data plain data byte array.
 * @param {!number} position plain data byte array position.
 * @param {!Array.<number>} matchList 候補となる位置の配列.
 * @return {!Zlib.RawDeflate.Lz77Match} 最長かつ最短距離のマッチオブジェクト.
 * @private
 */
Zlib.RawDeflate.prototype.searchLongestMatch_ = function (data, position, matchList) {
    var match,
        currentMatch,
        matchMax = 0,
        matchLength,
        i,
        j,
        l,
        dl = data.length;

    // 候補を後ろから 1 つずつ絞り込んでゆく
    permatch: for (i = 0, l = matchList.length; i < l; i++) {
        match = matchList[l - i - 1];
        matchLength = Zlib.RawDeflate.Lz77MinLength;

        // 前回までの最長一致を末尾から一致検索する
        if (matchMax > Zlib.RawDeflate.Lz77MinLength) {
            for (j = matchMax; j > Zlib.RawDeflate.Lz77MinLength; j--) {
                if (data[match + j - 1] !== data[position + j - 1]) {
                    continue permatch;
                }
            }
            matchLength = matchMax;
        }

        // 最長一致探索
        while (
            matchLength < Zlib.RawDeflate.Lz77MaxLength &&
            position + matchLength < dl &&
            data[match + matchLength] === data[position + matchLength]
        ) {
            ++matchLength;
        }

        // マッチ長が同じ場合は後方を優先
        if (matchLength > matchMax) {
            currentMatch = match;
            matchMax = matchLength;
        }

        // 最長が確定したら後の処理は省略
        if (matchLength === Zlib.RawDeflate.Lz77MaxLength) {
            break;
        }
    }

    return new Zlib.RawDeflate.Lz77Match(matchMax, position - currentMatch);
};

/**
 * Tree-Transmit Symbols の算出
 * reference: PuTTY Deflate implementation
 * @param {number} hlit HLIT.
 * @param {!(Array.<number>|Uint8Array)} litlenLengths リテラルと長さ符号の符号長配列.
 * @param {number} hdist HDIST.
 * @param {!(Array.<number>|Uint8Array)} distLengths 距離符号の符号長配列.
 * @return {{
 *   codes: !(Array.<number>|Uint32Array),
 *   freqs: !(Array.<number>|Uint8Array)
 * }} Tree-Transmit Symbols.
 */
Zlib.RawDeflate.prototype.getTreeSymbols_ = function (hlit, litlenLengths, hdist, distLengths) {
    var src = new Uint32Array(hlit + hdist),
        i,
        j,
        runLength,
        l,
        result = new Uint32Array(286 + 30),
        nResult,
        rpt,
        freqs = new Uint8Array(19);

    j = 0;
    for (i = 0; i < hlit; i++) {
        src[j++] = litlenLengths[i];
    }
    for (i = 0; i < hdist; i++) {
        src[j++] = distLengths[i];
    }

    // 符号��
    nResult = 0;
    for (i = 0, l = src.length; i < l; i += j) {
        // Run Length Encoding
        for (j = 1; i + j < l && src[i + j] === src[i]; ++j) {}

        runLength = j;

        if (src[i] === 0) {
            // 0 の繰り返しが 3 回未満ならばそのまま
            if (runLength < 3) {
                while (runLength-- > 0) {
                    result[nResult++] = 0;
                    freqs[0]++;
                }
            } else {
                while (runLength > 0) {
                    // 繰り返しは最大 138 までなので切り詰める
                    rpt = runLength < 138 ? runLength : 138;

                    if (rpt > runLength - 3 && rpt < runLength) {
                        rpt = runLength - 3;
                    }

                    // 3-10 回 -> 17
                    if (rpt <= 10) {
                        result[nResult++] = 17;
                        result[nResult++] = rpt - 3;
                        freqs[17]++;
                        // 11-138 回 -> 18
                    } else {
                        result[nResult++] = 18;
                        result[nResult++] = rpt - 11;
                        freqs[18]++;
                    }

                    runLength -= rpt;
                }
            }
        } else {
            result[nResult++] = src[i];
            freqs[src[i]]++;
            runLength--;

            // 繰り返し回数が3回未満ならばランレングス符号は要らない
            if (runLength < 3) {
                while (runLength-- > 0) {
                    result[nResult++] = src[i];
                    freqs[src[i]]++;
                }
                // 3 回以上ならばランレングス符号化
            } else {
                while (runLength > 0) {
                    // runLengthを 3-6 で分割
                    rpt = runLength < 6 ? runLength : 6;

                    if (rpt > runLength - 3 && rpt < runLength) {
                        rpt = runLength - 3;
                    }

                    result[nResult++] = 16;
                    result[nResult++] = rpt - 3;
                    freqs[16]++;

                    runLength -= rpt;
                }
            }
        }
    }

    return {
        codes: result.subarray(0, nResult),
        freqs: freqs,
    };
};

/**
 * ハフマン符号の長さを取得する
 * @param {!(Array.<number>|Uint8Array|Uint32Array)} freqs 出現カウント.
 * @param {number} limit 符号長の制限.
 * @return {!(Array.<number>|Uint8Array)} 符号長配列.
 * @private
 */
Zlib.RawDeflate.prototype.getLengths_ = function (freqs, limit) {
    /** @type {number} */
    var nSymbols = freqs.length;
    /** @type {Zlib.Heap} */
    var heap = new Zlib.Heap(2 * Zlib.RawDeflate.HUFMAX);
    /** @type {!(Array.<number>|Uint8Array)} */
    var length = new Uint8Array(nSymbols);
    /** @type {Array} */
    var nodes;
    /** @type {!(Array.<number>|Uint32Array)} */
    var values;
    /** @type {!(Array.<number>|Uint8Array)} */
    var codeLength;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    // ヒープの構築
    for (i = 0; i < nSymbols; ++i) {
        if (freqs[i] > 0) {
            heap.push(i, freqs[i]);
        }
    }
    nodes = new Array(heap.length / 2);
    values = new Uint32Array(heap.length / 2);

    // 非 0 の要素が一つだけだった場合は、そのシンボルに符号長 1 を割り当てて終了
    if (nodes.length === 1) {
        length[heap.pop().index] = 1;
        return length;
    }

    // Reverse Package Merge Algorithm による Canonical Huffman Code の符号長決定
    for (i = 0, il = heap.length / 2; i < il; ++i) {
        nodes[i] = heap.pop();
        values[i] = nodes[i].value;
    }
    codeLength = this.reversePackageMerge_(values, values.length, limit);

    for (i = 0, il = nodes.length; i < il; ++i) {
        length[nodes[i].index] = codeLength[i];
    }

    return length;
};

/**
 * Reverse Package Merge Algorithm.
 * @param {!(Array.<number>|Uint32Array)} freqs sorted probability.
 * @param {number} symbols number of symbols.
 * @param {number} limit code length limit.
 * @return {!(Array.<number>|Uint8Array)} code lengths.
 */
Zlib.RawDeflate.prototype.reversePackageMerge_ = function (freqs, symbols, limit) {
    /** @type {!(Array.<number>|Uint16Array)} */
    var minimumCost = new Uint16Array(limit);
    /** @type {!(Array.<number>|Uint8Array)} */
    var flag = new Uint8Array(limit);
    /** @type {!(Array.<number>|Uint8Array)} */
    var codeLength = new Uint8Array(symbols);
    /** @type {Array} */
    var value = new Array(limit);
    /** @type {Array} */
    var type = new Array(limit);
    /** @type {Array.<number>} */
    var currentPosition = new Array(limit);
    /** @type {number} */
    var excess = (1 << limit) - symbols;
    /** @type {number} */
    var half = 1 << (limit - 1);
    /** @type {number} */
    var i;
    /** @type {number} */
    var j;
    /** @type {number} */
    var t;
    /** @type {number} */
    var weight;
    /** @type {number} */
    var next;

    /**
     * @param {number} j
     */
    function takePackage(j) {
        /** @type {number} */
        var x = type[j][currentPosition[j]];

        if (x === symbols) {
            takePackage(j + 1);
            takePackage(j + 1);
        } else {
            --codeLength[x];
        }

        ++currentPosition[j];
    }

    minimumCost[limit - 1] = symbols;

    for (j = 0; j < limit; ++j) {
        if (excess < half) {
            flag[j] = 0;
        } else {
            flag[j] = 1;
            excess -= half;
        }
        excess <<= 1;
        minimumCost[limit - 2 - j] = ((minimumCost[limit - 1 - j] / 2) | 0) + symbols;
    }
    minimumCost[0] = flag[0];

    value[0] = new Array(minimumCost[0]);
    type[0] = new Array(minimumCost[0]);
    for (j = 1; j < limit; ++j) {
        if (minimumCost[j] > 2 * minimumCost[j - 1] + flag[j]) {
            minimumCost[j] = 2 * minimumCost[j - 1] + flag[j];
        }
        value[j] = new Array(minimumCost[j]);
        type[j] = new Array(minimumCost[j]);
    }

    for (i = 0; i < symbols; ++i) {
        codeLength[i] = limit;
    }

    for (t = 0; t < minimumCost[limit - 1]; ++t) {
        value[limit - 1][t] = freqs[t];
        type[limit - 1][t] = t;
    }

    for (i = 0; i < limit; ++i) {
        currentPosition[i] = 0;
    }
    if (flag[limit - 1] === 1) {
        --codeLength[0];
        ++currentPosition[limit - 1];
    }

    for (j = limit - 2; j >= 0; --j) {
        i = 0;
        weight = 0;
        next = currentPosition[j + 1];

        for (t = 0; t < minimumCost[j]; t++) {
            weight = value[j + 1][next] + value[j + 1][next + 1];

            if (weight > freqs[i]) {
                value[j][t] = weight;
                type[j][t] = symbols;
                next += 2;
            } else {
                value[j][t] = freqs[i];
                type[j][t] = i;
                ++i;
            }
        }

        currentPosition[j] = 0;
        if (flag[j] === 1) {
            takePackage(j);
        }
    }

    return codeLength;
};

/**
 * 符号長配列からハフマン符号を取得する
 * reference: PuTTY Deflate implementation
 * @param {!(Array.<number>|Uint8Array)} lengths 符号長配列.
 * @return {!(Array.<number>|Uint16Array)} ハフマン符号配列.
 * @private
 */
Zlib.RawDeflate.prototype.getCodesFromLengths_ = function (lengths) {
    var codes = new Uint16Array(lengths.length),
        count = [],
        startCode = [],
        code = 0,
        i,
        il,
        j,
        m;

    // Count the codes of each length.
    for (i = 0, il = lengths.length; i < il; i++) {
        count[lengths[i]] = (count[lengths[i]] | 0) + 1;
    }

    // Determine the starting code for each length block.
    for (i = 1, il = Zlib.RawDeflate.MaxCodeLength; i <= il; i++) {
        startCode[i] = code;
        code += count[i] | 0;
        code <<= 1;
    }

    // Determine the code for each symbol. Mirrored, of course.
    for (i = 0, il = lengths.length; i < il; i++) {
        code = startCode[lengths[i]];
        startCode[lengths[i]] += 1;
        codes[i] = 0;

        for (j = 0, m = lengths[i]; j < m; j++) {
            codes[i] = (codes[i] << 1) | (code & 1);
            code >>>= 1;
        }
    }

    return codes;
};

/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {Object=} opt_params options.
 * @constructor
 */
Zlib.Unzip = function (input, opt_params) {
    opt_params = opt_params || {};
    /** @type {!(Array.<number>|Uint8Array)} */
    this.input = input instanceof Array ? new Uint8Array(input) : input;
    /** @type {number} */
    this.ip = 0;
    /** @type {number} */
    this.eocdrOffset;
    /** @type {number} */
    this.numberOfThisDisk;
    /** @type {number} */
    this.startDisk;
    /** @type {number} */
    this.totalEntriesThisDisk;
    /** @type {number} */
    this.totalEntries;
    /** @type {number} */
    this.centralDirectorySize;
    /** @type {number} */
    this.centralDirectoryOffset;
    /** @type {number} */
    this.commentLength;
    /** @type {(Array.<number>|Uint8Array)} */
    this.comment;
    /** @type {Array.<Zlib.Unzip.FileHeader>} */
    this.fileHeaderList;
    /** @type {Object.<string, number>} */
    this.filenameToIndex;
    /** @type {boolean} */
    this.verify = opt_params["verify"] || false;
    /** @type {(Array.<number>|Uint8Array)} */
    this.password = opt_params["password"];
};

Zlib.Unzip.CompressionMethod = Zlib.Zip.CompressionMethod;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.FileHeaderSignature = Zlib.Zip.FileHeaderSignature;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.LocalFileHeaderSignature = Zlib.Zip.LocalFileHeaderSignature;

/**
 * @type {Array.<number>}
 * @const
 */
Zlib.Unzip.CentralDirectorySignature = Zlib.Zip.CentralDirectorySignature;

/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {number} ip input position.
 * @constructor
 */
Zlib.Unzip.FileHeader = function (input, ip) {
    /** @type {!(Array.<number>|Uint8Array)} */
    this.input = input;
    /** @type {number} */
    this.offset = ip;
    /** @type {number} */
    this.length;
    /** @type {number} */
    this.version;
    /** @type {number} */
    this.os;
    /** @type {number} */
    this.needVersion;
    /** @type {number} */
    this.flags;
    /** @type {number} */
    this.compression;
    /** @type {number} */
    this.time;
    /** @type {number} */
    this.date;
    /** @type {number} */
    this.crc32;
    /** @type {number} */
    this.compressedSize;
    /** @type {number} */
    this.plainSize;
    /** @type {number} */
    this.fileNameLength;
    /** @type {number} */
    this.extraFieldLength;
    /** @type {number} */
    this.fileCommentLength;
    /** @type {number} */
    this.diskNumberStart;
    /** @type {number} */
    this.internalFileAttributes;
    /** @type {number} */
    this.externalFileAttributes;
    /** @type {number} */
    this.relativeOffset;
    /** @type {string} */
    this.filename;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.extraField;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.comment;
};

Zlib.Unzip.FileHeader.prototype.parse = function () {
    /** @type {!(Array.<number>|Uint8Array)} */
    var input = this.input;
    /** @type {number} */
    var ip = this.offset;

    // central file header signature
    if (
        input[ip++] !== Zlib.Unzip.FileHeaderSignature[0] ||
        input[ip++] !== Zlib.Unzip.FileHeaderSignature[1] ||
        input[ip++] !== Zlib.Unzip.FileHeaderSignature[2] ||
        input[ip++] !== Zlib.Unzip.FileHeaderSignature[3]
    ) {
        throw new Error("invalid file header signature");
    }

    // version made by
    this.version = input[ip++];
    this.os = input[ip++];

    // version needed to extract
    this.needVersion = input[ip++] | (input[ip++] << 8);

    // general purpose bit flag
    this.flags = input[ip++] | (input[ip++] << 8);

    // compression method
    this.compression = input[ip++] | (input[ip++] << 8);

    // last mod file time
    this.time = input[ip++] | (input[ip++] << 8);

    //last mod file date
    this.date = input[ip++] | (input[ip++] << 8);

    // crc-32
    this.crc32 = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // compressed size
    this.compressedSize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // uncompressed size
    this.plainSize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // file name length
    this.fileNameLength = input[ip++] | (input[ip++] << 8);

    // extra field length
    this.extraFieldLength = input[ip++] | (input[ip++] << 8);

    // file comment length
    this.fileCommentLength = input[ip++] | (input[ip++] << 8);

    // disk number start
    this.diskNumberStart = input[ip++] | (input[ip++] << 8);

    // internal file attributes
    this.internalFileAttributes = input[ip++] | (input[ip++] << 8);

    // external file attributes
    this.externalFileAttributes = input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24);

    // relative offset of local header
    this.relativeOffset = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // file name
    this.filename = String.fromCharCode.apply(null, input.subarray(ip, (ip += this.fileNameLength)));

    // extra field
    this.extraField = input.subarray(ip, (ip += this.extraFieldLength));

    // file comment
    this.comment = input.subarray(ip, ip + this.fileCommentLength);

    this.length = ip - this.offset;
};

/**
 * @param {!(Array.<number>|Uint8Array)} input input buffer.
 * @param {number} ip input position.
 * @constructor
 */
Zlib.Unzip.LocalFileHeader = function (input, ip) {
    /** @type {!(Array.<number>|Uint8Array)} */
    this.input = input;
    /** @type {number} */
    this.offset = ip;
    /** @type {number} */
    this.length;
    /** @type {number} */
    this.needVersion;
    /** @type {number} */
    this.flags;
    /** @type {number} */
    this.compression;
    /** @type {number} */
    this.time;
    /** @type {number} */
    this.date;
    /** @type {number} */
    this.crc32;
    /** @type {number} */
    this.compressedSize;
    /** @type {number} */
    this.plainSize;
    /** @type {number} */
    this.fileNameLength;
    /** @type {number} */
    this.extraFieldLength;
    /** @type {string} */
    this.filename;
    /** @type {!(Array.<number>|Uint8Array)} */
    this.extraField;
};

Zlib.Unzip.LocalFileHeader.Flags = Zlib.Zip.Flags;

Zlib.Unzip.LocalFileHeader.prototype.parse = function () {
    /** @type {!(Array.<number>|Uint8Array)} */
    var input = this.input;
    /** @type {number} */
    var ip = this.offset;

    // local file header signature
    if (
        input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[0] ||
        input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[1] ||
        input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[2] ||
        input[ip++] !== Zlib.Unzip.LocalFileHeaderSignature[3]
    ) {
        throw new Error("invalid local file header signature");
    }

    // version needed to extract
    this.needVersion = input[ip++] | (input[ip++] << 8);

    // general purpose bit flag
    this.flags = input[ip++] | (input[ip++] << 8);

    // compression method
    this.compression = input[ip++] | (input[ip++] << 8);

    // last mod file time
    this.time = input[ip++] | (input[ip++] << 8);

    //last mod file date
    this.date = input[ip++] | (input[ip++] << 8);

    // crc-32
    this.crc32 = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // compressed size
    this.compressedSize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // uncompressed size
    this.plainSize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // file name length
    this.fileNameLength = input[ip++] | (input[ip++] << 8);

    // extra field length
    this.extraFieldLength = input[ip++] | (input[ip++] << 8);

    // file name
    this.filename = String.fromCharCode.apply(null, input.subarray(ip, (ip += this.fileNameLength)));

    // extra field
    this.extraField = input.subarray(ip, (ip += this.extraFieldLength));

    this.length = ip - this.offset;
};

Zlib.Unzip.prototype.searchEndOfCentralDirectoryRecord = function () {
    /** @type {!(Array.<number>|Uint8Array)} */
    var input = this.input;
    /** @type {number} */
    var ip;

    for (ip = input.length - 12; ip > 0; --ip) {
        if (
            input[ip] === Zlib.Unzip.CentralDirectorySignature[0] &&
            input[ip + 1] === Zlib.Unzip.CentralDirectorySignature[1] &&
            input[ip + 2] === Zlib.Unzip.CentralDirectorySignature[2] &&
            input[ip + 3] === Zlib.Unzip.CentralDirectorySignature[3]
        ) {
            this.eocdrOffset = ip;
            return;
        }
    }

    throw new Error("End of Central Directory Record not found");
};

Zlib.Unzip.prototype.parseEndOfCentralDirectoryRecord = function () {
    /** @type {!(Array.<number>|Uint8Array)} */
    var input = this.input;
    /** @type {number} */
    var ip;

    if (!this.eocdrOffset) {
        this.searchEndOfCentralDirectoryRecord();
    }
    ip = this.eocdrOffset;

    // signature
    if (
        input[ip++] !== Zlib.Unzip.CentralDirectorySignature[0] ||
        input[ip++] !== Zlib.Unzip.CentralDirectorySignature[1] ||
        input[ip++] !== Zlib.Unzip.CentralDirectorySignature[2] ||
        input[ip++] !== Zlib.Unzip.CentralDirectorySignature[3]
    ) {
        throw new Error("invalid signature");
    }

    // number of this disk
    this.numberOfThisDisk = input[ip++] | (input[ip++] << 8);

    // number of the disk with the start of the central directory
    this.startDisk = input[ip++] | (input[ip++] << 8);

    // total number of entries in the central directory on this disk
    this.totalEntriesThisDisk = input[ip++] | (input[ip++] << 8);

    // total number of entries in the central directory
    this.totalEntries = input[ip++] | (input[ip++] << 8);

    // size of the central directory
    this.centralDirectorySize = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // offset of start of central directory with respect to the starting disk number
    this.centralDirectoryOffset = (input[ip++] | (input[ip++] << 8) | (input[ip++] << 16) | (input[ip++] << 24)) >>> 0;

    // .ZIP file comment length
    this.commentLength = input[ip++] | (input[ip++] << 8);

    // .ZIP file comment
    this.comment = input.subarray(ip, ip + this.commentLength);
};

Zlib.Unzip.prototype.parseFileHeader = function () {
    /** @type {Array.<Zlib.Unzip.FileHeader>} */
    var filelist = [];
    /** @type {Object.<string, number>} */
    var filetable = {};
    /** @type {number} */
    var ip;
    /** @type {Zlib.Unzip.FileHeader} */
    var fileHeader;
    /*: @type {number} */
    var i;
    /*: @type {number} */
    var il;

    if (this.fileHeaderList) {
        return;
    }

    if (this.centralDirectoryOffset === void 0) {
        this.parseEndOfCentralDirectoryRecord();
    }
    ip = this.centralDirectoryOffset;

    for (i = 0, il = this.totalEntries; i < il; ++i) {
        fileHeader = new Zlib.Unzip.FileHeader(this.input, ip);
        fileHeader.parse();
        ip += fileHeader.length;
        filelist[i] = fileHeader;
        filetable[fileHeader.filename] = i;
    }

    if (this.centralDirectorySize < ip - this.centralDirectoryOffset) {
        throw new Error("invalid file header size");
    }

    this.fileHeaderList = filelist;
    this.filenameToIndex = filetable;
};

/**
 * @param {number} index file header index.
 * @param {Object=} opt_params
 * @return {!(Array.<number>|Uint8Array)} file data.
 */
Zlib.Unzip.prototype.getFileData = function (index, opt_params) {
    opt_params = opt_params || {};
    /** @type {!(Array.<number>|Uint8Array)} */
    var input = this.input;
    /** @type {Array.<Zlib.Unzip.FileHeader>} */
    var fileHeaderList = this.fileHeaderList;
    /** @type {Zlib.Unzip.LocalFileHeader} */
    var localFileHeader;
    /** @type {number} */
    var offset;
    /** @type {number} */
    var length;
    /** @type {!(Array.<number>|Uint8Array)} */
    var buffer;
    /** @type {number} */
    var crc32;
    /** @type {Array.<number>|Uint32Array|Object} */
    var key;
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    if (!fileHeaderList) {
        this.parseFileHeader();
    }

    if (fileHeaderList[index] === void 0) {
        throw new Error("wrong index");
    }

    offset = fileHeaderList[index].relativeOffset;
    localFileHeader = new Zlib.Unzip.LocalFileHeader(this.input, offset);
    localFileHeader.parse();
    offset += localFileHeader.length;
    length = localFileHeader.compressedSize;

    // decryption
    if ((localFileHeader.flags & Zlib.Unzip.LocalFileHeader.Flags.ENCRYPT) !== 0) {
        if (!(opt_params["password"] || this.password)) {
            throw new Error("please set password");
        }
        key = this.createDecryptionKey(opt_params["password"] || this.password);

        // encryption header
        for (i = offset, il = offset + 12; i < il; ++i) {
            this.decode(key, input[i]);
        }
        offset += 12;
        length -= 12;

        // decryption
        for (i = offset, il = offset + length; i < il; ++i) {
            input[i] = this.decode(key, input[i]);
        }
    }

    switch (localFileHeader.compression) {
        case Zlib.Unzip.CompressionMethod.STORE:
            buffer = this.input.subarray(offset, offset + length);
            break;
        case Zlib.Unzip.CompressionMethod.DEFLATE:
            buffer = new Zlib.RawInflate(this.input, {
                index: offset,
                bufferSize: localFileHeader.plainSize,
            }).decompress();
            break;
        default:
            throw new Error("unknown compression type");
    }

    if (this.verify) {
        crc32 = Zlib.CRC32.calc(buffer);
        if (localFileHeader.crc32 !== crc32) {
            throw new Error(
                "wrong crc: file=0x" + localFileHeader.crc32.toString(16) + ", data=0x" + crc32.toString(16)
            );
        }
    }

    return buffer;
};

/**
 * @return {Array.<string>}
 */
Zlib.Unzip.prototype.getFilenames = function () {
    /** @type {Array.<string>} */
    var filenameList = [];
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {Array.<Zlib.Unzip.FileHeader>} */
    var fileHeaderList;

    if (!this.fileHeaderList) {
        this.parseFileHeader();
    }
    fileHeaderList = this.fileHeaderList;

    for (i = 0, il = fileHeaderList.length; i < il; ++i) {
        filenameList[i] = fileHeaderList[i].filename;
    }

    return filenameList;
};

/**
 * @param {string} filename extract filename.
 * @param {Object=} opt_params
 * @return {!(Array.<number>|Uint8Array)} decompressed data.
 */
Zlib.Unzip.prototype.decompress = function (filename, opt_params) {
    /** @type {number} */
    var index;

    if (!this.filenameToIndex) {
        this.parseFileHeader();
    }
    index = this.filenameToIndex[filename];

    if (index === void 0) {
        throw new Error(filename + " not found");
    }

    return this.getFileData(index, opt_params);
};

/**
 * @param {(Array.<number>|Uint8Array)} password
 */
Zlib.Unzip.prototype.setPassword = function (password) {
    this.password = password;
};

/**
 * @param {(Array.<number>|Uint32Array|Object)} key
 * @param {number} n
 * @return {number}
 */
Zlib.Unzip.prototype.decode = function (key, n) {
    n ^= this.getByte(/** @type {(Array.<number>|Uint32Array)} */ (key));
    this.updateKeys(/** @type {(Array.<number>|Uint32Array)} */ (key), n);

    return n;
};

// common method
Zlib.Unzip.prototype.updateKeys = Zlib.Zip.prototype.updateKeys;
Zlib.Unzip.prototype.createDecryptionKey = Zlib.Zip.prototype.createEncryptionKey;
Zlib.Unzip.prototype.getByte = Zlib.Zip.prototype.getByte;

/**
 * @fileoverview 雑多な関数群をまとめたモジュール実装.
 */

/**
 * Byte String から Byte Array に変換.
 * @param {!string} str byte string.
 * @return {!Array.<number>} byte array.
 */
Zlib.Util.stringToByteArray = function (str) {
    /** @type {!Array.<(string|number)>} */
    var tmp = str.split("");
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;

    for (i = 0, il = tmp.length; i < il; i++) {
        tmp[i] = (tmp[i].charCodeAt(0) & 0xff) >>> 0;
    }

    return tmp;
};

/**
 * @fileoverview Adler32 checksum 実装.
 */

/**
 * Adler32 ハッシュ値の作成
 * @param {!(Array|Uint8Array|string)} array 算出に使用する byte array.
 * @return {number} Adler32 ハッシュ値.
 */
Zlib.Adler32 = function (array) {
    if (typeof array === "string") {
        array = Zlib.Util.stringToByteArray(array);
    }
    return Zlib.Adler32.update(1, array);
};

/**
 * Adler32 ハッシュ値の更新
 * @param {number} adler 現在のハッシュ値.
 * @param {!(Array|Uint8Array)} array 更新に使用する byte array.
 * @return {number} Adler32 ハッシュ値.
 */
Zlib.Adler32.update = function (adler, array) {
    /** @type {number} */
    var s1 = adler & 0xffff;
    /** @type {number} */
    var s2 = (adler >>> 16) & 0xffff;
    /** @type {number} array length */
    var len = array.length;
    /** @type {number} loop length (don't overflow) */
    var tlen;
    /** @type {number} array index */
    var i = 0;

    while (len > 0) {
        tlen = len > Zlib.Adler32.OptimizationParameter ? Zlib.Adler32.OptimizationParameter : len;
        len -= tlen;
        do {
            s1 += array[i++];
            s2 += s1;
        } while (--tlen);

        s1 %= 65521;
        s2 %= 65521;
    }

    return ((s2 << 16) | s1) >>> 0;
};

/**
 * Adler32 最適化パラメータ
 * 現状では 1024 程度が最適.
 * @see http://jsperf.com/adler-32-simple-vs-optimized/3
 * @define {number}
 */
Zlib.Adler32.OptimizationParameter = 1024;

/**
 * ビットストリーム
 * @constructor
 * @param {!(Array|Uint8Array)=} buffer output buffer.
 * @param {number=} bufferPosition start buffer pointer.
 */
Zlib.BitStream = function (buffer, bufferPosition) {
    /** @type {number} buffer index. */
    this.index = typeof bufferPosition === "number" ? bufferPosition : 0;
    /** @type {number} bit index. */
    this.bitindex = 0;
    /** @type {!(Array|Uint8Array)} bit-stream output buffer. */
    this.buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(Zlib.BitStream.DefaultBlockSize);

    // 入力された index が足りなかったら拡張するが、倍にしてもダメなら不正とする
    if (this.buffer.length * 2 <= this.index) {
        throw new Error("invalid index");
    } else if (this.buffer.length <= this.index) {
        this.expandBuffer();
    }
};

/**
 * デフォルトブロックサイズ.
 * @const
 * @type {number}
 */
Zlib.BitStream.DefaultBlockSize = 0x8000;

/**
 * expand buffer.
 * @return {!(Array|Uint8Array)} new buffer.
 */
Zlib.BitStream.prototype.expandBuffer = function () {
    /** @type {!(Array|Uint8Array)} old buffer. */
    var oldbuf = this.buffer;
    /** @type {number} loop limiter. */
    var il = oldbuf.length;
    /** @type {!(Array|Uint8Array)} new buffer. */
    var buffer = new Uint8Array(il << 1);

    // copy buffer
    {
        buffer.set(oldbuf);
    }

    return (this.buffer = buffer);
};

/**
 * 数値をビットで指定した数だけ書き込む.
 * @param {number} number 書き込む数値.
 * @param {number} n 書き込むビット数.
 * @param {boolean=} reverse 逆順に書き込むならば true.
 */
Zlib.BitStream.prototype.writeBits = function (number, n, reverse) {
    var buffer = this.buffer;
    var index = this.index;
    var bitindex = this.bitindex;

    /** @type {number} current octet. */
    var current = buffer[index];
    /** @type {number} loop counter. */
    var i;

    /**
     * 32-bit 整数のビット順を逆にする
     * @param {number} n 32-bit integer.
     * @return {number} reversed 32-bit integer.
     * @private
     */
    function rev32_(n) {
        return (
            (Zlib.BitStream.ReverseTable[n & 0xff] << 24) |
            (Zlib.BitStream.ReverseTable[(n >>> 8) & 0xff] << 16) |
            (Zlib.BitStream.ReverseTable[(n >>> 16) & 0xff] << 8) |
            Zlib.BitStream.ReverseTable[(n >>> 24) & 0xff]
        );
    }

    if (reverse && n > 1) {
        number = n > 8 ? rev32_(number) >> (32 - n) : Zlib.BitStream.ReverseTable[number] >> (8 - n);
    }

    // Byte 境界を超えないとき
    if (n + bitindex < 8) {
        current = (current << n) | number;
        bitindex += n;
        // Byte 境界を超えるとき
    } else {
        for (i = 0; i < n; ++i) {
            current = (current << 1) | ((number >> (n - i - 1)) & 1);

            // next byte
            if (++bitindex === 8) {
                bitindex = 0;
                buffer[index++] = Zlib.BitStream.ReverseTable[current];
                current = 0;

                // expand
                if (index === buffer.length) {
                    buffer = this.expandBuffer();
                }
            }
        }
    }
    buffer[index] = current;

    this.buffer = buffer;
    this.bitindex = bitindex;
    this.index = index;
};

/**
 * ストリームの終端処理を行う
 * @return {!(Array|Uint8Array)} 終端処理後のバッファを byte array で返す.
 */
Zlib.BitStream.prototype.finish = function () {
    var buffer = this.buffer;
    var index = this.index;

    /** @type {!(Array|Uint8Array)} output buffer. */
    var output;

    // bitindex が 0 の時は余分に index が進んでいる状態
    if (this.bitindex > 0) {
        buffer[index] <<= 8 - this.bitindex;
        buffer[index] = Zlib.BitStream.ReverseTable[buffer[index]];
        index++;
    }

    // array truncation
    {
        output = buffer.subarray(0, index);
    }

    return output;
};

/**
 * 0-255 のビット順を反転したテーブル
 * @const
 * @type {!(Uint8Array|Array.<number>)}
 */
Zlib.BitStream.ReverseTable = (function (table) {
    return table;
})(
    (function () {
        /** @type {!(Array|Uint8Array)} reverse table. */
        var table = new Uint8Array(256);
        /** @type {number} loop counter. */
        var i;

        // generate
        for (i = 0; i < 256; ++i) {
            table[i] = (function (n) {
                var r = n;
                var s = 7;

                for (n >>>= 1; n; n >>>= 1) {
                    r <<= 1;
                    r |= n & 1;
                    --s;
                }

                return ((r << s) & 0xff) >>> 0;
            })(i);
        }

        return table;
    })()
);

/**
 * CRC32 ハッシュ値を取得
 * @param {!(Array.<number>|Uint8Array)} data data byte array.
 * @param {number=} pos data position.
 * @param {number=} length data length.
 * @return {number} CRC32.
 */
Zlib.CRC32.calc = function (data, pos, length) {
    return Zlib.CRC32.update(data, 0, pos, length);
};

/**
 * CRC32ハッシュ値を更新
 * @param {!(Array.<number>|Uint8Array)} data data byte array.
 * @param {number} crc CRC32.
 * @param {number=} pos data position.
 * @param {number=} length data length.
 * @return {number} CRC32.
 */
Zlib.CRC32.update = function (data, crc, pos, length) {
    var table = Zlib.CRC32.Table;
    var i = typeof pos === "number" ? pos : (pos = 0);
    var il = typeof length === "number" ? length : data.length;

    crc ^= 0xffffffff;

    // loop unrolling for performance
    for (i = il & 7; i--; ++pos) {
        crc = (crc >>> 8) ^ table[(crc ^ data[pos]) & 0xff];
    }
    for (i = il >> 3; i--; pos += 8) {
        crc = (crc >>> 8) ^ table[(crc ^ data[pos]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 1]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 2]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 3]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 4]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 5]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 6]) & 0xff];
        crc = (crc >>> 8) ^ table[(crc ^ data[pos + 7]) & 0xff];
    }

    return (crc ^ 0xffffffff) >>> 0;
};

/**
 * @param {number} num
 * @param {number} crc
 * @returns {number}
 */
Zlib.CRC32.single = function (num, crc) {
    return (Zlib.CRC32.Table[(num ^ crc) & 0xff] ^ (num >>> 8)) >>> 0;
};

/**
 * @type {Array.<number>}
 * @const
 * @private
 */
Zlib.CRC32.Table_ = [
    0x00000000,
    0x77073096,
    0xee0e612c,
    0x990951ba,
    0x076dc419,
    0x706af48f,
    0xe963a535,
    0x9e6495a3,
    0x0edb8832,
    0x79dcb8a4,
    0xe0d5e91e,
    0x97d2d988,
    0x09b64c2b,
    0x7eb17cbd,
    0xe7b82d07,
    0x90bf1d91,
    0x1db71064,
    0x6ab020f2,
    0xf3b97148,
    0x84be41de,
    0x1adad47d,
    0x6ddde4eb,
    0xf4d4b551,
    0x83d385c7,
    0x136c9856,
    0x646ba8c0,
    0xfd62f97a,
    0x8a65c9ec,
    0x14015c4f,
    0x63066cd9,
    0xfa0f3d63,
    0x8d080df5,
    0x3b6e20c8,
    0x4c69105e,
    0xd56041e4,
    0xa2677172,
    0x3c03e4d1,
    0x4b04d447,
    0xd20d85fd,
    0xa50ab56b,
    0x35b5a8fa,
    0x42b2986c,
    0xdbbbc9d6,
    0xacbcf940,
    0x32d86ce3,
    0x45df5c75,
    0xdcd60dcf,
    0xabd13d59,
    0x26d930ac,
    0x51de003a,
    0xc8d75180,
    0xbfd06116,
    0x21b4f4b5,
    0x56b3c423,
    0xcfba9599,
    0xb8bda50f,
    0x2802b89e,
    0x5f058808,
    0xc60cd9b2,
    0xb10be924,
    0x2f6f7c87,
    0x58684c11,
    0xc1611dab,
    0xb6662d3d,
    0x76dc4190,
    0x01db7106,
    0x98d220bc,
    0xefd5102a,
    0x71b18589,
    0x06b6b51f,
    0x9fbfe4a5,
    0xe8b8d433,
    0x7807c9a2,
    0x0f00f934,
    0x9609a88e,
    0xe10e9818,
    0x7f6a0dbb,
    0x086d3d2d,
    0x91646c97,
    0xe6635c01,
    0x6b6b51f4,
    0x1c6c6162,
    0x856530d8,
    0xf262004e,
    0x6c0695ed,
    0x1b01a57b,
    0x8208f4c1,
    0xf50fc457,
    0x65b0d9c6,
    0x12b7e950,
    0x8bbeb8ea,
    0xfcb9887c,
    0x62dd1ddf,
    0x15da2d49,
    0x8cd37cf3,
    0xfbd44c65,
    0x4db26158,
    0x3ab551ce,
    0xa3bc0074,
    0xd4bb30e2,
    0x4adfa541,
    0x3dd895d7,
    0xa4d1c46d,
    0xd3d6f4fb,
    0x4369e96a,
    0x346ed9fc,
    0xad678846,
    0xda60b8d0,
    0x44042d73,
    0x33031de5,
    0xaa0a4c5f,
    0xdd0d7cc9,
    0x5005713c,
    0x270241aa,
    0xbe0b1010,
    0xc90c2086,
    0x5768b525,
    0x206f85b3,
    0xb966d409,
    0xce61e49f,
    0x5edef90e,
    0x29d9c998,
    0xb0d09822,
    0xc7d7a8b4,
    0x59b33d17,
    0x2eb40d81,
    0xb7bd5c3b,
    0xc0ba6cad,
    0xedb88320,
    0x9abfb3b6,
    0x03b6e20c,
    0x74b1d29a,
    0xead54739,
    0x9dd277af,
    0x04db2615,
    0x73dc1683,
    0xe3630b12,
    0x94643b84,
    0x0d6d6a3e,
    0x7a6a5aa8,
    0xe40ecf0b,
    0x9309ff9d,
    0x0a00ae27,
    0x7d079eb1,
    0xf00f9344,
    0x8708a3d2,
    0x1e01f268,
    0x6906c2fe,
    0xf762575d,
    0x806567cb,
    0x196c3671,
    0x6e6b06e7,
    0xfed41b76,
    0x89d32be0,
    0x10da7a5a,
    0x67dd4acc,
    0xf9b9df6f,
    0x8ebeeff9,
    0x17b7be43,
    0x60b08ed5,
    0xd6d6a3e8,
    0xa1d1937e,
    0x38d8c2c4,
    0x4fdff252,
    0xd1bb67f1,
    0xa6bc5767,
    0x3fb506dd,
    0x48b2364b,
    0xd80d2bda,
    0xaf0a1b4c,
    0x36034af6,
    0x41047a60,
    0xdf60efc3,
    0xa867df55,
    0x316e8eef,
    0x4669be79,
    0xcb61b38c,
    0xbc66831a,
    0x256fd2a0,
    0x5268e236,
    0xcc0c7795,
    0xbb0b4703,
    0x220216b9,
    0x5505262f,
    0xc5ba3bbe,
    0xb2bd0b28,
    0x2bb45a92,
    0x5cb36a04,
    0xc2d7ffa7,
    0xb5d0cf31,
    0x2cd99e8b,
    0x5bdeae1d,
    0x9b64c2b0,
    0xec63f226,
    0x756aa39c,
    0x026d930a,
    0x9c0906a9,
    0xeb0e363f,
    0x72076785,
    0x05005713,
    0x95bf4a82,
    0xe2b87a14,
    0x7bb12bae,
    0x0cb61b38,
    0x92d28e9b,
    0xe5d5be0d,
    0x7cdcefb7,
    0x0bdbdf21,
    0x86d3d2d4,
    0xf1d4e242,
    0x68ddb3f8,
    0x1fda836e,
    0x81be16cd,
    0xf6b9265b,
    0x6fb077e1,
    0x18b74777,
    0x88085ae6,
    0xff0f6a70,
    0x66063bca,
    0x11010b5c,
    0x8f659eff,
    0xf862ae69,
    0x616bffd3,
    0x166ccf45,
    0xa00ae278,
    0xd70dd2ee,
    0x4e048354,
    0x3903b3c2,
    0xa7672661,
    0xd06016f7,
    0x4969474d,
    0x3e6e77db,
    0xaed16a4a,
    0xd9d65adc,
    0x40df0b66,
    0x37d83bf0,
    0xa9bcae53,
    0xdebb9ec5,
    0x47b2cf7f,
    0x30b5ffe9,
    0xbdbdf21c,
    0xcabac28a,
    0x53b39330,
    0x24b4a3a6,
    0xbad03605,
    0xcdd70693,
    0x54de5729,
    0x23d967bf,
    0xb3667a2e,
    0xc4614ab8,
    0x5d681b02,
    0x2a6f2b94,
    0xb40bbe37,
    0xc30c8ea1,
    0x5a05df1b,
    0x2d02ef8d,
];

/**
 * @type {!(Array.<number>|Uint32Array)} CRC-32 Table.
 * @const
 */
Zlib.CRC32.Table = new Uint32Array(Zlib.CRC32.Table_);

/**
 * @fileoverview Deflate (RFC1951) 実装.
 * Deflateアルゴリズム本体は Zlib.RawDeflate で実装されている.
 */

/**
 * Zlib Deflate
 * @constructor
 * @param {!(Array|Uint8Array)} input 符号化する対象の byte array.
 * @param {Object=} opt_params option parameters.
 */
Zlib.Deflate = function (input, opt_params) {
    /** @type {!(Array|Uint8Array)} */
    this.input = input;
    /** @type {!(Array|Uint8Array)} */
    this.output = new Uint8Array(Zlib.Deflate.DefaultBufferSize);
    /** @type {Zlib.Deflate.CompressionType} */
    this.compressionType = Zlib.Deflate.CompressionType.DYNAMIC;
    /** @type {Zlib.RawDeflate} */
    this.rawDeflate;
    /** @type {Object} */
    var rawDeflateOption = {};
    /** @type {string} */
    var prop;

    // option parameters
    if (opt_params || !(opt_params = {})) {
        if (typeof opt_params["compressionType"] === "number") {
            this.compressionType = opt_params["compressionType"];
        }
    }

    // copy options
    for (prop in opt_params) {
        rawDeflateOption[prop] = opt_params[prop];
    }

    // set raw-deflate output buffer
    rawDeflateOption["outputBuffer"] = this.output;

    this.rawDeflate = new Zlib.RawDeflate(this.input, rawDeflateOption);
};

/**
 * @const
 * @type {number} デフォルトバッファサイズ.
 */
Zlib.Deflate.DefaultBufferSize = 0x8000;

/**
 * @enum {number}
 */
Zlib.Deflate.CompressionType = Zlib.RawDeflate.CompressionType;

/**
 * 直接圧縮に掛ける.
 * @param {!(Array|Uint8Array)} input target buffer.
 * @param {Object=} opt_params option parameters.
 * @return {!(Array|Uint8Array)} compressed data byte array.
 */
Zlib.Deflate.compress = function (input, opt_params) {
    return new Zlib.Deflate(input, opt_params).compress();
};

/**
 * Deflate Compression.
 * @return {!(Array|Uint8Array)} compressed data byte array.
 */
Zlib.Deflate.prototype.compress = function () {
    /** @type {Zlib.CompressionMethod} */
    var cm;
    /** @type {number} */
    var cinfo;
    /** @type {number} */
    var cmf;
    /** @type {number} */
    var flg;
    /** @type {number} */
    var fcheck;
    /** @type {number} */
    var fdict;
    /** @type {number} */
    var flevel;
    /** @type {number} */
    var adler;
    /** @type {!(Array|Uint8Array)} */
    var output;
    /** @type {number} */
    var pos = 0;

    output = this.output;

    // Compression Method and Flags
    cm = Zlib.CompressionMethod.DEFLATE;
    switch (cm) {
        case Zlib.CompressionMethod.DEFLATE:
            cinfo = Math.LOG2E * Math.log(Zlib.RawDeflate.WindowSize) - 8;
            break;
        default:
            throw new Error("invalid compression method");
    }
    cmf = (cinfo << 4) | cm;
    output[pos++] = cmf;

    // Flags
    fdict = 0;
    switch (cm) {
        case Zlib.CompressionMethod.DEFLATE:
            switch (this.compressionType) {
                case Zlib.Deflate.CompressionType.NONE:
                    flevel = 0;
                    break;
                case Zlib.Deflate.CompressionType.FIXED:
                    flevel = 1;
                    break;
                case Zlib.Deflate.CompressionType.DYNAMIC:
                    flevel = 2;
                    break;
                default:
                    throw new Error("unsupported compression type");
            }
            break;
        default:
            throw new Error("invalid compression method");
    }
    flg = (flevel << 6) | (fdict << 5);
    fcheck = 31 - ((cmf * 256 + flg) % 31);
    flg |= fcheck;
    output[pos++] = flg;

    // Adler-32 checksum
    adler = Zlib.Adler32(this.input);

    this.rawDeflate.op = pos;
    output = this.rawDeflate.compress();
    pos = output.length;

    {
        // subarray 分を元にもどす
        output = new Uint8Array(output.buffer);
        // expand buffer
        if (output.length <= pos + 4) {
            this.output = new Uint8Array(output.length + 4);
            this.output.set(output);
            output = this.output;
        }
        output = output.subarray(0, pos + 4);
    }

    // adler32
    output[pos++] = (adler >> 24) & 0xff;
    output[pos++] = (adler >> 16) & 0xff;
    output[pos++] = (adler >> 8) & 0xff;
    output[pos++] = adler & 0xff;

    return output;
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const google = {
    fileInfoCache: {},

    // Crude test, this is conservative, nothing bad happens for a false positive
    isGoogleURL: function (url) {
        return (
            (url.includes("googleapis") && !url.includes("urlshortener")) ||
            this.isGoogleCloudURL(url) ||
            this.isGoogleStorageURL(url) ||
            this.isGoogleDrive(url)
        );
    },

    isGoogleStorageURL: function (url) {
        return (
            url.startsWith("https://www.googleapis.com/storage") ||
            url.startsWith("https://storage.cloud.google.com") ||
            url.startsWith("https://storage.googleapis.com")
        );
    },

    isGoogleCloudURL: function (url) {
        return url.startsWith("gs://");
    },

    isGoogleDrive: function (url) {
        return url.indexOf("drive.google.com") >= 0 || url.indexOf("www.googleapis.com/drive") > 0;
    },

    setApiKey: function (key) {
        this.apiKey = key;
    },

    translateGoogleCloudURL: function (gsUrl) {
        var i, bucket, object, qIdx, objectString, paramString;

        i = gsUrl.indexOf("/", 5);
        qIdx = gsUrl.indexOf("?");

        if (i < 0) {
            return gsUrl;
        }

        bucket = gsUrl.substring(5, i);

        objectString = qIdx < 0 ? gsUrl.substring(i + 1) : gsUrl.substring(i + 1, qIdx);
        object = encodeURIComponent(objectString);

        if (qIdx > 0) {
            paramString = gsUrl.substring(qIdx);
        }

        return (
            "https://www.googleapis.com/storage/v1/b/" +
            bucket +
            "/o/" +
            object +
            (paramString ? paramString + "&alt=media" : "?alt=media")
        );
    },

    addApiKey: function (url) {
        const apiKey = this.apiKey;
        if (apiKey !== undefined && !url.includes("key=")) {
            const paramSeparator = url.includes("?") ? "&" : "?";
            url = url + paramSeparator + "key=" + apiKey;
        }
        return url;
    },

    driveDownloadURL: function (link) {
        // Return a google drive download url for the sharable link
        //https://drive.google.com/open?id=0B-lleX9c2pZFbDJ4VVRxakJzVGM
        //https://drive.google.com/file/d/1_FC4kCeO8E3V4dJ1yIW7A0sn1yURKIX-/view?usp=sharing
        var id = getGoogleDriveFileID(link);
        return id ? "https://www.googleapis.com/drive/v3/files/" + id + "?alt=media&supportsTeamDrives=true" : link;
    },

    getDriveFileInfo: function (googleDriveURL) {
        const id = getGoogleDriveFileID(googleDriveURL);
        const endPoint = "https://www.googleapis.com/drive/v3/files/" + id + "?supportsTeamDrives=true";
        return igvxhr.loadJson(endPoint, buildOptions({}));
    },

    loadGoogleProperties: function (propertiesURL) {
        const self = this;

        return igvxhr
            .loadArrayBuffer(propertiesURL)

            .then(function (arrayBuffer) {
                var inflate, plain, str;

                inflate = new Zlib.Gunzip(new Uint8Array(arrayBuffer));
                plain = inflate.decompress();
                str = String.fromCharCode.apply(null, plain);

                const properties = JSON.parse(str);
                self.setApiKey(properties["api_key"]);

                self.properties = properties;
                return properties;
            });
    },
};

function getGoogleDriveFileID(link) {
    //https://drive.google.com/file/d/1_FC4kCeO8E3V4dJ1yIW7A0sn1yURKIX-/view?usp=sharing
    var i1, i2;

    if (link.includes("/open?id=")) {
        i1 = link.indexOf("/open?id=") + 9;
        i2 = link.indexOf("&");
        if (i1 > 0 && i2 > i1) {
            return link.substring(i1, i2);
        } else if (i1 > 0) {
            return link.substring(i1);
        }
    } else if (link.includes("/file/d/")) {
        i1 = link.indexOf("/file/d/") + 8;
        i2 = link.lastIndexOf("/");
        return link.substring(i1, i2);
    }
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2015 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const oauth = {
    oauthTokens: {},

    setToken: function (token, host) {
        if (!host) {
            this.google.access_token = token;
        } else {
            this.oauthTokens[host] = token;
        }
    },

    getToken: function (host) {
        let token;

        if (!host) {
            token = this.google.access_token;
        } else {
            for (let key in this.oauthTokens) {
                const regex = wildcardToRegExp(key);
                if (regex.test(host)) {
                    token = this.oauthTokens[key];
                    break;
                }
            }
        }

        return token;
    },

    removeToken: function (host) {
        if (!host) {
            delete oauth.google["access_token"];
        } else {
            delete this.oauthTokens[host];
        }
    },

    // Special object for google -- legacy support
    google: {
        setToken: function (token) {
            this.access_token = token;
        },
    },
};

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 *
 * credit https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
 */
function wildcardToRegExp(s) {
    return new RegExp("^" + s.split(/\*+/).map(regExpEscape).join(".*") + "$");
}

/**
 * RegExp-escapes all characters in the given string.
 *
 * credit https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f
 */
function regExpEscape(s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}

// Uncompress data,  assumed to be series of bgzipped blocks
function unbgzf(data, lim) {
    const oBlockList = [];
    let ptr = 0;
    let totalSize = 0;

    lim = lim || data.byteLength - 18;

    while (ptr < lim) {
        try {
            const ba = new Uint8Array(data, ptr, 18);
            const xlen = (ba[11] << 8) | ba[10];
            const si1 = ba[12];
            const si2 = ba[13];
            const slen = (ba[15] << 8) | ba[14];
            const bsize = ((ba[17] << 8) | ba[16]) + 1;
            const start = 12 + xlen + ptr; // Start of CDATA
            const bytesLeft = data.byteLength - start;
            const cDataSize = bsize - xlen - 19;
            if (bytesLeft < cDataSize) break;

            const a = new Uint8Array(data, start, cDataSize);
            const inflate = new Zlib.RawInflate(a);
            const unc = inflate.decompress();

            ptr += inflate.ip + 26;
            totalSize += unc.byteLength;
            oBlockList.push(unc);
        } catch (e) {
            console.error(e);
            break;
        }
    }

    // Concatenate decompressed blocks
    if (oBlockList.length === 1) {
        return oBlockList[0];
    } else {
        const out = new Uint8Array(totalSize);
        let cursor = 0;
        for (let i = 0; i < oBlockList.length; ++i) {
            var b = new Uint8Array(oBlockList[i]);
            arrayCopy(b, 0, out, cursor, b.length);
            cursor += b.length;
        }
        return out;
    }
}

// From Thomas Down's zlib implementation

const testArray = new Uint8Array(1);
const hasSubarray = typeof testArray.subarray === "function";

function arrayCopy(src, srcOffset, dest, destOffset, count) {
    if (count === 0) {
        return;
    }
    if (!src) {
        throw "Undef src";
    } else if (!dest) {
        throw "Undef dest";
    }
    if (srcOffset === 0 && count === src.length) {
        arrayCopy_fast(src, dest, destOffset);
    } else if (hasSubarray) {
        arrayCopy_fast(src.subarray(srcOffset, srcOffset + count), dest, destOffset);
    } else if (src.BYTES_PER_ELEMENT === 1 && count > 100) {
        arrayCopy_fast(new Uint8Array(src.buffer, src.byteOffset + srcOffset, count), dest, destOffset);
    } else {
        arrayCopy_slow(src, srcOffset, dest, destOffset, count);
    }
}

function arrayCopy_slow(src, srcOffset, dest, destOffset, count) {
    for (let i = 0; i < count; ++i) {
        dest[destOffset + i] = src[srcOffset + i];
    }
}

function arrayCopy_fast(src, dest, destOffset) {
    dest.set(src, destOffset);
}

if (typeof process === "object" && typeof window === "undefined") {
    global.atob = function (str) {
        return Buffer.from(str, "base64").toString("binary");
    };
}

/**
 * @param dataURI
 * @returns {Array<number>|Uint8Array}
 */
function decodeDataURI(dataURI) {
    const split = dataURI.split(",");
    const info = split[0].split(":")[1];
    let dataString = split[1];

    if (info.indexOf("base64") >= 0) {
        dataString = atob(dataString);
    } else {
        dataString = decodeURI(dataString); // URL encoded string -- not currently used of tested
    }
    const bytes = new Uint8Array(dataString.length);
    for (let i = 0; i < dataString.length; i++) {
        bytes[i] = dataString.charCodeAt(i);
    }

    let plain;
    if (info.indexOf("gzip") > 0) {
        const inflate = new Zlib.Gunzip(bytes);
        plain = inflate.decompress();
    } else {
        plain = bytes;
    }
    return plain;
}

function parseUri(str) {
    var o = options,
        m = o.parser["loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
}

const options = {
    strictMode: false,
    key: [
        "source",
        "protocol",
        "authority",
        "userInfo",
        "user",
        "password",
        "host",
        "port",
        "relative",
        "path",
        "directory",
        "file",
        "query",
        "anchor",
    ],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g,
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    },
};

// The MIT License (MIT)

/**
 * @constructor
 * @param {Object} options A set op options to pass to the throttle function
 *        @param {number} requestsPerSecond The amount of requests per second
 *                                          the library will limit to
 */
function PromiseThrottle(options) {
    this.requestsPerSecond = options.requestsPerSecond;
    this.promiseImplementation = options.promiseImplementation || Promise;
    this.lastStartTime = 0;
    this.queued = [];
}

/**
 * Adds a promise
 * @param {Function} promise A function returning the promise to be added
 * @param {Object} options A set of options.
 * @param {number} options.signal An AbortSignal object that can be used to abort the returned promise
 * @param {number} options.weight A "weight" of each operation resolving by array of promises
 * @return {Promise} A promise
 */
PromiseThrottle.prototype.add = function (promise, options) {
    var self = this;
    var opt = options || {};
    return new self.promiseImplementation(function (resolve, reject) {
        self.queued.push({
            resolve: resolve,
            reject: reject,
            promise: promise,
            weight: opt.weight || 1,
            signal: opt.signal,
        });

        self.dequeue();
    });
};

/**
 * Adds all the promises passed as parameters
 * @param {Function} promises An array of functions that return a promise
 * @param {Object} options A set of options.
 * @param {number} options.signal An AbortSignal object that can be used to abort the returned promise
 * @param {number} options.weight A "weight" of each operation resolving by array of promises
 * @return {Promise} A promise that succeeds when all the promises passed as options do
 */
PromiseThrottle.prototype.addAll = function (promises, options) {
    var addedPromises = promises.map(
        function (promise) {
            return this.add(promise, options);
        }.bind(this)
    );

    return Promise.all(addedPromises);
};

/**
 * Dequeues a promise
 * @return {void}
 */
PromiseThrottle.prototype.dequeue = function () {
    if (this.queued.length > 0) {
        var now = new Date(),
            weight = this.queued[0].weight,
            inc = (1000 / this.requestsPerSecond) * weight + 1,
            elapsed = now - this.lastStartTime;

        if (elapsed >= inc) {
            this._execute();
        } else {
            // we have reached the limit, schedule a dequeue operation
            setTimeout(
                function () {
                    this.dequeue();
                }.bind(this),
                inc - elapsed
            );
        }
    }
};

/**
 * Executes the promise
 * @private
 * @return {void}
 */
PromiseThrottle.prototype._execute = function () {
    this.lastStartTime = new Date();
    var candidate = this.queued.shift();
    var aborted = candidate.signal && candidate.signal.aborted;
    if (aborted) {
        candidate.reject(new DOMException("", "AbortError"));
    } else {
        candidate
            .promise()
            .then(function (r) {
                candidate.resolve(r);
            })
            .catch(function (r) {
                candidate.reject(r);
            });
    }
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var NONE = 0;
var GZIP = 1;
var BGZF = 2;
var UNKNOWN = 3;
let RANGE_WARNING_GIVEN = false;

const promiseThrottle = new PromiseThrottle({
    requestsPerSecond: 10,
    promiseImplementation: Promise,
});

const igvxhr = {
    load: async function (url, options) {
        options = options || {};

        if (url instanceof Promise) {
            const resolvedValue = await url;
            return this.load(resolvedValue, options);
        } else if (typeof url === "function") {
            return this.load(url(), options);
        } else if (url instanceof File) {
            return loadFileSlice(url, options);
        } else {
            if (url.startsWith("data:")) {
                return decodeDataURI(url);
            } else {
                if (url.startsWith("https://drive.google.com")) {
                    url = google.driveDownloadURL(url);
                }
                if (isGoogleDrive(url)) {
                    const accessToken = await getGoogleAccessToken();
                    options.oauthToken = accessToken;
                    return promiseThrottle.add(function () {
                        return loadURL(url, options);
                    });
                } else {
                    return loadURL(url, options);
                }
            }
        }
    },

    loadArrayBuffer: function (url, options) {
        options = options || {};
        if (!options.responseType) options.responseType = "arraybuffer";

        if (url instanceof File) {
            return loadFileSlice(url, options);
        } else {
            return igvxhr.load(url, options);
        }
    },

    loadJson: function (url, options) {
        options = options || {};

        var method = options.method || (options.sendData ? "POST" : "GET");

        if (method === "POST") options.contentType = "application/json";

        return igvxhr
            .load(url, options)

            .then(function (result) {
                if (result) {
                    return JSON.parse(result);
                } else {
                    return result;
                }
            });
    },

    loadString: function (path, options) {
        options = options || {};

        if (path instanceof File) {
            return loadStringFromFile(path, options);
        } else {
            return loadStringFromUrl(path, options);
        }
    },

    startup: startup,
};

async function loadURL(url, options) {
    url = mapUrl(url);

    options = options || {};

    let oauthToken = options.oauthToken;
    if (typeof oauthToken === "function") {
        oauthToken = oauthToken();
    } else if (oauthToken instanceof Promise) {
        oauthToken = await oauthToken;
    }
    if (!oauthToken) {
        oauthToken = getOauthToken(url); // cached tokens per host
    }

    return new Promise(function (resolve, reject) {
        // Various Google tansformations
        if (google.isGoogleURL(url)) {
            if (url.startsWith("gs://")) {
                url = google.translateGoogleCloudURL(url);
            } else if (google.isGoogleStorageURL(url)) {
                if (!url.includes("altMedia=")) {
                    url += url.includes("?") ? "&altMedia=true" : "?altMedia=true";
                }
            }
        }

        const headers = options.headers || {};
        if (oauthToken) {
            addOauthHeaders(headers, oauthToken);
        }
        const range = options.range;
        const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
        const isSafari = navigator.vendor.indexOf("Apple") === 0 && /\sSafari\//.test(navigator.userAgent);

        if (range && isChrome && !isAmazonV4Signed(url)) {
            // Hack to prevent caching for byte-ranges. Attempt to fix net:err-cache errors in Chrome
            url += url.includes("?") ? "&" : "?";
            url += "someRandomSeed=" + Math.random().toString(36);
        }

        const xhr = new XMLHttpRequest();
        const sendData = options.sendData || options.body;
        const method = options.method || (sendData ? "POST" : "GET");
        const responseType = options.responseType;
        const contentType = options.contentType;
        const mimeType = options.mimeType;

        xhr.open(method, url);

        if (range) {
            var rangeEnd = range.size ? range.start + range.size - 1 : "";
            xhr.setRequestHeader("Range", "bytes=" + range.start + "-" + rangeEnd);
            //      xhr.setRequestHeader("Cache-Control", "no-cache");    <= This can cause CORS issues, disabled for now
        }
        if (contentType) {
            xhr.setRequestHeader("Content-Type", contentType);
        }
        if (mimeType) {
            xhr.overrideMimeType(mimeType);
        }
        if (responseType) {
            xhr.responseType = responseType;
        }
        if (headers) {
            for (let key of Object.keys(headers)) {
                const value = headers[key];
                xhr.setRequestHeader(key, value);
            }
        }

        // NOTE: using withCredentials with servers that return "*" for access-allowed-origin will fail
        if (options.withCredentials === true) {
            xhr.withCredentials = true;
        }

        xhr.onload = async function (event) {
            // when the url points to a local file, the status is 0 but that is not an error
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status <= 300)) {
                if (range && xhr.status !== 206 && range.start !== 0) {
                    // For small files a range starting at 0 can return the whole file => 200
                    // Provide just the slice we asked for, throw out the rest quietly
                    // If file is large warn user
                    if (xhr.response.length > 100000 && !RANGE_WARNING_GIVEN) {
                        Alert.presentAlert(
                            `Warning: Range header ignored for URL: ${url}.  This can have performance impacts.`
                        );
                    }
                    resolve(xhr.response.slice(range.start, range.start + range.size));
                } else {
                    resolve(xhr.response);
                }
            } else if (
                typeof gapi !== "undefined" &&
                (xhr.status === 404 || xhr.status === 401) &&
                google.isGoogleURL(url) &&
                !options.retries
            ) {
                try {
                    options.retries = 1;
                    const accessToken = await getGoogleAccessToken();
                    options.oauthToken = accessToken;
                    const response = await igvxhr.load(url, options);
                    resolve(response);
                } catch (e) {
                    handleError(e);
                }
            } else {
                if (xhr.status === 403) {
                    handleError("Access forbidden: " + url);
                } else if (xhr.status === 416) {
                    //  Tried to read off the end of the file.   This shouldn't happen, but if it does return an
                    handleError("Unsatisfiable range");
                } else {
                    handleError(xhr.status);
                }
            }
        };

        xhr.onerror = function (event) {
            handleError("Error accessing resource: " + url + " Status: " + xhr.status);
        };

        xhr.ontimeout = function (event) {
            handleError("Timed out");
        };

        xhr.onabort = function (event) {
            reject(event);
        };

        try {
            xhr.send(sendData);
        } catch (e) {
            reject(e);
        }

        function handleError(message) {
            if (reject) {
                reject(new Error(message));
            } else {
                throw new Error(message);
            }
        }
    });
}

function loadFileSlice(localfile, options) {
    return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            resolve(fileReader.result);
        };

        fileReader.onerror = function (e) {
            reject(null, fileReader);
        };

        if (options.range) {
            var blob = localfile.slice(options.range.start, options.range.start + options.range.size);
            if ("arraybuffer" === options.responseType) {
                fileReader.readAsArrayBuffer(blob);
            } else {
                fileReader.readAsBinaryString(blob);
            }
        } else {
            if ("arraybuffer" === options.responseType) {
                fileReader.readAsArrayBuffer(localfile);
            } else {
                fileReader.readAsBinaryString(localfile);
            }
        }
    });
}

function loadStringFromFile(localfile, options) {
    options = options || {};

    let blob = options.range
        ? localfile.slice(options.range.start, options.range.start + options.range.size)
        : localfile;

    return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();
        var compression = NONE;
        if (options.bgz || localfile.name.endsWith(".bgz")) {
            compression = BGZF;
        } else if (localfile.name.endsWith(".gz")) {
            compression = GZIP;
        }

        fileReader.onload = function (e) {
            if (compression === NONE) {
                return resolve(fileReader.result);
            } else {
                return resolve(arrayBufferToString(fileReader.result, compression));
            }
        };

        fileReader.onerror = function (e) {
            const error = fileReader.error;
            reject(error + " " + localfile.name, fileReader);
        };

        if (compression === NONE) {
            fileReader.readAsText(blob);
        } else {
            fileReader.readAsArrayBuffer(blob);
        }
    });
}

async function loadStringFromUrl(url, options) {
    options = options || {};

    var fn = options.filename || getFilename(url);

    var compression = UNKNOWN;
    if (options.bgz) {
        compression = BGZF;
    } else if (fn.endsWith(".gz")) {
        compression = GZIP;
    }

    options.responseType = "arraybuffer";
    return igvxhr.load(url, options).then(function (data) {
        return arrayBufferToString(data, compression);
    });
}

function isAmazonV4Signed(url) {
    return url.indexOf("X-Amz-Signature") > -1;
}

function getOauthToken(url) {
    const host = parseUri(url).host;
    let token = oauth.getToken(host);
    if (!token && google.isGoogleURL(url)) {
        token = oauth.google.access_token;
    }
    return token;
}

function addOauthHeaders(headers, acToken) {
    if (acToken) {
        headers["Cache-Control"] = "no-cache";
        headers["Authorization"] = "Bearer " + acToken;
    }
    return headers;
}

/**
 * Perform some well-known url mappings.
 * @param url
 */
function mapUrl(url) {
    if (url.includes("//www.dropbox.com")) {
        return url.replace("//www.dropbox.com", "//dl.dropboxusercontent.com");
    } else if (url.includes("//drive.google.com")) {
        return google.driveDownloadURL(url);
    } else if (url.includes("//www.broadinstitute.org/igvdata")) {
        return url.replace("//www.broadinstitute.org/igvdata", "//data.broadinstitute.org/igvdata");
    } else if (url.includes("//igvdata.broadinstitute.org")) {
        return url.replace("//igvdata.broadinstitute.org", "https://dn7ywbm9isq8j.cloudfront.net");
    } else if (url.startsWith("ftp://ftp.ncbi.nlm.nih.gov/geo")) {
        return url.replace("ftp://", "https://");
    } else {
        return url;
    }
}

function arrayBufferToString(arraybuffer, compression) {
    if (compression === UNKNOWN && arraybuffer.byteLength > 2) {
        const m = new Uint8Array(arraybuffer, 0, 2);
        if (m[0] === 31 && m[1] === 139) {
            compression = GZIP;
        }
    }

    var plain;
    if (compression === GZIP) {
        var inflate = new Zlib.Gunzip(new Uint8Array(arraybuffer));
        plain = inflate.decompress();
    } else if (compression === BGZF) {
        plain = unbgzf(arraybuffer);
    } else {
        plain = new Uint8Array(arraybuffer);
    }

    if ("TextDecoder" in getGlobalObject()) {
        return new TextDecoder().decode(plain);
    } else {
        return decodeUTF8(plain);
    }
}

function isGoogleDrive(url) {
    return url.includes("drive.google.com") || url.includes("www.googleapis.com/drive");
}

/**
 * There can be only 1 oAuth promise executing at a time.
 */
let oauthPromise;
let expiresAt;
let currentUser;
async function getGoogleAccessToken() {
    if (oauth.google.access_token) {
        if (expiresAt && Date.now() > expiresAt && currentUser) {
            // const authInstance = gapi.auth2.getAuthInstance();
            const googleUser = currentUser; //authInstance.currentUser.get();
            const authResponse = await googleUser.reloadAuthResponse();
            oauth.google.access_token = authResponse.access_token;
            expiresAt = authResponse["expires_at"];
        }
        return oauth.google.access_token;
    }
    if (oauthPromise) {
        return oauthPromise;
    }

    if (!(gapi && gapi.auth2)) {
        throw new Error("The Google oAuth API is required but not loaded");
    }

    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance) {
        Alert.presentAlert(
            "Authorization is required, but Google oAuth has not been initalized.  Contact your site administrator for assistance."
        );
        return undefined;
    }

    const scope =
        "https://www.googleapis.com/auth/devstorage.read_only https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.readonly";
    const options = new gapi.auth2.SigninOptionsBuilder();
    options.setPrompt("select_account");
    options.setScope(scope);
    oauthPromise = new Promise(function (resolve, reject) {
        Alert.presentAlert("Google Login required", function () {
            gapi.auth2
                .getAuthInstance()
                .signIn(options)
                .then(function (user) {
                    currentUser = user;
                    const authResponse = user.getAuthResponse();
                    oauth.google.setToken(authResponse["access_token"]);
                    expiresAt = authResponse["expires_at"];
                    resolve(authResponse["access_token"]);
                    oauthPromise = undefined;
                })
                .catch(function (err) {
                    oauthPromise = undefined;
                    reject(err);
                });
        });
    });

    return oauthPromise;
}

//Increments an anonymous usage count.  Count is anonymous, needed for our continued funding.  Please don't delete

let startupCalls = 0;

function startup() {
    const href = window.document.location.href;
    const host = parseUri(href).host;

    if (startupCalls === 0 && !href.includes("localhost") && !href.includes("127.0.0.1")) {
        startupCalls++;

        var url = "https://data.broadinstitute.org/igv/projects/current/counter_igvjs.php?version=" + "0";
        igvxhr
            .load(url)
            .then(function (ignore) {})
            .catch(function (error) {});
    }
}

/**
 * Use when TextDecoder is not available (primarily IE).
 *
 * From: https://gist.github.com/Yaffle/5458286
 *
 * @param octets
 * @returns {string}
 */
function decodeUTF8(octets) {
    var string = "";
    var i = 0;
    while (i < octets.length) {
        var octet = octets[i];
        var bytesNeeded = 0;
        var codePoint = 0;
        if (octet <= 0x7f) {
            bytesNeeded = 0;
            codePoint = octet & 0xff;
        } else if (octet <= 0xdf) {
            bytesNeeded = 1;
            codePoint = octet & 0x1f;
        } else if (octet <= 0xef) {
            bytesNeeded = 2;
            codePoint = octet & 0x0f;
        } else if (octet <= 0xf4) {
            bytesNeeded = 3;
            codePoint = octet & 0x07;
        }
        if (octets.length - i - bytesNeeded > 0) {
            var k = 0;
            while (k < bytesNeeded) {
                octet = octets[i + k + 1];
                codePoint = (codePoint << 6) | (octet & 0x3f);
                k += 1;
            }
        } else {
            codePoint = 0xfffd;
            bytesNeeded = octets.length - i;
        }
        string += String.fromCodePoint(codePoint);
        i += bytesNeeded + 1;
    }
    return string;
}

function getGlobalObject() {
    if (typeof self !== "undefined") {
        return self;
    }
    if (typeof global !== "undefined") {
        return global;
    } else {
        return window;
    }
}

const NiagadsGwasReader = function (config) {
    this.config = config;
    this.url = config.url;
    this.indexed = false;
};

//required function
NiagadsGwasReader.prototype.readFeatures = async function (chr, bpStart, bpEnd) {
    let self = this,
        queryChr = chr.startsWith("chr") ? chr : "chr" + chr,
        queryStart = Math.floor(bpStart),
        queryEnd = Math.ceil(bpEnd),
        queryURL =
            //note that url should already contain partial query string from config
            this.url + "&chromosome=" + queryChr + "&start=" + queryStart + "&end=" + queryEnd;
    const json = await igvxhr.loadJson(queryURL, {
        withCredentials: self.config.withCredentials,
    });
    if (json && json.data) {
        return json.data.map((item) => {
            const pos = item.record_pk.split(":")[1];
            return {
                ...item,
                start: pos - 1,
                end: pos,
                chr, //needed by cache
            };
        });
    } else {
        return undefined;
    }
};

// Assigns a row # to each feature.  If the feature does not fit in any row and #rows == maxRows no
// row number is assigned.
function pack(featureList, maxRows) {
    maxRows = maxRows || Number.MAX_SAFE_INTEGER;
    const rows = [];
    featureList.sort(function (a, b) {
        return a.start - b.start;
    });
    rows.push(-1000);

    for (let feature of featureList) {
        let r = 0;
        const len = Math.min(rows.length, maxRows);
        for (r = 0; r < len; r++) {
            if (feature.start > rows[r]) {
                feature.row = r;
                rows[r] = feature.end;
                break;
            }
        }
        feature.row = r;
        rows[r] = feature.end;
    }
}

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Broad Institute
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const dataRangeMenuItem = MenuUtils.dataRangeMenuItem;

const NiagadsGWASTrack = extend(
    TrackBase,

    function (config, browser) {
        var url = config.url,
            label = config.name;

        this.config = config;
        this.url = url;
        this.name = label;
        this.pValueField = config.pValueField || "pValue";
        this.geneField = config.geneField || "geneSymbol";
        this.snpField = config.snpField || "snp";

        const min = config.minLogP || config.min;
        const max = config.maxLogP || config.max;
        this.dataRange = {
            min: min || 1,
            max: max || 25,
        };

        if (!max) {
            this.autoscale = true;
        } else {
            this.autoscale = config.autoscale;
        }
        this.autoscalePercentile = config.autoscalePercentile === undefined ? 98 : config.autoscalePercentile;

        this.background = config.background; // No default
        this.divider = config.divider || "rgb(225,225,225)";
        this.dotSize = config.dotSize || 2;
        this.height = config.height || 100;
        //FIXME --> turning on autoheight forces fetch and drag stop on every drag
        //it does this because it sets tile.invalid on the call to setContentHeight() on the viewport object, not sure why, but maybe doesn't matter
        this.autoHeight = false;
        this.disableButtons = config.disableButtons;

        // Limit visibility window to 2 mb,  gtex server gets flaky beyond that
        this.visibilityWindow =
            config.visibilityWindow === undefined
                ? 2000000
                : config.visibilityWindow >= 0
                ? Math.min(2000000, config.visibilityWindow)
                : 2000000;

        this.featureSource = new NiagadsGWASFeatureSource(config, browser.genome);
    }
);

NiagadsGWASTrack.prototype.paintAxis = function (ctx, pixelWidth, pixelHeight) {
    var track = this,
        yScale = (track.dataRange.max - track.dataRange.min) / pixelHeight;

    var font = {
        font: "normal 10px Arial",
        textAlign: "right",
        strokeStyle: "black",
    };

    IGVGraphics.fillRect(ctx, 0, 0, pixelWidth, pixelHeight, {
        fillStyle: "rgb(255, 255, 255)",
    });

    // Determine a tick spacing such that there is at least 10 pixels between ticks

    var n = Math.ceil(((this.dataRange.max - this.dataRange.min) * 10) / pixelHeight);

    for (var p = 4; p <= track.dataRange.max; p += n) {
        var x1, x2, y1, y2, ref;

        // TODO: Dashes may not actually line up with correct scale. Ask Jim about this

        ref = 0.85 * pixelWidth;
        x1 = ref - 5;
        x2 = ref;

        y1 = y2 = pixelHeight - Math.round((p - track.dataRange.min) / yScale);

        IGVGraphics.strokeLine(ctx, x1, y1, x2, y2, font); // Offset dashes up by 2 pixel

        if (y1 > 8) {
            IGVGraphics.fillText(ctx, p, x1 - 1, y1 + 2, font);
        } // Offset numbers down by 2 pixels;
    }

    font["textAlign"] = "center";

    IGVGraphics.fillText(ctx, "-log10(pvalue)", pixelWidth / 4, pixelHeight / 2, font, { rotate: { angle: -90 } });
};

NiagadsGWASTrack.prototype.getFeatures = function (chr, bpStart, bpEnd) {
    const pValueField = this.pValueField;

    return this.featureSource.getFeatures(chr, bpStart, bpEnd).then(function (features) {
        features.forEach(function (f) {
            f.value = f[pValueField];
        });
        return features;
    });
};

NiagadsGWASTrack.prototype.draw = function (options) {
    var self = this,
        featureList = options.features,
        ctx = options.context,
        bpPerPixel = options.bpPerPixel,
        bpStart = options.bpStart,
        pixelWidth = options.pixelWidth,
        pixelHeight = options.pixelHeight,
        yScale = (self.dataRange.max - self.dataRange.min) / pixelHeight,
        selection = options.genomicState.selection;

    // Background
    if (this.background)
        IGVGraphics.fillRect(ctx, 0, 0, pixelWidth, pixelHeight, {
            fillStyle: this.background,
        });
    IGVGraphics.strokeLine(ctx, 0, pixelHeight - 1, pixelWidth, pixelHeight - 1, {
        strokeStyle: this.divider,
    });

    if (ctx) {
        var len = featureList.length;

        ctx.save();

        // Draw in two passes, with "selected" eqtls drawn last
        drawNiagadsGwas(false);
        drawNiagadsGwas(true);

        ctx.restore();
    }

    function drawNiagadsGwas(drawSelected) {
        var radius = drawSelected ? 2 * self.dotSize : self.dotSize,
            datum,
            i,
            px,
            py,
            color,
            snp,
            geneName,
            capped;

        for (i = 0; i < len; i++) {
            datum = featureList[i];

            datum.position = datum.record_pk.split(":")[1];

            px = Math.round(datum.position - bpStart + 0.5) / bpPerPixel;
            if (px < 0) continue;
            else if (px > pixelWidth) break;

            snp = datum.variant;

            if (!drawSelected) {
                let mLogP = datum.neg_log10_pvalue;
                if (mLogP >= self.dataRange.min) {
                    if (mLogP > self.dataRange.max) {
                        mLogP = self.dataRange.max;
                        capped = true;
                    } else {
                        capped = false;
                    }

                    py = Math.max(0 + radius, pixelHeight - Math.round((mLogP - self.dataRange.min) / yScale));
                    datum.px = px;
                    datum.py = py;

                   
                    if (drawSelected && selection) {
                        color = selection.colorForGene(geneName);
                        IGVGraphics.setProperties(ctx, {
                            fillStyle: color,
                            strokeStyle: "black",
                        });
                    } else {
                        color =
                            mLogP < 1.3
                                ? "rgb(180, 180, 180)"
                                : capped
                                ? /* blue */ "rgb(16, 151, 230)"
                                : getColor(mLogP, self.dataRange.max);
                        IGVGraphics.setProperties(ctx, {
                            fillStyle: color,
                            strokeStyle: color,
                        });
                    }

                    IGVGraphics.fillCircle(ctx, px, py, radius);
                    IGVGraphics.strokeCircle(ctx, px, py, radius);
                }
            }
        }
    }
};

const getColor = (mLogP, maxVal) => {
    const bucketSize = maxVal / scale.length;

    const mScale = new Array(scale.length).fill(0).map((v, i) => i * bucketSize);

    let index;

    for (let i = 0; i < mScale.length; i++) {
        if (mScale[i] < mLogP) {
            continue;
        } else {
            index = i;
            break;
        }
    }
    return scale[index] || "rgb(180, 180, 180)";
};

const scale = [
    "#a50026",
    "#a70226",
    "#a90426",
    "#ab0626",
    "#ad0826",
    "#af0926",
    "#b10b26",
    "#b30d26",
    "#b50f26",
    "#b61127",
    "#b81327",
    "#ba1527",
    "#bc1727",
    "#be1927",
    "#c01b27",
    "#c21d28",
    "#c41f28",
    "#c52128",
    "#c72328",
    "#c92529",
    "#cb2729",
    "#cc2929",
    "#ce2b2a",
    "#d02d2a",
    "#d12f2b",
    "#d3312b",
    "#d4332c",
    "#d6352c",
    "#d7382d",
    "#d93a2e",
    "#da3c2e",
    "#dc3e2f",
    "#dd4030",
    "#de4331",
    "#e04532",
    "#e14733",
    "#e24a33",
    "#e34c34",
    "#e44e35",
    "#e55136",
    "#e75337",
    "#e85538",
    "#e95839",
    "#ea5a3a",
    "#eb5d3c",
    "#ec5f3d",
    "#ed613e",
    "#ed643f",
    "#ee6640",
    "#ef6941",
    "#f06b42",
    "#f16e43",
    "#f17044",
    "#f27346",
    "#f37547",
    "#f37848",
    "#f47a49",
    "#f57d4a",
    "#f57f4b",
    "#f6824d",
    "#f6844e",
    "#f7864f",
    "#f78950",
    "#f88b51",
    "#f88e53",
    "#f89054",
    "#f99355",
    "#f99556",
    "#f99858",
    "#fa9a59",
    "#fa9c5a",
    "#fa9f5b",
    "#fba15d",
    "#fba35e",
    "#fba660",
    "#fba861",
    "#fcaa62",
    "#fcad64",
    "#fcaf65",
    "#fcb167",
    "#fcb368",
    "#fcb56a",
    "#fdb86b",
    "#fdba6d",
    "#fdbc6e",
    "#fdbe70",
    "#fdc071",
    "#fdc273",
    "#fdc474",
    "#fdc676",
    "#fdc878",
    "#fdca79",
    "#fecc7b",
    "#fecd7d",
    "#fecf7e",
    "#fed180",
    "#fed382",
    "#fed584",
    "#fed685",
    "#fed887",
    "#feda89",
    "#fedb8b",
    "#fedd8d",
    "#fede8f",
    "#fee090",
    "#fee192",
    "#fee394",
    "#fee496",
    "#fee698",
    "#fee79a",
    "#fee89b",
    "#feea9d",
    "#feeb9f",
    "#feeca0",
    "#feeda2",
    "#feeea3",
    "#fdefa5",
    "#fdf0a6",
    "#fdf1a7",
    "#fdf2a9",
    "#fcf3aa",
    "#fcf4ab",
    "#fcf5ab",
    "#fbf5ac",
    "#fbf6ad",
    "#faf6ad",
    "#faf7ad",
    "#f9f7ae",
    "#f8f7ae",
    "#f7f8ad",
    "#f7f8ad",
    "#f6f8ad",
    "#f5f8ac",
    "#f4f8ab",
    "#f3f8ab",
    "#f1f8aa",
    "#f0f7a9",
    "#eff7a8",
    "#eef7a6",
    "#edf6a5",
    "#ebf6a4",
    "#eaf6a2",
    "#e8f5a1",
    "#e7f59f",
    "#e6f49d",
    "#e4f39c",
    "#e2f39a",
    "#e1f298",
    "#dff297",
    "#def195",
    "#dcf093",
    "#daef92",
    "#d9ef90",
    "#d7ee8e",
    "#d5ed8d",
    "#d3ec8b",
    "#d2ec89",
    "#d0eb88",
    "#ceea86",
    "#cce985",
    "#cae983",
    "#c8e882",
    "#c6e780",
    "#c4e67f",
    "#c2e57e",
    "#c0e47c",
    "#bee47b",
    "#bce37a",
    "#bae279",
    "#b8e178",
    "#b6e076",
    "#b4df75",
    "#b2de74",
    "#b0dd73",
    "#aedc72",
    "#acdb71",
    "#a9da70",
    "#a7d970",
    "#a5d86f",
    "#a3d86e",
    "#a0d76d",
    "#9ed66c",
    "#9cd56c",
    "#99d36b",
    "#97d26b",
    "#95d16a",
    "#92d069",
    "#90cf69",
    "#8ece68",
    "#8bcd68",
    "#89cc67",
    "#86cb67",
    "#84ca66",
    "#81c966",
    "#7fc866",
    "#7cc665",
    "#79c565",
    "#77c464",
    "#74c364",
    "#71c263",
    "#6fc063",
    "#6cbf62",
    "#69be62",
    "#67bd62",
    "#64bc61",
    "#61ba60",
    "#5eb960",
    "#5cb85f",
    "#59b65f",
    "#56b55e",
    "#53b45e",
    "#51b25d",
    "#4eb15c",
    "#4baf5c",
    "#48ae5b",
    "#46ad5a",
    "#43ab5a",
    "#40aa59",
    "#3da858",
    "#3ba757",
    "#38a557",
    "#36a456",
    "#33a255",
    "#31a154",
    "#2e9f54",
    "#2c9d53",
    "#2a9c52",
    "#289a51",
    "#259950",
    "#23974f",
    "#21954f",
    "#1f944e",
    "#1e924d",
    "#1c904c",
    "#1a8f4b",
    "#188d4a",
    "#178b49",
    "#158948",
    "#148747",
    "#128646",
    "#118446",
    "#108245",
    "#0e8044",
    "#0d7e43",
    "#0c7d42",
    "#0b7b41",
    "#0a7940",
    "#08773f",
    "#07753e",
    "#06733d",
    "#05713c",
    "#04703b",
    "#036e3a",
    "#026c39",
    "#016a38",
    "#006837",
];
/**
 * Return "popup data" for feature @ genomic location.  Data is an array of key-value pairs
 */
NiagadsGWASTrack.prototype.popupData = function (config) {
    let features = config.viewport.getCachedFeatures();
    if (!features || features.length === 0) return [];

    let genomicLocation = config.genomicLocation,
        xOffset = config.x,
        yOffset = config.y,
        referenceFrame = config.viewport.genomicState.referenceFrame,
        tolerance = 2 * this.dotSize * referenceFrame.bpPerPixel,
        dotSize = this.dotSize,
        track = this.name,
        popupData = [];

    features.forEach(function (feature) {
        if (
            feature.end >= genomicLocation - tolerance &&
            feature.start <= genomicLocation + tolerance &&
            feature.py - yOffset < 2 * dotSize
        ) {
            if (popupData.length > 0) {
                popupData.push("<hr>");
            }

            popupData.push(
                { name: "variant", value: feature.variant },
                { name: "p value", value: feature.pvalue },
                { name: "track", value: track }
            );
        }
    });
    return popupData;
};

NiagadsGWASTrack.prototype.menuItemList = function () {
    var menuItems = [];

    menuItems.push(dataRangeMenuItem(this.trackView));

    return menuItems;
};

NiagadsGWASTrack.prototype.doAutoscale = function (featureList) {
    if (featureList.length > 0) {
        var values = featureList.map(function (datum) {
            return datum.neg_log10_pvalue;
        });

        this.dataRange.max = IGVMath.percentile(values, this.autoscalePercentile);
    } else {
        // No features -- default
        const max = this.config.maxLogP || this.config.max;
        this.dataRange.max = max || 25;
    }

    return this.dataRange;
};

class NiagadsGWASFeatureSource {
    constructor(config, genome) {
        this.config = config || {};
        this.genome = genome;

        this.reader = new NiagadsGwasReader(config);
        this.queryable = true;
        this.expandQuery = config.expandQuery ? true : false;
    }

    async getFeatures(chr, bpStart, bpEnd, _, visibilityWindow) {
        const reader = this.reader;
        const genome = this.genome;
        const queryChr = genome ? genome.getChromosomeName(chr) : chr;
        const featureCache = await getFeatureCache.call(this);
        const isQueryable = this.queryable;

        if ("all" === chr.toLowerCase()) {
            // queryable sources don't support whole genome view
            return [];
        } else {
            return featureCache.queryFeatures(queryChr, bpStart, bpEnd);
        }

        async function getFeatureCache() {
            let intervalStart = bpStart;
            let intervalEnd = bpEnd;
            let genomicInterval = new GenomicInterval(queryChr, intervalStart, intervalEnd);

            if (
                this.featureCache &&
                (this.static || this.featureCache.containsRange(genomicInterval) || "all" === chr.toLowerCase())
            ) {
                return this.featureCache;
            } else {
                // Use visibility window to potentially expand query interval.
                // This can save re-queries as we zoom out.  Visibility window <= 0 is a special case
                // indicating whole chromosome should be read at once.
                if ((!visibilityWindow || visibilityWindow <= 0) && this.expandQuery !== false) {
                    // Whole chromosome
                    intervalStart = 0;
                    intervalEnd = Number.MAX_SAFE_INTEGER;
                } else if (visibilityWindow > bpEnd - bpStart && this.expandQuery !== false) {
                    const expansionWindow = Math.min(4.1 * (bpEnd - bpStart), visibilityWindow);
                    intervalStart = Math.max(0, (bpStart + bpEnd - expansionWindow) / 2);
                    intervalEnd = bpStart + expansionWindow;
                }
                genomicInterval = new GenomicInterval(queryChr, intervalStart, intervalEnd);

                let featureList = await reader.readFeatures(queryChr, genomicInterval.start, genomicInterval.end);
                if (this.queryable === undefined) {
                    this.queryable = reader.indexed;
                }

                if (featureList) {
                    this.ingestFeatures(featureList, genomicInterval);
                } else {
                    this.featureCache = new FeatureCache(); // Empty cache
                }
                return this.featureCache;
            }
        }
    }

    ingestFeatures(featureList, genomicInterval) {
        // Assign overlapping features to rows
        if (this.config.format !== "wig" && this.config.type !== "junctions") {
            const maxRows = this.config.maxRows || 500;
            packFeatures(featureList, maxRows);
        }

        //i think building this tree is what's causing problems
        this.featureCache = new FeatureCache(featureList, this.genome, genomicInterval);
    }
}

function packFeatures(features, maxRows) {
    maxRows = maxRows || 1000;
    if (features == null || features.length === 0) {
        return;
    }

    // Segregate by chromosome
    var chrFeatureMap = {},
        chrs = [];
    features.forEach(function (feature) {
        var chr = feature.chr,
            flist = chrFeatureMap[chr];

        if (!flist) {
            flist = [];
            chrFeatureMap[chr] = flist;
            chrs.push(chr);
        }

        flist.push(feature);
    });

    // Loop through chrosomosomes and pack features;

    chrs.forEach(function (chr) {
        pack(chrFeatureMap[chr], maxRows);
    });
}

export default NiagadsGWASTrack;
//# sourceMappingURL=niagadsTrack.js.map
