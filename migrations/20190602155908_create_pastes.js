exports.up = ({ schema }) => schema.hasTable('pastes')
  .then(exists => {
    if (!exists) {
      return schema.createTable('pastes', t => {
        t.string('id').primary().unique()
        t.text('body')
      })
    }
  })

exports.down = ({ schema }) => schema.dropTable('pastes')
