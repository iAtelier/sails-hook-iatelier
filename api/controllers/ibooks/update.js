var v = require('voca');
const http = require('http');
const formidable = require('formidable');

module.exports = {
	friendlyName: 'Update',
	description: 'Updates whatever changes made to the book',
	inputs: {
		id: {
			type: 'number',
		},
		book_type: {
			type: 'string',
		},
		title: {type: 'string'},
		subtitle: {type: 'string'},
		description: {type: 'string'},
		slug: {type: 'string'},
		content: {type: 'string'},
		timestamp: {type: 'ref'},
	},
	exits: {
		success: {
			responseType: 'redirect'
			// responseType: 'view',
			// viewTemplatePath: 'vendors/iatelier/book/edit'
		}
	},
	fn: async function (inputs, exits) {
		
		const Model = sails.hooks.borm.bookshelf.model(v.capitalize(inputs.book_type));

		const form = formidable({ multiples: true });
		var inputFields = {}
		
		form.parse(this.req, (err, fields, files) => {
			if (err) {
			  next(err);
			  return;
			}
			inputFields = fields;
		});

		let book = await Model.forge({id: inputs.id})
			.fetch({withRelated: Model.DIMENSIONS})
			.tap(book => {
				book.reviseDimensions(inputFields);
				book.saveContent(inputFields.content);
				return book;
			});

		let uri = '/iatelier/' + inputs.book_type + '/' + book.get('id') + '/edit/';
		return exits.success(uri);
		// alternative success case
		// return exits.success({
		// 	book: book,
		// 	id: inputs.id,
		// 	book_type: inputs.book_type,
		// 	model: Model,
		// });
	}
};
