var _ = require('lodash');
var inflection = require('inflection');
var utils = require('./utils');

var LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
var IS_LEVEL_ENABLED_METHODS = _.reduce(LEVELS, function (result, level) {
  result[level] = 'is' + inflection.capitalize(level) + 'Enabled';
  return result;
}, {});
var slice = Array.prototype.slice;

module.exports = Logger;

function Logger(adapter) {
  this.adapter = adapter;
}

Logger.prototype.trace = function () {
  return this.log('trace', arguments);
};

Logger.prototype.debug = function () {
  return this.log('debug', arguments);
};

Logger.prototype.info = function () {
  return this.log('info', arguments);
};

Logger.prototype.warn = function () {
  return this.log('warn', arguments);
};

Logger.prototype.error = function () {
  return this.log('error', arguments);
};

Logger.prototype.fatal = function () {
  this.log('fatal', arguments);
  process.exit(1);
};

Logger.prototype.isTraceEnabled = function () {
  return this.isLevelEnabled('trace');
};

Logger.prototype.isDebugEnabled = function () {
  return this.isLevelEnabled('debug');
};

Logger.prototype.isInfoEnabled = function () {
  return this.isLevelEnabled('info');
};

Logger.prototype.isWarnEnabled = function () {
  return this.isLevelEnabled('warn');
};

Logger.prototype.isErrorEnabled = function () {
  return this.isLevelEnabled('error');
};

Logger.prototype.isFatalEnabled = function () {
  return this.isLevelEnabled('fatal');
};

Logger.prototype.log = function (level, args) {
  args = format(slice.call(args || []));

  var l = this.adapter;
  if (typeof l[level] === "function") {
    return l[level].apply(l, args);
  } else {
    args.unshift(level);
    return l.log.apply(l, args);
  }
};

Logger.prototype.isLevelEnabled = function (level) {
  var l = this.adapter;
  var method = IS_LEVEL_ENABLED_METHODS[level];
  if (typeof l[method] === "function") {
    return l[method]();
  } else if (l.isLevelEnabled) {
    return l.isLevelEnabled(level);
  } else if (l.levels && l.level) {
    return l.levels[l.level] >= l.levels[level];
  } else {
    console.warn('`isLevelEnabled` is not supported. Return true as default');
    return true;
  }
};

const formatRegExp = /%[sdj%]/g;
function format(args) {
  var i;
  var f = args[0];
  if (typeof f !== 'string') {
    var objects = [];
    for (i = 0; i < args.length; i++) {
      objects.push(inspect(args[i]));
    }
    return [objects.join(' ')];
  }

  if (args.length === 1) return args;

  i = 1;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      // falls through
      default:
        return x;
    }
  });

  return [str].concat(args.slice(i));
}
