exports.up = ({ schema }, Promise) => schema.hasTable('pastes')
  .then(exists => {
    if (exists) return Promise.reject()
    return schema.createTable('pastes', t => {
      t.string('id').primary().unique()
      t.text('body')
      t.text('title').unique()
      t.text('key')
      t.text('expiration')
    })
  })

exports.down = ({ schema }) => schema.dropTable('pastes')
