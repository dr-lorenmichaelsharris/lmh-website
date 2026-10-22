import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const [program] = JSON.parse(await fs.readFile('src/data/programs.json', 'utf8'));

test('program schedule completes all classes in month one and covers every coaching week once', () => {
  assert.equal(program.durationWeeks, 12);
  assert.equal(program.classCount, 12);
  assert.equal(program.classesPerWeek, 3);
  assert.equal(program.curriculumWeeks, 4);
  assert.equal(program.classesPerWeek * program.curriculumWeeks, program.classCount);
  assert.equal(program.coachingCalls, program.durationWeeks);
  assert.equal(program.callMinutes, 60);
  const coveredWeeks = program.phases.flatMap((phase: {startWeek:number; endWeek:number}) =>
    Array.from({length:phase.endWeek-phase.startWeek+1}, (_,index) => phase.startWeek+index));
  assert.deepEqual(coveredWeeks, Array.from({length:12}, (_,index) => index+1));
  assert.deepEqual(program.phases.map((phase:{title:string}) => phase.title), [
    'Personal Transformation', 'Purpose Activation', 'Build the Roadmap',
  ]);
});

test('the blueprint curriculum retains all 12 unique modules, exercises, and four ordered groups', () => {
  assert.deepEqual(program.modules.map((module:{number:number}) => module.number), Array.from({length:12}, (_,index) => index+1));
  assert.deepEqual(program.modules.map((module:{group:string}) => module.group),
    ['Recognize','Reframe','Reclaim','Rise'].flatMap(group => Array(3).fill(group)));
  assert.equal(new Set(program.modules.map((module:{title:string}) => module.title)).size,12);
  assert.equal(program.modules[0].title,'The Beginning of Your Next Chapter');
  assert.equal(program.modules[11].title,'Living from the Power Within');
  for (const module of program.modules) {
    assert.ok(module.purpose.length > 30);
    assert.ok(module.exercise.length > 20);
  }
  assert.equal(program.deliverables.length,6);
  assert.equal(program.pathways.length,8);
  assert.equal(new Set(program.pathways.map((pathway:{title:string}) => pathway.title)).size,8);
});

test('access and support preserve the blueprint limits and separately contracted production', () => {
  assert.match(program.sourceUrl,/mindset_revolution_program_blueprint\.html$/);
  assert.match(program.accessTerms,/written enrollment terms/);
  assert.match(program.accessTerms,/availability and continuity/);
  const active = program.supportTerms.active.join(' ');
  const alumni = program.supportTerms.alumni.join(' ');
  assert.match(active,/two business days/);
  assert.match(active,/Unused weekly calls do not accumulate/);
  assert.match(alumni,/Six complimentary, 60-minute/);
  assert.match(alumni,/per calendar year/);
  assert.match(alumni,/one included alumni session every two months/);
  assert.match(alumni,/do not roll over/);
  assert.match(alumni,/non-transferable/);
  assert.match(program.supportTerms.studio,/separately scoped, contracted, scheduled, and paid/);
  assert.match(program.supportTerms.studio,/not required for enrollment/);
  assert.match(program.supportTerms.opportunities,/not guaranteed/);
});
