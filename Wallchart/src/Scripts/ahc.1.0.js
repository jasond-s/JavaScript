//
//
// polyfills
//
//
(function() {
    'use strict';;
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0,
                from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0) from += len;
            for (; from < len; from++) {
                if (from in this && this[from] === elt) return from;
            }
            return -1;
        };
    }
}());
(function() {
    'use strict';;
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, thisArg) {
            var T, A, k;
            if (this == null) throw new TypeError(" this is null or not defined");
            var O = Object(this),
                len = O.length >>> 0;
            if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
            if (arguments.length > 1) T = thisArg;
            A = new Array(len);
            k = 0;
            while (k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[k];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }
}());
(function() {
    'use strict';;
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function(callback) {
            if (null === this || 'undefined' === typeof this) throw new TypeError('Array.prototype.reduce called on null or undefined');
            if ('function' !== typeof callback) throw new TypeError(callback + ' is not a function');
            var t = Object(this),
                len = t.length >>> 0,
                k = 0,
                value;
            if (arguments.length >= 2) {
                value = arguments[1];
            } else {
                while (k < len && !k in t) k++;
                if (k >= len) throw new TypeError('Reduce of empty array with no initial value');
                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) value = callback(value, t[k], k, t);
            }
            return value;
        };
    }
}());
(function() {
    'use strict';;
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) throw new TypeError('Array.prototype.find called on null or undefined');
            if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');
            var list = Object(this),
                length = list.length >>> 0,
                thisArg = arguments[1],
                value;
            for (var i = 0; i < length; i++) {
                if (i in list) {
                    value = list[i];
                    if (predicate.call(thisArg, value, i, list)) return value;
                }
            }
            return undefined;
        }
    }
}());




//
//
// ahc namespace declaration
//
//

ahc = {};

//
//
// date
//
//
Date.prototype.addMilliseconds = function(milliseconds) {
    this.setMilliseconds(this.getMilliseconds() + milliseconds);
    return this;
};
Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};
Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};
Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
};

ahc.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
Date.prototype.getDay = (function() {
    var _orig = Date.prototype.getDay;
    return (function(day) {
        var _i = 0;
        if (day) {
            _i = ahc.days.indexOf(day.toLowerCase());
            if (_i < 0) _i = 0;
        }
        // Add the offset to the amaerican days for monday as week day 0.
        // Then minus the offset from the day passed in.
        return (_orig.call(this) + 6 - _i) % 7;
    });
}());



//
//
/** @module ahc */
//
//


//
//
// namespace methods
//
//



/**
 * Mixin source to destination.
 * @param {Object} [destination] The host object to be mixed.
 * @param {Object} [source] The awesome sauce to be mixed in.
 */
var mixin = function(destination, source) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            destination[prop] = source[prop];
        }
    }

    return destination;
};
ahc.mixin = mixin;


/**
 * Extend by way of super classing the derived object.
 * @param {object.constructor} [derived] The object to have super class added.
 * @param {object.constructor} [base] The base class or super class object.
 */
var extend = function(derived, base) {
    for (var prop in base) {
        if (base.hasOwnProperty(prop)) {
            derived[prop] = base[prop];
        }
    }

    function newConstructor() {
        this.constructor = derived;
    }
    newConstructor.prototype = base.prototype;
    derived.prototype = new newConstructor();
};
ahc.extend = extend;



/**
 * Add
 * Adds the item to the array if it is not already present.
 * @param {Array} [array] The array you want to add the item to.
 * @param {Object} [item] The item you wish to add.
 */
var add = function(array, item) {
    if (array.getArray) {
        array = array.getArray();
    }

    var index = array.indexOf(item);

    if (index > -1) {
        return;
    }

    array.push(item);
}
ahc.add = add;



/**
 * Remove
 * Removes the specified item from the input array of it exists.
 * @param {Array} [array] The array you want to remove the item from.
 * @param {Object} [item] The item you wish to remove.
 */
var remove = function(array, item) {
    if (array.getArray) {
        array = array.getArray();
    }

    var index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }
}
ahc.remove = remove;



/**
 * Array Arguments
 * Easily handle arguments to a method that can be single multiple or arrays.
 * @param {Arguments/Object} [argv] The arguments to handle, cannot process arrays as atom.
 * @param {Object} [context] The delegate context.
 * @param {Function} [delegate] The delegate for each item.
 * @return {undefined} Nothing.
 */
