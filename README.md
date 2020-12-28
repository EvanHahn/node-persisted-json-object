Persisted JSON objects for Node
===============================
[![Build Status](https://travis-ci.org/EvanHahn/node-persisted-json-object.svg?branch=master)](https://travis-ci.org/EvanHahn/node-persisted-json-object)

*Requires Node 6 or greater.*

This is an object that functions like a plain JavaScript object, but it saves itself to the file system after every change. Uses [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

Usage
-----

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
