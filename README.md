## about

`inherit-context` is a short and simple inherited context manager, it is used to allow a more easy to manage request context where different objects can access each other

## installation
```bash
npm install --save inherit-context
```

## by example

`inherit-context` has a pretty short simple code, the easiest way would be to just read through it

```javascript
const Context = require('inherit-context')

class ParentContext extends Context {
  get _type () { return 'parentType' }

  process () {
    const foo1 = this.push('foo', this.child(FooContext))
    this.set('parentValue', 'world')
    console.log(foo1.hello())
  }
}

class FooContext extends Context {
  get _type () { return 'key2' }

  hello () {
    this.set('foo', 'bar')
    return `hello ${this.state.parentType.parentValue} I am ${this.local.foo}`
  }
}

```

License: MIT
