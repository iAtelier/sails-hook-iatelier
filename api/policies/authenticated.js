module.exports = function(req, res, next) {

	const loginPath = '/login'

	if (req.isSocket) // Sockets scenario
	{
		if (req.session &&
			req.session.passport &&
			req.session.passport.user
			) { return next(); }

		res.json(401);
	} else { // HTTP scenario

		if( req.isAuthenticated() ) return next();
		
		// If you are using a traditional, server-generated UI then uncomment out this code:
		res.redirect(loginPath);

		// If you are using a single-page client-side architecture and will login via socket or Ajax, then uncomment out this code:
		/*
		res.status(401);
		res.end();
		*/
	}
};