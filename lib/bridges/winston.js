"use strict";

exports.initialize = function (library, settings) {
    var factory = settings && settings.factory;
    if (!factory) {
        factory = require('winston');
    }

    library.bridge = new Winston(factory);
};

function Winston(factory) {
    this.factory = factory;
}

Winston.prototype.getLogger = function(category) {
    if (category) {
        return this.factory.loggers.add(category, {
            console: {
                level: 'silly',
                colorize: true
            }
        });
    } else {
        return this.factory;
    }
};

Winston.prototype.middleware = function(opts) {
    var expressWinston = require('express-winston');
    opts = opts || {};
    opts.winston = opts.winston || {};
    if (opts.winston.type === 'error') {
        return expressWinston.errorLogger({
            transports: [
                new this.winston.transports.Console({
                    json: true,
                    colorize: true
                })
            ]
        });
    }
    if (opts.winston.type === 'request') {
        return expressWinston.logger({
            transports: [
                new this.winston.transports.Console({
                    json: true,
                    colorize: true
                })
            ]
        });
    }

    return function(req, res, next) {
        next();
    }
};