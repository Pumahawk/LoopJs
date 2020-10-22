const maputils = require('./map-utils.test')
const testutils = require('../../src/libs/test-utils');

testutils.initIndex({
    name: 'libs',
    tests: [
        maputils,
    ]
}, module);