'use strict';

let Cover = sails.hooks.borm.bookshelf.model(
    'Cover', {
        tableName: 'covers',
        hasTimestamps: true,
        coverable() {
            return this.morphTo('coverable')
        }
});

module.exports = Cover;
