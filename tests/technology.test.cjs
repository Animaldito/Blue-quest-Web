// Check every benefit caption through the real gallery-rendering function.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const messages=require('../translations.js');
const expected={
 map:['Saber dónde buscar','Know where to look'],
 sonar:['Detectar antes de ver','Detect before you see'],
 camera:['Cada ángulo cuenta','Every angle matters'],
 scooter:['Más alcance, menos esfuerzo','Go further with less effort'],
 mask:['Conectados, más seguros','Stay connected. Dive safer.']
};
for(const lang of ['es','en']){
 const gallery={dataset:{}},image={},caption={},description={},views={},buttons=Object.keys(expected).map(equipment=>({dataset:{equipment},setAttribute(name,value){this[name]=value;}}));
 const mapButtons=['relief','satellite','perspective'].map(map=>({dataset:{map},setAttribute(name,value){this[name]=value;}}));
 const nodes={'.tech-gallery':gallery,'#equipment-image':image,'#equipment-title':caption,'#equipment-description':description,'#map-views':views};
 const context=vm.createContext({document:{querySelector:s=>nodes[s],querySelectorAll:s=>s==='[data-map]'?mapButtons:buttons},t:s=>lang==='en'?(messages[s]??s):s});
 vm.runInContext(source.slice(source.indexOf('const equipmentPhotos='),source.indexOf("\ndocument.querySelectorAll('[data-equipment]')")),context);
 for(const [key,copy] of Object.entries(expected)){
  vm.runInContext(`showEquipment('${key}')`,context);
  assert.equal(caption.textContent,copy[lang==='en'?1:0]);
  assert.equal(gallery.dataset.equipment,key);
  assert(description.textContent);assert.equal(buttons.find(b=>b.dataset.equipment===key)['aria-pressed'],'true');
  assert.equal(views.hidden,key!=='map');
  assert(image.alt&&fs.existsSync(path.join(root,image.src)),'Retain an existing photo and descriptive alt text');
 }
 vm.runInContext("showEquipment('map')",context);
 for(const view of ['relief','satellite','perspective']){
  vm.runInContext(`showMapView('${view}')`,context);
  assert.equal(image.src,'/assets/technology/map-'+view+'.jpg');
  assert.equal(image.srcset,'');
  assert(fs.existsSync(path.join(root,'dist',image.src)),'Every map view is published');
  assert.equal(mapButtons.filter(b=>b['aria-pressed']==='true').length,1);
  assert.equal(mapButtons.find(b=>b.dataset.map===view)['aria-pressed'],'true');
  const selectedImage=image.src;
  vm.runInContext("showEquipment('camera');showEquipment('map');showEquipment(gallery.dataset.equipment)",context);
  assert.equal(image.src,selectedImage,'Keep the selected map across tool/language refresh');
 }
 const html=fs.readFileSync(path.join(root,lang==='es'?'es/index.html':'index.html'),'utf8');
 assert(html.includes(`<h3 id="equipment-title">${expected.map[lang==='en'?1:0]}</h3>`),'Initial static caption matches the dynamic gallery');
}
assert(source.includes('showEquipment(gallery.dataset.equipment)'),'Language refresh must use the selected tool');
console.log('PASS five benefit captions and three original map views, EN/ES, published images and selection persistence.');
