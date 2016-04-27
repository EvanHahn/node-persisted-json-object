const jsonObject = require('..')

const assert = require('assert')
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')

const FILE = path.resolve(__dirname, 'tmp-data.json')

describe('jsonObject', function () {
  beforeEach(function (done) {
    rimraf(FILE, done)
  })

  it('starts off equal to {}', function () {
    assert.deepEqual(jsonObject({ file: FILE }), {})
  })

  it("creates the file if it doesn't exist", function (done) {
    jsonObject({ file: FILE })

    fs.stat(FILE, (err, stats) => {
      if (err) { return done(err) }
      assert(stats.isFile())
      done()
    })
  })

  it('reads from an existing file if it already exists', function (done) {
    fs.writeFile(FILE, '{"hi":5}', (err) => {
      if (err) { return done(err) }

      assert.deepEqual(jsonObject({ file: FILE }), { hi: 5 })

      done()
    })
  })

  it('throws an error if the file exists and is not valid JSON', function (done) {
    fs.writeFile(FILE, 'garbage', (err) => {
      if (err) { return done(err) }

      assert.throws(function () {
        jsonObject({ file: FILE })
      })

      done()
    })
  })

  it('throws an error if the file is a directory', function (done) {
    fs.mkdir(FILE, (err) => {
      if (err) { return done(err) }

      assert.throws(function () {
        jsonObject({ file: FILE })
      })

      done()
    })
  })
})
