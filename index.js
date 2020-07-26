
const path = require('path');

module.exports = function (sails) {

	var loader = require('sails-util-micro-apps')(sails);
	// loader.configure(); // short-hand
	loader.configure({
		// hooks: __dirname + '/api/hooks', // Path to your hook's hooks
		policies: __dirname + '/api/policies', // Path to your hook's policies
		config: __dirname + '/config' // Path to your hook's config
	});

	const passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		bcrypt = require('bcrypt');

	const Book = require('./api/models/Book');
	const Editor = require('./api/models/Editor');
	const Bundle = require('./api/models/groupings/Bundle');

	passport.serializeUser(function(user, done) {
		done(null, user.get('id'));
	});
	passport.deserializeUser(function(id, done) {
		Editor.forge({id: id})
			.fetch()
			.then((usr) => {
				done(null, usr);
			}).catch((err) => {
				done(err);
			});
	});
	passport.use(new LocalStrategy({
			usernameField: 'email', // define the parameter in req.body that passport can use as username and password
			passwordField: 'password'
		},
		function(username, password, done) {
			sails.log('Passport::calling the function checking for username & password');
			sails.log(username);
			sails.log(password);
			Editor.forge({ email: username })
				.fetch()
				.then((usr) => {
					sails.log('check pass');
					if (!usr) {
						return done(null, false);
					}
					usr.validatePassword(password).then((valid) => {
						sails.log('validate pass');
						if (!valid) {
							sails.log('invalid pass');
							return done(null, false);
						}
						sails.log('successful pass');
						return done(null, usr, { message: 'Login Succesful'});
					});
				})
				.catch((err) => { return done(err); });
			}
		)
	);
	
	Object.assign (
		sails.config.http.middleware,
		{
			passportInit: passport.initialize(),
			passportSession: passport.session() 
		}
	);
	sessionMWI = sails.config.http.middleware.order.indexOf('session');
	sails.config.http.middleware.order.splice(sessionMWI + 1, 0, 'passportInit');
	sails.config.http.middleware.order.splice(sessionMWI + 2, 0, 'passportSession');

	
	
	Object.assign (
		sails.config.http.middleware,
		{
		  iatelierAssets: require('serve-static')(path.join(__dirname, 'public')),
		}
	  );
	sails.config.http.middleware.order.push('iatelierAssets');
	

	// let mockSexy = { sexy: (function(){
	//   var sexyMiddleware = require('serve-static')(path.join(__dirname, 'public'));
	//   return sexyMiddleware;
	// })() }
	// Object.assign (
	//   sails.config.http.middleware,
	//   mockSexy
	// );
		
	//   let mockSexy = { sexy: (function(){
	//   var sexyMiddleware = require('serve-static')(path.join(__dirname, 'public'));
	//   return sexyMiddleware;
	// })() }
	// Object.assign (
	//   sails.config.http.middleware,
	//   mockSexy
	// );
	
	sails.config.policies['ibooks/*'] = 'authenticated';
	
	
	return {
		initialize: function (next) {

			// Load controllers, models & services from default directories
			// loader.adapt(function (err) {
			//     return next(err);
			// });

			// OR if you want to set custom path :
				
			loader.adapt({
				controllers: __dirname + '/api/controllers', // Path to your hook's controllers
				// models: __dirname + '/api/models', // Path to your hook's models
				// helpers: __dirname + '/api/helpers', // Path to your hook's helpers
				// services: __dirname + '/api/services', // Path to your hook's services
			}, function (err) {
				return next(err);
			});
	
		}
	};
};