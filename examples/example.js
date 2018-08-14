var logs = require('../');

// debug and debug2 need set env DEBUG to Foo
var msg = 'Hello World';

// ['debug', 'log4js', 'winston', 'logule', 'tracer', 'caterpillar'].forEach(function (vendor) {
['winston'].forEach(function (vendor) {
  log(vendor, msg);
});

function log(vendor, msg) {
  console.log(vendor);
  console.log('-----------------------------------------');

  // logs.use(vendor, {level: 'trace'});
  logs.use(vendor);
  logs.setLevel('trace');
  var logger = logs.get('Foo').extend('Bar');
  ['trace', 'debug', 'info', 'warn', 'error'].forEach(function (level) {
    if (logger.isLevelEnabled(level)) {
      logger[level]('[%s] %s %j', vendor, msg, {message: 'hello'});
      logger[level]('Simple Message');
    }
  });

  console.log('-----------------------------------------');
}

