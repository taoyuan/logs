'use strict';

var chalk = new (require('chalk').constructor)({enabled: true});

/**
 * @param {string|undefined} stackTrace
 * @returns {string}
 */
function getStackTrace(stackTrace) {
  if (!stackTrace) {
    return '';
  }

  return chalk.magenta('\n  ' + stackTrace.replace(/(\r\n|\n|\r)/gm, '$1  '));
}

/**
 * Object to yaml string formatter
 *
 * @param {Object} obj
 * @param {number} [indent=1]
 * @returns {string}
 */
function objectProperty(obj) {
  var indent = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  if (Object.keys(obj).length === 0) {
    return indent === 1 ? '' : '{}';
  }

  var str = '\n';
  var prefix = getPrefix(indent);

  if (typeof obj.toObject === 'function') {
    obj = obj.toObject();
  }

  if (typeof obj.toJSON === 'function') {
    obj = obj.toJSON();
  }

  Object.keys(obj).filter(function (name) {
    if (!obj.hasOwnProperty(name)) {
      return false;
    }

    if (name.indexOf('__') === 0) {
      return false;
    }

    if (typeof obj[name] === 'function') {
      return false;
    }

    return true;
  }).forEach(function (name) {
    var value = obj[name];
    str += '' + prefix + name + ': ' + typifiedString(value, indent + 1) + '\n';
  });

  return str.substring(0, str.length - 1);
}

/**
 * Array to yaml string formatter
 *
 * @param {Array} values
 * @param {number} [indent=1]
 * @return {string}
 */
function arrayProperty(values) {
  var indent = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

  if (values.length <= 0) {
    return indent === 1 ? '' : '[]';
  }

  var str = '\n';
  var prefix = getPrefix(indent);

  values.forEach(function (value) {
    str += prefix + '- ' + typifiedString(value, indent + 1).trim() + '\n';
  });

  return str.substring(0, str.length - 1);
}

function typifiedString(value, indent) {
  switch (typeOf(value)) {
    case 'array':
      return arrayProperty(value, indent);
    case 'object':
      return objectProperty(value, indent);
    case 'string':
      return chalk.green(value ? value : '""');
    case 'number':
      return chalk.yellow(value);
    case 'boolean':
      return chalk.yellow.bold(value);
    case 'null':
      return chalk.magenta.bold('null');
    case 'undefined':
      return chalk.magenta.bold('undefined');
  }
}

function typeOf(value) {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (!value && typeof value === 'object') {
    return 'null';
  }

  return typeof value;
}

var prefixes = {};
function getPrefix() {
  var indent = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

  if (prefixes[indent]) {
    return prefixes[indent];
  }

  var prefix = '';
  for (var i = 0; i < indent; i++) {
    prefix += '  ';
  }

  return prefixes[indent] = prefix;
}

function metaToYAML(meta) {
  if (!meta || Object.keys(meta).length <= 0) {
    return '';
  }

  return objectProperty(meta);
}

/**
 * @return {string} - iso formatted time string
 */
function getISOTime() {
  var now = new Date().toISOString().split('T').join(' ');

  return now.substring(0, now.length - 1);
}

exports.chalk = chalk;
exports.getStackTrace = getStackTrace;
exports.arrayProperty = arrayProperty;
exports.objectProperty = objectProperty;
exports.typifiedString = typifiedString;
exports.getISOTime = getISOTime;
exports.metaToYAML = metaToYAML;
exports.getPrefix = getPrefix;
exports.typeOf = typeOf;
