"use strict";

module.exports = exports = function Winston() {
    var winston = require('winston');

    return {
        getLogger: function (category) {
            if (category) {
                return winston.loggers.add(category, {
                    console: {
                        level: 'silly',
                        colorize: true
                    }
                });
            } else {
                return winston;
            }
        },

        middleware: function (opts) {
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
        }
    }
};