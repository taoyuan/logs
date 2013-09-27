"use strict";

exports.initialize = function (library, settings) {
    var factory = settings && settings.factory;
    if (!factory) {
        factory = require('log4js');
        if (settings) factory.configure(settings);
    }

    library.bridge = new Log4js(factory);
};

function Log4js(factory) {
    this.factory = factory;
}

Log4js.prototype.getLogger = function(category) {
    if (category) {
        return new this.factory.getLogger(category);
    }
    return new this.factory.getDefaultLogger();
};

Log4js.prototype.middleware = function(opts) {
    opts = opts || {};
    var category = opts.category || 'middleware',
        level = opts.level || this.factory.levels.INFO;
    return this.factory.connectLogger(this.factory.getLogger(category), {
        level: level
    });
};