(() => {
 const $=id=>document.getElementById(id);let items=[],session,order=[],position=0,solved=false;
 const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 function sources(item,visible){
  $('timeline').replaceChildren();$('timeline').hidden=!visible;$('source').hidden=!visible;$('source').href=item.source;
  if(visible)for(const event of item.mapTimeline){const li=document.createElement('li'),date=document.createElement('strong'),label=document.createElement('span'),link=document.createElement('a');date.textContent=event.date;label.textContent=event.event;link.textContent='Kartunderlag';link.href=event.source;link.target='_blank';link.rel='noopener';li.append(date,label,link);$('timeline').append(li);}
 }
 function render(focus=false){
  const id=order[position],item=items[id];solved=session.isDone(id);
  $('count').textContent=`Fråga ${position+1} av ${items.length}`;$('progressFill').style.width=`${session.completed/items.length*100}%`;$('exerciseSelect').value=String(position);
  $('prompt').textContent=item.question;$('sceneTag').textContent=item.topic;$('context').textContent=item.context;
  $('historyMap').src=item.map;$('historyMap').alt=item.mapAlt;$('mapCaption').textContent=item.caption||item.topic;
  $('compareFigure').hidden=!item.compareMap;if(item.compareMap){$('compareMap').src=item.compareMap;$('compareMap').alt=item.compareAlt;$('compareCaption').textContent=item.compareCaption;}
  $('scene').dataset.motion='none';sources(item,solved);
  $('choices').replaceChildren();shuffle(item.options).forEach(value=>{
   const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=value;b.disabled=solved;
   if(solved&&value===item.answer)b.classList.add('correct');
   b.onclick=()=>{
    if(solved)return;const correct=value===item.answer;session.record(id,correct);for(const el of $('choices').children)el.classList.remove('try');
    if(correct){solved=true;b.classList.add('correct');for(const el of $('choices').children)el.disabled=true;
     $('feedback').textContent='Rätt! '+item.explanation;sources(item,true);$('next').disabled=false;$('next').textContent=session.complete?'Visa resultat':'Nästa fråga';$('progressFill').style.width=`${session.completed/items.length*100}%`;$('next').focus();
    }else{b.classList.add('try');const reveal=session.mistakes(id)>=2;session.markSupport(id,reveal?'answer':'hint');$('feedback').textContent=reveal?`Rätt svar är: ${item.answer}. ${item.explanation}`:item.hint;}
   };$('choices').append(b);
  });
  $('feedback').textContent=solved?'Den här frågan är klar. '+item.explanation:'Du får alltid prova igen.';$('next').disabled=!solved;$('next').textContent=session.complete?'Visa resultat':'Nästa fråga';
  if(focus)(solved?$('next'):$('choices').children[0]).focus();
 }
 const flow=createRoundFlow({items:globalThis.historyItems,extras:globalThis.empireApplications,noun:'uppgifter',onStart:round=>{
  items=round.items;session=round.session;order=shuffle(items.map((_,i)=>i));position=0;$('exerciseSelect').replaceChildren();order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Fråga ${i+1}`;$('exerciseSelect').append(o);});render(round.focus);
 }});
 $('next').onclick=()=>{if(!solved)return;if(session.complete){flow.result();return;}do{position=(position+1)%items.length;}while(session.isDone(order[position]));render(true);};
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<items.length){position=n;render(true);}};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 flow.start(undefined,'6 historiska kartor · första omgången');
})();
