const sessions = levels.map(level => createPracticeSession(level.sentences.length, 'meningar', {detail:true}));
let currentLevel = 0, sentences = levels[0].sentences, session = sessions[0];
const $ = id => document.getElementById(id);
let index = 0, selected = [], bankOrder = [], solved = false, mode = 'primary';
function shuffleWords(words) {
  const order = words.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (order.every((id, i) => words[id] === words[i])) order.push(order.shift());
  return order;
}
function feedback(title, message) {
  $('feedback').replaceChildren();
  $('feedback').className = title ? 'feedback' : 'feedback idle';
  if (title) { const label = document.createElement('strong'); label.textContent = title; $('feedback').append(label); }
  $('feedback').append(document.createTextNode(message));
}
function sentenceText(order = selected) {
  return [sentences[index].start, ...order.map(id => sentences[index].words[id])].filter(Boolean).join(' ') + '.';
}
function drawTiles(focusId) {
  const item = sentences[index];
  $('selectedWords').replaceChildren();
  $('wordBank').replaceChildren();
  function tile(id, placed) {
    const b = document.createElement('button');
    b.type = 'button'; b.id = `tile-${id}`; b.className = 'word-tile';
    b.textContent = item.words[id]; b.disabled = solved;
    b.setAttribute('aria-label', placed ? `Lägg tillbaka ${item.words[id]}` : `Lägg till ${item.words[id]}`);
    b.onclick = () => placed ? removeWord(id) : addWord(id);
    return b;
  }
  selected.forEach(id => $('selectedWords').append(tile(id, true)));
  bankOrder.filter(id => !selected.includes(id)).forEach(id => $('wordBank').append(tile(id, false)));
  $('emptyPrompt').hidden = selected.length > 0;
  $('clearWords').disabled = solved || selected.length === 0;
  $('buildStatus').textContent = solved ? sentenceText() : `${selected.length} av ${item.words.length} ord på plats.`;
  if (focusId !== undefined) {
    const next = document.getElementById(`tile-${focusId}`);
    if (next) next.focus(); else $('check').focus();
  }
}
function addWord(id) {
  if (solved || !bankOrder.includes(id) || selected.includes(id)) return;
  selected.push(id);
  feedback('', 'Bygg färdigt och tryck på Kolla meningen.');
  drawTiles(bankOrder.find(candidate => !selected.includes(candidate)) ?? -1);
}
function removeWord(id) {
  if (solved || !selected.includes(id)) return;
  selected = selected.filter(candidate => candidate !== id);
  feedback('', 'Du kan ändra ordningen och prova igen.');
  drawTiles(id);
}
function render(focus = false) {
  const item = sentences[index]; solved = session.isDone(index); selected = solved ? item.words.map((_,i)=>i) : [];
  bankOrder = shuffleWords(item.words);
  $('count').textContent = `Mening ${index + 1} av ${sentences.length}`;
  $('progressFill').style.width = `${session.completed / sentences.length * 100}%`;
  $('sentenceSelect').value = String(index);
  $('startWord').textContent = item.start;
  $('startWord').hidden = !item.start;
  $('actor').textContent = item.actor; $('object').textContent = item.object;
  $('scene').dataset.motion = item.motion; $('spark').textContent = '';
  $('sceneHint').textContent = item.hint;
  $('sentenceBoard').classList.toggle('is-correct',solved);
  $('check').hidden = solved; $('next').hidden = !solved; $('next').disabled = !solved; $('hint').hidden = solved;
  $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa mening';
  $('tileHelp').textContent = 'Tryck på ett valt ord för att lägga tillbaka det.';
  feedback(solved ? 'Meningen är klar! ✓' : '', solved ? sentenceText() : 'Bygg färdigt och tryck på Kolla meningen.');
  drawTiles(focus && !solved ? bankOrder[0] : undefined);
  if(focus && solved)$('next').focus();
}
function checkSentence() {
  if (solved) return;
  const item = sentences[index];
  if (selected.length !== item.words.length) {
    feedback('Några ord saknas.', 'Använd alla ordbrickor innan du kollar meningen.');
    return;
  }
  const built = selected.map(id => item.words[id]);
  const correct = [item.words, ...(item.alternatives || [])].some(words => words.every((word, i) => word === built[i]));
  session.record(index, correct);
  if (correct) {
    solved = true; drawTiles();
    $('sentenceBoard').classList.add('is-correct'); $('spark').textContent = '✨';
    $('tileHelp').textContent = 'Läs gärna din mening högt!';
    feedback('Ja, så kan man säga! ✓', sentenceText() + ' ' + (currentLevel === 0 ? 'Meningen berättar vem som gör något och vad som händer.' : 'Orden hör ihop till en mening. Stor bokstav visar början.'));
    $('hint').hidden = true;
    $('progressFill').style.width = `${session.completed / sentences.length * 100}%`;
    $('check').hidden = true; $('next').hidden = false; $('next').disabled = false;
    $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa mening';
    $('next').focus();
  } else if (session.mistakes(index) >= 3) {
    session.markSupport(index,'answer');
    feedback('Vi bygger tillsammans!', `Bygg så här: ${[item.start, ...item.words].filter(Boolean).join(' ')}.`);
  } else if (session.mistakes(index) >= 2) {
    session.markSupport(index,'hint');
    feedback('Här kommer en ledtråd.', `Börja så här: ${[item.start, ...item.words].filter(Boolean).slice(0, 2).join(' ')} …`);
  } else {
    feedback('Prova en annan ordning.', currentLevel > 0 && !/^[A-ZÅÄÖ]/.test(built[0]) ? 'Börja med ordet som har stor bokstav. Lägg tillbaka ord som behöver flyttas.' : 'Läs högt. Vilka ord hör ihop? Titta på ledtråden och flytta de ord som behöver en annan plats.');
  }
}
$('check').onclick = checkSentence;
$('clearWords').onclick = () => { if (solved) return; selected = []; drawTiles(bankOrder[0]); feedback('', currentLevel === 0 ? 'Börja med ordet som redan står på plats.' : 'Börja med ordet som har stor bokstav.'); };
$('next').onclick = () => {
  if (!solved) return;
  if (session.complete) { showRoundResult(); return; }
  index = session.nextUnfinished(index); render(true);
};
$('restart').onclick = () => { sessions[currentLevel].reset(); chooseLevel(currentLevel); };

