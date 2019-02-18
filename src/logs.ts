import fs = require('fs');
import chalk = require('chalk');
import {Logger} from "./logger";

const LOGS_TAG = '__logs_library__';

export const version = require('../package').version;

export interface LoggerOptions {
  [name: string]: any;
}

export class Library {
  name: string;
  provider;

  constructor(name: string, settings?: { [name: string]: any }) {
    this.name = name;
    this.provider = {};

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
    } else if (fs.existsSync(__dirname + '/providers/' + name + '.js')) {
      // try built-in provider
      provider = require('./providers/' + name);
    } else {
      // try foreign provider
      try {
        provider = require('logs-' + name);
      } catch (e) {
        console.log('\nWARNING: Logs provider "' + name + '" is not installed,\nso your logger would not work, to fix run:\n\n    npm install logs-' + name, '\n');
        return;
      }
    }

    provider.initialize(this, settings);
    return this;
  }


  setLevel(level) {
    return this.provider.setLevel && this.provider.setLevel(level);
  };


  get(name: string, options?: LoggerOptions): Logger;
  get(name: string, color: string, options?: LoggerOptions): Logger;
  get(name: string, color?: string, category?: string[], colors?: string[], options?: LoggerOptions): Logger;
  get(name: string, color?: string | LoggerOptions, category?: string[] | LoggerOptions, colors?: string[] | LoggerOptions, options?: LoggerOptions): Logger {
    name = name || '[NONAME]';

    if (color && typeof color === 'object') {
      options = color;
      color = undefined;
    } else if (category && typeof category === 'object') {
      options = category;
      category = undefined;
    } else if (colors && typeof colors === 'object') {
      options = colors;
      colors = undefined;
    }

    const colorsToUse = colors ? colors.slice() : ['cyan', 'magenta', 'green', 'grey'];
    const categoryToUse = category ? category.slice() : [];

    if (color) {
      colorsToUse.unshift(color);
    }

    categoryToUse.push(chalk[colorsToUse.shift() || 'white'](name));

    return new Logger(this.provider.getLogger((categoryToUse.join(' ')), options), (name: string, color?: string) => {
      return this.get(name, color, categoryToUse, colorsToUse, options);
    });
  };

  middleware(opts) {
    if (this.provider.middleware) {
      return this.provider.middleware(opts);
    }
    return (req, res, next) => next();
  };
}


export function use(name: string, settings?: { [name: string]: any }, showUsingLogs?: boolean) {
  const library = global[LOGS_TAG] = new Library(name, settings);
  if (showUsingLogs) {
    console.log('logs is using logging library "' + library.name + '"');
  }

  return module.exports;
}

export function setLevel(level) {
  return global[LOGS_TAG] && global[LOGS_TAG].setLevel(level);
}

export function get(name: string, options?: LoggerOptions): Logger;
export function get(name: string, color: string, options?: LoggerOptions): Logger;
export function get(name: string, color: string, category?: string[], colors?: string[], options?: LoggerOptions): Logger;
export function get(name: string, color?: string | LoggerOptions, category?: string[] | LoggerOptions, colors?: string[] | LoggerOptions, options?: LoggerOptions): Logger {
  if (!(LOGS_TAG in global)) {
    console.warn('[logs] NO LOG BRIDGE DEFINED. USING DEFAULT "CONSOLE" BRIDGE.');
    use('console');
  }
  return global[LOGS_TAG].get(name, color, category, colors, options);
}

