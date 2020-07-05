'use strict';

let Slug = sails.hooks.borm.bookshelf.model(
    'Slug', {
        tableName: 'slugs',
        hasTimestamps: true,
        slugable() {
            return this.morphTo('slugable')
        }
});

module.exports = Slug;
