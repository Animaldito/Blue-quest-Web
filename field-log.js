// Public project facts supplied and approved by Blue Quest. No precise site locations.
(function(root){
 'use strict';
 const records=[
  {name:'Raa Atoll',country:'Maldivas',client:'Proyecto para resort',status:'completed',
   objective:'Crear la oferta de buceo para un resort de nueva construcción.',
   metrics:[['Trabajo en destino','4','meses'],['Puntos localizados','+10','puntos de buceo de calidad'],['Acceso en dhoni','≤30','minutos hasta los puntos']],
   outcomes:[['Arrecife cartografiado','Todo el arrecife local.'],['Zona de formación','Área seleccionada para Open Water y bautizos.'],['Diversidad de inmersiones','Canales, thilas y paredes con extraplomos.']]},
  {name:'Boa Vista',country:'Cabo Verde',client:'Proyecto para centro de buceo',status:'completed',
   objective:'Ampliar la oferta de un centro de buceo local con nuevos puntos de interés.',
   metrics:[['Trabajo en destino','3','semanas'],['Hallazgos principales','2','puntos de especial interés'],['Otros hallazgos','Varios','puntos adicionales']],
   outcomes:[['Bajo con vida marina','Mayor concentración de vida que en las zonas habituales del centro.'],['Cuevas con tiburones','Un nuevo punto destacado para la oferta local.'],['Más opciones de buceo','Identificados otros puntos de menor envergadura.']]},
  {name:'Leyte',country:'Filipinas',client:'Encargo de inversión privada',status:'planned',
   objective:'Evaluar el potencial de buceo y la viabilidad de un nuevo centro en una zona poco explorada y no masificada.',
   metrics:[['Estancia prevista','3','semanas'],['Inicio previsto','Octubre','2026'],['Encargo','Viabilidad','de un nuevo centro de buceo']],
   outcomes:[['Potencial subacuático','Prospectar la zona y reconocer posibles puntos de inmersión.'],['Entorno operativo','Evaluar las condiciones locales para una futura actividad de buceo.'],['Decisión de inversión','Aportar criterios para valorar la apertura del centro.']]},
  {name:'Addu Atoll',country:'Maldivas',client:'Proyecto para centro de buceo',status:'planned',
   objective:'Ampliar los puntos de inmersión de un centro de buceo, priorizando tiburones y mantas oceánicas.',
   metrics:[['Estancia prevista','15','días'],['Inicio previsto','Noviembre','2026'],['Prioridad','Pelágicos','tiburones y mantas oceánicas']],
   outcomes:[['Nuevos puntos','Prospectar zonas que amplíen la oferta del centro.'],['Vida pelágica','Priorizar la búsqueda de tiburones y mantas oceánicas.'],['Interés operativo','Valorar el potencial de las zonas reconocidas para el centro.']]}
 ];
 if(typeof module==='object'&&module.exports){module.exports=records;return;}
 const dialog=document.querySelector('#mission-dialog');
 if(!dialog)return;
 const card=dialog.querySelector('.mission-card');
 const close=dialog.querySelector('.mission-close');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let selected=0,opener=null,scrollY=0,returnFrame=0,backdropDown=false;
 const t=text=>root.BQ.t(text);
 function text(selector,value){dialog.querySelector(selector).textContent=t(value);}
 function render(){
  const record=records[selected];
  dialog.dataset.status=record.status;
  text('#mission-title',record.name);
  text('#mission-country',record.country);
  text('#mission-client',record.client);
  text('#mission-objective',record.objective);
  text('#mission-outcomes-title',record.status==='completed'?'Resultados de campo':'Objetivos previstos');
  text('#mission-state',record.status==='completed'?'Campaña completada':'Prospección programada');
  const metrics=dialog.querySelector('.mission-metrics');metrics.replaceChildren();
  record.metrics.forEach(([label,value,unit],i)=>{
   const group=document.createElement('div');group.className='mission-metric mission-reveal';group.style.setProperty('--reveal-delay',(1.1+i*.25)+'s');
   const term=document.createElement('dt');term.textContent=t(label);
   const definition=document.createElement('dd');
   const number=document.createElement('span');number.className='mission-value';number.textContent=t(value);
   if(value.length>3)number.classList.add('mission-value-word');
   const detail=document.createElement('span');detail.className='mission-unit';detail.textContent=t(unit);
   definition.append(number,detail);group.append(term,definition);metrics.append(group);
  });
  const outcomes=dialog.querySelector('.mission-outcomes');outcomes.replaceChildren();
  record.outcomes.forEach(([title,body],i)=>{
   const article=document.createElement('article');article.className='mission-outcome mission-reveal';article.style.setProperty('--reveal-delay',(2.1+i*.25)+'s');
   const heading=document.createElement('h3');heading.textContent=t(title);
   const copy=document.createElement('p');copy.textContent=t(body);
   article.append(heading,copy);outcomes.append(article);
  });
 }
 function settle(){dialog.classList.remove('mission-entering');}
 function open(index,trigger){
  if(!Number.isInteger(index)||!records[index])return;
  selected=index;render();
  if(!dialog.open){
   cancelAnimationFrame(returnFrame);
   opener=trigger instanceof HTMLElement?trigger:document.activeElement;
   scrollY=window.scrollY;
   // Fix the page at its current position, including on mobile Safari.
   document.body.style.setProperty('--mission-scroll-top',-scrollY+'px');
   document.documentElement.classList.add('mission-modal-open');
   dialog.showModal();
  }
  settle();dialog.scrollTop=0;
  if(!reduced.matches){void card.offsetWidth;dialog.classList.add('mission-entering');}
  close.focus({preventScroll:true});
 }
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);
  const first=controls[0],last=controls[controls.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 dialog.addEventListener('pointerdown',event=>{
  const b=dialog.getBoundingClientRect();
  backdropDown=event.target===dialog&&(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom);
 });
 dialog.addEventListener('pointerup',event=>{
  const b=dialog.getBoundingClientRect();
  if(backdropDown&&event.target===dialog&&(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom))dialog.close();
  backdropDown=false;
 });
 dialog.addEventListener('close',()=>{
  settle();
  document.documentElement.classList.remove('mission-modal-open');
  document.documentElement.classList.add('mission-restoring');
  document.body.style.removeProperty('--mission-scroll-top');
  window.scrollTo({top:scrollY,behavior:'instant'});
  if(opener?.isConnected)opener.focus({preventScroll:true});
  returnFrame=requestAnimationFrame(()=>document.documentElement.classList.remove('mission-restoring'));
 });
 reduced.addEventListener('change',event=>{if(event.matches)settle();});
 // Changing language must update facts, not restart the animation.
 document.addEventListener('bq:languagechange',()=>{if(dialog.open){settle();render();}});
 root.BQFieldLog={open};
})(typeof window==='undefined'?globalThis:window);
