import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
const read=async(path:string)=>JSON.parse(await fs.readFile(path,'utf8'));
const normalize=(text:string)=>text.replace(/\s+/g,' ').trim();
test('all eleven article bodies, original dates, author provenance and permalinks survive migration',async()=>{
 const articles=await read('src/data/articles.json');const index=await read('docs/evidence/wordpress-public-index.json');assert.equal(articles.length,11);
 for(const article of articles){const original=index.find((e:{slug:string})=>e.slug===article.slug);assert.ok(original);assert.equal(new URL(original.link).pathname,`/${article.slug}/`);assert.equal(article.date,original.date);
  const raw=await read(`docs/evidence/raw/${original.id}.json`);const $=load(raw.content.rendered);$('script,style,form,iframe,input,button,svg,img,video,audio,h1').remove();assert.equal(normalize(load(article.body).text()),normalize($.text()));assert.equal(article.author,raw._embedded.author[0].name);
  assert.ok(!article.body.includes('Quick Links'));assert.equal(article.archive,['windy-meyer','cheryl-angela','faith-jordan'].includes(article.slug));
 }
});
test('ten policies retain substantive text without legacy form elements',async()=>{
 const policies=await read('src/data/policies.json');assert.equal(policies.length,10);
 for(const policy of policies){const $=load(policy.body);assert.equal($('form,input,button,iframe,script,h1').length,0);assert.ok($.text().length>500);assert.equal(policy.publish,false);}
});
test('approved download records must name real local files',async()=>{
 const downloads=await read('src/data/downloads.json');for(const d of downloads){if(!d.publish||d.approvalStatus!=='approved')continue;assert.ok(d.path.startsWith('/')&&!d.path.includes('..'));const st=await fs.stat('public'+d.path);assert.ok(st.isFile()&&st.size>0);}
});
