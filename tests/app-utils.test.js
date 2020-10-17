const apputils = require('../src/libs/app-utils');
const assert = require('assert');

module.exports = {
    name: 'app-utils',
    units: [
        {
            name: 'requestServerManager',
            action: requestServerManagerTest,
        },
    ]
}

function requestServerManagerTest() {
    
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

}