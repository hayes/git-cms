const util = require('./util')

module.exports = {
  get: get,
  create: create
}

function get (sha) {
  return util.exec(`git cat-file -p ${sha}`, {
    encoding: 'buffer'
  })
}

function create (content, encoding) {
  return util.write(
    'git',
    ['hash-object', '--stdin', '-w'],
    content,
    encoding
  ).then(data => {
    return data.trim()
  })
}
