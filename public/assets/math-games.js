(() => {
 const $=id=>document.getElementById(id),friends=document.body.dataset.math==='friends';
 const fruits=[{icon:'🍐',name:'päron'},{icon:'🍎',name:'äpplen'},{icon:'🍊',name:'apelsiner'},{icon:'🍓',name:'jordgubbar'},{icon:'🍋',name:'citroner'}];
 const tasks=friends?Array.from({length:11},(_,n)=>n):[10,14,20,26,30,34,42,50,58,63,70,75,81,90,99];
 const session=createPracticeSession(tasks.length,'uppgifter'),done=new Set();let order=[],position=0,solved=false;
 const fields=friends?['answer']:['tens','ones'];
 function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function number(id,max){const text=$(id).value.trim();if(!/^\d+$/.test(text))return null;const n=Number(text);return Number.isInteger(n)&&n<=max?n:null;}
 function current(){return tasks[order[position]];}
 function fruit(){return fruits[order[position]%fruits.length];}
 function picture(id,n,kind){
  const el=$(id);el.replaceChildren();el.setAttribute('aria-label',n===null?'Antalet är inte valt':`${n} ${kind==='fruit'?fruit().name:kind==='tens'?'tiotal':'ental'}`);
  if(n===null){const p=document.createElement('span');p.className='empty-group';p.textContent='Välj ett tal';el.append(p);return;}
  if(n===0){const p=document.createElement('span');p.className='empty-group';p.textContent=kind==='fruit'?'Inga frukter':'Inga ännu';el.append(p);return;}
  for(let i=0;i<n;i++){const piece=document.createElement('span');piece.setAttribute('aria-hidden','true');piece.className=kind==='fruit'?'fruit':kind==='tens'?'ten-rod':'one-block';piece.style.animationDelay=`${i*25}ms`;
   if(kind==='fruit')piece.textContent=fruit().icon;
   if(kind==='tens')for(let j=0;j<10;j++){const unit=document.createElement('i');piece.append(unit);}
   el.append(piece);
  }
 }
 function update(){
  if(friends){const n=number('answer',10);$('chosen').textContent=n===null?'?':String(n);picture('chosenPears',n,'fruit');}
  else{const t=number('tens',9),o=number('ones',9);picture('tensBlocks',t,'tens');picture('onesBlocks',o,'ones');$('builtTotal').textContent=t===null||o===null?'Skriv en siffra från 0 till 9 i varje ruta.':`Du har byggt: ${t*10} + ${o} = ${t*10+o}`;
   for(const [id,n] of [['tens',t],['ones',o]]){ $(id+'Minus').disabled=solved||n===0;$(id+'Plus').disabled=solved||n===9;}
  }
 }
 function clearFeedback(){if(solved)return;for(const id of fields){$(id).setAttribute('aria-invalid','false');$(id).classList.remove('is-correct');}$('feedback').textContent='Räkna i lugn och ro. Tryck sedan på Kolla.';update();}
 function render(focus=false){
  solved=done.has(order[position]);$('count').textContent=`Uppgift ${position+1} av ${tasks.length}`;$('progressFill').style.width=`${session.completed/tasks.length*100}%`;$('exerciseSelect').value=String(position);
  for(const id of fields){$(id).disabled=solved;$(id).setAttribute('aria-invalid','false');$(id).classList.toggle('is-correct',solved);}
  if(friends){$('given').textContent=String(current());$('taskTitle').textContent=`${current()} + ? = 10`;$('answer').value=solved?String(10-current()):'';picture('givenPears',current(),'fruit');}
  else{$('target').textContent=String(current());$('tens').value=solved?String(Math.floor(current()/10)):'0';$('ones').value=solved?String(current()%10):'0';}
  update();$('check').hidden=solved;$('next').hidden=!solved;$('next').textContent=session.complete?'Visa resultat':'Nästa uppgift';$('feedback').textContent=solved?'Den här uppgiften är klar. '+explain():'Du får alltid prova igen.';
  if(focus)(solved?$('next'):$(fields[0])).focus();
 }
 function explain(){return friends?`${current()} + ${10-current()} = 10. De två talen är tiokompisar!`:`${current()} består av ${Math.floor(current()/10)} tiotal och ${current()%10} ental: ${Math.floor(current()/10)*10} + ${current()%10} = ${current()}.`;}
 $('answerForm').onsubmit=event=>{
  event.preventDefault();if(solved)return;
  const values=fields.map(id=>number(id,friends?10:9));
  if(values.some(n=>n===null)){$('feedback').textContent=friends?'Skriv ett helt tal från 0 till 10.':'Skriv en siffra från 0 till 9 i båda rutorna.';$(fields[values.indexOf(null)]).focus();return;}
  const correct=friends?values[0]+current()===10:values[0]*10+values[1]===current();session.record(order[position],correct);
  for(const id of fields){$(id).setAttribute('aria-invalid',String(!correct));$(id).classList.toggle('is-correct',correct);}
  if(correct){done.add(order[position]);render();$('feedback').textContent='Rätt! '+explain();$('next').focus();}
  else{$('feedback').textContent=session.mistakes(order[position])>=2?'Vi tar hjälp: '+explain():friends?`Du har ${current()+values[0]} frukter. Försök få precis 10.`:`Du har byggt ${values[0]*10+values[1]}. Försök bygga ${current()}.`;}
 };
 for(const id of fields)$(id).oninput=clearFeedback;
 if(!friends)for(const id of fields)for(const [suffix,step] of [['Minus',-1],['Plus',1]])$(id+suffix).onclick=()=>{if(solved)return;const n=number(id,9)??0;$(id).value=String(Math.max(0,Math.min(9,n+step)));clearFeedback();};
 function start(){order=shuffle(tasks.map((_,i)=>i));position=0;$('exerciseSelect').replaceChildren();order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Uppgift ${i+1}`;$('exerciseSelect').append(o);});render();}
 $('next').onclick=()=>{if(!solved)return;if(session.complete){session.showResult();return;}do{position=(position+1)%tasks.length;}while(done.has(order[position]));render(true);};
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<tasks.length){position=n;render(true);}};
 $('restart').onclick=()=>{session.reset();done.clear();start();$(fields[0]).focus();};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};start();
})();
