import {spawnSync} from 'node:child_process';
const env={...process.env,DEPLOY_TARGET:'hostinger'};delete env.VERCEL;
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit',env});process.exit(result.status??1);
