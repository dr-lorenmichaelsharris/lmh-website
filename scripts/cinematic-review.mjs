import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4321';
const browser=await chromium.launch({channel:'chrome',headless:true});
await fs.mkdir('docs/comparison',{recursive:true});
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const [label,url] of [['original','https://lorenmichaelsharris.com/'],['after',origin+'/'],['speaking',origin+'/services/speaking/']]){
  await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  if(label!=='original'){await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete));}
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode().catch(()=>{}));} await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:`docs/comparison/${label}-${width}.png`});
  if(label!=='original')await page.screenshot({path:`docs/comparison/${label}-${width}-full.png`,fullPage:true});
 }
 await page.close();
}
await browser.close();console.log('Comparison screenshots captured.');
