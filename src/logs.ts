import fs = require('fs');
import {Logger} from "./logger";
import {AdaptableLogger} from "./adaptable";

const LOGS_TAG = '__logs_library__';

export const version = require('../package').version;

export interface LoggingOptions {
  parent?: any;
  [name: string]: any;
}

export interface Provider {
  getLogger: (name: string, options) => any;
  setLevel?: (level: string) => void;
  middleware?: (opts) => (req, res, next) => void;
}

export class Library {
  name: string;
  provider: Provider;

  constructor(name: string, settings?: { [name: string]: any }) {
    this.name = name;

    // and initialize loggers using provider
    // this is only one initialization entry point of provider
    // this module should define `provider` member of `this` (loggers)
    let provider;
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


  get(name: string, options?: LoggingOptions): Logger;
  get(name: string, color: string, options?: LoggingOptions): Logger;
  get(name: string, color?: string, categories?: string[], options?: LoggingOptions): Logger;
  get(name: string, color?: string | LoggingOptions, categories?: string[] | LoggingOptions, options?: LoggingOptions): Logger {
    name = name || '[NONAME]';

    if (color && typeof color === 'object') {
      options = color;
    } else if (categories && typeof categories === 'object') {
      options = categories;
      categories = undefined;
    }

    categories = categories ? categories.slice() : [];
    options = options || {};

    const nativeLogger = this.provider.getLogger(name, options);

    return new AdaptableLogger(nativeLogger, (name: string, color?: string) => {
      return this.get(name, color, <string[]>categories, {...options, parent: nativeLogger});
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

export function get(name: string, options?: LoggingOptions): Logger;
export function get(name: string, color: string, options?: LoggingOptions): Logger;
export function get(name: string, color: string, category?: string[], colors?: string[], options?: LoggingOptions): Logger;
export function get(name: string, color?: string | LoggingOptions, category?: string[] | LoggingOptions, colors?: string[] | LoggingOptions, options?: LoggingOptions): Logger {
  if (!(LOGS_TAG in global)) {
    console.warn('[logs] NO LOG BRIDGE DEFINED. USING DEFAULT "CONSOLE" BRIDGE.');
    use('console');
  }
  return global[LOGS_TAG].get(name, color, category, colors, options);
}

