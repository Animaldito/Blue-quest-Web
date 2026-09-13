const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../dist');
for(const file of ['TODO.md','AGENTS.md','README.md','TEAM-OPERATIONS.md','content/es/index.html','tests/contact.test.cjs','api/contact.js','assets/services/resort.jpg','assets/technology/sonar.jpg','.env'])assert(!fs.existsSync(path.join(root,file)),file+' must not be a public asset');
for(const lang of ['en','es'])for(const file of ['index.html','aviso-legal.html','privacidad.html']){
 const html=fs.readFileSync(path.join(root,lang,file),'utf8'),suffix=file==='index.html'?'':file;
 assert(html.includes('rel="canonical" href="https://www.bqexplore.com/'+lang+'/'+suffix+'"'));
 assert(html.includes('property="og:title"'));assert(html.includes('property="og:image"'));assert(html.includes('name="twitter:card"'));
 if(file==='index.html'){const json=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);assert.equal(json['@type'],'Organization');assert.equal(json.name,'Blue Quest');assert(!html.includes('<iframe'));assert(html.includes('data-project='));}
 for(const [,asset] of html.matchAll(/(?:src|href)="(\/[^"#?]+\.(?:css|js|svg|jpg|webp|png))"/g))assert(fs.existsSync(path.join(root,asset)),asset);
}
assert(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('/sitemap.xml'));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal([...sitemap.matchAll(/<loc>/g)].length,6);
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert(!css.includes('destination-finder.css'));assert(css.length<26000);
console.log('PASS public file allowlist, metadata, structured data, sitemap and local asset links.');
