"use strict";

/**
 *
 * @param library
 * @param settings
 * - appender: console|colorConsole|dailyfile
 * - options:
 */
exports.initialize = function (library, settings) {

    var tracer = require('tracer');

    settings = settings || {
        appender: 'colorConsole',
        options: {}
    };

    library.bridge = {
        getLogger: function () {
            return tracer[settings.appender](settings.options);
        }
    }
};