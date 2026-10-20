import fs from 'node:fs/promises';
import {load} from 'cheerio';
const index=JSON.parse(await fs.readFile('docs/evidence/wordpress-public-index.json','utf8'));
const articles=[],policies=[];
const text=html=>load(html).text().trim();
function sanitize(html,policy=false){const $=load(html,null,false);$('script,style,form,iframe,input,button,svg,img,video,audio').remove();$('h1').remove();if(policy){$('[data-widget_type="form.default"]').remove();$('h5').each((_,el)=>{const h=$('<h2>').text($(el).text());$(el).replaceWith(h)});}
 $('*').each((_,el)=>{for(const attr of Object.keys(el.attribs||{})){if(!['href','title'].includes(attr))$(el).removeAttr(attr);} if(el.tagName==='a'){let href=$(el).attr('href')||'';if(href.startsWith('https://lorenmichaelsharris.com/'))$(el).attr('href',new URL(href).pathname);if(!/^(https:\/\/|mailto:|\/|#)/.test($(el).attr('href')||''))$(el).removeAttr('href');}});
 $('div,span').each((_,el)=>{$(el).replaceWith($(el).contents())});return $.html();}
for(const entry of index){let raw;try{raw=JSON.parse(await fs.readFile(`docs/evidence/raw/${entry.id}.json`,'utf8'))}catch{continue}
 const base={id:entry.slug,slug:entry.slug,title:text(raw.title.rendered),sourceUrl:entry.link,approvalStatus:'pending',publish:false};
 if(entry.kind==='posts'){const body=sanitize(raw.content.rendered);articles.push({...base,date:entry.date,author:raw._embedded?.author?.[0]?.name||'Shakil Hossain',body,excerpt:text(body).slice(0,175)+'…',archive:['windy-meyer','cheryl-angela','faith-jordan'].includes(entry.slug)});}else{policies.push({...base,body:sanitize(raw.content.rendered,true)})}}
await fs.writeFile('src/data/articles.json',JSON.stringify(articles,null,2));await fs.writeFile('src/data/policies.json',JSON.stringify(policies,null,2));
console.log(`Migrated ${articles.length} articles and ${policies.length} policies. Original substantive text retained; pending approval and excluded from release.`);
