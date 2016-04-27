const fs = require('fs')

module.exports = function jsonObject (options) {
  const data = readFile(options.file)

  return new Proxy(data, {})
}

function readFile (file) {
  try {
    const stats = fs.statSync(file)

    if (stats.isFile()) {
      const rawJson = fs.readFileSync(file, 'utf8')

      try {
        return JSON.parse(rawJson)
      } catch (err) {
        if (err instanceof SyntaxError) {
          throw new Error(`Could not parse ${file} as JSON`)
        } else {
          throw err
        }
      }
    } else {
      throw new Error(`${file} is not a valid file`)
    }
  } catch (err) {
    if (err.code !== 'ENOENT') { throw err }

    fs.writeFile(file, '{}', 'utf8')

    return {}
  }
}
