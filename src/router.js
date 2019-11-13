const Router = require('koa-router')
const kcompose = require('koa-compose')
const uuid = require('uuid/v1')
const db = require('./db')

const router = new Router()

router.get('/', async ctx => {
  ctx.body = `to upload a new paste:\n  your command | curl -F 'body=<-' ${process.env.APP_PATH}/`
})

router.get('/:id', async ctx => {
  const { id } = ctx.params
  try {
    const res = await db('pastes').select('body').where({ id })
    const body = res && res[0] && res[0].body
    if (body) {
      ctx.body = body
    } else {
      ctx.body = 'Not Found\n'
      ctx.status = 404
    }
  } catch (e) {
    ctx.body = e.message
  }
})

router.post('/', async ctx => {
  const { body } = ctx.request.body
  if (!body) {
    ctx.body = 'Missing "body" field'
    console.log(ctx.request)
    return
  }
  try {
    const id = uuid()
    await db('pastes').insert({ body, id })
    ctx.body = `${process.env.APP_PATH}/${id}\n`
    console.log(ctx.request)
  } catch (e) {
    ctx.body = e.message
  }
})

module.exports = kcompose([
  router.routes(),
  router.allowedMethods(),
])
