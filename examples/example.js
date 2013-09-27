var logs = require('../');
var logger;

// debug and debug2 need set env DEBUG to Foo

logger = logs.get('Foo');
logger.info('1. (console) %s', 'hello world');

//logs.use('debug');
//logger = logs.get('Foo');
//logger.info('2 - debug');

logs.use('log4js');
logger = logs.get('Foo');
logger.info('3. (log4js) %s', 'hello world');

//logs.use('logule');
//logger = logs.get('Foo');
//logger.info('4 - logule');

logs.use('winston');
logger = logs.get('Foo');
logger.info('5. (winston) %s', 'hello world');
//
//logs.use('tracer');
//logger = logs.get('Foo');
//logger.info('6 - tracer');
//
//logs.use('caterpillar');
//logger = logs.get('Foo');
//logger.info('7 - caterpillar');