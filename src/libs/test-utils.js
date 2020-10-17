module.exports = {
    init,
};


function init({name}, mod) {
    if (mod.exports === undefined) {
        mod.exports = {
            name,
        };
    }

    if (typeof mod.exports.units === 'undefined') {
        mod.exports.units = [];
    }
    return (name, unitTest) => mod.exports.units.push({
        name,
        action: unitTest,
    });
}