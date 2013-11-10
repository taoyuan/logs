/*********************************************
 * IN WORKING
 *********************************************/

var colors = require('colors')
    , util = require('util')
    , fs = require('fs')
    ;

function Logger(opts) {
    if (!(this instanceof Logger)) {
        return new Logger(opts);
    }
    this.opts = opts || {};
    this.lastLogged = undefined;
    this.stream = undefined;

    this.createStream();
    this.access = true;
}

Logger.prototype.streamError = function streamError(err) {
    if (err.code == 'EACCES' && this.access) {
        this.access = false;
        this.stream = undefined;
        logError(err);
    }
    if (!this.access) {
        return;
    }

    logError(err);
};

Logger.prototype.createStream = function createStream() {

    /**
     * Only supporting local logging for now.
     */
    if (!this.opts.logFile) {
        return false;
    }

    this.stream = fs.createWriteStream(this.opts.logFile, {
        flags: 'a', encoding: 'utf8', mode: this.opts.logPerms || 0600
    });

    var myLogger = this;
    this.stream.on('error', function (err) {
        myLogger.streamError(err);
        setTimeout(function reStream() {
            myLogger.createStream.call(myLogger);
        }, 5000);
    });

    return this.stream || undefined;
};

Logger.prototype.log = function log() {

    /**
     * Log something with a timestamp
     */
    var args = Array.prototype.slice.call(arguments);
    var type = args.shift();
    var l = util.format.apply(null, args);
    if (l == this.lastLogged) {
        return;
    }
    var str = [ now(), type, l ].join(' ');
    console.log(str);
    this.lastLogged = l;
    if (this.stream && this.stream.writable) {

        this.stream.write(str + "\n");
    }
};

Logger.prototype.debug = function debug() {
    if (this.opts.env != "development" && this.opts.env != "hacking") {
        return;
    }
    if (this.opts.debug == false) {
        return;
    }

    this.msg.call(this, 'DEBUG'.cyan, arguments);
};

Logger.prototype.info = function info() {
    this.msg.call(this, 'INFO'.green, arguments);
};

Logger.prototype.error = function error() {
    var args = Array.prototype.slice.call(arguments);
    if (args[0] instanceof Error && process.env.NODE_ENV == "development") {
        var str = [now(), '(' + 'ERROR'.magenta + ')', args[0].stack].join(' ');
        this.stream.write(str + "\n");
        return console.log(str);
    }
    this.msg.call(this, 'ERROR'.red, arguments);
};

Logger.prototype.warn = function warn() {
    this.msg.call(this, 'WARN'.yellow, arguments);
};

Logger.prototype.msg = function msg(type, args) {
    args = Array.prototype.slice.call(args);
    args.unshift('(' + (type || 'INFO') + ')');
    this.log.apply(this, args);
};

function logError(err) {
    console.log(["%s (", "ERROR".red, ") Logger: %s" ].join(""), now(), err);
}

function now() {
    return '['.white + (new Date()).toUTCString().grey + ']'.white;
}

module.exports = Logger;





