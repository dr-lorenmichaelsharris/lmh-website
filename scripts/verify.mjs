import fs from 'node:fs/promises';
import {load} from 'cheerio';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4321';
const index=JSON.parse(await fs.readFile('docs/evidence/wordpress-public-index.json','utf8'));
const pages=new Map();const failures=[];const coverage=[];
for(const entry of index){const path=new URL(entry.link).pathname;const response=await fetch(origin+path);const html=await response.text();const $=load(html);pages.set(path,$);
 if(response.status!==200)failures.push(`${path}: ${response.status}`);
 if($('h1').length!==1)failures.push(`${path}: expected one H1, got ${$('h1').length}`);
 if(!$('meta[name=description]').attr('content')||!$('link[rel=canonical]').attr('href'))failures.push(`${path}: missing metadata`);
 if(!$('meta[name=robots]').attr('content')?.includes('noindex'))failures.push(`${path}: staging must be noindex`);
 coverage.push({wpId:entry.id,path,status:response.status,implementation:entry.kind==='posts'?'Preserved article body/date/author':path.includes('apply')?'Dedicated server-rendered guest form':path.includes('thank-you')?'Server receipt state; direct visit neutral':'Implemented page',release:'Approval pending'});
}
let links=0;
for(const [path,$] of pages){for(const el of $('a[href],img[src],form[action]').toArray()){
 const raw=$(el).attr('href')||$(el).attr('src')||$(el).attr('action');if(!raw)continue;
 if(raw==='#'){failures.push(`${path}: placeholder anchor`);continue}
 const u=new URL(raw,origin+path);if(u.origin!==origin)continue;
 links++;let target=pages.get(u.pathname);
 if(!target){const r=await fetch(u,{method:'GET'});if(r.status>=400&&!u.pathname.startsWith('/api/'))failures.push(`${path}: broken ${raw} (${r.status})`);if((r.headers.get('content-type')||'').includes('text/html')){target=load(await r.text());pages.set(u.pathname,target)}}
 if(u.hash&&target&&!target(`[id="${decodeURIComponent(u.hash.slice(1))}"]`).length)failures.push(`${path}: missing anchor ${raw}`);
}}
const notfound=await fetch(origin+'/does-not-exist/');if(notfound.status!==404)failures.push('404 route does not return 404');
const direct=await(await fetch(origin+'/thank-you-page/?paid=true&status=confirmed')).text();if(!direct.includes('No submission to confirm.'))failures.push('Query string spoofed confirmation');
const report={checkedAt:new Date().toISOString(),routes:coverage.length,internalReferences:links,failures,coverage};await fs.writeFile('docs/route-coverage.json',JSON.stringify(report,null,2));
console.log(`${coverage.length} registered routes; ${links} internal references; ${failures.length} failures.`);if(failures.length){console.log(failures.join('\n'));process.exitCode=1;}
