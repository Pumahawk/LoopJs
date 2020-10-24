const testutils = require('../../src/libs/test-utils');
const assert = require('assert');

const controllerExtension = require('../../src/libs/controller-extension');

const t = testutils.init({
    name: 'controller-extension',
}, module);

function mockRequest(conf) {
    let  {bodyRequest, url} = conf;
    return {
        url,
        on,
    }

    function on(name, action) {
        switch(name) {
            case 'data':
                action(bodyRequest);
                break;
            case 'end':
                action();
                break;
            default:
                assert.fail('action name not supported. Add in test implementation');
        }
    }
}


function checkBodyRequest(data, onCall) {
    return obj => {onCall(); assert.deepStrictEqual(obj.bodyRequest, data) };
}

t('reqExtBody', function() {
    let call1 = 0;
    controllerExtension.reqExtBody('none')(checkBodyRequest('simpleData', () => call1++))({
        req: mockRequest({
            bodyRequest: 'simpleData',
        })
    });
    assert.strictEqual(call1, 1);
    let call2 = 0;
    controllerExtension.reqExtBody('json')(checkBodyRequest({value: 'data'}, () => call2++))({
        req: mockRequest({
            bodyRequest: '{"value": "data"}',
        })
    });
    assert.strictEqual(call2, 1);
});