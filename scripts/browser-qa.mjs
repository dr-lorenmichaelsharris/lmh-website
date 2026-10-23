import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4321';
const routes=['/','/services/speaking/','/services/coaching/','/services/keynote-writing/','/about/','/the-mindset-revolution/','/results/','/testimonials/','/case-studies-client-stories/','/services/','/resources/','/blog/','/these-branches-are-many/','/privacy-policy/','/bathrobe-moments/','/bathrobe-moments/apply/?package=silver','/contact/?service=speaking','/vault/','/faqs/','/important-links/','/media-kit/','/thank-you-page/','/form-error/','/missing-page/'];
const previous=process.env.QA_QUICK?JSON.parse(await fs.readFile('docs/browser-qa.json','utf8')):{viewports:[],errors:[]};
const report={viewports:previous.viewports,accessibility:[],checks:[],errors:previous.errors};
for(const width of (process.env.QA_QUICK?[]:[320,390,768,1024,1440])){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();
 for(const route of routes){
  await page.goto(origin+route,{waitUntil:'networkidle'});
  await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
  await page.evaluate(()=>scrollTo(0,0));
  await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));
  if(overflow||broken.length)report.errors.push({width,route,overflow,broken});
  const slug=route.split('?')[0].replaceAll('/','-')||'home';
  await page.screenshot({path:`docs/screenshots/${width}${slug}.png`,fullPage:true});
  report.viewports.push({width,route,overflow,broken});
 }
 await context.close();console.log(`Captured ${width}px: ${routes.length} layouts`);
}
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await context.newPage();
for(const route of ['/','/the-mindset-revolution/','/bathrobe-moments/','/services/speaking/','/contact/?service=keynote-writing','/bathrobe-moments/apply/?package=gold','/these-branches-are-many/','/privacy-policy/','/faqs/']){
 await page.goto(origin+route,{waitUntil:'networkidle'});const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 report.accessibility.push({route,violations:scan.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
}
await page.goto(origin+'/');await page.keyboard.press('Tab');report.checks.push({name:'First keyboard target is skip link',pass:await page.evaluate(()=>document.activeElement?.textContent==='Skip to content')});await page.keyboard.press('Enter');report.checks.push({name:'Skip link targets main',pass:await page.evaluate(()=>location.hash==='#content')});
await page.setViewportSize({width:390,height:844});await page.goto(origin+'/');await page.locator('.mobile-nav summary').focus();await page.keyboard.press('Enter');report.checks.push({name:'Native mobile menu opens with keyboard',pass:await page.locator('.mobile-nav').evaluate(e=>e.hasAttribute('open'))});
await page.goto(origin+'/bathrobe-moments/apply/?package=silver');report.checks.push({name:'Legacy package URL retains full guest application without stale prices',pass:await page.locator('#field-headshot').count()===1&&await page.locator('select[name=package]').count()===0});
await page.goto(origin+'/contact/?service=speaking');await page.locator('#field-name').fill('Local QA');await page.locator('#field-email').fill('qa@example.test');await page.locator('#field-message').fill('Local only validation check.');await page.locator('input[name=acknowledgment]').check();await Promise.all([page.waitForURL('**/api/submit/'),page.getByRole('button',{name:'Send inquiry'}).click()]);await page.waitForLoadState('networkidle');
report.checks.push({name:'Unavailable delivery preserves input',pass:(await page.locator('#field-name').inputValue())==='Local QA'&&await page.getByRole('heading',{name:'Your message has not been sent.'}).count()===1});
await context.close();
const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(origin+'/');report.checks.push({name:'No-JavaScript essential content',pass:await plain.locator('h1').count()===1&&await plain.getByRole('link',{name:'Discuss your event',exact:false}).count()>0});await plain.goto(origin+'/contact/?service=program');report.checks.push({name:'No-JavaScript service form',pass:await plain.locator('input[name=service]').first().inputValue()==='program'});await plain.goto(origin+'/the-mindset-revolution/');report.checks.push({name:'All twelve curriculum modules render without JavaScript',pass:await plain.locator('.mindset-module').count()===12});await plain.locator('.mindset-module summary').first().focus();await plain.keyboard.press('Enter');report.checks.push({name:'Curriculum opens with keyboard without JavaScript',pass:await plain.locator('.mindset-module').first().evaluate(el=>el.open)});await nojs.close();
await browser.close();await fs.writeFile('docs/browser-qa.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({layouts:report.viewports.length,layoutErrors:report.errors,axe:report.accessibility,checks:report.checks},null,2));
if(report.errors.length||report.accessibility.some(a=>a.violations.length)||report.checks.some(c=>!c.pass))process.exitCode=1;
