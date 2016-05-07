var logs = require('../');

// debug and debug2 need set env DEBUG to Foo
var msg = 'Hello World';

['debug', 'log4js', 'winston', 'logule', 'tracer', 'caterpillar'].forEach(function (vendor) {
  log(vendor, msg);
});

function log(vendor, msg) {
  console.log(vendor);
  console.log('-----------------------------------------');

  logs.use(vendor, {level: 'debug'});
  var logger = logs.get('Foo');
  ['trace', 'debug', 'info', 'warn', 'error'].forEach(function (level) {
    if (logger.isLevelEnabled(level)) {
      logger[level]('[%s] %s', vendor, msg, {foo: 'bar'});
    }
  });

  console.log('-----------------------------------------');
}

