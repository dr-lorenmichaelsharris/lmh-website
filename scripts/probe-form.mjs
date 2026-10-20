import {chromium} from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await page.goto('http://127.0.0.1:4321/contact/?service=speaking');
await page.locator('#field-name').fill('Local QA');await page.locator('#field-email').fill('qa@example.test');await page.locator('#field-message').fill('Local only validation check.');await page.locator('input[name=acknowledgment]').check();
const response=page.waitForResponse(r=>r.url().includes('/api/submit/')&&r.request().method()==='POST');
await page.getByRole('button',{name:'Send inquiry'}).click();const res=await response;await page.waitForURL('**/api/submit/');
console.log(JSON.stringify({status:res.status(),url:page.url(),heading:await page.locator('h1').allTextContents(),name:await page.locator('#field-name').inputValue(),alert:await page.locator('[role=alert]').allTextContents()},null,2));
await page.screenshot({path:'docs/comparison/form-retry.png',fullPage:true});await browser.close();
