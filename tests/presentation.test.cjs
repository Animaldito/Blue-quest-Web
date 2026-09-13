// Editorial cleanup must not remove privacy, demo identification or error guidance.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),messages=require('../translations.js');
for(const lang of ['es','en']){
 const html=fs.readFileSync(path.join(root,'dist',lang,'index.html'),'utf8');
 assert(!/class="(?:media-note|scope-note|form-note)"/.test(html));
 assert(!/El informe de resultados no está publicado|The findings report is not published/.test(html));
 assert(html.includes('class="sample-label"')&&html.includes('>DEMO<'));
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
 console.log('PASS auxiliary notes removed, privacy/demo retained and contact fallback visible only when needed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
