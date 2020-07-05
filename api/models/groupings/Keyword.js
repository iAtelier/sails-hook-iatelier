
let Keyword = sails.hooks.borm.bookshelf.model('Keyword', {
    tableName: 'keywords',
    hasTimestamps: true,
    keywordable() {
        return this.morphTo('keywordable', ['keywordable_type', 'keywordable_id'], 'Post', 'Book');
    }
});

module.exports = Keyword;