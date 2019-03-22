const logs = require('..');

const level = "debug";
const vendors = ['pino', 'log4js', 'winston', 'logule', 'tracer', 'console'];
// const vendors = ['winston'];
// debug and debug2 need set env DEBUG to Foo
const msg = 'Hello World';

(async () => {
  for (const vendor of vendors) {
    await log(vendor, msg);
  }
})();

async function log(vendor, msg) {
  console.log('-----------------------------------------');
  console.log(vendor);
  console.log('-----------------------------------------');

  // logs.use(vendor, {level: 'trace'});
  logs.use(vendor);

  logs.setLevel(level);
  const logger = logs.get('Foo', {level}).extend('Bar');

  ['trace', 'debug', 'info', 'warn'].forEach(level => _log(logger, vendor, level, msg));

  await _log(logger, vendor, 'error', msg);

  // wait for all flushed
  await delay(100);
}

async function _log(logger, vendor, level, msg) {
  if (logger.isLevelEnabled(level)) {
    logger[level]('[%s] %s %j', vendor, msg, {data: 'this is data'});
    logger[level]('Simple Message');
  }
  await delay(100);
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
