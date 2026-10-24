export function liveRequestMarkup(){return `<aside class="live-request" data-live-demo><span class="eyebrow">TRY IT · A REAL REQUEST</span><h3>Ask for /lesson-demo.txt</h3><p>Click to request a tiny text file from this app’s web service. Compare the returned status, Content-Type and body with the explanation above.</p><button type="button" class="primary" data-demo-request>Send a real request →</button><div data-demo-output role="status" aria-live="polite"><p class="small muted">Requires a connection. The rest of the lesson is available offline.</p></div></aside>`;}
export function initializeLiveRequests({root,escape,fetcher=(...args)=>fetch(...args),now=()=>performance.now(),base=()=>document.baseURI}={}){
 const run=async button=>{
  if(button.disabled)return;
  const output=button.closest('[data-live-demo]').querySelector('[data-demo-output]');button.disabled=true;output.innerHTML='<p class="small muted">Sending GET and waiting for a response…</p>';
  const url=new URL('./lesson-demo.txt',base());url.searchParams.set('request',Date.now());
  const started=now();
  try{
   const response=await fetcher(url.href,{method:'GET',cache:'no-store',signal:globalThis.AbortSignal?.timeout?.(12000)}),body=await response.text();
   const elapsed=Math.max(0,Math.round(now()-started)),type=response.headers.get('content-type')||'(not supplied)';
   output.innerHTML=`<div class="live-result"><dl class="result-fields"><div><dt>Method and target</dt><dd>GET ${escape(url.pathname)}</dd></div><div><dt>HTTP status</dt><dd>${response.status}${response.statusText?' '+escape(response.statusText):''}</dd></div><div><dt>Content-Type</dt><dd>${escape(type)}</dd></div><div><dt>Time to receive body</dt><dd>${elapsed} ms</dd></div></dl><h4>Actual response body</h4><pre class="trace">${escape(body.slice(0,8000))}</pre><p class="small">${response.ok?'The web service returned a successful HTTP response.':'An HTTP endpoint returned an error response; that still differs from receiving no response.'} ${type.includes('text/plain')?'The body is text, just as its Content-Type says.':'Read the returned Content-Type to interpret the body.'}</p><p class="small muted">Measured now, not a recorded example. This is an HTTP-level observation, not a packet capture. Time includes receiving and reading the response. The browser may reuse DNS and connection state; a remote cache may serve the file. You can also find this request in your browser’s Network panel.</p></div>`;
  }catch{
   output.innerHTML='<div class="error"><strong>No usable response arrived.</strong><p>This request did not produce an HTTP status or body. Being offline, a connection failure, or browser policy can cause this. It is different from receiving a 404 response. The reading and authored examples remain available.</p></div>';
  }finally{button.disabled=false;}
 };
 const handler=event=>{const button=event.target.closest?.('[data-demo-request]');if(button&&root.contains(button))run(button);};root.addEventListener('click',handler);
 return {run,stop:()=>root.removeEventListener('click',handler)};
}
