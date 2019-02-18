import {format} from "../utils";
import df = require('dateformat');

const toUpperCase = String.prototype.toUpperCase;

export function initialize(library, settings) {

  library.provider = {
    getLogger: function (category) {
      return new ConsoleLogger(category);
    }
  };
}

function ConsoleLogger(category) {
  this.category = category;
}

ConsoleLogger.prototype.log = function (level, ...args) {
  console.log(format('%s [%s] %s -',
    df(Date.now(), 'yyyy-mm-dd HH:MM:ss'),
    toUpperCase.call(level),
    this.category,
    format(...args)));
};

ConsoleLogger.prototype.isLevelEnabled = function (level) {
  return true;
};
