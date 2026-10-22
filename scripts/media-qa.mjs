import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4323';
const previewResponse = await fetch(origin, {signal: AbortSignal.timeout(10000)});
if (!previewResponse.ok) throw new Error(`Preview is unavailable: HTTP ${previewResponse.status}`);
const browser = await chromium.launch({channel: 'chrome', headless: true});
const report = {origin, checkedAt: new Date().toISOString(), checks: [], realYouTube: [], errors: []};
async function check(name, run) {
  try {const details = await run(); report.checks.push({name, passed: true, ...details}); console.log(`PASS ${name}`);}
  catch (error) {report.checks.push({name, passed: false, error: error.message}); console.log(`FAIL ${name}: ${error.message}`);}
}
function assert(value, message) {if (!value) throw new Error(message);}
async function context(options = {}, mockYouTube = false) {
  const result = await browser.newContext({viewport: {width: 1440, height: 900}, ...options});
  if (mockYouTube) {
    await result.route('https://www.youtube-nocookie.com/**', route => route.fulfill({status: 200, contentType: 'text/html', body: '<html><body>Simulated player</body></html>'}));
    await result.addInitScript(() => {
      window.YT = {Player: class {
        constructor(_element, {events}) {this.events = events; this.muted = true; this.state = 2; setTimeout(() => events.onReady({target: this}), 10);}
        playVideo() {this.state = 1; this.events.onStateChange({data: 1});}
        pauseVideo() {this.state = 2; this.events.onStateChange({data: 2});}
        mute() {this.muted = true;}
        unMute() {this.muted = false;}
        isMuted() {return this.muted;}
        getPlayerState() {return this.state;}
        destroy() {}
      }};
    });
  }
  return result;
}
async function visit(ctx, route) {
  const page = await ctx.newPage();
  page.on('pageerror', error => report.errors.push({route, message: error.message}));
  await page.goto(origin + route, {waitUntil: 'domcontentloaded'});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => customElements.get('cinema-player'));
  return page;
}
const state = player => player.evaluate(element => element.youtube?.getPlayerState?.());

await check('Episodes and program testimonials do not load embeds before interaction', async () => {
  const ctx = await context();
  for (const route of ['/bathrobe-moments/', '/the-mindset-revolution/']) {
    const page = await visit(ctx, route);
    for (const player of await page.locator('cinema-player').all()) await player.scrollIntoViewIfNeeded();
    assert(await page.locator('cinema-player iframe, cinema-player video').count() === 0, `${route}: eagerly loaded media`);
    assert(await page.locator('cinema-player .cinema-watch').count() >= 3, `${route}: missing external links`);
    await page.close();
  }
  await ctx.close();
});

await check('Keyboard playback, focus transfer, mute, pause and resume call the YouTube API', async () => {
  const ctx = await context({}, true);
  const page = await visit(ctx, '/the-mindset-revolution/');
  const player = page.locator('cinema-player').first();
  await player.scrollIntoViewIfNeeded();
  await player.locator('.cinema-poster').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('cinema-player')?.youtube?.getPlayerState?.() === 1);
  assert(await player.locator('.cinema-toggle').evaluate(element => document.activeElement === element), 'Focus lost when poster disappeared');
  await player.locator('.cinema-sound').click();
  assert(await player.evaluate(element => !element.youtube.isMuted()), 'Sound button did not unmute');
  await player.locator('.cinema-sound').click();
  assert(await player.evaluate(element => element.youtube.isMuted()), 'Sound button did not mute');
  await player.locator('.cinema-toggle').click();
  assert(await state(player) === 2, 'Pause did not reach player');
  await player.locator('.cinema-toggle').click();
  assert(await state(player) === 1, 'Play did not resume player');
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('cinema-player')?.youtube?.getPlayerState?.() === 2);
  await ctx.close();
  return {engine: 'simulated YouTube API; real rendered component'};
});

await check('Local show introduction plays, pauses and mutes using the real media element', async () => {
  const ctx = await context();
  const page = await visit(ctx, '/bathrobe-moments/');
  const player = page.locator('cinema-player[data-kind="local"]');
  await player.scrollIntoViewIfNeeded();
  await player.locator('.cinema-poster').click();
  await page.waitForFunction(() => {const video = document.querySelector('cinema-player video'); return video && video.currentTime > 0 && !video.paused;});
  await player.locator('.cinema-toggle').click();
  assert(await player.locator('video').evaluate(video => video.paused), 'Local video did not pause');
  await player.locator('.cinema-sound').click();
  assert(await player.locator('video').evaluate(video => !video.muted), 'Local video did not unmute');
  await player.locator('.cinema-toggle').click();
  await page.waitForFunction(() => document.querySelector('cinema-player video')?.paused === false);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector('cinema-player video')?.paused === true);
  const duration = await player.locator('video').evaluate(video => video.duration);
  await ctx.close();
  return {durationSeconds: duration};
});