var arrayArgument = function(argv, context, delegate) {
    if (argv === undefined) return;
    var args = Array.prototype.slice.call(argv);
    if (args.length >= 1) {
        for (var i = args.length - 1; i >= 0; i--) {
            var arg = args[i];
            if (arg instanceof Array) {
                if (arg.length >= 1) {
                    for (var j = arg.length - 1; j >= 0; j--) {
                        delegate.call(context, arg[j])
                    }
                }
            } else {
                delegate.call(context, arg);
            }
        };
    }
}
ahc.arrayArgument = arrayArgument;



/**
 * Pad String Right
 * @param {Number} [width] Width of desired string.
 * @param {String} [str] String to be padded.
 * @param {String} [padding] Padding character.
 * @return {String} The padded string.
 */
function padRight(width, str, padding) {
    return (width <= str.length) ? str : padRight(width, str + padding, padding);
}
ahc.padRight = padRight;



/**
 * Pad String Left
 * @param {Number} [width] Width of desired string.
 * @param {String} [str] String to be padded.
 * @param {String} [padding] Padding character.
 * @return {String} The padded string.
 */
function padLeft(width, str, padding) {
    return (width <= str.length) ? str : padLeft(width, padding + str, padding);
}
ahc.padLeft = padLeft;



/**
 * Parse A Time String To Decimal Time
 * @param {Date} [time] The datetime value.
 * @return {Number} The decimal time.
 */
function parseTimeToDecimal(time) {
    var hours = parseInt(time.getHours());
    var minutes = parseInt(time.getMinutes());

    return hours + (minutes / 60)
}
ahc.parseTimeToDecimal = parseTimeToDecimal;



/**
 * Parse A Time String To Decimal Time
 * @param {Date} [time] The datetime value.
 * @return {String} String value for time (hh:mm or dd/MM).
 */
function parseTimeToString(time) {
    var hours = time.getHours(),
        minutes = time.getMinutes();

    if (hours === 0 && minutes === 0) {
        var day = time.getDate(),
            month = time.getMonth();
        return ahc.padLeft(2, day.toString(), '0') + '/' + ahc.padLeft(2, month.toString(), '0');
    }

    return ahc.padLeft(2, hours.toString(), '0') + ':' + ahc.padLeft(2, minutes.toString(), '0');
}
ahc.parseTimeToString = parseTimeToString;



/**
 * Hand.
 * @constructor
 * @param {Object} [context] The context for this in handler func.
 * @param {Function} [func] The handler function.
 */
var Hand = (function() {
    'use strict';

    function Hand(context, func) {
        if (!(this instanceof Hand)) {
            return new Hand(context, func);
        }

        this.context = context;
        this.func = func;
    }

    /**
     * Execute the handler
     */
    Hand.prototype.ex = function() {
        this.func.call(this.context);
    }

    return Hand;
}());
ahc.Hand = Hand;



/**
 * Observable.
 * @constructor
 */
var Observable = (function() {
    'use strict';

    function Observable() {
        if (!(this instanceof Observable)) {
            return new Observable();
        }

        this.handlerArray = [];
    }

    /**
     * Add Handler
     * @param {ahc.Hand} [hand] An ahc.Hand single, multiple or array.
     */
    Observable.prototype.addHandler = function() {
        ahc.arrayArgument(arguments, this, function(func) {
            if (func instanceof ahc.Hand) {
                ahc.add(this.handlerArray, func);
            }
        });
    }

    /**
     * Remove Handler
     * @param {ahc.Hand} [hand] An ahc.Hand single, multiple or array.
     */
    Observable.prototype.removeHandler = function() {
        ahc.arrayArgument(arguments, this, function(func) {
            ahc.remove(this.handlerArray, func);
        });
    }

    /**
     * Call All Handlers
     */
    Observable.prototype.callHandler = function() {
        for (var i = 0; i < this.handlerArray.length; i++) {
            this.handlerArray[i].ex();
        };
    };

    return Observable;
}());
ahc.Observable = Observable;



/**
 * Observable Value.
 * @constructor
 * @extends Observable
 * @param {Object} [value] The initial value for the observable.
 * @property {Object} [value] The value of the observable.
 */
