"use strict";

import _ = require('lodash');
import df = require('dateformat');
import pad = require('pad');
import {Library} from "../logs";
import { format } from "winston";

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

  const padlevel = format((info, opts) => {
    info.level =  pad(_.upperCase(info.level), 5);
    return info;
  });

  let transports = settings.transports || [
    new factory.transports.Console({
      colorize: true,
      format: factory.format.combine(
        factory.format.splat(),
        factory.format.simple(),
        padlevel(),
        factory.format.colorize({colors: {trace: 'magenta', fatal: 'red'}}),
        factory.format.timestamp(),
        factory.format.printf(info => {
          return `${df(info.timestamp, 'yyyy-mm-dd HH:MM:ss')} ${info.level} ${info.message}`;
        }),

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

    getLogger: function (name, options) {
      options = options || {};
      if (name) {
        if (factory.loggers.has(name)) {
          return factory.loggers.get(name);
        }

        const l = factory.loggers.add(name, {
          console: {label: name},
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
