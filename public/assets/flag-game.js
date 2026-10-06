(() => {
 const $=id=>document.getElementById(id),countries=globalThis.quizCountries;
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('sv-SE').replace(/[\s.,!?\-’']/g,'');
 const shuffle=values=>{const a=[...values];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 let items=[],session,index=0,solved=false;
 const task=()=>items[index],country=()=>countries.find(c=>c.code===task().code),answer=()=>task().answer||country().country;
 function render(focus=false){
  solved=false;const item=country(),extra=!!task().answer;
  $('count').textContent=`Uppgift ${index+1} av ${items.length}`;$('progressFill').style.width=`${session.completed/items.length*100}%`;
  $('flag').src=`../assets/flags/${item.code}.svg`;$('flag').alt=extra?`${item.country}s flagga`:item.description;$('flag').className=item.code==='ch'?'square-flag':'';
  $('sceneTag').textContent=extra?'Från flagga till plats':'Vilket land tillhör flaggan?';
  $('countryPrompt').textContent=extra?task().question:'Titta noga på flaggan';
  $('answerLabel').textContent=extra?'Vilket område?':'Vilket land?';$('answer').placeholder=extra?'Skriv området här':'Skriv landet här';
  $('clue').textContent=extra?'Använd det du har lärt dig om landet.':'Skriv landets namn i rutan.';
  $('answer').value='';$('answer').disabled=false;$('answer').classList.remove('is-correct');$('answer').setAttribute('aria-invalid','false');
  $('check').hidden=false;$('next').hidden=true;$('hint').hidden=false;$('reveal').hidden=false;$('mapLink').hidden=true;
  $('feedback').textContent='Ingen brådska. Du får alltid prova igen.';if(focus)$('answer').focus();
 }
 function hint(){if(solved)return;session.markSupport(index);$('clue').textContent=task().hint||`Landet börjar på ${answer()[0]}. Landet ligger i ${country().region}.`;}
 function reveal(){if(solved)return;session.markSupport(index,'answer');session.record(index,false);$('feedback').textContent=`Svaret är ${answer()}. Skriv det i rutan och tryck på Kolla svaret.`;$('answer').focus();}
 $('answer').oninput=()=>{if(!solved)$('answer').setAttribute('aria-invalid','false');};
 $('answerForm').onsubmit=event=>{
  event.preventDefault();if(solved)return;
  const value=normalize($('answer').value);if(!value){$('feedback').textContent='Skriv ett svar först, eller välj Visa svaret.';return;}
  const item=country(),extra=!!task().answer,accepted=extra?[answer()]:[item.country,...item.countryAliases,...(globalThis.flagSpellings[item.code]||[])];
  const correct=accepted.some(a=>normalize(a)===value);session.record(index,correct);$('answer').setAttribute('aria-invalid',String(!correct));
  if(correct){
   solved=true;$('answer').classList.add('is-correct');$('answer').disabled=true;$('flag').alt=`${item.country}s flagga`;
   if(!extra)$('countryPrompt').textContent=item.country;
   $('clue').textContent=extra?`Svar: ${answer()}.`:`${item.region} · Huvudstad: ${item.capital}.`;
   const spelling=!extra&&!( [item.country,...item.countryAliases].some(a=>normalize(a)===value));
   $('feedback').textContent=extra?'Rätt! '+task().explanation:`Rätt land! ${spelling?'Namnet stavas '+item.country+'. ':''}${item.country} ligger i ${item.region}. Huvudstaden är ${item.capital}. ${item.note}`;
   $('check').hidden=true;$('hint').hidden=true;$('reveal').hidden=true;$('next').hidden=false;$('mapLink').hidden=false;
   $('next').textContent=session.complete?'Visa resultat':'Nästa uppgift';$('progressFill').style.width=`${session.completed/items.length*100}%`;$('next').focus();
  }else{
   const errors=session.mistakes(index);
   if(errors>=3){session.markSupport(index,'answer');$('feedback').textContent=`Svaret är ${answer()}. Skriv det och prova igen.`;}
   else if(!extra&&item.code==='gb'&&value==='england'){$('feedback').textContent='England är en del av landet. Den här flaggan representerar hela Förenade kungariket, som vi också kallar Storbritannien.';session.markSupport(index,'answer');}
   else if(!extra&&item.code==='nl'&&value==='holland'){$('feedback').textContent='Holland är en del av Nederländerna. Skriv hela landets namn: Nederländerna.';session.markSupport(index,'answer');}
   else $('feedback').textContent=extra?'Fundera på området där landet ligger. Prova igen.':`Titta på färgerna och formerna: ${item.description} Prova igen.`;
   if(errors>=2)hint();
  }
 };
 $('hint').onclick=hint;$('reveal').onclick=reveal;
 $('next').onclick=()=>{if(!solved)return;if(session.complete)flow.result();else{index++;render(true);}};
 $('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
 $('flag').onerror=()=>{$('clue').textContent='Flaggbilden kunde inte laddas. Prova att ladda om sidan.';};
 const flow=createRoundFlow({items:countries,extras:globalThis.flagApplications,noun:'uppgifter',onStart:round=>{items=round.items;session=round.session;index=0;render(round.focus);}});
 // Keep session indices aligned with flow's item list, including shuffled review rounds.
 flow.start(shuffle(countries),'30 flaggor · första omgången');
})();
