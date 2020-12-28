const readFile = require("./lib/readFile");
const ProxyHandler = require("./lib/ProxyHandler");

module.exports = function jsonObject(options) {
  return new Proxy(readFile(options.file), new ProxyHandler(options.file));
};
