// The removed sample must leave no dead links; privacy and error guidance remain.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),messages=require('../translations.js');
for(const lang of ['es','en']){
 const html=fs.readFileSync(path.join(root,'dist',lang,'index.html'),'utf8');
 assert(!/class="(?:media-note|scope-note|form-note)"/.test(html));
 assert(!/El informe de resultados no está publicado|The findings report is not published/.test(html));
 assert(!/id="muestra"|href="[^"]*#muestra"|class="sample-|>DEMO</.test(html));
 assert(!/Servicios y entregables|Services and deliverables|Ver un entregable|See a sample/.test(html));
 const shortcuts=html.match(/<nav aria-label="(?:Accesos de exploración|Exploration shortcuts)">([\s\S]*?)<\/nav>/)[1];
 assert.equal([...shortcuts.matchAll(/<a /g)].length,2,'Two remaining landing shortcuts');
 assert(html.includes('class="contact-privacy"')&&html.includes('/'+lang+'/privacidad.html'));
 assert(html.includes('id="mailbox-notice" hidden></p>'));
 assert(!html.includes('map-demo.svg'));
 assert.equal([...html.matchAll(/data-map="/g)].length,3);
}
(async()=>{
 const source=fs.readFileSync(path.join(root,'contact.js'),'utf8');
 const setup=source.slice(source.indexOf(' const t=window.BQ.t'),source.indexOf(' // Load readiness'));
 for(const lang of ['es','en']){
  const notice={},button={},nodes={'#mailbox-notice':notice,'#contact-submit':button,'#contact-form':{},'#contact-status':{}};
  let available=true;
  const context=vm.createContext({window:{BQ:{t:s=>lang==='en'?(messages[s]??s):s}},document:{querySelector:s=>nodes[s]},AbortSignal,
   fetch:async()=>({ok:true,json:async()=>({ready:available,token:available?'mock-token':null})})});
  vm.runInContext(setup+'\nrefreshButton();',context);
  assert.equal(notice.hidden,true,'No pre-check note');
  await vm.runInContext('checkService()',context);
  assert.equal(notice.hidden,true,'No auxiliary note when ready');assert.equal(notice.textContent,'');
  available=false;
  await vm.runInContext('checkService()',context);
  assert.equal(notice.hidden,false,'Retain useful fallback instructions');
  assert(notice.textContent.includes(lang==='es'?'borrador':'draft'));
  available=true;
  await vm.runInContext('checkService()',context);
  assert.equal(notice.hidden,true,'Remove error notice after service recovery');
 }
 console.log('PASS sample and auxiliary notes removed, no dead sample links, privacy and contact fallback retained.');
})().catch(error=>{console.error(error);process.exitCode=1;});
