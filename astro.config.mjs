import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import {loadBuildEnvironment} from './scripts/build-environment.mjs';
loadBuildEnvironment();
import {copyFile} from 'node:fs/promises';
import {assertRelease} from './scripts/release-check.mjs';
if(process.env.SITE_ENV==='production')await assertRelease();
export default defineConfig({site:'https://lorenmichaelsharris.com', output:'static', adapter:node({mode:'standalone'}), trailingSlash:'always', integrations:[{name:'lmh-dashboard-cron',hooks:{'astro:build:done':async({dir})=>{await copyFile('scripts/dashboard/reconcile-job.mjs',new URL('../server/reconcile-job.mjs',dir));}}}], security:{allowedDomains:[{hostname:'127.0.0.1',protocol:'http'},{hostname:'localhost',protocol:'http'},{hostname:'lorenmichaelsharris.com',protocol:'https'},{hostname:'www.lorenmichaelsharris.com',protocol:'https'}, ...[process.env.HOSTINGER_PREVIEW_HOST].filter(Boolean).map(hostname=>({hostname,protocol:'https'}))]}, devToolbar:{enabled:false}, server:{port:4321,host:'127.0.0.1'}});
