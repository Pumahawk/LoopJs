const AppController = require('./src/controllers/app.controller');

const controllers = [
	AppController,
	NotFoundController,
];

function NotFoundController() {
    return [{ path: /.*/, controller: ({req, res}) => {res.statusCode = 404; res.end();}}]
}

module.exports = {
	controllers,
};