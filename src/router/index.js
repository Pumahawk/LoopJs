let appRouter = require('./app.route');

let routes = []
appRouter.routes.forEach(r => routes.push(r));
module.exports = {
	routes,
};
