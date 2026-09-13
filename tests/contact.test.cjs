const assert=require('node:assert/strict'),{createHandler}=require('../api/contact.js');
let callCount=0,posted=null,mode='ok',ip=1,senderChecks=0;
const now=()=>1789290000000;
const fetcher=async(url,options)=>{if(url==='https://api.brevo.com/v3/senders?domain=bqexplore.com'){senderChecks++;return {ok:true,json:async()=>({senders:[{email:'info@bqexplore.com',active:true}]})};}callCount++;posted=JSON.parse(options.body);assert.equal(url,'https://api.brevo.com/v3/smtp/email');if(mode==='timeout')throw Error('timeout');return {ok:mode==='ok',status:mode==='ok'?201:500};};
const handler=createHandler({env:{BREVO_API_KEY:'test-placeholder-not-a-credential'},fetcher,now});
async function request(h,method='GET',body,extra={}){
 let result;const headers={};
 await h({method,headers:{origin:'https://www.bqexplore.com','content-type':'application/json','x-vercel-forwarded-for':'test-'+ip,...extra},body},{setHeader:(k,v)=>headers[k]=v,end(text){result={status:this.statusCode,data:JSON.parse(text),headers};}});
 return result;
}
const fields={name:'Test enquiry',email:'test@example.invalid',organization:'Test only',project:'Otra consulta',destination:'Demo',message:'Test message, no real email sent.',website:'',language:'en'};
(async()=>{
 assert.deepEqual((await request(createHandler({env:{}}))).data,{ready:false});
 assert.equal((await request(handler,'PUT')).status,405);
 const first=await request(handler);assert(first.data.ready);assert.equal(first.headers['Cache-Control'],'no-store');
 await request(handler);assert.equal(senderChecks,1,'Reuse sender readiness within the cache window');
 for(const senders of [[],[{email:'info@bqexplore.com',active:false}],[{email:'different@bqexplore.com',active:true}],null]){
  const inactive=createHandler({env:{BREVO_API_KEY:'test-placeholder-not-a-credential'},fetcher:async()=>({ok:true,json:async()=>({senders})}),now});
  assert.deepEqual((await request(inactive)).data,{ready:false});
  assert.equal((await request(inactive,'POST',{...fields,token:first.data.token})).data.code,'UNAVAILABLE');
 }
 const unavailable=createHandler({env:{BREVO_API_KEY:'test-placeholder-not-a-credential'},fetcher:async()=>{throw Error('No connection');},now});
 assert.deepEqual((await request(unavailable)).data,{ready:false});
 let payload={...fields,token:first.data.token};
 assert.equal((await request(handler,'POST',payload,{origin:'https://other.invalid'})).status,403);
 assert.equal((await request(handler,'POST',payload,{'content-type':'text/plain'})).status,415);
 assert.equal((await request(handler,'POST',payload,{'content-length':'15000'})).status,413);
 for(const bad of [{email:'bad'},{name:'A\r\nB'},{message:'short'},{project:'X'},{website:'spam'},{name:[]},{organization:'x'.repeat(101)}])assert.equal((await request(handler,'POST',{...payload,...bad})).status,400);
 assert.equal(callCount,0,'Invalid inputs cannot cause a delivery');
 assert.equal((await request(handler,'POST',{...payload,token:'bad'})).data.code,'TOKEN');
 const success=await request(handler,'POST',payload);assert.equal(success.status,200);assert(success.data.accepted);assert.equal(callCount,1);
 assert.deepEqual(posted.to,[{email:'info@bqexplore.com',name:'Blue Quest'}]);assert.equal(posted.sender.email,'info@bqexplore.com');assert.equal(posted.replyTo.email,fields.email);assert(!posted.htmlContent,'Visitor input is plain text');
 assert(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-8[a-f0-9]{3}-[a-f0-9]{12}$/.test(posted.headers.idempotencyKey));
 await request(handler,'POST',payload);assert.equal(callCount,1,'Same token cannot send twice within a warm instance');
 const old=createHandler({env:{BREVO_API_KEY:'test-placeholder-not-a-credential'},now:()=>now()+7200001,fetcher});
 assert.equal((await request(old,'POST',payload)).data.code,'TOKEN');
 mode='fail';ip++;
 payload.token=(await request(handler)).data.token;assert.equal((await request(handler,'POST',payload)).status,502);
 mode='timeout';ip++;
 payload.token=(await request(handler)).data.token;assert.equal((await request(handler,'POST',payload)).data.code,'UNCONFIRMED');
 const count=callCount;assert.equal((await request(handler,'POST',payload)).data.code,'PENDING');assert.equal(callCount,count);
 mode='ok';ip++;
 for(let n=0;n<3;n++){payload.token=(await request(handler)).data.token;assert.equal((await request(handler,'POST',payload)).status,200);}
 payload.token=(await request(handler)).data.token;assert.equal((await request(handler,'POST',payload)).status,429);
 console.log('PASS contact validation, fixed recipient, origins, sizes, signed sessions, duplicate protection, throttling, provider failure and uncertain delivery. No emails sent.');
})().catch(error=>{console.error(error);process.exitCode=1;});
