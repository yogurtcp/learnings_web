import {initializeUpdates} from './updates.js';
export function installInstructions(nav={}){
 const ua=nav.userAgent||'',ios=/iPhone|iPad|iPod/i.test(ua)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);
 if(ios)return 'In Safari, open this page, tap Share, then choose “Add to Home Screen” and tap Add. If you are using another browser, open this link in Safari first.';
 if(/Android/i.test(ua))return 'In Chrome, open the ⋮ menu and choose “Install app” or “Add to Home screen”, then confirm.';
 return 'In Chrome or Edge, use the install icon in the address bar or open the browser menu and choose “Install learnings_web” or “Install app”. On Safari for Mac, use File → Add to Dock. The available option depends on your browser.';
}
export function initializeInstall({win=window,doc=document,nav=globalThis.navigator||{},notify=()=>{},beforeReload=()=>true}={}){
 const button=doc.querySelector('#installApp'),dialog=doc.querySelector('#installDialog'),close=doc.querySelector('#closeInstall');let deferred=null;
 const installed=()=>!!(win.matchMedia?.('(display-mode: standalone)').matches||nav.standalone===true);
 const update=()=>{if(button)button.hidden=installed();};
 const help=()=>{doc.querySelector('#installInstructions').textContent=installInstructions(nav);if(dialog?.showModal)dialog.showModal();else notify(installInstructions(nav));};
 button?.addEventListener('click',async()=>{
  if(installed()){notify('learnings_web is already running as an installed app.');return;}
  if(!deferred){help();return;}
  const prompt=deferred;deferred=null;
  try{await prompt.prompt();const result=await prompt.userChoice;if(result?.outcome==='accepted')notify('Installation accepted. Your browser will finish adding learnings_web.');}catch{help();}
 });
 close?.addEventListener('click',()=>dialog.close());
 win.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;});
 win.addEventListener('appinstalled',()=>{deferred=null;if(button)button.hidden=true;notify('learnings_web is installed.');});
 update();
 if('serviceWorker' in nav){
  const register=()=>nav.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(registration=>initializeUpdates({win,doc,nav,registration,beforeReload,notify})).catch(()=>{notify('Offline setup did not finish. Reopen the app online to try again.');});
  if(doc.readyState==='loading')win.addEventListener('load',register,{once:true});else register();
 }
 return {installed};
}
