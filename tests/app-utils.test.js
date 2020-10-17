const apputils = require('../src/libs/app-utils');
const testutils = require('../src/libs/test-utils');
const assert = require('assert');

const t = testutils.init({
    name: 'app-utils'
}, module);

function createInject(name) {
    
    inj.$name = name;
    let injCount = 0;
    function inj() {
        injCount++;
        return name + 'solved';
    };

    return {
        inj,
        count: () => injCount,
    }
}

t('requestServerManagerTest', function () {
    
    function controller_map1() {}
    function controller_map2() {}
    
    function controller1() {
        return [
            {
                path: /.*/,
                controller: controller_map1,
            },
        ];
    }
    function controller2() {
        return [
            {
                path: /^c2.*/,
                controller: controller_map2,
            },
        ];
    }
    
    const controllers1 = [
        controller1,
        controller2,
    ];

    const module1 = {
        controllers: controllers1
    }
    
    const routers1 = [
        {
            path: /.*/,
            controller: controller_map1,
        },
        {
            path: /^c2.*/,
            controller: controller_map2,
        },
    ];
    const results1 = apputils.extractRoutersFromModule(module1);
    assert.deepEqual(results1, routers1);

});

t('instanceController', function () {

    let voidAction = () => {};

    let expected = {
        call: 1,
        instance: [
            { path: /^\/$/, controller: voidAction },
        ],
    }

    let result = {
        call: 0,
        instance:  [
            { path: /^\/$/, controller: voidAction },
        ],
    }

    function controller() {
        result.call += 1;
        return [
            { path: /^\/$/, controller: voidAction },
        ];
    }

    result.instance = apputils.instanceController(controller);

    assert.deepEqual(result, expected);
    
});

t('instanceController, whith inject', function() {

    let exec = false;

    firstinject.$name = 'firstinject'
    function firstinject() {}
    secondinject.$name = 'secondinject'
    function secondinject() {}

    controller.$inject = ['firstinject', 'secondinject'];
    function controller(fi1, fi2, fi3) {
        exec = true;
        assert.equal(fi1, firstinject);
        assert.equal(fi2, secondinject);
        assert.equal(fi3, undefined);
    }

    let injectList = [
        firstinject,
        secondinject,
    ];

    apputils.instanceController(controller, injectList)

    assert.ok(exec);
});

t('getInjectable', function() {
    
    injectable1.$name = 'injectable1';
    function injectable1(){};
    injectable2.$name = 'injectable2';
    function injectable2(){};

    let injectableList = [
        injectable1,
        injectable2,
    ];

    let result1 = apputils.getInjectable('injectable1', injectableList);
    assert.equal(result1, injectable1);
    let result2 = apputils.getInjectable('injectable2', injectableList);
    assert.equal(result2, injectable2);

});

t('instanceInjectableNoDependences', function() {
    let j1 = createInject('inj1');

    let inj = [
        j1.inj,
    ];

    let solved = [];

    let result = apputils.instanceInjectable(j1.inj, inj, solved);
    assert.equal(result, 'inj1solved');
    assert.equal(1, j1.count());
    assert.deepEqual(solved, [{ $name: 'inj1', value: result}]);
});