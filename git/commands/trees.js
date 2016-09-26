const util = require('./util')
const blobs = require('./blobs')

module.exports = {
  get: get,
  create: create
}

const parseTreeRegex = /(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)/

function get (sha, recursive) {
  return util.exec(`git ls-tree ${sha} -l ${recursive ? '-r' : ''}`).then(data => {
    const tree = data.split('\n')
      .map(line => parseTreeRegex.exec(line))
      .filter(Boolean)
      .map(entry => {
        return {
          mode: entry[1],
          type: entry[2],
          sha: entry[3],
          size: entry[4],
          path: entry[5]
        }
      })

    return {
      sha: sha,
      tree: tree
    }
  })
}

function create (root) {
  if (root.base_tree) {
    return get(root.base_tree, false).then(baseTree => {
      return writeTree(root.tree.concat(baseTree.tree))
    })
  }

  return writeTree(root.tree)

  function writeTree (entries) {
    const uniqueEntries = entries.filter(uniqueFile())
    return Promise.all(uniqueEntries.map((entry) => {
      if (entry.sha) return Promise.resolve(entry)

      return blobs.create(entry.content).then((sha) => {
        return {
          path: entry.path,
          mode: entry.mode,
          type: entry.type,
          sha: sha
        }
      })
    })).then(entries => {
      const treeFormat = entries.map((entry) => {
        return `${entry.mode} ${entry.type} ${entry.sha}\t ${entry.path}`
      }).join('\n')

      return util.write('git', ['mktree'], treeFormat).then(sha => {
        return sha.trim()
      })
    })
  }
}

function uniqueFile () {
  const seen = new Set()

  return (entry) => {
    const path = entry.path.toLowerCase()
    if (seen.has(path)) {
      return false
    }

    seen.add(path)
    return true
  }
}
