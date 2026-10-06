(() => {
 const $=id=>document.getElementById(id),levels=globalThis.mapQuizData[document.body.dataset.mapKind];
 function shuffled(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 const states=levels.map(l=>({session:createPracticeSession(l.items.length,'uppgifter'),order:shuffled(l.items.map((_,i)=>i)),position:0,done:new Set()}));
 let level=0,solved=false;
 const state=()=>states[level],item=()=>levels[level].items[state().order[state().position]];
 const targets=()=>Array.from($('mapLayer'+level).querySelectorAll('[data-region]'));
 function draw(){
  const s=state();solved=s.done.has(s.order[s.position]);
  $('count').textContent=`${levels[level].name} · ${s.position+1} av ${s.order.length}`;
  $('task').textContent=`Var ligger ${item().name}?`;$('feedback').textContent='Välj ett område på kartan.';$('clue').textContent='';
  targets().forEach(t=>{t.classList.remove('map-wrong','map-correct','map-reveal','map-done');const done=s.done.has(levels[level].items.findIndex(x=>x.id===t.dataset.region));if(done)t.classList.add('map-done');t.setAttribute('aria-disabled',String(done));t.setAttribute('tabindex',done?'-1':'0');});
  $('next').disabled=true;$('next').textContent='Nästa plats';$('hint').disabled=false;$('reveal').disabled=false;
 }
 function choose(id){
  if(solved)return;const s=state(),answer=item(),clicked=levels[level].items.find(x=>x.id===id);if(!clicked||(s.done.has(levels[level].items.indexOf(clicked))))return;
  const correct=id===answer.id;s.session.record(s.order[s.position],correct);
  targets().forEach(t=>t.classList.remove('map-wrong'));
  const target=targets().find(t=>t.dataset.region===id);
  if(correct){
   solved=true;s.done.add(s.order[s.position]);target.classList.add('map-correct');target.classList.remove('map-reveal');{target.classList.add('map-done');target.setAttribute('tabindex','-1');}
   targets().forEach(t=>t.setAttribute('aria-disabled','true'));
   $('feedback').textContent=`Rätt! Här ligger ${answer.name}. ${answer.fact}`;$('clue').textContent='';
   $('hint').disabled=true;$('reveal').disabled=true;$('next').disabled=false;
   $('next').textContent=s.session.complete?'Visa resultat':'Nästa plats';$('next').focus();
  }else{target.classList.add('map-wrong');$('feedback').textContent=`Du valde ${clicked.name}. Leta efter ${answer.name} och prova igen.`;if(s.session.mistakes(s.order[s.position])>=2)$('clue').textContent=answer.hint;}
 }
 levels.forEach((l,i)=>{$('mapLayer'+i).querySelectorAll('[data-region]').forEach(t=>{
  t.onclick=()=>choose(t.dataset.region);
  t.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(t.dataset.region);}};
 });});
 $('hint').onclick=()=>{if(!solved)$('clue').textContent=item().hint;};
 $('reveal').onclick=()=>{
  if(solved)return;state().session.record(state().order[state().position],false);
  const target=targets().find(t=>t.dataset.region===item().id);target.classList.add('map-reveal');
  $('clue').textContent=`${item().name} är markerat med en streckad orange kant. Välj det markerade området.`;
  target.focus();
 };
 $('next').onclick=()=>{if(!solved)return;if(state().session.complete){$('resultTitle').textContent=levels[level].name+' klart!';state().session.showResult();}else{state().position++;draw();$('task').focus();}};
 function selectLevel(){
  levels.forEach((_,i)=>{$('mapLayer'+i).hidden=i!==level;});
  $('mapScroll').scrollTop=0;$('mapScroll').scrollLeft=0;
  if(state().session.complete){$('resultTitle').textContent=levels[level].name+' klart!';state().session.showResult();return;}
  document.querySelectorAll('[data-practice]').forEach(e=>{e.hidden=false;});$('result').hidden=true;
  // Continue after the last solved question when switching maps.
  while(state().done.has(state().order[state().position]))state().position++;
  draw();
 }
 $('mapLevel').onchange=()=>{const n=Number($('mapLevel').value);if(Number.isInteger(n)&&n>=0&&n<levels.length){level=n;selectLevel();}};
 $('restart').onclick=()=>{const s=state();s.session.reset();s.order=shuffled(levels[level].items.map((_,i)=>i));s.position=0;s.done.clear();selectLevel();$('task').focus();};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 selectLevel();
})();
