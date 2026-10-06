const verbApplications = [
 {...verbItems[6], id:'verb-use-bar', wrong:'…', before:'I går ', after:' Ali väskan till bilen.'},
 {...verbItems[9], id:'verb-use-burit', wrong:'…', before:'Ali har ', after:' väskan hela vägen.'},
 {...verbItems[1], id:'verb-use-skrev', wrong:'…', before:'I går ', after:' vi ett brev till vår vän.'}
];
let exercises=verbItems, session, drafts=[];

let index = 0;
let solved = false;
let attempts = 0;
const $ = id => document.getElementById(id);
function normalizeAnswer(value) {
  return value.normalize('NFC').trim().toLocaleLowerCase('sv-SE').replace(/[.!?]+$/, '').trim();
}
function setFeedback(title, message, idle = false) {
  const box = $('feedback');
  box.replaceChildren();
  box.className = idle ? 'feedback idle' : 'feedback';
  if (title) { const strong = document.createElement('strong'); strong.textContent = title; box.append(strong); }
  if (message) box.append(document.createTextNode(message));
}
function renderSentence(correct) {
  const item = exercises[index];
  const token = document.createElement('span');
  token.className = correct ? 'right-token' : 'wrong-token';
  token.textContent = correct ? (normalizeAnswer(drafts[index] || item.answer)) : item.wrong;
  $('sentence').replaceChildren(document.createTextNode(item.before), token, document.createTextNode(item.after));
}
function render(focus = false) {
  const item = exercises[index];
  solved = session.isDone(index);
  attempts = session.mistakes(index);
  $('count').textContent = `Ord ${index + 1} av ${exercises.length}`;
  $('progressFill').style.width = `${session.completed / exercises.length * 100}%`;
  $('exerciseSelect').value = String(index);
  $('tense').textContent = item.tense;
  $('scene').dataset.motion = item.motion;
  $('scene').classList.remove('celebrate');
  $('actor').textContent = item.actor;
  $('object').textContent = item.object;
  $('spark').textContent = '';
  $('sceneTag').textContent = item.wrong === '…' ? 'Välj en form som passar här' : 'Öva på skriftspråk';
  $('sceneHint').textContent = `Ordet kommer från ”${item.verb}”.`;
  renderSentence(solved);
  $('wrongWord').textContent = item.wrong;
  $('wrongWord').className = 'wrong-display';
  $('answer').value = solved ? normalizeAnswer(drafts[index] || item.answer) : (drafts[index] || '');
  $('answer').readOnly = solved;
  $('answer').classList.toggle('is-correct', solved);
  $('answer').setAttribute('aria-invalid', 'false');
  $('answer').setAttribute('aria-label', item.wrong === '…' ? `Skriv en form av ${item.verb}` : `Skriv rätt form i stället för ${item.wrong}`);
  $('check').hidden = solved;
  $('next').hidden = !solved;
  $('next').disabled = !solved;
  $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa ord';
  $('hint').hidden = solved;
  setFeedback(solved ? 'Rätt! ✓' : '', solved ? explanation(item) : 'Skriv verbformen som passar här. Du får alltid prova igen.', !solved);
  if (focus) (solved ? $('next') : $('answer')).focus();
}
function checkAnswer() {
  if (solved) return;
  const item = exercises[index];
  const answer = normalizeAnswer($('answer').value);
  if (!answer) {
    setFeedback('Skriv ett ord först.', 'Vad ska stå i stället för ' + item.wrong + '?');
    $('answer').focus();
    return;
  }
  drafts[index] = $('answer').value;
  const correct = item.accepted.includes(answer);
  session.record(index, correct);
  if (correct) {
    solved = true;
    $('answer').value = answer;
    $('answer').readOnly = true;
    $('answer').setAttribute('aria-invalid', 'false');
    $('answer').classList.add('is-correct');
    $('wrongWord').className = 'wrong-display corrected';
    renderSentence(true);
    $('sceneTag').textContent = 'Så säger man ju!';
    $('sceneHint').textContent = 'Läs gärna hela meningen högt.';
    $('spark').textContent = '✨';
    $('scene').classList.add('celebrate');
    setFeedback('Rätt! ✓', explanation(item));
    $('hint').hidden = true;
    $('progressFill').style.width = `${session.completed / exercises.length * 100}%`;
    $('check').hidden = true;
    $('next').hidden = false;
    $('next').disabled = false;
    $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa ord';
    $('next').focus();
    return;
  }
  attempts += 1;
  $('answer').setAttribute('aria-invalid', 'true');
  if (attempts >= 3) {
    session.markSupport(index,'answer');
    setFeedback('Vi hjälps åt!', `Svaret är ${item.answer}. Skriv ordet i rutan och prova igen.`);
  } else if (attempts >= 2) {
    session.markSupport(index,'hint');
    setFeedback('Här kommer en ledtråd.', `Ordet börjar på ${item.answer[0]} och har ${item.answer.length} bokstäver.`);
  } else {
    setFeedback('Prova en gång till.', tenseHint(item));
  }
  $('answer').focus();
  $('answer').select();
}
$('answerForm').onsubmit = event => {
  event.preventDefault();
  if (solved) nextExercise(); else checkAnswer();
};
function nextExercise() {
  if (!solved) return;
  if (session.complete) { flow.result(); return; }
  index = session.nextUnfinished(index);
  render(true);
}
$('next').onclick = nextExercise;
$('answer').oninput = () => { if (!solved) { drafts[index]=$('answer').value; $('answer').setAttribute('aria-invalid', 'false'); } };
function tenseHint(item) { return item.tense === 'Efter har' ? 'Titta på ordet har. Formen efter har kan skilja sig från den du använder efter i går.' : 'Berätta om något som hände förut. Alla verb får inte ändelsen -de.'; }
function explanation(item) { return (item.tense === 'Efter har' ? `Efter har skriver vi ${item.answer}: ` : `Här berättar vi om något som hände: `) + item.before + item.answer + item.after + (item.note ? ' ' + item.note : ''); }
$('hint').onclick=()=>{if(solved)return;session.markSupport(index,'hint');setFeedback('Titta på tiden.',tenseHint(exercises[index]));};
const flow=createRoundFlow({items:verbItems,extras:verbApplications,noun:'ord',onStart(context){
 exercises=context.items;session=context.session;index=0;drafts=[];
 $('exerciseSelect').replaceChildren();exercises.forEach((item,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=`${i+1}. ${item.wrong === '…' ? item.verb : item.wrong}`;$('exerciseSelect').append(option)});
 render(context.focus);
}});
$('exerciseSelect').onchange = () => {
  const selected = Number($('exerciseSelect').value);
  if (!Number.isInteger(selected) || selected < 0 || selected >= exercises.length) return;
  index = selected;
  render(true);
};
$('motion').onclick = () => {
  const paused = document.body.classList.toggle('paused');
  $('motion').setAttribute('aria-pressed', String(paused));
  $('motion').textContent = paused ? 'Starta rörelser' : 'Pausa rörelser';
};
flow.start();
