// Lightweight behavior checks: no browser, network, third-party code or subscribers.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const code=source.slice(source.indexOf('// Brevo owns submissions'),source.indexOf('function prepareDraft'));
const nodes=new Map(),timers=new Map();let nextTimer=0;
class Element{
 constructor(id){this.id=id;this.listeners={};this.attrs={};this.dataset={};this.hidden=false;this.inert=false;this.open=false;}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
 emit(name,event={}){for(const fn of this.listeners[name]||[])fn(event);}
 hasAttribute(name){return Object.hasOwn(this.attrs,name);}
 removeAttribute(name){delete this.attrs[name];}
 set src(value){this.attrs.src=value;}
 focus(){document.activeElement=this;}
 showModal(){this.open=true;}
 close(){this.open=false;this.emit('close');}
 querySelectorAll(){return[];}
}
for(const id of ['dialog','open','frame','status','permission','content','load','close','decline','unload'])nodes.set('#newsletter-'+id,new Element('newsletter-'+id));
nodes.set('.newsletter-fallback a',new Element('fallback-link'));
const document={querySelector:id=>nodes.get(id),body:{classList:new Set()},activeElement:null};
document.body.classList.remove=document.body.classList.delete.bind(document.body.classList);
const get=id=>nodes.get('#newsletter-'+id);
get('dialog').dataset.newsletterReady='true';get('frame').dataset.src='https://example.invalid/form';
get('content').hidden=true;get('content').inert=true;get('status').hidden=true;
vm.runInNewContext(code,{document,t:s=>s,setTimeout:fn=>{timers.set(++nextTimer,fn);return nextTimer;},clearTimeout:id=>timers.delete(id)});
get('open').emit('click');
assert(get('dialog').open);assert(!get('frame').hasAttribute('src'));
assert(get('content').hidden);assert(!get('permission').hidden);
get('decline').emit('click');
assert(!get('dialog').open);assert.equal(document.activeElement,get('open'));assert.equal(timers.size,0);
get('open').emit('click');get('load').emit('click');
assert.equal(get('frame').attrs.src,get('frame').dataset.src);assert(get('permission').hidden);
assert(!get('content').hidden&&!get('content').inert);assert(!get('status').hidden);assert.equal(timers.size,1);
get('frame').emit('load');assert(get('status').hidden);assert.equal(timers.size,0);
get('unload').emit('click');
assert(!get('dialog').open);assert(!get('frame').hasAttribute('src'));
assert(get('content').hidden&&get('content').inert);assert(!get('permission').hidden);
get('open').emit('click');assert(!get('frame').hasAttribute('src'));
get('load').emit('click');assert.equal(timers.size,1);
get('close').emit('click');assert.equal(timers.size,0);assert(!get('frame').hasAttribute('src'));
get('dialog').dataset.newsletterReady='false';get('open').emit('click');get('load').emit('click');
assert(!get('frame').hasAttribute('src'));assert(!get('permission').hidden);
console.log('PASS newsletter permission, decline, loading, close, withdrawal, reopen and disabled safety switch.');
