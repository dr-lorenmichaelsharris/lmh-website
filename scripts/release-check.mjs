import fs from 'node:fs/promises';
export async function assertRelease(){
 const approved=JSON.parse(await fs.readFile('docs/release-approvals.json','utf8'));
 const missing=[];for(const key of ['assetsApproved','policiesApproved','businessIdentityApproved','formsApproved','hostApproved'])if(approved[key]!==true)missing.push(key);
 const index=JSON.parse(await fs.readFile('docs/evidence/wordpress-public-index.json','utf8'));
 for(const entry of index)if(entry.kind!=='posts'&&!approved.approvedRoutes.includes(new URL(entry.link).pathname))missing.push(new URL(entry.link).pathname);
 for(const collection of ['articles','policies','services','programs']){const entries=JSON.parse(await fs.readFile(`src/data/${collection}.json`,'utf8'));for(const e of entries)if(!e.publish||e.approvalStatus!=='approved')missing.push(`${collection}:${e.slug||e.id}`);}
 if(missing.length)throw Error(`Release blocked: ${missing.join(', ')}. See docs/launch-blockers.md.`);
 if(process.env.FORM_ADAPTER==='local')throw Error('Local adapter is forbidden in production.');
}
if(process.argv[1]?.endsWith('release-check.mjs')){try{await assertRelease();console.log('Release approvals complete.')}catch(e){console.error(e.message);process.exitCode=1}}
