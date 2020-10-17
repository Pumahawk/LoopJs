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

function instanceInjectable(injectable, dependenceList = [], instanced = [], toSolve = []) {
    let solved = undefined;
    if (injectable.$inject === undefined) {
        solved = injectable();
    } else {
        toSolve.push(injectable.$name);
        let inj = injectable.$inject.map(iname => {
            let inInstanced = instanced.find(x => x.$name === iname);
            if (inInstanced !== undefined) {
                return inInstanced.value;
            } else {
                let {newdep, excludedep} = dependenceList.reduce((obj, d) => {
                    if (d.$name === iname) {
                        obj.newdep = d;
                    } else {
                        obj.excludedep.push(d);
                    }
                    return obj;
                }, {
                    newdep: undefined,
                    excludedep: [],
                });
                if (newdep === undefined) {
                    let errorId = (toSolve.some(x => x === iname)) ? 'circularInjection' : 'injectionNotFound';
                    const error = new Error('Unable to inject dependence');
                    error.id = errorId;
                    throw error;
                }
                return instanceInjectable(newdep, excludedep, instanced, toSolve);
            }
        });
        solved = injectable.apply(null, inj);
    }
    toSolve = toSolve.filter(x => x !== injectable.$name);
    if (instanced.find(x => x.$name === injectable.$name) === undefined) {
        instanced.push({
            $name: injectable.$name, 
            value: solved
        });
    }
    return solved;

}

module.exports = {
    requestServerManager,
    extractRoutersFromModule,
    instanceController,
    getInjectable,
    instanceInjectable,
};
