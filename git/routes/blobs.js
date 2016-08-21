const Router = require('express').Router
const blobs = new Router()
const commands = require('../commands').blobs
const bodyParser = require('body-parser')
const Joi = require('joi')

blobs.get('/:sha', (req, res, next) => {
  const sha = req.params.sha
  commands.get(sha).then(data => {
    res.json({
      content: data.toString('base64'),
      encoding: 'base64',
      sha: sha,
      size: data.length
    })
  }).catch(next)
})

blobs.post('/', bodyParser.json())
blobs.post('/', (req, res, next) => {
  createBlobValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.create(body.content, body.encoding === 'base64' ? 'base64' : 'utf8').then(sha => {
      res.json({
        sha: sha
      })
    }).catch(next)
  })
})

const createBlobValidator = Joi.object().keys({
  content: Joi.string().required(),
  encoding: Joi.string().required().valid('base64').valid('utf-8')
})

module.exports = blobs
