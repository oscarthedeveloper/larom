(() => {
 const $=id=>document.getElementById(id), player=createLaromPlayer();
 let items,session,index=0,solved=false,heard=false,token=0;
 function stop(){token++;player.stop();$('listen').textContent='Lyssna på meningen';}
 function render(focus=false){
  stop();solved=false;heard=false;const item=items[index];
  $('answer').value='';$('answer').disabled=false;$('answer').classList.remove('is-correct');$('answer').setAttribute('aria-invalid','false');$('check').hidden=false;$('next').hidden=true;$('hint').hidden=false;
  $('count').textContent=`Ord ${index+1} av ${items.length}`;$('progressFill').style.width=`${session.completed/items.length*100}%`;
  $('listen').hidden=!!item.use;$('useSentence').hidden=!item.use;
  $('useSentence').textContent=item.use ? item.before+'…'+item.after : '';
  $('listeningTag').textContent=item.use?'Använd ord du har övat':'Spetsa öronen!';
  $('answerLabel').textContent=item.use?'Vilket av orden passar?':'Vilket ord hörde du?';
  $('audioStatus').textContent=item.use?'Välj bland orden soffa, nyckel och vatten. Skriv det som passar i meningen.':'Tryck för att höra meningen och vilket ord du ska skriva.';
  $('feedback').textContent=item.use?'Här använder du orden i nya meningar. Detta är ingen diktamen.':'Lyssna först. Skriv sedan ordet du hör.';
  $('inputNote').textContent=item.use?'Skriv ordet som saknas. Den här omgången har eget resultat.':'Du får lyssna flera gånger utan poängavdrag. Första svaret räknas.';
  if(focus)(item.use?$('answer'):$('listen')).focus();
 }
 $('listen').onclick=()=>{
  if(items[index].use||solved)return;stop();heard=false;const current=token,item=items[index];
  player.play('sv',`${item.sentence} Skriv ${item.word}.`,{
   start:()=>{if(current!==token)return;$('audioStatus').textContent='Lyssna …';$('listen').textContent='Lyssna från början';},
   end:()=>{if(current!==token)return;heard=true;$('audioStatus').textContent='Skriv ordet. Du kan lyssna igen när du vill.';$('listen').textContent='Lyssna igen';},
   error:()=>{if(current!==token)return;heard=false;$('audioStatus').textContent='Ljudet kunde inte spelas. Tryck på Lyssna igen.';$('listen').textContent='Lyssna igen';}
  });
 };
 $('hint').onclick=()=>{if(solved)return;if(!items[index].use&&!heard){$('feedback').textContent='Lyssna på hela meningen först.';return}session.markSupport(index,'hint');$('feedback').textContent=items[index].hint;};
 $('answer').oninput=()=>{if(!solved)$('answer').setAttribute('aria-invalid','false');};
 $('answerForm').onsubmit=e=>{
  e.preventDefault();if(solved)return;const item=items[index];
  if(!item.use&&!heard){$('feedback').textContent='Lyssna på hela meningen först.';return;}
  const answer=$('answer').value.normalize('NFC').trim().toLocaleLowerCase('sv-SE').replace(/[.!?]+$/,'').trim();
  if(!answer){$('feedback').textContent='Skriv ordet innan du kollar svaret.';return;}
  const correct=answer===item.word;session.record(index,correct);$('answer').setAttribute('aria-invalid',String(!correct));
  if(correct){
   solved=true;stop();$('answer').classList.add('is-correct');$('answer').disabled=true;
   $('feedback').textContent=`Rätt! ✓ ${item.use?item.before+item.word+item.after:item.sentence} Ordet stavas ${item.word}.`;
   $('hint').hidden=true;$('check').hidden=true;$('next').hidden=false;$('next').textContent=session.complete?'Visa resultat':'Nästa ord';$('progressFill').style.width=`${session.completed/items.length*100}%`;$('next').focus();
  }else if(session.mistakes(index)>=3){session.markSupport(index,'answer');$('feedback').textContent=`Ordet stavas ${item.word}. Skriv det och prova igen.`;}
  else if(session.mistakes(index)>=2){session.markSupport(index,'hint');$('feedback').textContent=`${item.hint} Ordet börjar på ${item.word[0]} och har ${item.word.length} bokstäver.`;}
  else $('feedback').textContent=item.use?'Inte riktigt. Läs hela meningen och prova igen.':'Inte riktigt. Lyssna igen och prova en gång till.';
 };
 const flow=createRoundFlow({items:globalThis.listeningItems,extras:listeningApplications,noun:'ord',onStart(context){items=context.items;session=context.session;index=0;render(context.focus)}});
 $('next').onclick=()=>{if(!solved)return;stop();if(session.complete)flow.result();else{index=session.nextUnfinished(index);render(true)}};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 globalThis.addEventListener('pagehide',stop);flow.start();
})();
