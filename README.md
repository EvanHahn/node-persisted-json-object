Persisted JSON objects for Node
===============================

*Requires Node 6 or greater.*

This is an object that functions like a plain JavaScript object, but it saves itself to the file system after every change.

Basic usage
-----------

Use it just like a regular JavaScript object:

```js
let obj = jsonObject({ file: 'data.json' })

obj.foo = 'boo'
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