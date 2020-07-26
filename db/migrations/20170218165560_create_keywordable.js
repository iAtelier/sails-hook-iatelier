exports.up = function(knex, Promise) {
    return knex.schema.createTable('keywordables', function(table) {
      table.increments()

      table.integer('keyword_id').unsigned()
      table.foreign('keyword_id').references('keywords.id')
      table.foreign('keywordable_id')
      table.string('keywordable_type').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('keywordables');
  }
