export function initialize (library) {
  const debug = require('debug');

  library.provider = {
    getLogger: function (category) {
      return new DebugLogger(debug(category));
    }
  }
}

function DebugLogger(debug) {
  this.debug = debug;
}

DebugLogger.prototype.log = function (level, msg) {
  this.debug(msg);
};

DebugLogger.prototype.isLevelEnabled = function (level) {
  return true;
};
