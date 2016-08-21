const Router = require('express').Router
const commands = require('../commands').trees
const bodyParser = require('body-parser')
const Joi = require('joi')
const trees = new Router()

module.exports = trees

trees.get('/:sha', (req, res, next) => {
  const sha = req.params.sha
  commands.get(sha).then(tree => {
    res.json(tree)
  }).catch(next)
})

trees.post('/', bodyParser.json())
trees.post('/', (req, res, next) => {
  createBlobValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.create(body.content).then(sha => {
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
