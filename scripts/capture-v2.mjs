import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
for (const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const [name,path] of [['home','/'],['program','/the-mindset-revolution/'],['show','/bathrobe-moments/']]) {
  await page.goto('http://127.0.0.1:4323'+path,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;for(const im of document.images){im.loading='eager';await im.decode().catch(()=>{});}});
  await page.screenshot({path:`docs/comparison-v2/after-${name}-${width}.png`});
  await page.screenshot({path:`docs/comparison-v2/after-${name}-${width}-full.png`,fullPage:true});
  console.log(name,width,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,body:getComputedStyle(document.body).fontSize,h1:document.querySelector('h1').getBoundingClientRect().height})));
 }
 await page.close();
}
await browser.close();
