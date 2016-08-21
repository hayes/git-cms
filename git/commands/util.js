const childProcess = require('child_process')
const spawn = require('child_process').spawn

module.exports = {
  exec: exec,
  write: write
}

function exec (command, options) {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, options || {}, (err, stdout, stderr) => {
      if (err) {
        console.log(stdout)
        console.error(stderr)
        return reject(err)
      }
      resolve(stdout)
    })
  })
}

function write (command, args, content, encoding) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args)
    const stdout = []
    const stderr = []
    child.stdin.end(content, encoding)
    child.stdout.on('data', data => stdout.push(data))
    child.stderr.on('data', data => stderr.push(data))
    child.on('error', reject)
    child.on('exit', code => {
      const out = Buffer.concat(stdout).toString()
      const err = Buffer.concat(stderr).toString()
      if (code) return reject(new Error(out + err))
      resolve(out)
    })
  })
}
