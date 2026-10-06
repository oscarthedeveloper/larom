const config = globalThis.choiceGame;
const items = config.items;
const session = createPracticeSession(items.length, config.noun);
const $ = id => document.getElementById(id);
const punctuation = config.kind === 'punctuation';
const signNames = {'.': 'Punkt', '?': 'Frågetecken', '!': 'Utropstecken'};
let index = 0, solved = false;
function setFeedback(title, message) {
  $('feedback').replaceChildren();
  $('feedback').className = title ? 'feedback' : 'feedback idle';
  if (title) { const strong = document.createElement('strong'); strong.textContent = title; $('feedback').append(strong); }
  $('feedback').append(document.createTextNode(message));
}
function showScene(item, correct = false) {
  $('actor').textContent = correct ? item.afterActor || item.actor : item.actor;
  $('object').textContent = correct ? item.afterObject ?? item.object : item.object;
  $('scene').dataset.motion = correct ? item.afterMotion || item.motion : item.motion;
  $('scene').classList.toggle('celebrate', correct);
  $('spark').textContent = correct ? '✨' : '';
}
function render(focus = false) {
  const item = items[index]; solved = false;
  $('count').textContent = `Övning ${index + 1} av ${items.length}`;
  $('progressFill').style.width = `${(index + 1) / items.length * 100}%`;
  $('exerciseSelect').value = String(index);
  $('prompt').textContent = item.prompt + (punctuation ? ' …' : '');
  $('prompt').className = punctuation ? 'sentence' : 'sentence opposite-word';
  $('context').textContent = item.context;
  $('sceneTag').textContent = punctuation ? 'Tänk på hur det sägs' : 'Hitta motsatsen';
  showScene(item);
  $('choices').replaceChildren();
  const options = punctuation ? ['.', '?', '!'] : [...item.options];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  for (const value of options) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'choice';
    const word = document.createElement('span'); word.className = 'word'; word.textContent = value; b.append(word);
    if (punctuation) { const label = document.createElement('span'); label.className = 'choice-note'; label.textContent = signNames[value]; b.append(label); }
    b.setAttribute('aria-label', punctuation ? signNames[value] : value);
    b.onclick = () => choose(value, b); $('choices').append(b);
  }
  $('next').disabled = true; $('next').textContent = 'Nästa övning';
  setFeedback('', punctuation ? 'Vilket tecken passar ledtråden bäst?' : 'Välj ett ord som betyder tvärtom.');
  if (focus) $('choices').firstElementChild.focus();
}
function choose(value, button) {
  if (solved) return;
  const item = items[index];
  if (!(punctuation ? ['.', '?', '!'] : item.options).includes(value)) return;
  const correct = value === item.answer;
  session.record(index, correct);
  for (const b of $('choices').children) b.classList.remove('try', 'correct');
  if (correct) {
    solved = true; button.classList.add('correct');
    for (const b of $('choices').children) b.disabled = true;
    $('prompt').textContent = punctuation ? item.prompt + item.answer : item.answer;
    $('sceneTag').textContent = punctuation ? 'Nu passar tecknet!' : `${item.prompt} och ${item.answer}`;
    showScene(item, true);
    $('context').textContent = punctuation ? item.context : item.explanation;
    setFeedback('Ja, precis! ✨', item.explanation);
    $('next').disabled = false; $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa övning';
    $('next').focus();
  } else {
    button.classList.add('try');
    const hint = punctuation ? item.context : `Tänk på motsatsen till ${item.prompt}. ${item.context}`;
    setFeedback('Prova en gång till.', session.mistakes(index) >= 2
      ? (punctuation ? `${signNames[item.answer]} passar här. ${item.explanation}` : `Motsatsen är ${item.answer}. Välj det ordet.`)
      : hint);
  }
}
$('next').onclick = () => {
  if (!solved) return;
  if (session.complete) { session.showResult(); return; }
  index = session.nextUnfinished(index); render(true);
};
$('restart').onclick = () => { session.reset(); index = 0; render(true); };
items.forEach((item, i) => {
  const option = document.createElement('option'); option.value = String(i);
  option.textContent = punctuation ? `Mening ${i + 1}` : `${i + 1}. ${item.prompt}`;
  $('exerciseSelect').append(option);
});
$('exerciseSelect').onchange = () => {
  const selected = Number($('exerciseSelect').value);
  if (!Number.isInteger(selected) || selected < 0 || selected >= items.length) return;
  index = selected; render(true);
};
$('motion').onclick = () => {
  const paused = document.body.classList.toggle('paused');
  $('motion').setAttribute('aria-pressed', String(paused));
  $('motion').textContent = paused ? 'Starta rörelser' : 'Pausa rörelser';
};
render();
