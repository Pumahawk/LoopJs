const assert = require('assert');
let testutils = require('../src/libs/test-utils');

const t = testutils.init({
    name: 'test-utils',
}, module);

t('initWithUndefinedExports', function () {
    const moduletest = {};
    const initialResult = {
        exports: {
            name: 'name1',
            units: [],
        }
    }
    const configuration = {
        name: 'name1',
    }
    const testFunction = testutils.init(configuration, moduletest);
    assert.deepEqual(moduletest, initialResult);
});

t('initWithDefinedExports', function () {
    const moduletest = {
        exports: {}
    };
    const initialResult = {
        exports: {
            name: 'name2',
            units: [],
        }
    }
    const configuration = {
        name: 'name2',
    }
    const testFunction = testutils.init(configuration, moduletest);
    assert.deepEqual(moduletest, initialResult);
});

t('initWithDefinedExportsWhithData', function () {
    const moduletest = {
        exports: {
            existingData: 'value',
        }
    };
    const initialResult = {
        exports: {
            name: 'name2',
            units: [],
            existingData: 'value',
        }
    }
    const configuration = {
        name: 'name2',
    }
    const testFunction = testutils.init(configuration, moduletest);
    assert.deepEqual(moduletest, initialResult);
});