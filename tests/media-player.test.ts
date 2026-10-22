import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shouldAutoPlay, youtubeEmbedUrl, type PlaybackEnvironment} from '../src/lib/media-playback.ts';

const eligible: PlaybackEnvironment = {
  autoplayRequested: true, viewportWidth: 1440, visibleRatio: 0.5,
  reducedMotion: false, saveData: false, pageHidden: false, manuallyPaused: false, ended: false,
};

test('automatic films require desktop visibility and respect visitor preferences and pause', () => {
  assert.equal(shouldAutoPlay(eligible), true);
  for (const change of [
    {autoplayRequested: false}, {viewportWidth: 1023}, {visibleRatio: 0.49},
    {reducedMotion: true}, {saveData: true}, {pageHidden: true}, {manuallyPaused: true}, {ended: true},
  ]) assert.equal(shouldAutoPlay({...eligible, ...change}), false, JSON.stringify(change));
  assert.equal(shouldAutoPlay({...eligible, viewportWidth: 1024}), true);
});

test('YouTube embeds carry the current origin and remain muted without URL autoplay', () => {
  const url = new URL(youtubeEmbedUrl('dQw4w9WgXcQ', 'https://example.com'));
  assert.equal(url.hostname, 'www.youtube-nocookie.com');
  assert.equal(url.searchParams.get('origin'), 'https://example.com');
  assert.equal(url.searchParams.get('enablejsapi'), '1');
  assert.equal(url.searchParams.get('autoplay'), '0');
  assert.equal(url.searchParams.get('mute'), '1');
  assert.throws(() => youtubeEmbedUrl('../bad', 'https://example.com'));
});
