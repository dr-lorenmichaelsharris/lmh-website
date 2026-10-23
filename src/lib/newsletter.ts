import {createHmac,timingSafeEqual,createHash} from 'node:crypto';
export interface NewsletterEnv {RESEND_API_KEY?:string;RESEND_FROM?:string;RECEIPT_SECRET?:string;NEWSLETTER_SEGMENT_ID?:string;PUBLIC_SITE_URL?:string;FORMS_APPROVED?:string;}
const validEmail=(s:string)=>s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export function newsletterToken(email:string,secret:string,now=Date.now()) {const body=Buffer.from(JSON.stringify({purpose:'newsletter',email:email.toLowerCase(),expires:now+86400000})).toString('base64url');return body+'.'+createHmac('sha256',secret).update(body).digest('base64url');}
export function readNewsletterToken(token:string,secret:string,now=Date.now()):string|undefined {try{if(secret.length<32||token.length>2048)return;const [body,signature,...extra]=token.split('.');if(extra.length||!body||!signature)return;const expected=createHmac('sha256',secret).update(body).digest();const actual=Buffer.from(signature,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return;const payload=JSON.parse(Buffer.from(body,'base64url').toString());if(payload.purpose==='newsletter'&&payload.expires>now&&payload.expires<=now+86400000&&validEmail(payload.email))return payload.email;}catch{return;}}
function ready(env:NewsletterEnv){return env.FORMS_APPROVED==='true'&&env.RESEND_API_KEY&&env.RESEND_FROM&&env.RECEIPT_SECRET&&env.RECEIPT_SECRET.length>=32&&env.NEWSLETTER_SEGMENT_ID;}
export async function requestNewsletter(email:string,env:NewsletterEnv,delivery:typeof fetch=fetch){if(!ready(env))return false;email=email.toLowerCase();const issued=Math.floor(Date.now()/600000)*600000;
 let origin:URL;try{origin=new URL(env.PUBLIC_SITE_URL||'https://lorenmichaelsharris.com');}catch{return false;}if(origin.protocol!=='https:')return false;
 const url=new URL('/newsletter/confirm/',origin);url.searchParams.set('token',newsletterToken(email,env.RECEIPT_SECRET!,issued));
 try{const response=await delivery('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':createHash('sha256').update(`newsletter:${email.toLowerCase()}:${Math.floor(Date.now()/600000)}`).digest('hex')},body:JSON.stringify({from:env.RESEND_FROM,to:[email],subject:'Confirm your email updates from Loren',text:`You requested email updates from Loren Michaels Harris. Confirm within 24 hours:\n\n${url}\n\nIf you did not request this, ignore this email. You have not been subscribed. You can unsubscribe from any future newsletter.`}),signal:AbortSignal.timeout(10000)});return response.ok&&!!(await response.json() as {id?:string}).id;}catch{return false;}}
export async function confirmNewsletter(token:string,env:NewsletterEnv,delivery:typeof fetch=fetch):Promise<'confirmed'|'invalid'|'unavailable'|'unsubscribed'> {
 if(!ready(env))return 'unavailable';const email=readNewsletterToken(token,env.RECEIPT_SECRET!);if(!email)return 'invalid';
 const headers={Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'};
 const call=(path:string,init:RequestInit={})=>delivery('https://api.resend.com'+path,{...init,headers,signal:AbortSignal.timeout(10000)});
 try{const existing=await call('/contacts/'+encodeURIComponent(email));let id:string;
 if(existing.ok){const contact=await existing.json() as {id:string;unsubscribed:boolean};if(contact.unsubscribed)return 'unsubscribed';id=contact.id;}
 else if(existing.status===404){const created=await call('/contacts',{method:'POST',body:JSON.stringify({email,unsubscribed:false})});if(!created.ok)return 'unavailable';id=(await created.json() as {id:string}).id;}
 else return 'unavailable';if(!id)return 'unavailable';
 const segment=await call(`/contacts/${encodeURIComponent(id)}/segments/${encodeURIComponent(env.NEWSLETTER_SEGMENT_ID!)}`,{method:'POST'});return segment.ok?'confirmed':'unavailable';
 }catch{return 'unavailable';}
}
