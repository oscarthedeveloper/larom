const levels = globalThis.relationLevels;
const sessions = levels.map(level => createPracticeSession(level.items.length));
const $ = id => document.getElementById(id);
let currentLevel = 0, items = levels[0].items, session = sessions[0], index = 0, solved = false;
function feedback(title, message) {
  $('feedback').replaceChildren(); $('feedback').className = title ? 'feedback' : 'feedback idle';
  if (title) { const strong = document.createElement('strong'); strong.textContent = title; $('feedback').append(strong); }
  $('feedback').append(document.createTextNode(message));
}
function render(focus = false) {
  const item = items[index], opposite = item.relation === 'antonym'; solved = false;
  $('count').textContent = `Övning ${index + 1} av ${items.length}`;
  $('progressFill').style.width = `${(index + 1) / items.length * 100}%`;
  $('exerciseSelect').value = String(index);
  $('questionTitle').textContent = opposite ? 'Vad är tvärtom?' : 'Vad betyder ungefär samma sak?';
  $('questionIntro').textContent = opposite ? 'Läs ledtråden och hitta en antonym: ett motsatsord.' : 'Läs ledtråden och hitta en synonym: ett ord med liknande betydelse.';
  $('relationLabel').textContent = opposite ? 'Antonym = motsats' : 'Synonym ≈ samma betydelse';
  $('choiceTitle').textContent = opposite ? 'Välj motsatsen' : 'Välj en synonym';
  $('sceneTag').textContent = opposite ? 'Hitta en antonym' : 'Hitta en synonym';
  $('prompt').textContent = item.prompt; $('prompt').className = 'sentence opposite-word';
  $('context').textContent = item.context;
  $('actor').textContent = item.actor; $('object').textContent = item.object; $('spark').textContent = '';
  $('scene').dataset.motion = item.motion;
  $('choices').replaceChildren();
  const options = [...item.options]; if (Math.random() < .5) options.reverse();
  for (const value of options) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'choice'; b.setAttribute('aria-label', value);
    const word = document.createElement('span'); word.className = 'word'; word.textContent = value; b.append(word);
    b.onclick = () => choose(value,b); $('choices').append(b);
  }
  $('next').disabled = true; $('next').textContent = 'Nästa övning';
  feedback('', opposite ? 'Vilket ord betyder motsatsen?' : 'Vilket ord betyder ungefär samma sak här?');
  if (focus) $('choices').firstElementChild.focus();
}
function choose(value,button) {
  if (solved || !items[index].options.includes(value)) return;
  const item = items[index], correct = value === item.answer;
  session.record(index,correct);
  for (const b of $('choices').children) b.classList.remove('try','correct');
  if (correct) {
    solved = true; button.classList.add('correct'); for(const b of $('choices').children)b.disabled=true;
    $('prompt').textContent = item.answer; $('sceneTag').textContent = `${item.prompt} och ${item.answer}`;
    $('actor').textContent = item.afterActor || item.actor; $('object').textContent = item.afterObject ?? item.object;
    $('scene').dataset.motion = item.afterMotion || item.motion; $('spark').textContent = '✨';
    feedback('Ja, precis! ✨',item.explanation);
    $('next').disabled=false; $('next').textContent=session.complete?'Visa resultat':'Nästa övning'; $('next').focus();
  } else {
    button.classList.add('try');
    feedback('Prova en gång till.',session.mistakes(index)>=2 ? `Välj ${item.answer}. ${item.explanation}` : `${item.relation==='antonym'?'Hitta motsatsen.':'Hitta ett ord med liknande betydelse.'} ${item.context}`);
  }
}
function showLevels(focus=true) {
  document.querySelectorAll('[data-practice]').forEach(el=>{el.hidden=true;}); $('result').hidden=true; $('levelChooser').hidden=false; $('changeLevel').hidden=true;
  levels.forEach((level,i)=>{$('levelStatus'+(i+1)).textContent=sessions[i].complete?`${sessions[i].score} av 15 rätt på första försöket`:`${sessions[i].completed} av 15 övningar klara`;});
  if(focus)$('levelsTitle').focus();
}
function chooseLevel(value) {
  if(!Number.isInteger(value)||value<0||value>=levels.length)return;
  currentLevel=value;items=levels[value].items;session=sessions[value];
  $('levelChooser').hidden=true;$('result').hidden=true;$('changeLevel').hidden=false;
  document.querySelectorAll('[data-practice]').forEach(el=>{el.hidden=false;});
  $('levelLabel').textContent=`Nivå ${value+1} · ${levels[value].name}`; $('resultTitle').textContent=`Nivå ${value+1} klar!`;
  $('exerciseSelect').replaceChildren();items.forEach((item,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=`${i+1}. ${item.prompt}`;$('exerciseSelect').append(o);});
  if(session.complete){session.showResult();return;}index=session.nextUnfinished(-1);render(true);
}
$('next').onclick=()=>{if(!solved)return;if(session.complete){session.showResult();return;}index=session.nextUnfinished(index);render(true);};
$('restart').onclick=()=>{session.reset();index=0;render(true);};
$('exerciseSelect').onchange=()=>{const i=Number($('exerciseSelect').value);if(!Number.isInteger(i)||i<0||i>=items.length)return;index=i;render(true);};
[1,2,3].forEach(n=>{$('level'+n).onclick=()=>chooseLevel(n-1);});
$('changeLevel').onclick=()=>showLevels();$('resultLevels').onclick=()=>showLevels();
$('motion').onclick=()=>{const paused=document.body.classList.toggle('paused');$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';};
showLevels(false);
