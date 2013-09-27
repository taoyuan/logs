"use strict";

module.exports = exports = function Caterpillar() {

    var caterpillar = require('caterpillar');
    var filter = new (require('caterpillar-filter').Filter)();
    var human = new (require('caterpillar-human').Human)();

    return {

        getLogger: function () {
            var logger = new caterpillar.Logger;
            logger.pipe(filter).pipe(human).pipe(process.stdout);
            return logger;
        },

        defaultLevel: function () {
            return 'log';
        }
    }
};