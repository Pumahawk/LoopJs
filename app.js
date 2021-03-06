const http = require('http');
const apputils = require('./src/libs/app-utils')

const appmodule = require('./app.module');

const configuration = {
	port: '3000',
}

const server = http.createServer(
	apputils.requestServerManager({
		getModule: () => appmodule,
		getConsole: () => console,
		exceptionHandler,
	})
);

function exceptionHandler({req, res}, error) {
	console.error("Exception", error);
	res.statusCode = 500;
	res.end();
}


server.listen(configuration.port, () => {
	console.log(`Server running at http://localhost:${configuration.port}/`);
});
