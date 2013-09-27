"use strict";

module.exports = exports = function Tracer() {

    var tracer = require('tracer');

    return {
        getLogger: function () {
            return tracer.colorConsole();
        }
    }
};