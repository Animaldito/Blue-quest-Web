const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {manifest,publicImages}=require('../scripts/images.cjs'),root=path.resolve(__dirname,'..');
assert.equal(Object.keys(manifest).length,15,'All fifteen visible photographs have responsive variants');
for(const [id,image] of Object.entries(manifest)){
 const largest=image.variants.at(-1);
 if(largest.width===image.width)assert(largest.avif.bytes<=largest.fallback.bytes,'Full-resolution modern image must be no heavier than its fallback');
 if(id==='natalia')for(const encoding of ['avif','fallback'])assert(largest[encoding].bytes<fs.statSync(path.join(root,'assets/team/natalia-approved-20260930.jpg')).size,'Responsive portrait is smaller than its preserved master');
 let previous=0;
 for(const variant of image.variants){
  assert(variant.width>previous&&variant.width<=image.width,'Ascending sizes without artificial upscaling');previous=variant.width;
  assert(Math.abs(variant.width/variant.height-image.width/image.height)<.015,'Keep the original aspect ratio');
  for(const encoding of ['avif','fallback']){
   const {file,bytes}=variant[encoding],buffer=fs.readFileSync(path.join(root,file));
   assert.equal(buffer.length,bytes);assert(file.includes(crypto.createHash('sha256').update(buffer).digest('hex').slice(0,12)),'Content-addressed filenames support safe immutable caching');
   assert.deepEqual(fs.readFileSync(path.join(root,'dist',file)),buffer);
  }
  assert(variant.ssim>=(id.startsWith('map-')?.992:.985),'High fidelity encoding guardrail');
 }
 assert(publicImages[id].srcset&&publicImages[id].avif&&publicImages[id].sizes);
}
for(const lang of ['en','es']){
 const html=fs.readFileSync(path.join(root,'dist',lang,'index.html'),'utf8');
 assert.equal([...html.matchAll(/<picture class="responsive-photo"/g)].length,10);
 assert.equal([...html.matchAll(/type="image\/avif"/g)].length,10);
 assert.equal([...html.matchAll(/decoding="async"/g)].length,10);
 assert.equal([...html.matchAll(/loading="lazy"/g)].length,9);
 assert(html.includes('fetchpriority="high"'));
 assert(html.indexOf('src="/image-assets.js"')<html.indexOf('src="/app.js"'));
 for(const [,srcset] of html.matchAll(/srcset="([^"]*)"/g))for(const candidate of srcset.split(','))assert(fs.existsSync(path.join(root,'dist',candidate.trim().split(' ')[0])));
}
const config=require('../vercel.json');assert(config.headers.some(h=>h.source==='/assets/optimized/(.*)'&&h.headers.some(v=>v.key==='Cache-Control'&&v.value.includes('immutable'))));
console.log('PASS all photos, responsive AVIF and fallback assets, fidelity, aspect ratios, lazy loading, priority and cache integrity.');
