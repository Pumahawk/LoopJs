const http = require('http');
const routers = require('./src/router');

const port = '3000';

const server = http.createServer((req, res) => {
	try {
		routers.routes.find(r => req.url.match(r.path)).controller(req, res);
	} catch (error) {
		console.error("Exception", error);
	}
});

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
