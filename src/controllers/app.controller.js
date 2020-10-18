module.exports = AppController
AppController.$inject = ['appService'];
function AppController(appService) {

	return [
		{ path: /^\/$/, controller: home },
	];
	
	function home({req, res, match}) {
		res.statusCode = 200;
		res.setHeader('Content-type', 'text/plain');
		res.end(appService.message);
	}

}
