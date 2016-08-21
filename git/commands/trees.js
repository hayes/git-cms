const util = require('./util')

module.exports = {
  get: get,
  create: create
}

function get (sha, recursive) {
  return util.exec(`git ls-tree ${sha} -l ${recursive ? '-r' : ''}`, {
    encoding: 'buffer'
  })
}

function create (tree) {
  const content = ''
  return util.write('git', ['mktree'], content).then(data => {
    return data.trim()
  })
}

get()