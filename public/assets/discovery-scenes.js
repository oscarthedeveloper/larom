/* Original SVG diagrams. Motion is decorative; every state has a text description. */
globalThis.drawDiscovery = (id,value) => {
 const v=Number.isFinite(Number(value))?Number(value):0,p=Math.max(0,Math.min(1,v/100));
 const text=(x,y,t,extra='')=>`<text x="${x}" y="${y}" text-anchor="middle" ${extra}>${t}</text>`;
 const smile=(x,y)=>`<g fill="#243254"><circle cx="${x-13}" cy="${y}" r="4"/><circle cx="${x+13}" cy="${y}" r="4"/><path d="M${x-10} ${y+14}q10 11 20 0" fill="none" stroke="#243254" stroke-width="4" stroke-linecap="round"/></g>`;
 const star=(x,y,s=1)=>`<path class="discovery-spark" transform="translate(${x} ${y}) scale(${s})" d="M0-12L4-4 12 0 4 4 0 12-4 4-12 0-4-4Z" fill="#efb752"/>`;
 const floor='<ellipse cx="240" cy="284" rx="174" ry="17" fill="#2039500b"/>';
 let art='',observation='',valueText='',motion='';
 switch(id){
 case 'heart': {
  const run=v===1,beat=run?'.7s':'1.3s';motion=run?'running':'resting';valueText=run?'Kroppen springer':'Kroppen vilar';
  art=`<g style="--beat:${beat}"><path d="M151 103C70 87 77 241 155 250M301 104C390 86 394 244 308 249" fill="none" stroke="#d58a98" stroke-width="14" opacity=".5"/><path class="blood-flow" d="M151 103C70 87 77 241 155 250M301 104C390 86 394 244 308 249" fill="none" stroke="#bb4261" stroke-width="6" stroke-dasharray="1 24" stroke-linecap="round"/><g class="heart-beat"><path d="M240 250C222 235 132 171 132 125C132 62 214 62 240 105C266 62 348 62 348 125C348 171 258 235 240 250Z" fill="#ed8096" stroke="#b54767" stroke-width="5"/><path d="M158 122q8-30 35-21" fill="none" stroke="#ffcfda" stroke-width="9" stroke-linecap="round"/>${smile(240,148)}</g></g>${star(363,64)}${text(240,306,run?'Dunk-dunk-dunk!':'Dunk … dunk …')}`;
  observation=run?'Hjärtat i bilden slår snabbare när kroppen springer.':'Hjärtat i bilden slår lugnare när kroppen vilar.';break;
 }
 case 'lungs': {
  const scale=.78+p*.22;
  art=`<path d="M185 71Q240 40 295 71L358 268Q240 302 122 268Z" fill="#f9ddc9" stroke="#e0bba3" stroke-width="4"/><path d="M240 47V125M240 115l-45 45m45-45 45 45" fill="none" stroke="#fbfff9" stroke-width="18" stroke-linecap="round"/><g transform="translate(240 180) scale(${scale}) translate(-240 -180)"><path d="M220 112C190 88 152 125 148 210Q143 263 210 252Q226 250 224 217Z" fill="#ec93a7" stroke="#bf617c" stroke-width="4"/><path d="M260 112C290 88 328 125 332 210Q337 263 270 252Q254 250 256 217Z" fill="#ec93a7" stroke="#bf617c" stroke-width="4"/><path d="M209 148l-28 35m28-8-37 33m99-60 28 35m-28-8 37 33" fill="none" stroke="#ffe0e7" stroke-width="5" stroke-linecap="round"/><circle class="oxygen-dot" cx="181" cy="211" r="8" fill="#fff4c9"/><circle class="oxygen-dot later" cx="296" cy="199" r="8" fill="#fff4c9"/></g>${text(240,313,'Lungorna')}`;
  valueText=p<.34?'Efter utandning':p>.66?'Efter inandning':'På väg att andas in';observation=p<.34?'Efter utandning är lungorna mindre. Det finns fortfarande luft kvar i dem.':p>.66?'Efter inandning är lungorna större och innehåller mer luft.':'Lungorna utvidgas när luft kommer in.';break;
 }
 case 'joint': {
  const angle=-p*105,x=240+139*Math.cos(angle*Math.PI/180),y=180+139*Math.sin(angle*Math.PI/180);
  art=`${floor}<path d="M94 180H240L${x} ${y}" fill="none" stroke="#f3c5a7" stroke-width="62" stroke-linejoin="round" stroke-linecap="round"/><path d="M100 180H222M257 ${180-15*p}L${x} ${y}" fill="none" stroke="#fffdf0" stroke-width="17" stroke-linecap="round"/><circle cx="240" cy="180" r="18" fill="#fffdf0" stroke="#b9896c" stroke-width="3"/><circle cx="${x}" cy="${y}" r="25" fill="#f3c5a7"/><circle cx="240" cy="180" r="33" fill="none" stroke="#2d46d8" stroke-width="3" stroke-dasharray="5 6"/><path d="M240 217v28" stroke="#2d46d8" stroke-width="3"/>${text(240,271,'Armbågsled')}${star(109,87,.7)}`;
  valueText=p<.2?'Rak arm':p>.8?'Böjd arm':'Armen böjs';observation='Armen böjs vid armbågsleden. Benen behåller sin form.';break;
 }
 case 'food': {
  const step=Math.max(0,Math.min(2,Math.round(v))),pos=[[231,72],[270,163],[225,230]][step];
  art=`<path d="M199 51Q240 26 281 51L298 87 330 105 348 276Q240 303 132 276L150 105 182 87Z" fill="#f7d7c1"/><path d="M230 74V137Q233 162 269 160" fill="none" stroke="#c7747c" stroke-width="15" stroke-linecap="round"/><path d="M266 135C284 115 303 139 295 169C288 200 240 195 241 172Q246 157 261 166Z" fill="#ed92a2" stroke="#b65573" stroke-width="4"/><path d="M247 193C188 178 180 216 225 213S297 247 232 248 181 229 211 234" fill="none" stroke="#d99164" stroke-width="14" stroke-linecap="round"/><g transform="translate(${pos[0]} ${pos[1]})"><circle class="food-dot" r="12" fill="#f7c648" stroke="#ab7c23" stroke-width="3"/></g><path d="M221 73h18" stroke="#9d5455" stroke-width="6" stroke-linecap="round"/>${text(355,76,'Mun')}${text(378,170,'Magsäck')}${text(371,245,'Tarm')}<path d="M250 74h57m-6 91h24m-41 75h40" stroke="#9b7e74" stroke-width="2"/>${text(240,312,'Följ den gula matbiten')}`;
  valueText=['Munnen','Magsäcken','Tunntarmen'][step];observation=['I munnen tuggas maten och blandas med saliv.','Maten förs genom matstrupen till magsäcken, där den blandas och bryts ner mer.','I tunntarmen bryts maten ner mer och det mesta av näringen tas upp.'][step];break;
 }
 case 'pupil': {
  const radius=45-p*29;
  art=`<rect x="35" y="35" width="410" height="260" rx="110" fill="${p>.5?'#ffedb8':'#bdc9e7'}"/><path d="M77 164Q240 17 403 164Q240 307 77 164Z" fill="#fff" stroke="#8b6959" stroke-width="7"/><circle cx="240" cy="164" r="72" fill="#65988a"/><circle cx="240" cy="164" r="59" fill="none" stroke="#92bb9a" stroke-width="10" stroke-dasharray="3 9"/><circle cx="240" cy="164" r="${radius}" fill="#243254"/><circle cx="223" cy="146" r="9" fill="#fff" opacity=".8"/>${text(240,310,'Pupillen är öppningen i mitten')}`;
  valueText=p<.34?'Svagt ljus':p>.66?'Starkt ljus':'Lite ljusare';observation=p<.34?'I svagt ljus är pupillen större.':p>.66?'I starkare ljus är pupillen mindre.':'Pupillen blir mindre när ljuset ökar.';break;
 }
 case 'sleep': {
  const night=v===1;
  art=`<rect x="35" y="25" width="410" height="265" rx="35" fill="${night?'#344675':'#d5edee'}"/><rect x="320" y="49" width="91" height="88" rx="17" fill="${night?'#253659':'#a5d8e7'}"/>${night?'<path d="M366 62a25 25 0 1 0 21 43 25 25 0 0 1-21-43" fill="#ffe4a6"/>':'<circle cx="365" cy="92" r="24" fill="#ffd57b"/>'}<rect x="75" y="215" width="327" height="52" rx="12" fill="#b68b77"/><rect x="81" y="198" width="309" height="43" rx="15" fill="#fff9e9"/><rect x="86" y="168" width="104" height="58" rx="17" fill="#f1edfc"/><circle cx="143" cy="179" r="33" fill="#deb08e"/><path d="M111 167q10-53 63-4" fill="#654936"/>${night?'<path d="M127 183q7 7 14 0m7 0q7 7 14 0" stroke="#513b37" stroke-width="3" fill="none"/>':'<g fill="#513b37"><circle cx="133" cy="181" r="3"/><circle cx="155" cy="181" r="3"/></g>'}<path d="M176 171Q283 163 385 218H176Z" fill="#a2c4ae"/><path d="M208 181v38m36-36v36m36-29v29m36-19v19" stroke="#c8e4c9" stroke-width="6"/>${night?`<g class="dream-float">${text(236,107,'z Z', 'fill="#fff2c6" font-size="28"')}${star(190,67,.7)}${star(280,54,.6)}</g>`:text(210,90,'En ny dag!', 'fill="#486676"')}`;
  valueText=night?'Sover':'Vaken';observation=night?'Barnet sover. Kroppen återhämtar sig och hjärnan arbetar vidare med dagens intryck.':'Barnet är vaket och kan uppleva och lära sig nya saker.';break;
 }
 case 'shadow': {
  const x=320-p*145,r=25*(425-60)/(x-60);
  art=`<rect x="18" y="30" width="444" height="260" rx="30" fill="#dfdcef"/><path d="M60 153L425 42V264Z" fill="#fff0b9"/><rect x="416" y="34" width="28" height="249" rx="9" fill="#d0c8de"/><ellipse cx="425" cy="153" rx="12" ry="${r}" fill="#535572"/><path d="M60 153L425 ${153-r}M60 153L425 ${153+r}" stroke="#ddb55a" stroke-width="2" stroke-dasharray="6 6"/><rect x="25" y="134" width="42" height="38" rx="8" fill="#63899c"/><rect x="60" y="129" width="12" height="48" rx="5" fill="#efd070"/><path d="M${x} 173V264" stroke="#b7865f" stroke-width="7"/><circle cx="${x}" cy="153" r="25" fill="#ee9f80" stroke="#b96549" stroke-width="3"/>${smile(x,144)}${text(70,312,'Lampa')}${text(240,312,'Figur')}${text(419,312,'Vägg')}`;
  valueText=p<.34?'Nära väggen':p>.66?'Nära lampan':'Mitt emellan';observation=p<.34?'Figuren är nära väggen. Skuggan är mindre.':p>.66?'Figuren är nära lampan. Skuggan är större.':'Skuggan växer när figuren flyttas mot lampan.';break;
 }
 case 'ice': {
  const size=118*(1-p),x=240-size/2,y=250-size;
  art=`${floor}<ellipse cx="240" cy="263" rx="153" ry="27" fill="#fff" stroke="#b8cdd7" stroke-width="4"/><ellipse cx="240" cy="255" rx="${20+107*p}" ry="${4+14*p}" fill="#7ec9dc" opacity="${.1+.9*p}"/>${size>1?`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${Math.min(17,size/5)}" fill="#aedfea" stroke="#64a5bc" stroke-width="3"/><path d="M${x+size*.2} ${y+size*.6}v-${size*.35}h${size*.45}" fill="none" stroke="#eafbff" stroke-width="${Math.max(1,size*.065)}" stroke-linecap="round"/>`:''}${p>0&&p<.95?'<path class="melt-drop" d="M294 202q-14 18 0 18t0-18" fill="#69bace"/>':''}<g transform="translate(100 81)"><circle r="26" fill="#ffda83"/><path d="M0-40v-8m40 48h8M0 40v8M-40 0h-8m20-28-6-6m56 0-6 6" stroke="#eab852" stroke-width="5" stroke-linecap="round"/></g>${text(240,310,p>.98?'Nu är allt flytande vatten':p<.01?'Is är vatten i fast form':'Is + flytande vatten')}`;
  valueText=p<.1?'Ny isbit':p>.98?'Isen har smält':'Isen smälter';observation=p<.1?'Isbiten ligger på en tallrik i ett varmt rum.':p>.98?'Isbiten har blivit en pöl av flytande vatten.':'Isbiten blir mindre medan pölen av vatten växer.';break;
 }
 case 'magnet': {
  const item=Math.max(0,Math.min(2,Math.round(v))),pull=item===0;
  const object=item===0?'<path d="M-24 0h53m-49-12v24" stroke="#6a8096" stroke-width="8" stroke-linecap="round"/>':item===1?'<rect x="-30" y="-23" width="64" height="46" rx="6" fill="#cba173" stroke="#967343" stroke-width="3"/><path d="M-20-9h41m-35 17h32" stroke="#a77e50" stroke-width="3"/>':'<rect x="-30" y="-23" width="64" height="46" rx="6" fill="#dbe2e9" stroke="#879dad" stroke-width="3"/><path d="M-20-13l41 26m-40 2 39-28" stroke="#a8bbc9" stroke-width="2"/>';
  art=`${floor}<g transform="translate(165 166) rotate(90)"><path d="M-40-45V12a40 40 0 0 0 80 0V-45" fill="none" stroke="#db7179" stroke-width="30"/><path d="M-40-45v25M40-45v25" stroke="#e3e9ef" stroke-width="30"/></g>${pull?'<path class="magnet-field" d="M216 144q29 20 0 40" fill="none" stroke="#ba7184" stroke-width="3" stroke-dasharray="3 6"/>':''}<g transform="translate(${pull?238:333} 166)"><g class="${pull?'magnet-pull':''}">${object}</g></g>${text(153,251,'Magnet')}${text(332,251,['Järn','Trä','Aluminium'][item])}`;
  valueText=['Järnspik','Träbit','Aluminiumbit'][item];observation=pull?'Järnspiken dras mot magneten.':item===1?'Träbiten stannar kvar. Den fastnar inte på magneten.':'Aluminiumbiten stannar kvar. Alla metaller fastnar inte på en vanlig magnet.';break;
 }
 case 'sound': {
  const active=v===1;
  art=`${floor}<rect x="87" y="111" width="306" height="132" rx="28" fill="#daa274" stroke="#a27655" stroke-width="4"/><ellipse cx="240" cy="177" rx="75" ry="39" fill="#805f53"/><path d="M126 117v110m228-110v110" stroke="#f5d789" stroke-width="11" stroke-linecap="round"/><g class="${active?'string-vibration':''}"><path d="M126 177Q240 ${active?162:177} 354 177" fill="none" stroke="#fffbea" stroke-width="5"/></g>${active?'<g class="sound-waves" fill="none" stroke="#6585aa" stroke-width="4" stroke-linecap="round"><path d="M215 87q25-14 50 0m-61-18q36-22 72 0m-84-18q48-30 96 0"/></g>':''}${text(240,310,active?'Rörelsen visas långsamt':'Strängen är stilla')}`;
  valueText=active?'Vibrerar':'Stilla';observation=active?'Strängen rör sig fram och tillbaka. I verkligheten går vibrationerna mycket snabbare än i bilden.':'Strängen är stilla och skapar inget strängljud.';break;
 }
 case 'boat': {
  const load=Math.max(0,Math.min(2,Math.round(v))),y=[139,156,231][load],boxes=load===0?'':Array.from({length:load===1?2:6},(_,i)=>`<rect x="${190+(i%3)*34}" y="${-35-Math.floor(i/3)*31}" width="30" height="29" rx="4" fill="#d3935d" stroke="#a7764c" stroke-width="2"/>`).join('');
  art=`<rect x="31" y="67" width="418" height="221" rx="25" fill="#eff8fa" stroke="#a5bec9" stroke-width="5"/><path d="M34 159Q88 153 133 160T239 160T344 160T447 159V269Q447 286 429 286H51Q34 286 34 269Z" fill="#9fd7e3"/><g transform="translate(0 ${y})"><g class="${load===2?'boat-sink':'boat-bob'}"><path d="M143-17L168 37H312L337-17Z" fill="#b3c4d6" stroke="#607d9d" stroke-width="5"/><path d="M143-17Q240-39 337-17L312-2H168Z" fill="#edf1fa" stroke="#607d9d" stroke-width="4"/>${boxes}</g></g><path class="water-ripple" d="M54 179h43m279 20h43m-330 42h44" stroke="#d6f2f7" stroke-width="4" stroke-linecap="round"/>${text(240,319,['Tom metallbåt','Lite last','För tung last'][load])}`;
  valueText=['Tom båt','Lite last','För tung last'][load];observation=['Den tomma, ihåliga metallbåten flyter.','Båten ligger djupare med last, men flyter fortfarande.','Nu kommer vatten in över kanten. Den här modellbåten sjunker.'][load];break;
 }
 case 'drops': {
  const amount=Math.round(p*16);let drops='';for(let i=0;i<amount;i++){const x=181+(i%4)*37,y=126+Math.floor(i/4)*33;drops+=`<path class="glass-drop" style="animation-delay:${i*.03}s" transform="translate(${x} ${y})" d="M0-7q-10 13 0 13t0-13" fill="#5297bb"/>`;}
  art=`${floor}<ellipse cx="240" cy="278" rx="123" ry="17" fill="#f8fffe" stroke="#bed4d9" stroke-width="3"/><path d="M160 72L177 263Q240 287 303 263L320 72Z" fill="#e1f6fa" stroke="#86a9b9" stroke-width="5"/><path d="M169 142L181 261Q240 279 299 261L311 142Z" fill="#a2d7e7"/><ellipse cx="240" cy="142" rx="71" ry="15" fill="#bce9f2"/><g fill="#edfaff" stroke="#82b5cd" stroke-width="2"><rect x="187" y="103" width="39" height="37" rx="7" transform="rotate(-12 206 122)"/><rect x="249" y="111" width="39" height="37" rx="7" transform="rotate(15 268 130)"/></g><ellipse cx="240" cy="72" rx="80" ry="18" fill="#f5fcfc" stroke="#86a9b9" stroke-width="5"/>${drops}${text(240,316,'Dropparna sitter på utsidan')}`;
  valueText=amount===0?'Nytorkat glas':amount<9?'Små droppar':'Fler droppar';observation=amount===0?'Ett kallt glas står i ett rum där luften innehåller vattenånga.':`Vattendroppar bildas på glasets utsida när vattenånga i luften kyls. Bilden visar ${amount<9?'några':'fler'} droppar.`;break;
 }
 default: throw new Error('Unknown discovery: '+id);
 }
 return {svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 335" aria-hidden="true" focusable="false" data-scene="${id}" data-motion="${motion}">${art}</svg>`,observation,valueText};
};
