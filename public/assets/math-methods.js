(() => {
 const $=id=>document.getElementById(id),bridge=document.body.dataset.method==='bridge';
 const plus=bridge?[[8,5],[9,4],[7,6],[6,7],[8,6],[9,8],[7,5],[6,6]]:[[23,14],[32,25],[41,18],[52,16],[24,35],[60,27],[43,26],[31,42]];
 const minus=bridge?[[13,5],[14,6],[12,7],[15,8],[16,9],[11,4],[17,8],[14,9]]:[[38,15],[57,24],[69,36],[48,27],[76,34],[95,52],[64,40],[88,18]];
 const tasks=[...plus.map(([a,b])=>({a,b,op:'+'})),...minus.map(([a,b])=>({a,b,op:'−'}))];
 const session=createPracticeSession(tasks.length,'uppgifter');let order=[],position=0;let states=[];
 const totalSteps=bridge?3:2;
 function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function task(){return tasks[order[position]]}function state(){return states[order[position]]}function result(t){return t.op==='+'?t.a+t.b:t.a-t.b}
 function answers(t){if(bridge){const first=t.op==='+'?10-t.a:t.a-10;return[first,t.b-first,result(t)]}return[result(t)%10,Math.floor(result(t)/10)]}
 function field(){return bridge?'answer':state().step===0?'ones':'tens'}
 function numeric(){const s=$(field()).value.trim();return /^\d{1,2}$/.test(s)?Number(s):null}
 function line(t,s){const vals=answers(t),end=s.step===3?result(t):10;let svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 130" aria-hidden="true"><path d="M25 92H575" stroke="#7c89aa" stroke-width="3"/>';
  const x=n=>25+n*27.5;
  for(let n=0;n<=20;n++){svg+=`<path d="M${x(n)} 86V98" stroke="#7c89aa"/>`;if(n%5===0||n===t.a||s.step===3&&n===end)svg+=`<text x="${x(n)}" y="120" text-anchor="middle" font-size="19" fill="#172752">${n}</text>`}
  svg+=`<circle cx="${x(t.a)}" cy="92" r="6" fill="#2d46d8"/>`;
  if(s.step>=1)svg+=`<path class="number-hop" d="M${x(t.a)} 85Q${(x(t.a)+x(10))/2} 10 ${x(10)} 85" fill="none" stroke="#2d46d8" stroke-width="4"/><circle cx="${x(10)}" cy="85" r="5" fill="#2d46d8"/><text x="${(x(t.a)+x(10))/2}" y="32" text-anchor="middle" font-size="21" fill="#2d46d8">${t.op}${vals[0]}</text>`;
  if(s.step===3)svg+=`<path class="number-hop" d="M${x(10)} 85Q${(x(10)+x(end))/2} 0 ${x(end)} 85" fill="none" stroke="#28794e" stroke-width="4"/><circle cx="${x(end)}" cy="85" r="5" fill="#28794e"/><text x="${(x(10)+x(end))/2}" y="22" text-anchor="middle" font-size="21" fill="#28794e">${t.op}${vals[1]}</text>`;
  $('numberLine').innerHTML=svg+'</svg>';$('numberLine').setAttribute('aria-label',s.step===3?`${t.a} ${t.op} ${vals[0]} = 10. Sedan 10 ${t.op} ${vals[1]} = ${end}.`:`Tallinje från 0 till 20. Börja vid ${t.a} och räkna till 10.`);
 }
 function hint(t,s){const v=answers(t);if(bridge)return [`${t.a} ${t.op} ${v[0]} = 10.`,`${t.b} − ${v[0]} = ${v[1]}. Du delar ${t.b} i ${v[0]} och ${v[1]}.`,`10 ${t.op} ${v[1]} = ${v[2]}.`][s.step];return s.step===0?`${t.a%10} ${t.op} ${t.b%10} = ${v[0]} ental.`:`${Math.floor(t.a/10)} ${t.op} ${Math.floor(t.b/10)} = ${v[1]} tiotal.`;}
 function prompt(t,s){const v=answers(t);if(bridge)return [t.op==='+'?`Hur mycket ska du lägga till ${t.a} för att nå 10?`:`Hur mycket ska du ta bort från ${t.a} för att nå 10?`,`Du har använt ${v[0]} av ${t.b}. Hur mycket är kvar?`,`Nu räknar du 10 ${t.op} ${v[1]}. Vad blir det?`][s.step]||'Alla steg klara!';return s.step===0?`Entalen först: ${t.a%10} ${t.op} ${t.b%10} = ?`:s.step===1?`Nu tiotalen: ${Math.floor(t.a/10)} ${t.op} ${Math.floor(t.b/10)} = ?`:'Alla steg klara!'}
 function render(focus=false){const t=task(),s=state(),v=answers(t),done=s.step===totalSteps;
  $('count').textContent=`Uppgift ${position+1} av ${tasks.length}`;$('exerciseSelect').value=String(position);$('progressFill').style.width=`${session.completed/tasks.length*100}%`;
  $('problem').textContent=`${t.a} ${t.op} ${t.b} = ${done?result(t):'?'}`;$('operationTag').textContent=t.op==='+'?'Addition':'Subtraktion';$('stepCount').textContent=done?'Färdig!':`Steg ${s.step+1} av ${totalSteps}`;$('stepPrompt').textContent=prompt(t,s);
  if(bridge){$('answer').value=done?String(result(t)):'';$('answer').disabled=done;$('answer').classList.toggle('is-correct',done);$('answer').setAttribute('aria-invalid','false');
   $('split').textContent=`${t.b} = ${s.step>=1?v[0]:'?'} + ${s.step>=2?v[1]:'?'}`;
   const descriptions=[`${t.a} ${t.op} ${s.step>=1?v[0]:'?'} = 10`,`${t.b} − ${s.step>=1?v[0]:'?'} = ${s.step>=2?v[1]:'?'}`,`10 ${t.op} ${s.step>=2?v[1]:'?'} = ${done?result(t):'?'}`];
   descriptions.forEach((text,i)=>{$('step'+i).textContent=text;$('step'+i).classList.toggle('step-done',i<s.step);$('step'+i).classList.toggle('step-active',i===s.step)});line(t,s);
  }else{
   for(const [id,n] of [['aTens',Math.floor(t.a/10)],['aOnes',t.a%10],['bTens',Math.floor(t.b/10)],['bOnes',t.b%10]])$(id).textContent=String(n);$('operator').textContent=t.op;
   ['ones','tens'].forEach((id,i)=>{$(id).value=s.step>i?String(v[i]):'';$(id).disabled=s.step!==i;$(id).setAttribute('aria-invalid','false');$(id).classList.toggle('is-correct',s.step>i);$(id+'Cell').classList.toggle('active-column',s.step===i)});
   $('columnExplain').textContent=done?`${v[1]} tiotal och ${v[0]} ental är ${result(t)}.`:s.step===0?'Börja i den blå entalskolumnen till höger.':'Entalen är klara. Fortsätt i den röda tiotalskolumnen.';
  }
  $('check').hidden=done;$('next').hidden=!done;$('next').textContent=session.complete?'Visa resultat':'Nästa uppgift';$('feedback').textContent=done?`Rätt! ${t.a} ${t.op} ${t.b} = ${result(t)}.`:'Du får alltid prova igen.';
  if(focus)(done?$('next'):$(field())).focus();
 }
 $('answerForm').onsubmit=e=>{e.preventDefault();const t=task(),s=state();if(s.step===totalSteps)return;const n=numeric();if(n===null||n>(bridge?20:9)){$('feedback').textContent=bridge?'Skriv ett helt tal från 0 till 20.':'Skriv en siffra från 0 till 9 i den aktiva rutan.';$(field()).focus();return;}
  const expected=answers(t)[s.step];if(n!==expected){session.record(order[position],false);s.errors[s.step]++;$(field()).setAttribute('aria-invalid','true');$('feedback').textContent=s.errors[s.step]>=2?`Vi tar hjälp: ${hint(t,s)} Skriv ${expected} i rutan.`:'Inte riktigt. Räkna en gång till och prova igen.';return;}
  s.step++;if(s.step===totalSteps)session.record(order[position],true);render(true);if(s.step<totalSteps)$('feedback').textContent='Rätt på steget! Fortsätt med nästa.';
 };
 for(const id of bridge?['answer']:['ones','tens'])$(id).oninput=()=>{if(state().step===totalSteps)return;$(id).setAttribute('aria-invalid','false');$('feedback').textContent='Tryck på Kolla steget när du är klar.'};
 function start(){states=tasks.map(()=>({step:0,errors:Array(totalSteps).fill(0)}));order=shuffle(tasks.map((_,i)=>i));position=0;$('exerciseSelect').replaceChildren();order.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Uppgift ${i+1}`;$('exerciseSelect').append(o)});render();}
 $('next').onclick=()=>{if(state().step!==totalSteps)return;if(session.complete){session.showResult();return;}do{position=(position+1)%tasks.length}while(state().step===totalSteps);render(true)};
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<tasks.length){position=n;render(true)}};
 $('restart').onclick=()=>{session.reset();start();$(field()).focus()};$('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser'};start();
})();
