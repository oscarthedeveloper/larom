(() => {
 const $=id=>document.getElementById(id),M=BridgeModel,levels=M.levels;
 const blank=()=>({edges:[],undo:[],solved:false,best:null,tests:0,outcome:null});
 let states=levels.map(blank),index=0,tool='road',selected=null,testing=false,generation=0,timer=null,pending=null,paused=false;
 const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
 const level=()=>levels[index],state=()=>states[index],count=()=>states.filter(s=>s.solved).length;
 const xy=n=>({x:150+n.x*600/level().spans,y:255+n.y*135});
 const cap=n=>Math.max(-.65,Math.min(.65,n));
 const roadNames=(a,b)=>{const ns=M.nodes(level());return `${ns[a].label}–${ns[b].label}`;};
 function message(text,tone='idle'){$('feedback').textContent=text;$('feedback').dataset.tone=tone;}
 function landscape(){
  const trees=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M0 0V-75" stroke="#806b51" stroke-width="8"/><circle cx="0" cy="-72" r="32" fill="#609c7b"/><circle cx="-15" cy="-59" r="24" fill="#75b68e"/></g>`;
  let s='<defs><linearGradient id="river" x2="0" y2="1"><stop stop-color="#9fdbe6"/><stop offset="1" stop-color="#63b6cc"/></linearGradient></defs><rect width="900" height="500" fill="#e2f1f6"/><circle cx="737" cy="62" r="30" fill="#ffe6a2"/><path d="M0 176L112 83 213 169 365 113 484 190 648 110 784 161 900 85V310H0Z" fill="#c2ddd8"/><path d="M0 217Q133 120 263 215T530 210T900 187V320H0Z" fill="#b2d3c8"/><g fill="#fff" opacity=".85"><rect x="271" y="52" width="114" height="20" rx="10"/><circle cx="310" cy="51" r="21"/><circle cx="345" cy="46" r="26"/><rect x="540" y="103" width="72" height="13" rx="7"/></g><path d="M135 300Q450 270 765 300L900 500H0Z" fill="url(#river)"/><g class="water-lines" fill="none" stroke="#daf4f5" stroke-width="4" stroke-linecap="round"><path d="M220 361h70m160 32h82m-195 63h90m194-118h75m-510 86h55m433 40h80"/></g><path d="M0 239H150V292L118 325 140 382 74 414 105 463 0 489Z" fill="#9babb0"/><path d="M900 239H750V292L786 326 760 382 831 428 807 468 900 493Z" fill="#9babb0"/><path d="M0 254H150V269H0M750 254H900V269H750" fill="#5f8b72"/><path d="M0 244H150M750 244H900" stroke="#52677b" stroke-width="20"/><path d="M0 244H145M755 244H900" stroke="#fff4bc" stroke-width="3" stroke-dasharray="18 14"/>'+trees(54,233)+trees(844,233);
  for(const x of level().piers){const p=xy({x,y:0});s+=`<ellipse cx="${p.x}" cy="418" rx="48" ry="18" fill="#97b5a2"/><rect x="${p.x-17}" y="255" width="34" height="164" rx="5" fill="#859dad"/><path d="M${p.x-23} 257h46" stroke="#617f92" stroke-width="12"/>`;}
  s+='<path d="M150 255H750" stroke="#6d8fa2" stroke-width="3" stroke-dasharray="7 12"/><path d="M789 240v-62l31 12-31 12" fill="#ed9678" stroke="#637589" stroke-width="4" stroke-linejoin="round"/>';
  $('landscape').innerHTML=s;
 }
 function draw(frame=null,finished=null){
  const ns=M.nodes(level()),edges=state().edges,positions=ns.map(n=>{const p=xy(n),d=frame?.displacement[n.id];return {x:p.x+(d?cap(d.x)*600/level().spans:0),y:p.y+(d?cap(d.y)*135:0)};});let svg='';
  edges.forEach((e,i)=>{const a=positions[e.a],b=positions[e.b],sag=frame?Math.max(Math.abs(frame.displacement[e.a].y),Math.abs(frame.displacement[e.b].y)):0,warning=frame&&(frame.stress[i]>.035||sag>.14),color=warning?'#cf633f':e.type==='road'?'#40556e':'#c28a51';svg+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="${e.type==='road'?15:9}" stroke-linecap="round"/>`;if(e.type==='road')svg+=`<line x1="${a.x}" y1="${a.y-2}" x2="${b.x}" y2="${b.y-2}" stroke="#fff0bb" stroke-width="2" stroke-dasharray="9 10"/>`;});
  if(testing||finished)for(const n of ns){const p=positions[n.id];if(edges.some(e=>e.a===n.id||e.b===n.id))svg+=`<circle cx="${p.x}" cy="${p.y}" r="7" fill="${n.fixed?'#ffd47a':'#f8ffff'}" stroke="#49637d" stroke-width="3"/>`;}
  let carX=81,carY=246,angle=0;
  if(frame){const p=frame.position,left=Math.min(level().spans-1,Math.floor(p)),f=p-left,a=positions[left],b=positions[left+1];carX=a.x+(b.x-a.x)*f;carY=a.y+(b.y-a.y)*f-9;angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;}
  if(finished==='success'){carX=810;carY=245;angle=0;}else if(finished==='failed'){carY+=62;angle=15;}
  svg+=`<g transform="translate(${carX} ${carY}) rotate(${angle})"><g class="${finished==='success'?'car-arrive':finished==='failed'?'car-crash':''}"><rect x="-33" y="-33" width="69" height="23" rx="8" fill="#f0b441"/><path d="M-18-33l9-20h26l12 20" fill="#e6a331"/><path d="M-5-49h18l8 16H-12Z" fill="#d6f1f3"/><path d="M3-49v16" stroke="#9ac9d2" stroke-width="3"/><circle cx="-19" cy="-9" r="10" fill="#31445d"/><circle cx="23" cy="-9" r="10" fill="#31445d"/><circle cx="-19" cy="-9" r="4" fill="#c4d2de"/><circle cx="23" cy="-9" r="4" fill="#c4d2de"/><rect x="29" y="-28" width="8" height="7" rx="2" fill="#fff2ce"/>${level().load>1.4?'<rect x="-24" y="-65" width="29" height="20" rx="3" fill="#b98250"/><path d="M-10-65v20" stroke="#ead7a9" stroke-width="5"/>':''}</g></g>`;
  $('drawing').innerHTML=svg;
 }
 function chooseTool(value){if(testing)return;tool=value;selected=null;state().outcome=null;render();}
 function saveUndo(){state().undo.push(state().edges.map(e=>({...e})));if(state().undo.length>60)state().undo.shift();}
 function edited(){state().outcome=null;selected=null;render();message('Din ändring är på plats. Testa när du är redo.');}
 function removeEdge(a,b){const n=state().edges.findIndex(e=>M.key(e.a,e.b)===M.key(a,b));if(n<0){$('selectionNote').textContent='Det finns ingen del mellan de punkterna.';selected=null;renderPoints();return;}saveUndo();state().edges.splice(n,1);edited();}
 function pick(id){
  if(testing)return;state().outcome=null;if(selected===null){selected=id;renderPoints();draw();$('selectionNote').textContent=`${M.nodes(level())[id].label} är vald. Välj den andra ändpunkten.`;return;}
  const a=selected;selected=null;if(a===id){renderPoints();$('selectionNote').textContent='Valet är avbrutet. Välj två olika punkter.';return;}
  if(tool==='remove'){removeEdge(a,id);return;}
  const error=M.placement(level(),state().edges,a,id,tool);if(error){renderPoints();$('selectionNote').textContent=error;return;}
  saveUndo();state().edges.push({a,b:id,type:tool});edited();$('selectionNote').textContent=`${tool==='road'?'Vägdel':'Balk'} ${roadNames(a,id)} är på plats.`;
 }
 function renderPoints(){
  $('points').replaceChildren();$('points').hidden=testing||!!state().outcome;
  for(const n of M.nodes(level())){const p=xy(n),button=document.createElement('button');button.type='button';button.className='bridge-node'+(n.fixed?' anchor':'');button.textContent=n.label;button.style.left=p.x/9+'%';button.style.top=p.y/5+'%';button.setAttribute('aria-label',`Punkt ${n.label}, ${n.y===0?'på vägen':n.y<0?'ovanför vägen':'under vägen'}${n.fixed?', fast stöd':''}`);button.setAttribute('aria-pressed',String(selected===n.id));button.disabled=testing;if(selected!==null&&n.id!==selected&&((tool==='remove'&&state().edges.some(e=>M.key(e.a,e.b)===M.key(selected,n.id)))||(tool!=='remove'&&!M.placement(level(),state().edges,selected,n.id,tool))))button.classList.add('valid-target');button.onclick=()=>{pick(n.id);const next=Array.from($('points').children).find(b=>b.textContent===n.label);if(next&&!next.disabled)next.focus();};$('points').append(button);}
 }
 function renderLevels(){
  $('levels').replaceChildren();levels.forEach((l,i)=>{const b=document.createElement('button'),n=document.createElement('span'),label=document.createElement('span');b.type='button';b.className=states[i].solved?'solved':'';n.className='level-number';label.className='level-name';n.textContent=states[i].solved?'✓':String(i+1);label.textContent=l.title;b.setAttribute('aria-label',`Uppdrag ${i+1}: ${l.title}${states[i].solved?', klarat':''}`);b.setAttribute('aria-current',i===index?'step':'false');b.disabled=testing;b.onclick=()=>selectLevel(i);b.append(n,label);$('levels').append(b);});$('completedCount').textContent=`${count()} av ${levels.length}`;
 }
 function render(){
  renderLevels();const l=level(),s=state();$('missionNumber').textContent=`Uppdrag ${index+1} av ${levels.length}${s.solved?' · klarat ✓':''}`;$('missionTitle').textContent=l.title;$('goal').textContent=l.goal;$('vehicleBadge').textContent=l.load>1.4?'Bil med tung låda':'Liten bil';
  for(const [kind,id] of [['road','roadTool'],['beam','beamTool'],['remove','removeTool']]){$(id).setAttribute('aria-pressed',String(tool===kind));$(id).disabled=testing||(kind==='beam'&&l.beams===0);}
  $('roadCount').textContent=`${l.spans-s.edges.filter(e=>e.type==='road').length} av ${l.spans} kvar`;$('beamCount').textContent=l.beams?`${l.beams-s.edges.filter(e=>e.type==='beam').length} av ${l.beams} kvar`:'Behövs inte här';
  $('undo').disabled=testing||!s.undo.length;$('clear').disabled=testing||!s.edges.length;$('test').disabled=testing;$('test').textContent=s.outcome?'▶ Testa igen':'▶ Testa bron';$('stopTest').hidden=!testing;$('showResults').disabled=testing;$('hint').disabled=testing;$('restore').hidden=!s.best;$('restore').disabled=testing;$('next').disabled=testing||!s.solved;$('next').textContent=count()===levels.length?'Se alla mina broar →':'Nästa bro →';
  $('pieceCount').textContent=`(${s.edges.length})`;$('partsList').replaceChildren();if(!s.edges.length)$('partsList').textContent='Inga delar ännu.';else for(const e of s.edges){const b=document.createElement('button');b.type='button';b.textContent=`Ta bort ${e.type==='road'?'vägdel':'balk'} ${roadNames(e.a,e.b)}`;b.disabled=testing;b.onclick=()=>{if(!testing){removeEdge(e.a,e.b);$('removeTool').focus();}};$('partsList').append(b);}
  landscape();renderPoints();if(s.outcome)draw(s.outcome.frames.at(-1),s.outcome.ok?'success':'failed');else draw();
  $('selectionNote').textContent=testing?'Nu provar bilen bron …':s.outcome?'Välj Vägdel, Balk eller Ta bort för att bygga vidare.':tool==='remove'?'Tryck på delens två ändpunkter för att ta bort den.':'Tryck på två punkter för att placera en '+(tool==='road'?'vägdel.':'balk.');
 }
 function cancel(){generation++;if(timer!==null)clearTimeout(timer);timer=null;testing=false;pending=null;}
 function selectLevel(i){if(!Number.isInteger(i)||i<0||i>=levels.length)return;cancel();index=i;selected=null;tool='road';$('workshop').hidden=false;$('result').hidden=true;render();message(state().solved?'Du har klarat uppdraget. Fortsätt gärna att prova egna idéer.':'Börja med vägen mellan stränderna.');$('roadTool').focus();}
 function finish(result,token){
  if(token!==generation||!testing)return;if(timer!==null)clearTimeout(timer);timer=null;testing=false;pending=null;state().tests++;state().outcome=result;
  if(result.ok){state().solved=true;state().best=state().edges.map(e=>({...e}));}
  render();message(result.ok?'Bilen kom över! Din bro klarade hela testet.':`Bron böjde sig för mycket${result.reason==='strain'?' eller en del töjdes för mycket':''}. Prova att förstärka med balkar som bildar trianglar.${state().solved?' Du har fortfarande kvar ditt tidigare klarade uppdrag.':''}`,result.ok?'success':'retry');
  (result.ok?$('next'):$('beamTool')).focus();
 }
 function runTest(){
  if(testing)return;selected=null;state().outcome=null;const result=M.test(level(),state().edges);
  if(result.reason==='gap'){render();message(`Vägen saknas mellan ${roadNames(result.gap,result.gap+1)}. Koppla ihop vägen innan bilen kör.`,'retry');return;}
  testing=true;const token=++generation;pending={result,token};render();message('Bilen provar din bro. Titta på vad som händer.');
  if(paused||reduced?.matches){finish(result,token);return;}
  let frameIndex=0;function step(){if(token!==generation||!testing)return;if(paused||reduced?.matches){finish(result,token);return;}draw(result.frames[frameIndex]);frameIndex++;if(frameIndex<result.frames.length)timer=setTimeout(step,70);else timer=setTimeout(()=>finish(result,token),350);}step();
 }
 function showResults(){cancel();$('workshop').hidden=true;$('result').hidden=false;$('resultTitle').textContent=count()===levels.length?'Du byggde alla broarna!':'Mina broar';$('resultScore').textContent=`${count()} av ${levels.length} broar klarade`;$('resultMessage').textContent=`Du har genomfört ${states.reduce((n,s)=>n+s.tests,0)} tester. Dina byggen finns kvar så länge sidan är öppen.`;$('resultLevels').replaceChildren();levels.forEach((l,i)=>{const b=document.createElement('button');b.type='button';b.textContent=`${states[i].solved?'✓':'○'} ${i+1}. ${l.title}`;b.onclick=()=>selectLevel(i);$('resultLevels').append(b);});$('resultTitle').focus();}
 $('roadTool').onclick=()=>chooseTool('road');$('beamTool').onclick=()=>chooseTool('beam');$('removeTool').onclick=()=>chooseTool('remove');
 $('undo').onclick=()=>{if(testing||!state().undo.length)return;state().edges=state().undo.pop();edited();};$('clear').onclick=()=>{if(testing||!state().edges.length)return;saveUndo();state().edges=[];edited();};
 $('restore').onclick=()=>{if(testing||!state().best)return;saveUndo();state().edges=state().best.map(e=>({...e}));edited();};
 $('board').onkeydown=e=>{if(e.key==='Escape'){selected=null;renderPoints();$('selectionNote').textContent='Valet är avbrutet.';$('roadTool').focus();}};
 $('test').onclick=runTest;$('stopTest').onclick=()=>{if(!testing)return;cancel();render();message('Testet är avbrutet. Du kan ändra bron och prova igen.');$('test').focus();};
 $('hint').onclick=()=>{if(!testing)message(level().hint);};$('showResults').onclick=showResults;$('resume').onclick=()=>selectLevel(index);
 $('next').onclick=()=>{if(testing||!state().solved)return;if(count()===levels.length){showResults();return;}for(let step=1;step<=levels.length;step++){const n=(index+step)%levels.length;if(!states[n].solved){selectLevel(n);return;}}};
 $('restart').onclick=()=>{cancel();states=levels.map(blank);selectLevel(0);};
 $('motion').onclick=()=>{paused=!paused;document.body.classList.toggle('paused',paused);$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Starta rörelser':'Pausa rörelser';if(paused&&pending)finish(pending.result,pending.token);};
 if(reduced?.addEventListener)reduced.addEventListener('change',()=>{if(reduced.matches&&pending)finish(pending.result,pending.token);});
 render();
})();
