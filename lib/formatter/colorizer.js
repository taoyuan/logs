"use strict";

var _ = require('lodash');
var chalk = require('./utils').chalk;

var defaults = {
  silly: 'blue',
  trace: 'blue',
  debug: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red',
  verbose: 'magenta'
};

/**
 *
 * @param colors
 * @constructor
 */
function Colorizer(colors) {
  this.colors = _.assign({}, defaults, colors);
}

Colorizer.prototype.color = function (level, defaultColor) {
  if (defaultColor === undefined) {
    defaultColor = 'white';
  }
  return this.colors[level] || defaultColor;
};

Colorizer.prototype.colorify = function (color, string) {
  color = this.color(color, null) || color;
  return chalk[color](string);
};

module.exports = Colorizer;
