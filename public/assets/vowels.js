const $ = id => document.getElementById(id);
const vowelApplications = [
  {id:'vowel-use-glas',pair:['glas','glass'],answer:'glas',before:'Vattnet står i ett ',after:' på bordet.',hint:'Tänk på vad du kan hälla vatten i.'},
  {id:'vowel-use-tack',pair:['tak','tack'],answer:'tack',before:'På kortet skriver jag: Stort ',after:' för hjälpen!',hint:'Du vill visa att du är glad för hjälpen.'},
  {id:'vowel-use-lacka',pair:['läka','läcka'],answer:'läcka',before:'Röret har ett hål och börjar ',after:' vatten.',hint:'Vatten kommer ut där det inte ska.'}
];
let rounds = vowelItems, session, index = 0, solved = false;
const flow = createRoundFlow({items:vowelItems, extras:vowelApplications, noun:'ord', onStart(context) {
  rounds=context.items;session=context.session;index=0;
  $('pairSelect').replaceChildren();
  const seen=new Set();rounds.forEach((r,i)=>{const key=r.pair.join('/');if(seen.has(key))return;seen.add(key);const o=document.createElement('option');o.value=String(i);o.textContent=r.pair.join(' / ');$('pairSelect').append(o)});
  render(context.focus);
}});
function showScene(word){const s=scenes[word],el=$('scene');el.dataset.kind=word;el.dataset.motion=s.motion||'';el.setAttribute('aria-label',s.alt);el.querySelector('.actor').textContent=s.actor;el.querySelector('.object').textContent=s.object;el.querySelector('.spark').textContent=s.spark;el.getAnimations({subtree:true}).forEach(a=>{a.currentTime=0});}
function wordMarkup(word){const i=word.search(/[aeiouyåäö]/);return word.slice(0,i)+'<span class="vowel">'+word[i]+'</span>'+word.slice(i+1);}
function vowelExplanation(r){const word=r.answer,i=word.search(/[aeiouyåäö]/),v=word[i],c=word[i+1];return word===r.pair[0]?`Här har ${word} ett långt ${v} och ett ${c} efter vokalen.`:word.slice(i+1,i+3)==='ck'?`Här har ${word} ett kort ${v}. K-ljudet stavas ck här.`:`Här har ${word} ett kort ${v} och två ${c} efter vokalen.`;}
function render(focus=false){
  const r=rounds[index];solved=session.isDone(index);
  $('count').textContent=`Ord ${index+1} av ${rounds.length} · ${session.completed} klara`;
  $('progressFill').style.width=`${session.completed/rounds.length*100}%`;
  $('pairSelect').value=String(rounds.findIndex(item=>item.pair.join('/')===r.pair.join('/')));
  $('sentence').innerHTML=r.before+'<span class="blank">'+(solved?r.answer:'…')+'</span>'+r.after;
  $('sceneHint').textContent=solved?scenes[r.answer].meaning:'Titta på bilden och läs hela meningen.';showScene(r.answer);
  $('choices').replaceChildren();
  (Math.random()<.5?[...r.pair].reverse():[...r.pair]).forEach(word=>{const b=document.createElement('button');b.type='button';b.className='choice';b.innerHTML='<span class="word">'+wordMarkup(word)+'</span><span class="choice-note">'+(solved&&word===r.answer?'Rätt ord ✓':'Välj ordet')+'</span>';b.setAttribute('aria-label',word);b.disabled=solved;if(solved&&word===r.answer)b.classList.add('correct');b.onclick=()=>choose(word,b);$('choices').append(b)});
  $('feedback').className='feedback'+(solved?'':' idle');
  $('feedback').textContent=solved?'Rätt! '+vowelExplanation(r):'Välj ett ord. Första försöket räknas i resultatet.';
  $('hint').hidden=solved;$('next').disabled=!solved;$('next').textContent=session.complete?'Visa resultat':'Nästa ord';
  const v=r.pair[0].match(/[aeiouyåäö]/)[0];$('longTip').innerHTML=`Säg ${wordMarkup(r.pair[0])}. Dra lite på ${v}.`;$('shortTip').innerHTML=`Säg ${wordMarkup(r.pair[1])}. Ett kort ${v}!`;
  if(focus)(solved?$('next'):$('choices').firstElementChild).focus();
}
function choose(word,button){
  if(solved)return;
  const r=rounds[index];session.record(index,word===r.answer);showScene(word);
  document.querySelectorAll('.choice').forEach(b=>b.classList.remove('try','correct'));
  $('feedback').className='feedback';
  if(word===r.answer){
    solved=true;button.classList.add('correct');$('sentence').innerHTML=r.before+'<span class="blank">'+word+'</span>'+r.after;
    $('sceneHint').textContent=scenes[word].meaning;
    $('feedback').innerHTML='<strong>Rätt! ✓</strong>'+vowelExplanation(r);
    document.querySelectorAll('.choice').forEach(b=>{b.disabled=true});
    $('hint').hidden=true;$('next').disabled=false;$('next').textContent=session.complete?'Visa resultat':'Nästa ord';
    $('progressFill').style.width=`${session.completed/rounds.length*100}%`;
    $('count').textContent=`Ord ${index+1} av ${rounds.length} · ${session.completed} klara`;
    $('next').focus();
  }else{
    button.classList.add('try');$('sceneHint').textContent=scenes[word].meaning;
    $('feedback').innerHTML='<strong>Inte i den här meningen.</strong>'+scenes[word].meaning+' Läs meningen igen: '+r.hint;
    session.markSupport(index,'hint');
  }
}
$('hint').onclick=()=>{if(solved)return;session.markSupport(index,'hint');$('feedback').textContent=rounds[index].hint;};
$('next').onclick=()=>{if(!solved)return;if(session.complete){flow.result();return}index=session.nextUnfinished(index);render(true)};
$('pairSelect').onchange=()=>{const n=Number($('pairSelect').value);if(Number.isInteger(n)&&n>=0&&n<rounds.length){index=n;render(true)}};
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;}
$('startShort').onclick=()=>{
  // Four long and four short vowels; four k/ck pairs and four other distinct pairs.
  const pairs=vowelItems.filter((_,i)=>i%2===0),ck=pairs.filter(r=>r.pair[1].includes('ck')),other=pairs.filter(r=>!r.pair[1].includes('ck'));
  const chosen=[...shuffle(ck).slice(0,4),...shuffle(other).slice(0,4)];
  const selected=shuffle(chosen.map((r,i)=>vowelItems.find(item=>item.answer===r.pair[i%2])));
  flow.start(selected,'Kortpass · 8 ord');document.querySelector('.round-menu').open=false;render(true);
};
$('startFull').onclick=()=>{flow.start(vowelItems,'Alla 50 ord');document.querySelector('.round-menu').open=false;render(true)};
$('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser'};
flow.start();
