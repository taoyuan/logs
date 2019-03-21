import _ = require('lodash');
import {Library} from "../logs";

export function initialize(library: Library, settings) {

  const pino = require('pino');

  library.provider = {
    setLevel: function (level) {
    },
    getLogger: function (category: string, options) {
    }
  }
}
