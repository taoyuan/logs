"use strict";

module.exports = exports = function Debug() {

    var debug = require('debug2');

    return {

        getLogger: function (category) {
            return {
                debug: debug(category)
            };
        },

        defaultLevel: function () {
            return 'debug';
        }
    }
};