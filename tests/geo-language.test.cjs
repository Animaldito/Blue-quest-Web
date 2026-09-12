// Offline regression tests: routing policy plus the real browser language script.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const countries=['ES','MX','GT','HN','SV','NI','CR','PA','CU','DO','PR','CO','VE','EC','PE','BO','CL','AR','PY','UY','GQ'];
const pages=new Map([['/','/es/'],['/index.html','/es/'],['/aviso-legal.html','/es/aviso-legal.html'],['/privacidad.html','/es/privacidad.html']]);
assert.equal(config.redirects.length,pages.size);
for(const rule of config.redirects){
 assert.equal(rule.destination,pages.get(rule.source));
 assert.equal(rule.permanent,false,'Geographic redirects must not become permanent');
 assert.equal(rule.has.length,1);assert.equal(rule.has[0].type,'header');assert.equal(rule.has[0].key,'x-vercel-ip-country');
 assert.deepEqual(rule.has[0].value.slice(1,-1).split('|').sort(),[...countries].sort());
 assert.deepEqual(rule.missing,[{type:'query',key:'lang',value:'en'}]);
}
// Models only the documented exact-path / header / query conditions used here.
function redirect(input,country){
 const url=new URL(input,'https://www.bqexplore.com');
 const rule=config.redirects.find(rule=>rule.source===url.pathname&&rule.has.every(h=>new RegExp('^'+h.value+'$').test(country||''))&&rule.missing.every(q=>!url.searchParams.getAll(q.key).some(value=>new RegExp('^'+q.value+'$').test(value))));
 return rule?rule.destination+url.search+url.hash:null;
}
for(const country of countries)for(const [source,destination] of pages){
 assert.equal(redirect(source,country),destination,country+' '+source);
 assert.equal(redirect(source+'?utm_source=test&interest=corales&interest=pecios#equipo',country),destination+'?utm_source=test&interest=corales&interest=pecios#equipo');
 assert.equal(redirect(source+'?lang=en#tecnologia',country),null,'Explicit English must win');
 assert.equal(redirect(source+'?lang=es&lang=en',country),null);
 assert.equal(redirect(destination,country),null,'No Spanish redirect loops');
}
for(const country of ['US','GB','FR','DE','BR','PT','BZ','HT','CA','PH','JP','XX','',undefined])for(const source of pages.keys())assert.equal(redirect(source,country),null);
for(const source of ['/assets/technology/map-relief.jpg','/language.js','/styles.css','/favicon.svg','/es/','/es/index.html','/es/privacidad.html','/unknown'])assert.equal(redirect(source,'ES'),null);

