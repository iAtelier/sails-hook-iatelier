// user.js
'use strict';

let Title = sails.hooks.borm.bookshelf.model('Title', {
    tableName: 'titles',
    hasTimestamps: true,
    titleable() {
        return this.morphTo('titleable')
    }
});

module.exports = Title;
