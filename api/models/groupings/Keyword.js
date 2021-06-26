
let Keyword = sails.hooks.borm.bookshelf.model('keyword', {
    tableName: 'keywords',
    hasTimestamps: true,
    keywordable() {
        return this.morphTo('keywordable', ['keywordable_type', 'keywordable_id'], 'Post', 'Book', 'Stuff');
    }
});

module.exports = Keyword;
