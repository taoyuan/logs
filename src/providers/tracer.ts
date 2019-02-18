import _ = require('lodash');

export function initialize(library, settings) {

  const tracer = require('tracer');

  settings = _.merge({
    appender: 'colorConsole',
    options: {}
  }, settings);

  library.provider = {
    getLogger: function () {
      return tracer[settings.appender](settings.options);
    }
  }
}
