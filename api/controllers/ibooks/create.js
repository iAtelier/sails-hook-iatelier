var v = require('voca');
// var bb = require('bluebird');
const http = require('http');
const formidable = require('formidable');

module.exports = {
	friendlyName: 'Create',
	description: 'Creates the book and stores all its dimensions and groupings',
	inputs: {
		book_type: {
			type: 'string',
		},
		title: {type: 'string'},
		subtitle: {type: 'string'},
		description: {type: 'string'},
		slug: {type: 'string'},
		content: {type: 'string'},
		timestamp: {type: ['ref']},
	},
	exits: {
		success: {
			responseType: 'redirect',
			// viewTemplatePath: 'vendors/iatelier/book/list'
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
		
		let book = await Model.forge({})
			.save()
			.tap(function(book) {
				book.saveDimensions(inputFields);
				book.saveContent(inputFields.content);
			});
		
		let uri = '/iatelier/' + inputs.book_type + '/' + book.get('id') + '/edit/';
		return exits.success(uri);
	}
};
