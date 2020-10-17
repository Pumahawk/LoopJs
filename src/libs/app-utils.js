function extractRoutersFromControllers(controllers) {
    return controllers.reduce((obj, c) => obj.concat(instanceController(c)), []);
}

function requestServerManager({getControllers, getConsole, exceptionHandler}) {

    const aconsole = getConsole();
    const controllers = getControllers();
    const routers = extractRoutersFromControllers(controllers);

    return (req, res) => {
        try {
            let match = undefined;
            routers.find(r => {
                match = req.url.match(r.path);
                return !!match;
            }).controller({
                req,
                res,
                match,
            });
        } catch (error) {
            exceptionHandler({
                req,
                res,
            }, error);
        }
    }
}

function instanceController(controller) {
	let i = controller.$inject !== undefined ? controller.$inject.map(i => getInjectable(k)) : undefined;
	return controller.apply(null, i);
}

function getInjectable(k) {
	return undefined;
}

module.exports = {
    requestServerManager,
    extractRoutersFromControllers,
    instanceController,
};
