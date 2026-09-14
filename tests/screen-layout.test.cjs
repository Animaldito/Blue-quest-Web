// Layout guardrails. Actual viewport geometry is also reviewed in the browser.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const desktop=css.slice(css.indexOf('/* Screen-sized desktop sections.'),css.indexOf('@media(prefers-reduced-motion:reduce)'));
assert(desktop.includes('@media(min-width:1024px) and (min-height:640px)'));
assert(desktop.includes('min-height:100dvh;scroll-snap-align:start;scroll-margin-top:0'));
assert(desktop.includes('scroll-padding-top:0'));
assert(desktop.includes('footer{scroll-snap-align:end}'),'The legal footer remains reachable when sections snap');
assert(!/overflow(?:-y)?:\s*(hidden|clip)|(?<!-)height:\s*100dvh|\bzoom\s*:|transform:\s*scale/.test(desktop),'Never clip or scale down whole sections to force them to fit');
assert(css.includes('scroll-snap-type:none!important'),'Respect reduced motion');
for(const lang of ['en','es']){
 const html=fs.readFileSync(path.join(root,'dist',lang,'index.html'),'utf8');
 assert.equal([...html.matchAll(/class="service"/g)].length,3);
 assert.equal([...html.matchAll(/class="team-card"/g)].length,4);
 assert.equal([...html.matchAll(/data-equipment="(map|sonar|camera|scooter)" aria-pressed=/g)].length,4);
 assert(!html.includes('data-equipment="mask"'));
 assert(html.includes('id="metodo"')&&html.includes('id="contact-form"'));
 const shortcuts=html.match(/<nav aria-label="(?:Accesos de exploración|Exploration shortcuts)">([\s\S]*?)<\/nav>/)[1];
 assert(!shortcuts.includes('#metodo'),'The method shortcut opens its complete parent section');
 for(const [,id] of shortcuts.matchAll(/href="#([^"#]+)"/g))assert(html.includes('id="'+id+'"'));
}
console.log('PASS screen-sized desktop sections, non-clipping mobile/zoom fallback, content and complete-section shortcuts.');
