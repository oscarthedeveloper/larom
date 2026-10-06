(() => {
 const $=id=>document.getElementById(id),game=discoveryGames[document.body.dataset.discovery];
 const items=game.items,session=createPracticeSession(items.length,'uppgifter',{detail:true});
 const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 let order=[],position=0,states=[];
 const current=()=>items[order[position]],state=()=>states[order[position]];
 function draw(){
  const t=current(),s=state(),scene=drawDiscovery(t.id,s.value);
  $('diagram').innerHTML=scene.svg;$('diagram').setAttribute('aria-label',t.title+'. '+scene.observation);
  $('observation').textContent=scene.observation;$('controlValue').textContent=scene.valueText;
  $('sceneRange').setAttribute('aria-valuetext',scene.valueText);
  Array.from($('sceneButtons').children).forEach((b,i)=>b.setAttribute('aria-pressed',String(s.value===i)));
 }
 function feedback(){
  const t=current(),s=state(),revealed=session.mistakes(order[position])>=2;
  $('feedback').textContent=s.done?'Rätt! '+t.explanation:revealed?'Svaret är: '+t.answer+' '+t.explanation:s.tried.size?'Inte riktigt. '+t.hint:'Prova bilden och välj sedan ett svar.';
  $('feedback').dataset.tone=s.done?'correct':s.tried.size?'retry':'idle';
  $('tryBox').hidden=!s.done;$('tryText').textContent=t.tryIt;
  $('next').disabled=!s.done;$('next').textContent=session.complete?'Se mitt resultat':'Nästa upptäckt →';
  $('count').textContent=`${session.completed} av ${items.length} klara`;$('progressFill').style.width=`${session.completed/items.length*100}%`;
  Array.from($('topicNav').children).forEach((b,i)=>{const n=order[i],item=items[n];b.setAttribute('aria-label',`${i+1}. ${item.title}${states[n].done?', klar':''}`);b.classList.toggle('done',states[n].done);b.children[0].textContent=states[n].done?'✓':String(i+1);});
 }
 function answer(value){
  const s=state(),t=current(),id=order[position];if(s.done||s.tried.has(value))return;
  const right=value===t.answer;session.record(id,right);
  if(right)s.done=true;else{s.tried.add(value);if(session.mistakes(id)>=2)session.markSupport(id,'answer');}
  Array.from($('choices').children).forEach(b=>{
   const isAnswer=b.dataset.answer===t.answer,wrong=s.tried.has(b.dataset.answer);b.disabled=s.done||wrong;
   b.classList.toggle('correct',s.done&&isAnswer);b.classList.toggle('incorrect',wrong);
   b.children[0].textContent=s.done&&isAnswer?'✓':wrong?'↻':b.dataset.letter;
   b.setAttribute('aria-label',b.dataset.answer+(s.done&&isAnswer?' Rätt svar.':wrong?' Inte rätt. Prova ett annat svar.':''));
  });
  feedback();if(s.done)$('next').focus();else Array.from($('choices').children).find(b=>!b.disabled)?.focus();
 }
 function render(){
  const t=current(),s=state();$('topicTitle').textContent=t.title;$('topicIcon').textContent=t.icon;
  $('prompt').textContent=t.question;$('questionNumber').textContent=`Upptäckt ${position+1} av ${items.length}`;
  $('topicNav').replaceChildren();order.forEach((id,i)=>{
   const b=document.createElement('button'),num=document.createElement('span'),name=document.createElement('span');
   b.type='button';num.className='discovery-number';name.className='discovery-topic-name';name.textContent=items[id].title;
   b.setAttribute('aria-current',i===position?'step':'false');b.onclick=()=>{position=i;render();$('prompt').focus();};b.append(num,name);$('topicNav').append(b);
  });
  const range=t.control.kind==='range';$('rangeControl').hidden=!range;$('sceneButtons').hidden=range;
  $('controlLabel').textContent=t.control.label;$('rangeLabel').textContent=t.control.label;
  $('sceneButtons').setAttribute('aria-label',t.control.label);$('sceneButtons').replaceChildren();
  if(range){$('sceneRange').value=String(s.value);$('rangeStart').textContent=t.control.ends[0];$('rangeEnd').textContent=t.control.ends[1];}
  else t.control.labels.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>{state().value=i;draw();};$('sceneButtons').append(b);});
  $('choices').replaceChildren();s.options.forEach((value,i)=>{
   const b=document.createElement('button'),badge=document.createElement('span'),label=document.createElement('span');
   b.type='button';b.className='discovery-answer';b.dataset.answer=value;b.dataset.letter=String.fromCharCode(65+i);
   const wrong=s.tried.has(value),correct=s.done&&value===t.answer;
   b.disabled=s.done||wrong;b.classList.toggle('correct',correct);b.classList.toggle('incorrect',wrong);
   b.setAttribute('aria-label',value+(correct?' Rätt svar.':wrong?' Inte rätt. Prova ett annat svar.':''));
   badge.className='answer-badge';badge.setAttribute('aria-hidden','true');badge.textContent=correct?'✓':wrong?'↻':b.dataset.letter;label.textContent=value;
   b.append(badge,label);b.onclick=()=>answer(value);$('choices').append(b);
  });
  $('sourceDetails').open=false;$('sources').replaceChildren();
  for(const [title,url] of t.sources){const li=document.createElement('li'),a=document.createElement('a');a.textContent=title;a.href=url;li.append(a);$('sources').append(li);}
  draw();feedback();
 }
 function start(){
  order=shuffle(items.map((_,i)=>i));position=0;
  states=items.map(t=>({value:t.control.initial,done:false,tried:new Set(),options:shuffle(t.options)}));render();
 }
 $('sceneRange').oninput=()=>{const n=Number($('sceneRange').value);if(!Number.isFinite(n))return;state().value=Math.max(0,Math.min(100,n));draw();};
 $('next').onclick=()=>{
  if(!state().done)return;if(session.complete){session.showResult();const n=session.supportCounts.answer;$('supportSummary').textContent=`Facit visades i ${n} av ${items.length} uppgifter. Alla bilder fick utforskas före svaret.`;return;}
  do{position=(position+1)%items.length;}while(state().done);render();$('prompt').focus();
 };
 $('restart').onclick=()=>{session.reset();start();$('prompt').focus();};
 $('exploreAgain').onclick=()=>{$('result').hidden=true;$('workshop').hidden=false;position=0;render();$('prompt').focus();};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 start();
})();
