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
  assert(!html.includes('class="sidebar-legal"'));
  const footer=html.match(/<footer>[\s\S]*?<\/footer>/)[0];
  assert(footer.includes(`href="${lang==='es'?'/es':''}/aviso-legal.html"`),'Legal notice remains in footer');
  assert(html.includes('class="hero-photo" role="img" aria-label='));
  assert(html.includes('data-newsletter-ready="false"'));assert(!/<iframe[^>]*\ssrc=/.test(html));
  assert(html.includes('hidden inert style="display:none" id="tu-destino"'));
  assert(!html.includes('src="/destination-finder.js"'));
 }else{assert(html.includes('71153709N'));assert(html.includes('info@bqexplore.com'));assert(!/<form\b/.test(html));}
}
const messages=require('../translations.js');
assert.equal(messages['Exploramos'],'We explore');
assert.equal(messages['Mapas batimétricos'],'Bathymetric maps');
console.log('PASS translation coverage, generated files, language metadata, assets, privacy, inactive integrations.');
