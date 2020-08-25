let Title = require('./dimensions/Title');
let Slug = require('./dimensions/Slug');
let Subtitle = require('./dimensions/Subtitle');
let Timestamp = require('./dimensions/Timestamp');
let Description = require('./dimensions/Description');
let Cover = require('./dimensions/Cover');

let Keyword = require('./groupings/Keyword');
let People = require('./groupings/People');

const v = require('voca');
const fs = require("fs");
var MarkdownIt = require('markdown-it');
const moment = require('moment');

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
			
			const Keyword = sails.hooks.borm.bookshelf.model('Keyword');
		
			let type = this.virtuals.kind() + 's';
		
			var getKeywords = async function(array) {
				const Model = sails.hooks.borm.bookshelf.model('Keyword');
				let keywords = {};
				for (const [id, value] of Object.entries(array) ) {
					keywords[id] = await Model.forge({id: value.keyword_id })
						.fetch()
						.then(model => { return model; });
				}
				return keywords;
			}
		
			let result = await sails.hooks.borm.bookshelf.knex('keywordables')
				.where({
					keywordable_type: type,
					keywordable_id: this.id,
				}).select('keyword_id').then(getKeywords);
			
			return result;
		},
		async bundle(type) {
			
			const Model = sails.hooks.borm.bookshelf.model('Bundle');
		
			let modelName = this.virtuals.kind() + 's';
		
			var getModels = async function(array) {
				const Model = sails.hooks.borm.bookshelf.model('Bundle');
				// const ModelSet = sails.hooks.borm.bookshelf.collection('BundleSet', {
				// 	model: Model
				// });
				// var models = new ModelSet();
				var models = [];
				for (const [id, value] of Object.entries(array) ) {
					let model = await Model.forge({id: value.bundle_id }).fetch().then(model => { return model; });
					if ( model.get('type') == type )
					{
						models.push(model);
					}
				}
				return models;
			}
		
			let result = await sails.hooks.borm.bookshelf.knex('bundleables')
				.where({
					bundleable_type: modelName,
					bundleable_id: this.id,
				}).select('bundle_id').then(getModels);
			
			return result;
		},
		async individuals(role) {
			
			// sails.log('starting to get individuals for the role: ', role);
			
			const Model = sails.hooks.borm.bookshelf.model('People');
			
			let modelName = this.virtuals.kind() + 's';
		
			var getModels = async function(array) {
				const Model = sails.hooks.borm.bookshelf.model('People');
				var models = [];
				// sails.log('our entry array is equal to: ', array);
				for (const [id, value] of Object.entries(array) ) {
					// sails.log('the id = ', id)
					// sails.log('the value = ', value)
					let model = await Model.forge({id: value.people_id }).fetch().then(model => { return model; });
					models.push(model);
				}
				return models;
			}
		
			let result = await sails.hooks.borm.bookshelf.knex('peopleables')
				.where({
					peopleable_type: modelName,
					peopleable_id: this.id,
					role: role
				}).select('people_id').then(getModels);
			
			return result;
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
			if ( !_.values(input).every(_.isEmpty) ) {
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
		reviseCover(input) {
			let file = (input.file) ? input.file : null,
				path = (input.path) ? input.path : null,
				illustrator = (input.illustrator) ? input.illustrator : null,
				link = (input.link) ? input.link : null;

			return this.load('cover').then(model => {
				model.related('cover').save({
					file: file,
					path: path,
					illustrator: illustrator,
					link: link
				});
				return model;
			});
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
			let md = new MarkdownIt(({html:true,}));
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
				var existingNodes = await this.individuals(role).then(models => { return models; });
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
						const People = sails.hooks.borm.bookshelf.model('People');
						
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

			this.syncIndividuals(inputs)
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
