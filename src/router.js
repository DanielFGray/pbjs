const Router = require('koa-router')
const kcompose = require('koa-compose')
const app = require('./app')

const { APP_PATH } = process.env

const router = new Router()

router.get('/', ctx => {
  ctx.body = `to upload a new paste:\n\nyour command | curl -F 'body=<-' ${APP_PATH}/\n`
})

router.post('/', async ctx => {
  const { body, title, expiration } = ctx.request.body
  const res = await app.create({
    body,
    title,
    expiration,
  })
  if (res.status === 'error') ctx.status = 400
  ctx.body = res
})

router.get('/:id', async ctx => {
  const { id } = ctx.params
  const res = await app.read({ id })
  if (res.status === 'error') ctx.status = 404
  ctx.body = res
})

router.patch('/:id/:key', async ctx => {
  const { id, key } = ctx.params
  const { body, title } = ctx.request.body
  const res = await app.update({ id, key, body, title })
  if (res.status === 'error') ctx.status = 400
  ctx.body = res
})

router.delete('/:id/:key', async ctx => {
  const { id, key } = ctx.params
  const res = await app.del({ id, key })
  if (res.status === 'error') ctx.status = 400
  ctx.body = res
})

module.exports = kcompose([
  router.routes(),
  router.allowedMethods(),
])
