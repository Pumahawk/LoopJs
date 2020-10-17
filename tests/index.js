const testModules = [
    require('./app-utils.test'),
    require('./test-utils.test'),
];

let counterOK = 0;
let counterKO = 0;
const infoUnitKO = [];
const infoUnitOK = [];

testModules.forEach(tm => tm.units.forEach(ut => {
    try {
        ut.action();
        infoUnitOK.push(getInfoUT(tm, ut));
        counterOK += 1;
    } catch(error) {
        console.error(error);
        infoUnitKO.push(getInfoUT(tm, ut));
        counterKO += 1;
    }
}));

if (infoUnitKO.length > 0) console.log('\n\n\n\n');
console.log('#### END UNIT TESTS ####\n\n');
console.log('Tests OK: ' + counterOK);
console.log('Tests KO: ' + counterKO);
if (infoUnitKO.length > 0) {
    console.log('\nFailed tests:');
    infoUnitKO.forEach(info => console.log(info.name));
    process.exit(1);
}


function getInfoUT(tm, ut) {
    return {
        name: tm.name + '.' + ut.name,
    };
}