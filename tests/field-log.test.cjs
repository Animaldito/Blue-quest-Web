const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),records=require('../field-log.js'),messages=require('../translations.js');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
assert.deepEqual(records.map(r=>r.name),['Raa Atoll','Boa Vista','Leyte','Addu Atoll']);
assert.deepEqual(records.map(r=>r.status),['completed','completed','planned','planned']);
const strings=[];
for(const record of records){
 assert.equal(record.metrics.length,3);assert.equal(record.outcomes.length,3);
 strings.push(record.country,record.client,record.objective,...record.metrics.flat(),...record.outcomes.flat());
 assert(!('coordinates' in record),'Do not publish precise discovered site locations');
}
for(const text of strings)if(!/^[-+≤\d]+$/.test(text))assert(Object.hasOwn(messages,text),'Missing translation: '+text);
assert.equal(records[0].metrics[0][1],'4');assert.equal(records[0].metrics[1][1],'+10');assert.equal(records[0].metrics[2][1],'≤30');
assert.equal(records[1].metrics[0][1],'3');assert.equal(records[1].metrics[1][1],'2');
assert(!/Raggy|Carcharias|taurus/i.test(JSON.stringify(records)),'Do not invent an unconfirmed shark species');
assert.equal(records[2].metrics[0][1],'3');assert.equal(records[3].metrics[0][1],'15');
for(const r of records.slice(2))assert(r.metrics.some(m=>m[0]==='Estancia prevista'));
const js=read('field-log.js'),css=read('field-log.css'),app=read('app.js');
assert(!app.includes('place-detail'));
assert(!app.includes('updatePlaceDetail'));
assert(!read('styles.css').includes('#place-detail'));
assert(app.includes('function updateGlobeLabel()'));
new vm.Script(js);
assert(!/innerHTML|fetch\(|localStorage|setInterval|\.mp4|\.webm/.test(js),'Records are local, lightweight DOM text');
assert(js.includes("record.status==='completed'?'Resultados de campo':'Objetivos previstos'"));
assert(js.includes('dialog.showModal()'));assert(js.includes("dialog.addEventListener('close'"));assert(js.includes('opener.focus({preventScroll:true})'));
assert(js.includes("document.addEventListener('bq:languagechange'"));assert(css.includes('prefers-reduced-motion:reduce'));
assert(!/infinite|animation-play-state|mission-pause|mission-replay|Repetir intro|Pausar/.test(js+css));
assert(css.includes('overflow:auto'));assert(css.includes('max-height:calc(100dvh - 24px)'));
assert(app.includes('window.BQFieldLog.open(i,trigger)'));assert(app.includes('selectPlace(closest)'));assert(app.includes('selectPlace(i,button)'));assert(app.includes("e.key==='Enter'"));
for(const lang of ['es','en']){
 const html=read(lang+'/index.html');
 assert(!html.includes('id="place-detail"'),'No redundant destination/status note below the list');
 assert.equal([...html.matchAll(/class="destination(?: selected)?"/g)].length,4);
 assert(html.includes('href="/field-log.css"'));assert(html.includes('src="/field-log.js" defer'));
 assert(html.indexOf('src="/field-log.js"')<html.indexOf('src="/app.js"'));
 const dialog=html.match(/<dialog id="mission-dialog"[\s\S]*?<\/dialog>/)[0];
 assert(dialog.includes('aria-labelledby="mission-title"'));assert(dialog.includes('aria-describedby="mission-objective"'));
 assert.equal([...dialog.matchAll(/<button\b/g)].length,1,'Only close, no pause or replay buttons');
 assert(dialog.includes(lang==='es'?'Cerrar ficha':'Close field record'));
 assert(dialog.includes('<dl class="mission-metrics">'));
}
for(const asset of ['field-log.js','field-log.css'])assert(fs.existsSync(path.join(root,'dist',asset)));
console.log('PASS four approved bilingual field records, planned/completed distinction, HUD motion, dialog wiring and public build.');
