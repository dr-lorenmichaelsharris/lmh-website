import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const cwd = await mkdtemp(join(tmpdir(), 'lmh-deployment-'));
const port = 4342;
const origin = `http://127.0.0.1:${port}`;
// Run without the source tree or docs in the working directory, like a
// deployment that ships only dist. This caught the sitemap filesystem bug.
const server = spawn(process.execPath, [fileURLToPath(new URL('../dist/server/entry.mjs', import.meta.url))], {
 cwd, env:{...process.env, HOST:'127.0.0.1', PORT:String(port), SITE_ENV:'staging', FORM_ADAPTER:'unavailable'},
 stdio:['ignore','pipe','pipe'], windowsHide:true,
});
let logs = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', chunk => {logs = (logs + chunk).slice(-4000);});
try {
 let response;
 for (let attempt = 0; attempt < 60; attempt++) {
  if (server.exitCode !== null) throw new Error(`Server exited: ${logs}`);
  try {response = await fetch(origin + '/sitemap.xml', {signal:AbortSignal.timeout(2000)}); break;} catch {}
  await new Promise(resolve => setTimeout(resolve, 250));
 }
 assert.ok(response, `Server did not start: ${logs}`);
 assert.equal(response.status, 200, logs);
 assert.match(response.headers.get('content-type') || '', /application\/xml/);
 const xml = await response.text();
 assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"><\/urlset>/);
 assert.equal(xml.includes('<loc>'), false, 'Review sitemap must not publish URLs');
 assert.equal((await fetch(origin + '/')).status, 200);
 assert.match(await (await fetch(origin + '/robots.txt')).text(), /Disallow: \//);
 console.log('Packaged server: sitemap 200, valid empty staging XML, homepage 200, indexing disabled; no docs directory required.');
} finally {
 if (server.exitCode === null) {
  server.kill();
  await once(server, 'exit');
 }
 assert.equal(dirname(resolve(cwd)), resolve(tmpdir()));
 await rm(cwd, {recursive:true, force:true});
}
