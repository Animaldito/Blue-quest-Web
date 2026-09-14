const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {publicImages}=require('../scripts/images.cjs');
for(const lang of ['es','en']){
 const html=fs.readFileSync(path.join(root,lang,'index.html'),'utf8');
 const section=html.match(/<section id="equipo"[\s\S]*?<\/section>/)[0];
 assert.equal([...section.matchAll(/class="team-card"/g)].length,4);
 assert(section.includes('<h3>Andreu Ferreres</h3>'));
 assert(section.includes(lang==='es'?'alt="Retrato de Andreu Ferreres en un entorno urbano"':'alt="Portrait of Andreu Ferreres in an urban setting"'));
 assert(!/Andreu Ferrer(?!es)/.test(section));
 const cristina=section.match(/<article class="team-card">(?:(?!<\/article>)[\s\S])*Cristina Garcés(?:(?!<\/article>)[\s\S])*<\/article>/)[0];
 assert(cristina.includes(lang==='es'?'DESARROLLO DE NEGOCIO':'BUSINESS DEVELOPMENT'));
 assert(cristina.includes(lang==='es'?'Ingeniera informática · Emprendedora · Submarinista':'Computer engineer · Entrepreneur · Diver'));
 assert(cristina.includes(lang==='es'?'Convierte la necesidad del cliente en un proyecto viable. Define alcance, presupuesto y plazos, coordina proveedores y conecta cada misión con el equipo adecuado.':'Turns client needs into viable projects. Defines scope, budgets and timelines, coordinates suppliers and connects each mission with the right team.'));
 assert(!/GESTIÓN DE PROYECTOS|PROJECT MANAGEMENT|IT specialist|Relaciones públicas/.test(cristina));
 for(const person of ['aida','andreu']){
  assert(section.includes(publicImages[person].src));
  assert(!section.includes(`${person}-profile.webp`));
  assert(fs.existsSync(path.join(root,`assets/team/${person}-20260914.jpg`)),'Keep the original master');
  assert(fs.existsSync(path.join(root,'dist',publicImages[person].src)),'Publish the responsive photo');
  assert(!fs.existsSync(path.join(root,`dist/assets/team/${person}-profile.webp`)));
 }
 for(const person of ['miguel','cristina'])assert(section.includes(publicImages[person].src));
}
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
assert(css.includes('img.team-image-aida{object-position:50% 10%}'));
assert(css.includes('img.team-image-andreu{object-position:50% 18%}'));
console.log('PASS original replacement photos, preserved team layout and Cristina’s updated bilingual profile.');
