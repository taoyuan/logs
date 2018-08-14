"use strict";

var _ = require('lodash');

var defaultConfig = {
  appenders: {console: {type: "console"}},
  categories: { default: { appenders: ['console'], level: 'warn' } }
};

exports.initialize = function (library, settings) {
  var factory = settings && settings.factory;
  if (!factory) {
    settings = Object.assign({}, defaultConfig, settings);
    factory = require('log4js');
    if (settings.level) {
      factory.setGlobalLogLevel(settings.level);
    }
    factory.configure(settings);
  }

  library.factory = factory;

  library.provider = {

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
