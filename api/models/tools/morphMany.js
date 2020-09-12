module.exports = async function (self, morph, morphable, pivotArgs = false) {
	
	const Model = sails.hooks.borm.bookshelf.model(morph);
			
	const ModelCollection = sails.hooks.borm.bookshelf.Collection.extend({
		model: Model
	});
	
	let type = self.virtuals.kind() + 's';

	let morphableTableName = morphable + 's';
	let morphableType = morphable + '_type';
	let morphableId = morphable + '_id';
	let morphId = morph + '_id';

	let arguments = {
		[morphableType]: type,
		[morphableId]: self.id,
	};

	if ( pivotArgs != false ) {
		arguments = Object.assign(arguments, pivotArgs);
	}

	return await sails.hooks.borm.bookshelf.knex(morphableTableName)
		.where(arguments)
		.select(morphId)
		.then( async function(idList) {
			let models = ModelCollection.forge();
			for (let value of idList ) {
				let m = await Model.forge({id: value[morphId] }).fetch().then( m => { return m; });
				models.add(m);
			}
			return models;
		});
}