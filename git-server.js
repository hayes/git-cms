const express = require('express')
const app = express()
const trees = require('./git/routes/trees')
const blobs = require('./git/routes/blobs')
const refs = require('./git/routes/refs')
const commits = require('./git/routes/commits')
const tags = require('./git/routes/tags')


app.use('/git/trees', trees)
app.use('/git/blobs', blobs)
app.use('/git/refs', refs)
app.use('/git/commits', commits)
app.use('/git/tags', tags)

app.listen(3000)
