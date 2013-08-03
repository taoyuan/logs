"use strict";

var _ = require('lodash'),
    util = require('util'),
    debug = require('debug2')('logs'),
    stackTrace = require('stack-trace'),
    path = require('path'),
    fs = require('fs');

var existsSync = fs.existsSync || path.existsSync,

    logs = {},

    timers = {},
    config = {
        // TODO: Add a more thorough list of common methods
        methods: ['debug', 'info', 'notice', 'warning', 'error', 'crit', 'alert',
            'emerg', 'trace', 'log', 'warn', 'line', 'time', 'timeEnd',
            'profile', 'assert', 'log', 'fatal', 'dir', 'start', 'stop',
            'isLevelEnabled']
    },

    loggerMethods = {
        start: function start(label) {
            timers[label] = Date.now();
        },

        stop: function stop(label) {
            return Date.now() - timers[label];
        }
    },

    library = null;


// Interfaces
// ------------------------------------------------------------------------------


/**
 * Logger wrapper delegates to underlying logger
 *
 * @constructor
 * @param logger
 * @param methods
 * @param library
 */
function Logger(library, logger, methods) {
    if (!methods) methods = config.methods;

    var me = this;
    me._logger = logger;
    me.enabled = true;

    _.forEach(methods, function (method) {
        var m;
        if (loggerMethods[method]) {
            m = loggerMethods[method];
        } else if (me._logger[method]) {
            m = me._logger[method];
        } else {
            m = me._logger[library.defaultLevel()];
        }
        me[method] = function () {
            if (!me.enabled) return;
            return m.apply(me._logger, arguments);
        }
    });
}

// Disable logger for a single level or all levels if no argument
// TODO: Level functionality
Logger.prototype.supress = function(level) {
    this.enabled = false;
};

Logger.prototype.allow = function(level) {
    this.enabled = false;
};


/**
 * Logging library interface
 *
 * @constructor
 */
function Library(bridge) {
    this._methods = config.methods;
    for(var m in bridge) {
        this[m] = bridge[m];
    }
}

Library.prototype.getLogger = function(category) {};

Library.prototype.get = function(category) {
    return new Logger(this, this.getLogger(category), this._methods);
};

Library.prototype.getOpts = function() {
};

Library.prototype.getProvider = function() {};

Library.prototype.middleware = function(opts) {
    return function(req, res, next) {
        return next();
    };
};

Library.prototype.defaultLevel = function() {
    return 'info';
};

function getCallerFile(intCall) {
    var file, trace, line, method;

    trace = stackTrace.get()[intCall ? 3 : 2];
    file = trace.getFileName();
    line = trace.getLineNumber();
    method = trace.getFunctionName();
    return trace.getTypeName() + " (" + file + ":" + line + ") in " + method + "()";
}

logs.Library = Library;

// Public API
// ------------------------------------------------------------------------------

/**
 *
 * @param {string} name - type of log bridge (console, debug, log4js, winston ...)
 * @param opts - methods: Custom level. If you change to a logging library that does not
 * support these levels, a default level will be used.
 */
logs.getLibrary = function(name, opts, intCall) {
    if (!name) {
        return library;
    }

    var bridge;
    if (typeof name === 'object') {
        bridge = name;
    } else if (name.match(/^\//)) {
        // try absolute path
        bridge = require(name);
    } else if (existsSync(__dirname + '/bridges/' + name + '.js')) {
        // try built-in bridge
        bridge = require('./bridges/' + name);
    } else {
        // try foreign bridge
        try {
            bridge = require('logs-' + name);
        } catch (e) {
            return console.log('\nWARNING: Logs bridge "' + name + '" is not installed,\nso your models would not work, to fix run:\n\n    npm install logs-' + name, '\n');
        }
    }

    if (!opts) opts = {};
    if (typeof bridge === 'function') {
        bridge = bridge(opts.lib);
    }

    var _library,
        _methods,
        _opts;

    _library = new Library(bridge);
    debug("Creating logging library (" + name + ") from " + (getCallerFile(intCall)));

    _methods = config.methods;
    _opts = _library.getOpts();

    // Allow custom methods for logger specified by library.
    // E.g. log4js uses`logger.setLevel`
    if (_opts) {
        _methods = _.union(_methods, _opts.methods);
    }
    if (opts.methods) {
        _methods = _.union(_methods, opts.methods);
    }
    _library._methods = _methods;

    return _library;
};

logs.use = function(name, opts) {
    library = exports.getLibrary(name, opts, true);
    debug("Using logging library " + library.name);
    return this;
};


logs.get = exports.getLogger = function(category) {
    if (!library) {
        exports.use(exports.default);
    }
    return library.get(category);
};

logs.__defineGetter__('version', function() {
    return require('../package').version;
});

// exports bridges
logs.default = 'debug2';

module.exports = exports = logs;