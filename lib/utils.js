exports.wrap = function (logger, levels) {

};

var formatRegExp = /%[sdj]/g;
exports.format = function(f) {
    var util = require('util');
    var i;

    if (typeof f !== 'string') {
        var objects = [];
        for ( i = 0; i < arguments.length; i++) {
            objects.push(util.inspect(arguments[i]));
        }
        return objects.join(' ');
    }

    i = 1;
    var args = arguments;
    var str = String(f).replace(formatRegExp, function(x) {
        switch (x) {
            case '%s':
                return String(args[i++]);
            case '%d':
                return Number(args[i++]);
            case '%j':
                return JSON.stringify(args[i++]);
            default:
                return x;
        }
    });
    for ( var len = args.length, x = args[i]; i < len; x = args[++i]) {
        if (x === null || typeof x !== 'object') {
            str += ' ' + x;
        } else {
            str += ' ' + util.inspect(x);
        }
    }
    return str;
};
