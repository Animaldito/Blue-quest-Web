/* Deterministic local matching; no user answers leave this page. */
(function (root) {
 'use strict';
 const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
 function matchDestinations(data,query){
  if(!query||!Array.isArray(query.categories)||query.categories.length<1||query.categories.length>3||new Set(query.categories).size!==query.categories.length||query.categories.some(c=>!own(data.categories,c)))throw new Error('Elige entre uno y tres intereses diferentes.');
  if(!own(data.seasons,query.season))throw new Error('Selecciona una época del año.');
  if(query.target&&(!own(data.targets,query.target)||!query.categories.includes('pelagica')))throw new Error('Selecciona un grupo de fauna válido.');
  const months=data.seasons[query.season].months;
  return data.destinations.flatMap(destination=>{
   if(!query.categories.every(c=>destination.categories.includes(c)))return [];
   if(query.target&&!destination.pelagicTargets.includes(query.target))return [];
   const matches=months.filter(month=>destination.operatingMonths.includes(month)&&destination.recommendedMonths.includes(month)&&query.categories.every(c=>destination.categoryMonths[c]?.includes(month))&&(!query.target||destination.targetMonths[query.target]?.includes(month)));
   if(!matches.length)return [];
   return [{destination,months:matches,categories:[...query.categories],target:query.target||null,partialMonths:matches.filter(m=>destination.partialMonths.includes(m))}];
  }).sort((a,b)=>b.months.length-a.months.length||a.destination.name.localeCompare(b.destination.name,'es'));
 }
 const api={matchDestinations};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 root.BlueQuestDestinations=api;
 if(typeof document==='undefined')return;
 const section=document.querySelector('#tu-destino');
 if(!section)return;
 const form=section.querySelector('form'),feedback=section.querySelector('#finder-feedback'),next=section.querySelector('#finder-next'),back=section.querySelector('#finder-back'),results=section.querySelector('#finder-results');
 const fieldsets=[...form.querySelectorAll('fieldset')];
 let step='interests',loadPromise=null,generation=0;
 const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const choices=()=>[...form.querySelectorAll('[name="interest"]:checked')].map(input=>input.value);
 const steps=()=>choices().includes('pelagica')?['interests','fauna','season','results']:['interests','season','results'];
 function loadData(){
  if(!loadPromise){
   const controller=new AbortController();
   const timeout=setTimeout(()=>controller.abort(),12000);
   loadPromise=fetch('data/dive-destinations.v2.json',{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('No se pudieron cargar las fichas.');return response.json();}).then(data=>{if(data.schemaVersion!==2||!Array.isArray(data.destinations))throw new Error('La base de destinos no es válida.');section.querySelector('[data-catalog-coverage]').textContent=data.destinations.length+' fichas de zonas y rutas en '+new Set(data.destinations.map(d=>d.country)).size+' países y territorios. ';return data;}).catch(error=>{loadPromise=null;throw error;}).finally(()=>clearTimeout(timeout));
  }
  return loadPromise;
 }
 const preload=()=>{loadData().catch(()=>{});};
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){preload();observer.disconnect();}},{rootMargin:'350px'});observer.observe(section);}
 section.addEventListener('focusin',preload,{once:true});
 function progress(){
  section.querySelector('[data-fauna-step]').hidden=!choices().includes('pelagica');
  [...section.querySelectorAll('.finder-progress li')].forEach((item,i)=>{if(['interests','fauna','season','results'][i]===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
 }
 function showStep(value,focus=true){
  generation++;step=value;form.hidden=false;results.hidden=true;
  fieldsets.forEach(fieldset=>fieldset.hidden=fieldset.dataset.finderStep!==step);
  back.hidden=step==='interests';next.disabled=false;next.textContent=step==='season'?'Ver destinos':'Continuar';feedback.textContent='';
  progress();
  if(focus){const legend=form.querySelector('fieldset:not([hidden]) legend');legend.tabIndex=-1;legend.focus();}
 }
 form.addEventListener('change',event=>{
  if(event.target.name==='interest'){
   if(choices().length>3){event.target.checked=false;feedback.textContent='Puedes elegir hasta tres intereses. Desmarca uno para cambiarlo.';}
   else feedback.textContent=choices().length+' de 3 intereses seleccionados.';
   if(!choices().includes('pelagica'))form.querySelector('[name="animal"][value=""]').checked=true;
   progress();
  }else feedback.textContent='';
  preload();
 });
 back.addEventListener('click',()=>showStep(steps()[steps().indexOf(step)-1]));
 section.querySelector('#finder-edit').addEventListener('click',()=>showStep('interests'));
 function card(match,data){
  const d=match.destination;
  const listMonths=values=>values.length===12?'Todo el año':values.map(m=>monthNames[m-1]).join(' · ');
  const months=match.months.map(m=>monthNames[m-1]+(match.partialMonths.includes(m)?' (parcial)':'')).join(' · ');
  const selected=match.categories.map(c=>data.categories[c]).concat(match.target?[data.targets[match.target]]:[]);
  const fauna=d.wildlife.filter(w=>!match.target||!w.target||w.target===match.target);
  const wildlife=fauna.length?'<div class="finder-wildlife"><h5>Fauna y épocas de interés</h5><ul>'+fauna.map(w=>{
   const current=w.months.some(m=>match.months.includes(m));
   return '<li><strong>'+esc(w.name)+'</strong><span>'+esc(listMonths(w.months))+'</span><small>'+(current?'Coincide con alguno de tus meses.':'Su ventana destacada queda fuera de tus meses.')+(w.note?' '+esc(w.note):'')+'</small></li>';
  }).join('')+'</ul></div>':'';
  const scope=d.scope==='route'?'La combinación corresponde a varias inmersiones de esta ruta.':d.scope==='site'?'Ficha de un punto concreto.':'La combinación puede requerir varios puntos y salidas desde esta base.';
  return '<article class="finder-result-card" data-destination="'+esc(d.id)+'"><p class="finder-location">'+esc(d.country)+' / '+esc(d.region)+'</p><h4>'+esc(d.name)+'</h4><p class="finder-trip-style">'+esc(d.tripStyle)+'</p><div class="finder-tags">'+selected.map(label=>'<span class="finder-tag">'+esc(label)+'</span>').join('')+'<span class="finder-tag">'+(d.mode==='scuba'?'Buceo con botella':'Snorkel / superficie')+'</span></div><p>'+esc(d.summary)+'</p><p class="finder-months">Meses que encajan: '+esc(months)+'</p><details><summary>Ver ruta y temporada</summary><h5>Qué reúne este viaje</h5><p>'+esc(d.highlights)+'</p><ul class="finder-sites">'+d.sites.map(site=>'<li>'+esc(site)+'</li>').join('')+'</ul><h5>Cuándo ir</h5><p>'+esc(d.seasonLabel)+'.</p>'+wildlife+'<p class="finder-caution">'+esc(d.caution)+'</p><p>'+scope+' La fauna es salvaje: no se garantiza el encuentro.</p></details></article>';
 }
 function appendGroup(container,matches,data,title,note){
  if(!matches.length)return;
  const heading=document.createElement('h4');heading.className='finder-group-heading';heading.textContent=title;container.append(heading);
  if(note){const p=document.createElement('p');p.className='finder-surface-note';p.textContent=note;container.append(p);}
  const list=document.createElement('div');list.className='finder-match-list';container.append(list);
  let visible=0;
  const more=document.createElement('button');more.type='button';more.className='finder-show-more';
  function append(){const batch=matches.slice(visible,visible+3);list.insertAdjacentHTML('beforeend',batch.map(match=>card(match,data)).join(''));visible+=batch.length;more.hidden=visible>=matches.length;more.textContent='Ver más destinos ('+(matches.length-visible)+')';}
  more.addEventListener('click',()=>{const firstNew=visible;append();const h=list.children[firstNew]?.querySelector('h4');if(h){h.tabIndex=-1;h.focus();}});
  append();container.append(more);
 }
 function displayResults(data,query){
  const matches=matchDestinations(data,query),container=section.querySelector('#finder-matches');container.replaceChildren();
  const scuba=matches.filter(match=>match.destination.mode==='scuba'),surface=matches.filter(match=>match.destination.mode==='snorkel');
  if(!matches.length){const p=document.createElement('p');p.className='finder-empty';p.textContent='Todavía no tenemos una ficha que reúna todos esos intereses en los mismos meses. Prueba otra época o quita un interés. No significa que ese viaje no exista: solo mostramos combinaciones documentadas en nuestro catálogo.';container.append(p);}
  if(!scuba.length&&surface.length){const p=document.createElement('p');p.className='finder-empty';p.textContent='Para esta búsqueda, las fichas disponibles son encuentros de superficie, no inmersiones con botella.';container.append(p);}
  appendGroup(container,scuba,data,'Buceo con botella');
  appendGroup(container,surface,data,'Snorkel y encuentros de superficie','Son experiencias diferentes al buceo con botella. Confirma la modalidad y el operador autorizado antes de reservar.');
  const labels=query.categories.map(c=>data.categories[c]);if(query.target)labels.push(data.targets[query.target]);
  section.querySelector('#finder-query').textContent=labels.join(' + ')+' · '+data.seasons[query.season].label+' · '+matches.length+(matches.length===1?' ficha compatible.':' fichas compatibles.')+' Todas reúnen tus intereses en los meses indicados. El orden no representa una probabilidad de avistamiento.';
  form.hidden=true;results.hidden=false;step='results';progress();results.querySelector('h3').focus();
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(step==='interests'){
   if(!choices().length){feedback.textContent='Selecciona al menos un interés para continuar.';return;}
   showStep(steps()[1]);return;
  }
  if(step==='fauna'){showStep('season');return;}
  if(step!=='season')return;
  const season=form.querySelector('[name="season"]:checked')?.value;
  if(!season){feedback.textContent='Elige una época para consultar las fichas.';return;}
  const token=++generation;
  const query={categories:choices(),season,target:choices().includes('pelagica')?form.querySelector('[name="animal"]:checked').value:''};
  next.disabled=true;feedback.textContent='Cargando las fichas de destinos…';
  try{const data=await loadData();if(token===generation)displayResults(data,query);}
  catch{if(token===generation)feedback.textContent='No hemos podido cargar las fichas. Comprueba tu conexión y pulsa «Ver destinos» para reintentar. Tus respuestas se conservan.';}
  finally{if(token===generation)next.disabled=false;}
 });
 showStep('interests',false);
})(typeof globalThis!=='undefined'?globalThis:this);
