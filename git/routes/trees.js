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
  createTreeValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.create(body).then(sha => {
      return commands.get(sha).then(tree => {
        res.json(tree)
      })
    }).catch(next)
  })
})

const createTreeValidator = Joi.object().keys({
  base_tree: Joi.string().regex(/^[0-9a-f]{40}$/),
  tree: Joi.array().items(Joi.object().keys({
    path: Joi.string().regex(/^[^\/\\]+$/).required(),
    mode: Joi.string().valid('100644', '100755', '040000', '160000', '120000').required(),
    type: Joi.string().valid('blob', 'tree', 'commit').required(),
    sha: Joi.string().regex(/^[0-9a-f]{40}$/),
    content: Joi.string()
  }).xor('content', 'sha')).required()
})
