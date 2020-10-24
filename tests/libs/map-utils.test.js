const testutils = require('../../src/libs/test-utils');
const assert = require('assert');

const maputils = require('../../src/libs/map-utils');
const { map } = require('../../src/libs/map-utils');


const t = testutils.init({
    name: 'map-utils'
}, module);

t('mapCondition', function() {
    let v1 = maputils.mapCondition(() => true, 'v1');
    assert.strictEqual(v1.get(), 'v1');
    assert.strictEqual(v1.map(() => 'v2').get(), 'v2');
    assert.strictEqual(v1.map(() => 'v2').map(v => v + '+1').get(), 'v2+1');

    
    let v2 = maputils.mapCondition(() => false, 'v1');
    assert.strictEqual(v2.get(), undefined);
    assert.strictEqual(v2.map(() => 'v2').get(), undefined);
    assert.strictEqual(v2.map(() => 'v2').map(v => v + '+1').get(), undefined);
});


t('mapTrue', function() {
   let obj = {
       a: {
           b: {
               value: 'text'
           }
       }
   };

   let mapStart = maputils.mapTrue(obj);

   let map1 = mapStart.map(v => v.a);
   assert.deepStrictEqual(map1.get(), {b:{value: 'text'}});

   let map2 = map1.map(v => v.b);
   assert.deepStrictEqual(map1.get(), {b:{value: 'text'}});
   assert.deepStrictEqual(map2.get(), {value: 'text'});

   let map3 = map2.map(v => v.value);
   assert.deepStrictEqual(map1.get(), {b:{value: 'text'}});
   assert.deepStrictEqual(map2.get(), {value: 'text'});
   assert.deepStrictEqual(map3.get(), 'text');

   assert.doesNotThrow(() => mapStart.map(v => v.a).map(v => v.c).map(v => v.value).get());

});