var ObservableVal = (function(_base) {
    'use strict';
    ahc.extend(ObservableVal, _base);

    function ObservableVal(value) {
        if (!(this instanceof Observable)) {
            return new Observable(value);
        }
        _base.call(this);

        this.internalVal = value;
    }

    /**
     * Value
     * @param {Object} [val] Is a property setter.
     * @return {Object} [val] Is a property getter.
     */
    Object.defineProperty(ObservableVal.prototype, 'value', {
        get: function() {
            return this.internalVal;
        },
        set: function(val) {
            this.internalVal = val;
            this.callHandler();
        }
    })

    return ObservableVal;
}(ahc.Observable));
ahc.ObservableVal = ObservableVal;



/**
 * Observable Array.
 * @constructor
 * @extends Observable
 * @param {undefined} Accepts no arguments.
 * @property {Object} [length] The length of the observable array.
 */
var ObservableArray = (function(_base) {
    'use strict';
    ahc.extend(ObservableArray, _base)

    function ObservableArray() {
        if (!(this instanceof ObservableArray)) {
            return new ObservableArray();
        }
        _base.call(this);

        this.internalArray = [];
    }

    /**
     * Get Item At Index.
     * @param {Number} [index] Takes the index of the desired item.
     * @return {Object} The item at index.
     */
    ObservableArray.prototype.atIndex = function(index) {
        return internalArray[index];
    };

    /**
     * Get The Array Length.
     * @return {Number} Returns the length of the internal array.
     */
    Object.defineProperty(ObservableArray.prototype, 'length', {
        get: function() {
            return this.internalArray.length;
        }
    })

    /**
     * Clears All Items From Internal Array.
     */
    ObservableArray.prototype.clear = function() {
        this.internalArray = [];
        this.callHandler();
    };

    /**
     * Add An Item To The Array.
     * @param {Object} [obj] Item to add to array.
     */
    ObservableArray.prototype.add = function(obj) {
        ahc.arrayArgument(arguments, this, function(obj) {
            ahc.add(this.internalArray, obj);
        })
        this.callHandler();
    };

    /**
     * Removes An Item From The Array If Possible.
     * @param {Object} [obj] Item to remove from array.
     */
    ObservableArray.prototype.remove = function(obj) {
        ahc.arrayArgument(arguments, this, function(obj) {
            ahc.remove(this.internalArray, obj);
        })
        this.callHandler();
    };

    /**
     * Push Item Onto Array.
     * @param {Object} [obj] Push item onto array (ignores duplicates).
     */
    ObservableArray.prototype.push = function(obj) {
        this.internalArray.push(obj);
        this.callHandler();
    };

    /**
     * Pop Item From End Of Array.
     */
    ObservableArray.prototype.pop = function() {
        this.callHandler();
        return this.internalArray.pop();
    };

    /**
     * Get Ref To The Internal Array.
     */
    ObservableArray.prototype.getArray = function() {
        return this.internalArray;
    }

    return ObservableArray;
}(ahc.Observable));
ahc.ObservableArray = ObservableArray;



//
//
// ahc exception namespace declaration
//
//

/** @module ahc/exceptions */

ahc.ex = {};

/**
 * AhcException
 * @constructor
 * @param {String} [name] Name of exception type.
 */

var AhcException = (function() {
    'use strict';
    //ahc.extend(AhcException);

    function AhcException(name) {
        if (!(this instanceof AhcException)) {
            return new AhcException(name);
        }
        var tmp = Error.apply(this, arguments);
        this.stack = tmp.stack
        this.message = tmp.message

        this.name = 'ahc.' + name;
    }

    return AhcException;
}());
ahc.ex.AhcException = AhcException;

/**
 * ArgumentException
 * @constructor
 * @param {String} [argument] Name of failing argument.
 */
var ArgumentException = (function(_base) {
    'use strict';
    ahc.extend(ArgumentException, _base);

    function ArgumentException(argument) {
        if (!(this instanceof ArgumentException)) {
            return new ArgumentException(argument);
        }
        _base.call(this, 'ArgumentException');

        this.argument = argument;
    }

    return ArgumentException;
}(AhcException));
ahc.ex.ArgumentException = ArgumentException;

/**
 * ApplicationException
 * @constructor
 * @param {String} [message] Name of failing argument.
 */
var ApplicationException = (function(_base) {
    'use strict';
    ahc.extend(ApplicationException, _base);

    function ApplicationException(message) {
        if (!(this instanceof ApplicationException)) {
            return new ApplicationException(message);
        }
        _base.call(this, 'ApplicationException');

        this.message = message;
    }

    return ApplicationException;
}(AhcException));
ahc.ex.ApplicationException = ApplicationException;