const Router = require('express').Router
const commits = new Router()
const commands = require('../commands').commits
const bodyParser = require('body-parser')
const Joi = require('joi')

module.exports = commits

commits.get('/:sha', (req, res, next) => {
  const sha = req.params.sha
  commands.get(sha).then(data => {
    res.json(data).catch(next)
  })
})

commits.post('/', bodyParser.json())
commits.post('/', (req, res, next) => {
  createCommitValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.create(body).then(sha => {
      return commands.get(sha).then(data => {
        res.json(data)
      })
    }).catch(next)
  })
})

const createCommitValidator = Joi.object().keys({
  message: Joi.string().required(),
  tree: Joi.string().regex(/^[0-9a-f]{40}$/).required(),
  parents: Joi.array().items(
    Joi.string().regex(/^[0-9a-f]{40}$/)
  ).required(),
  author: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    date: Joi.string().isoDate().required()
  }),
  committer: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    date: Joi.string().isoDate().required()
  })
})
