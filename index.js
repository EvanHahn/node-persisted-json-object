const fs = require("fs");

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

class ProxyHandler {
  constructor(file) {
    this.file = file;
  }

  get(target, key) {
    return target[key];
  }

  set(target, key, value) {
    const testTarget = Object.assign({}, target, {
      [key]: value,
    });

    let json;
    try {
      json = JSON.stringify(testTarget);
    } catch (err) {
      throw new Error(
        `Setting ${key} to ${value} would make this object unable to be serialized as JSON.`
      );
    }

    fs.writeFileSync(this.file, json, "utf8");

    target[key] = value;

    return value;
  }

  deleteProperty(target, key) {
    const testTarget = Object.assign({}, target);
    delete testTarget[key];

    const json = JSON.stringify(testTarget);
    fs.writeFileSync(this.file, json, "utf8");

    delete target[key];

    return true;
  }
}

module.exports = function jsonObject(options) {
  return new Proxy(readFile(options.file), new ProxyHandler(options.file));
};