await check('Blocked YouTube network restores poster and retains external watch link', async () => {
  const ctx = await context();
  await ctx.route('https://www.youtube.com/iframe_api', route => route.abort('blockedbyclient'));
  const page = await visit(ctx, '/bathrobe-moments/');
  const player = page.locator('cinema-player').first();
  await player.locator('.cinema-poster').click();
  await player.locator('.cinema-status').filter({hasText: 'could not load'}).waitFor();
  assert(await player.locator('.cinema-poster').isVisible(), 'Fallback poster hidden');
  assert(await player.locator('.cinema-watch').isVisible(), 'External watch link hidden');
  assert(await player.locator('.cinema-watch').getAttribute('href') === 'https://www.youtube.com/watch?v=c7tWatGhdVM', 'External recording link incorrect');
  await ctx.close();
});

await check('No-JavaScript visitors retain poster links and readable media titles', async () => {
  const ctx = await context({javaScriptEnabled: false});
  const page = await ctx.newPage();
  await page.goto(origin + '/bathrobe-moments/', {waitUntil: 'domcontentloaded'});
  assert(await page.locator('cinema-player').count() === 7, 'Expected 6 recordings and one introduction');
  assert(await page.locator('cinema-player iframe, cinema-player video').count() === 0, 'Unexpected media embeds');
  for (const player of await page.locator('cinema-player').all()) {
    assert(await player.locator('.cinema-poster').getAttribute('href'), 'Poster destination missing');
    assert(await player.locator('.cinema-description strong').textContent(), 'Media title missing');
  }
  await ctx.close();
});

await check('Desktop homepage autoplay stays muted and preserves manual pause', async () => {
  const ctx = await context({}, true);
  const page = await visit(ctx, '/');
  const player = page.locator('cinema-player[data-autoplay="true"]').first();
  assert(await player.count() === 1, 'Homepage autoplay film missing');
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 1);
  assert(await player.evaluate(element => element.youtube.isMuted()), 'Automatic film not muted');
  await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 2);
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 1);
  await player.locator('.cinema-toggle').click();
  await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
  await page.waitForTimeout(250);
  await player.scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  assert(await state(player) === 2, 'Manual pause was overridden');
  await ctx.close();
  return {engine: 'simulated YouTube API; real rendered component'};
});

for (const scenario of [
  {name: 'Mobile', options: {viewport: {width: 390, height: 844}}},
  {name: 'Reduced motion', options: {reducedMotion: 'reduce'}},
  {name: 'Data saving', options: {}, saveData: true},
]) await check(`${scenario.name}: homepage film waits for a tap`, async () => {
  const ctx = await context(scenario.options, true);
  if (scenario.saveData) await ctx.addInitScript(() => Object.defineProperty(navigator, 'connection', {value: {saveData: true, addEventListener() {}}, configurable: true}));
  const page = await visit(ctx, '/');
  const player = page.locator('cinema-player[data-autoplay="true"]').first();
  assert(await player.count() === 1, 'Homepage autoplay film missing');
  await player.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  assert(await player.locator('iframe').count() === 0, 'Automatic embed loaded despite visitor preference');
  await player.locator('.cinema-poster').click();
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 1);
  await ctx.close();
});

await check('Changing to reduced motion stops an automatic film and leaves manual playback available', async () => {
  const ctx = await context({}, true);
  const page = await visit(ctx, '/');
  const player = page.locator('cinema-player[data-autoplay="true"]').first();
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 1);
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 2);
  await player.locator('.cinema-toggle').click();
  assert(await state(player) === 1, 'Reduced motion prevented an explicit play request');
  await ctx.close();
  return {engine: 'simulated YouTube API; real preference change'};
});

await check('A hidden document pauses playback', async () => {
  const ctx = await context({}, true);
  await ctx.addInitScript(() => {
    window.mediaTestHidden = false;
    Object.defineProperty(document, 'hidden', {get: () => window.mediaTestHidden, configurable: true});
  });
  const page = await visit(ctx, '/');
  const player = page.locator('cinema-player[data-autoplay="true"]').first();
  await player.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('cinema-player[data-autoplay="true"]')?.youtube?.getPlayerState?.() === 1);
  await page.evaluate(() => {window.mediaTestHidden = true; document.dispatchEvent(new Event('visibilitychange'));});
  assert(await state(player) === 2, 'Hidden document kept playing');
  await ctx.close();
  return {engine: 'simulated YouTube API and document visibility event'};
});

