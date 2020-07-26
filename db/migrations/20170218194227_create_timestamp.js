exports.up = function(knex, Promise) {
    return knex.schema.createTable('timestamps', function(table) {
      
      table.increments()
      table.timestamp('draft')
      table.timestamp('publish')
      table.timestamp('amend')

      table.integer('timestampable_id').notNullable()
      table.string('timestampable_type').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('timestamps');
  }