import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:4322';
const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
for(const route of ['/','/services/speaking/','/contact/?service=speaking','/these-branches-are-many/']){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const page=await context.newPage();
 await page.addInitScript(()=>{window.__lmhPerf={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lmhPerf.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__lmhPerf.cls+=e.value}).observe({type:'layout-shift',buffered:true});});
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,downloadThroughput:200000,uploadThroughput:93750,latency:150});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.goto(origin+route,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
 const inline=await page.locator('script:not([src]):not([type="application/ld+json"])').allTextContents();
 results.push({route,inlineJavaScriptGzipBytes:inline.reduce((n,s)=>n+(s.trim()?gzipSync(s).length:0),0),...await page.evaluate(()=>({...window.__lmhPerf,navigationMs:performance.getEntriesByType('navigation')[0].duration,externalJsResources:performance.getEntriesByType('resource').filter(r=>r.initiatorType==='script').length}))});await context.close();
}
await browser.close();let jsBytes=0;for(const name of await fs.readdir('dist/client/_astro'))if(name.endsWith('.js'))jsBytes+=gzipSync(await fs.readFile('dist/client/_astro/'+name)).length;
const report={method:'Single cold Chromium run per page on local built Node server. 390×844, 4× CPU slowdown, 150ms latency, 1.6Mbps download. Lab observations, not field Core Web Vitals; INP not measured.',results,allExternalJavaScriptGzipBytes:jsBytes};await fs.writeFile('docs/performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
