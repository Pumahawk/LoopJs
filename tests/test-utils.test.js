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

t('joinMultipleUnitTestModule', function() {

    let mod1 = {};
    let mod2 = {};
    let mod3 = {};
    let mod4 = {};
    let mod5 = {};

    let t1 = testutils.init({name: 't1'}, mod1);
    let t2 = testutils.init({name: 't2'}, mod2);
    let t3 = testutils.init({name: 't3'}, mod3);
    let t4 = testutils.init({name: 't4'}, mod4);
    let t5 = testutils.init({name: 't5'}, mod5);

    function a1(){}
    function a2(){}
    function a3(){}
    function a4(){}
    function a5(){}

    t2('t2u1', a1);
    t2('t2u2', a2);

    t4('t4u1', a3);
    t4('t4u2', a4);

    t5('t5u1', a5);

    let l = [
        mod1.exports,
        mod2.exports,
        mod3.exports,
        mod4.exports,
        mod5.exports,
    ];

    let result = testutils.joinMultipleUnitTestModule('join', l);

    assert.deepStrictEqual(
        result,
        {
            name: 'join',
            units: [
                { name: 't2.t2u1', action: a1 },
                { name: 't2.t2u2', action: a2 },
                { name: 't4.t4u1', action: a3 },
                { name: 't4.t4u2', action: a4 },
                { name: 't5.t5u1', action: a5 },
            ]
        }
    );
});


t('initIndex', function() {

    let mindex = {};
    let mod1 = {};
    let mod2 = {};
    let mod3 = {};
    let mod4 = {};
    let mod5 = {};

    let t1 = testutils.init({name: 't1'}, mod1);
    let t2 = testutils.init({name: 't2'}, mod2);
    let t3 = testutils.init({name: 't3'}, mod3);
    let t4 = testutils.init({name: 't4'}, mod4);
    let t5 = testutils.init({name: 't5'}, mod5);

    function a1(){}
    function a2(){}
    function a3(){}
    function a4(){}
    function a5(){}

    t2('t2u1', a1);
    t2('t2u2', a2);

    t4('t4u1', a3);
    t4('t4u2', a4);

    t5('t5u1', a5);

    let l = [
        mod1.exports,
        mod2.exports,
        mod3.exports,
        mod4.exports,
        mod5.exports,
    ];

    testutils.initIndex({
        name: 'join',
        tests: l
    }, mindex);

    assert.deepStrictEqual(
        mindex.exports,
        {
            name: 'join',
            units: [
                { name: 't2.t2u1', action: a1 },
                { name: 't2.t2u2', action: a2 },
                { name: 't4.t4u1', action: a3 },
                { name: 't4.t4u2', action: a4 },
                { name: 't5.t5u1', action: a5 },
            ]
        }
    );
});