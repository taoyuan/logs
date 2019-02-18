import {assert} from "chai";
import logs = require('../src');

describe("logs", function () {

  it("version", function () {
    assert.equal(logs.version, require('../package').version);
  });

  it("use return logs", function () {
    assert.deepEqual(logs.use('debug'), logs);
  });

  it("should have the correct member defined", function () {
    assert.typeOf(logs.use, "function");
    assert.typeOf(logs.get, "function");
  });

});
