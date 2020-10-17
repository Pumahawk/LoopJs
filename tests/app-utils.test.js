const apputils = require('../src/libs/app-utils');
const testutils = require('../src/libs/test-utils');
const assert = require('assert');

const t = testutils.init({
    name: 'app-utils'
}, module);

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
    
    const results1 = apputils.extractRoutersFromControllers(controllers1);
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
