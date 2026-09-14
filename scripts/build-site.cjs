// Publish an explicit file set, never the checkout or its internal notes.
const fs=require('node:fs'),path=require('node:path');
require('./build-languages.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const files=['index.html','aviso-legal.html','privacidad.html','styles.css','language.css','legal.css','language.js','translations.js','app.js','contact.js','world.js','favicon.svg','assets/hero/reef-survey.webp','assets/technology/map-relief.jpg','assets/technology/map-satellite.jpg','assets/technology/map-perspective.jpg','robots.txt','sitemap.xml'];
for(const lang of ['en','es'])for(const file of ['index.html','aviso-legal.html','privacidad.html'])files.push(lang+'/'+file);
files.push('field-log.js','field-log.css');
for(const image of ['resort','boat','wreck'])for(const width of [480,800])files.push('assets/services/'+image+'-'+width+'.webp');
for(const image of ['camera','sonar','scooter','mask'])for(const width of [640,960])files.push('assets/technology/'+image+'-'+width+'.webp');
for(const person of ['miguel','cristina'])files.push('assets/team/'+person+'-profile.webp');
for(const person of ['aida','andreu'])files.push('assets/team/'+person+'-20260914.jpg');
for(const font of fs.readdirSync(path.join(root,'fonts')))if(/\.(css|ttf|woff2)$/.test(font)||/LICENSE\.txt$/.test(font))files.push('fonts/'+font);
// Refuse unexpected stale files; do not silently publish or delete them.
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
if(fs.existsSync(out))for(const file of walk(out)){const rel=path.relative(out,file).replaceAll('\\','/');if(!files.includes(rel))throw Error('Unexpected file in build output: '+rel);}
for(const relative of files){const source=path.join(root,relative),target=path.join(out,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);}
console.log('Public allowlist: '+files.length+' files. Notes, tests, source content and unused media excluded.');
