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
const deleteExtras = async function (self, truthSource) {
	console.log('our source of truth is', truthSource)
	let nodes = await sails.hooks.borm.bookshelf.knex('bundleables').where({
		bundleable_type: modelName,
		bundleable_id: self.id,
	})
	.then((r) => { return r; })
	.catch((e) => { sails.log(e)})
	for (const node of nodes) {
		sails.log('this is OUR NODE', node)
		let check = node.bundle_id;
		if ( !truthSource.includes(node.bundle_id) ) {
			sails.log(node.bundle_id)
			sails.hooks.borm.bookshelf.knex('bundleables').del().where({
				id: node.id
			})
				.then((node) => { sails.log('deleted!'); })
				.catch((e) => { sails.log("couldn't delete!"); })
		}
	}
}

module.exports = async function (input) {
	
	let modelName = this.virtuals.kind() + 's';
	let bundles = input.bundles;
	
	let mockBundles = [];
	
	for (const [type, node] of Object.entries(bundles)) {
		sails.log('here is the bundle input we are going through = ', type, node)
		let currentBundle = await this.bundle(type).then(r => { return r; }).catch(e => { return null; })
		if ( currentBundle) {
			sails.log('here is our current bundle = ', currentBundle)
			if (currentBundle.id == node ) {
				sails.log('Bundle-node with the id _ already exists.', node)
				mockBundles.push(Number(node));
			} else if (node) {
				currentBundle = await sails.hooks.borm.bookshelf.knex('bundleables')
				.where({
					bundle_id: currentBundle.id,
					bundleable_type: modelName,
					bundleable_id: this.id,
				}).update({
					bundle_id: node,
					updated_at: require('moment')().format('YYYY-MM-DD HH:mm:ss')
				})
					.then((r) => { sails.log("updated the bundle-node"); return r; })
					.catch((e) => { sails.log("couldn't update"); })
				mockBundles.push(Number(node));
			}
		} else if (node) {
			sails.log('creating the node for bundle = ', node);
			currentBundle = await sails.hooks.borm.bookshelf.knex('bundleables').insert({
				bundle_id: node,
				bundleable_type: modelName,
				bundleable_id: this.id,
				created_at: require('moment')().format('YYYY-MM-DD HH:mm:ss'),
				updated_at: require('moment')().format('YYYY-MM-DD HH:mm:ss')
			}).then((r) => {
				sails.log('inserted the record')
				return r;
			});
			mockBundles.push(Number(node));
		}
	}
	deleteExtras(this,mockBundles)
}