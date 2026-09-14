// Publish an explicit file set, never the checkout or its internal notes.
const fs=require('node:fs'),path=require('node:path');
require('./build-languages.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
const {manifest,publicImages}=require('./images.cjs');
const galleryImages=Object.fromEntries(Object.entries(publicImages).filter(([id])=>id.startsWith('map-')||['camera','sonar','scooter'].includes(id)));
fs.writeFileSync(path.join(root,'image-assets.js'),'window.BQImages='+JSON.stringify(galleryImages)+';\n');
const files=['index.html','aviso-legal.html','privacidad.html','styles.css','language.css','legal.css','language.js','translations.js','app.js','image-assets.js','contact.js','world.js','favicon.svg','robots.txt','sitemap.xml'];
for(const lang of ['en','es'])for(const file of ['index.html','aviso-legal.html','privacidad.html'])files.push(lang+'/'+file);
files.push('field-log.js','field-log.css');
for(const item of Object.values(manifest))for(const variant of item.variants)files.push(variant.avif.file,variant.fallback.file);
for(const font of fs.readdirSync(path.join(root,'fonts')))if(/\.(css|ttf|woff2)$/.test(font)||/LICENSE\.txt$/.test(font))files.push('fonts/'+font);
// Refuse unexpected stale files; do not silently publish or delete them.
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
if(fs.existsSync(out))for(const file of walk(out)){const rel=path.relative(out,file).replaceAll('\\','/');if(!files.includes(rel))throw Error('Unexpected file in build output: '+rel);}
for(const relative of files){const source=path.join(root,relative),target=path.join(out,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(source,target);}
console.log('Public allowlist: '+files.length+' files. Notes, tests, source content and unused media excluded.');
