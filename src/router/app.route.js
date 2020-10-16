const appController = require('../controllers/app.controller');
let AppController = require('../controllers/app.controller').AppController;

let routes = [
	{
		path: /.*/,
		controller: AppController().home
	}
];

module.exports = {
	routes,
}
