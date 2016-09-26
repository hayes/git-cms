const util = require('./util')
const dataPairRegex = /(.*?)\s+(.*)/
const authorRegex = /(.+?) <(.+?)> (\d+) ([+-]?\d+)/

module.exports = {
  get: get,
  create: create
}

function get (sha) {
  return util.exec(`git cat-file -p ${sha}`).then((data) => {
    const dataPairs = data.split('\n\n')[0].split('\n')
    const message = data.split('\n\n')[1].trim()

    const commit = {
      sha: sha,
      message: message,
      parents: []
    }

    dataPairs.forEach(pair => {
      const parts = pair.match(dataPairRegex)
      if (!parts) return
      switch (parts[1]) {
        case 'tree':
          commit.tree = {
            sha: parts[2]
          }
          break
        case 'author':
          commit.author = parseAuthor(parts[2])
          break
        case 'committer':
          commit.commiter = parseAuthor(parts[2])
          break
        case 'parent':
          commit.parents.push({
            sha: parts[2]
          })
          break
      }
    })

    return commit
  })
}

function create (commit) {
  const env = {}

  if (commit.author) {
    env.GIT_AUTHOR_NAME = commit.author.name
    env.GIT_AUTHOR_EMAIL = commit.author.email
    env.GIT_AUTHOR_DATE = commit.author.date
  }

  if (commit.committer) {
    env.GIT_COMMITTER_NAME = commit.commiter.name
    env.GIT_COMMITTER_EMAIL = commit.commiter.email
    env.GIT_COMMITTER_DATE = commit.commiter.date
  }

  return util.exec(
    `git commit-tree ${commit.tree} -m "${commit.message.replace('"', '\\"')}`, {
      env: env
    }
  ).then(data => {
    return data.trim()
  })
}

function parseAuthor (authorString) {
  const parts = authorString.match(authorRegex)

  return {
    name: parts[1],
    email: parts[2],
    date: new Date(parseInt(parts[3], 10) * 1000).toISOString()
  }
}
