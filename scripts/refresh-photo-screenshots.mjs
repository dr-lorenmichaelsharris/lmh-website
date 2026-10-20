import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4324';
for(const width of [320,390,768,1024,1440]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const route of ['/','/about/','/services/speaking/']){
  await page.goto(origin+route,{waitUntil:'networkidle'});
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
  await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  await page.screenshot({path:`docs/screenshots/${width}${route.replaceAll('/','-')}.png`,fullPage:true});
  if(route==='/'&&[390,1440].includes(width))await page.screenshot({path:`docs/screenshots/${width}-home-first-screen.png`});
 }
 await page.close();
}await browser.close();console.log('Refreshed 15 photograph layouts after scrolling each image into view and awaiting decode.');
