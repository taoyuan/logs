"use strict";

var toUpperCase = String.prototype.toUpperCase;

exports.initialize = function (library, settings) {
    
    library.bridge = {
        getLogger: function (category) {
            return new ConsoleLogger(category);
        }
    };
};

function ConsoleLogger(category) {
    this.category = category;
}

ConsoleLogger.prototype.log = function (level, msg) {
    console.error('[%s] %s -', toUpperCase.call(level), this.category, msg);
};

ConsoleLogger.prototype.isLevelEnabled = function (level) {
    return true;
};