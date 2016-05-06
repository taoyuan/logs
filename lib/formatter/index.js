"use strict";

var _ = require('lodash');
var dateformat = require('dateformat');

var Colorizer = require('./colorizer');
var utils = require('./utils');
var chalk = utils.chalk;

function configuredFormatter(options) {

  var colors = options.colors;
  var padLevels = options.padLevels || 9;

  /**
   * @param {Object} options
   * @return {string}
   */
  return function formatter(options) {
    var meta = options.meta;

    var context = _.defaults(
      _.pick(options.meta, ['from', 'stack', 'trace', 'message']),
      _.pick(options, ['meta', 'level', 'label', 'message', 'timestamp']),
      {padLevels: padLevels}
    );

    delete meta.from;
    delete meta.message;
    delete meta.stack;
    delete meta.trace;

    var formattedMessage = format(new Colorizer(colors), context);

    formattedMessage += utils.getStackTrace(context.stack || context.trace);
    formattedMessage += utils.metaToYAML(meta);

    return formattedMessage;
  }
}

function format(colorizer, context) {
  var before = '';
  var from = '';
  var after = '';

  var timestamp = typeof context.timestamp === 'function' ? context.timestamp() : context.timestamp;

  if (timestamp) {
    before += colorizer.colorify('gray', timestamp) + ' ';
  }

  if (context.label) {
    before += chalk.bold(chalk.blue(context.label)) + ' ';
  }

  var level = '[' + context.level.toUpperCase() + '] ';
  if (context.padLevels) {
    level = _.padEnd(level, 9) + ' ';
  }
  before += level;

  before = colorizer.colorify(context.level, before);

  if (context.from) {
    from += context.from + ' ';
    after += '- ';
  }

  after += '' + context.message;

  // after = colorizer.colorify(context.level, after);

  return before + from + after;
}

module.exports = function (options) {
  options = options || {};
  return _.assign({
    timestamp: function () {
      options.timestamp = options.timestamp === undefined ? true : options.timestamp;
      if (options.timestamp) {
        var type = typeof options.timestamp;
        if (type === 'function') {
          return options.timestamp();
        }
        if (type !== 'string') {
          options.timestamp = 'yyyy-mm-dd HH:MM:ss.l';
        }
        if (type === 'string') {
          return dateformat(new Date(), options.timestamp);
        }
        return options.timestamp;
      }
    }
  }, options, {
    formatter: configuredFormatter(options)
  });
};
