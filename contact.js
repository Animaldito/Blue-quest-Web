// Direct delivery is enabled only after the server confirms it is configured.
// No visitor information is stored in browser storage or sent before submission.
(()=>{
 const t=window.BQ.t,form=document.querySelector('#contact-form'),button=document.querySelector('#contact-submit'),status=document.querySelector('#contact-status');
 let challenge=null,checking=null,sending=false,submitted=false,serviceChecked=false;
 const value=(fields,key)=>String(fields.get(key)||'').trim();
 function showStatus(text){status.textContent=t(text);}
 function refreshButton(){
  button.textContent=t(sending?'Enviando…':challenge?'Enviar consulta':'Preparar consulta');
  const notice=document.querySelector('#mailbox-notice');
  notice.hidden=!serviceChecked||Boolean(challenge);
  notice.textContent=notice.hidden?'':t('El envío directo no está disponible ahora. Puedes preparar un borrador o escribirnos por correo.');
 }
 function checkService(){
  if(checking)return checking;
  checking=(async()=>{
   try{const response=await fetch('/api/contact',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(8000)});const data=await response.json();challenge=response.ok&&data.ready?data.token:null;}
   catch{challenge=null;}
   serviceChecked=true;refreshButton();
  })().finally(()=>checking=null);return checking;
 }
 // Load readiness only near the contact section, not on the landing screen.
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){checkService();observer.disconnect();}},{rootMargin:'300px'});observer.observe(form);
 function localizeValidation(field){field.setCustomValidity('');const v=field.validity;if(!v.valid)field.setCustomValidity(t(v.valueMissing?'Completa este campo.':v.typeMismatch?'Introduce una dirección de correo válida.':v.tooShort?'Escribe al menos 10 caracteres.':'Revisa el valor de este campo.'));}
 form.querySelectorAll('input,select,textarea:not([readonly])').forEach(field=>{field.addEventListener('invalid',()=>localizeValidation(field));field.addEventListener('input',()=>field.setCustomValidity(''));});
 function prepareDraft(focus=true){
  const read=key=>String(form.elements.namedItem(key)?.value||'').trim();
  const subject='Blue Quest — '+t(read('project')).replace(/[\r\n]/g,' ');
  const body=[t('Nombre: ')+read('name'),'Email: '+read('email'),t('Organización: ')+read('organization'),t('Proyecto: ')+t(read('project')),t('Destino: ')+read('destination'),'',read('message')].join('\r\n');
  document.querySelector('#email-draft').value=t('Para: ')+'info@bqexplore.com\r\n'+t('Asunto: ')+subject+'\r\n\r\n'+body;
  document.querySelector('#open-email').href='mailto:info@bqexplore.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  document.querySelector('#email-preview').hidden=false;if(focus)document.querySelector('#email-draft').focus();
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending||!form.reportValidity())return;
  if(!challenge){await checkService();if(!challenge){prepareDraft();showStatus('Borrador preparado. No se ha enviado.');return;}}
  sending=true;submitted=false;button.disabled=true;refreshButton();showStatus('Enviando tu consulta…');
  const fields=new FormData(form),payload={token:challenge,language:document.documentElement.lang};
  for(const key of ['name','email','organization','project','destination','message','website'])payload[key]=value(fields,key);
  const inputs=[...form.querySelectorAll('input,select,textarea:not([readonly])')];
  inputs.forEach(field=>field.disabled=true);
  try{
   const response=await fetch('/api/contact',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(18000)});
   const data=await response.json();
   if(!response.ok||!data.accepted){
    if(response.status===429)showStatus('Hay demasiados intentos. Espera unos minutos o escríbenos por correo.');
    else if(data.code==='TOKEN'){await checkService();showStatus('La sesión del formulario ha caducado. Vuelve a pulsar Enviar consulta.');}
    else if(data.code==='INVALID')showStatus('Revisa el nombre, el email y el mensaje antes de enviarlo.');
    else showStatus('No hemos podido confirmar el envío. Tus datos siguen aquí; puedes copiarlos y escribirnos por correo.');
    prepareDraft(false);return;
   }
   submitted=true;form.reset();document.querySelector('#email-preview').hidden=true;
   showStatus('Consulta aceptada para envío a nuestro equipo. Gracias por contactar con Blue Quest.');
  }catch{prepareDraft(false);showStatus('No hemos podido confirmar el envío. Tus datos siguen aquí; puedes copiarlos y escribirnos por correo.');}
  finally{inputs.forEach(field=>field.disabled=false);sending=false;button.disabled=false;refreshButton();if(submitted)checkService();}
 });
 form.addEventListener('input',()=>{document.querySelector('#email-preview').hidden=true;if(!sending)showStatus('');});
 document.querySelector('#copy-email').addEventListener('click',async()=>{const draft=document.querySelector('#email-draft');try{await navigator.clipboard.writeText(draft.value);showStatus('Consulta copiada. No se ha enviado ningún mensaje.');}catch{draft.focus();draft.select();showStatus('Selecciona y copia el borrador con la opción Copiar de tu dispositivo.');}});
 document.querySelectorAll('[data-project]').forEach(link=>link.addEventListener('click',()=>{form.elements.project.value=link.dataset.project;form.elements.project.dispatchEvent(new Event('input',{bubbles:true}));}));
 document.addEventListener('bq:languagechange',()=>{refreshButton();form.querySelectorAll('input,select,textarea:not([readonly])').forEach(field=>{if(field.validity.customError)localizeValidation(field);});if(!document.querySelector('#email-preview').hidden)prepareDraft(false);});
})();
