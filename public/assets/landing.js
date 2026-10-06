/* Lenis is deliberately initialized on the public home page only. */
(() => {
 const body=document.body,root=document.documentElement,button=document.getElementById('landingMotion');
 const media=window.matchMedia('(prefers-reduced-motion: reduce)');
 let lenis=null,paused=false;
 function destroyScroll(){if(lenis){lenis.destroy();lenis=null;}}
 function syncMotion(){
  const reduce=paused||media.matches;
  body.classList.toggle('motion-paused',reduce);
  root.classList.toggle('page-hidden',document.hidden);
  button.disabled=media.matches;
  button.setAttribute('aria-pressed',String(reduce));
  button.setAttribute('aria-label',media.matches?'Rörelser är av enligt enhetens inställning':paused?'Starta rörelser':'Pausa rörelser');
  document.getElementById('motionLabel').textContent=reduce?'Rörelser av':'Pausa rörelser';
  document.getElementById('motionIcon').textContent=reduce?'▷':'Ⅱ';
  if(reduce||document.hidden){destroyScroll();return;}
  if(!lenis&&typeof window.Lenis==='function'){
   try{lenis=new window.Lenis({autoRaf:true,lerp:.1,smoothWheel:true,syncTouch:false,anchors:true});}
   catch{destroyScroll();} // The document remains usable with ordinary native scrolling.
  }
 }
 document.getElementById('lenisScript')?.addEventListener('load',syncMotion);
 button.addEventListener('click',()=>{paused=!paused;syncMotion();});
 media.addEventListener?.('change',syncMotion);
 document.addEventListener('visibilitychange',syncMotion);
 window.addEventListener('pagehide',destroyScroll);
 window.addEventListener('pageshow',syncMotion);
 const header=document.querySelector('.lp-header');
 function markScroll(){header.classList.toggle('scrolled',window.scrollY>10);}
 window.addEventListener('scroll',markScroll,{passive:true});markScroll();
 if(typeof window.IntersectionObserver==='function'){
  const observer=new window.IntersectionObserver(entries=>{for(const entry of entries){entry.target.classList.toggle('offscreen',!entry.isIntersecting);if(entry.isIntersecting&&entry.target.hasAttribute('data-reveal'))entry.target.classList.add('revealed');}},{threshold:0,rootMargin:'60px 0px'});
  document.querySelectorAll('.lp-scene, [data-reveal]').forEach(el=>observer.observe(el));
 }
 syncMotion();
})();
