const t=window.BQ.t;
const canvas=document.querySelector('#globe'),ctx=canvas.getContext('2d');
const places=[{name:'Raa Atoll',lat:5.67,lon:72.93,status:'Exploración realizada en este destino.'},{name:'Boa Vista',lat:16.1,lon:-22.8,status:'Exploración realizada en este destino.'},{name:'Leyte',lat:10.9,lon:124.8,status:'Prospección programada para octubre de 2026.'},{name:'Addu Atoll',lat:-.63,lon:73.16,status:'Prospección programada para noviembre de 2026.'}];
let rotation=55,tilt=12,selected=0,drag=null,auto=!matchMedia('(prefers-reduced-motion: reduce)').matches,w=0,h=0,last=0,visible=true;
const rotate=document.querySelector('#rotate');
function setAuto(value){auto=value;rotate.textContent=t(auto?'Ⅱ Pausar rotación':'▷ Activar rotación');rotate.setAttribute('aria-label',t(auto?'Pausar rotación del globo':'Activar rotación del globo'));rotate.setAttribute('aria-pressed',String(auto));}setAuto(auto);
function resize(){const b=canvas.getBoundingClientRect();w=b.width;h=b.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}new ResizeObserver(resize).observe(canvas);
const rad=Math.PI/180;
function project(lon,lat){const l=(lon-rotation)*rad,p=lat*rad,t=tilt*rad,r=Math.min(w*.43,h*.43);const x=Math.cos(p)*Math.sin(l),y=Math.sin(p)*Math.cos(t)-Math.cos(p)*Math.cos(l)*Math.sin(t),z=Math.sin(p)*Math.sin(t)+Math.cos(p)*Math.cos(l)*Math.cos(t);return [w/2+r*x,h/2-r*y,z];}
function line(points,color,width=1){ctx.beginPath();let pen=false;for(const c of points){const p=project(c[0],c[1]);if(p[2]>0){if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}else pen=false;}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function draw(ts){const dt=Math.min(ts-last,50);last=ts;if(visible&&w){if(auto&&!drag)rotation+=dt*.002;ctx.clearRect(0,0,w,h);const r=Math.min(w*.43,h*.43),cx=w/2,cy=h/2;const aura=ctx.createRadialGradient(cx,cy,r*.75,cx,cy,r*1.16);aura.addColorStop(0,'#1c678518');aura.addColorStop(.8,'#23729520');aura.addColorStop(1,'#08141e00');ctx.fillStyle=aura;ctx.fillRect(0,0,w,h);const ocean=ctx.createRadialGradient(cx-r*.4,cy-r*.4,0,cx,cy,r);ocean.addColorStop(0,'#113349');ocean.addColorStop(.8,'#091f30');ocean.addColorStop(1,'#05111d');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=ocean;ctx.fill();ctx.strokeStyle='#34758b';ctx.lineWidth=1;ctx.stroke();for(let lat=-60;lat<=60;lat+=30){const points=[];for(let lon=-180;lon<=180;lon+=3)points.push([lon,lat]);line(points,'#459bb526');}for(let lon=-180;lon<180;lon+=30){const points=[];for(let lat=-90;lat<=90;lat+=3)points.push([lon,lat]);line(points,'#459bb526');}for(const ring of window.WORLD_RINGS||[])line(ring,'#67b3c6a0',.75);places.forEach((place,i)=>{const p=project(place.lon,place.lat);if(p[2]<0)return;const col=i<2?'#62dbef':'#e2b976';ctx.beginPath();ctx.arc(p[0],p[1],i===selected?12:7,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=i===selected?1.5:1;ctx.stroke();ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();if(i===selected){ctx.font='12px "DM Sans", sans-serif';ctx.textAlign=p[0]>w*.7?'right':'left';const tx=p[0]+(p[0]>w*.7?-18:18);ctx.fillStyle='#06121de6';const tw=ctx.measureText(place.name).width;ctx.fillRect(ctx.textAlign==='right'?tx-tw-5:tx-5,p[1]-29,tw+10,22);ctx.fillStyle='#e8f6fa';ctx.fillText(place.name,tx,p[1]-14);}});}requestAnimationFrame(draw);}requestAnimationFrame(draw);
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(canvas);
function updatePlaceDetail(){document.querySelector('#place-detail').textContent=places[selected].name.toUpperCase()+' / '+t(places[selected].status);}
function selectPlace(i){selected=i;rotation=places[i].lon;tilt=places[i].lat;setAuto(false);document.querySelectorAll('.destination').forEach((b,j)=>{b.classList.toggle('selected',i===j);b.setAttribute('aria-pressed',String(i===j));});updatePlaceDetail();}
document.querySelectorAll('.destination').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===selected));button.addEventListener('click',()=>selectPlace(i));});
rotate.addEventListener('click',()=>setAuto(!auto));
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId);setAuto(false);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;rotation-=(e.clientX-drag.x)*.35;tilt=Math.max(-65,Math.min(65,tilt+(e.clientY-drag.y)*.3));drag.x=e.clientX;drag.y=e.clientY;});
canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5){const b=canvas.getBoundingClientRect();let closest=-1,distance=22;places.forEach((p,i)=>{const point=project(p.lon,p.lat),d=Math.hypot(point[0]-(e.clientX-b.left),point[1]-(e.clientY-b.top));if(point[2]>0&&d<distance){closest=i;distance=d;}});if(closest>=0)selectPlace(closest);}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();setAuto(false);if(e.key==='ArrowLeft')rotation-=10;if(e.key==='ArrowRight')rotation+=10;if(e.key==='ArrowUp')tilt=Math.min(65,tilt+10);if(e.key==='ArrowDown')tilt=Math.max(-65,tilt-10);});
document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false;});}));

