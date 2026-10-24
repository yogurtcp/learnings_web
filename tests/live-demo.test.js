import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {liveRequestMarkup,initializeLiveRequests} from '../dist/live-demo.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fixture(options={}){const {document}=parseHTML('<main>'+liveRequestMarkup()+'</main>');const root=document.querySelector('main');return {document,root,button:root.querySelector('button'),output:root.querySelector('[data-demo-output]'),demo:initializeLiveRequests({root,escape,base:()=> 'https://example.test/',...options})};}
test('live experiment displays an actual server response, request path and MIME type',async()=>{
 const text=await readFile(new URL('../dist/lesson-demo.txt',import.meta.url),'utf8');let requestPath;
 const server=createServer((req,res)=>{requestPath=req.url;res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});res.end(text);});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const base=`http://127.0.0.1:${server.address().port}/`;const f=fixture({base:()=>base});await f.demo.run(f.button);assert.match(requestPath,/^\/lesson-demo.txt\?request=/);assert.match(f.output.textContent,/200 OK/);assert.match(f.output.textContent,/text\/plain/);assert.match(f.output.textContent,/Hello from learnings_web/);assert.match(f.output.textContent,/not a packet capture/);assert.equal(f.button.disabled,false);}finally{await new Promise(resolve=>server.close(resolve));}
});
test('HTTP errors remain real responses while network failure does not invent a status',async()=>{
 const error=fixture({fetcher:async()=>new Response('No such resource',{status:404,statusText:'Not Found',headers:{'Content-Type':'text/plain'}})});await error.demo.run(error.button);assert.match(error.output.textContent,/404 Not Found/);assert.match(error.output.textContent,/endpoint returned an error/);
 const offline=fixture({fetcher:async()=>{throw new Error('offline');}});await offline.demo.run(offline.button);assert.match(offline.output.textContent,/No usable response arrived/);assert.equal(offline.output.querySelector('.result-fields'),null);assert.equal(offline.button.disabled,false);
});
test('server-supplied body is rendered as text, not executable markup',async()=>{
 const f=fixture({fetcher:async()=>new Response('<img src=x onerror=alert(1)>',{headers:{'Content-Type':'text/plain'}})});await f.demo.run(f.button);assert.equal(f.output.querySelector('img'),null);assert.match(f.output.textContent,/img src=x/);
});
test('live experiment bypasses stored HTTP responses and asks only its own app resource',async()=>{
 let call;const f=fixture({fetcher:async(...args)=>{call=args;return new Response('hello');}});await f.demo.run(f.button);assert.equal(new URL(call[0]).origin,'https://example.test');assert.equal(new URL(call[0]).pathname,'/lesson-demo.txt');assert.equal(call[1].cache,'no-store');
 const worker=await readFile(new URL('../dist/sw.js',import.meta.url),'utf8');assert.ok(!worker.includes("'./lesson-demo.txt'"),'Live requests must not be served from the offline cache');
});
