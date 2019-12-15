import { Library, LoggingOptions } from "../logs";
import { Logger, LoggerOptions } from "pino";
import * as assert from "assert";

export function initialize(library: Library, opts: LoggerOptions) {

  const pino = require("pino");

  let defaults: LoggerOptions = {};
  try {
    require("pino-pretty");
    defaults.prettyPrint = {
      colorize: true,
      translateTime: "SYS:standard"
    };
  } catch (e) {
  }

  const settings = { level: "info", ...defaults, ...opts };

  library.provider = {
    setLevel: function(level) {
      assert(level, "level can not be empty");
      settings.level = level;
    },
    getLogger: function(name: string, options: LoggingOptions) {
      const level = options.level || options.parent?.level || settings.level;
      if (options.parent) {
        return (<Logger>options.parent).child({ name, level });
      }
      return pino({ ...settings, name, ...options, level });
    }
  };
}
