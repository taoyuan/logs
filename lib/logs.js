"use strict";

//var _ = require('lodash');
//var inflection = require('inflection');
//var utils = require('./utils');
var path = require('path');
var fs = require('fs');
var Logger = require('./logger');

var existsSync = fs.existsSync || path.existsSync;

var LIBRARY = '__logs_library';

//var LEVELS = ['trace','debug','info','warn','error','fatal'];
//var IS_LEVEL_ENABLED_METHODS = _.reduce(LEVELS, function (result, level) {
//    result[level] = 'is' + inflection.capitalize(level) + 'Enabled';
//    return result;
//}, {});


function Library(name, settings) {
    this.name = name;
//    this.settings = settings;


    // and initialize loggers using bridge
    // this is only one initialization entry point of bridge
    // this module should define `bridge` member of `this` (loggers)
    var bridge;
    if (typeof name === 'object') {
        bridge = name;
        this.name = bridge.name;
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
            return console.log('\nWARNING: Logs bridge "' + name + '" is not installed,\nso your logger would not work, to fix run:\n\n    npm install logs-' + name, '\n');
        }
    }

    bridge.initialize(this, settings);
    return this;
}

Library.prototype.get = function (catagory) {
    return new Logger(this.bridge.getLogger(catagory));
};

Library.prototype.middleware = function(opts) {
    if (this.bridge.middleware) {
        return this.bridge.middleware(opts);
    }
    return function(req, res, next) {
        return next();
    };
};
//
//_.forEach(LEVELS, function (level) {
//    Logger.prototype[level] = function (msg) {
//        if (typeof this.adapter[level] === "function") {
//            return this.adapter[level](message(arguments));
//        } else {
//            return this.adapter.log(level, message(arguments));
//        }
//    };
//
//});
//
//_.forEach(IS_LEVEL_ENABLED_METHODS, function (method, level) {
//    Logger.prototype[method] = function () {
//        if (typeof this.adapter[method] === "function") {
//            return this.adapter[method]();
//        } else {
//            return this.adapter.isLevelEnabled(level);
//        }
//    };
//});

//function message(args) {
//    return utils.format.apply(undef, args);
//}

//function getCallerFile() {
//    var frame = require('stack-trace').get()[2];
//    var file = frame.getFileName();
//    var line = frame.getLineNumber();
//    var method = frame.getFunctionName();
//
//    var result = frame.getTypeName() + ' ' + file + ': ' + line;
//    if (method) result += ' in ' + method + '()';
//    return result;
//}

exports.use = use;
function use(name, settings, showUsingLogs) {
    var library = global[LIBRARY] = new Library(name, settings);
    if (showUsingLogs) {
        console.log('logs is using logging library "' + library.name + '"');
    }
    return exports;
}

exports.get = get;
function get(category) {
    if (!(LIBRARY in global)) use('console');
    return global[LIBRARY].get(category);
}

exports.__defineGetter__('version', function() {
    return require('../package').version;
});