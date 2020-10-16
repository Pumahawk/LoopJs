let AppController = require('../controllers/app.controller');

let routes = [
	{
		path: /.*/,
		controller: AppController.home
	}
];

module.exports = {
	routes,
}
