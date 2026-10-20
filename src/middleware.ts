import {defineMiddleware} from 'astro:middleware';
export const onRequest=defineMiddleware(async(context,next)=>{
 const response=await next();
 response.headers.set('X-Content-Type-Options','nosniff');
 response.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
 response.headers.set('X-Frame-Options','SAMEORIGIN');
 if(context.url.pathname.startsWith('/api/')||context.url.pathname==='/thank-you-page/')response.headers.set('Cache-Control','no-store');
 return response;
});
