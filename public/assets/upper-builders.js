(() => {
  const { mode, items } = globalThis.upperGame;
  const $ = id => document.getElementById(id);
  const session = createPracticeSession(items.length, 'uppgifter');
  let index = 0, selected = [], order = [], link = '', solved = false;
  const completed = new Set();
  function shuffle(values, forceChange = false) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    if (forceChange && copy.length > 1 && copy.every((v, i) => v === values[i])) copy.push(copy.shift());
    return copy;
  }
  const partText = part => part.replace('{link}', link || '…');
  function feedback(text) { $('feedback').textContent = text; }
  function draw(focusId) {
    $('selectedParts').replaceChildren(); $('partBank').replaceChildren();
    const item = items[index];
    function tile(id, placed) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'word-tile'; b.id = `part-${id}`;
      b.textContent = partText(item.parts[id]); b.disabled = solved;
      b.setAttribute('aria-label', `${placed ? 'Lägg tillbaka' : 'Lägg till'}: ${b.textContent}`);
      b.onclick = () => {
        if (solved) return;
        selected = placed ? selected.filter(value => value !== id) : [...selected, id];
        draw(id);
      };
      return b;
    }
    selected.forEach(id => $('selectedParts').append(tile(id, true)));
    order.filter(id => !selected.includes(id)).forEach(id => $('partBank').append(tile(id, false)));
    $('emptyPrompt').hidden = selected.length > 0;
    $('clearParts').disabled = solved || (!selected.length && !link);
    $('buildStatus').textContent = `${selected.length} av ${item.parts.length} ${mode === 'text' ? 'meningar' : 'ord'} på plats.${mode === 'text' && !link ? ' Välj också ett sambandsord.' : ''}`;
    for (const b of $('linkChoices').children) { b.disabled = solved; b.setAttribute('aria-pressed', String(b.textContent === link)); }
    if (focusId !== undefined) $(`part-${focusId}`).focus();
  }
  function render(focus = false) {
    const item = items[index]; solved = completed.has(index);
    selected = solved ? item.parts.map((_, i) => i) : []; link = solved ? item.linkAnswer || '' : '';
    order = shuffle(item.parts.map((_, i) => i), true);
    $('exerciseSelect').value = String(index);
    $('count').textContent = `Övning ${index + 1} av ${items.length}`;
    $('progressFill').style.width = `${session.completed / items.length * 100}%`;
    $('taskTitle').textContent = item.title; $('context').textContent = item.hint;
    $('actor').textContent = item.actor; $('object').textContent = item.object;
    $('scene').dataset.motion = item.motion; $('spark').textContent = solved ? '✨' : '';
    $('board').classList.toggle('is-correct', solved);
    $('linkChoices').replaceChildren();
    if (mode === 'text') shuffle(item.linkOptions).forEach(value => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'link-choice'; b.textContent = value;
      b.onclick = () => { if (solved) return; link = value; draw(); }; $('linkChoices').append(b);
    });
    $('check').hidden = solved; $('next').hidden = !solved;
    $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa övning';
    feedback(solved ? item.explanation : 'Bygg färdigt och kontrollera ditt svar.');
    draw(focus && !solved ? order[0] : undefined);
    if (focus && solved) $('next').focus();
  }
  $('check').onclick = () => {
    if (solved) return;
    const item = items[index];
    if (selected.length !== item.parts.length || (mode === 'text' && !link)) {
      feedback(mode === 'text' ? 'Använd alla meningar och välj ett sambandsord innan du kollar texten.' : 'Använd alla ord innan du kollar meningen.'); return;
    }
    const built = selected.map(id => item.parts[id]);
    const correctOrder = [item.parts, ...(item.alternatives || [])].some(parts => parts.length === built.length && parts.every((part, i) => part === built[i]));
    const correct = correctOrder && (mode !== 'text' || link === item.linkAnswer);
    session.record(index, correct);
    if (correct) {
      solved = true; completed.add(index); draw(); $('board').classList.add('is-correct'); $('spark').textContent = '✨';
      $('progressFill').style.width = `${session.completed / items.length * 100}%`;
      feedback(`Fint byggt! ${item.explanation}`); $('check').hidden = true; $('next').hidden = false;
      $('next').textContent = session.complete ? 'Visa resultat' : 'Nästa övning'; $('next').focus();
    } else if (session.mistakes(index) >= 3) {
      feedback(`Bygg så här: ${item.parts.map(part => part.replace('{link}', item.linkAnswer || '')).join(' ')}${mode === 'words' ? '.' : ''}`);
    } else if (session.mistakes(index) >= 2) {
      feedback(`Ledtråd: börja med ”${item.parts[0].replace('{link}', item.linkAnswer || '')}”. ${item.hint}`);
    } else feedback('Inte riktigt än. Läs ledtråden igen och prova en annan ordning' + (mode === 'text' ? ' eller ett annat sambandsord.' : '.'));
  };
  $('clearParts').onclick = () => { if (solved) return; selected = []; link = ''; draw(order[0]); feedback('Bygg igen. Dina tidigare kontroller räknas fortfarande.'); };
  $('next').onclick = () => { if (!solved) return; if (session.complete) session.showResult(); else { index = session.nextUnfinished(index); render(true); } };
  $('restart').onclick = () => { session.reset(); completed.clear(); index = 0; render(true); };
  $('exerciseSelect').onchange = () => { const value = Number($('exerciseSelect').value); if (Number.isInteger(value) && value >= 0 && value < items.length) { index = value; render(true); } };
  $('motion').onclick = () => { const paused = document.body.classList.toggle('paused'); $('motion').setAttribute('aria-pressed', String(paused)); $('motion').textContent = paused ? 'Starta rörelser' : 'Pausa rörelser'; };
  items.forEach((item, i) => { const option = document.createElement('option'); option.value = String(i); option.textContent = `${i + 1}. ${item.title}`; $('exerciseSelect').append(option); });
  $('resultTitle').textContent = 'Alla uppgifter klara!';
  render();
})();
