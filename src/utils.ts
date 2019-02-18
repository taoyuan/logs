import {inspect} from "util";

export function wrap(logger, levels) {

}

const FORMAT_REGEX = /%[sdj]/g;

export function format(...args) {
  if (typeof args[0] !== 'string') {
    let objects: any[] = [];
    for (let i = 0; i < args.length; i++) {
      objects.push(inspect(args[i]));
    }
    return objects.join(' ');
  }

  let i = 1;
  let str = String(args[0]).replace(FORMAT_REGEX, (x) => {
    switch (x) {
      case '%s':
        return String(args[i++]);
      case '%d':
        return Number(args[i++]).toString();
      case '%j':
        return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for (let len = args.length, x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
}
