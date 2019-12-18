const { HOST: host = 'localhost' } = process.env
const { PORT: port = 3000 } = process.env
const { APP_PATH: appPath = `http://${host}:${port}` } = process.env

module.exports = {
  host,
  port,
  appPath,
}
