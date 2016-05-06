"use strict";

var _ = require('lodash');

/**
 *
 * @param library
 * @param settings
 * - appender: console|colorConsole|dailyfile
 * - options:
 */
exports.initialize = function (library, settings) {

  var tracer = require('tracer');

  settings = _.merge({
    appender: 'colorConsole',
    options: {}
  }, settings);

  library.bridge = {
    getLogger: function () {
      return tracer[settings.appender](settings.options);
    }
  }
};
