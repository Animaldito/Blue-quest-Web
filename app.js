const t=window.BQ.t;
const canvas=document.querySelector('#globe'),ctx=canvas.getContext('2d');
const places=[{name:'Raa Atoll',lat:5.67,lon:72.93},{name:'Boa Vista',lat:16.1,lon:-22.8},{name:'Leyte',lat:10.9,lon:124.8},{name:'Addu Atoll',lat:-.63,lon:73.16}];
let rotation=55,tilt=12,selected=0,drag=null,auto=!matchMedia('(prefers-reduced-motion: reduce)').matches,w=0,h=0,last=0,visible=true,frame=0;
function requestDraw(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(draw);}
const rotate=document.querySelector('#rotate');
function setAuto(value){auto=value;rotate.textContent=t(auto?'Ⅱ Pausar rotación':'▷ Activar rotación');rotate.setAttribute('aria-label',t(auto?'Pausar rotación del globo':'Activar rotación del globo'));rotate.setAttribute('aria-pressed',String(auto));requestDraw();}setAuto(auto);
function resize(){const b=canvas.getBoundingClientRect();w=b.width;h=b.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);requestDraw();}new ResizeObserver(resize).observe(canvas);
const rad=Math.PI/180;
function project(lon,lat){const l=(lon-rotation)*rad,p=lat*rad,t=tilt*rad,r=Math.min(w*.43,h*.43);const x=Math.cos(p)*Math.sin(l),y=Math.sin(p)*Math.cos(t)-Math.cos(p)*Math.cos(l)*Math.sin(t),z=Math.sin(p)*Math.sin(t)+Math.cos(p)*Math.cos(l)*Math.cos(t);return [w/2+r*x,h/2-r*y,z];}
function line(points,color,width=1){ctx.beginPath();let pen=false;for(const c of points){const p=project(c[0],c[1]);if(p[2]>0){if(pen)ctx.lineTo(p[0],p[1]);else ctx.moveTo(p[0],p[1]);pen=true;}else pen=false;}ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function draw(ts){frame=0;const dt=Math.min(ts-last,50);last=ts;if(visible&&w){if(auto&&!drag)rotation+=dt*.002;ctx.clearRect(0,0,w,h);const r=Math.min(w*.43,h*.43),cx=w/2,cy=h/2;const aura=ctx.createRadialGradient(cx,cy,r*.75,cx,cy,r*1.16);aura.addColorStop(0,'#1c678518');aura.addColorStop(.8,'#23729520');aura.addColorStop(1,'#08141e00');ctx.fillStyle=aura;ctx.fillRect(0,0,w,h);const ocean=ctx.createRadialGradient(cx-r*.4,cy-r*.4,0,cx,cy,r);ocean.addColorStop(0,'#113349');ocean.addColorStop(.8,'#091f30');ocean.addColorStop(1,'#05111d');ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=ocean;ctx.fill();ctx.strokeStyle='#34758b';ctx.lineWidth=1;ctx.stroke();for(let lat=-60;lat<=60;lat+=30){const points=[];for(let lon=-180;lon<=180;lon+=3)points.push([lon,lat]);line(points,'#459bb526');}for(let lon=-180;lon<180;lon+=30){const points=[];for(let lat=-90;lat<=90;lat+=3)points.push([lon,lat]);line(points,'#459bb526');}for(const ring of window.WORLD_RINGS||[])line(ring,'#67b3c6a0',.75);places.forEach((place,i)=>{const p=project(place.lon,place.lat);if(p[2]<0)return;const col=i<2?'#62dbef':'#e2b976';ctx.beginPath();ctx.arc(p[0],p[1],i===selected?12:7,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=i===selected?1.5:1;ctx.stroke();ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();if(i===selected){ctx.font='12px "DM Sans", sans-serif';ctx.textAlign=p[0]>w*.7?'right':'left';const tx=p[0]+(p[0]>w*.7?-18:18);ctx.fillStyle='#06121de6';const tw=ctx.measureText(place.name).width;ctx.fillRect(ctx.textAlign==='right'?tx-tw-5:tx-5,p[1]-29,tw+10,22);ctx.fillStyle='#e8f6fa';ctx.fillText(place.name,tx,p[1]-14);}});}if(auto||drag)requestDraw();}requestDraw();
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestDraw();}).observe(canvas);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)requestDraw();});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)setAuto(false);});
function updateGlobeLabel(){canvas.setAttribute('aria-label',t('Globo interactivo. Arrastra o usa las flechas para girar. Pulsa un punto para abrir su ficha, o Intro para abrir el destino seleccionado.')+' '+places[selected].name);}
function selectPlace(i,trigger=canvas){selected=i;rotation=places[i].lon;tilt=places[i].lat;setAuto(false);document.querySelectorAll('.destination').forEach((b,j)=>{b.classList.toggle('selected',i===j);b.setAttribute('aria-pressed',String(i===j));});updateGlobeLabel();requestDraw();window.BQFieldLog.open(i,trigger);}
document.querySelectorAll('.destination').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===selected));button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','mission-dialog');button.addEventListener('click',()=>selectPlace(i,button));});
updateGlobeLabel();
rotate.addEventListener('click',()=>setAuto(!auto));
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};canvas.setPointerCapture(e.pointerId);setAuto(false);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;rotation-=(e.clientX-drag.x)*.35;tilt=Math.max(-65,Math.min(65,tilt+(e.clientY-drag.y)*.3));drag.x=e.clientX;drag.y=e.clientY;requestDraw();});
canvas.addEventListener('pointerup',e=>{if(drag&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5){const b=canvas.getBoundingClientRect();let closest=-1,distance=22;places.forEach((p,i)=>{const point=project(p.lon,p.lat),d=Math.hypot(point[0]-(e.clientX-b.left),point[1]-(e.clientY-b.top));if(point[2]>0&&d<distance){closest=i;distance=d;}});if(closest>=0)selectPlace(closest);}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPlace(selected,canvas);return;}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();setAuto(false);if(e.key==='ArrowLeft')rotation-=10;if(e.key==='ArrowRight')rotation+=10;if(e.key==='ArrowUp')tilt=Math.min(65,tilt+10);if(e.key==='ArrowDown')tilt=Math.max(-65,tilt-10);requestDraw();});

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
 map:{photo:'map-relief',alt:'Relieve sombreado con sondas, referencias y detalles del fondo',benefit:'Saber dónde buscar',description:'Estudiamos el relieve y la profundidad para localizar zonas de interés.'},
 sonar:{photo:'sonar',alt:'Ilustración de un sonar en una embarcación',benefit:'Detectar antes de ver',description:'Detectamos estructuras y objetivos, incluso con poca visibilidad.'},
 camera:{photo:'camera',alt:'Cámara 360° sobre un trípode en el fondo marino',benefit:'Cada ángulo cuenta',description:'Documentamos las inmersiones con imágenes y recorridos de 360°.'},
 scooter:{photo:'scooter',alt:'Ilustración de un submarinista en sidemount con propulsor',benefit:'Más alcance, menos esfuerzo',description:'Ampliamos el alcance de las exploraciones con propulsión subacuática.'}
};
const mapPhotos={
 relief:{photo:'map-relief',alt:'Relieve sombreado con sondas, referencias y detalles del fondo'},
 satellite:{photo:'map-satellite',alt:'Imagen de satélite con información de la carta náutica.'},
 perspective:{photo:'map-perspective',alt:'Vista cartográfica en sonar.'}
};
let selectedMapView='relief';
const gallery=document.querySelector('.tech-gallery'),equipmentImage=document.querySelector('#equipment-image'),equipmentAvif=document.querySelector('#equipment-avif'),mapViews=document.querySelector('#map-views');
function showPhoto(item){
 const photo=window.BQImages[item.photo];if(!photo)return;
 equipmentAvif.sizes=photo.sizes;equipmentAvif.srcset=photo.avif;
 equipmentImage.sizes=photo.sizes;equipmentImage.srcset=photo.srcset;
 equipmentImage.src=photo.src;equipmentImage.alt=t(item.alt);
 equipmentImage.width=photo.width;equipmentImage.height=photo.height;
}
function showMapView(key){
 const item=mapPhotos[key];if(!item)return;
 selectedMapView=key;showPhoto(item);
 document.querySelectorAll('[data-map]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.map===key)));
}
function showEquipment(key){
 const item=equipmentPhotos[key];if(!item)return;
 gallery.dataset.equipment=key;
 if(key!=='map')showPhoto(item);
 mapViews.hidden=key!=='map';
 if(key==='map')showMapView(selectedMapView);
 document.querySelector('#equipment-title').textContent=t(item.benefit);
 document.querySelector('#equipment-description').textContent=t(item.description);
 document.querySelectorAll('[data-equipment]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.equipment===key)));
}
document.querySelectorAll('[data-equipment]').forEach(button=>button.addEventListener('click',()=>showEquipment(button.dataset.equipment)));
document.querySelectorAll('[data-map]').forEach(button=>button.addEventListener('click',()=>showMapView(button.dataset.map)));
showEquipment('map');
const menuToggle=document.querySelector('.menu-toggle');
mobileHeader.classList.add('menu-ready');
function closeMenu(){mobileHeader.classList.remove('menu-open');menuToggle.setAttribute('aria-expanded','false');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));mobileHeader.classList.toggle('menu-open',open);});
sectionLinks.forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileHeader.classList.contains('menu-open')){closeMenu();menuToggle.focus();}});
document.addEventListener('click',e=>{if(!mobileHeader.contains(e.target))closeMenu();});
addEventListener('resize',()=>{if(!matchMedia('(max-width:760px)').matches)closeMenu();});

const brandLogo=document.querySelector('.brand-sonar');
brandLogo.addEventListener('click',event=>{
 if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 for(const animation of brandLogo.getAnimations({subtree:true})){
  animation.currentTime=0;
  animation.play();
 }
});

// Brevo owns submissions and confirmation in a separate, user-opened tab.
const newsletterDialog=document.querySelector('#newsletter-dialog');
const newsletterOpen=document.querySelector('#newsletter-open');
function closeNewsletter(){newsletterDialog.close();}
newsletterOpen.addEventListener('click',()=>{
 if(!newsletterDialog.open){newsletterDialog.showModal();document.body.classList.add('newsletter-open');}
});
document.querySelector('#newsletter-close').addEventListener('click',closeNewsletter);
document.querySelector('#newsletter-decline').addEventListener('click',closeNewsletter);
newsletterDialog.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const focusable=[...newsletterDialog.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);
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
 document.body.classList.remove('newsletter-open');
 newsletterOpen.focus({preventScroll:true});
});
document.addEventListener('bq:languagechange',()=>{
 syncMobileHeader();updateNavigation();setAuto(auto);updateGlobeLabel();showEquipment(gallery.dataset.equipment);requestDraw();
});

