const http = require('http');
const controllers = require('./app.router');

const routers = controllers.reduce((obj, c) => obj.concat(c()), []);

const port = '3000';

const server = http.createServer((req, res) => {
	try {
		let r = routers.find(r => req.url.match(r.path));
		r.controller(req, res);
	} catch (error) {
		console.error("Exception", error);
		res.statusCode = 500;
		res.end();
	}
});

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
