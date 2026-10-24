import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {KEY,fresh,gradeCard} from '../dist/engine.js';
let serial=0;
async function boot(initial){
 const {window}=parseHTML(await fs.readFile(new URL('../dist/index.html',import.meta.url),'utf8'));const map=new Map(initial?[[KEY,JSON.stringify(initial)]]:[]);
 let currentHash='#today'; const location={get hash(){return currentHash;},set hash(v){currentHash=v.startsWith('#')?v:'#'+v;}};
 Object.defineProperty(window.HTMLSelectElement.prototype,'value',{configurable:true,get(){return this.querySelector('option[selected]')?.getAttribute('value')||this.querySelector('option')?.getAttribute('value')||'';},set(v){for(const o of this.querySelectorAll('option')){if(o.getAttribute('value')===String(v))o.setAttribute('selected','');else o.removeAttribute('selected');}}});
 Object.assign(globalThis,{window,document:window.document,location,localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)},requestAnimationFrame:fn=>fn()});
 window.scrollTo=()=>{};window.HTMLElement.prototype.focus=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};window.HTMLElement.prototype.showModal=function(){this.open=true;};window.HTMLElement.prototype.close=function(){this.open=false;};
 await import('../dist/app.js?test='+serial++);
 const go=hash=>{location.hash=hash;window.dispatchEvent(new window.Event('hashchange'));};const click=selector=>{const el=document.querySelector(selector);assert.ok(el,selector);el.click();};
 return {window,map,go,click,text:()=>document.querySelector('main').textContent};
}
test('complete lesson, hidden answers, draft persistence, rating, next lesson and reload',async()=>{
 const b=await boot();assert.match(b.text(),/Make sense/);b.go('#lesson/layers');assert.match(b.text(),/Ask this web server for one tiny file/);
 for(let i=0;i<5;i++)b.click('[data-action="read-next"]');b.click('[data-action="quiz"]');b.go(location.hash);
 assert.equal(document.querySelector('.answer'),null);assert.equal(document.querySelector('[data-grade]'),null);
 const draft=document.querySelector('#draft');draft.value='The IP destination is the server, the frame goes to the gateway.';draft.dispatchEvent(new b.window.Event('input'));
 for(let i=0;i<3;i++){b.click('[data-action="reveal"]');assert.ok(document.querySelector('.checklist'));assert.equal(document.querySelectorAll('[data-grade]').length,4);b.click('[data-grade="good"]');}
 assert.match(b.text(),/One more piece connected/);const saved=JSON.parse(b.map.get(KEY));assert.ok(saved.completed.layers);assert.equal(saved.activity.length,3);assert.ok(saved.drafts['layers-1']);
 b.go('#today');assert.match(b.text(),/Frames, switches/);assert.match(b.text(),/Your review queue is clear/);
 const reload=await boot(saved);assert.match(reload.text(),/Frames, switches/);reload.go('#progress');assert.match(reload.text(),/What’s coming back/);assert.equal(document.querySelectorAll('.reviewlist li').length,3);
});
test('due review alternates prompt, resumes reveal state, updates schedule',async()=>{
 const s=fresh();s.completed.layers=Date.now()-10000000;s.cards['layers-1']=gradeCard(null,'again',Date.now()-1000000);const b=await boot(s);b.click('[data-action="review"]');b.go(location.hash);assert.match(b.text(),/final destination versus the next hop/);b.click('[data-action="reveal"]');b.go('#today');assert.match(b.text(),/session in progress/);b.go('#study/review');assert.ok(document.querySelector('.answer'));b.click('[data-grade="easy"]');assert.match(b.text(),/You brought it back/);const saved=JSON.parse(b.map.get(KEY));assert.equal(saved.cards['layers-1'].seen,2);assert.equal(saved.cards['layers-1'].interval,4);
});
test('reference search, network inspection and settings backup preview',async()=>{
 const b=await boot();b.go('#reference');const input=document.querySelector('#search');input.value='SLAAC';input.dispatchEvent(new b.window.Event('input'));assert.match(document.querySelector('#results').textContent,/Stateless Address Autoconfiguration/);b.click('[data-tab="network"]');assert.match(b.text(),/192.168.1.10/);const select=document.querySelector('#hop');select.value='1';select.dispatchEvent(new b.window.Event('change'));assert.match(document.querySelector('#hop-detail').textContent,/203.0.113.5/);b.go('#settings');b.click('#reset');assert.equal(document.querySelector('dialog').open,true);b.click('#cancel');assert.equal(document.querySelector('dialog').open,false);
});
test('answer and notes escape HTML and saved sessions preserve ungraded drafts',async()=>{
 const s=fresh();s.notes.layers='<img src=x onerror=alert(1)>';const b=await boot(s);b.go('#lesson/layers');assert.equal(document.querySelectorAll('img').length,0);assert.match(document.querySelector('#lesson-notes').value,/img src=x/);b.click('[data-action="read-next"]');b.go('#today');b.go('#lesson/layers');assert.match(b.text(),/Why “GET this file” is not enough to deliver it/);
});
test('backup restore previews validated data and replaces state only on confirmation',async()=>{
 const b=await boot();b.go('#settings');const imported=fresh();imported.completed.layers=Date.now();const input=document.querySelector('#import-file');Object.defineProperty(input,'files',{value:[{size:100,text:async()=>JSON.stringify(imported)}],configurable:true});await input.onchange({target:input});assert.equal(document.querySelector('dialog').open,true);assert.match(document.querySelector('#confirm-body').textContent,/1 completed lessons/);assert.equal(b.map.get(KEY),undefined);b.click('#confirm');assert.ok(JSON.parse(b.map.get(KEY)).completed.layers);
});
test('storage quota errors remain visible and do not claim durable saving',async()=>{
 const b=await boot();globalThis.localStorage.setItem=()=>{throw new Error('Quota');};b.go('#lesson/layers');b.click('[data-action="read-next"]');assert.match(b.text(),/could not save progress/);assert.ok(document.querySelector('[role="alert"]'));
});

test('opening lesson shows concrete fields and a real-request control before advancing',async()=>{
 const b=await boot();b.go('#lesson/layers');const card=document.querySelector('.readingcard');assert.match(card.textContent,/GET \/lesson-demo.txt HTTP\/1.1/);assert.match(card.textContent,/Which resource on this website/);assert.ok(card.querySelector('[data-demo-request]'));assert.equal(card.querySelector('details'),null);assert.ok(card.querySelectorAll('.reading-section>p').length>=4);
});
test('full explanation can be read without resetting an active question session',async()=>{
 const b=await boot();b.go('#lesson/layers');for(let i=0;i<5;i++)b.click('[data-action="read-next"]');b.click('[data-action="quiz"]');b.go(location.hash);b.click('[data-action="reveal"]');const before=b.map.get(KEY);b.go('#reading/layers');assert.match(document.querySelector('h1').textContent,/Make your browser/);assert.ok(document.querySelector('[data-demo-request]'));assert.equal(b.map.get(KEY),before);b.go('#lesson/layers');assert.ok(document.querySelector('.answer'));assert.equal(b.map.get(KEY),before);
});
