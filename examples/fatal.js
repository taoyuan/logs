"use strict";

const logs = require('../');

setTimeout(function () {
  console.log(Date.now());
}, 1000);

const logger = logs.get('Foo');
logger.fatal('fatal error, should exit(1)');
