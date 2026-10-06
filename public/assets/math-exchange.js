(() => {
  const $=id=>document.getElementById(id);
  const baseTasks=[...[[13,18],[27,15],[36,28],[45,17],[58,24],[19,26],[64,18],[37,23]].map(([a,b])=>({a,b,op:'+'})),...[[32,17],[41,26],[53,28],[64,39],[72,46],[85,57],[90,34],[61,19]].map(([a,b])=>({a,b,op:'−'}))];
  baseTasks.forEach(t=>{t.id=`exchange-${t.op==='+'?'add':'subtract'}-${t.a}-${t.b}`});
  const extras=[
    {id:'exchange-use-pencils',a:17,b:15,op:'+',context:'En burk har 17 pennor och en annan har 15. Hur många pennor finns det tillsammans?'},
    {id:'exchange-use-stickers',a:42,b:16,op:'−',context:'Av 42 klistermärken delar ni ut 16. Hur många finns kvar?'},
    {id:'exchange-use-repair',a:26,b:18,op:'+',context:'Sam skrev 34 som svar på 26 + 18. Entalen stämmer, men ett överfört tiotal saknas. Fyll i hela tabellen rätt.'}
  ];
  let tasks,session,states,order,position;
  const ids=['carry','tens','ones'];
  const task=()=>tasks[order[position]],state=()=>states[order[position]],sum=t=>t.op==='+'?t.a+t.b:t.a-t.b;
  function expected(t){return {carry:t.op==='+'?Math.floor((t.a%10+t.b%10)/10):Math.floor(t.a/10)-1,tens:Math.floor(sum(t)/10),ones:sum(t)%10}}
  function explain(t){return t.op==='+'?`${t.a%10} + ${t.b%10} = ${t.a%10+t.b%10}. Tio ental blir 1 tiotal i den lilla rutan. ${sum(t)%10} ental blir kvar. Tiotalen: ${Math.floor(t.a/10)} + ${Math.floor(t.b/10)} + 1 = ${Math.floor(sum(t)/10)}. Svaret är ${sum(t)}.`:`Växla ett tiotal: ${t.a} blir ${Math.floor(t.a/10)-1} tiotal och ${t.a%10+10} ental. Den lilla rutan visar ${Math.floor(t.a/10)-1}. Entalen: ${t.a%10+10} − ${t.b%10} = ${sum(t)%10}. Tiotalen: ${Math.floor(t.a/10)-1} − ${Math.floor(t.b/10)} = ${Math.floor(sum(t)/10)}. Svaret är ${sum(t)}.`}
  function names(t){return {carry:t.op==='+'?'Lilla rutan över tiotalen (överfört tiotal)':'Lilla rutan över tiotalen (tiotal kvar efter växling)',tens:'Svaret i tiotalskolumnen',ones:'Svaret i entalskolumnen'}}
  function hint(t,id){
    if(id==='carry')return t.op==='+'?'Tio av entalen blir ett nytt tiotal. Skriv det överförda tiotalet i den lilla rutan.':'Ett tiotal växlas till tio ental. Hur många tiotal av det första talet finns då kvar?';
    if(id==='ones')return t.op==='+'?`Lägg ihop ${t.a%10} och ${t.b%10}. Skriv bara entalssiffran i svaret.`:`Efter växling finns ${t.a%10+10} ental. Ta bort ${t.b%10}.`;
    return t.op==='+'?'Lägg ihop talens tiotal och det överförda tiotalet.':'Använd antalet tiotal som finns kvar efter växlingen. Ta sedan bort det andra talets tiotal.';
  }
  function render(focus=false){
    const t=task(),s=state(),add=t.op==='+';
    $('problem').textContent=`${t.a} ${t.op} ${t.b} = ${s.done?sum(t):'?'}`;$('operationTag').textContent=add?'Addition med växling':'Subtraktion med växling';
    $('taskContext').hidden=!t.context;$('taskContext').textContent=t.context||'';
    $('count').textContent=`Uppgift ${position+1} av ${tasks.length} · ${session.completed} klara`;$('exerciseSelect').value=String(position);$('progressFill').style.width=`${session.completed/tasks.length*100}%`;
    for(const [id,n] of [['aTens',Math.floor(t.a/10)],['aOnes',t.a%10],['bTens',Math.floor(t.b/10)],['bOnes',t.b%10]])$(id).textContent=String(n);$('operator').textContent=t.op;
    $('carryLabel').textContent=add?'Överfört tiotal':'Antal tiotal efter växling';
    for(const id of ids){$(id).value=s.values[id];$(id).disabled=s.done;$(id).setAttribute('aria-invalid','false');$(id).classList.toggle('is-correct',s.done);}
    $('columnExplain').textContent=add?'Lilla rutan: tiotalet som förs över. Nedersta raden: svarets tiotal och ental. Du väljer ordningen själv.':'Lilla rutan: antalet tiotal som finns kvar i det första talet efter växling. Nedersta raden: svaret. Du väljer ordningen själv.';
    $('hint').hidden=s.done;$('check').hidden=s.done;$('next').hidden=!s.done;$('next').textContent=session.complete?'Visa resultat':'Nästa uppgift';
    $('feedback').textContent=s.done?'Rätt! ✓ '+explain(t):'Fyll i alla tre svarsrutor och tryck på Kolla svaret.';
    if(focus)(s.done?$('next'):$('ones')).focus();
  }
  for(const id of ids)$(id).oninput=()=>{if(state().done)return;state().values[id]=$(id).value;$(id).setAttribute('aria-invalid','false');$(id).classList.remove('is-correct');};
  $('hint').onclick=()=>{if(state().done)return;session.markSupport(order[position],'hint');$('feedback').textContent=hint(task(),'carry');};
  $('answerForm').onsubmit=e=>{
    e.preventDefault();const t=task(),s=state();if(s.done)return;
    for(const id of ids)s.values[id]=$(id).value;
    const invalid=ids.find(id=>!/^\d$/.test(s.values[id].trim()));
    if(invalid){$('feedback').textContent=names(t)[invalid]+': fyll i en siffra från 0 till 9.';$(invalid).focus();return;}
    const answers=expected(t),wrong=ids.filter(id=>Number(s.values[id])!==answers[id]);session.record(order[position],wrong.length===0);
    for(const id of ids){const right=!wrong.includes(id);$(id).setAttribute('aria-invalid',String(!right));$(id).classList.toggle('is-correct',right)}
    if(!wrong.length){s.done=true;render(true)}else{
      session.markSupport(order[position],'hint');
      const feedback=wrong.map(id=>names(t)[id]+': '+hint(t,id)).join('\n');
      if(session.mistakes(order[position])>=2){session.markSupport(order[position],'answer');$('feedback').textContent='Vi tar hjälp: '+explain(t)+'\nKontrollera: '+wrong.map(id=>names(t)[id]).join(', ')+'.';}
      else $('feedback').textContent='Kontrollera dessa rutor:\n'+feedback;
      $(wrong[0]).focus();
    }
  };
  const flow=createRoundFlow({items:baseTasks,extras,noun:'uppgifter',onStart(context){
    tasks=context.items;session=context.session;states=tasks.map(()=>({done:false,values:{carry:'',tens:'',ones:''}}));order=tasks.map((_,i)=>i);
    for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
    position=0;$('exerciseSelect').replaceChildren();order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Uppgift ${i+1}`;$('exerciseSelect').append(o)});render(context.focus);
  }});
  $('next').onclick=()=>{if(!state().done)return;if(session.complete){flow.result();return}do{position=(position+1)%tasks.length}while(state().done);render(true)};
  $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<tasks.length){position=n;render(true)}};
  $('motion').onclick=()=>{const p=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(p));$('motion').textContent=p?'Starta rörelser':'Pausa rörelser'};
  flow.start();
})();
