const AppController = require('./src/controllers/app.controller');
const AppService = require('./src/services/app.service');

const controllers = [
	AppController,
	NotFoundController,
];

const injectables = [
	AppService,
];

function NotFoundController() {
    return [{ path: /.*/, controller: ({req, res}) => {res.statusCode = 404; res.end();}}]
}

module.exports = {
	controllers,
	injectables,
};