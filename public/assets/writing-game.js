(() => {
 const $=id=>document.getElementById(id);let items=[],session,position=0,states;
 const normalize=s=>s.replace(/\r\n?/g,'\n').normalize('NFC').trim();
 const accepted=t=>[t.answer,...(t.alternatives||[])].map(normalize);
 function diagnosis(t,answer){
  const target=normalize(t.answer),targetLines=target.split('\n'),lines=answer.split('\n');
  if(lines.length!==targetLines.length)return `Texten ska ha ${targetLines.length===1?'en rad':targetLines.length+' rader'}. ${targetLines.length>1?'Använd Enter för att byta rad.':'Ta bort radbrytningen inne i texten.'}`;
  if(t.focus==='packing'){
   const wanted=['mössa','vatten','frukt'];const n=lines.findIndex((line,i)=>line.toLocaleLowerCase('sv-SE')!==wanted[i]);
   return n<0?'Orden och raderna stämmer. Använd små bokstäver inne i orden; första bokstaven på varje rad får vara stor.':`Titta på rad ${n+1}. Där ska ordet ${wanted[n]} stå, utan punkt eller extra mellanrum.`;
  }
  const plain=s=>s.toLocaleLowerCase('sv-SE').replace(/[.!]/g,'').replace(/\s/g,'');
  if(plain(answer)===plain(target)&&answer.replace(/[^ \t]/g,'').length!==target.replace(/[^ \t]/g,'').length)return 'Kontrollera mellanrummen. Använd ett mellanslag mellan orden, utan extra mellanslag inne i texten.';
  if(t.focus==='invitation'){
   if(!answer.includes('Amir'))return 'Kontrollera mottagarens namn. Inbjudan ska vara till Amir.';
   if(!answer.includes('15'))return 'Kontrollera tiden. Träffen ska börja klockan 15.';
   return 'Namn och tid finns med. Kontrollera att resten är kvar: hälsning, ord, mellanrum och tecken.';
  }
  const notices=[];
  if(/^[A-ZÅÄÖ]/.test(target)&&/^[a-zåäö]/.test(answer))notices.push('Börja med stor bokstav.');
  if(target.endsWith('.')&&!answer.endsWith('.'))notices.push('Avsluta meningen med en punkt.');
  if(notices.length)return notices.join(' ');
  if(answer.toLocaleLowerCase('sv-SE')===target.toLocaleLowerCase('sv-SE'))return 'Orden stämmer. Kontrollera vilka bokstäver som ska vara stora och vilka som ska vara små.';
  return ({word:'Jämför bokstäverna med ordet i uppdraget. Har du med alla och i rätt ordning?',capital:'Jämför namnets bokstäver med uppdraget. Första bokstaven ska vara stor.',space:'Det ska stå hej och du, med ett mellanslag mellan orden.',delete:'Räkna bokstäverna: ordet ska ha fyra bokstäver. Bara det extra t:et ska bort.', 'replace-letter':'Byt första bokstaven till h. Behåll u och s.',insert:'Kontrollera att röd står mellan en och bil, med ett mellanslag på varje sida.',period:'Behåll meningen och sätt bara en punkt i slutet.',lines:'Kontrollera orden: Hej på första raden och Anna på nästa.', 'replace-word':'Byt bara hund mot katt. Resten av meningen ska stå kvar.',sentence:'Behåll samma ord och ordning. Kontrollera stor bokstav, mellanrum och punkt.'})[t.focus]||'Läs uppdraget igen och jämför med din text.';
 }
 function render(focus=false){
  const t=items[position],s=states[position];$('count').textContent=`Uppgift ${position+1} av ${items.length}`;$('exerciseSelect').value=String(position);$('progressFill').style.width=`${session.completed/items.length*100}%`;$('topic').textContent=t.title;$('instruction').textContent=t.instruction;
  $('hint').textContent=t.hint;$('hint').hidden=!s.hint;$('showHint').hidden=s.done;$('showHint').setAttribute('aria-expanded',String(s.hint));
  // Only replace the textarea on navigation/reset, never during typing or failed checks.
  $('editor').value=s.text;$('editor').disabled=s.done;$('editor').setAttribute('aria-invalid','false');$('editor').classList.toggle('is-correct',s.done);$('resetText').disabled=s.done;$('check').hidden=s.done;$('next').hidden=!s.done;$('next').textContent=session.complete?'Visa resultat':'Nästa uppgift';$('feedback').textContent=s.done?'Rätt! '+t.explanation:'Skriv eller ändra texten och tryck på Kolla texten.';if(focus)$('editor').focus();
 }
 $('editor').oninput=()=>{if(states[position].done)return;states[position].text=$('editor').value;$('editor').setAttribute('aria-invalid','false');};
 $('showHint').onclick=()=>{if(states[position].done)return;session.markSupport(position);states[position].hint=true;$('hint').hidden=false;$('showHint').setAttribute('aria-expanded','true');$('feedback').textContent='Tips: '+items[position].hint;};
 $('answerForm').onsubmit=e=>{
  e.preventDefault();const t=items[position],s=states[position];if(s.done)return;s.text=$('editor').value;const answer=normalize(s.text);
  if(!answer||answer===normalize(t.initial)){$('feedback').textContent='Skriv eller ändra texten först. Läs uppdraget till vänster.';return;}
  const correct=accepted(t).includes(answer);session.record(position,correct);
  if(correct){s.done=true;render();$('next').focus();}
  else {$('editor').setAttribute('aria-invalid','true');const reveal=session.mistakes(position)>=2;session.markSupport(position,reveal?'answer':'hint');$('feedback').textContent=reveal?'Så kan texten se ut:\n'+t.answer:diagnosis(t,answer);}
 };
 $('resetText').onclick=()=>{if(states[position].done)return;states[position].text=items[position].initial;render(true);};
 const flow=createRoundFlow({items:globalThis.writingTasks,extras:globalThis.writingApplications,noun:'uppgifter',onStart:round=>{
  items=round.items;session=round.session;position=0;states=items.map(t=>({text:t.initial,done:false,hint:false}));$('exerciseSelect').replaceChildren();items.forEach((t,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`${i+1}. ${t.title}`;$('exerciseSelect').append(o);});render(round.focus);
 }});
 $('exerciseSelect').onchange=()=>{const n=Number($('exerciseSelect').value);if(Number.isInteger(n)&&n>=0&&n<items.length){position=n;render();}};
 $('next').onclick=()=>{if(!states[position].done)return;if(session.complete){flow.result();return;}do{position=(position+1)%items.length;}while(states[position].done);render(true);};
 $('motion').onclick=()=>{const p=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(p));$('motion').textContent=p?'Starta rörelser':'Pausa rörelser';};
 flow.start(undefined,'10 skrivuppgifter · första omgången');
})();
