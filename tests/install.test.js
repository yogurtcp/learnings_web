import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {installInstructions,initializeInstall} from '../dist/install.js';
const html=()=>readFile(new URL('../dist/index.html',import.meta.url),'utf8');
test('renamed manifest supplies standalone launch, PNG icons and matching install branding',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../dist/manifest.webmanifest',import.meta.url),'utf8'));assert.equal(manifest.name,'learnings_web');assert.equal(manifest.short_name,'learnings_web');assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'./#today');for(const n of [192,512]){const i=manifest.icons.find(i=>i.sizes===`${n}x${n}`);assert.ok(i);await access(new URL('../dist/'+i.src,import.meta.url));}
 const text=await html();assert.match(text,/<title>learnings_web<\/title>/);assert.match(text,/Install learnings_web/);assert.ok(!text.includes('Packet Path')&&!text.includes('Remember Networks'));
});
test('manual install guidance covers iOS, Android and desktop',()=>{
 assert.match(installInstructions({userAgent:'iPhone'}),/Safari.*Share.*Add to Home Screen/);assert.match(installInstructions({userAgent:'Android'}),/Install app/);assert.match(installInstructions({userAgent:'Mozilla'}),/Chrome or Edge/);assert.match(installInstructions({platform:'MacIntel',maxTouchPoints:5}),/Add to Home Screen/);
});
test('installation uses native prompt once, fallback help otherwise, and hides when installed',async()=>{
 const {window}=parseHTML(await html()),doc=window.document;window.HTMLElement.prototype.showModal=function(){this.open=true;};window.HTMLElement.prototype.close=function(){this.open=false;};const messages=[];initializeInstall({win:window,doc,nav:{userAgent:'Android'},notify:t=>messages.push(t)});
 doc.querySelector('#installApp').click();assert.equal(doc.querySelector('#installDialog').open,true);assert.match(doc.querySelector('#installInstructions').textContent,/Chrome/);doc.querySelector('#closeInstall').click();assert.equal(doc.querySelector('#installDialog').open,false);
 let prompts=0;const event=new window.Event('beforeinstallprompt',{cancelable:true});event.prompt=async()=>{prompts++;};event.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(event);assert.equal(event.defaultPrevented,true);doc.querySelector('#installApp').click();await new Promise(resolve=>setImmediate(resolve));assert.equal(prompts,1);assert.match(messages.at(-1),/Installation accepted/);window.dispatchEvent(new window.Event('appinstalled'));assert.equal(doc.querySelector('#installApp').hidden,true);
});
test('offline worker precaches all local assets and returns cached shell without network',async()=>{
 const handlers={},stored=new Map();let list=[];const scope='https://example.test/';const cache={addAll:async assets=>{list=assets;for(const a of assets)stored.set(new URL(typeof a==='string'?a:a.url,scope).href,new Response(new URL(typeof a==='string'?a:a.url,scope).pathname==='/index.html'?'offline shell':'asset'));},put:async(k,v)=>stored.set(k,v)};
 const context={URL,Response,Request,self:{location:{origin:'https://example.test'},registration:{scope},skipWaiting:async()=>{},clients:{claim:async()=>{}},addEventListener:(kind,fn)=>handlers[kind]=fn},caches:{open:async()=>cache,keys:async()=>['learnings-web-old','another-app'],delete:async k=>{assert.equal(k,'learnings-web-old');},match:async k=>stored.get(k)},fetch:async()=>{throw new Error('offline');}};
 vm.runInNewContext(await readFile(new URL('../dist/sw.js',import.meta.url),'utf8'),context);let pending;handlers.install({waitUntil:p=>pending=p});await pending;for(const a of list){assert.equal(a.cache,'reload');const name=new URL(a.url).pathname.slice(1)||'index.html';await access(new URL('../dist/'+name,import.meta.url));}handlers.activate({waitUntil:p=>pending=p});await pending;
 handlers.fetch({request:{method:'GET',url:scope,mode:'navigate'},respondWith:p=>pending=p,waitUntil:()=>{}});assert.equal(await(await pending).text(),'offline shell');
 let intercepted=false;for(const url of ['https://fonts.example/font.woff2','https://example.test/api/private'])handlers.fetch({request:{method:'GET',url},respondWith:()=>intercepted=true});assert.equal(intercepted,false);
});
