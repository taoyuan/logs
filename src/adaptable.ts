import _ = require('lodash');
import {Logger, LoggerExtender} from "./logger";

export class AdaptableLogger implements Logger {
  protected _native: any;
  protected _extender?: LoggerExtender;

  constructor(native, extender?: LoggerExtender) {
    this._native = native;
    this._extender = extender;
  }

  get native() {
    return this._native;
  }


  // TODO This is for winston. Should find a better way to set level for other providers.
  get level() {
    return this._native.level;
  }

  set level(level: string) {
    this._native.level = level;
  }

  extend(name: string, color?: string): Logger {
    if (this._extender) {
      return this._extender(name, color);
    }
    throw new Error('`extender` is not provider')
  }

  log(level: string, ...args) {
    if (typeof this._native[level] === "function") {
      this._native[level](...args);
    } else {
      this._native.log(level, ...args);
    }
    if (level === 'fatal') {
      process.exit(1);
    }
  };

  trace(...args) {
    return this.log('trace', ...args);
  }

  debug(...args) {
    return this.log('debug', ...args);
  }

  info(...args) {
    return this.log('info', ...args);
  }

  warn(...args) {
    return this.log('warn', ...args);
  }

  error(...args) {
    return this.log('error', ...args);
  }

  fatal(...args) {
    return this.log('fatal', ...args);
  }

  isLevelEnabled(level) {
    const native = this._native;
    const method = 'is' + _.capitalize(level) + 'Enabled';
    if (typeof native[method] === "function") {
      return native[method]();
    } else if (native.isLevelEnabled) {
      return native.isLevelEnabled(level);
    } else if (native.levels) {
      return native.levels[native.level || 'debug'] >= native.levels[level];
    } else {
      // console.warn('`isLevelEnabled` is not supported. Return true as default');
      return true;
    }
  };

  isTraceEnabled() {
    return this.isLevelEnabled('trace');
  };

  isDebugEnabled() {
    return this.isLevelEnabled('debug');
  };

  isInfoEnabled() {
    return this.isLevelEnabled('info');
  };

  isWarnEnabled() {
    return this.isLevelEnabled('warn');
  };

  isErrorEnabled() {
    return this.isLevelEnabled('error');
  };

  isFatalEnabled() {
    return this.isLevelEnabled('fatal');
  };
}
