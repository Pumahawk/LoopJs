const apputils = require('../src/libs/app-utils');
const testutils = require('../src/libs/test-utils');
const assert = require('assert');

const t = testutils.init({
    name: 'app-utils'
}, module);

function createInject(name, inj) {
    
    inj = inj ? inj : () =>  {
        injCount++;
        return name + 'solved';
    };
    inj.$name = name;
    let injCount = 0;

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
    assert.deepEqual(solved, [{ $name: 'inj1', value: 'inj1solved'}]);
});

t('instanceMultipleInjectableNoDependences', function() {
    let j1 = createInject('inj1');
    let j2 = createInject('inj2');

    let inj = [
        j1.inj,
        j2.inj,
    ];

    let solved = [];

    let result = apputils.instanceInjectable(j1.inj, inj, solved);
    assert.equal(result, 'inj1solved');
    assert.equal(1, j1.count());
    assert.equal(0, j2.count());
    assert.deepEqual(solved, [{ $name: 'inj1', value: result}]);

    let result2 = apputils.instanceInjectable(j2.inj, inj, solved);
    assert.equal(result2, 'inj2solved');
    assert.equal(1, j1.count());
    assert.equal(1, j2.count());
    assert.deepEqual(solved, [{ $name: 'inj1', value: 'inj1solved'}, { $name: 'inj2', value: 'inj2solved'}]);
});


t('instanceInjectableWithDependences', function() {
    let j1 = createInject('inj1');
    let j2Count = 0;
    let j2 = createInject('inj2', inj1 => {
        assert.equal(inj1, 'inj1solved');
        j2Count++;
        return 'inj2solved';
    });
    j2.inj.$inject = ['inj1'];
    
    let inj = [
        j1.inj,
        j2.inj,
    ];

    let solved = [];
    let result = apputils.instanceInjectable(j2.inj, inj, solved);
    assert.equal(result, 'inj2solved');
    assert.equal(1, j1.count());
    assert.equal(1, j2Count);
    assert.deepEqual(solved, [{ $name: 'inj1', value: 'inj1solved'}, { $name: 'inj2', value: 'inj2solved'}]);
});

t('instanceInjectableWithMultipleDependences', function() {
    let inj3Count = 0;
    let inj4Count = 0;
    let inj5Count = 0;
    let j1 = createInject('inj1');
    let j2 = createInject('inj2');

    let j3 = createInject('inj3', (dj1, dj2) => {
        assert.equal(dj1, 'inj1solved');
        assert.equal(dj2, 'inj2solved');
        inj3Count++;
        return 'inj3solved';
    });
    j3.inj.$inject = ['inj1', 'inj2'];

    let j4 = createInject('inj4', (dj3, dj1) => {
        assert.equal(dj1, 'inj1solved');
        assert.equal(dj3, 'inj3solved');
        inj4Count++;
        return 'inj4solved';
    });
    j4.inj.$inject = ['inj3', 'inj1'];

    let j5 = createInject('inj5', (dj3, dj1, dj2, dj4) => {
        assert.equal(dj3, 'inj3solved');
        assert.equal(dj1, 'inj1solved');
        assert.equal(dj2, 'inj2solved');
        assert.equal(dj4, 'inj4solved');
        inj5Count++;
        return 'inj5solved';
    });
    j5.inj.$inject = ['inj3', 'inj1', 'inj2', 'inj4'];

    let inj = [
        j1.inj,
        j2.inj,
        j3.inj,
        j4.inj,
    ];

    let solved = [];

    let result = apputils.instanceInjectable(j4.inj, inj, solved);
    
    assert.equal(result, 'inj4solved');
    assert.equal(1, j1.count());
    assert.equal(1, j2.count());
    assert.equal(1, inj3Count);
    assert.equal(1, inj4Count);
    assert.equal(0, inj5Count);
    assert.deepEqual(solved, [
        { $name: 'inj1', value: 'inj1solved'},
        { $name: 'inj2', value: 'inj2solved'},
        { $name: 'inj3', value: 'inj3solved'},
        { $name: 'inj4', value: 'inj4solved'},
    ]);

    
    let result2 = apputils.instanceInjectable(j5.inj, inj, solved);

    assert.equal(result2, 'inj5solved');
    assert.equal(1, j1.count());
    assert.equal(1, j2.count());
    assert.equal(1, inj3Count);
    assert.equal(1, inj4Count);
    assert.equal(1, inj5Count);
    assert.deepEqual(solved, [
        { $name: 'inj1', value: 'inj1solved'},
        { $name: 'inj2', value: 'inj2solved'},
        { $name: 'inj3', value: 'inj3solved'},
        { $name: 'inj4', value: 'inj4solved'},
        { $name: 'inj5', value: 'inj5solved'},
    ]);
});

t('instanceInjectableWithCircularDependences', function() {
    let j1 = createInject('inj1');
    j1.inj.$inject = ['inj3'];
    let j2 = createInject('inj2');
    j2.inj.$inject = ['inj1'];
    let j3 = createInject('inj3');
    j3.inj.$inject = ['inj2'];

    let inj = [
        j1,
        j2,
        j3,
    ];

    let solved = [];

    assert.throws(() => apputils.instanceInjectable(j3.inj, inj, solved),
    error => {
        assert.equal(error.id, 'circularInjection');
        return true;
    });

});