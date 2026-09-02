const edges=[['C1','C2'],['C1','C3'],['C2','C3'],['C2','C4'],['C3','C4'],['C4','C5'],['C5','C6'],['C1','C6']];
const nodes=['C1','C2','C3','C4','C5','C6'];
let k=3,strategy='plain';
const graph=document.getElementById('solverGraph');
const statusEl=document.getElementById('status'),assignEl=document.getElementById('assignments'),backEl=document.getElementById('backtracks'),slotEl=document.getElementById('slots'),bar=document.getElementById('progressBar');
const pos={C1:[18,18],C2:[54,10],C3:[14,55],C4:[55,52],C5:[79,27],C6:[82,75]};
function makeGraph(){
  graph.innerHTML='';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('sg-edges');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');
  edges.forEach(([a,b])=>{
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',pos[a][0]); line.setAttribute('y1',pos[a][1]);
    line.setAttribute('x2',pos[b][0]); line.setAttribute('y2',pos[b][1]);
    svg.appendChild(line);
  });
  graph.appendChild(svg);
  for(const n of nodes){
    const d=document.createElement('div');
    d.className='sg-node'; d.id='sg-'+n; d.textContent=n;
    d.style.left=pos[n][0]+'%'; d.style.top=pos[n][1]+'%';
    graph.appendChild(d);
  }
}
function conflict(v,c,assignment){return edges.some(([a,b])=>(a===v&&assignment[b]===c)||(b===v&&assignment[a]===c))}
function solve(){
  const assignment={};
  const order=strategy==='plain'?[...nodes]:[...nodes].sort((a,b)=>edges.filter(e=>e.includes(b)).length-edges.filter(e=>e.includes(a)).length);
  let assignments=0,backs=0;
  function bt(i){
    if(i===order.length)return true;
    const v=order[i];
    const colors=[1,2,3,4].slice(0,k).filter(c=>!conflict(v,c,assignment));
    for(const c of colors){
      assignments++; assignment[v]=c;
      const node=document.getElementById('sg-'+v);
      node.classList.add('assigned');
      node.style.boxShadow='0 0 25px rgba(120,240,200,.16)';
      update(assignments,backs,i+1);
      if(bt(i+1))return true;
      delete assignment[v]; backs++;
      node.classList.remove('assigned'); node.style.boxShadow='';
      update(assignments,backs,i);
    }
    return false;
  }
  const ok=bt(0);
  return {ok,assignment,assignments,backs,used:new Set(Object.values(assignment)).size};
}
function update(a,b,step){assignEl.textContent=a;backEl.textContent=b;bar.style.width=Math.min(100,step/nodes.length*100)+'%'}
function run(){
  makeGraph(); statusEl.textContent='Solving…'; assignEl.textContent='0'; backEl.textContent='0'; slotEl.textContent='—'; bar.style.width='0%';
  setTimeout(()=>{const r=solve();statusEl.textContent=r.ok?'Valid colouring':'No solution';slotEl.textContent=r.ok?r.used:'—';},120);
}
document.querySelectorAll('#colorButtons button').forEach(b=>b.onclick=()=>{k=+b.dataset.k;document.querySelectorAll('#colorButtons button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('spaceValue').textContent=`${k}ⁿ`});
document.querySelectorAll('#strategyButtons button').forEach(b=>b.onclick=()=>{strategy=b.dataset.strategy;document.querySelectorAll('#strategyButtons button').forEach(x=>x.classList.remove('active'));b.classList.add('active')});
document.getElementById('runBtn').onclick=run;
makeGraph();