$('sentenceSelect').onchange = () => {
  const value = Number($('sentenceSelect').value);
  if (!Number.isInteger(value) || value < 0 || value >= sentences.length) return;
  index = value; render(true);
};
$('motion').onclick = () => {
  const paused = document.body.classList.toggle('paused');
  $('motion').setAttribute('aria-pressed', String(paused));
  $('motion').textContent = paused ? 'Starta rörelser' : 'Pausa rörelser';
};
function showLevels(focus = true) {
  document.querySelectorAll('[data-practice]').forEach(el => { el.hidden = true; });
  $('result').hidden = true;
  $('levelChooser').hidden = false;
  $('changeLevel').hidden = true;
  levels.forEach((level, i) => {
    $('levelStatus' + (i + 1)).textContent = sessions[i].complete
      ? `${sessions[i].score} av 15 rätt på första försöket`
      : sessions[i].completed ? `${sessions[i].completed} av 15 meningar klara` : '15 meningar';
  });
  if (focus) $('levelsTitle').focus();
}
function chooseLevel(value) {
  if (!Number.isInteger(value) || value < 0 || value >= levels.length) return;
  mode = 'primary';
  currentLevel = value;
  sentences = levels[value].sentences;
  session = sessions[value];
  $('levelChooser').hidden = true;
  $('changeLevel').hidden = false;
  document.querySelectorAll('[data-practice]').forEach(el => { el.hidden = false; });
  $('result').hidden = true;
  $('levelLabel').textContent = `Nivå ${value + 1} · Lek med meningar`;
  $('roundLabel').textContent = `Nivå ${value+1} · 15 meningar`;
  $('levelIntro').textContent = value === 0
    ? 'Här övar du på att bygga meningar. Början är redan på plats.'
    : 'Här övar du på längre meningar. Börja med ordet som har stor bokstav.';
  $('resultTitle').textContent = `Nivå ${value + 1} klar!`;
  $('sentenceSelect').replaceChildren();
  sentences.forEach((item, i) => {
    const option = document.createElement('option'); option.value = String(i);
    option.textContent = value === 0 ? `${i + 1}. ${item.start} …` : `Mening ${i + 1}`;
    $('sentenceSelect').append(option);
  });
  if (session.complete) { showRoundResult(); return; }
  index = session.nextUnfinished(-1);
  render(true);
}

function showRoundResult(){
 session.showResult();
 $('resultTitle').textContent=mode==='primary'?`Nivå ${currentLevel+1} klar!`:mode==='transfer'?'Ditt nya exempel är klart!':'Repetitionen är klar!';
 $('review').hidden=session.reviewIndices.length===0;
 $('transfer').hidden=mode==='transfer';$('backToPrimary').hidden=mode==='primary';
 $('restart').textContent='Spela nivån igen';
}
function followup(items,kind){
 sentences=items;session=createPracticeSession(items.length,'meningar',{detail:true});mode=kind;session.reset();index=0;
 $('roundLabel').textContent=kind==='transfer'?'Nytt exempel · eget resultat':'Öva vidare · eget resultat';
 $('sentenceSelect').replaceChildren();items.forEach((_,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`Mening ${i+1}`;$('sentenceSelect').append(o)});render(true);
}
$('review').onclick=()=>{const items=session.reviewIndices.map(i=>sentences[i]);if(items.length)followup(items,'review')};
$('transfer').onclick=()=>followup(sentenceApplications[currentLevel],'transfer');
$('backToPrimary').onclick=()=>chooseLevel(currentLevel);
$('hint').onclick=()=>{if(solved)return;session.markSupport(index,'hint');feedback('Tänk på ord som hör ihop.',currentLevel===0?'Början är på plats. Leta efter ordet som berättar vad som händer.':currentLevel===1?'Börja med stor bokstav. Håll ihop ord som beskriver samma sak, till exempel en röd cykel.':'Läs ledtråden. Bygg först den del som börjar med stor bokstav, sedan resten.');};

[1, 2, 3].forEach(number => { $('level' + number).onclick = () => chooseLevel(number - 1); });
$('changeLevel').onclick = () => showLevels();
$('resultLevels').onclick = () => showLevels();
showLevels(false);
