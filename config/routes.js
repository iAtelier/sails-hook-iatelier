module.exports.routes = {

    // ibook modules
	'GET /iatelier/:book_type' : { action: 'ibooks/list' },
    'GET /iatelier/:book_type/new' : { action: 'ibooks/new' },
    'GET /iatelier/:book_type/:id/edit' : { action: 'ibooks/edit' },
    'POST /iatelier/:book_type/:id/' : { action: 'ibooks/update' },
    'POST /iatelier/:book_type/' : { action: 'ibooks/create' },

    // Auth modules
    'GET /login': { view: 'vendors/iatelier/auth/login' },
    'POST /login': 'AuthController.login',
    '/logout': 'AuthController.logout',
    // 'GET /register': { view: 'register' }
}