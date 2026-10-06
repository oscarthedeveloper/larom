(() => {
 const $=id=>document.getElementById(id),items=globalThis.historyItems,session=createPracticeSession(items.length,'uppgifter');
 let order=[],position=0,solved=false;const done=new Set();
 function shuffle(values){const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function reveal(item,solved){
  $('timeline').replaceChildren();$('timeline').hidden=!solved||!item.timeline;
  if(solved&&item.timeline)for(const event of item.timeline){const li=document.createElement('li'),date=document.createElement('strong'),label=document.createElement('span'),link=document.createElement('a');date.textContent=event.date;label.textContent=event.event;link.textContent='Källa';link.href=event.source;link.target='_blank';link.rel='noopener';li.append(date,label,link);$('timeline').append(li);}
  $('source').hidden=!solved||!!item.timeline;$('source').href=item.source;
 }
 function render(focus=false){
  const id=order[position],item=items[id];solved=done.has(id);
  $('count').textContent=`Fråga ${position+1} av ${items.length}`;$('progressFill').style.width=`${session.completed/items.length*100}%`;$('exerciseSelect').value=String(position);
  $('prompt').textContent=item.question;$('sceneTag').textContent=item.topic;$('context').textContent=item.context||'Fundera och välj ett svar.';
  if(item.map){$('historyMap').src=item.map;$('historyMap').alt=item.mapAlt;}
  $('actor').textContent=item.emoji;$('object').textContent='';$('spark').textContent=solved&&!item.sober?'✨':'';$('scene').dataset.motion=item.sober?'none':'bob';reveal(item,solved);
  $('choices').replaceChildren();shuffle(item.options).forEach(value=>{
   const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=value;b.disabled=solved;
   if(solved&&value===item.answer)b.classList.add('correct');
   b.onclick=()=>{
    if(solved)return;const correct=value===item.answer;session.record(id,correct);for(const el of $('choices').children)el.classList.remove('try');
    if(correct){solved=true;done.add(id);b.classList.add('correct');for(const el of $('choices').children)el.disabled=true;
     $('feedback').textContent='Rätt! '+item.explanation;$('spark').textContent=item.sober?'':'✨';reveal(item,true);$('next').disabled=false;$('next').textContent=session.complete?'Visa resultat':'Nästa fråga';$('progressFill').style.width=`${session.completed/items.length*100}%`;$('next').focus();
    }else{b.classList.add('try');$('feedback').textContent=session.mistakes(id)>=2?`Rätt svar är: ${item.answer}. ${item.explanation}`:'Inte riktigt. Fundera en gång till och prova igen.';}
   };$('choices').append(b);
  });
  $('feedback').textContent=solved?'Den här frågan är klar. '+item.explanation:'Du får alltid prova igen.';$('next').disabled=!solved;$('next').textContent=session.complete?'Visa resultat':'Nästa fråga';
  if(focus)(solved?$('next'):$('choices').children[0]).focus();
 }
 function start(){order=shuffle(items.map((_,i)=>i));position=0;$('exerciseSelect').replaceChildren();order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Fråga ${i+1}`;$('exerciseSelect').append(o);});render();}
 $('next').onclick=()=>{if(!solved)return;if(session.complete){session.showResult();return;}do{position=(position+1)%items.length;}while(done.has(order[position]));render(true);};
 $('restart').onclick=()=>{session.reset();done.clear();start();$('choices').children[0].focus();};
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<items.length){position=n;render(true);}};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};start();
})();
