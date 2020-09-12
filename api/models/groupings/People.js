let People = sails.hooks.borm.bookshelf.model('people', {
    tableName: 'peoples',
    hasTimestamps: true,
    peopleable() {
        return this.morphTo('peopleable', ['peopleable_type', 'peopleable_id'], 'Book');
    }
});

module.exports = People;