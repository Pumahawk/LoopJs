function AppController() {
	
	return {
		home,
	}
	
	function home(req, res) {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/plain');
		res.end('Hello, world!');
	}
}

module.exports = {
	AppController,
}
