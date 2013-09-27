var t = require('./init').assert,
    logs = require('../');

describe("logs", function () {

    it("version", function() {
        t.equal(logs.version, require('../package').version);
    });

    it("use return logs", function() {
        t.equal(logs.use('debug'), logs);
    });

    it("should have the correct member defined", function () {
        t.typeOf(logs.use, "function");
        t.typeOf(logs.get, "function");
    });

});
