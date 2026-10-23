import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeUpdates} from '../dist/updates.js';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({controller={},save=()=>true,online=true,waiting=null}={}){
 const win=new EventTarget(),doc=new EventTarget(),sw=new EventTarget();doc.visibilityState='visible';doc.activeElement=null;sw.controller=controller;let reloads=0,checks=0;const messages=[];
 win.location={reload:()=>reloads++};win.setInterval=()=>{throw new Error('Update polling must not be scheduled');};const nav={onLine:online,serviceWorker:sw};const registration={update:async()=>{checks++;},waiting};
 const updates=initializeUpdates({win,doc,nav,registration,beforeReload:save,notify:s=>messages.push(s),later:fn=>fn()});
 return {win,doc,sw,nav,registration,messages,updates,get reloads(){return reloads;},get checks(){return checks;}};
}
test('checks once at startup with no polling or checks on reconnect, focus or foreground',async()=>{
 const f=fixture();await settle();assert.equal(f.checks,1);
 for(const[target,type]of[[f.win,'online'],[f.win,'focus'],[f.doc,'visibilitychange']]){target.dispatchEvent(new Event(type));await settle();}
 await f.updates.check();assert.equal(f.checks,1);f.updates.stop();
});
test('offline startup skips checks, including after reconnection, until a new launch',async()=>{
 const f=fixture({online:false});await settle();assert.equal(f.checks,0);f.nav.onLine=true;f.win.dispatchEvent(new Event('online'));f.win.dispatchEvent(new Event('focus'));f.doc.dispatchEvent(new Event('visibilitychange'));await f.updates.check();assert.equal(f.checks,0);f.updates.stop();
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
 let activation;const f=fixture({waiting:{postMessage:m=>activation=m}});await settle();assert.deepEqual(activation,{type:'ACTIVATE_UPDATE'});f.doc.visibilityState='hidden';f.sw.controller={next:true};f.sw.dispatchEvent(new Event('controllerchange'));assert.equal(f.reloads,0);f.doc.visibilityState='visible';f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(f.reloads,1);f.updates.stop();
});
