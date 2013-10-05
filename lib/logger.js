var _ = require('lodash');
var inflection = require('inflection');
var utils = require('./utils');

var undef;
var LEVELS = ['trace','debug','info','warn','error','fatal'];
var IS_LEVEL_ENABLED_METHODS = _.reduce(LEVELS, function (result, level) {
    result[level] = 'is' + inflection.capitalize(level) + 'Enabled';
    return result;
}, {});

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
    return this.log('fatal', arguments);
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
    var msg = message(args);
    if (typeof this.adapter[level] === "function") {
        return this.adapter[level](msg);
    } else {
        return this.adapter.log(level, msg);
    }
};

Logger.prototype.isLevelEnabled = function (level) {
    var method = IS_LEVEL_ENABLED_METHODS[level];
    if (typeof this.adapter[method] === "function") {
        return this.adapter[method]();
    } else {
        return this.adapter.isLevelEnabled(level);
    }
};

function message(args) {
    return utils.format.apply(undef, args);
}

