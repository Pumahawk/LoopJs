function AppController() {

	return [
		{ path: /^\/$/, controller: home },
	];
	
	function home({req, res, match}) {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/plain');
		res.end('Hello, world!');

		console.log(match);
	}

}

module.exports = AppController
