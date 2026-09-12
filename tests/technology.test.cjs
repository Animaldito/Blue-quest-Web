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
 const gallery={dataset:{}},image={},caption={},views={},buttons=['relief','satellite','perspective'].map(map=>({dataset:{map},setAttribute(){}}));
 const nodes={'.tech-gallery':gallery,'#equipment-image':image,'#equipment-title':caption,'#map-views':views};
 const context=vm.createContext({document:{querySelector:s=>nodes[s],querySelectorAll:()=>buttons},t:s=>lang==='en'?(messages[s]??s):s});
 vm.runInContext(source.slice(source.indexOf('const equipmentPhotos='),source.indexOf("document.querySelectorAll('[data-equipment]')")),context);
 for(const [key,copy] of Object.entries(expected)){
  vm.runInContext(`showEquipment('${key}')`,context);
  assert.equal(caption.textContent,copy[lang==='en'?1:0]);
  assert.equal(gallery.dataset.equipment,key);
  assert.equal(views.hidden,key!=='map');
  assert(image.alt&&fs.existsSync(path.join(root,image.src)),'Retain an existing photo and descriptive alt text');
 }
 const html=fs.readFileSync(path.join(root,lang==='es'?'es/index.html':'index.html'),'utf8');
 assert(html.includes(`<h3 id="equipment-title">${expected.map[lang==='en'?1:0]}</h3>`),'Initial static caption matches the dynamic gallery');
}
assert(source.includes('t(equipmentPhotos[key].benefit)'),'Language refresh must use the benefit caption');
console.log('PASS all five benefit captions, English/Spanish, initial markup and gallery selection.');
