module.exports = {
    mapCondition,
    map,
    mapTrue,
};


function mapCondition(condition, x) {
    const f = typeof x === 'function' ? x : () => condition(x) ? x : undefined;
    return {
        map: y => mapCondition(condition, () => {
            let res = f();
            return condition(res) ? y(res) : undefined;
        }),
        get: () => f(),
    }
}
function map(x) {
    return mapCondition(() => true, x);
}

function mapTrue(x) {
    return mapCondition(v => v !== undefined, x);
}