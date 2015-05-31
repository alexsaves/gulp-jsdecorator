/**
 * JS Decorator
 * Created by alexei on 2/5/2014.
 */

var os = require('os');
var path = require('path');
var gutil = require('gulp-util');

/**
 * Decorator Class
 * @constructor
 */
var JSDecorator = function () {

};

/**
 * Set up the interface
 * @type {{}}
 */
JSDecorator.prototype = {

  decorate: function (contents, config) {

    var finalstr = [],
      fnfl = contents,
      count = 0;

    if (config) {

      // Should we wrap the result in a closure?
      if (config.useclosure) {
        finalstr = [];
        finalstr.push("\n(function(");
        count = 0;
        for (var vl in config.closureargs) {
          if (count > 0) {
            finalstr.push(",");
          }
          finalstr.push(vl);
          count++;
        }
        finalstr.push(") {\n");
        finalstr.push(fnfl);
        finalstr.push("\n })(");
        count = 0;
        for (var vl in config.closureargs) {
          if (count > 0) {
            finalstr.push(",");
          }
          finalstr.push(config.closureargs[vl]);
          count++;
        }
        finalstr.push(");");
        fnfl = finalstr.join('');
      }

      //  Is there a namespace check?
      if (config.namespacecheck && config.namespacecheck.length > 0) {
        finalstr = [];
        finalstr.push("if (");
        for (i = 0; i < config.namespacecheck.length; i++) {
          if (i > 0) {
            finalstr.push("&&");
          }
          finalstr.push("typeof(" + config.namespacecheck[i] + ") == 'undefined'");
        }
        finalstr.push(") {\n");
        finalstr.push(fnfl);
        finalstr.push("\n}\n");
        fnfl = finalstr.join('');
      }

      // Should we add the do not modify message?
      if (config.donotmodifymessage) {

        fnfl = "// ----------------------- DO NOT MODIFY ANYTHING BETWEEN THE DASHED LINES -----------------------\n" + fnfl + "\n// ----------------------- DO NOT MODIFY ANYTHING BETWEEN THE DASHED LINES -----------------------";

      }

      // Add text to the top
      if (config.top) {
        finalstr = [];
        finalstr.push(config.top);
        finalstr.push(fnfl);
        fnfl = finalstr.join('\n');
      }

      // Add text to the bottom
      if (config.bottom) {
        finalstr = [];
        finalstr.push(fnfl);
        finalstr.push(config.bottom);
        fnfl = finalstr.join('\n');
      }

    }

    return fnfl;
  }

};

/**
 * Export it
 */
module.exports = JSDecorator;