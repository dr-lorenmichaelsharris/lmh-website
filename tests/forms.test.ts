import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {submit,validate,readReceipt,resetTestState,paymentBoundary} from '../src/lib/forms.ts';
const base={service:'speaking',name:'Local Tester',email:'test@example.test',message:'This is a local test inquiry.',acknowledgment:'yes'};
const ctx={ip:'local-test',origin:'http://127.0.0.1:4321',env:{SITE_ENV:'staging',FORM_ADAPTER:'local',LOCAL_TEST_MODE:'true'}};
beforeEach(resetTestState);
test('server validates required fields, lengths, consent and package IDs',()=>{
 assert.ok(validate({...base,email:'bad'}).email);assert.ok(validate({...base,message:'short'}).message);assert.ok(validate({...base,name:'x'.repeat(121)}).name);
 assert.ok(validate({...base,service:'guest',package:'forged'}).package);assert.ok(validate({...base,package:'gold'}).package);
 assert.ok(validate({service:'newsletter',email:'test@example.test'}).consent);
});
test('local receipt retains guest preference without payment or scheduling',async()=>{
 const r=await submit({...base,service:'guest',package:'silver'},ctx);assert.equal(r.status,303);assert.ok(r.receipt);
 const receipt=readReceipt(r.receipt);assert.equal(receipt?.package,'silver');assert.equal(receipt?.local,true);assert.equal(paymentBoundary().enabled,false);
 assert.equal(readReceipt('paid=true'),undefined);
});
test('local mode never runs on production or a public host',async()=>{
 assert.equal((await submit(base,{...ctx,env:{...ctx.env,SITE_ENV:'production'}})).status,503);
 assert.equal((await submit(base,{...ctx,origin:'https://example.com'})).status,503);
});
test('missing provider produces unavailable, never fake success',async()=>{
 const r=await submit(base,{...ctx,env:{}});assert.equal(r.status,503);assert.equal(r.receipt,undefined);
});
test('newsletter simulated success, duplicate and explicit failure outcomes',async()=>{
 const data={service:'newsletter',email:'test@example.test',consent:'yes'};
 const first=await submit(data,ctx);assert.equal(first.status,303);
 const repeat=await submit(data,ctx);assert.equal(first.receipt,repeat.receipt);assert.equal(repeat.duplicate,true);
 const failure=await submit({...data,email:'second@example.test'},{...ctx,env:{...ctx.env,LOCAL_TEST_OUTCOME:'failure'}});assert.equal(failure.status,502);
});
test('webhook acceptance, separate newsletter destination and idempotent concurrent sends',async()=>{
 let calls=0;let url='';
 const env={SITE_ENV:'production',FORM_ADAPTER:'webhook',FORMS_APPROVED:'true',INQUIRY_WEBHOOK_URL:'https://inquiry.example.test',NEWSLETTER_WEBHOOK_URL:'https://newsletter.example.test',FORM_WEBHOOK_TOKEN:'test-only'};
 const provider=(async(input:Parameters<typeof fetch>[0],init:Parameters<typeof fetch>[1])=>{calls++;url=String(input);assert.ok(new Headers(init?.headers).get('Idempotency-Key'));return new Response('{}',{status:202})}) as typeof fetch;
 const [a,b]=await Promise.all([submit(base,{...ctx,env},provider),submit(base,{...ctx,env},provider)]);assert.equal(calls,1);assert.equal(a.receipt,b.receipt);
 await submit({service:'newsletter',email:'test@example.test',consent:'yes'},{...ctx,env},provider);assert.equal(url,env.NEWSLETTER_WEBHOOK_URL);
});
test('provider rejection and timeout do not produce a receipt',async()=>{
 const env={FORM_ADAPTER:'webhook',FORMS_APPROVED:'true',INQUIRY_WEBHOOK_URL:'https://example.test',FORM_WEBHOOK_TOKEN:'test-only'};
 for(const f of [async()=>new Response('',{status:500}),async()=>{throw Error('offline')}]){const r=await submit(base,{...ctx,env},f as typeof fetch);assert.equal(r.status,502);assert.equal(r.receipt,undefined)}
});
test('honeypot and repeated requests fail safely',async()=>{
 assert.equal((await submit({...base,company_url:'spam'},ctx)).status,400);
 for(let i=0;i<8;i++)await submit({...base,email:`test${i}@example.test`},{...ctx,env:{}});
 assert.equal((await submit(base,{...ctx,env:{}})).status,429);
});
