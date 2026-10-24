import {createHash} from 'node:crypto';
export async function boundedBody(request:Request,max:number){const reader=request.body?.getReader();const chunks:Uint8Array[]=[];let size=0;if(reader)while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>max){await reader.cancel();throw new Error('Request is too large.');}chunks.push(part.value);}return Buffer.concat(chunks);}
export async function boundedForm(request:Request,max=2300000){return new Request(request.url,{method:'POST',headers:request.headers,body:await boundedBody(request,max)}).formData();}
export function tokenHash(value:string){return createHash('sha256').update(value).digest('hex');}
