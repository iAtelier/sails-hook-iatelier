exports.up = function(knex, Promise) {
    return knex.schema.createTable('subtitles', function(table) {
      table.increments()
      table.string('value')

      table.integer('subtitleable_id').notNullable()
      table.string('subtitleable_type').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('subtitles');
  }