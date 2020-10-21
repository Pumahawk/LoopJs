module.exports = {
    init,
    initIndex,
    joinMultipleUnitTestModule,
};


function init({name}, mod) {
    if (mod.exports === undefined) {
        mod.exports = {};
    }

    mod.exports = Object.assign(mod.exports, {
        name,
    });

    if (typeof mod.exports.units === 'undefined') {
        mod.exports.units = [];
    }
    return (name, unitTest) => mod.exports.units.push({
        name,
        action: unitTest,
    });
}

function initIndex({name, tests}, mod) {
    mod.exports = joinMultipleUnitTestModule(name, tests);
}

function joinMultipleUnitTestModule(name, uniTestList) {
    return uniTestList.reduce(function(obj, t) {
        (t.units != undefined ? t.units : []).forEach(u => obj.units.push({name: t.name + '.' + u.name, action: u.action}))
        return obj;
    }, { name: name, units: [] });
}