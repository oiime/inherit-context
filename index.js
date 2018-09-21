/*
 * as this is just placeholder for a common package I use there is a lack of documentation and unit testing here, sorry
 */

const CONTEXT_CONSTATNS = {
  LINEAGE: Symbol('lineage'),
  STATE: Symbol('state'),
  PARENT: Symbol('parent'),
  TYPE: Symbol('type'),
  LOCAL: Symbol('local'),
  CHILDREN: Symbol('children'),
  CONTEXTS: Symbol('contexts')
}

module.exports = class Context {
  static open (initialData, options) {
    return new this(initialData, options)
  }
  constructor (initialData, options = {}, metadata = {}) {
    this[CONTEXT_CONSTATNS.TYPE] = options.type || this._type || 'unknown'
    this[CONTEXT_CONSTATNS.LINEAGE] = metadata.lineage || []
    this[CONTEXT_CONSTATNS.PARENT] = metadata.parent
    this[CONTEXT_CONSTATNS.LOCAL] = initialData || {}
    this[CONTEXT_CONSTATNS.CHILDREN] = []
    this[CONTEXT_CONSTATNS.STATE] = {
      [this[CONTEXT_CONSTATNS.TYPE]]: this[CONTEXT_CONSTATNS.LOCAL]
    }
    this[CONTEXT_CONSTATNS.CONTEXTS] = {
      [this[CONTEXT_CONSTATNS.TYPE]]: this
    }
    this[CONTEXT_CONSTATNS.LINEAGE].forEach(ctx => {
      if (!ctx[CONTEXT_CONSTATNS.TYPE]) return
      this[CONTEXT_CONSTATNS.STATE][ctx[CONTEXT_CONSTATNS.TYPE]] = ctx[CONTEXT_CONSTATNS.LOCAL]
      this[CONTEXT_CONSTATNS.CONTEXTS][ctx[CONTEXT_CONSTATNS.TYPE]] = ctx
    })
  }
  get (arg1, arg2) {
    if (arg2) return this[CONTEXT_CONSTATNS.STATE][arg1][arg2]
    return this[CONTEXT_CONSTATNS.LOCAL][arg1]
  }
  getLineage (key) {
    return this[CONTEXT_CONSTATNS.LOCAL][key] || (this[CONTEXT_CONSTATNS.PARENT] && this[CONTEXT_CONSTATNS.PARENT].getLineage(key))
  }
  has (arg1, arg2) {
    if (arg2) return this[CONTEXT_CONSTATNS.STATE][arg1] && this[CONTEXT_CONSTATNS.STATE][arg1][arg2]
    return this[CONTEXT_CONSTATNS.LOCAL].hasOwnProperty(arg1)
  }
  set (key, value) {
    this[CONTEXT_CONSTATNS.LOCAL][key] = value
    return value
  }
  push (key, value) {
    if (!this[CONTEXT_CONSTATNS.LOCAL][key]) this[CONTEXT_CONSTATNS.LOCAL][key] = []
    this[CONTEXT_CONSTATNS.LOCAL][key].push(value)
    return value
  }
  assign (obj) {
    Object.assign(this[CONTEXT_CONSTATNS.LOCAL], obj)
  }
  assignPick (source, keys = []) {
    this.assign(keys.filter(key => source.hasOwnProperty(key)).reduce((obj, key) => {
      obj[key] = source[key]
      return obj
    }, {}))
  }
  extend (key, obj = {}) {
    this[CONTEXT_CONSTATNS.LOCAL][key] = Object.assign(Object.assign({}, this.parent && this.parent.getLineage(key)), obj)
  }
  cascade (method, ...args) {
    if (this[method]) this[method](...args)
    if (this[CONTEXT_CONSTATNS.CHILDREN]) {
      this[CONTEXT_CONSTATNS.CHILDREN].forEach(child => {
        child.cascade(method, ...args)
      })
    }
  }
  child (_Context = Context, initialData, options) {
    const lineage = this[CONTEXT_CONSTATNS.LINEAGE].slice(0)
    lineage.push(this)
    const child = new _Context(initialData, options, { parent: this, lineage })
    this[CONTEXT_CONSTATNS.CHILDREN].push(child)
    return child
  }

  toJSON () {
    return this[CONTEXT_CONSTATNS.LOCAL]
  }
  set type (value) {
    throw new Error('type is reserved')
  }
  get type () {
    return this[CONTEXT_CONSTATNS.TYPE]
  }
  set local (value) {
    throw new Error('local is reserved')
  }
  get local () {
    return this[CONTEXT_CONSTATNS.LOCAL]
  }
  set state (value) {
    throw new Error('state is reserved')
  }
  get state () {
    return this[CONTEXT_CONSTATNS.STATE]
  }
  set contexts (value) {
    throw new Error('contexts is reserved')
  }
  get contexts () {
    return this[CONTEXT_CONSTATNS.CONTEXTS]
  }
  set parent (value) {
    throw new Error('parent is reserved')
  }
  get parent () {
    return this[CONTEXT_CONSTATNS.PARENT]
  }
  set children (value) {
    throw new Error('children is reserved')
  }
  get children () {
    return this[CONTEXT_CONSTATNS.CHILDREN]
  }
  get metadata () {
    let obj = {
      type: this[CONTEXT_CONSTATNS.TYPE]
    }
    if (this[CONTEXT_CONSTATNS.PARENT]) {
      obj.parent = this[CONTEXT_CONSTATNS.PARENT][CONTEXT_CONSTATNS.TYPE]
    }
    return obj
  }
}
