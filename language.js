// Language lives in the URL, not cookies/storage. Works with static fallback links.
(()=>{
 const messages=window.BQ_MESSAGES;
 const reverse=new Map(Object.entries(messages).filter(([es,en])=>es!==en).map(([es,en])=>[en.trim(),es.trim()]));
 const page=location.pathname.split('/').pop()||'index.html';
 const route=lang=>`${lang==='es'?'/es':''}/${page==='index.html'?'':page}`;
 let language=document.documentElement.lang==='es'?'es':'en';
 function t(text){return language==='en'?(messages[text]??text):text;}
 function translate(text){
  const key=text.trim(),es=reverse.get(key)||key;
  const translated=language==='en'?(messages[es]??es):es;
  return text.replace(key,translated);
 }
 function render(lang){
  language=lang;document.documentElement.lang=lang;
  const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(!node.parentElement.closest('script,style,noscript,textarea,[data-language],svg')&&node.textContent.trim())node.textContent=translate(node.textContent);
  }
  document.querySelectorAll('*').forEach(el=>{
   if(el.hasAttribute('data-language'))return;
   for(const name of ['alt','aria-label','title','placeholder'])if(el.hasAttribute(name))el.setAttribute(name,translate(el.getAttribute(name)));
  });
  const description=document.querySelector('meta[name="description"]');
  if(description)description.content=translate(description.content);
  document.querySelectorAll('a[href]').forEach(link=>{
   if(link.dataset.language)return;
   const raw=link.getAttribute('href');if(raw.startsWith('#'))return;
   const url=new URL(link.href,location.href);
   if(url.origin!==location.origin)return;
   const clean=url.pathname.replace(/^\/es(?=\/)/,'');
   if(!['/','/index.html','/privacidad.html','/aviso-legal.html'].includes(clean))return;
   url.pathname=(lang==='es'?'/es':'')+clean;link.href=url.pathname+url.search+url.hash;
  });
  document.querySelectorAll('[data-language]').forEach(link=>{
   const target=link.dataset.language;
   link.href=route(target)+location.search+location.hash;
   if(target===lang)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
  });
  document.querySelector('link[rel="canonical"]').href='https://www.bqexplore.com'+route(lang);
  document.dispatchEvent(new CustomEvent('bq:languagechange',{detail:{language:lang}}));
 }
 window.BQ={t,get language(){return language}};
 // Preserve the initial deep link even when opened in a new tab with Ctrl/Cmd.
 document.querySelectorAll('[data-language]').forEach(link=>{link.href=route(link.dataset.language)+location.search+location.hash;});
 document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();const lang=link.dataset.language;
  if(language===lang)return;
  history.pushState(null,'',route(lang)+location.search+location.hash);
  render(lang);
 }));
 addEventListener('popstate',()=>render(location.pathname.startsWith('/es/')?'es':'en'));
 addEventListener('hashchange',()=>document.querySelectorAll('[data-language]').forEach(link=>{link.href=route(link.dataset.language)+location.search+location.hash;}));
})();
