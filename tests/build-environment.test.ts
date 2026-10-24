import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

const configUrl = new URL('../astro.config.mjs', import.meta.url).href;

function loadConfig(files: Record<string, string>, args: string[], exportedSiteEnv?: string) {
 const root = mkdtempSync(join(tmpdir(), 'lmh-release-env-'));
 try {
  mkdirSync(join(root, 'docs/evidence'), {recursive:true});
  mkdirSync(join(root, 'src/data'), {recursive:true});
  writeFileSync(join(root, 'docs/release-approvals.json'), JSON.stringify({approvedRoutes:[]}));
  writeFileSync(join(root, 'docs/evidence/wordpress-public-index.json'), '[]');
  for (const collection of ['articles', 'policies', 'services', 'programs']) writeFileSync(join(root, `src/data/${collection}.json`), '[]');
  for (const [name, value] of Object.entries(files)) writeFileSync(join(root, name), value);
  const env = {...process.env};
  delete env.SITE_ENV;
  delete env.DEPLOY_TARGET;
  if (exportedSiteEnv) env.SITE_ENV = exportedSiteEnv;
  return spawnSync(process.execPath, ['--input-type=module'], {
   cwd:root, env, encoding:'utf8', timeout:30000, windowsHide:true,
   input:`process.argv = ['node', 'astro', ...${JSON.stringify(args)}]; await import(${JSON.stringify(configUrl)});`,
  });
 } finally {rmSync(root, {recursive:true, force:true});}
}

test('production env overrides base staging env and enforces release approvals', () => {
 const result = loadConfig({'.env':'SITE_ENV=staging', '.env.production':'SITE_ENV=production'}, ['build']);
 assert.equal(result.status, 1);
 assert.match(result.stderr, /Release blocked: assetsApproved/);
});

test('mode-local env and both explicit mode flag formats enforce release approvals', () => {
 for (const args of [['build', '--mode', 'review'], ['build', '--mode=review']]) {
  const result = loadConfig({'.env.review':'SITE_ENV=staging', '.env.review.local':'SITE_ENV=production'}, args);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Release blocked:/);
 }
});

test('exported hosting setting takes priority over production env files', () => {
 const result = loadConfig({'.env.production':'SITE_ENV=production'}, ['build'], 'staging');
 assert.equal(result.status, 0, result.stderr);
});

test('development config does not load production-only settings', () => {
 const result = loadConfig({'.env.production':'SITE_ENV=production'}, ['dev']);
 assert.equal(result.status, 0, result.stderr);
});
