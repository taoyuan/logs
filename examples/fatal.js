"use strict";

var logs = require('../');
var logger;

setTimeout(function () {
    console.log(Date.now());
}, 1000);

logger = logs.get('Foo');
logger.fatal('fatal error, should exit(1)');