const languageSource=fs.readFileSync(path.join(root,'language.js'),'utf8');
assert(!/localStorage|sessionStorage|document\.cookie|\bfetch\(|navigator\.geolocation/.test(languageSource),'No browser storage, extra network call or GPS');
const messages=require('../translations.js');
function browser(input,initialLanguage){
 const location=new URL(input,'https://www.bqexplore.com'),events={},emitted=[],historyCalls=[];
 const links=[];
 function link(href,data={}){
  const attrs={href},listeners={};
  const el={dataset:data,listeners,get href(){return new URL(attrs.href,location).href},set href(value){attrs.href=value},getAttribute:name=>attrs[name]??null,setAttribute:(name,value)=>{attrs[name]=value},removeAttribute:name=>{delete attrs[name]},addEventListener:(name,fn)=>{listeners[name]=fn}};
  links.push(el);return el;
 }
 const en=link('/?lang=en',{language:'en'}),es=link('/es/',{language:'es'});
 const privacy=link(initialLanguage==='es'?'/es/privacidad.html':'/privacidad.html?lang=en');
 const home=link(initialLanguage==='es'?'/es/#inicio':'/?lang=en#inicio');
 const anchor=link('#tecnologia'),external=link('https://example.com/?lang=other'),email=link('mailto:info@bqexplore.com');
 const texts=[{textContent:initialLanguage==='es'?'Nuestro trabajo':'Our work',parentElement:{closest:()=>null}}];
 const canonical={href:''},description={content:initialLanguage==='es'?'Exploramos':'We explore'};
 const document={documentElement:{lang:initialLanguage},createTreeWalker:()=>{let i=-1;return {nextNode(){return ++i<texts.length},get currentNode(){return texts[i]}}},querySelectorAll:selector=>selector==='a[href]'?links:selector==='[data-language]'?[en,es]:[],querySelector:selector=>selector.startsWith('meta')?description:canonical,dispatchEvent:event=>emitted.push(event)};
 function navigate(kind,url){historyCalls.push({kind,url});location.href=new URL(url,location).href}
 const window={BQ_MESSAGES:messages};
 vm.runInNewContext(languageSource,{window,document,location,URL,NodeFilter:{SHOW_TEXT:4},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},history:{pushState:(_a,_b,url)=>navigate('push',url),replaceState:(_a,_b,url)=>navigate('replace',url)},addEventListener:(name,fn)=>{events[name]=fn}});
 function click(el,options={}){let prevented=false;el.listeners.click({button:0,preventDefault(){prevented=true},...options});return prevented}
 return {location,window,document,links,en,es,privacy,home,anchor,external,email,texts,canonical,events,emitted,historyCalls,click};
}
const b=browser('/es/?interest=corales&interest=pecios&utm_source=test#tecnologia','es');
assert.equal(new URL(b.en.href).searchParams.get('lang'),'en');
assert.equal(new URL(b.en.href).hash,'#tecnologia');
assert.equal(b.click(b.en,{ctrlKey:true}),false,'Native new-tab opening stays available');
assert.equal(b.click(b.en),true);
assert.equal(b.window.BQ.language,'en');assert.equal(b.document.documentElement.lang,'en');assert.equal(b.texts[0].textContent,'Our work');
assert.equal(b.location.pathname,'/');assert.equal(b.location.searchParams.get('lang'),'en');
assert.deepEqual(b.location.searchParams.getAll('interest'),['corales','pecios']);assert.equal(b.location.hash,'#tecnologia');
assert.equal(new URL(b.privacy.href).searchParams.get('lang'),'en');assert.equal(new URL(b.home.href).searchParams.get('lang'),'en');
assert.equal(b.anchor.getAttribute('href'),'#tecnologia');assert.equal(b.external.href,'https://example.com/?lang=other');assert.equal(b.email.href,'mailto:info@bqexplore.com');
assert.equal(b.canonical.href,'https://www.bqexplore.com/');assert.equal(b.emitted.at(-1).detail.language,'en');
assert.equal(redirect(b.location.href,'ES'),null,'Reloading manual English cannot redirect');
b.click(b.es);assert.equal(b.location.pathname,'/es/');assert.equal(b.location.searchParams.has('lang'),false);assert.equal(b.texts[0].textContent,'Nuestro trabajo');
assert.equal(new URL(b.privacy.href).pathname,'/es/privacidad.html');assert.equal(new URL(b.privacy.href).searchParams.has('lang'),false);
b.location.hash='#contacto';b.events.hashchange();assert.equal(new URL(b.en.href).hash,'#contacto');
b.location.href='https://www.bqexplore.com/?lang=en#equipo';b.events.popstate();assert.equal(b.window.BQ.language,'en');assert.equal(new URL(b.en.href).hash,'#equipo');
const same=browser('/#inicio','en');same.click(same.en);assert.equal(same.location.searchParams.get('lang'),'en');assert.equal(same.historyCalls.at(-1).kind,'replace');
const legal=browser('/es/privacidad.html#derechos','es');legal.click(legal.en);assert.equal(legal.location.pathname,'/privacidad.html');assert.equal(legal.location.hash,'#derechos');assert.equal(redirect(legal.location.href,'ES'),null);

for(const lang of ['en','es'])for(const page of ['index.html','aviso-legal.html','privacidad.html']){
 const html=fs.readFileSync(path.join(root,lang==='es'?'es':'',page),'utf8');
 const english=html.match(/<a href="([^"]+)" data-language="en"/)[1];
 assert.equal(new URL(english,'https://www.bqexplore.com').searchParams.get('lang'),'en','No-JS English selector must bypass detection');
 assert.equal(redirect(english,'ES'),null);
 assert(html.includes(`hreflang="en" href="https://www.bqexplore.com/${page==='index.html'?'':page}?lang=en"`));
 if(lang==='en')for(const [,href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)){
  if(href.startsWith('#'))continue;
  const url=new URL(href,'https://www.bqexplore.com');
  if(url.origin==='https://www.bqexplore.com'&&pages.has(url.pathname))assert.equal(url.searchParams.get('lang'),'en','No-JS internal links must preserve English: '+href);
 }
}
console.log('PASS 21 Spanish-speaking countries/territories, English fallback, explicit choice, no loops, query/hash preservation, browser history, legal pages and no-JS links.');
