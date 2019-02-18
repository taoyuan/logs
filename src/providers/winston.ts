"use strict";

import _ = require('lodash');
import df = require('dateformat');
import pad = require('pad');

const levels = {
  error: 0,
  warn: 1,
  help: 2,
  data: 3,
  info: 4,
  debug: 5,
  trace: 6
};

export function initialize(library, settings) {
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
        factory.format.colorize({colors: {trace: 'magenta'}}),
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
      doSerLevel(factory, level);

      function doSerLevel(logger, level) {
        logger.level = level;
        if (logger.loggers && logger.loggers.loggers) {
          _.forEach(logger.loggers.loggers, logger => doSerLevel(logger, level));
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
