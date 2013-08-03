"use strict";

module.exports = exports = function Log4js(lib) {

    var log4js = lib || require('log4js');

    return {

        getLogger: function(category) {
            if (category) {
                return log4js.getLogger(category);
            }
            return log4js.getDefaultLogger();
        },

        getOps: function() {
            return {
                methods: 'setLevel'
            };
        },

        getProvider: function() {
            return log4js;
        },

        middleware: function(opts) {
            opts = opts || {};
            var category = opts.category || 'Middleware',
                level = opts.level || log4js.levels.INFO;
            return log4js.connectLogger(log4js.getLogger(category), {
                level: level
            });
        },

        defaultLevel: function() {
            return 'info';
        }
    }

};




