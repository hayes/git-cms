const refRegexp = /(\S+)\s+(\S+)\s+(\S+)/
const exec = require('./util').exec

module.exports = {
  getAllRefs: getAllRefs,
  createRef: createRef,
  updateRef: updateRef,
  deleteRef: deleteRef,
  getRef: getRef
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

function getRef (ref) {
  return getAllRefs(ref).then(refs => {
    if (refs.length !== 1 || refs[0].ref !== ref) throw new Error(`ref ${ref} not found`)
    return refs[0]
  })
}

function createRef (ref, sha) {
  return exec(`git update-ref ${ref} ${sha} ""`)
}

function updateRef (ref, sha, force) {
  if (force) {
    return exec(`git update-ref ${ref} ${sha}`)
  } else {
    return getRef(ref).then((result) => {
      const current = result.object.sha
      return exec(`git merge-base ${sha} ${current}`).then((base) => {
        if (base.trim() !== current) {
          throw new Error('update is not a fast-forward')
        }
        return updateRef(ref, sha, true)
      })
    })
  }
}

function deleteRef (ref) {
  return getRef(ref).then((result) => {
    return exec(`git update-ref -d ${ref}`)
  })
}
