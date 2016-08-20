const Router = require('express').Router
const commands = require('./commands')
const refs = new Router()
const Joi = require('joi')
const bodyParser = require('body-parser')

module.exports = refs

refs.get('/', (req, res, next) => {
  commands.getAllRefs().then(refs => {
    res.json(refs)
  }).catch(next)
})

refs.get(/(.+)/, (req, res, next) => {
  const ref = 'refs' + req.params[0]
  commands.getAllRefs(ref).then(refs => {
    if (res.length !== 1 || refs[0].ref !== ref) return res.json(refs)
    res.json(refs[0])
  }).catch(next)
})

refs.put('/', bodyParser.json())
refs.put('/', (req, res, next) => {
  createRefValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.createRef(body.ref, body.sha).then((foo) => {
      res.json(body)
    }).catch(next)
  })
})

refs.patch(/(.+)/, bodyParser.json())
refs.patch(/(.+)/, (req, res, next) => {
  const ref = 'refs' + req.params[0]
  updateRefValidator.validate(req.body, (err, body) => {
    if (err) return next(err)
    commands.updateRef(ref, body.sha, !!body.force).then((foo) => {
      res.json(body)
    }).catch(next)
  })
})

const createRefValidator = Joi.object().keys({
  ref: Joi.string().regex(/^\S+$/).required(),
  sha: Joi.string().regex(/^[0-9a-f]{40}$/).required()
})

const updateRefValidator = Joi.object().keys({
  sha: Joi.string().regex(/^[0-9a-f]{40}$/).required(),
  force: Joi.boolean()
})
