import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeUpdates} from '../dist/updates.js';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({controller={},save=()=>true}={}){
 const win=new EventTarget(),doc=new EventTarget(),sw=new EventTarget();doc.visibilityState='visible';doc.activeElement=null;sw.controller=controller;let reloads=0,checks=0,tick,stopped=0;const messages=[];
 win.location={reload:()=>reloads++};const nav={onLine:true,serviceWorker:sw};const registration={update:async()=>{checks++;},waiting:null};
 const updates=initializeUpdates({win,doc,nav,registration,beforeReload:save,notify:s=>messages.push(s),every:(fn,ms)=>{assert.equal(ms,60000);tick=fn;return 1;},later:fn=>fn(),cancel:()=>stopped++});
 return {win,doc,sw,nav,registration,messages,updates,get reloads(){return reloads;},get checks(){return checks;},get stopped(){return stopped;},tick:()=>tick()};
}
test('online app checks on startup, reconnect, foreground, focus and timer but skips offline and hidden',async()=>{
 const f=fixture();await settle();assert.equal(f.checks,1);
 for(const[target,type]of[[f.win,'online'],[f.win,'focus'],[f.doc,'visibilitychange']]){target.dispatchEvent(new Event(type));await settle();}f.tick();await settle();assert.equal(f.checks,5);
 f.nav.onLine=false;f.tick();await settle();assert.equal(f.checks,5);f.nav.onLine=true;f.doc.visibilityState='hidden';f.tick();await settle();assert.equal(f.checks,5);f.updates.stop();assert.equal(f.stopped,1);
});
test('first install does not reload, upgrade reloads once after successful save',async()=>{
 let saves=0;const f=fixture({controller:null,save:()=>{saves++;return true;}});await settle();f.sw.controller={version:1};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(f.reloads,0);
 f.sw.controller={version:2};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(saves,1);assert.equal(f.reloads,1);f.sw.dispatchEvent(new Event('controllerchange'));f.updates.apply();assert.equal(f.reloads,1);f.updates.stop();
});
test('upgrade waits for active draft editing and resumes automatically on blur',async()=>{
 let saved=false;const f=fixture({save:()=>{saved=true;return true;}});await settle();f.doc.activeElement={matches:()=>true};f.sw.controller={next:true};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(f.reloads,0);assert.equal(saved,false);assert.match(f.messages.at(-1),/finish editing/);
 f.doc.activeElement=null;f.doc.dispatchEvent(new Event('focusout'));assert.equal(saved,true);assert.equal(f.reloads,1);f.updates.stop();
});
test('failed persistence blocks update reload; later successful save permits it',async()=>{
 let canSave=false;const f=fixture({save:()=>canSave});await settle();f.sw.controller={next:true};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(f.reloads,0);assert.match(f.messages.at(-1),/Export a backup/);canSave=true;f.updates.apply();assert.equal(f.reloads,1);f.updates.stop();
});
test('hidden updates wait for foreground, waiting workers are activated without a user action',async()=>{
 const f=fixture();await settle();let activation;f.registration.waiting={postMessage:m=>activation=m};await f.updates.check();assert.deepEqual(activation,{type:'ACTIVATE_UPDATE'});f.doc.visibilityState='hidden';f.sw.controller={next:true};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(f.reloads,0);f.doc.visibilityState='visible';f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(f.reloads,1);f.updates.stop();
});
