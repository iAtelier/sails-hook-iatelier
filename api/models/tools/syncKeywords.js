let Keyword = require('../groupings/Keyword');

const unsync = function (self, ids) {
	for ( const id of ids ) {
		sails.hooks.borm.bookshelf.knex('bundleables').del().where({
			bundleable_id: self.id,
			bundleable_type: modelName,
			bundle_id: id
		})
			.then((node) => { sails.log('deleted!'); })
			.catch((e) => { sails.log("couldn't delete!"); })
	}
}
const fetchWord = function(word) {
	const Keyword = sails.hooks.borm.bookshelf.model('keyword');
	return 

}

module.exports = async function (self, inputs) {

	sails.log('setting up the Keyword syncing business', inputs)

	const Keyword = sails.hooks.borm.bookshelf.model('keyword');
	
	let modelName = self.virtuals.kind() + 's';
	
	let mockBundles = [];

	const deleteExtras = async function (self, truthSource) {
	
		// console.log('our source of truth is', truthSource)
		let nodes = await sails.hooks.borm.bookshelf.knex('keywordables').where({
				keywordable_type: modelName,
				keywordable_id: self.id,
			})
			.then( (r) => { sails.log('then'); return r; } )
			.catch( (e) => { sails.log('error', e); } );
	
		for (const node of nodes) {
			// sails.log('this is OUR NODE', node)
			
			let check = node.keyword_id;
			if ( !truthSource.includes(node.keyword_id) ) {
				// sails.log(node.keyword_id)
				
				sails.hooks.borm.bookshelf.knex('keywordables').del().where({
						id: node.id
					})
					.then((node) => { sails.log('deleted!'); })
					.catch((e) => { sails.log("couldn't delete!"); })
			}
		}
	}
	
	let existingNodes = await self.keywords()
		.then( r => { sails.log('we got the nodes'); return r; } )
		.catch( e => { sails.log('error', e); } );

	existingNodes = existingNodes.pluck('word');
	sails.log('existing array of keywords = ', existingNodes)

	for ( const word of inputs ) {

		sails.log('here is the Keyword input we are going through = ', word)
		
		let keyword = await Keyword.where({'word': word}).fetch()
			.then( r => { return r; } )
			.catch( r => { return false; } );
		sails.log('keyword = ', keyword)

		if ( !keyword ) {
			sails.log('keyword did not exist!')
			keyword = await Keyword.forge({ word: word }).save()
				.then( r => { return r; } );
				// .fetch( e => { sails.log(e); return e; } );
			sails.log('created the keyword = ', keyword)
		}

		// let check = await existingNodes.where({'word': word}).fetch()
		// 	.then( r => { return r; } )
		// 	.catch( e => { sails.log('error = ', e); return false; } );
		// sails.log('existing keywords = ', check)

		if ( existingNodes.includes(word) )
		{
			sails.log('node existed, just addinging to the mock array')
			mockBundles.push(Number(keyword.id));
		} else {
			sails.log('creating the node')
			await sails.hooks.borm.bookshelf.knex('keywordables').insert({
					keyword_id: keyword.id,
					keywordable_type: modelName,
					keywordable_id: self.id,
					created_at: require('moment')().format('YYYY-MM-DD HH:mm:ss'),
					updated_at: require('moment')().format('YYYY-MM-DD HH:mm:ss')
				})
				.then((r) => {
					// sails.log('inserted the record')
					return r;
				})
				// .fetch( (e) => {
				// 	sails.log('here is our error: ', e);
				// });
			mockBundles.push(Number(keyword.id));
		}
	}
	deleteExtras(self, mockBundles)
}