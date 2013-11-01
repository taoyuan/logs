"use strict";

exports.initialize = function (library, settings) {
    settings = settings || {};
    var factory = settings.factory;
    if (!factory) {
        factory = require('log4js');
        if (settings.level) {
            factory.setGlobalLogLevel(settings.level);
        }
        factory.configure(settings);
    }

    library.factory = factory;

    library.bridge = {

        getLogger: function (category) {
            if (category) {
                return new factory.getLogger(category);
            }
            return new factory.getDefaultLogger();
        },

        middleware: function (opts) {
            opts = opts || {};
            var category = opts.category || 'middleware',
                level = opts.level || factory.levels.INFO;
            return factory.connectLogger(factory.getLogger(category), {
                level: level
            });
        }
    }
};