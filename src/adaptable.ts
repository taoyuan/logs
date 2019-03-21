import _ = require('lodash');
import {Logger, LoggerExtender} from "./logger";

export class AdaptableLogger implements Logger {
  protected adapter;
  protected extender?: LoggerExtender;

  constructor(adapter, extender?: LoggerExtender) {
    this.adapter = adapter;
    this.extender = extender;
  }

  // TODO This is for winston. Should find a better way to set level for other providers.
  get level() {
    return this.adapter.level;
  }

  set level(level: string) {
    this.adapter.level = level;
  }

  extend(name: string, color?: string): Logger {
    if (this.extender) {
      return this.extender(name, color);
    }
    throw new Error('`extender` is not provider')
  }

  log(level: string, ...args) {
    if (typeof this.adapter[level] === "function") {
      this.adapter[level](...args);
    } else {
      this.adapter.log(level, ...args);
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
    const adapter = this.adapter;
    const method = 'is' + _.capitalize(level) + 'Enabled';
    if (typeof adapter[method] === "function") {
      return adapter[method]();
    } else if (adapter.isLevelEnabled) {
      return adapter.isLevelEnabled(level);
    } else if (adapter.levels) {
      return adapter.levels[adapter.level || 'debug'] >= adapter.levels[level];
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
