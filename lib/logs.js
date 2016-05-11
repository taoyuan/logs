"use strict";

//var _ = require('lodash');
//var inflection = require('inflection');
//var utils = require('./utils');
var path = require('path');
var fs = require('fs');
var Logger = require('./logger');

var existsSync = fs.existsSync || path.existsSync;

var LIBRARY = '__logs_library';

//var LEVELS = ['trace','debug','info','warn','error','fatal'];
//var IS_LEVEL_ENABLED_METHODS = _.reduce(LEVELS, function (result, level) {
//    result[level] = 'is' + inflection.capitalize(level) + 'Enabled';
//    return result;
//}, {});


/**
 *
 * @param name
 * @param settings
 * @returns {*}
 * @constructor
 */
function Library(name, settings) {
  this.name = name;
  this.provider = {};
//    this.settings = settings;


  // and initialize loggers using provider
  // this is only one initialization entry point of provider
  // this module should define `provider` member of `this` (loggers)
  var provider;
  if (typeof name === 'object') {
    provider = name;
    this.name = provider.name;
  } else if (name.match(/^\//)) {
    // try absolute path
    provider = require(name);
  } else if (existsSync(__dirname + '/providers/' + name + '.js')) {
    // try built-in provider
    provider = require('./providers/' + name);
  } else {
    // try foreign provider
    try {
      provider = require('logs-' + name);
    } catch (e) {
      return console.log('\nWARNING: Logs provider "' + name + '" is not installed,\nso your logger would not work, to fix run:\n\n    npm install logs-' + name, '\n');
    }
  }

  provider.initialize(this, settings);
  return this;
}

Library.prototype.get = function (catagory, options) {
  return new Logger(this.provider.getLogger(catagory, options));
};

Library.prototype.middleware = function (opts) {
  if (this.provider.middleware) {
    return this.provider.middleware(opts);
  }
  return function (req, res, next) {
    return next();
  };
};

exports.use = use;
function use(name, settings, showUsingLogs) {
  var library = global[LIBRARY] = new Library(name, settings);
  if (showUsingLogs) {
    console.log('logs is using logging library "' + library.name + '"');
  }
  return exports;
}

exports.get = get;
function get(category) {
  if (!(LIBRARY in global)) {
    console.warn('[logs] NO LOG BRIDGE DEFINED. USING DEFAULT "CONSOLE" BRIDGE.');
    use('console');
  }
  return global[LIBRARY].get(category);
}

Object.defineProperty(exports, 'version', {
  get: function () {
    return require('../package').version;
  }
});
