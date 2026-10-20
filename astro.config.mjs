import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import {existsSync} from 'node:fs';
import {assertRelease} from './scripts/release-check.mjs';
if(existsSync('.env'))process.loadEnvFile('.env');
if(process.env.SITE_ENV==='production')await assertRelease();
export default defineConfig({site:'https://lorenmichaelsharris.com', output:'static', adapter:node({mode:'standalone'}), trailingSlash:'always', security:{allowedDomains:[{hostname:'127.0.0.1',protocol:'http'},{hostname:'localhost',protocol:'http'},{hostname:'lorenmichaelsharris.com',protocol:'https'}]}, devToolbar:{enabled:false}, server:{port:4321,host:'127.0.0.1'}});
