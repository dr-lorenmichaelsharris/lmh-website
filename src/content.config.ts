import { defineCollection } from 'astro:content';
import {z} from 'astro/zod';
import { file } from 'astro/loaders';
const provenance={sourceUrl:z.url(),approvalStatus:z.enum(['pending','approved']),publish:z.boolean()};
const articles=defineCollection({loader:file('src/data/articles.json'),schema:z.object({title:z.string(),date:z.string(),author:z.string(),slug:z.string(),body:z.string(),excerpt:z.string(),archive:z.boolean(),...provenance})});
const policies=defineCollection({loader:file('src/data/policies.json'),schema:z.object({title:z.string(),slug:z.string(),body:z.string(),...provenance})});
const services=defineCollection({loader:file('src/data/services.json'),schema:z.object({title:z.string(),slug:z.string(),audience:z.string(),summary:z.string(),deliverables:z.array(z.string()),process:z.array(z.string()),...provenance})});
const testimonials=defineCollection({loader:file('src/data/testimonials.json'),schema:z.object({quote:z.string(),excerpt:z.string().optional(),person:z.string(),role:z.string().optional(),service:z.string(),previewOnly:z.boolean().default(false),...provenance})});
const caseStudies=defineCollection({loader:file('src/data/case-studies.json'),schema:z.object({title:z.string(),challenge:z.string(),work:z.string(),outcome:z.string(),...provenance})});
const episodes=defineCollection({loader:file('src/data/episodes.json'),schema:z.object({title:z.string(),guest:z.string(),date:z.string().optional(),watchUrl:z.url(),summary:z.string(),status:z.enum(['archive','published','upcoming']),...provenance})});
const downloads=defineCollection({loader:file('src/data/downloads.json'),schema:z.object({title:z.string(),path:z.string().startsWith('/'),format:z.string(),context:z.string(),...provenance})});
const programs=defineCollection({loader:file('src/data/programs.json'),schema:z.object({
 title:z.string(),subtitle:z.string(),summary:z.string(),durationWeeks:z.number().int().positive(),
 classCount:z.number().int().positive(),classesPerWeek:z.number().int().positive(),curriculumWeeks:z.number().int().positive(),coachingCalls:z.number().int().positive(),callMinutes:z.number().int().positive(),
 phases:z.array(z.object({id:z.string(),title:z.string(),weeks:z.string(),startWeek:z.number().int(),endWeek:z.number().int(),description:z.string(),activities:z.array(z.string())})),
 framework:z.array(z.object({title:z.string(),description:z.string()})),
 modules:z.array(z.object({number:z.number().int(),group:z.enum(['Recognize','Reframe','Reclaim','Rise']),title:z.string(),purpose:z.string(),exercise:z.string()})),
 deliverables:z.array(z.object({title:z.string(),description:z.string()})),pathways:z.array(z.object({title:z.string(),description:z.string()})),
 inclusions:z.array(z.string()),accessTerms:z.string(),supportTerms:z.object({active:z.array(z.string()),alumni:z.array(z.string()),studio:z.string(),scope:z.string(),opportunities:z.string()}),...provenance
})});
export const collections={articles,policies,services,testimonials,caseStudies,episodes,downloads,programs};
