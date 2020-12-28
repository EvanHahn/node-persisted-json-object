const fs = require("fs");
const ProxyHandler = require("./lib/ProxyHandler");

function readFile(file) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") {
      return {};
    }
    throw err;
  }

  if (typeof parsed === "object" && parsed && !Array.isArray(parsed)) {
    return parsed;
  }

  throw new Error("File does not contain a JSON object");
}

module.exports = function jsonObject(options) {
  return new Proxy(readFile(options.file), new ProxyHandler(options.file));
};
