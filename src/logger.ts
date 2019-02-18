export type LoggerExtender = (name: string, color?: string) => Logger;

export interface Logger {
  level: string;

  extend(name: string, color?: string): Logger;

  log(level: string, ...args: any[]);
  trace(...args: any[]);
  debug(...args: any[]);
  info(...args: any[]);
  warn(...args: any[]);
  error(...args: any[]);
  fatal(...args: any[]);

  isLevelEnabled(level: string): boolean;
  isTraceEnabled();
  isDebugEnabled();
  isInfoEnabled();
  isWarnEnabled();
  isErrorEnabled();
  isFatalEnabled();
}
