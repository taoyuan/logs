"use strict";

var _ = require('lodash');
// var formatter = require('../formatter');
var dateformat = require('dateformat');

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
  const factory = (settings && settings.factory) || require('winston');

  const level = settings.level;
  factory.level = level;


  const format = factory.format;
  let transports = [
    new factory.transports.Console({
      colorize: true,
      stderrLevels: ['error'],
      format: format.combine(
        format.colorize({colors: {trace: 'magenta'}}),
        format.timestamp(),
        format.printf(info => {
          return `${dateformat(info.timestamp, 'yyyy-mm-dd HH:MM:ss.')} [${info.level}] ${info.message}`;
        })
      ),

    })
  ];

  if (settings.transports) {
    transports = transports.concat(settings.transports);
  }

  _.forEach(transports, function (transport) {
    if (transport && typeof transport === 'object') {
      transport.level = level;
    }
  });

  library.provider = {
    setLevel: function (level) {
      _setLevel(factory, level);

      function _setLevel(logger, level) {
        logger.level = level;
        if (logger.loggers && logger.loggers.loggers) {
          _.forEach(logger.loggers.loggers, function (l) {
            _setLevel(l, level);
          });
        }
      }
    },

    getLogger: function (category, options) {
      options = options || {};
      if (category) {
        if (factory.loggers.has(category)) {
          return factory.loggers.get(category);
        }

        const l = factory.loggers.add(category, {
          console: { label: category },
          levels,
          transports,
        });
        // l.setLevels(levels);
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
