const testutils = require('../../src/libs/test-utils');
const assert = require('assert');

const controllerExtension = require('../../src/libs/controller-extension');
const { emux } = require('../../src/libs/controller-extension');
const { SSL_OP_MSIE_SSLV2_RSA_PADDING } = require('constants');

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

function mockMiddleware(conf) {
    let {
        preRequest,
        postRequest,
    } = conf;

    let ret = {
        countPre: 0,
        countPost: 0,
        middleware: undefined,
    };

    ret.middleware = controller => obj => {
        ret.countPre++;
        preRequest(obj);
        let retc = controller(obj);
        ret.countPost++
        postRequest(retc, obj);
        return retc;
    }
    return ret;
    
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

t('reqExtBodyJSON', function() {
    let call = 0;
    controllerExtension.reqExtBodyJSON(checkBodyRequest({value: 'data'}, () => call++))({
        req: mockRequest({
            bodyRequest: '{"value": "data"}',
        })
    });
    assert.strictEqual(call, 1);
})

t('emux', function () {
    
    let mid1 = mockMiddleware({
        preRequest: obj => obj.newAttribute1 = 'mid1', 
        postRequest: ret => assert.deepStrictEqual(ret, {value: 'test'}),
    })
    let mid2 = mockMiddleware({
        preRequest: obj => obj.newAttribute2 = 'mid2', 
        postRequest: ret => assert.deepStrictEqual(ret, {value: 'test'}),
    })

    let rest = emux([
        mid1.middleware,
        mid2.middleware,
    ]);

    function testc(obj) {
        assert.deepStrictEqual(obj, {
            newAttribute1: 'mid1',
            newAttribute2: 'mid2',
        });

        return {value: 'test'};
    }

    
    rest(testc)({});
    
    assert.strictEqual(mid1.countPre, 1);
    assert.strictEqual(mid1.countPost, 1);
    assert.strictEqual(mid2.countPre, 1);
    assert.strictEqual(mid2.countPost, 1);
});