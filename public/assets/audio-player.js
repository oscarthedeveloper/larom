/* Static audio: credentials and API calls never reach the browser. */
globalThis.createLaromPlayer = function() {
 let active=null, generation=0;
 function stop(){generation++;if(active){active.pause();active.removeAttribute('src');active.load();active=null;}}
 function play(language,text,callbacks={}){
  stop();const current=generation;
  const path=globalThis.laromAudio?.[language+':'+text];
  if(!path){callbacks.error?.();return;}
  const audio=new Audio(path);active=audio;
  const valid=()=>current===generation;
  let failed=false;
  const fail=()=>{if(valid()&&!failed){failed=true;callbacks.error?.();}};
  audio.onplaying=()=>{if(valid())callbacks.start?.();};
  audio.onended=()=>{if(valid())callbacks.end?.();};
  audio.onerror=fail;
  audio.play().catch(fail);
 }
 globalThis.addEventListener('pagehide',stop);
 return {play,stop};
};
