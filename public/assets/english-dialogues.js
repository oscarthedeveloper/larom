(() => {
 const $=id=>document.getElementById(id), {items,emoji}=globalThis.englishGame;
 const session=createPracticeSession(items.length,'uppgifter');let index=0,solved=false,token=0;
 const player=createLaromPlayer();
 function stop(){token++;player.stop();}
 function speak(text){
  stop();const current=token;
  player.play('en',text,{
   start:()=>{if(current===token)$('audioStatus').textContent='Lyssna …';},
   end:()=>{if(current===token)$('audioStatus').textContent='Prova gärna att säga repliken högt!';},
   error:()=>{if(current===token)$('audioStatus').textContent='Ljudet kunde inte spelas. Prova igen eller läs repliken.';}
  });
 }
 function render(focus=false){
  stop();solved=false;const item=items[index];
  $('count').textContent=`Övning ${index+1} av ${items.length}`;$('progressFill').style.width=`${session.completed/items.length*100}%`;
  $('exerciseSelect').value=String(index);$('prompt').textContent=item.prompt;$('context').textContent=item.context;
  $('actor').textContent=emoji;$('object').textContent='💬';$('spark').textContent='';$('scene').dataset.motion='bob';
  $('sceneTag').textContent='Din samtalskompis';$('audioStatus').textContent='Du kan lyssna på repliken.';
  $('listenAnswer').hidden=true;$('next').disabled=true;$('next').textContent='Nästa övning';$('choices').replaceChildren();
  const options=[...item.options];if(Math.random()<.5)options.reverse();
  options.forEach(value=>{const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=value;b.onclick=()=>choose(value,b);$('choices').append(b);});
  $('feedback').textContent='Välj svaret som passar den svenska situationen.';
  if(focus)$('choices').children[0].focus();
 }
 function choose(value,button){
  if(solved)return;const item=items[index],correct=value===item.answer;session.record(index,correct);
  for(const b of $('choices').children)b.classList.remove('try','correct');
  if(correct){solved=true;stop();button.classList.add('correct');for(const b of $('choices').children)b.disabled=true;
   $('spark').textContent='✨';$('feedback').textContent=`Bra! ${item.explanation} Prova att säga ditt svar högt.`;
   $('listenAnswer').hidden=false;$('next').disabled=false;$('next').textContent=session.complete?'Visa resultat':'Nästa övning';
   $('progressFill').style.width=`${session.completed/items.length*100}%`;$('next').focus();
  }else{button.classList.add('try');$('feedback').textContent=session.mistakes(index)>=2?`Här passar: ${item.answer} ${item.explanation}`:`Prova igen. ${item.context}`;}
 }
 $('listen').onclick=()=>speak(items[index].prompt);$('listenAnswer').onclick=()=>{if(solved)speak(items[index].answer);};
 $('next').onclick=()=>{if(!solved)return;stop();if(session.complete)session.showResult();else{index=session.nextUnfinished(index);render(true);}};
 $('restart').onclick=()=>{session.reset();index=0;render(true);};
 items.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Dialog ${i+1}`;$('exerciseSelect').append(o);});
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<items.length){index=n;render(true);}};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 globalThis.addEventListener('pagehide',stop);render();
})();
