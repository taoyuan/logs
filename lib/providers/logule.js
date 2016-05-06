"use strict";

exports.initialize = function (library, settings) {

  var logule = require('logule');

  library.provider = {

    getLogger: function (category) {
      if (category) {
        return logule.init(module).sub(category);
      }
      return logule.init(module);
    },

    middleware: function (opts) {
      opts = opts || {};
      var category = opts.category || 'middleware',
        level = opts.level || logule.levels.INFO,
        log = logule.init(module, '<-').get(level, category);
      return function (req, res, next) {
        log(req.method, req.url.toString());
        return next();
      };
    }
  }
};
