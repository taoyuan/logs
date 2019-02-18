"use strict";

export function initialize(library, settings) {

  const logule = require('logule');

  library.provider = {

    getLogger: function (category) {
      if (category) {
        return logule.init(module).sub(category);
      }
      return logule.init(module);
    },

    middleware: function (opts) {
      opts = opts || {};
      const category = opts.category || 'middleware',
        level = opts.level || logule.levels.INFO,
        log = logule.init(module, '<-').get(level, category);
      return function (req, res, next) {
        log(req.method, req.url.toString());
        return next();
      };
    }
  }
}
