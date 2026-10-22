import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const port=4330;const origin=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['dist/server/entry.mjs'],{env:{...process.env,PORT:String(port),HOST:'127.0.0.1',SITE_ENV:'staging',FORM_ADAPTER:'local',LOCAL_TEST_MODE:'true'},stdio:'ignore',windowsHide:true});
const results=[];
try{
 for(let i=0;i<60;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,250));}
 const send=fields=>fetch(origin+'/api/submit/',{method:'POST',headers:{Origin:origin},body:new URLSearchParams(fields),redirect:'manual'});
 const data={service:'guest',name:'Local HTTP test',email:'http@example.test',message:'A test story for the local development adapter.',package:'gold',acknowledgment:'yes'};
 const first=await send(data);assert.equal(first.status,303);assert.equal(first.headers.get('location'),'/thank-you-page/');
 const cookie=first.headers.get('set-cookie').split(';')[0];const html=await(await fetch(origin+'/thank-you-page/',{headers:{Cookie:cookie}})).text();assert.ok(html.includes('Local test received.'));assert.ok(html.includes('gold'));results.push('Guest POST → opaque HTTP-only receipt → local-only status with package');
 const replay=await send(data);assert.equal(replay.headers.get('set-cookie')?.split(';')[0],cookie);results.push('Duplicate POST returns the original receipt');
 const spoof=await(await fetch(origin+'/thank-you-page/?paid=true&status=confirmed')).text();assert.ok(spoof.includes('No submission to confirm.'));results.push('Direct/query-string visits cannot assert submission or payment');
 const invalid=await send({...data,email:'bad'});assert.equal(invalid.status,422);const errorHtml=await invalid.text();assert.ok(errorHtml.includes('Local HTTP test'));assert.ok(errorHtml.includes('Enter a valid email address.'));results.push('Server-side validation returns 422 and preserves fields');
 const invalidProgram=await send({service:'program',name:'Program inquiry',email:'bad',message:'I want to discuss the twelve-week program.',acknowledgment:'yes'});assert.equal(invalidProgram.status,422);const programError=await invalidProgram.text();assert.ok(programError.includes('value="program"'));assert.ok(programError.includes('I want to discuss the twelve-week program.'));results.push('Program validation retains service context and message');
 const badPackage=await send({...data,package:'forged'});assert.equal(badPackage.status,422);results.push('Server rejects forged package ID');
 const cross=await fetch(origin+'/api/submit/',{method:'POST',headers:{Origin:'https://other.example'},body:new URLSearchParams(data)});assert.equal(cross.status,403);results.push('Cross-origin POST rejected');
 const newsletter=await send({service:'newsletter',email:'news@example.test',consent:'yes'});assert.equal(newsletter.status,303);results.push('Newsletter POST accepts explicit consent in local simulation');
 await fs.writeFile('docs/http-flow-tests.json',JSON.stringify({origin,adapter:'local; no mail sent',passed:results},null,2));console.log(results.join('\n'));
}finally{server.kill();}
