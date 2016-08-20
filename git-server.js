const express = require('express')
const app = express()
const trees = require('./git/trees')
const blobs = require('./git/blobs')
const refs = require('./git/refs')
const commits = require('./git/commits')
const tags = require('./git/tags')


app.use('/git/trees', trees)
app.use('/git/blobs', blobs)
app.use('/git/refs', refs)
app.use('/git/commits', commits)
app.use('/git/tags', tags)

app.listen(3000)
