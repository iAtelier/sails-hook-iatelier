const passport = require('passport');

module.exports = {
	login: function(req, res) {
		sails.log('traying to login')
		passport.authenticate(
			'local', 
			function(err, user, info) {
				if( (err) || (!user) ) {
					return res.send({
						message: info,
						user
					});
				}
				req.logIn(user, function(err) {
					if(err) res.send(err);
					sails.log('User ' + user.get('id') + ' has logged in.');
					sails.log(info);
					return res.send({
						message: info,
						user
					});
					// return res.redirect('/iatelier?user=' + user.get('id'));
				});
			}
		)(req, res);
	},
	logout: async function(req, res) {
		req.logout();
		res.redirect('/');
	}
};