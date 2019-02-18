export type LoggerExtender = (name: string, color?: string) => Logger;

export interface Logger {
  level: string;

  extend(name: string, color?: string): Logger;

  log(level, ...args);
  trace(...args);
  debug(...args);
  info(...args);
  warn(...args);
  error(...args);
  fatal(...args);

  isLevelEnabled(level: string): boolean;
  isTraceEnabled();
  isDebugEnabled();
  isInfoEnabled();
  isWarnEnabled();
  isErrorEnabled();
  isFatalEnabled();
}
