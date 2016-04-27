const readFile = require('./lib/readFile')

module.exports = function jsonObject (options) {
  const data = readFile(options.file)

  return new Proxy(data, {})
}
