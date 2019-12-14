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

function isObject(val) {
  return val != null && typeof val === "object" && Array.isArray(val) === false;
}

function isObjectObject(o) {
  return isObject(o) && Object.prototype.toString.call(o) === "[object Object]";
}

export function isPlainObject(o) {
  let ctor, prot;

  if (!isObjectObject(o)) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== "function") return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (!isObjectObject(prot)) return false;

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }

  // Most likely a plain Object
  return true;
}
