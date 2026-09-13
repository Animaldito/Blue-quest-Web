// Fixed-recipient transactional contact endpoint. Credentials stay on Vercel.
const {createHmac,randomBytes,timingSafeEqual}=require('node:crypto');
const TYPES=new Set(['Exploración de puntos de buceo','Asesoramiento para un centro','Documentación subacuática','Otra consulta']);
const ORIGINS=new Set(['https://www.bqexplore.com','https://bqexplore.com','https://blue-quest-web.vercel.app']);
const MAX_BYTES=12000,WINDOW=600000;
// Opportunistic per-instance throttling; NOT a distributed rate limiter.
const attempts=new Map(),usedTokens=new Map();
function cleanCaches(now){for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);for(const [k,v] of usedTokens)if(v.until<now)usedTokens.delete(k);}
function signature(value,key){return createHmac('sha256',key).update(value).digest('hex');}
function tokenFor(key,now){const data=now+'.'+randomBytes(18).toString('hex');return data+'.'+signature(data,key);}
function validToken(token,key,now){
 if(typeof token!=='string'||token.length>200)return false;
 const parts=token.split('.');if(parts.length!==3||!/^\d{13}$/.test(parts[0])||!/^[a-f0-9]{36}$/.test(parts[1])||!/^[a-f0-9]{64}$/.test(parts[2]))return false;
 const age=now-Number(parts[0]);return age>=0&&age<7200000&&timingSafeEqual(Buffer.from(parts[2]),Buffer.from(signature(parts[0]+'.'+parts[1],key)));
}
function validate(body){
 if(!body||typeof body!=='object'||Array.isArray(body))return null;
 const data={};
 for(const [name,min,max] of [['name',1,80],['email',3,120],['organization',0,100],['project',1,100],['destination',0,120],['message',10,1200],['website',0,200]]){
  if(typeof body[name]!=='string')return null;
  const text=body[name].trim();if(text.length<min||text.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text))return null;
  if(name!=='message'&&/[\r\n]/.test(text))return null;data[name]=text;
 }
 if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)||!TYPES.has(data.project)||data.website)return null;
 data.language=body.language==='es'?'es':'en';return data;
}
function createHandler({env=process.env,fetcher=globalThis.fetch,now=Date.now}={}){
 return async(req,res)=>{
  const send=(status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.end(JSON.stringify(body));};
  const key=env.BREVO_API_KEY;
  if(req.method==='GET')return send(200,key?{ready:true,token:tokenFor(key,now())}:{ready:false});
  if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(405,{code:'METHOD'});}
  const allowed=new Set(ORIGINS);
  // Preview host is supplied by Vercel, never taken from a visitor header.
  if(env.VERCEL_URL)allowed.add('https://'+env.VERCEL_URL);
  if(!allowed.has(req.headers.origin))return send(403,{code:'ORIGIN'});
  if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))return send(415,{code:'CONTENT_TYPE'});
  if(Number(req.headers['content-length'])>MAX_BYTES)return send(413,{code:'SIZE'});
  if(!key)return send(503,{code:'UNAVAILABLE'});
  let body;
  try{
   if(req.body!==undefined){const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw)>MAX_BYTES)return send(413,{code:'SIZE'});body=JSON.parse(raw);}
   else{let raw='',length=0;for await(const chunk of req){length+=Buffer.byteLength(chunk);if(length>MAX_BYTES)return send(413,{code:'SIZE'});raw+=chunk;}body=JSON.parse(raw);}
  }catch{return send(400,{code:'INVALID'});}
  const data=validate(body);if(!data)return send(400,{code:'INVALID'});
  const time=now();if(!validToken(body.token,key,time))return send(400,{code:'TOKEN'});
  cleanCaches(time);
  const previous=usedTokens.get(body.token);
  if(previous)return previous.accepted?send(200,{accepted:true}):send(409,{code:'PENDING'});
  // Hash only Vercel's trusted IP header. No contact content or raw IP is logged.
  const ip=String(req.headers['x-vercel-forwarded-for']||'unknown').split(',')[0];
  const bucket=signature(ip,key);
  const limit=attempts.get(bucket)||{count:0,until:time+WINDOW};
  if(limit.count>=3||attempts.size>5000||usedTokens.size>5000){res.setHeader('Retry-After','600');return send(429,{code:'RATE'});}
  limit.count++;attempts.set(bucket,limit);
  usedTokens.set(body.token,{accepted:false,until:time+7200000});
  const digest=signature(body.token+JSON.stringify(data),key);
  const deliveryId=digest.slice(0,8)+'-'+digest.slice(8,12)+'-4'+digest.slice(13,16)+'-8'+digest.slice(17,20)+'-'+digest.slice(20,32);
  try{
   const response=await fetcher('https://api.brevo.com/v3/smtp/email',{
    method:'POST',headers:{'api-key':key,'Content-Type':'application/json','Accept':'application/json'},signal:AbortSignal.timeout(12000),
    body:JSON.stringify({headers:{idempotencyKey:deliveryId},sender:{name:'Blue Quest web',email:'info@bqexplore.com'},to:[{email:'info@bqexplore.com',name:'Blue Quest'}],replyTo:{email:data.email,name:data.name},subject:'Web enquiry — '+data.project,
     textContent:['Blue Quest — Website enquiry','Name: '+data.name,'Email: '+data.email,'Organisation: '+(data.organization||'—'),'Project: '+data.project,'Destination: '+(data.destination||'—'),'Language: '+data.language,'',data.message,'','Sent from the Blue Quest contact form. This is not a newsletter subscription.'].join('\n')})
   });
   if(!response.ok){console.warn('Contact provider rejected request:',response.status);usedTokens.delete(body.token);return send(502,{code:'PROVIDER'});}
   usedTokens.set(body.token,{accepted:true,until:time+7200000});return send(200,{accepted:true});
  }catch{
   // Keep token pending after uncertain delivery; a retry must not resend blindly.
   return send(502,{code:'UNCONFIRMED'});
  }
 };
}
module.exports=createHandler();
module.exports.createHandler=createHandler;
module.exports.validate=validate;
module.exports.validToken=validToken;
