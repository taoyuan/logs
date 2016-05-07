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
  args = slice.call(args || []);
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
