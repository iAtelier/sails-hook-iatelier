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

		const bundleModel = sails.hooks.borm.bookshelf.model('bundle');

		let atelier = {
			bundle: {}
		}

		for (let type in Model.GROUPINGS.bundle) {
			atelier.bundle[type] = await bundleModel.where({type: type})
				.fetchAll({withRelated: bundleModel.DIMENSIONS})
				.then(models => { return models; });
		}

		let book = await Model.forge({id: inputs.id})
			.fetch({withRelated: Model.DIMENSIONS})
			.then(model => { return model; });

		book.keyword = await book.keywords().then(r => {return r;})

		for (let type in Model.GROUPINGS.bundle) {
			book.bundle[type] = await book.bundle(type).then(r => {
				return r
					//.first()
					//.fetch({withRelated: bundleModel.DIMENSIONS})
					//.then(r => {return r;})
					;
			})
		}

		for (let role in Model.GROUPINGS.people) {

			let individuals = await book.people(role).then(r => {return r;});

			book.people[role] = individuals;
		}
		
		return exits.success({
			book: book,
			id: inputs.id,
			book_type: inputs.book_type,
			model: Model,
			atelier: atelier,
		});
	}
};
