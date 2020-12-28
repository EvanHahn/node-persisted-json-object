const jsonObject = require("..");

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const os = require("os");

describe("jsonObject", function () {
  beforeEach(function () {
    this.file = path.join(
      os.tmpdir(),
      `persisted-json-object-test-${Date.now()}-${Math.random()
        .toString()
        .substr(2)}`
    );
  });

  afterEach(function (done) {
    fs.rm(this.file, { force: true, recursive: true, maxRetries: 2 }, done);
  });

  describe("initialization", function () {
    it("starts off equal to {}", function () {
      assert.deepEqual(jsonObject({ file: this.file }), {});
    });

    it("doesn't create the file if you haven't added properties", function () {
      jsonObject({ file: this.file });

      assert.throws(() => {
        fs.accessSync(this.file, fs.constants.R_OK);
      });
    });

    it("reads from an existing file if it already exists", function () {
      fs.writeFileSync(this.file, '{"hi":5}');
      assert.deepEqual(jsonObject({ file: this.file }), { hi: 5 });
    });

    it("throws an error if the file exists and is not valid JSON", function () {
      fs.writeFileSync(this.file, "garbage data");
      assert.throws(() => {
        jsonObject({ file: this.file });
      });
    });

    it("throws an error if the file exists and is not an object", function () {
      fs.writeFileSync(this.file, JSON.stringify([1, 2, 3]));
      assert.throws(() => {
        jsonObject({ file: this.file });
      });
    });

    it("throws an error if the file is a directory", function () {
      fs.mkdirSync(this.file);
      assert.throws(() => {
        jsonObject({ file: this.file });
      });
    });
  });

  describe("property access", function () {
    it("can get and set properties", function () {
      const obj = jsonObject({ file: this.file });

      assert.deepEqual(obj, {});

      obj.name = "Peaches";
      obj.age = 99;

      assert.deepEqual(obj, {
        name: "Peaches",
        age: 99,
      });
    });

    it("modifies its file after setting properties", function () {
      const obj = jsonObject({ file: this.file });

      obj.name = "Peaches";
      obj.age = 99;

      const data = fs.readFileSync(this.file, "utf8");
      assert.deepEqual(JSON.parse(data), {
        name: "Peaches",
        age: 99,
      });
    });

    it("throws an error when trying to set a non-serializable property", function () {
      const obj = jsonObject({ file: this.file });

      const a = {};
      const b = {};
      a.friend = b;
      b.friend = a;

      assert.throws(function () {
        obj.property = a;
      });
    });

    it("doesn't modify the object when trying to set a non-serializable property", function () {
      const obj = jsonObject({ file: this.file });

      const a = {};
      const b = {};
      a.friend = b;
      b.friend = a;

      try {
        obj.property = a;
      } catch (err) {
        /* ignored */
      }

      assert.deepEqual(obj, {});
    });

    it("doesn't modify the file when trying to set a non-serializable property", function () {
      const obj = jsonObject({ file: this.file });

      obj.foo = "boo";

      const a = {};
      const b = {};
      a.friend = b;
      b.friend = a;

      try {
        obj.property = a;
      } catch (err) {
        /* ignored */
      }

      const data = fs.readFileSync(this.file, "utf8");
      assert.deepEqual(JSON.parse(data), { foo: "boo" });
    });
  });

  describe("deletion", function () {
    it("lets you delete properties", function () {
      const obj = jsonObject({ file: this.file });

      obj.foo = "boo";
      obj.yas = "qween";
      delete obj.foo;

      assert.deepEqual(obj, { yas: "qween" });
    });

    it("saves property deletions", function () {
      const obj = jsonObject({ file: this.file });

      obj.foo = "boo";
      obj.yas = "qween";
      delete obj.foo;

      const data = fs.readFileSync(this.file, "utf8");
      assert.deepEqual(JSON.parse(data), { yas: "qween" });
    });
  });
});
