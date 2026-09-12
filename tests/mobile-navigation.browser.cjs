const assert=require('node:assert/strict');
const {chromium}=require(process.env.BQ_PLAYWRIGHT_PATH||'playwright');
const base=process.env.BQ_TEST_URL||'http://127.0.0.1:4173';
const screenshotDirectory=process.env.BQ_SCREENSHOT_DIR;
if(screenshotDirectory)require('node:fs').mkdirSync(screenshotDirectory,{recursive:true});
async function check(p,width,lang){
 await p.evaluate(lang=>document.querySelector(`[data-language="${lang}"]`).click(),lang);
 await p.evaluate(()=>document.fonts.ready);
 const expected=lang==='en'?['What we do','Expeditions','Technology','The Team','Contact']:['Qué hacemos','Expediciones','Tecnología','The Team','Contacto'];
 const links=p.locator('.sidebar nav a');assert.deepEqual(await links.allTextContents(),expected);
 const metrics=await links.evaluateAll(as=>as.map(a=>{const r=a.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(a);return{text:a.textContent,x:r.x,right:r.right,y:r.y,bottom:r.bottom,w:r.width,h:r.height,scroll:a.scrollWidth,client:a.clientWidth,rows:[...new Set([...range.getClientRects()].map(r=>Math.round(r.y)))],textRects:[...range.getClientRects()].map(t=>({x:t.x,right:t.right,top:t.top,bottom:t.bottom}))}}));
 for(const m of metrics){
  assert(m.w>=44&&m.h>=44&&m.x>=0&&m.right<=width+1&&m.scroll<=m.client+1,JSON.stringify(m));
  assert.equal(m.rows.length,1,'Label must stay on a single line: '+JSON.stringify(m));
  for(const t of m.textRects)assert(t.x>=m.x&&t.right<=m.right+1&&t.top>=m.y&&t.bottom<=m.bottom+1,JSON.stringify(m));
 }
 for(let i=0;i<metrics.length;i++)for(let j=i+1;j<metrics.length;j++){const a=metrics[i],d=metrics[j];assert(!(a.x<d.right-1&&a.right>d.x+1&&a.y<d.bottom-1&&a.bottom>d.y+1));}
 assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 for(let i=0;i<expected.length;i++){
  await links.nth(i).click();
  const id=await links.nth(i).getAttribute('href');await p.waitForFunction(id=>location.hash===id,id);
  const state=await p.evaluate(id=>({header:document.querySelector('header.sidebar').getBoundingClientRect().bottom,heading:document.querySelector(id+' h2').getBoundingClientRect().top}),id);
  assert(state.heading>=state.header,`${width} ${lang} hidden heading ${JSON.stringify(state)}`);
  await p.waitForFunction(id=>document.querySelector(`.sidebar nav a[href="${id}"]`).getAttribute('aria-current')==='location',id);
 }
}
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});try{
 for(const [width,height] of [[280,760],[320,800],[360,800],[375,812],[390,844],[414,896],[480,800],[481,800],[540,720],[640,800],[740,360],[760,800]]){
  const p=await b.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(base+'/#expediciones');
  for(const lang of ['en','es']){await check(p,width,lang);if(screenshotDirectory&&[320,390,740].includes(width))await p.locator('header.sidebar').screenshot({path:require('node:path').join(screenshotDirectory,`mobile-nav-${width}-${lang}.png`)});}
  if(width===320){await p.addStyleTag({content:'header.sidebar>nav>a,header.sidebar>nav>a:first-child,header.sidebar>nav>a:last-child{font-size:26px!important}'});for(const lang of ['en','es'])await check(p,width,lang);}
  // Orientation change triggers height measurement and preserves complete labels.
  if(width===390){await p.setViewportSize({width:740,height:390});await check(p,740,'es');await p.setViewportSize({width:390,height:844});await check(p,390,'en');}
  assert.deepEqual(errors,[]);await p.close();console.log('PASS labels, touch targets, anchors and active state '+width);
 }
 const p=await b.newPage({viewport:{width:1440,height:900}});await p.goto(base);assert.equal(await p.locator('.sidebar nav').evaluate(n=>getComputedStyle(n).flexDirection),'column');assert.equal(await p.evaluate(()=>document.documentElement.style.getPropertyValue('--mobile-header-height')),'');await p.close();console.log('PASS desktop rail unchanged');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
