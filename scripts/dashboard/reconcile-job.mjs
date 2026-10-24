import {createHmac} from 'node:crypto';
const stamp=String(Date.now()),secret=process.env.RECEIPT_SECRET,origin=process.env.PUBLIC_SITE_URL;
if(!secret||!origin)throw new Error('Cron environment settings are missing.');
const response=await fetch(new URL('/api/internal/reconcile/',origin),{method:'POST',headers:{'x-lmh-time':stamp,'x-lmh-signature':createHmac('sha256',secret).update('reconcile:'+stamp).digest('hex')},signal:AbortSignal.timeout(120000),redirect:'error'});
console.log(JSON.stringify({event:'booking_reconciliation',status:response.status}));process.exit(response.ok?0:1);
