const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const run=(...args)=>execFileSync(process.execPath,[path.join(root,'scripts/build-languages.cjs'),...args],{encoding:'utf8'});
const unchanged=new Set(['BLUE QUEST','↗','Resorts','Raa Atoll','Boa Vista','Leyte','Addu Atoll','+','Sonar','Miguel Perez','Cristina Garcés','Aida Marin','Andreu Ferrer','info@bqexplore.com','Email','.','×','OCEAN EXPLORATION','Cookies','Miguel Ángel Pérez Blanco','Blue Quest','71153709N','www.bqexplore.com','Newsletter']);
assert.deepEqual(JSON.parse(run('--list')).filter(s=>!unchanged.has(s)),[],'Untranslated source text: add a reviewed English translation.');
console.log(run('--check').trim());
for(const lang of ['en','es'])for(const file of ['index.html','aviso-legal.html','privacidad.html']){
 const html=fs.readFileSync(path.join(root,lang==='es'?'es':'',file),'utf8');
 assert(!html.startsWith('\uFEFF'));assert(!/[Ãâ][\x80-\xBF]/.test(html),'Encoding issue');
 assert(html.includes(`<html lang="${lang}">`));
 for(const hreflang of ['en','es','x-default'])assert(html.includes(`hreflang="${hreflang}"`));
 for(const choice of ['en','es'])assert(html.includes(`data-language="${choice}"`));
 assert(html.includes('href="/language.css"'));assert(html.includes('src="/language.js"'));
 for(const [,asset] of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|svg|jpg|webp|png))"/g))assert(fs.existsSync(path.join(root,asset)),asset);
 if(file==='index.html'){
  const titles=lang==='es'?['Nuestro trabajo','Bitácora','Así trabajamos','Conócenos','Pregunta sin compromiso']:['Our work','Field log','How we work','Meet the team','Let’s talk — no obligation'];
  for(const title of titles)assert(html.includes(`<h2>${title}</h2>`));
  assert(html.includes(`<p>${lang==='es'?'Destinos visitados y próximas prospecciones.':'Past destinations and upcoming surveys.'}</p>`));
  assert(html.includes(`<p>${lang==='es'?'Distintas personas, distintos roles, un mismo objetivo: tu éxito.':'Different people, different roles, one shared goal: your success.'}</p>`));
  const sidebar=html.match(/<header class="sidebar">[\s\S]*?<\/header>/)[0];
  const menu=lang==='es'?['Qué hacemos','Expediciones','Tecnología','The Team','Contacto']:['What we do','Expeditions','Technology','The Team','Contact'];
  for(const label of menu)assert(sidebar.includes(`>${label}</a>`),'Navigation label stays unchanged');
  assert(!html.includes('class="sidebar-legal"'));
  const footer=html.match(/<footer>[\s\S]*?<\/footer>/)[0];
  assert(footer.includes(`href="${lang==='es'?'/es':''}/aviso-legal.html"`),'Legal notice remains in footer');
  assert(html.includes('class="hero-photo" role="img" aria-label='));
  assert(!/<iframe\b/.test(html),'Newsletter must not reintroduce the failing embedded form');
  const signUpLink=html.match(/<a id="newsletter-form-link"[^>]+>/)[0];
  assert(signUpLink.includes('target="_blank"'));assert(signUpLink.includes('rel="noopener noreferrer"'));
  assert(signUpLink.includes('aria-describedby="newsletter-instructions"'));
  assert(html.includes('id="newsletter-decline"'));assert(!html.includes('id="newsletter-load"'));
  assert(html.includes('MUIFAEBah1zUBKm8dePcRXgScNYejR_XY_9u6QYe3xjHMKu34G8p9zDFigxt4R-oLV-EDbfMKA1bfuNQDJ45cUdRhZvR63ldt-2Y62yhZug6DsOi8j6E6f0dx-kASYue47B-uHINwH9gKrvduukLslhRRvQGNrNYk2-3x4POlo5Et6TlMj-A7ep86jc8Dtq52su4NAhcRKU1y_nLNw=='));
  assert(!html.includes('MUIFAKdU2ASj3pvoXSJw3eF5ffqH6Btzaxua9IJbVJUhPOPzBgca2RgUk4or5PBBOWFLqbZi6bJ5WHsV63w'));
  assert(html.includes(lang==='es'?'Formulario y emails en inglés.':'Sign-up form and emails in English.'));
  assert(html.includes('hidden inert style="display:none" id="tu-destino"'));
  assert(!html.includes('src="/destination-finder.js"'));
 }else{assert(html.includes('71153709N'));assert(html.includes('info@bqexplore.com'));assert(!/<form\b/.test(html));}
}
const messages=require('../translations.js');
assert.equal(messages['Exploramos'],'We explore');
assert.equal(messages['Mapas batimétricos'],'Bathymetric maps');
console.log('PASS translation coverage, generated files, language metadata, assets, external newsletter and inactive destination finder.');
