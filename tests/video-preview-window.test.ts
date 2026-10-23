import test from 'node:test';
import assert from 'node:assert/strict';
import {previewRatio,previewWindow} from '../src/lib/video-preview-window.ts';
test('conversation excerpts are stable, distinct and in the middle of the recording',()=>{
 const ids=['geoff','mavis','lee','brett','grace','alice'];
 const ratios=ids.map(previewRatio);
 assert.equal(new Set(ratios).size,6);
 for(const [i,ratio] of ratios.entries()){
  assert.ok(ratio>=.35&&ratio<=.65);
  assert.equal(previewRatio(ids[i]),ratio);
  const window=previewWindow(3600,ratio)!;
  assert.ok(window.start>=1260&&window.start<=2340);
  assert.equal(window.end-window.start,20);
 }
});
test('unknown duration stays on the poster; short excerpts stay inside the recording',()=>{
 assert.equal(previewWindow(0,.4),undefined);
 assert.equal(previewWindow(NaN,.4),undefined);
 assert.equal(previewWindow(100),undefined);
 const window=previewWindow(12,.6)!;
 assert.ok(window.start<window.end&&window.end<12);
});
