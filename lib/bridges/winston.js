"use strict";

var _ = require('lodash');
var formatter = require('../formatter');

exports.initialize = function (library, settings) {
  var factory = settings && settings.factory;
  if (!factory) {
    factory = require('winston');
  }

  settings = _.merge({
    console: formatter({
      level: 'silly',
      colorize: true,
      padLevels: 9
    })
  }, settings);

  library.bridge = {
    getLogger: function (category) {
      if (category) {
        if (factory.loggers.has(category)) {
          return factory.loggers.get(category);
        }
        return factory.loggers.add(category, _.merge({
          console: {
            label: category
          }
        }, settings));
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
