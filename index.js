var through = require('through'),
  path = require('path'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError,
  File = gutil.File,
  colors = require('colors'),
  strftime = require('strftime'),
  decorator = require('./decorator.js');

/**
 * Extend an object
 * @returns {*|{}}
 */
var extend = function () {
  var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false,
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,
    class2type = {
      "[object Boolean]": "boolean",
      "[object Number]": "number",
      "[object String]": "string",
      "[object Function]": "function",
      "[object Array]": "array",
      "[object Date]": "date",
      "[object RegExp]": "regexp",
      "[object Object]": "object"
    },
    jQuery = {
      isFunction: function (obj) {
        return jQuery.type(obj) === "function"
      },
      isArray: Array.isArray ||
      function (obj) {
        return jQuery.type(obj) === "array"
      },
      isWindow: function (obj) {
        return obj != null && obj == obj.window
      },
      isNumeric: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj)
      },
      type: function (obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
      },
      isPlainObject: function (obj) {
        if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
          return false
        }
        try {
          if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false
          }
        } catch (e) {
          return false
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || hasOwn.call(obj, key)
      }
    };
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if (typeof target !== "object" && !jQuery.isFunction(target)) {
    target = {}
  }
  if (length === i) {
    target = this;
    --i;
  }
  for (i; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue
        }
        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : []
          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }
          // WARNING: RECURSION
          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
};

/**
 * Decorate JavaScript with stuff around it
 */
function jsDecorator(configoverride) {
  // Get the configuration
  var config = this.extend({
      useclosure: false,
      closureargs: {}
    }, configoverride || this.config),
    hasFirstFile = false,
    firstFl = null,
    dec = new decorator();

  return through(function (file) {
    if (file.isNull())
      return; // ignore
    if (file.isStream())
      return this.emit('error', new PluginError('gulp-jsdecorator', 'Streaming not supported'));

    if (!hasFirstFile) {
      hasFirstFile = true;
      firstFl = file;
    }
  }, function () {
    var finalContents = dec.decorate(firstFl.contents.toString('utf8'), config);

    firstFl.contents = new Buffer(finalContents);

    this.emit('data', firstFl);
    this.emit('end');
  });
}