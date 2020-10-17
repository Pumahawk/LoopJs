function extractRoutersFromModule(module) {
    return module.controllers.reduce((obj, c) => obj.concat(instanceController(c, module.injectables)), []);
}

function requestServerManager({getModule, getConsole, exceptionHandler}) {

    const aconsole = getConsole();
    const controllers = getModule();
    const routers = extractRoutersFromModule(controllers);

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

function instanceController(controller, injectables) {
	let i = controller.$inject !== undefined ? controller.$inject.map(i => getInjectable(i, injectables)) : undefined;
	return controller.apply(null, i);
}

function getInjectable(k, injectables) {
    return injectables !== undefined ? injectables.find(i => i.$name === k) : undefined;
}

function instanceInjectable(injectable, dependenceList, instanced) {
    let solved = undefined;
    if (injectable.$inject === undefined) {
        solved = injectable();
    } else {
        let inj = injectable.$inject.map(iname => {
            let {newdep, excludedep} = dependenceList.collect((obj, d) => {
                if (d.$name === iname) {
                    obj.newdep = d;
                } else {
                    excludedep.push(d);
                }
            }, {
                newdep: undefined,
                excludedep: [],
            });
            return instanceInjectable(newdep, excludedep, instanced);
        }).map(d => instanced.find(i => d.$name === i.$name));
        solved = injectable.apply(null, inj);
    }
    instanced.push({
        $name: injectable.$name, 
        value: solved
    });
    return solved;

}

module.exports = {
    requestServerManager,
    extractRoutersFromModule,
    instanceController,
    getInjectable,
    instanceInjectable,
};
