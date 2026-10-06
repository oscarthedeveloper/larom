/* A session lasts until restart or page reload. Revisits never replace a first answer. */
globalThis.createPracticeSession = function(total, noun = 'ord', options = {}) {
  let first = Array(total).fill(null);
  let done = Array(total).fill(false);
  let errors = Array(total).fill(0);
  let help = Array.from({length: total}, () => ({hint: false, answer: false}));
  function practiceVisible(visible) {
    document.querySelectorAll('[data-practice]').forEach(el => { el.hidden = !visible; });
    document.getElementById('result').hidden = visible;
  }
  return {
    record(index, correct) {
      if (!Number.isInteger(index) || index < 0 || index >= total || done[index]) return;
      if (first[index] === null) first[index] = correct;
      if (correct) done[index] = true; else errors[index] += 1;
    },
    get score() { return first.filter(value => value === true).length; },
    get completed() { return done.filter(Boolean).length; },
    get complete() { return done.every(Boolean); },
    mistakes(index) { return errors[index] || 0; },
    isDone(index) { return done[index] === true; },
    markSupport(index, type = 'hint') {
      if (!Number.isInteger(index) || index < 0 || index >= total || done[index]) return;
      if (type === 'hint' || type === 'answer') help[index][type] = true;
    },
    get reviewIndices() {
      return errors.flatMap((n, i) => n || help[i].hint || help[i].answer ? [i] : []);
    },
    get supportCounts() {
      return {hint: help.filter(h => h.hint).length, answer: help.filter(h => h.answer).length};
    },
    nextUnfinished(index) {
      for (let step = 1; step <= total; step++) {
        const candidate = (index + step) % total;
        if (!done[candidate]) return candidate;
      }
      return -1;
    },
    showResult() {
      if (!this.complete) return;
      document.getElementById('resultScore').textContent = `${this.score} av ${total}`;
      const practiced = total - this.score;
      const countedNoun = practiced === 1 ? ({meningar: 'mening', uppgifter: 'uppgift', texter: 'text'}[noun] || noun) : noun;
      document.getElementById('resultMessage').textContent = practiced === 0
        ? `Du klarade alla ${noun} direkt. Fint jobbat!`
        : `Du övade vidare på ${practiced} ${countedNoun} och klarade till slut alla. Fint jobbat!`;
      if (options.detail) {
        document.getElementById('resultMessage').textContent = `Du har gjort klart ${total} ${total === 1 ? ({meningar: 'mening', uppgifter: 'uppgift', texter: 'text'}[noun] || noun) : noun}. Poängen visar rätt på första försöket i just den här omgången.`;
        const counts = this.supportCounts;
        document.getElementById('supportSummary').textContent =
          `Ledtråd i ${counts.hint} uppgifter · facitstöd i ${counts.answer} uppgifter. Vanligt bildstöd och Visa hur räknas inte som ledtrådar.`;
      }
      practiceVisible(false);
      document.getElementById('resultTitle').focus();
    },
    reset() {
      first = Array(total).fill(null);
      done = Array(total).fill(false);
      errors = Array(total).fill(0);
      help = Array.from({length: total}, () => ({hint: false, answer: false}));
      practiceVisible(true);
    }
  };
};
