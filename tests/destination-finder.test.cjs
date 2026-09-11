const assert=require('node:assert/strict');
const data=require('../data/dive-destinations.v2.json');
const {matchDestinations}=require('../destination-finder.js');
const validMonths=months=>Array.isArray(months)&&months.length>0&&new Set(months).size===months.length&&months.every(m=>Number.isInteger(m)&&m>=1&&m<=12);
const sources=new Map(data.sources.map(s=>[s.id,s]));
const sort=values=>[...new Set(values)].sort((a,b)=>a-b);
assert.equal(data.schemaVersion,2);
assert.equal(sources.size,data.sources.length);
assert.equal(new Set(data.destinations.map(d=>d.id)).size,data.destinations.length);
assert.equal(data.destinations.length,40);
assert.equal(new Set(data.destinations.map(d=>d.country)).size,24);
assert.equal(data.sources.length,67);
for(const source of data.sources){assert.equal(new URL(source.url).protocol,'https:');assert(source.publisher&&source.title&&source.checkedOn);}
for(const d of data.destinations){
 assert(validMonths(d.recommendedMonths),d.id);assert(validMonths(d.operatingMonths),d.id);
 assert(d.recommendedMonths.every(m=>d.operatingMonths.includes(m)),d.id);
 assert(d.sourceIds.length&&d.sourceIds.every(id=>sources.has(id)),d.id);
 assert(d.agencySourceIds.length&&d.agencySourceIds.every(id=>sources.get(id)?.type==='agency'),d.id);
 assert(d.operatorSourceIds.length&&d.operatorSourceIds.every(id=>sources.get(id)?.type==='operator'),d.id);
 assert(d.travelSourceIds.length&&d.travelSourceIds.every(id=>d.sourceIds.includes(id)),d.id);
 assert(['site','destination','route'].includes(d.scope));assert(['scuba','snorkel'].includes(d.mode));
 assert(d.sites.length&&d.summary&&d.highlights&&d.caution&&d.seasonBasis&&d.tripStyle,d.id);
 assert(Array.isArray(d.partialMonths)&&d.partialMonths.every(m=>d.operatingMonths.includes(m)),d.id);
 assert(d.categories.length&&new Set(d.categories).size===d.categories.length,d.id);
 for(const c of d.categories){
  assert(Object.hasOwn(data.categories,c));assert(validMonths(d.categoryMonths[c]));
  assert(d.featureEvidence[c].basis&&d.featureEvidence[c].sourceIds.length);
  assert(d.featureEvidence[c].sourceIds.every(id=>d.sourceIds.includes(id)));
 }
 for(const w of d.wildlife){
  assert(w.name&&validMonths(w.months));assert(w.sourceIds.length&&w.sourceIds.every(id=>d.sourceIds.includes(id)));
  if(w.seasonSourceIds)assert(w.seasonSourceIds.every(id=>d.sourceIds.includes(id)));
  if(w.target)assert(Object.hasOwn(data.targets,w.target));
 }
 assert.deepEqual([...d.pelagicTargets].sort(),[...new Set(d.wildlife.map(w=>w.target).filter(Boolean))].sort());
 for(const target of d.pelagicTargets){
  assert(d.categories.includes('pelagica'));assert(validMonths(d.targetMonths[target]));
  assert.deepEqual(d.targetMonths[target],sort(d.wildlife.filter(w=>w.target===target).flatMap(w=>w.months)));
 }
}
const search=(categories,season,target='')=>matchDestinations(data,{categories,season,target});
const result=(id,categories,season,target='')=>search(categories,season,target).find(m=>m.destination.id===id);
assert(result('tulamben',['macro','corales','pecios'],'verano'));
assert(result('coron',['macro','corales','pecios'],'invierno'));
assert(!result('chuuk',['macro','corales','pecios'],'verano'));
assert(result('rojo-norte',['pecios','corales'],'verano'));
assert(!result('rojo-norte',['pelagica'],'verano','tiburones'));
assert(!result('rojo-norte',['pecios'],'invierno'));
assert(result('rojo-bde',['pelagica','pecios','corales'],'verano','tiburones'),'BDE cannot lose summer hammerheads');
assert.deepEqual(result('maldivas-sur',['pelagica'],'primavera','tiburones').months,[3]);
assert(!result('maldivas-sur',['pelagica'],'verano','tiburones'));
assert(result('fuvahmulah',['pelagica'],'invierno','tiburones'));
assert(result('fuvahmulah',['pelagica'],'primavera','mantas'));
assert(!result('fuvahmulah',['pelagica'],'verano','mantas'));
assert(result('komodo-norte',['corales'],'verano'));
assert(!result('komodo-norte',['corales'],'invierno'));
assert(result('komodo-sur',['corales'],'invierno'));
assert(!result('komodo-sur',['corales'],'verano'));
assert.deepEqual(result('tubbataha',['corales'],'verano').months,[6]);
assert.deepEqual(result('tubbataha',['corales'],'verano').partialMonths,[6]);
assert(!result('tubbataha',['corales'],'otono'));
assert.deepEqual(result('sipadan-mabul',['corales'],'otono').months,[9,10]);
assert.deepEqual(result('palau',['pelagica'],'primavera','mantas').months,[3]);
assert(!result('palau',['pelagica'],'otono','mantas'));
assert.deepEqual(result('similan-richelieu',['pelagica'],'invierno','mantas').months,[2]);
assert.deepEqual(result('similan-richelieu',['pelagica'],'primavera','mantas').months,[3,4]);
assert(!result('similan-richelieu',['pelagica'],'verano','mantas'));
assert(!result('azores-pico',['pelagica'],'verano','mantas'),'Mobulas are not tagged as mantas');
assert(search(['pelagica'],'verano','ballenas').every(m=>m.destination.mode==='snorkel'));
for(const id of ['darwin-wolf','socorro','tofo-mantas'])for(const season of Object.keys(data.seasons))assert(!result(id,['pelagica'],season,'ballenas'));
assert.deepEqual(search(['pelagica','pecios'],'verano','ballenas'),[]);
assert.deepEqual(result('noruega-fiordos',['pelagica'],'invierno','ballenas').months,[12,1]);
assert(result('ribbon-minke',['pelagica'],'verano','ballenas'));
assert(result('tonga-vavau',['pelagica'],'verano','ballenas'));
assert.throws(()=>search([],'verano'));assert.throws(()=>search(Object.keys(data.categories),'verano'));
assert.throws(()=>search(['macro','macro'],'verano'));assert.throws(()=>search(['macro'],'__proto__'));
assert.throws(()=>search(['__proto__'],'verano'));assert.throws(()=>search(['macro'],'verano','ballenas'));
const synthetic=structuredClone(data);
synthetic.destinations=[{...structuredClone(data.destinations[0]),categories:['macro','corales'],operatingMonths:[6,7,8],recommendedMonths:[6,7,8],categoryMonths:{macro:[6],corales:[7]}}];
assert.deepEqual(matchDestinations(synthetic,{categories:['macro','corales'],season:'verano'}),[],'Different months in one season must not be combined');
let queries=0;const categories=Object.keys(data.categories),before=JSON.stringify(data);
for(let mask=1;mask<16;mask++){
 const selected=categories.filter((_,i)=>mask&(1<<i));if(selected.length>3)continue;
 for(const season of Object.keys(data.seasons)){
  for(const target of selected.includes('pelagica')?['',...Object.keys(data.targets)]:['']){
   const expected=data.destinations.filter(d=>selected.every(c=>d.categories.includes(c))&&(!target||d.pelagicTargets.includes(target))).filter(d=>data.seasons[season].months.some(m=>d.operatingMonths.includes(m)&&d.recommendedMonths.includes(m)&&selected.every(c=>d.categoryMonths[c].includes(m))&&(!target||d.targetMonths[target].includes(m))));
   const matches=search(selected,season,target);
   assert.deepEqual(matches.map(m=>m.destination.id).sort(),expected.map(d=>d.id).sort());
   for(const m of matches){
    assert(m.months.length);
    assert(m.months.every(month=>data.seasons[season].months.includes(month)&&m.destination.operatingMonths.includes(month)&&m.destination.recommendedMonths.includes(month)&&selected.every(c=>m.destination.categoryMonths[c].includes(month))&&(!target||m.destination.targetMonths[target].includes(month))));
    assert.deepEqual(m.partialMonths,m.months.filter(month=>m.destination.partialMonths.includes(month)));
   }
   queries++;
  }
 }
}
assert.equal(JSON.stringify(data),before,'Search must not mutate the catalog');
console.log(data.destinations.length+' fichas, '+data.sources.length+' fuentes, procedencia, temporadas y '+queries+' combinaciones: OK');
