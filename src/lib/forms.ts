import {createHash,randomBytes} from 'node:crypto';
import {packages,serviceIntents} from '../data/site.ts';
export const intents=serviceIntents;
export const packageIds=packages.map(p=>p.id);
export type Values=Record<string,string>;
type Receipt={service:string;package:string;local:boolean;expires:number};
type Result={status:number;errors?:Values;message?:string;receipt?:string;duplicate?:boolean};
const receipts=new Map<string,Receipt>();
const attempts=new Map<string,{count:number;expires:number}>();
const accepted=new Map<string,{token:string;expires:number}>();
const inflight=new Map<string,Promise<Result>>();
const windowMs=600_000;
export function validate(values:Values){
 const errors:Values={};
 if(!intents.includes(values.service as typeof intents[number]))errors.service='Choose a valid inquiry type.';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email||'')||(values.email||'').length>254)errors.email='Enter a valid email address.';
 if(values.service==='newsletter'){if(values.consent!=='yes')errors.consent='Please confirm that you want email updates.';}
 else {
  if(!(values.name||'').trim()||(values.name||'').length>120)errors.name='Enter your name (up to 120 characters).';
  if((values.message||'').trim().length<10||(values.message||'').length>5000)errors.message='Write a message between 10 and 5,000 characters.';
  if(values.acknowledgment!=='yes')errors.acknowledgment='Please acknowledge the privacy information and request a reply.';
 }
 if(values.package&&(!packageIds.includes(values.package as typeof packageIds[number])||values.service!=='guest'))errors.package='Choose a valid guest package preference.';
 for(const [key,v] of Object.entries(values))if(!['message','email','name'].includes(key)&&v.length>500)errors[key]='Keep this field under 500 characters.';
 return errors;
}
export function readReceipt(token:string|undefined){
 const r=token?receipts.get(token):undefined;return r&&r.expires>Date.now()?r:undefined;
}
export interface FormEnvironment {SITE_ENV?:string;FORM_ADAPTER?:string;LOCAL_TEST_MODE?:string;FORMS_APPROVED?:string;INQUIRY_WEBHOOK_URL?:string;NEWSLETTER_WEBHOOK_URL?:string;FORM_WEBHOOK_TOKEN?:string;LOCAL_TEST_OUTCOME?:string;}
export async function submit(values:Values, context:{ip:string;origin:string;env:FormEnvironment}, delivery:typeof fetch=fetch):Promise<Result>{
 const now=Date.now();
 for(const [key,v] of attempts)if(v.expires<now)attempts.delete(key);
 for(const [key,v] of accepted)if(v.expires<now)accepted.delete(key);
 for(const [key,v] of receipts)if(v.expires<now)receipts.delete(key);
 const errors=validate(values);if(Object.keys(errors).length)return {status:422,errors};
 if(values.company_url)return {status:400,message:'Unable to accept this submission.'};
 const hash=createHash('sha256').update(JSON.stringify(Object.entries(values).sort())).digest('hex');
 const previous=accepted.get(hash);if(previous)return {status:303,receipt:previous.token,duplicate:true};
 if(inflight.has(hash))return inflight.get(hash)!;
 const key=createHash('sha256').update(context.ip).digest('hex');
 const rate=attempts.get(key)||{count:0,expires:now+windowMs};rate.count++;attempts.set(key,rate);
 if(rate.count>8)return {status:429,message:'Too many attempts. Please try again later or use email.'};
 const task=(async():Promise<Result>=>{
  const env=context.env;let local=false;
  if(env.FORM_ADAPTER==='local'){
   const host=new URL(context.origin).hostname;
   if(env.SITE_ENV==='production'||env.LOCAL_TEST_MODE!=='true'||!['127.0.0.1','localhost','[::1]'].includes(host))return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
   if(env.LOCAL_TEST_OUTCOME==='failure')return {status:502,message:'Local test: delivery failed. No email was sent.'};
   local=true;
  }else if(env.FORM_ADAPTER==='webhook'&&env.FORMS_APPROVED==='true'){
   const endpoint=values.service==='newsletter'?env.NEWSLETTER_WEBHOOK_URL:env.INQUIRY_WEBHOOK_URL;
   if(!endpoint||!endpoint.startsWith('https://')||!env.FORM_WEBHOOK_TOKEN)return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
   try{
    const response=await delivery(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.FORM_WEBHOOK_TOKEN}`,'Idempotency-Key':hash},body:JSON.stringify({kind:values.service,fields:values}),signal:AbortSignal.timeout(10000),redirect:'error'});
    if(!response.ok)return {status:502,message:'The delivery service could not accept your inquiry. Please retry or use email.'};
   }catch{return {status:502,message:'The delivery service could not be reached. Please retry or use email.'};}
  }else return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
  const token=randomBytes(32).toString('hex');
  receipts.set(token,{service:values.service,package:values.package||'',local,expires:Date.now()+windowMs});accepted.set(hash,{token,expires:Date.now()+windowMs});
  return {status:303,receipt:token};
 })();inflight.set(hash,task);try{return await task;}finally{inflight.delete(hash);}
}
export function resetTestState(){receipts.clear();attempts.clear();accepted.clear();inflight.clear();}
export function paymentBoundary(){return {enabled:false,state:'unavailable',reason:'Approved terms and payment product mappings are required.'} as const;}
