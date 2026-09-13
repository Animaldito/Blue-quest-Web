// Vercel selects the initial language by country. Explicit choice lives in the
// URL (/es/ or ?lang=en), never cookies/storage, and overrides that default.
(()=>{
 const messages=window.BQ_MESSAGES;
 const reverse=new Map(Object.entries(messages).filter(([es,en])=>es!==en).map(([es,en])=>[en.trim(),es.trim()]));
 const page=location.pathname.split('/').pop()||'index.html';
 const route=lang=>`/${lang}/${page==='index.html'?'':page}`;
 const withChoice=(url,lang)=>{
  url.searchParams.delete('lang');
  return url.pathname+url.search+url.hash;
 };
 const languageLink=lang=>{
  const url=new URL(location.href);url.pathname=route(lang);
  return withChoice(url,lang);
 };
 function updateLinks(lang){
  document.querySelectorAll('a[href]').forEach(link=>{
   if(link.dataset.language)return;
   const raw=link.getAttribute('href');if(raw.startsWith('#'))return;
   const url=new URL(link.href,location.href);
   if(url.origin!==location.origin)return;
   const clean=url.pathname.replace(/^\/(es|en)(?=\/)/,'');
   if(!['/','/index.html','/privacidad.html','/aviso-legal.html'].includes(clean))return;
   url.pathname='/'+lang+clean;link.href=withChoice(url,lang);
  });
  document.querySelectorAll('[data-language]').forEach(link=>{
   const target=link.dataset.language;
   link.href=languageLink(target);
   if(target===lang)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');
  });
 }
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
  updateLinks(lang);
  document.querySelector('link[rel="canonical"]').href='https://www.bqexplore.com'+route(lang);
  document.dispatchEvent(new CustomEvent('bq:languagechange',{detail:{language:lang}}));
 }
 window.BQ={t,get language(){return language}};
 // Preserve the initial deep link even when opened in a new tab with Ctrl/Cmd.
 updateLinks(language);
 document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();const lang=link.dataset.language;
  if(language===lang){history.replaceState(null,'',languageLink(lang));updateLinks(lang);return;}
  history.pushState(null,'',languageLink(lang));
  render(lang);
 }));
 addEventListener('popstate',()=>render(location.pathname.startsWith('/es/')?'es':'en'));
 addEventListener('hashchange',()=>updateLinks(language));
})();
