// Applies complete service-worker releases automatically while preserving active work.
export function initializeUpdates({win=window,doc=document,nav=globalThis.navigator,registration,beforeReload=()=>true,notify=()=>{},later=(fn,ms)=>win.setTimeout(fn,ms)}={}){
 let controller=nav.serviceWorker.controller,pending=false,reloading=false,checked=false,typingNotice=false,saveNotice=false,stopped=false;
 const listeners=[];
 const listen=(target,type,fn)=>{target.addEventListener(type,fn);listeners.push(()=>target.removeEventListener(type,fn));};
 const online=()=>nav.onLine!==false;
 function apply(){
  if(!pending||reloading||stopped||doc.visibilityState==='hidden')return;
  const active=doc.activeElement;
  if(active?.matches?.('input, textarea, [contenteditable="true"]')){
   if(!typingNotice){notify('An update is ready. It will apply when you finish editing.');typingNotice=true;}return;
  }
  let saved=false;try{saved=beforeReload()!==false;}catch{}
  if(!saved){if(!saveNotice){notify('An update is ready, but progress could not be saved. Export a backup in Settings before reloading.');saveNotice=true;}return;}
  reloading=true;win.location.reload();
 }
 async function check(){
  apply();
  if(stopped||checked)return;
  checked=true;
  if(!online())return;
  try{await registration.update();registration.waiting?.postMessage({type:'ACTIVATE_UPDATE'});}catch{/* A disconnected server should not interrupt offline learning. */}
 }
 listen(nav.serviceWorker,'controllerchange',()=>{
  const next=nav.serviceWorker.controller;if(next===controller)return;
  const upgrading=!!controller;controller=next;
  if(upgrading&&next){pending=true;apply();}
 });
 // Foreground return can apply an already downloaded update, but never checks the network.
 listen(doc,'visibilitychange',()=>{if(doc.visibilityState!=='hidden')apply();});
 listen(doc,'focusout',()=>{if(pending)later(apply,0);});
 const stop=()=>{stopped=true;for(const remove of listeners)remove();};
 listen(win,'pagehide',event=>{if(!event.persisted)stop();});
 check();
 return {check,apply,stop};
}
