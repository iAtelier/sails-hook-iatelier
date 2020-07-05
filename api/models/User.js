var bcrypt = require('bcrypt');

function hashPassword(values, next) {
	bcrypt.hash(values.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		values.password = hash;
		next();
	});
}

module.exports = sails.hooks.borm.bookshelf.Model.extend({
	tableName: 'users',
	initialize: function() {
	  this.on('creating', this.encryptPassword);
	},
	hasTimestamps: true,
	encryptPassword:(model, attrs, options) => {
	  return new Promise((resolve, reject) => {
		bcrypt.hash(model.attributes.password, 10, (err, hash) => {
		  if (err) return reject(err);
		  model.set('password', hash);
		  resolve(hash);
		});
	  });
	},
	validatePassword: function(password) {
		let self = this;
		return new Promise(function(resolve, reject) {
			const hash = self.get('password');
		  	bcrypt.compare(password, hash, (err, res) => {
				if (err) {
					return reject(err);
				}
				return resolve(res);
		  	});
		});
	},
	// validatePassword: function(password, callback) {
	// 	const hash = this.get('password');
	// 	if (callback) {
	// 		//callback (err, res)
	// 		return bcrypt.compare(password, hash, callback);
	// 	}
	// 	return bcrypt.compareSync(password, hash);
	// }
	// validatePassword: function(suppliedPassword) {
	//   let self = this;
	//   return new Promise(function(resolve, reject) {
	// 	const hash = self.attributes.password;
	// 	bcrypt.compare(suppliedPassword, hash, (err, res) => {
	// 	  if (err) return reject(err);
	// 	  return resolve(res);
	// 	});
	//   });
	// }
  });


// module.exports = {
// 	attributes: {
// 		username: {
// 			type: 'STRING',
// 			required: true,
// 			unique: true
// 		},
// 		password: {
// 			type: 'STRING',
// 			required: true,
// 			minLength: 6
// 		},
// 		email: {
// 			type: 'email',
// 			required: true,
// 			unique: true
// 		},
// 		// Override toJSON instance method to remove password value
// 		toJSON: function() {
// 			var obj = this.toObject();
// 			delete obj.password;
// 			return obj;
// 		},
// 		validPassword: function(password, callback) {
// 			var obj = this.toObject();
// 			if (callback) {
// 				//callback (err, res)
// 				return bcrypt.compare(password, obj.password, callback);
// 			}
// 			return bcrypt.compareSync(password, obj.password);
// 		}
// 	},
// 	// Lifecycle Callbacks
// 	beforeCreate: function(values, next) {
// 		hashPassword(values, next);
// 	},
// 	beforeUpdate: function(values, next) {
// 		if (values.password) {
// 			hashPassword(values, next);
// 		}
// 		else {
// 			//IMPORTANT: The following is only needed when a BLANK password param gets submitted through a form. Otherwise, a next() call is enough.
// 			User.findOne(values.id).done(function(err, user) {
// 				if (err) {
// 					next(err);
// 				}
// 				else {
// 					values.password = user.password;
// 					next();
// 				}
// 			});
// 		}
// 	}
// };