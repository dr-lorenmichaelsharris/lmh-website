import fs from 'node:fs/promises';
const index=JSON.parse(await fs.readFile('docs/evidence/wordpress-public-index.json','utf8'));
// Public API snapshots retained separately; only content.rendered is used as body.
for (const entry of index.filter(e=>e.kind==='posts'||/policy|disclosure|disclaimer|terms-and|accessibility|data-processing/.test(e.slug))) {
 const res=await fetch(`https://lorenmichaelsharris.com/wp-json/wp/v2/${entry.kind}/${entry.id}?_embed`);
 if(!res.ok) throw Error(`${entry.slug}: ${res.status}`);
 const data=await res.json(); await fs.writeFile(`docs/evidence/raw/${entry.id}.json`,JSON.stringify(data,null,2));
}
const paths={hero:'2025/10/2019LMHarris-163-1.jpg.webp',portrait:'2025/10/untitled-1139-1.jpg-1.webp'};
const assets=[];
for(const [name,path] of Object.entries(paths)){
 const url='https://lorenmichaelsharris.com/wp-content/uploads/'+path; const r=await fetch(url);if(!r.ok)throw Error(url); const local=`src/assets/${name}.${path.endsWith('webp')?'webp':'jpeg'}`;
 await fs.writeFile(local,Buffer.from(await r.arrayBuffer())); assets.push({local,sourceUrl:url,intendedUse:name,approvalStatus:'pending-owner-rights-review',notes:'Existing public brand photography reused for local design review. No endorsement implied.'});
}
await fs.writeFile('docs/asset-usage.json',JSON.stringify(assets,null,2));
console.log('Saved body-only API sources and two local photographs.');

