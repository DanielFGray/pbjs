const Router = require('koa-router')
const kcompose = require('koa-compose')
const uuid = require('uuid/v1')
const db = require('./db')

const router = new Router()

router.get('/:id', async ctx => {
  const { id } = ctx.params
  try {
    const [{ body }] = await db('pastes').select('body').where({ id })
    if (body) {
      ctx.body = body
    }
  } catch (e) {
    ctx.body = e.message
  }
})

router.post('/', async ctx => {
  const { body } = ctx.request.body
  if (!body) {
    ctx.body = 'Missing "body" field'
    return
  }
  try {
    const id = uuid()
    await db('pastes').insert({ body, id })
    ctx.body = id
  } catch (e) {
    ctx.body = e.message
  }
})

module.exports = kcompose([
  router.routes(),
  router.allowedMethods(),
])
