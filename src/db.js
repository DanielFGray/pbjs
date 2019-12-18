const knex = require('knex')
const config = require('../knexfile.js')

const { NODE_ENV } = process.env

module.exports = knex(config[NODE_ENV])
