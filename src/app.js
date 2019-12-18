// const crypto = require('crypto')
const uuid1 = require('uuid/v1')
const uuid4 = require('uuid/v4')
const moment = require('moment')
const db = require('./db')
const { appPath } = require('../config')

async function create({ body, title, expiration }) {
  if (! body) return { status: 'error', message: 'missing "body" field' }

  let expires = expiration
  if (expiration === 'never') {
    expires = null
  }

  if (expires) {
    if (! /^\d+ ?(years?|y|months?|M|weeks?|w|days?|d|hours?|h|minutes?|m|seconds?|s|milliseconds?|ms)$/.test(expiration)) {
      return { status: 'error', message: 'malformed expiration, must look like "1 day" or "6 weeks"' }
    }
    const [n, unit] = expires.match(/\d+|\w+/g)
    expires = Date.now() + moment.duration(Number(n), unit).asMilliseconds()
  }

  const id = uuid1()
  const key = uuid4()
  await db('pastes').insert({
    id,
    body,
    title,
    expiration: expires,
    key,
  })
  return {
    status: 'ok',
    url: `${appPath}/${id}`,
    key,
    expires: expires ? moment(expires).format() : undefined,
  }
}

async function read({ id }) {
  const [res] = await db('pastes')
    .select(['title', 'body'])
    .where({ id })
    .orWhere({ title: id })
  if (! res) return { status: 'error', message: 'not found' }
  return { status: 'ok', message: `${res.title ? ` title: ${res.title}\n---\n` : ''}${res.body}` }
}

async function update({ id, key, body, title }) {
  if (! key) return { status: 'error', message: 'missing key' }
  if (! (body || title)) return { status: 'error', message: 'missing body or title field' }
  const res = await db('pastes')
    .where({ id, key })
    .update({ body, title }, ['id', 'body', 'title'])
  if (res !== 1) return { status: 'error', message: 'no paste matching id and key' }
  return { status: 'ok', message: 'updated' }
}

async function del({ id, key }) {
  if (! key) return { status: 'error', message: 'missing key' }
  const res = await db('pastes')
    .where({ id, delete: key })
    .delete()
  if (! res) return { status: 'error', message: 'no paste matching id and key' }
  return { status: 'ok', message: 'deleted' }
}

module.exports = { create, read, update, del }
