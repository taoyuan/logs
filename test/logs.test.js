var should = require('should'),
    logs = require('../');

describe("logs", function () {

    it("version", function() {
        logs.version.should.equal(require('../package').version);
    });

    it("use return logs", function() {
        logs.use('debug').should.equal(logs);
    });

    it("should have the correct member defined", function () {
        should.exist(logs.Library);
        logs.get.should.be.a('function');
        logs.getLibrary.should.be.a('function');
        logs.use.should.be.a('function');
    });

    it("#getLibrary using bridge name", function () {
        var library = logs.getLibrary('console');
        library.defaultLevel().should.equal("log");
    });

    it("#use", function () {
        var library = logs.use('console').getLibrary();
        library.defaultLevel().should.equal("log");

        var library2 = logs.getLibrary();
        library.should.equal(library2);
    });

    it("#get", function () {
        logs.use('console');
        var logger = logs.get();
        logger._logger.should.equal(console);
        logger.log.should.be.a('function');
    });

});
