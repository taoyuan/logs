var logs = require('../');
var logger;

// debug and debug2 need set env DEBUG to Foo

logger = logs.get('Foo');
logger.info('1. (console) %s %j', 'hello world', {from: 'taoyuan'});

logs.use('debug');
logger = logs.get('Foo');
logger.info('2. (debug) %s', 'hello world');

logs.use('debug2');
logger = logs.get('Foo');
logger.info('3. (debug2) %s', 'hello world');

logs.use('log4js');
logger = logs.get('Foo');
logger.info('4. (log4js) %s', 'hello world');

logs.use('winston');
logger = logs.get('Foo');
logger.info('5. (winston) %s', 'hello world');

logs.use('logule');
logger = logs.get('Foo');
logger.info('6. (logule) %s', 'hello world');

logs.use('tracer');
logger = logs.get('Foo');
logger.info('7. (tracer) %s', 'hello world');

logs.use('caterpillar');
logger = logs.get('Foo');
logger.info('8. (caterpillar) %s', 'hello world');