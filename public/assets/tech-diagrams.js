/* Illustrative models, not force or structural engineering calculations. */
globalThis.techDraw=(()=>{
 const line=(x,y,a,b,color='#425573',w=8)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
 const rect=(x,y,w,h,c='#f8b56b')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${c}" stroke="#425573" stroke-width="2"/>`;
 const text=(x,y,t)=>`<text x="${x}" y="${y}" font-family="sans-serif" font-size="18" text-anchor="middle" fill="#172752">${t}</text>`;
 const wrap=s=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" aria-hidden="true"><rect width="480" height="300" rx="22" fill="#f3f8ff"/>'+s+'</svg>';
 function gear(cx,angle,color){let pts=[];for(let i=0;i<48;i++){const a=i*Math.PI/24,r=i%4===1||i%4===2?53:44;pts.push(`${cx+Math.cos(a)*r},${140+Math.sin(a)*r}`)}return `<g transform="rotate(${angle} ${cx} 140)"><polygon points="${pts.join(' ')}" fill="${color}" stroke="#263c76" stroke-width="2"/><circle cx="${cx}" cy="140" r="12" fill="white"/>${line(cx,124,cx,104,'white',5)}</g>`}
 function mechanism(id,value){const p=Math.max(0,Math.min(100,Number(value)||0));let s='',description='';
 if(id==='lever'){const angle=(p-50)*.45;s='<path d="M210 240L240 160L270 240Z" fill="#ffc66c" stroke="#425573" stroke-width="3"/>'+`<g transform="rotate(${angle} 240 160)">${rect(65,150,350,18,'#4265d6')}${rect(88,115,45,35,'#ffac80')}${rect(347,115,45,35,'#77cbb2')}</g>`+text(240,274,'Stöd i mitten');description=p>50?'Vänster ände går upp, höger ände ned.':p<50?'Vänster ände går ned, höger ände upp.':'Brädan är vågrät.'}
 if(id==='gears'){s=gear(190,p*2,'#5275dd')+gear(289,-p*2+7.5,'#f5b55f')+text(240,250,'Tänderna för rörelsen vidare');description='Det blå och det gula kugghjulet vrids åt motsatta håll.'}
 if(id==='pulley'){const y=205-p*.8,free=155+p*.8;s=rect(175,25,130,20,'#9ba9bf')+line(240,45,240,65)+`<circle cx="240" cy="93" r="28" fill="#ffcd7d" stroke="#425573" stroke-width="5"/>`+`<path d="M212 ${y}V93A28 28 0 0 1 268 93V${free}" fill="none" stroke="#375cca" stroke-width="5"/>`+rect(186,y,52,45,'#79cbb5')+`<circle cx="268" cy="${free}" r="9" fill="#375cca"/>`+text(125,265,'Hink')+text(345,265,'Dra här');description=`Hinken ${p>50?'har lyfts upp':'hänger längre ned'}. Repänden flyttas åt motsatt håll.`}
 if(id==='wheel'){const x=65+p*2.4;s=line(30,237,450,237,'#a3b1c9',4)+`<g transform="translate(${x} 0)">${rect(0,133,130,61,'#78cbb2')}`;for(const cx of [27,103])s+=`<g transform="rotate(${p*7} ${cx} 210)"><circle cx="${cx}" cy="210" r="25" fill="white" stroke="#425573" stroke-width="5"/>${line(cx-20,210,cx+20,210,'#5275dd',3)}${line(cx,190,cx,230,'#5275dd',3)}</g><circle cx="${cx}" cy="210" r="5" fill="#ee965a"/>`;s+='</g>'+text(240,278,'Hjulen roterar runt sina axlar');description='Vagnen rullar. Hjulens mitt sitter fast vid vagnen.'}
 if(id==='hinge'){s=line(50,230,120,230,'#a3b1c9',14)+line(340,230,440,230,'#a3b1c9',14)+`<g transform="rotate(${-p*.85} 120 230)">${rect(120,220,220,20,'#7bcdb9')}</g><circle cx="120" cy="230" r="10" fill="#2d46d8"/>`+text(240,40,'Grinden sedd ovanifrån')+text(90,276,'Gångjärn');description=p===0?'Grinden är stängd.':'Grinden vrids runt gångjärnet vid stolpen.'}
 if(id==='ramp'){const x=65+p*3,y=250-(x-60)*.4;s='<path d="M60 250L380 122V250Z" fill="#f8cf96" stroke="#425573" stroke-width="3"/>'+rect(380,122,65,128,'#c1cddd')+`<g transform="translate(${x} ${y}) rotate(-21.8)">${rect(-18,-40,40,40,'#77cbb2')}</g>`+text(240,282,'Längre väg – mindre brant');description='Lådan följer rampen upp mot lastkajen.'}
 return {svg:wrap(s),description};
 }
 function building(m,v,outcome){let s='',bad=outcome===false,success=outcome===true;
 if(m.kind==='bridge'){
 s='<path d="M0 235Q100 215 160 235T320 235T480 235V300H0Z" fill="#b8e2fa"/>'+rect(28,167,62,93,'#adccae');
 if(m.id!=='ends'||v.support==='both')s+=rect(390,167,62,93,'#adccae');
 if(v.middle==='yes')s+=rect(231,167,18,97,'#94a7c3');
 const thick=v.beam==='thick';s+=`<g class="construction ${bad&&m.id==='ends'?'bridge-bend':''}">`+(bad&&m.id==='span'?'<path d="M60 161Q240 212 420 161" fill="none" stroke="#5978d6" stroke-width="12"/>':rect(60,155,360,thick?24:12,'#5978d6'));
 if(m.id==='truss'){const shift=bad?28:0;s+=line(75,155,75+shift,95)+line(405,155,405+shift,95)+line(75+shift,95,405+shift,95)+line(185+shift,95,185,155)+line(295+shift,95,295,155);if(v.brace==='yes')for(let x=75;x<400;x+=110)s+=line(x,155,x+110,95,'#de8a41',6)}
 if(outcome!==null){s+=rect(m.id==='truss'&&bad?245:217,m.id==='truss'?60:m.id==='span'&&bad?150:123,46,32,'#f8b56b');s+=text(240,m.id==='truss'?48:106,'Last ↓')}
 s+='</g>'+text(240,285,bad?'Bygget behöver förbättras':success?'Bron klarar testet':'Välj delar och testa bron');
 }else{
 const wide=m.id==='towerbrace'||v.base==='wide',left=wide?150:195,right=wide?330:285,topL=195,topR=285,loadX=v.load==='edge'?right-7:240;
 s=line(70,260,410,260,'#9fbd9a',10)+`<g class="construction ${bad?'tower-tilt':''}">`;
 const levels=[250,190,130,70],xs=levels.map((_,i)=>[left+(topL-left)*i/3,right+(topR-right)*i/3]);
 s+=line(left,250,topL,70)+line(right,250,topR,70);
 for(let i=0;i<4;i++)s+=line(xs[i][0],levels[i],xs[i][1],levels[i]);
 if(v.brace==='yes'||m.id==='base')for(let i=0;i<3;i++)s+=line(xs[i][0],levels[i],xs[i+1][1],levels[i+1],'#de8a41',6);
 if(m.id==='final'||outcome!==null)s+=rect(loadX-23,32,46,35,'#f8b56b');
 s+='</g>'+text(240,290,bad?'Tornet lutar i testet':success?'Tornet klarar testet':'Bygg tornets fot och ram');
 }
 return wrap(s);
 }
 return {mechanism,building};
})();
