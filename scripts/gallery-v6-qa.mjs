import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];const record=s=>{results.push(s);console.log(s)};
try{
for(const width of [320,390,768,1024,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await context.newPage();
 for(const path of ['/','/about/','/bathrobe-moments/','/the-mindset-revolution/','/testimonials/','/results/','/blog/','/resources/']){
  await page.goto(base+path,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('h1').count(),1,path);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${path} overflow`);
  const books=await page.locator('a[href="https://fromsplinteredtocentered.com/"]').evaluateAll(as=>as.map(a=>({target:a.target,rel:a.rel,label:a.getAttribute('aria-label')})));
  assert.ok(books.every(a=>a.target==='_blank'&&a.rel.includes('noopener')&&a.rel.includes('noreferrer')&&a.label?.includes('new tab')),path+' book links');
  if(['/','/the-mindset-revolution/','/testimonials/'].includes(path))assert.equal(await page.locator('.portrait-gallery .story-card:not([data-clone])').count(),9,path+' nine videos');
  assert.equal(await page.locator('.story-watch,.cinema-caption,.cinema-controls').count(),0);
  if(width<1400){await page.locator('.mobile-nav summary').click();assert.ok(await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Blog',exact:true}).isVisible());await page.locator('.mobile-nav summary').click();}
  else assert.ok(await page.locator('.desktop-nav').getByRole('link',{name:'Blog',exact:true}).isVisible());
  if(path==='/')assert.equal(await page.locator('.home-blog-grid article').count(),3);
  if(path==='/blog/')assert.equal(await page.locator('.article-card').count(),11);
 }
 await context.close();record(`${width}px: eight routes, no horizontal overflow; books, Blog, nine testimonials and clean controls verified`);
}
const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
await page.goto(base+'/the-mindset-revolution/');const gallery=page.locator('.portrait-gallery');const row=gallery.locator('[data-carousel-row]');await row.scrollIntoViewIfNeeded();await page.mouse.move(5,5);await page.waitForTimeout(500);const x=()=>row.evaluate(r=>r.scrollLeft);const a=await x();await page.waitForTimeout(1000);assert.ok(Math.abs(await x()-a)>15);record('Desktop gallery advances continuously');
await gallery.locator('[data-carousel-pause]').click();let b=await x();await page.waitForTimeout(500);assert.ok(Math.abs(await x()-b)<2);assert.equal(await gallery.getAttribute('data-preview-paused'),'true');await gallery.locator('[data-carousel-pause]').click();await page.mouse.move(5,5);
const first=gallery.locator('.story-card').filter({visible:true}).first();await first.hover();await page.waitForTimeout(100);b=await x();await page.waitForTimeout(500);assert.ok(Math.abs(await x()-b)<2);await page.mouse.move(5,5);await page.waitForTimeout(500);assert.ok(Math.abs(await x()-b)>5);record('Single pause button and card-only hover pause work');
const bounds=await row.boundingBox();await page.mouse.move(bounds.x+600,bounds.y+200);await page.mouse.down();await page.mouse.move(bounds.x+350,bounds.y+200,{steps:15});await page.mouse.up();assert.ok(!await page.locator('.watch-dialog').evaluate(d=>d.open));record('Dragging does not activate playback');
await gallery.locator('[data-carousel-pause]').click();const local=gallery.locator('.story-card[data-video-src]').first();await local.scrollIntoViewIfNeeded();const opener=local.locator('[data-watch]');await page.waitForTimeout(400);await opener.click();assert.ok(await page.locator('.watch-dialog').evaluate(d=>d.open));assert.equal(await page.locator('.watch-dialog video').count(),1);assert.equal(await page.locator('.preview-playing').count(),0);await page.keyboard.press('Escape');assert.ok(!await page.locator('.watch-dialog').evaluate(d=>d.open));assert.ok(await opener.evaluate(el=>el===document.activeElement));record('Local full video dialog, preview suppression, Escape and focus restoration pass');
await page.goto(base+'/');await page.locator('.work-menu-toggle').click();assert.equal(await page.locator('.work-menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.work-menu-toggle').getAttribute('aria-expanded'),'false');record('Desktop service menu supports Escape');
await page.setViewportSize({width:720,height:500});assert.ok(await page.locator('.mobile-nav').isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));record('200% equivalent viewport uses readable collapsed navigation');await context.close();
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}});const p=await nojs.newPage();for(const path of ['/','/about/','/bathrobe-moments/','/the-mindset-revolution/']){await p.goto(base+path);assert.ok(await p.locator('.story-card [data-watch]').count()>=3);assert.equal(await p.locator('.silent-preview iframe,.silent-preview video').count(),0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}await nojs.close();record('No-JavaScript galleries retain recording links and posters');
await fs.writeFile('docs/gallery-v6-qa.json',JSON.stringify({testedAt:new Date().toISOString(),base,results},null,2));
}finally{await browser.close()}

