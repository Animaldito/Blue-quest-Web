const assert=require('node:assert/strict');
const data=require('../data/dive-destinations.v1.json');
const {matchDestinations}=require('../destination-finder.js');
const validMonths=months=>Array.isArray(months)&&months.length>0&&new Set(months).size===months.length&&months.every(m=>Number.isInteger(m)&&m>=1&&m<=12);
const sources=new Set(data.sources.map(s=>s.id));
assert.equal(sources.size,data.sources.length);
assert.equal(new Set(data.destinations.map(d=>d.id)).size,21);
for(const source of data.sources)assert.equal(new URL(source.url).protocol,'https:');
for(const d of data.destinations){
 assert(validMonths(d.recommendedMonths));assert(d.sourceIds.every(id=>sources.has(id)));assert(d.sourceIds.length);
 assert(['site','destination'].includes(d.scope));assert(['scuba','snorkel'].includes(d.mode));
 for(const c of d.categories){assert(Object.hasOwn(data.categories,c));assert(validMonths(d.categoryMonths[c]));}
 for(const target of d.pelagicTargets){assert(d.categories.includes('pelagica'));assert(Object.hasOwn(data.targets,target));assert(validMonths(d.targetMonths[target]));}
}
const search=(categories,season,target='')=>matchDestinations(data,{categories,season,target});
assert(search(['macro','corales','pecios'],'verano').some(m=>m.destination.id==='tulamben'));
assert(search(['pelagica'],'verano','ballenas').every(m=>m.destination.mode==='snorkel'));
assert(!search(['pelagica'],'verano','ballenas').some(m=>m.destination.id==='darwin-wolf'));
assert.deepEqual(search(['pelagica','pecios'],'verano','ballenas'),[]);
assert.deepEqual(search(['pelagica'],'invierno','ballenas').find(m=>m.destination.id==='silver-bank').months,[1,2]);
assert.deepEqual(search(['corales'],'verano').find(m=>m.destination.id==='tubbataha').partialMonths,[6]);
assert(!search(['corales'],'otono').some(m=>m.destination.id==='tubbataha'));
assert.throws(()=>search([],'verano'));assert.throws(()=>search(Object.keys(data.categories),'verano'));assert.throws(()=>search(['macro','macro'],'verano'));assert.throws(()=>search(['macro'],'__proto__'));assert.throws(()=>search(['macro'],'verano','ballenas'));
const synthetic=structuredClone(data);synthetic.destinations=[structuredClone(data.destinations[0])];synthetic.destinations[0].recommendedMonths=[6,7,8];synthetic.destinations[0].categoryMonths={macro:[6],corales:[7]};
assert.deepEqual(matchDestinations(synthetic,{categories:['macro','corales'],season:'verano'}),[],'Different months in one season must not be combined');
let queries=0;const categories=Object.keys(data.categories);
for(let mask=1;mask<16;mask++){const selected=categories.filter((_,i)=>mask&(1<<i));if(selected.length>3)continue;for(const season of Object.keys(data.seasons)){for(const target of selected.includes('pelagica')?['',...Object.keys(data.targets)]:['']){for(const m of search(selected,season,target)){assert(selected.every(c=>m.destination.categories.includes(c)));assert(m.months.every(month=>data.seasons[season].months.includes(month)));if(target)assert(m.destination.pelagicTargets.includes(target));}queries++;}}}
console.log('21 fichas, 33 fuentes, validación de datos y '+queries+' combinaciones: OK');
