var v = require('voca');

module.exports = {
	friendlyName: 'Edit Book',
	description: 'Displays the page for editing the book.',
	inputs: {
		id: {
			type: 'number',
		},
		book_type: {
			type: 'string',
		},
	},
	exits: {
		success: {
			responseType: 'view',
			viewTemplatePath: 'vendors/iatelier/book/edit'
		}
	},
	fn: async function (inputs, exits) {
		
		const Model = sails.hooks.borm.bookshelf.model(v.capitalize(inputs.book_type));

		let book = await Model.forge({id: inputs.id})
			.fetch({withRelated: Model.DIMENSIONS})
			.then(model => { return model; });
		
		return exits.success({
			book: book,
			id: inputs.id,
			book_type: inputs.book_type,
			model: Model,
		});
	}
};