// Highlight the section currently being explored in the persistent navigation.
const sectionLinks=[...document.querySelectorAll('.sidebar nav a')];
const sectionTargets=sectionLinks.map(link=>document.querySelector(link.getAttribute('href')));
const mobileHeader=document.querySelector('header.sidebar');
function syncMobileHeader(){
 if(matchMedia('(max-width:760px)').matches){
  document.documentElement.style.setProperty('--mobile-header-height',Math.ceil(mobileHeader.getBoundingClientRect().height)+'px');
 }else document.documentElement.style.removeProperty('--mobile-header-height');
}
new ResizeObserver(syncMobileHeader).observe(mobileHeader);
addEventListener('resize',syncMobileHeader);
syncMobileHeader();
let navigationQueued=false;
function updateNavigation(){
  const threshold=matchMedia('(max-width:760px)').matches?mobileHeader.getBoundingClientRect().bottom+96:110;
  let active=null;
  sectionTargets.forEach(section=>{if(section.getBoundingClientRect().top<=threshold+2)active=section.id;});
  sectionLinks.forEach(link=>{if(link.hash==='#'+active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  navigationQueued=false;
}
addEventListener('scroll',()=>{if(!navigationQueued){navigationQueued=true;requestAnimationFrame(updateNavigation);}},{passive:true});
addEventListener('resize',updateNavigation);
updateNavigation();

const equipmentPhotos={
 camera:{image:'camera-underwater.jpg',alt:'Buceador utilizando un sistema de cámara 360° con carcasa subacuática',title:'Cámaras 360°',category:'CAPTURA INMERSIVA',caption:'Captura inmersiva durante una inmersión. Imagen de referencia: Mantis Sub.'},
 sonar:{image:'sonar.jpg',alt:'Pantalla de sonar en funcionamiento en una embarcación',title:'Sonar de exploración',category:'EXPLORACIÓN ACÚSTICA',caption:'Observación acústica del fondo y de posibles objetivos.'},
 scooter:{image:'scooter-sidemount.jpg',alt:'Buceador con botellas laterales en sidemount y scooter subacuático',title:'Scooters subacuáticos',category:'MOVILIDAD SUBACUÁTICA',caption:'Propulsión subacuática con configuración sidemount. Imagen de referencia.'},
 mask:{image:'mask-underwater.jpg',alt:'Submarinista utilizando una máscara integral durante una inmersión',title:'Comunicación subacuática',category:'COORDINACIÓN EN INMERSIÓN',caption:'Máscara integral en uso durante una exploración subacuática. Imagen de referencia.'},
 map:{image:'map-relief.jpg',alt:'Relieve sombreado con sondas, referencias y detalles del fondo',title:'Mapas batimétricos',category:'CARTOGRAFÍA BATIMÉTRICA',caption:'Relieve sombreado con información cartográfica. Imagen ilustrativa, no una carta para navegar.'}
};
const gallery=document.querySelector('.tech-gallery'),equipmentImage=document.querySelector('#equipment-image');
function showEquipment(key){
 const item=equipmentPhotos[key];if(!item)return;
 gallery.dataset.equipment=key;equipmentImage.src='/assets/technology/'+item.image;equipmentImage.alt=t(item.alt);
 document.querySelector('#equipment-title').textContent=t(item.title);
 document.querySelector('#map-views').hidden=key!=='map';
 document.querySelectorAll('[data-map]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.map==='relief')));
}
document.querySelectorAll('[data-equipment]').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)showEquipment(detail.dataset.equipment);}));
const mapCaptions={relief:'Relieve sombreado con información cartográfica.',satellite:'Imagen de satélite con información de la carta náutica.',perspective:'Vista cartográfica en sonar.'};
document.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>{
 equipmentImage.src='/assets/technology/map-'+button.dataset.map+'.jpg';equipmentImage.alt=t('Ejemplo de cartografía: ')+t(mapCaptions[button.dataset.map]);
 document.querySelectorAll('[data-map]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
}));
showEquipment('map');

