var v = require('voca');

module.exports = {
    friendlyName: 'New Book',
    description: 'Displays the page for creating a new book.',
    inputs: {
        book_type: {
            type: 'string',
        },
    },
    exits: {
        success: {
            responseType: 'view',
            viewTemplatePath: 'vendors/iatelier/book/new'
        }
    },
    fn: async function (inputs, exits) {
        
        const Model = sails.hooks.borm.bookshelf.model(v.capitalize(inputs.book_type));
        let book = new Model;

        return exits.success({
            book_type: inputs.book_type,
            book: book,
            model: Model,
        });
    }
};
