export default class EventEmitter {
  constructor () {
    this._handlers = new Map()
  }

  on (name, handler) {
    if (!this._handlers.has(name)) {
      this._handlers.set(name, new Set())
    }

    this._handlers.get(name).add(handler)
  }

  emit (name, ...args) {
    if (!this._handlers.has(name)) return
    for (const handler of this._handlers.get(name)) {
      handler.apply(this, args)
    }
  }

  removeListener (name, handler) {
    if (this._handlers.has(name)) {
      return this._handlers.delete(handler)
    }

    return false
  }
}
