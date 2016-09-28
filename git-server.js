const express = require('express')
const app = express()
const trees = require('./git/routes/trees')
const blobs = require('./git/routes/blobs')
const refs = require('./git/routes/refs')
const commits = require('./git/routes/commits')
const tags = require('./git/routes/tags')
const fs = require('fs')
var browserify = require('browserify')

app.use('/git/trees', trees)
app.use('/git/blobs', blobs)
app.use('/git/refs', refs)
app.use('/git/commits', commits)
app.use('/git/tags', tags)

app.get('/', (req, res) => {
  fs.createReadStream('./index.html').pipe(res)
})

app.get('/bundle.css', (req, res) => {
  fs.createReadStream('./app/main.css').pipe(res)
})

let cache = {}
app.get('/bundle.js', function (req, res, next) {
  var b = browserify({
    cache: cache
  })
  b.add('./app/index.js')
  b.transform('babelify', {presets: ['es2015', 'react']})
  b.bundle(function (err, bundle) {
    if (err) {
      console.error(err.message)
      res.writeHead(500)
      res.end(`<pre>${err.message}</pre>`)
      return
    }

    res.end(bundle)
  })
})

app.listen(3000)
