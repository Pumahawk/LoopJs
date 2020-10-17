const http = require('http');
const controllers = require('./app.router');

const routers = controllers.reduce((obj, c) => obj.concat(instanceController(c)), []);

const port = '3000';

const server = http.createServer((req, res) => {
	try {
		routers.find(r => req.url.match(r.path)).controller({
			req,
			res,
		});
	} catch (error) {
		console.error("Exception", error);
		res.statusCode = 500;
		res.end();
	}
});

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

function instanceController(controller) {
	let i = controller.$inject !== undefined ? controller.$inject.map(i => getInjectable(k)) : undefined;
	return controller.apply(null, i);
}

function getInjectable(k) {
	return undefined;
}
