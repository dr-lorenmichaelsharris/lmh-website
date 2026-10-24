import {spawnSync} from 'node:child_process';import {copyFileSync} from 'node:fs';
const env={...process.env,DEPLOY_TARGET:'hostinger'};delete env.VERCEL;
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit',env});if(result.status===0)copyFileSync('scripts/dashboard/reconcile-job.mjs','dist/server/reconcile-job.mjs');process.exit(result.status??1);
