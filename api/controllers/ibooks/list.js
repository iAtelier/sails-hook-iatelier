var v = require('voca');

module.exports = {
    friendlyName: 'List',
    description: 'Displays a list of published books.',
    inputs: {
        book_type: {
            type: 'string',
        },
    },
    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'vendors/iatelier/book/list'
        }
    },
    fn: async function (inputs, exits) {
        const Model = sails.hooks.borm.bookshelf.model(v.capitalize(inputs.book_type));
        let books = await Model.fetchAll({withRelated: Model.DIMENSIONS});
        return exits.success({
            books: books,
            book_type: inputs.book_type,
        });
    }
};