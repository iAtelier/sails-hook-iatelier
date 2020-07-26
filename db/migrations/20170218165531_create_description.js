exports.up = function(knex, Promise) {
    return knex.schema.createTable('descriptions', function(table) {
      table.increments()
      table.string('value')

      table.integer('descriptionable_id').notNullable()
      table.string('descriptionable_type').notNullable()
      
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('descriptions');
  }