for (const scenario of [
  {route: '/', id: '4PyakES8UQ0', automatic: true},
  {route: '/bathrobe-moments/', id: 'c7tWatGhdVM'},
  {route: '/the-mindset-revolution/', id: '8d5Nzyy6u0A'},
]) {
  const result = {route: scenario.route, videoId: scenario.id, mode: scenario.automatic ? 'desktop automatic' : 'explicit play'};
  const ctx = await context();
  try {
    const page = await visit(ctx, scenario.route);
    const failures = [];
    page.on('requestfailed', request => {
      const url = new URL(request.url());
      if (/youtube|googlevideo/.test(url.hostname) && request.failure()?.errorText !== 'net::ERR_ABORTED')
        failures.push({host: url.hostname, path: url.pathname, failure: request.failure()?.errorText});
    });
    const player = page.locator(`cinema-player[data-video-id="${scenario.id}"]`).first();
    await player.scrollIntoViewIfNeeded();
    if (!scenario.automatic) await player.locator('.cinema-poster').click();
    const outcome = await page.waitForFunction(id => {
      const player = document.querySelector(`cinema-player[data-video-id="${id}"]`);
      if (player?.youtube?.getPlayerState?.() === 1 && player.youtube.getCurrentTime() > 0) return 'playing';
      if (player?.querySelector('.cinema-status')?.textContent?.includes('could not load')) return 'fallback';
      return false;
    }, scenario.id, {timeout: 30000}).then(handle => handle.jsonValue()).catch(error => {result.waitError = error.message; return 'not-playing';});
    result.outcome = outcome;
    result.message = await player.locator('.cinema-status').textContent();
    result.requestFailures = failures;
    if (outcome === 'playing') {
      result.mutedInitially = await player.evaluate(element => element.youtube.isMuted());
      const started = await player.evaluate(element => element.youtube.getCurrentTime());
      await page.waitForFunction(({id, started}) => document.querySelector(`cinema-player[data-video-id="${id}"]`)?.youtube?.getCurrentTime?.() > started + .4, {id: scenario.id, started}, {timeout: 10000});
      result.playbackAdvanced = true;
      await player.locator('.cinema-toggle').click();
      await page.waitForFunction(id => document.querySelector(`cinema-player[data-video-id="${id}"]`)?.youtube?.getPlayerState?.() === 2, scenario.id);
      result.pauseConfirmed = true;
      await player.locator('.cinema-sound').click();
      await page.waitForFunction(id => document.querySelector(`cinema-player[data-video-id="${id}"]`)?.youtube?.isMuted?.() === false, scenario.id);
      result.soundConfirmed = true;
      await player.locator('.cinema-sound').click();
      await player.locator('.cinema-toggle').click();
      await page.waitForFunction(id => document.querySelector(`cinema-player[data-video-id="${id}"]`)?.youtube?.getPlayerState?.() === 1, scenario.id);
      result.resumeConfirmed = true;
      await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
      await page.waitForFunction(id => document.querySelector(`cinema-player[data-video-id="${id}"]`)?.youtube?.getPlayerState?.() === 2, scenario.id);
      result.offscreenPauseConfirmed = true;
    } else {
      result.fallbackAvailable = await player.locator('.cinema-watch').isVisible();
      result.frames = await Promise.all(page.frames().filter(frame => frame.url().includes('youtube-nocookie.com/embed/')).map(async frame => ({
        text: (await frame.locator('body').innerText().catch(() => '')).slice(0, 500),
      })));
    }
  } catch (error) {result.outcome = 'failed'; result.error = error.message;}
  finally {await ctx.close();}
  report.realYouTube.push(result);
  console.log(`REAL YOUTUBE ${scenario.route}: ${result.outcome}`);
}

await browser.close();
await fs.writeFile('docs/media-qa.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({passed: report.checks.filter(check => check.passed).length, failed: report.checks.filter(check => !check.passed).length, realYouTube: report.realYouTube, errors: report.errors}, null, 2));
process.exitCode = report.checks.some(check => !check.passed) || report.realYouTube.some(check => check.outcome !== 'playing') || report.errors.length ? 1 : 0;
