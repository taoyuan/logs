"use strict";

exports.initialize = function (library, settings) {
    var caterpillar = require('caterpillar');
    var filter = new (require('caterpillar-filter').Filter)();
    var human = new (require('caterpillar-human').Human)();

    library.bridge = {
        getLogger: function () {
            var logger = new caterpillar.Logger(settings);
            logger.pipe(filter).pipe(human).pipe(process.stdout);
            return logger;
        }
    }
};
