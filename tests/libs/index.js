const maputils = require('./map-utils.test')
const controllerExtension = require('./controller-extension.test');
const testutils = require('../../src/libs/test-utils');

testutils.initIndex({
    name: 'libs',
    tests: [
        maputils,
        controllerExtension,
    ]
}, module);