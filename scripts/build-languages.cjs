// Deterministic, dependency-free static build. Edit content/es and translations.js,
// never the generated root or es/*.html pages. No network or AI calls.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),messages=require('../translations.js');
const pages=['index.html','aviso-legal.html','privacidad.html'];
const domain='https://www.bqexplore.com';
const escape=value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const translate=text=>{
 const key=text.trim();
 return Object.hasOwn(messages,key)?text.replace(key,messages[key]):text;
};
const route=(file,lang)=>`${lang==='es'?'/es':''}/${file==='index.html'?'':file}`;
const collected=new Set();
for(const file of pages){
 const source=fs.readFileSync(path.join(root,'content/es',file),'utf8');
 for(const lang of ['en','es']){
  let html=source.replace(/<link rel="canonical"[^>]*>/g,'');
  html=html.replace(/<html lang="es">/,`<html lang="${lang}">`);
  html=html.replace(/<[^>]+>|[^<]+/g,token=>{
   if(!token.startsWith('<')){if(token.trim())collected.add(token.trim());return lang==='en'?translate(token):token;}
   token=token.replace(/\b(alt|aria-label|placeholder|title)="([^"]*)"/g,(all,attr,value)=>{collected.add(value);return `${attr}="${lang==='en'?escape(translate(value)):value}"`;});
   if(token.startsWith('<meta name="description"'))token=token.replace(/content="([^"]*)"/,(all,value)=>{collected.add(value);return `content="${lang==='en'?escape(translate(value)):value}"`;});
   return token.replace(/\b(src|href)="([^"#][^"]*)"/g,(all,attr,value)=>{
    if(/^(https?:|mailto:|\/)/.test(value))return all;
    if(value.startsWith('./#'))return `${attr}="${route('index.html',lang)}${value.slice(2)}"`;
    if(pages.includes(value))return `${attr}="${route(value,lang)}"`;
    return `${attr}="/${value}"`;
   });
  });
  const toggle=`<nav class="language-switch" aria-label="${lang==='en'?'Choose a language':'Elige un idioma'}"><a href="${route(file,'en')}" data-language="en" lang="en" hreflang="en" aria-label="English"${lang==='en'?' aria-current="true"':''}>EN</a><a href="${route(file,'es')}" data-language="es" lang="es" hreflang="es" aria-label="Español"${lang==='es'?' aria-current="true"':''}>ES</a></nav>`;
  html=file==='index.html'?html.replace('<div class="hero-top">',`<div class="hero-top">${toggle}`):html.replace('</header>',`${toggle}</header>`);
  html=html.replace('</head>',`<link rel="canonical" href="${domain+route(file,lang)}"><link rel="alternate" hreflang="en" href="${domain+route(file,'en')}"><link rel="alternate" hreflang="es" href="${domain+route(file,'es')}"><link rel="alternate" hreflang="x-default" href="${domain+route(file,'en')}"><link rel="stylesheet" href="/language.css"><script src="/translations.js" defer></script><script src="/language.js" defer></script></head>`);
  // App also defers, so BQ.t is ready before any dynamic text is produced.
  html=html.replace('<script src="/app.js">','<script src="/app.js" defer>');
  const dest=path.join(root,lang==='es'?'es':'',file);
  if(!process.argv.includes('--list')){
   const output=html.replace(/[ \t]+$/gm,'').trimEnd()+'\n';
   if(process.argv.includes('--check')){
    if(fs.readFileSync(dest,'utf8').replace(/\r\n/g,'\n')!==output.replace(/\r\n/g,'\n'))throw Error('Outdated generated page: '+dest);
   }else{fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,output,'utf8');}
  }
 }
}
if(process.argv.includes('--list'))console.log(JSON.stringify([...collected].filter(s=>!Object.hasOwn(messages,s)),null,2));
else console.log(process.argv.includes('--check')?'All 6 language pages are up to date.':'Built 6 static pages: English default, Spanish /es/.');
