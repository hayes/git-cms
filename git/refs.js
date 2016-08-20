const Router = require('express').Router
const refs = new Router()
const childProcess = require('child_process')

const refRegexp = /\s*(\S+)/

childProcess.exec('git branch -a', (err, stdout) => {
  if (err) throw err
  stdout.split('\n')
    .forEach(ref => console.log(ref))
    // .map(line => line.match(refRegexp))
    // .forEach(ref => console.log(ref))
})

module.exports = refs
