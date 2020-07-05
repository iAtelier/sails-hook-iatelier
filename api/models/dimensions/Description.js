'use strict';

let Description = sails.hooks.borm.bookshelf.model(
    'Description', {
        tableName: 'descriptions',
        hasTimestamps: true,
        descriptionable() {
            return this.morphTo('descriptionable')
        }
});

module.exports = Description;
