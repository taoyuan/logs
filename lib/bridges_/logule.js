"use strict";

module.exports = exports = function Logule() {

    var logule = require('logule');

    return {
        getLogger: function(category) {
            if (category) {
                return logule.init(module).sub(category);
            }
            return logule.init(module);
        },

        getProvider: function() {
            return logule;
        },

        middleware: function(opts) {
            opts = opts || {};
            var category = opts.category || 'Middleware',
                level = opts.level || logule.levels.INFO,
                log = logule.init(module, '<-').get(level, category);
            return function(req, res, next) {
                log(req.method, req.url.toString());
                return next();
            };
        }
    }

};