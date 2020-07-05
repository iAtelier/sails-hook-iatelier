'use strict';

let Subtitle = sails.hooks.borm.bookshelf.model(
    'Subtitle', {
        tableName: 'subtitles',
        hasTimestamps: true,
        subtitleable() {
            return this.morphTo('subtitleable')
        }
});

module.exports = Subtitle;
