// Check every benefit caption through the real gallery-rendering function.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const messages=require('../translations.js');
const {publicImages}=require('../scripts/images.cjs');
const expected={
 map:['Saber dónde buscar','Know where to look'],
 sonar:['Detectar antes de ver','Detect before you see'],
 camera:['Cada ángulo cuenta','Every angle matters'],
 scooter:['Más alcance, menos esfuerzo','Go further with less effort']
};
for(const lang of ['es','en']){
 const gallery={dataset:{}},image={},avif={},caption={},description={},views={},buttons=Object.keys(expected).map(equipment=>({dataset:{equipment},setAttribute(name,value){this[name]=value;}}));
 const mapButtons=['relief','satellite','perspective'].map(map=>({dataset:{map},setAttribute(name,value){this[name]=value;}}));
 const nodes={'.tech-gallery':gallery,'#equipment-image':image,'#equipment-avif':avif,'#equipment-title':caption,'#equipment-description':description,'#map-views':views};
 const context=vm.createContext({window:{BQImages:publicImages},document:{querySelector:s=>nodes[s],querySelectorAll:s=>s==='[data-map]'?mapButtons:buttons},t:s=>lang==='en'?(messages[s]??s):s});
 vm.runInContext(source.slice(source.indexOf('const equipmentPhotos='),source.indexOf("\ndocument.querySelectorAll('[data-equipment]')")),context);
 for(const [key,copy] of Object.entries(expected)){
  vm.runInContext(`showEquipment('${key}')`,context);
  assert.equal(caption.textContent,copy[lang==='en'?1:0]);
  assert.equal(gallery.dataset.equipment,key);
  assert(description.textContent);assert.equal(buttons.find(b=>b.dataset.equipment===key)['aria-pressed'],'true');
  assert.equal(views.hidden,key!=='map');
  assert(image.alt&&fs.existsSync(path.join(root,image.src)),'Retain an existing photo and descriptive alt text');
  if(key==='camera'){
   assert.equal(image.src,publicImages.camera.src);
   assert.equal(image.alt,lang==='es'?'Cámara 360° sobre un trípode en el fondo marino':'360° camera mounted on a tripod on the seabed');
   assert.equal(image.srcset,publicImages.camera.srcset);
   assert.equal(avif.srcset,publicImages.camera.avif);
  }
  for(const candidate of image.srcset.split(',').filter(Boolean))assert(fs.existsSync(path.join(root,'dist',candidate.trim().split(' ')[0])),'Responsive gallery image must be published');
 }
 vm.runInContext("showEquipment('map')",context);
 for(const view of ['relief','satellite','perspective']){
  vm.runInContext(`showMapView('${view}')`,context);
  assert.equal(image.src,publicImages['map-'+view].src);
  assert.equal(image.srcset,publicImages['map-'+view].srcset);
  assert.equal(avif.srcset,publicImages['map-'+view].avif);
  assert(fs.existsSync(path.join(root,'dist',image.src)),'Every map view is published');
  assert.equal(mapButtons.filter(b=>b['aria-pressed']==='true').length,1);
  assert.equal(mapButtons.find(b=>b.dataset.map===view)['aria-pressed'],'true');
  const selectedImage=image.src;
  vm.runInContext("showEquipment('camera');showEquipment('map');showEquipment(gallery.dataset.equipment)",context);
  assert.equal(image.src,selectedImage,'Keep the selected map across tool/language refresh');
 }
 const html=fs.readFileSync(path.join(root,lang==='es'?'es/index.html':'index.html'),'utf8');
 assert.equal([...html.matchAll(/<button[^>]*data-equipment=/g)].length,4,'Exactly four selectable tools');
 assert(!html.includes('data-equipment="mask"'),'Communication mask is not selectable');
 assert(html.includes(`<h3 id="equipment-title">${expected.map[lang==='en'?1:0]}</h3>`),'Initial static caption matches the dynamic gallery');
}
assert(source.includes('showEquipment(gallery.dataset.equipment)'),'Language refresh must use the selected tool');
for(const width of [640,960])assert(!fs.existsSync(path.join(root,`dist/assets/technology/camera-${width}.webp`)),'Replaced illustration stays out of the deployment');
for(const width of [640,960])assert(!fs.existsSync(path.join(root,`dist/assets/technology/mask-${width}.webp`)),'Hidden mask images stay out of the deployment');
assert(!source.includes("mask-960.webp"));
assert(fs.readFileSync(path.join(root,'styles.css'),'utf8').includes('.equipment button:last-child:nth-child(odd){grid-column:1/-1}'),'Four tools form an even 2-by-2 mobile grid');
console.log('PASS four tools, hidden communication mask, three original map views, EN/ES and responsive assets.');
