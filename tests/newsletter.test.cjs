// Lightweight behavior checks: no browser, network, third-party code or subscribers.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const code=source.slice(source.indexOf('// Brevo owns submissions'),source.indexOf('function prepareDraft'));
const nodes=new Map();
class Element{
 constructor(id){this.id=id;this.listeners={};this.open=false;this.openCount=0;}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
 emit(name,event={}){for(const fn of this.listeners[name]||[])fn(event);}
 focus(){document.activeElement=this;}
 showModal(){this.open=true;this.openCount++;}
 close(){this.open=false;this.emit('close');}
 querySelectorAll(){return[get('close'),get('form-link'),get('decline')];}
 getClientRects(){return[{}];}
 getBoundingClientRect(){return{left:20,right:620,top:20,bottom:620};}
}
for(const id of ['dialog','open','form-link','close','decline'])nodes.set('#newsletter-'+id,new Element('newsletter-'+id));
const document={querySelector:id=>nodes.get(id),body:{classList:new Set()},activeElement:null};
document.body.classList.remove=document.body.classList.delete.bind(document.body.classList);
const get=id=>nodes.get('#newsletter-'+id);
assert(!/newsletterFrame|createElement|window\.open|fetch\(|setTimeout|localStorage|sessionStorage/.test(code),'Popup must not load or submit to a provider');
vm.runInNewContext(code,{document});
get('open').emit('click');
assert(get('dialog').open);assert(document.body.classList.has('newsletter-open'));
get('open').emit('click');assert.equal(get('dialog').openCount,1);
// The ordinary anchor remains browser-managed: no interception, auto-submission or popup API.
assert.equal(get('form-link').listeners.click,undefined);
get('form-link').emit('click');assert(get('dialog').open);
get('decline').emit('click');
assert(!get('dialog').open);assert.equal(document.activeElement,get('open'));
assert(!document.body.classList.has('newsletter-open'));
get('open').emit('click');get('close').emit('click');assert(!get('dialog').open);
get('open').emit('click');
let prevented=false;
get('close').focus();get('dialog').emit('keydown',{key:'Tab',shiftKey:true,preventDefault(){prevented=true;}});
assert(prevented);assert.equal(document.activeElement,get('decline'));
prevented=false;
get('dialog').emit('keydown',{key:'Tab',shiftKey:false,preventDefault(){prevented=true;}});
assert(prevented);assert.equal(document.activeElement,get('close'));
get('dialog').emit('click',{target:get('dialog'),clientX:100,clientY:100});assert(get('dialog').open);
get('dialog').emit('click',{target:get('dialog'),clientX:10,clientY:10});assert(!get('dialog').open);
get('open').emit('click');get('dialog').close();assert.equal(document.activeElement,get('open'));
console.log('PASS external newsletter link, no automatic provider loading, popup close/reopen, focus trap and backdrop.');
