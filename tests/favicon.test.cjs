const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const icon=read('favicon.svg');
const paths=svg=>[...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(paths(icon),paths(read('quest-mark.svg')),'Use the current Q-and-fin anagram');
assert(icon.includes('viewBox="0 0 256 256"'));
assert(icon.includes('fill="#2cddc3"')&&icon.includes('fill="#fff"'),'Match the sidebar brand colours');
assert(!/<(?:script|image|text)\b/.test(icon),'Keep the tiny icon self-contained, without lettering');
for(const prefix of ['', 'es/'])for(const page of ['index.html','privacidad.html','aviso-legal.html']){
 const links=read(prefix+page).match(/<link\b[^>]*rel="icon"[^>]*>/g)||[];
 assert.equal(links.length,1);
 assert(links[0].includes('href="/favicon.svg?v=quest-20260912"'),'Use a fresh shared icon URL in both languages');
 assert(links[0].includes('sizes="any"')&&links[0].includes('type="image/svg+xml"'));
}
console.log('PASS current anagram, brand colours and versioned favicon on all six pages.');
