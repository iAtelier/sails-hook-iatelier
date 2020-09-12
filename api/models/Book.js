let Title = require('./dimensions/Title');
let Slug = require('./dimensions/Slug');
let Subtitle = require('./dimensions/Subtitle');
let Timestamp = require('./dimensions/Timestamp');
let Description = require('./dimensions/Description');
let Cover = require('./dimensions/Cover');

let People = require('./groupings/People');

const v = require('voca');
const fs = require("fs");
var MarkdownIt = require('markdown-it');
const moment = require('moment');
const { result } = require('lodash');

var morphedByMany = require('./tools/morphMany.js');
var syncBundles = require('./tools/syncBundles.js');
var syncKeywords = require('./tools/syncKeywords.js');

var Book = sails.hooks.borm.bookshelf.model(
	'Book',
	{
		// FAILED TRIALS
		// virtuals: {
		// 	type: function() {
		// 		console.log('writing down the name');
		// 		console.log(this);
		// 		return this.constructor.name;
		// 	}
		// },


		// prototypeProperties [ojbect]: Instance methods and properties to be attached to instances of the new class.

		// below is the example from the official Guide.api
		// located at: https://bookshelfjs.org/api.html#Model-static-extend

		initialize() {
			// this.constructor.__super__.initialize.apply(this, arguments)

			// this.on('saved', function (model) {
			//     if (model.related('title').hasChaned()) {
			//         return model.related('title').save();
			//     }
			// });

			// Setting up a listener for the 'saving' event
			// this.on('saving', this.validateSave)
		},
		// validateSave() {
		//     return doValidation(this.attributes)
		// },

		// BASE ATTRIBUTES
		hasTimestamps: true,

		// DIMENSIONS
		title() {
			return this.morphOne('Title', 'titleable', ['titleable_type', 'titleable_id'])
		},
		subtitle() {
			return this.morphOne('Subtitle', 'subtitleable', ['subtitleable_type', 'subtitleable_id'])
		},
		slug() {
			return this.morphOne('Slug', 'slugable', ['slugable_type', 'slugable_id'])
		},
		timestamp() {
			// Defining a relation with the Account model
			return this.morphOne('Timestamp', 'timestampable', ['timestampable_type', 'timestampable_id'])
		},
		description() {
			return this.morphOne('Description', 'descriptionable', ['descriptionable_type', 'descriptionable_id'])
		},
		cover() {
			// Defining a relation with the Account model
			return this.morphOne('Cover', 'coverable', ['coverable_type', 'coverable_id'])
		},
		async keywords() {
			return morphedByMany(this, 'keyword', 'keywordable');
		},
		async bundle(type) {
			const Model = sails.hooks.borm.bookshelf.model('bundle');

			let bundles = await morphedByMany(this, 'bundle', 'bundleable');

			return bundles.find(function(item) { return (item.get('type') == type ) });;
		},
		async people(role) {

			const Model = sails.hooks.borm.bookshelf.model('people');

			let roles = await morphedByMany(this, 'people', 'peopleable', {role: role});
			
			return roles;
		},
		setupTitle(input) {
			if (input) {
				return this.title().save({value: input});
			} else {
				return this;
			}
		},
		reviseTitle(input) {
			return this.load('title').then(model => {
				model.related('title').save({value: input});
				return model;
			});
		},

		setupSlug(input) {
			if (input) {
				return this.slug().save({value: input});
			} else {
				return this;
			}
		},
		reviseSlug(input) {
			return this.load('slug').then(model => {
				model.related('slug').save({value: input});
				return model;
			});
		},

		setupSubtitle(input) {
			if (input) {
				return this.subtitle().save({value: input});
			} else {
				return this;
			}
		},
		reviseSubtitle(input) {
			return this.load('subtitle').then(model => {
				model.related('subtitle').save({value: input});
				return model;
			});
		},

		setupDescription(input) {
			if (input) {
				return this.description().save({value: input});
			} else {
				return this;
			}
		},
		reviseDescription(input) {
			return this.load('description').then(model => {
				model.related('description').save({value: input});
				return model;
			});
		},

		setupTimestamp(input) {
			if ( !_.values(input).every(_.isEmpty) ) {
				let draft = (input.draft) ? moment(input.draft).format("YYYY-MM-DD HH:mm:ss") : null;
				let publish = (input.publish) ? moment(input.publish).format("YYYY-MM-DD HH:mm:ss") : null;
				let amend = (input.amend) ? moment(input.amend).format("YYYY-MM-DD HH:mm:ss") : null;
	
				if (input) {
					return this.timestamp().save({
						draft: draft,
						publish: publish,
						amend: amend,
					});
				} else {
					return this;
				}
			}
		},
		reviseTimestamp(input) {

			let draft = (input.draft) ? moment(input.draft).format("YYYY-MM-DD HH:mm:ss") : null;
			let publish = (input.publish) ? moment(input.publish).format("YYYY-MM-DD HH:mm:ss") : null;
			let amend = (input.amend) ? moment(input.amend).format("YYYY-MM-DD HH:mm:ss") : null;

			return this.load('timestamp').then(model => {
				model.related('timestamp').save({
					draft: draft,
					publish: publish,
					amend: amend,
				});
				return model;
			});
		},

		setupCover(input) {
			if ( !_.values(input).every( v => { _.isEmpty(v)} ) ) {
				let file = (input.file) ? input.file : null,
					path = (input.path) ? input.path : null,
					illustrator = (input.illustrator) ? input.illustrator : null,
					link = (input.link) ? input.link : null;
				return this.cover().save({
					path: path,
					file: file,
					illustrator: illustrator,
					link: link
				});
			} else {
				return this;
			}
		},
		async reviseCover(input) {
			if ( !_.values(input).every( v => { return _.isEmpty(v) } ) ) {
				sails.log('baby we are doing it!')
				let file = (input.file) ? input.file : null,
					path = (input.path) ? input.path : null,
					illustrator = (input.illustrator) ? input.illustrator : null,
					link = (input.link) ? input.link : null;
				return this.cover().save({
					path: path,
					file: file,
					illustrator: illustrator,
					link: link
				});
			} else if ( _.values(input).every( v => { sails.log('2: the value = ', v); return _.isEmpty(v)} ) && this.cover() ) {
				let cover = await this.cover().fetch().then( r => { return r; } );
				sails.log('deleting the thing!')
				return cover.destroy().then( r => { sails.log('deleted!'); return r; })
			}
			else {
				return this;
			}
		},

		contentRaw() {
			let path = './storage/ibooks/' + this.tableName + '/' + this.id + '/main.md';
			if ( fs.existsSync(path) ) {
				return fs.readFileSync(path, 'utf8');
			} else {
				return null;
			}
		},
		content() {
			let md = new MarkdownIt(({html:true,}))
				.use(require('markdown-it-footnote'));;
			let content = this.contentRaw();
			if ( content ) {
				return md.render(content);
			} else {
				return '';
			}
		},
		saveContent(input) {
			dir = './storage/ibooks/' + this.tableName + '/' + this.id;
			if (!fs.existsSync(dir)){
				fs.mkdirSync(dir);
			}
			path = dir + '/main.md';
			fs.writeFile(path, input, function (err) {
				if (err) throw err;
			});
		},

		assetFile(assetName) {
			let r = null,
				dir = process.cwd() + '/storage/ibooks/' + this.tableName + '/' + this.id + '/' + assetName;
			if ( fs.existsSync(dir)) {
				return dir;
			}
			return r;
		},

		async syncKeywords(input) {
			let keywords = input.keywords.split(", ");
			sails.log('what are our keywords = ', keywords)
			syncKeywords(this, keywords);
		},
		async syncBundles(input) {
			let modelName = this.virtuals.kind() + 's';
			let bundles = input.bundles;
			
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
		},

		async syncIndividuals(input) {

			let modelName = this.virtuals.kind() + 's';
			sails.log('syncing people for ', modelName);

			let roles = input.people;
			sails.log('people we have', roles);

			for (const [role, individualsList] of Object.entries(roles)) {
				
				// creating the list of individuals based on the input
				let individuals = individualsList.split(", ");
				sails.log('array of input = ', individuals);
				
				// Deleting the nodes that exit in our database but weren't resent by iAteler
				sails.log('checking for nodes to delete!')
				var existingNodes = await this.people(role).then(r => {return r;});
				for (const node of existingNodes) {
					var toDelete = true;
					for (const individual of individuals) {
						if (node.get('identifier') == individual) { toDelete = false; }
					}
					if (toDelete) {
						sails.log('trying to delete the node with the id ', node.id)
						sails.hooks.borm.bookshelf.knex('peopleables').del().where({
							role: role,
							peopleable_id: this.id,
							peopleable_type: modelName,
							people_id: node.id
						})
							.then((node) => { sails.log('deleted!'); })
							.catch((e) => { sails.log("couldn't delete!"); })
					}
				}

				// Creating new nodes
				for (const individual of individuals) {
					let exists = false;
					sails.log('checking existing nodes for existing record')
					for (const node of existingNodes) {
						sails.log('checking the node = ', node.get('identifier'));
						if ( node.get('identifier') == individual ) {
							exists = true;
						}
					}
					if ( !exists ) {
						sails.log('syncing the individual = ', individual)
						const People = sails.hooks.borm.bookshelf.model('people');
						
						// retriving if a record existing in our database
						person = await People.where({'identifier': individual}).fetch()
							.then((model) => { return model})
							.catch((e) => { 
								// otherwise creating a new record and returning it
								let newPerson = People.forge({identifier: individual}).save();
								return newPerson; 
							});
						sails.log('the model we are working on is ', person);

						sails.log('here is the model we created: ', role, person.id, modelName, this.id)
						await sails.hooks.borm.bookshelf.knex('peopleables').insert({
							role: role,
							people_id: person.id,
							peopleable_type: modelName,
							peopleable_id: this.id,
							created_at: require('moment')().format('YYYY-MM-DD HH:mm:ss'),
							updated_at: require('moment')().format('YYYY-MM-DD HH:mm:ss')
						}).then(() => {
							sails.log('inserted the record')
						});
					}
				};

			}
		},


		// production utils
		saveDimensions(inputs) {
			for (const dimension of this.constructor.DIMENSIONS) {
				let functionName = 'setup' + v.capitalize(dimension);
				this[functionName](inputs[dimension]);
			}
		},
		reviseDimensions(inputs) {
			for (const dimension of this.constructor.DIMENSIONS) {
				let functionName = 'revise' + v.capitalize(dimension);
				console.log('the dimension we are updating is ' + dimension + ' =');
				console.log(inputs[dimension])
				this[functionName](inputs[dimension]);
			}

			// this.syncIndividuals(inputs)
			// this.syncBundles(inputs)
			this.syncKeywords(inputs)
		}
	},
	{
		DIMENSIONS: [],
		GROUPINGS: {}
		// classProperties [object]: Class (i.e. static) functions and properties to be attached to the constructor of the new class.

		// below is the example from the official Guide.api
		// located at: https://bookshelfjs.org/api.html#Model-static-extend

		// login: Promise.method(function(email, password) {
		//     if (!email || !password)
		//         throw new Error('Email and password are both required')
		//         return new this({email: email.toLowerCase()})
		//     .fetch()
		//     .tap(function(customer) {
		//     if (!compare(password, customer.get('password'))
		//         throw new Error('Invalid password')
		//     })
		// })
	}
);
