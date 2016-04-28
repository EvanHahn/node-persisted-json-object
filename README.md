Persisted JSON objects for Node
===============================
[![Build Status](https://travis-ci.org/EvanHahn/node-persisted-json-object.svg?branch=master)](https://travis-ci.org/EvanHahn/node-persisted-json-object)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

*Requires Node 6 or greater.*

This is an object that functions like a plain JavaScript object, but it saves itself to the file system after every change.

Basic usage
-----------

Install it like you might install any Node package:

```js
npm install persisted-json-object --save
```

Use it just like a regular JavaScript object:

```js
let jsonObject = require('persisted-json-object')

let obj = jsonObject({ file: 'data.json' })

obj.foo = 'boo'

obj.temporary = 'soon to be deleted'
delete obj.temporary

obj.grue = 'you'

obj.coolNumbers = [420, 666, 69, 12]
```

After these changes, `data.json` will look like this (some formatting added):

```json
{
  "foo": "boo",
  "grue": "you",
  "coolNumbers": [420, 666, 69, 12]
}
```

A few notes:

- If `data.json` exists, it will load that data.
- If `data.json` doesn't exist, it will be written as soon as you set a property.
- Errors will be thrown if your object cannot be serialized as JSON.

What's going on?
----------------

This makes heavy use of [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), which let you intercept object interactions. If you don't know about proxies, here's a simple example:

```js
let obj = {
  yas: 'qween',
  hello: 'world'
}

let proxy = new Proxy(obj, {
  get: function (target, key) {
    if (key === 'yas') {
      return 'YAS QWEEN!!'
    } else {
      return target[key]
    }
  }
})

proxy.hello  // => 'world'
proxy.yas    // => 'YAS QWEEN!!'
proxy.ugh    // => undefined
```

You can intercept `get`s, but you can also intercept `set`s and `delete`s and everything else. That's basically what this module does—every time you modify a property, it saves it to the file system.
