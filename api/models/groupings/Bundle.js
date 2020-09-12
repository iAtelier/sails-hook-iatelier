let Book = require('../Book');

module.exports = sails.hooks.borm.bookshelf.model('bundle',
	sails.hooks.borm.bookshelf.model('Book').extend({
		tableName: 'bundles',
		hasTimestamps: true,
        virtuals: {
		},
    }, {
        DIMENSIONS: ['title', 'subtitle', 'description','slug', 'timestamp', 'cover'],
        // GROUPINGS: ['keyword?s', 'bundle?s', '?people']
    }),
);
