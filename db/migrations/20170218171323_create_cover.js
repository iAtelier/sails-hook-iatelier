exports.up = function(knex, Promise) {
    return knex.schema.createTable('covers', function(table) {
      table.increments()
      table.string('name')

      table.string('path')
      table.string('file')
      table.string('illustrator')
      table.string('link')

      table.integer('coverable_id').notNullable()
      table.string('coverable_type').notNullable()

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('covers');
  }