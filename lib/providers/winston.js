"use strict";

var _ = require('lodash');
var formatter = require('../formatter');

var levels = {
  error: 0,
  warn: 1,
  help: 2,
  data: 3,
  info: 4,
  debug: 5,
  trace: 6
};


exports.initialize = function (library, settings) {
  settings = settings || {};
  var factory = settings && settings.factory;
  if (!factory) {
    factory = require('winston');
  }

  var level = settings.level;
  factory.level = level;

  var transports = _.merge({
    console: formatter({
      colorize: true,
      stderrLevels: ['error']
    })
  }, settings.transports);

  _.forEach(transports, function (transport) {
    if (transport && typeof transport === 'object') {
      transport.level = level;
    }
  });

  library.provider = {
    setLevel: function (level) {
      function doSetLevel(logger, level) {
        logger.level = level;
        if (logger.loggers && logger.loggers.loggers) {
          _.forEach(logger.loggers.loggers, function (l) {
            doSetLevel(l, level);
          });
        }
      }

      doSetLevel(factory, level);
    },

    getLogger: function (category, options) {
      options = options || {};
      if (category) {
        if (factory.loggers.has(category)) {
          return factory.loggers.get(category);
        }

        var l = factory.loggers.add(category, _.merge({
          console: { label: category }
        }, transports));
        l.setLevels(levels);
        l.level = options.level || factory.level || level;
        return l;
      } else {
        return factory;
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

      return function (req, res, next) {
        next();
      }
    }
  }
};
