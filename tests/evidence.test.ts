import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {visibleEvidence} from '../src/lib/content-visibility.ts';

test('preview testimonials are visible locally but excluded from production even if accidentally marked approved', async()=>{
  const records=JSON.parse(await fs.readFile('src/data/testimonials.json','utf8'));
  assert.equal(records.length,3);
  for(const record of records){
    assert.equal(visibleEvidence(record,false),true);
    assert.equal(visibleEvidence(record,true),false);
    assert.equal(visibleEvidence({...record,publish:true,approvalStatus:'approved'},true),false);
    assert.ok(record.quote.includes(record.excerpt));
    assert.equal(new URL(record.sourceUrl).hostname,'lorenmichaelsharris.com');
  }
});
test('ordinary unpublished or pending evidence stays hidden; approved publishable evidence remains visible',()=>{
  assert.equal(visibleEvidence({publish:false,approvalStatus:'pending'},false),false);
  assert.equal(visibleEvidence({publish:true,approvalStatus:'pending'},true),false);
  assert.equal(visibleEvidence({publish:false,approvalStatus:'approved'},true),false);
  assert.equal(visibleEvidence({publish:true,approvalStatus:'approved'},true),true);
});
