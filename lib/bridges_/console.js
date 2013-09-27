"use strict";

module.exports = exports = function Console() {

    return {

        getLogger: function () {
            return console;
        },

        defaultLevel: function () {
            return 'log';
        }
    }
};