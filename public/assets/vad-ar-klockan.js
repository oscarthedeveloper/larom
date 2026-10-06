(() => {
 const $=id=>document.getElementById(id),names=['tolv','ett','två','tre','fyra','fem','sex','sju','åtta','nio','tio','elva'];
 const times=[[60,180,360,600,90,270,450,690],[75,195,375,615,165,345,525,705],[65,190,320,385,475,530,640,695]];
 const titles=['Hel och halv','Kvart över och kvart i','Fem minuter i taget'];
 const applications=[
  {id:'clock-morning',time:510,question:'Du ska börja skolan halv nio på morgonen. Ställ klockan på halv nio.',explanation:'Halv nio på morgonen är 08.30. Den långa visaren pekar på 6 och den korta är mellan 8 och 9.'},
  {id:'clock-afternoon',time:165,question:'Ni träffas kvart i tre på eftermiddagen. Ställ klockan på kvart i tre.',explanation:'Kvart i tre på eftermiddagen är 14.45. Den långa visaren pekar på 9 och den korta är på väg mot 3.'},
  {id:'clock-break',time:605,question:'Rasten börjar fem över tio på förmiddagen. Ställ klockan på fem över tio.',explanation:'Fem över tio på förmiddagen är 10.05. Den långa visaren pekar på 1 och den korta är strax efter 10.'}
 ];
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;};
 function makeRound(items,kind){return {items:[...items],kind,order:shuffle(items.map((_,i)=>i)),position:0,session:createPracticeSession(items.length,'uppgifter',{detail:true}),settings:{}};}
 const initial=times.map((a,l)=>a.map((time,i)=>({id:`clock-${l+1}-${i+1}`,time})));
 const primary=initial.map(items=>makeRound(items,'primary'));let level=0,active=primary[0];
 const currentId=()=>active.order[active.position],current=()=>active.items[currentId()];
 function practice(){document.querySelectorAll('[data-practice]').forEach(el=>{el.hidden=false;});$('result').hidden=true;}
 function words(t){const h=Math.floor(t/60)%12,m=t%60,next=names[(h+1)%12];if(m===0)return names[h];if(m===15)return 'kvart över '+names[h];if(m===30)return 'halv '+next;if(m===45)return 'kvart i '+next;if(m===5||m===10||m===20)return ({5:'fem',10:'tio',20:'tjugo'})[m]+' över '+names[h];if(m===25)return 'fem i halv '+next;if(m===35)return 'fem över halv '+next;return ({40:'tjugo',50:'tio',55:'fem'})[m]+' i '+next}
 function clock(id,t){const el=$(id),h=t/60%12,m=t%60;let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" aria-hidden="true"><circle cx="160" cy="160" r="150" fill="white" stroke="#c9d4ed" stroke-width="5"/>';
 for(let i=0;i<60;i++){const angle=i*6*Math.PI/180,r=i%5===0?131:139;svg+=`<line x1="${160+Math.sin(angle)*r}" y1="${160-Math.cos(angle)*r}" x2="${160+Math.sin(angle)*145}" y2="${160-Math.cos(angle)*145}" stroke="#65718e" stroke-width="${i%5===0?3:1}"/>`}
 for(let n=1;n<=12;n++){const a=n*30*Math.PI/180;svg+=`<text x="${160+Math.sin(a)*113}" y="${169-Math.cos(a)*113}" text-anchor="middle" font-family="sans-serif" font-size="25" fill="#172752">${n}</text>`}
 svg+=`<line x1="160" y1="168" x2="160" y2="85" stroke="#bd3446" stroke-width="11" stroke-linecap="round" transform="rotate(${h*30} 160 160)"/><line x1="160" y1="173" x2="160" y2="48" stroke="#2d46d8" stroke-width="6" stroke-linecap="round" transform="rotate(${m*6} 160 160)"/><circle cx="160" cy="160" r="8" fill="#172752"/></svg>`;el.innerHTML=svg;
 el.setAttribute('aria-label',`Analog klocka. Minutvisaren pekar på ${m/5===0?12:m/5}. Timvisaren ${m===0?'pekar på '+(Math.floor(h)||12):'är mellan '+(Math.floor(h)||12)+' och '+((Math.floor(h)+1)%12||12)}.`);
 }
 function explanation(t){const m=t%60;return `Klockan är ${words(t)}. Minutvisaren pekar på ${m===0?12:m/5}${m===30?', och timvisaren är halvvägs till nästa timme.':m===45?', alltså en kvart före nästa timme.':m===0?', alltså en hel timme.':`, alltså ${m} minuter efter hel timme.`}`}

 function mistake(expected,chosen){
  if(expected%60===chosen%60)return 'Minuterna stämmer. Titta nu på den korta timvisaren: vilken timme har den passerat? Halv och kvart i hör till nästa timme.';
  if(expected%60===15&&chosen%60===45||expected%60===45&&chosen%60===15)return 'Kvart över och kvart i är olika. På 3 har en kvart gått. På 9 är det en kvart kvar till nästa timme.';
  return 'Börja med den långa minutvisaren. Varje steg mellan två siffror är fem minuter. Den korta visaren visar timmen.';
 }
 function feedbackWrong(value){const id=currentId(),t=current().time;const reveal=active.session.mistakes(id)>=2;active.session.markSupport(id,reveal?'answer':'hint');$('feedback').textContent=reveal?explanation(t):mistake(t,value);}
 function render(){
  const id=currentId(),item=current(),t=item.time,session=active.session,solved=session.isDone(id),setting=!!item.question;
  $('count').textContent=`Uppgift ${active.position+1} av ${active.items.length}`;$('progressFill').style.width=`${session.completed/active.items.length*100}%`;$('exerciseSelect').value=String(active.position);
  $('roundLabel').textContent=`Nivå ${level+1} · ${active.kind==='primary'?'första omgången':active.kind==='review'?'repetition · egen omgång':'ställ klockan · egen omgång'}`;
  $('topic').textContent=setting?'Använd klockan i vardagen':titles[level];
  $('clockQuestion').textContent=setting?item.question:'Vad är klockan?';$('choices').hidden=setting;$('setClock').hidden=!setting;$('clockMethod').hidden=setting;
  $('choices').replaceChildren();
  if(setting){const value=active.settings[id]??0;$('setTime').value=String(value);$('setTime').disabled=solved;$('checkTime').disabled=solved;setDial();}
  else {
   clock('clock',t);
   // Deliberate contrasts: same minutes/different hour, and same hour/different minutes.
   const alternateMinute=t%60===0?30:t%60===30?0:t%60===15?45:t%60===45?15:(t%60+10)%60;
   const candidates=[(t+60)%720,Math.floor(t/60)*60+alternateMinute];
   shuffle([t,...candidates]).forEach(value=>{const b=document.createElement('button');b.type='button';b.className='choice';b.textContent=words(value);b.disabled=solved;if(solved&&value===t)b.classList.add('correct');b.onclick=()=>{if(active.session.isDone(id))return;const correct=value===t;session.record(id,correct);if(correct){render();$('next').focus();}else{b.classList.add('try');feedbackWrong(value);}};$('choices').append(b);});
  }
  $('feedback').textContent=solved?'Rätt! '+(item.explanation||explanation(t)):setting?'Flytta visarna och tryck sedan på Kolla klockan.':'Välj det svar som passar visarna.';
  $('next').disabled=!solved;$('next').textContent=session.complete?'Visa resultat':'Nästa fråga';
 }
 function select(focus=false){$('exerciseSelect').replaceChildren();active.order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Uppgift ${i+1}`;$('exerciseSelect').append(o);});render();if(focus)(current().question?$('setTime'):$('choices').children[0]).focus();}
 function showResult(){
  const session=active.session;if(!session.complete)return;session.showResult();
  $('resultTitle').textContent=active.kind==='primary'?`Nivå ${level+1} klar!`:active.kind==='review'?'Repetitionen är klar!':'Du har ställt klockan!';
  $('review').hidden=session.reviewIndices.length===0;$('review').textContent=`Öva vidare · ${session.reviewIndices.length} uppgifter`;
  $('transfer').hidden=active.kind==='transfer';$('transfer').textContent='Prova i vardagen: ställ klockan';$('backToPrimary').hidden=active===primary[level];$('restart').textContent=`Starta nivå ${level+1} igen`;
 }
 $('level').onchange=()=>{const n=Number($('level').value);if(Number.isInteger(n)&&n>=0&&n<3){level=n;active=primary[level];practice();select();}};
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<active.items.length){active.position=n;render();}};
 $('next').onclick=()=>{if(!active.session.isDone(currentId()))return;if(active.session.complete){showResult();return;}do{active.position=(active.position+1)%active.items.length;}while(active.session.isDone(currentId()));select(true);};
 $('chooseLevel').onclick=()=>{active=primary[level];practice();select();$('level').focus();};
 $('restart').onclick=()=>{primary[level]=makeRound(initial[level],'primary');active=primary[level];practice();select(true);};
 $('review').onclick=()=>{active=makeRound(active.session.reviewIndices.map(i=>active.items[i]),'review');practice();select(true);};
 $('transfer').onclick=()=>{active=makeRound([applications[level]],'transfer');practice();select(true);};
 $('backToPrimary').onclick=()=>{active=primary[level];showResult();};
 function setDial(){const t=Number($('setTime').value);clock('clock',t);$('setTime').setAttribute('aria-valuetext',`Minutvisaren på ${t%60/5||12}. Timvisaren ${t%60===0?'på '+(Math.floor(t/60)||12):'mellan '+(Math.floor(t/60)||12)+' och '+((Math.floor(t/60)+1)%12||12)}.`);}
 $('setTime').oninput=()=>{if(active.session.isDone(currentId()))return;const t=Number($('setTime').value);if(!Number.isInteger(t)||t<0||t>715||t%5)return;active.settings[currentId()]=t;setDial();};
 $('checkTime').onclick=()=>{if(!current().question||active.session.isDone(currentId()))return;const value=Number($('setTime').value);if(!Number.isInteger(value)||value<0||value>715||value%5)return;const correct=value===current().time;active.session.record(currentId(),correct);if(correct){render();$('next').focus();}else feedbackWrong(value);};
 function demo(){const t=Number($('demoTime').value);clock('demoClock',t);$('demoLabel').textContent=`Klockan är ${words(t)} (${String(Math.floor(t/60)||12).padStart(2,'0')}.${String(t%60).padStart(2,'0')}).`;}$('demoTime').oninput=demo;$('demoTime').value='90';demo();
 $('motion').onclick=()=>{const p=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(p));$('motion').textContent=p?'Starta rörelser':'Pausa rörelser';};select();
})();
