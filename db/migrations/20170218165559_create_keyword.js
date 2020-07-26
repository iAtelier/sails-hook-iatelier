exports.up = function(knex, Promise) {
    return knex.schema.createTable('keywords', function(table) {
      table.increments()
      table.string('word')

      table.integer('keywordable_id').notNullable()
      table.string('keywordable_type').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('keywords');
  }
