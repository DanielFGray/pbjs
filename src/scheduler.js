const moment = require('moment')
const db = require('./db')

const deleteExpired = async () => {
  const n = await db('pastes')
    .delete()
    .where('expiration', '<', Date.now())
  if (n > 0) {
    console.log(`${n} expired paste${n !== 1 ? 's' : ''} deleted`)
  }
}

function pollDeleteExpired() {
  setTimeout(async () => {
    await deleteExpired()
    pollDeleteExpired()
  }, moment.duration(1, 'day').asMilliseconds())
}

module.exports = {
  start() {
    console.log('starting scheduler')
    pollDeleteExpired()
  },
}
