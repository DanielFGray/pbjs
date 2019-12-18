require('dotenv/config')
const Koa = require('koa')
const helmet = require('koa-helmet')
const kbody = require('koa-body')
const router = require('./router')
const scheduler = require('./scheduler')

const { HOST, PORT, APP_PATH } = process.env
// const prettyjson = require('prettyjson')

process.on('uncaughtException', e => {
  console.error(e.message)
  process.exit(1)
})

new Koa()

  .use(helmet())

  .use(kbody({
    multipart: true,
    formLimit: '4mb',
    textLimit: '4mb',
    jsonLimit: '4mb',
  }))

  .use(async function logErrors(ctx, next) {
    try {
      await next()
    } catch (e) {
      console.error(e)
      ctx.status = 500
      ctx.body = 'Internal Server Error'
    }
  })

  .use(async function logger(ctx, next) {
    const start = Date.now()
    if (Object.keys(ctx.request.body).length) {
      console.log(ctx.request.body)
    }
    await next()
    const time = `${Date.now() - start}ms`
    console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${time}`)
  })


  .use(router)

  .listen(PORT, HOST, () => {
    console.log(`server running at ${APP_PATH}`)
    scheduler.start()
  })
