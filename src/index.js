const Koa = require('koa')
const kbody = require('koa-body')
const router = require('./router')

const { HOST, PORT } = process.env

process.on('uncaughtException', e => {
  console.error(e.message)
  process.exit(1)
})

if (! HOST) throw new Error('must define a HOST env variable')
if (! PORT) throw new Error('must define a PORT env variable')

const app = new Koa()

app.use(kbody())
app.use(router)

app.listen(PORT, HOST, () => {
  console.log('server running')
})
