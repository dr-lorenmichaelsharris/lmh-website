import type {APIRoute} from 'astro';
import {publicEpisodes} from '../lib/dashboard/public';
export const prerender=false;
import {getCollection} from 'astro:content';
export const GET:APIRoute=async()=>{
 const production=import.meta.env.SITE_ENV==='production';
 const approval=JSON.parse(await import('node:fs/promises').then(fs=>fs.readFile('docs/release-approvals.json','utf8')));
 const entries=await Promise.all([getCollection('articles'),getCollection('policies')]);
 const episodeRoutes=production?(await publicEpisodes()).items.map(e=>'/bathrobe-moments/episodes/'+e.slug+'/'):[];
 const routes=[...episodeRoutes,...(production?['/bathrobe-moments/schedule/','/bathrobe-moments/episodes/']:[]),...(production?approval.approvedRoutes:[]),...entries.flat().filter(e=>production&&e.data.publish&&e.data.approvalStatus==='approved').map(e=>`/${e.data.slug}/`)];
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(routes)].filter(p=>!['/thank-you-page/','/form-error/','/404/'].includes(p)).map(p=>`<url><loc>https://lorenmichaelsharris.com${p}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
