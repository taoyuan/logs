"use strict";

exports.initialize = function (library) {
    var debug = require('debug');

    library.bridge = {
        getLogger: function (category) {
            return new DebugLogger(debug(category));
        }
    }
};

function DebugLogger(debug) {
    this.debug = debug;
}

DebugLogger.prototype.log = function (level, msg) {
    this.debug(msg);
};

DebugLogger.prototype.isLevelEnabled = function (level) {
    return true;
};