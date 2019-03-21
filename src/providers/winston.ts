"use strict";

import _ = require('lodash');
import df = require('dateformat');
import pad = require('pad');
import {Library} from "../logs";

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  help: 3,
  data: 4,
  info: 5,
  debug: 6,
  trace: 7
};

export function initialize(library: Library, settings) {
  settings = settings || {};
  const factory = (settings && settings.factory) || require('winston');

  const level = settings.level;
  factory.level = level;

  let transports = settings.transports || [
    new factory.transports.Console({
      colorize: true,
      format: factory.format.combine(
        factory.format.splat(),
        factory.format.simple(),
        factory.format.colorize({colors: {trace: 'magenta', fatal: 'red'}}),
        factory.format.timestamp(),
        factory.format.printf(info => {
          const level = pad(`<${info.level}>`, 15);
          return `${df(info.timestamp, 'yyyy-mm-dd HH:MM:ss')} ${level} ${info.message}`;
        })
      ),
    })
  ];

  _.forEach(transports, function (transport) {
    if (transport && typeof transport === 'object') {
      transport.level = level;
    }
  });

  library.provider = {
    setLevel: function (level) {
      doSetLevel(factory, level);

      function doSetLevel(logger, level) {
        logger.level = level;
        if (logger.loggers && logger.loggers.loggers) {
          _.forEach(logger.loggers.loggers, logger => doSetLevel(logger, level));
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
          console: {label: category},
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
  }
}
