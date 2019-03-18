import _ = require('lodash');

export function initialize(library, settings) {

  const tracer = require('tracer');

  settings = _.merge({
    appender: 'colorConsole',
    options: {}
  }, settings);

  library.provider = {
    setLevel: function (level) {
      tracer.setLevel(level);
    },
    getLogger: function () {
      return tracer[settings.appender](settings.options);
    }
  }
}
