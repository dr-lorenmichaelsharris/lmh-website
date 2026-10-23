import {createHash,randomBytes,createHmac,timingSafeEqual} from 'node:crypto';
import {packages,serviceIntents} from '../data/site.ts';
export const intents=serviceIntents;
export const packageIds=packages.map(p=>p.id);
export type Values=Record<string,string>;
type Receipt={service:string;package:string;local:boolean;expires:number};
type Result={status:number;errors?:Values;message?:string;receipt?:string;duplicate?:boolean};
const localReceiptSecret=randomBytes(32).toString('hex');
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
 if(values.service==='guest'&&((values.topic||'').trim().length<10||(values.topic||'').length>5000))errors.topic='Describe your proposed topic in 10 to 5,000 characters.';
 if(values.package&&(!packageIds.includes(values.package as typeof packageIds[number])||values.service!=='guest'))errors.package='Choose a valid guest package preference.';
 for(const [key,v] of Object.entries(values))if(!['message','topic','email','name'].includes(key)&&v.length>500)errors[key]='Keep this field under 500 characters.';
 return errors;
}
function receiptKey(env:FormEnvironment){return env.RECEIPT_SECRET || env.FORM_WEBHOOK_TOKEN || (env.FORM_ADAPTER==='local'?localReceiptSecret:'');}
function signReceipt(receipt:Receipt,secret:string){const body=Buffer.from(JSON.stringify(receipt)).toString('base64url');return body+'.'+createHmac('sha256',secret).update(body).digest('base64url');}
export function readReceipt(token:string|undefined,secret=process.env.RECEIPT_SECRET||process.env.FORM_WEBHOOK_TOKEN||localReceiptSecret){
 try{if(!token||token.length>2048)return;const [body,signature,...extra]=token.split('.');if(extra.length||!body||!signature)return;const expected=createHmac('sha256',secret).update(body).digest();const actual=Buffer.from(signature,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return;const r=JSON.parse(Buffer.from(body,'base64url').toString()) as Receipt;return typeof r.expires==='number'&&r.expires>Date.now()&&intents.includes(r.service as typeof intents[number])?r:undefined;}catch{return;}
}
export type Headshot={name:string;type:string;bytes:Uint8Array};
export function validateHeadshot(file:Headshot|undefined){
 if(!file||!file.bytes.length)return 'Choose a professional headshot.';
 if(file.bytes.length>2*1024*1024)return 'Choose a headshot smaller than 2 MB.';
 const b=Buffer.from(file.bytes);const jpeg=b[0]===255&&b[1]===216&&b[2]===255;const png=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const webp=b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
 if(!((file.type==='image/jpeg'&&jpeg)||(file.type==='image/png'&&png)||(file.type==='image/webp'&&webp)))return 'Choose a valid JPEG, PNG, or WebP headshot.';
}
export interface FormEnvironment {SITE_ENV?:string;FORM_ADAPTER?:string;LOCAL_TEST_MODE?:string;FORMS_APPROVED?:string;INQUIRY_WEBHOOK_URL?:string;NEWSLETTER_WEBHOOK_URL?:string;FORM_WEBHOOK_TOKEN?:string;LOCAL_TEST_OUTCOME?:string;RESEND_API_KEY?:string;RESEND_FROM?:string;RECEIPT_SECRET?:string;}
export async function submit(values:Values, context:{ip:string;origin:string;env:FormEnvironment;headshot?:Headshot}, delivery:typeof fetch=fetch):Promise<Result>{
 const now=Date.now();
 for(const [key,v] of attempts)if(v.expires<now)attempts.delete(key);
 for(const [key,v] of accepted)if(v.expires<now)accepted.delete(key);

 const errors=validate(values);if(values.service==='guest'){const error=validateHeadshot(context.headshot);if(error)errors.headshot=error;}if(Object.keys(errors).length)return {status:422,errors};
 if(values.company_url)return {status:400,message:'Unable to accept this submission.'};
 const hash=createHash('sha256').update(JSON.stringify(Object.entries(values).sort())).update(context.headshot?.bytes||'').digest('hex');
 const previous=accepted.get(hash);if(previous)return {status:303,receipt:previous.token,duplicate:true};
 if(inflight.has(hash))return inflight.get(hash)!;
 const key=createHash('sha256').update(context.ip).digest('hex');
 const rate=attempts.get(key)||{count:0,expires:now+windowMs};rate.count++;attempts.set(key,rate);
 if(rate.count>8)return {status:429,message:'Too many attempts. Please try again later or use email.'};
 const task=(async():Promise<Result>=>{
  const env=context.env;let local=false;
  const secret=receiptKey(env);if(!secret&&['resend','webhook'].includes(env.FORM_ADAPTER||''))return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
  if(env.FORM_ADAPTER==='local'){
   const host=new URL(context.origin).hostname;
   if(env.SITE_ENV==='production'||env.LOCAL_TEST_MODE!=='true'||!['127.0.0.1','localhost','[::1]'].includes(host))return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
   if(env.LOCAL_TEST_OUTCOME==='failure')return {status:502,message:'Local test: delivery failed. No email was sent.'};
   local=true;
   }else if(env.FORM_ADAPTER==='resend'&&env.FORMS_APPROVED==='true'&&values.service!=='newsletter'){
   if(!env.RESEND_API_KEY||!env.RESEND_FROM||!env.RECEIPT_SECRET||env.RECEIPT_SECRET.length<32)return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
   try{
    const attachment=context.headshot;const ext=attachment?.type==='image/png'?'png':attachment?.type==='image/webp'?'webp':'jpg';
    const body={from:env.RESEND_FROM,to:['lorenmichaelsharris@gmail.com'],reply_to:values.email,subject:`LMH inquiry: ${values.service}`,text:Object.entries(values).filter(([key])=>!['company_url'].includes(key)).map(([key,value])=>`${key==='message'&&values.service==='guest'?'Biography':key}: ${value}`).join('\n\n'),...(attachment?{attachments:[{filename:`guest-headshot.${ext}`,content:Buffer.from(attachment.bytes).toString('base64')}]}:{})};
    const response=await delivery('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.RESEND_API_KEY}`,'Idempotency-Key':hash},body:JSON.stringify(body),signal:AbortSignal.timeout(10000),redirect:'error'});
    if(!response.ok)return {status:502,message:'The delivery service could not accept your inquiry. Please retry or use email.'};
    const result=await response.json() as {id?:string};if(!result.id)return {status:502,message:'Delivery could not be confirmed. Please retry or use email.'};
   }catch{return {status:502,message:'The delivery service could not be reached. Please retry or use email.'};}
  }else if((env.FORM_ADAPTER==='webhook'||(env.FORM_ADAPTER==='resend'&&values.service==='newsletter'))&&env.FORMS_APPROVED==='true'){
   if(values.service==='guest')return {status:503,message:'Guest application delivery is unavailable. Please use email.'};
   const endpoint=values.service==='newsletter'?env.NEWSLETTER_WEBHOOK_URL:env.INQUIRY_WEBHOOK_URL;
   if(!endpoint||!endpoint.startsWith('https://')||!env.FORM_WEBHOOK_TOKEN)return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
   try{
    const response=await delivery(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${env.FORM_WEBHOOK_TOKEN}`,'Idempotency-Key':hash},body:JSON.stringify({kind:values.service,fields:values}),signal:AbortSignal.timeout(10000),redirect:'error'});
    if(!response.ok)return {status:502,message:'The delivery service could not accept your inquiry. Please retry or use email.'};
   }catch{return {status:502,message:'The delivery service could not be reached. Please retry or use email.'};}
  }else return {status:503,message:'Online delivery is unavailable. No message has been sent.'};
  const token=signReceipt({service:values.service,package:values.package||'',local,expires:Date.now()+windowMs},secret);
  accepted.set(hash,{token,expires:Date.now()+windowMs});
  return {status:303,receipt:token};
 })();inflight.set(hash,task);try{return await task;}finally{inflight.delete(hash);}
}
export function resetTestState(){attempts.clear();accepted.clear();inflight.clear();}
export function paymentBoundary(){return {enabled:false,state:'unavailable',reason:'Approved terms and payment product mappings are required.'} as const;}