// Local draft only: no network request, storage, or direct email delivery.
const contactForm=document.querySelector('#contact-form');
function localizeValidation(field){
 field.setCustomValidity('');
 const v=field.validity;
 if(!v.valid)field.setCustomValidity(t(v.valueMissing?'Completa este campo.':v.typeMismatch?'Introduce una dirección de correo válida.':v.tooShort?'Escribe al menos 10 caracteres.':'Revisa el valor de este campo.'));
}
contactForm.querySelectorAll('input,select,textarea:not([readonly])').forEach(field=>{
 field.addEventListener('invalid',()=>localizeValidation(field));
 field.addEventListener('input',()=>field.setCustomValidity(''));
});
const brandLogo=document.querySelector('.brand-sonar');
brandLogo.addEventListener('click',event=>{
 if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 for(const animation of brandLogo.getAnimations({subtree:true})){
  animation.currentTime=0;
  animation.play();
 }
});

// Brevo owns submissions and confirmation; load its public form only on demand.
const newsletterDialog=document.querySelector('#newsletter-dialog');
const newsletterOpen=document.querySelector('#newsletter-open');
const newsletterFrame=document.querySelector('#newsletter-frame');
const newsletterStatus=document.querySelector('#newsletter-status');
let newsletterLoadTimer;
function closeNewsletter(){newsletterDialog.close();}
newsletterOpen.addEventListener('click',()=>{
 if(!newsletterDialog.open){newsletterDialog.showModal();document.body.classList.add('newsletter-open');}
});
document.querySelector('#newsletter-load').addEventListener('click',()=>{
 // A separate, non-persistent choice loads third-party services, not a subscription.
 if(newsletterDialog.dataset.newsletterReady!=='true')return;
 document.querySelector('#newsletter-permission').hidden=true;
 const content=document.querySelector('#newsletter-content');
 content.hidden=false;content.inert=false;
 if(!newsletterFrame.hasAttribute('src')){
  newsletterStatus.hidden=false;
  newsletterStatus.textContent=t('Cargando formulario…');
  newsletterLoadTimer=setTimeout(()=>{
   newsletterStatus.textContent=t('Si el formulario no aparece, puedes abrirlo en otra pestaña.');
  },12000);
  newsletterFrame.src=newsletterFrame.dataset.src;
 }
 document.querySelector('.newsletter-fallback a').focus({preventScroll:true});
});
newsletterFrame.addEventListener('load',()=>{
 if(!newsletterFrame.hasAttribute('src'))return;
 clearTimeout(newsletterLoadTimer);
 newsletterStatus.hidden=true;
});
document.querySelector('#newsletter-close').addEventListener('click',closeNewsletter);
document.querySelector('#newsletter-decline').addEventListener('click',closeNewsletter);
document.querySelector('#newsletter-unload').addEventListener('click',closeNewsletter);
newsletterDialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const focusable=[...newsletterDialog.querySelectorAll('button:not(:disabled),iframe,a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);
 const first=focusable[0],last=focusable[focusable.length-1];
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
newsletterDialog.addEventListener('click',event=>{
 if(event.target!==newsletterDialog)return;
 const bounds=newsletterDialog.getBoundingClientRect();
 if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)closeNewsletter();
});
newsletterDialog.addEventListener('close',()=>{
 clearTimeout(newsletterLoadTimer);
 newsletterFrame.removeAttribute('src');
 const content=document.querySelector('#newsletter-content');
 content.hidden=true;content.inert=true;
 document.querySelector('#newsletter-permission').hidden=false;
 newsletterStatus.hidden=true;
 document.body.classList.remove('newsletter-open');
 newsletterOpen.focus({preventScroll:true});
});
function prepareDraft(focus=true){
 const fields=new FormData(contactForm);
 const value=key=>String(fields.get(key)||'').trim();
 const subject='Blue Quest — '+t(value('project')).replace(/[\r\n]/g,' ');
 const body=[t('Nombre: ')+value('name'),'Email: '+value('email'),t('Organización: ')+(value('organization')||t('No indicada')),t('Proyecto: ')+t(value('project')),t('Destino: ')+(value('destination')||t('Por definir')),'',t('Consulta:'),value('message')].join('\r\n');
 document.querySelector('#email-draft').value=t('Para: ')+'info@bqexplore.com\r\n'+t('Asunto: ')+subject+'\r\n\r\n'+body;
 document.querySelector('#open-email').href='mailto:info@bqexplore.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 document.querySelector('#email-preview').hidden=false;
 document.querySelector('#contact-status').textContent=t('Borrador preparado. No se ha enviado.');
 if(focus)document.querySelector('#email-draft').focus();
}
contactForm.addEventListener('submit',event=>{
 event.preventDefault();
 if(!contactForm.reportValidity())return;
 prepareDraft();
});
contactForm.addEventListener('input',()=>{
 document.querySelector('#email-preview').hidden=true;
 document.querySelector('#contact-status').textContent='';
});
document.querySelector('#copy-email').addEventListener('click',async()=>{
 const draft=document.querySelector('#email-draft');
 try{
  await navigator.clipboard.writeText(draft.value);
  document.querySelector('#contact-status').textContent=t('Consulta copiada. No se ha enviado ningún mensaje.');
 }catch{
  draft.focus();draft.select();
  document.querySelector('#contact-status').textContent=t('Selecciona y copia el borrador con la opción Copiar de tu dispositivo.');
 }
});

document.addEventListener('bq:languagechange',()=>{
 syncMobileHeader();updateNavigation();
 contactForm.querySelectorAll('input,select,textarea:not([readonly])').forEach(field=>{if(field.validity.customError)localizeValidation(field);});
 setAuto(auto);updatePlaceDetail();
 const key=gallery.dataset.equipment;
 document.querySelector('#equipment-title').textContent=t(equipmentPhotos[key].title);
 const view=document.querySelector('[data-map][aria-pressed="true"]')?.dataset.map;
 equipmentImage.alt=key==='map'&&view?t('Ejemplo de cartografía: ')+t(mapCaptions[view]):t(equipmentPhotos[key].alt);
 if(!document.querySelector('#email-preview').hidden)prepareDraft(false);
});

