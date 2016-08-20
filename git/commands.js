const childProcess = require('child_process')
const refRegexp = /(\S+)\s+(\S+)\s+(\S+)/

module.exports = {
  getAllRefs: getAllRefs,
  createRef: createRef,
  updateRef: updateRef
}

function getAllRefs (pattern) {
  return exec(`git for-each-ref ${pattern || ''}`).then(refs => {
    return refs.split('\n')
      .map(line => line.match(refRegexp))
      .filter(Boolean)
      .map(match => {
        return {
          ref: match[3],
          object: {
            type: match[2],
            sha: match[1]
          }
        }
      })
  })
}

function createRef (ref, sha) {
  return exec(`git update-ref ${ref} ${sha} ""`)
}

function updateRef (ref, sha, force) {
  return exec(`git update-ref ${ref} ${sha} ""`)
}

function exec (command) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log(stdout, stderr)
        return reject(err)
      }
      resolve(stdout)
    })
  })
}
