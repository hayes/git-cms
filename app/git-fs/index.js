import EventEmitter from '../event-emitter'

class GitObject extends EventEmitter {
  constructor (fs, sha, name, parent = null) {
    super()
    this.fs = fs
    this.sha = sha
    this.name = name
    this.parent = parent
    this.loaded = false
    this.loading = false
    this.changed = false
  }
}

class Blob extends GitObject {
  constructor (fs, sha, name, parent) {
    super(fs, sha, name, parent)
    this.type = 'blob'
    this.contents = null
  }
}


class Tree extends GitObject {
  constructor (fs, sha, name, parent) {
    super(fs, sha, name, parent)
    this.type = 'tree'
    this.children = []
  }

  async load () {
    if (this.loaded) return this
    this.loading = true
    this.emit('update-tree', this)
    const data = await this.fs.loadTree(this.sha)

    for (const item of data.tree) {
      switch (item.type) {
        case 'tree':
          this.addChild(new Tree(this.fs, item.sha, item.path, this))
          break
        case 'blob':
          this.addChild(new Blob(this.fs, item.sha, item.path, this))
          break
        default:
          throw new Error(`Unknown object type '${item.type}' in tree`)
      }
    }

    this.loading = false
    this.loaded = true
    this.emit('update-tree', this)
    return this
  }

  onChildUpdate = (child) => {
    this.emit('update-tree', child)
  }

  addChild (child) {
    child.on('update-tree', this.onChildUpdate)
    this.children.push(child)
  }
}

export default class GitFS extends EventEmitter {
  constructor (sha) {
    super()
    this.root = null
  }

  async loadBranch (branch) {
    const ref = await this.loadJson(`/git/refs/heads/${branch}`)
    const commit = await this.loadJson(`/git/commits/${ref.object.sha}`)
    this.setTree(new Tree(this, commit.sha, branch))
    this.root.load()
  }

  setTree (tree) {
    if (this.root) {
      this.root.removeListener('update-tree', this.onTreeUpdate)
    }

    this.root = tree
    tree.on('update-tree', this.onTreeUpdate)
  }

  onTreeUpdate = (node) => {
    this.emit('update-tree', node)
  }

  loadTree (sha) {
    return this.loadJson(`/git/trees/${sha}`)
  }

  async loadJson (url) {
    const res = await fetch(url)
    return await res.json()
  }
}

