/* Separate in-memory rounds. Reviewing or applying never rewrites the first result. */
globalThis.createRoundFlow = function({items, extras, noun, onStart}) {
  const $ = id => document.getElementById(id);
  let primary, active, hasStarted = false;
  function begin(selected, kind, label) {
    active = {items: [...selected], kind, label, session: createPracticeSession(selected.length, noun, {detail:true})};
    if (kind === 'primary') primary = active;
    active.session.reset();
    $('roundLabel').textContent = label;
    onStart({...active, focus:hasStarted});
    hasStarted = true;
  }
  function result() {
    if (!active.session.complete) return;
    active.session.showResult();
    $('resultTitle').textContent = active.kind === 'transfer' ? 'Nya exempel klara!' : active.kind === 'review' ? 'Repetitionen är klar!' : 'Din omgång är klar!';
    $('review').hidden = active.session.reviewIndices.length === 0;
    $('review').textContent = `Öva vidare · ${active.session.reviewIndices.length} uppgifter`;
    $('transfer').hidden = active.kind === 'transfer';
    $('backToPrimary').hidden = active === primary;
    $('restart').textContent = 'Starta första omgången igen';
  }
  $('review').onclick = () => begin(active.session.reviewIndices.map(i => active.items[i]), 'review', 'Öva vidare · egen omgång');
  $('transfer').onclick = () => begin(extras, 'transfer', 'Nya exempel · egen omgång');
  $('backToPrimary').onclick = () => {active = primary; result();};
  $('restart').onclick = () => begin(primary.items, 'primary', primary.label);
  return {start: (selected = items, label = `Alla ${selected.length} ${noun}`) => begin(selected, 'primary', label), result};
};
