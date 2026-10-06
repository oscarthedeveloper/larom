(() => {
 const $=id=>document.getElementById(id),flagMode=document.body.dataset.quiz==='flag';
 const countries=globalThis.quizCountries,session=createPracticeSession(countries.length,'uppgifter');
 let order=[],index=0,solved=false;
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('sv-SE').replace(/[\s.,!?\-’']/g,'');
 function current(){return countries[order[index]];}
 function answer(){return flagMode?current().country:current().capital;}
 function shuffle(){order=countries.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}}
 function render(){
  solved=false;const item=current();$('count').textContent=`Land ${index+1} av ${countries.length}`;
  $('progressFill').style.width=`${session.completed/countries.length*100}%`;
  $('flag').src=`../assets/flags/${item.code}.svg`;$('flag').alt=flagMode?item.description:`${item.country}s flagga`;
  $('flag').className=item.code==='ch'?'square-flag':'';
  $('sceneTag').textContent=flagMode?'Vilket land tillhör flaggan?':'Vilken är huvudstaden?';
  $('countryPrompt').textContent=flagMode?'Titta noga på flaggan':item.country;
  $('clue').textContent=flagMode?'Skriv landets namn till höger.':'Skriv stadens namn till höger.';
  $('answer').value='';$('answer').disabled=false;$('answer').classList.remove('is-correct');$('answer').setAttribute('aria-invalid','false');
  $('check').hidden=false;$('next').hidden=true;$('hint').hidden=false;$('reveal').hidden=false;
  $('feedback').textContent='Ingen brådska. Du får alltid prova igen.';
 }
 function hint(){const word=answer();$('clue').textContent=`${flagMode?'Landet':'Huvudstaden'} börjar på ${word[0]}. ${flagMode?'Landet ligger i '+current().region+'.':''}`;}
 function reveal(){if(solved)return;session.record(order[index],false);$('feedback').textContent=`Svaret är ${answer()}. Skriv det i rutan och tryck på Kolla svaret.`;$('answer').focus();}
 $('answer').oninput=()=>{if(!solved)$('answer').setAttribute('aria-invalid','false');};
 $('answerForm').onsubmit=event=>{
  event.preventDefault();if(solved)return;
  const value=normalize($('answer').value);if(!value){$('feedback').textContent='Skriv ett svar först, eller välj Visa svaret.';return;}
  const item=current(),accepted=[answer(),...(flagMode?item.countryAliases:item.capitalAliases)];
  const correct=accepted.some(a=>normalize(a)===value);session.record(order[index],correct);$('answer').setAttribute('aria-invalid',String(!correct));
  if(correct){
   solved=true;$('answer').classList.add('is-correct');$('answer').disabled=true;
   $('countryPrompt').textContent=item.country;$('flag').alt=`${item.country}s flagga`;
   $('clue').textContent=`Huvudstad: ${item.capital}.`;
   $('feedback').textContent=`Rätt! ${item.country} – ${item.capital}. ${item.note}`;
   $('check').hidden=true;$('hint').hidden=true;$('reveal').hidden=true;$('next').hidden=false;
   $('next').textContent=session.complete?'Visa resultat':'Nästa land';$('progressFill').style.width=`${session.completed/countries.length*100}%`;$('next').focus();
  }else{
   const errors=session.mistakes(order[index]);
   $('feedback').textContent=errors>=3?`Svaret är ${answer()}. Skriv det och prova igen.`:'Inte riktigt. Prova igen eller be om en ledtråd.';
   if(errors>=2)hint();
  }
 };
 $('hint').onclick=hint;$('reveal').onclick=reveal;
 $('next').onclick=()=>{if(!solved)return;if(session.complete)session.showResult();else{index++;render();$('answer').focus();}};
 $('restart').onclick=()=>{session.reset();shuffle();index=0;render();$('answer').focus();};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 $('flag').onerror=()=>{$('clue').textContent='Flaggbilden kunde inte laddas. Prova att ladda om sidan.';};
 shuffle();render();
})();
