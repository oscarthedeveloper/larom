/* A small elastic spring model, in game units. No per-level solution matching.
   Axial members plus weak transverse deck stiffness; linear, quasi-static loads.
   This is an educational game model, not an engineering calculation. */
globalThis.BridgeModel=(()=>{
 const levels=[
  {id:'creek',title:'Över bäcken',spans:2,piers:[1],beams:0,load:.8,goal:'Lägg två vägdelar mellan stränderna. Mittstödet är redan på plats.',hint:'Välj Vägdel. Koppla A till B och sedan B till C.'},
  {id:'triangle',title:'Utan mittstöd',spans:2,piers:[],beams:3,load:1,goal:'Nu saknas mittstödet. Använd balkarna för att göra bron stadig.',hint:'Prova en triangel: koppla båda stränderna till samma punkt ovanför vägen. Koppla också vägens mitt till den punkten.'},
  {id:'wide',title:'Lite längre bort',spans:3,piers:[],beams:6,load:1,goal:'Tre vägdelar når över. Hur kan balkarna hjälpa varandra?',hint:'Börja med sneda balkar från stränderna. Bind ihop punkterna ovanför vägen och koppla dem till vägen. En diagonal kan dela en fyrkant i trianglar.'},
  {id:'island',title:'Hjälp från ön',spans:4,piers:[2],beams:6,load:1,goal:'Ett stöd på ön delar bron i två. Bygg en stadig bro på varje sida.',hint:'Mittpunkten C är ett fast stöd. Tänk på bron som två korta broar och bygg trianglar på båda sidor.'},
  {id:'delivery',title:'En tyngre leverans',spans:3,piers:[],beams:8,load:1.6,goal:'Bilen har en tung låda med sig. Förstärk där bron böjer sig.',hint:'Stora fyrkanter kan ändra form. Prova sneda balkar som delar dem i trianglar. Balkar kan sitta både över och under vägen.'},
  {id:'river',title:'Över stora ån',spans:4,piers:[],beams:9,load:1.2,goal:'Fyra vägdelar, nio balkar och en bred å. Bygg din egen lösning!',hint:'Koppla först ihop vägen. Bygg sedan ett nät av trianglar som sitter fast i stränderna och stödjer vägens mitt.'}
 ];
 function nodes(level){const a=[];for(let x=0;x<=level.spans;x++)a.push({id:a.length,x,y:0,fixed:x===0||x===level.spans||level.piers.includes(x),label:String.fromCharCode(65+x)});if(level.beams)for(const y of [-1,1])for(let x=1;x<level.spans;x++)a.push({id:a.length,x,y,fixed:false,label:String(a.length-level.spans)});return a;}
 const key=(a,b)=>[a,b].sort((x,y)=>x-y).join('-');
 function placement(level,edges,a,b,type){
  const ns=nodes(level),u=ns[a],v=ns[b];if(!u||!v||!['road','beam'].includes(type)||a===b)return 'Välj två olika punkter.';
  if(edges.some(e=>key(e.a,e.b)===key(a,b)))return 'Det finns redan en del mellan punkterna. Välj Ta bort om du vill ändra den.';
  if(type==='road'&&(u.y!==0||v.y!==0||Math.abs(u.x-v.x)!==1))return 'Vägdelar läggs mellan två grannpunkter på den prickade vägen.';
  if(type==='beam'&&Math.hypot(u.x-v.x,u.y-v.y)>1.42)return 'Balken räcker till en punkt bredvid eller snett bredvid. Välj en närmare punkt.';
  if(type==='beam'&&u.y===0&&v.y===0)return 'Här ska bilen köra. Välj en vägdel mellan vägens punkter.';
  if(edges.filter(e=>e.type===type).length>=(type==='road'?level.spans:level.beams))return 'Delarna av den sorten är slut. Ta bort eller ångra en del för att använda den igen.';
  return null;
 }
 function missingRoad(level,edges){for(let x=0;x<level.spans;x++)if(!edges.some(e=>e.type==='road'&&key(e.a,e.b)===key(x,x+1)))return x;return -1;}
 // Gaussian elimination with pivoting. A tiny regularizer stabilizes unloaded free points.
 function solve(a,b){const n=b.length,A=a.map((row,i)=>[...row,b[i]]);for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[p][k]))p=i;[A[p],A[k]]=[A[k],A[p]];if(Math.abs(A[k][k])<1e-12)return null;for(let i=k+1;i<n;i++){const t=A[i][k]/A[k][k];for(let j=k;j<=n;j++)A[i][j]-=t*A[k][j];}}const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let v=A[i][n];for(let j=i+1;j<n;j++)v-=A[i][j]*x[j];x[i]=v/A[i][i];}return x;}
 function frame(level,edges,position){
  const ns=nodes(level),free=ns.filter(n=>!n.fixed),map=new Map(free.map((n,i)=>[n.id,i*2])),size=free.length*2,K=Array.from({length:size},(_,i)=>Array.from({length:size},(_,j)=>i===j?.000001:0)),F=Array(size).fill(0);
  function spring(a,b,dx,dy,stiffness){const ids=[map.get(a),map.get(b)],vec=[dx,dy,-dx,-dy];for(let i=0;i<4;i++){if(ids[Math.floor(i/2)]===undefined)continue;const row=ids[Math.floor(i/2)]+i%2;for(let j=0;j<4;j++){if(ids[Math.floor(j/2)]===undefined)continue;K[row][ids[Math.floor(j/2)]+j%2]+=stiffness*vec[i]*vec[j];}}}
  for(const e of edges){const a=ns[e.a],b=ns[e.b],L=Math.hypot(b.x-a.x,b.y-a.y);spring(e.a,e.b,(b.x-a.x)/L,(b.y-a.y)/L,(e.type==='beam'?65:95)/L);if(e.type==='road')spring(e.a,e.b,0,1,.7);}
  const p=Math.max(0,Math.min(level.spans,position)),left=Math.min(level.spans-1,Math.floor(p)),fraction=p-left;
  for(const [id,weight] of [[left,1-fraction],[left+1,fraction]])if(map.has(id))F[map.get(id)+1]+=level.load*weight;
  const u=solve(K,F);if(!u||u.some(x=>!Number.isFinite(x)))return {position:p,displacement:ns.map(()=>({x:0,y:0})),stress:edges.map(()=>0),maxSag:Infinity,maxStrain:Infinity,safe:false};const displacement=ns.map(n=>map.has(n.id)?{x:u[map.get(n.id)],y:u[map.get(n.id)+1]}:{x:0,y:0});
  let maxSag=0;for(let i=0;i<=level.spans;i++)maxSag=Math.max(maxSag,Math.abs(displacement[i].y));
  const stress=edges.map(e=>{const a=ns[e.a],b=ns[e.b],d1=displacement[e.a],d2=displacement[e.b],L=Math.hypot(b.x-a.x,b.y-a.y);return Math.abs(((d2.x-d1.x)*(b.x-a.x)+(d2.y-d1.y)*(b.y-a.y))/(L*L));});
  const maxStrain=Math.max(0,...stress),safe=maxSag<=.26&&maxStrain<=.07;
  return {position:p,displacement,stress,maxSag,maxStrain,safe};
 }
 function test(level,edges){const gap=missingRoad(level,edges);if(gap>=0)return {ok:false,reason:'gap',gap,frames:[]};const frames=[];for(let i=0;i<=level.spans*12;i++){const f=frame(level,edges,i/12);frames.push(f);if(!f.safe)return {ok:false,reason:f.maxSag>.26?'bend':'strain',frames};}return {ok:true,reason:'success',frames};}
 return {levels,nodes,key,placement,missingRoad,frame,test};
})();
