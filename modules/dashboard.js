import {topicRows,pWeight,fmtMin,daysLeft,examLabel,esc} from './utils.js';
import {readiness} from '../engine/readiness.js';
import {predict} from '../engine/predictor.js';
import {streak} from '../engine/streak.js';
export default {id:'dashboard',title:'Dashboard',icon:'⌂',exams:['dsssb','bpsc'],route:'#/dashboard',
async render(el,ctx){
 const {state,catalog,exam}=ctx,rows=topicRows(catalog,exam),ts=state.topicState||{},weights=Object.fromEntries(rows.map(x=>[x.id,pWeight(x.priority)]));
 const r=readiness(tsFor(rows,ts),weights), attempts=(state.attempts||[]).filter(a=>a.exam===exam),mocks=(state.mocks||[]).filter(m=>m.exam===exam);
 const total=rows.length,mastered=rows.filter(x=>(ts[x.id]?.mastery??.3)>=.85).length,due=rows.filter(x=>ts[x.id]?.due&&ts[x.id].due<=Date.now()).length;
 const date=ctx.state.settings?.targets?.[exam],d=daysLeft(date), pred=predict(mocks,Number(ctx.state.settings?.mockMaxMarks||200)),sk=streak((state.sessions||[]).filter(x=>x.exam===exam),Number(ctx.state.settings?.daily||120));
 const weak=rows.map(x=>({...x,m:ts[x.id]||{mastery:.3}})).sort((a,b)=>(a.m.mastery??.3)-(b.m.mastery??.3)).slice(0,5);
 el.innerHTML='<div class="hero"><div><span class="eyebrow">'+examLabel(exam)+'</span><h1>Study Command Center</h1><p class="muted">A single workspace for syllabus, adaptive practice, mocks, revision and analytics.</p></div><div class="hero-score"><span class="small">READINESS</span><strong>'+r.score+'%</strong><div class="small">'+Math.round(r.coverage*100)+'% evidence coverage</div></div></div>'+
 '<div class="grid"><div class="card"><span class="small">Topics mastered</span><div class="kpi">'+mastered+'/'+total+'</div><div class="progress"><i style="width:'+(total?mastered/total*100:0)+'%"></i></div></div><div class="card"><span class="small">Due revision</span><div class="kpi">'+due+'</div><span class="muted">Items at or past due date</span></div><div class="card"><span class="small">Practice attempts</span><div class="kpi">'+attempts.length+'</div><span class="muted">'+accuracy(attempts)+'% accuracy</span></div><div class="card"><span class="small">Current streak</span><div class="kpi">sk.currentd</div><span class="muted">A day counts at 50% of target</span></div><div class="card"><span class="small">Exam countdown</span><div class="kpi">'+(d===null?'—':d<1?Math.round(d*24)+'h':Math.floor(d)+'d')+'</div><span class="muted">'+(date?'target configured':'set exam date in Settings')+'</span></div></div>'+
 '<div class="grid-2"><div class="card"><div class="section-head"><h3>Weekly study time</h3><span class="muted">last 7 days</span></div><canvas id="weekChart" class="chart"></canvas></div><div class="card"><div class="section-head"><h3>Score projection</h3><span class="muted">from mocks</span></div><div class="kpi">'+(pred.ready?Math.round(pred.mean)+' / 200':'—')+'</div><p class="muted">'+(pred.ready?'Range '+Math.round(pred.low)+'–'+Math.round(pred.high):'Not enough mocks — complete at least 3 to show a range.')+'</p><h4>Today\'s focus</h4><div class="stat-list">'+weak.slice(0,3).map(x=>'<div class="stat-row"><span>'+esc(x.topic)+'</span><b>'+Math.round((1-(x.m.mastery??.3))*100)+'% gap</b></div>').join('')+'</div></div></div>'+
 '<div class="card"><div class="section-head"><h3>Readiness explanation</h3><span class="badge">ADAPTIVE</span></div><p>'+esc(r.explanation)+'</p><div class="stat-list">'+weak.map(x=>'<div class="stat-row"><span><b>'+esc(x.topic)+'</b><br><span class="muted">'+esc(x.section)+'</span></span><span>'+Math.round((x.m.mastery??.3)*100)+'%</span></div>').join('')+'</div></div>';
 await chart(el,state,exam); return el.innerHTML;
}};
function tsFor(rows,ts){return Object.fromEntries(rows.map(x=>[x.id,ts[x.id]||{mastery:.3,attempts:0}]))}
function accuracy(a){return a.length?Math.round(a.filter(x=>x.correct).length/a.length*100):0}
async function chart(el,state,exam){
 const c=el.querySelector('#weekChart');if(!c)return;
 if(!window.Chart){await new Promise(res=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js';s.onload=res;s.onerror=res;document.head.appendChild(s)})}
 if(!window.Chart)return;
 const now=new Date(),labels=[],vals=[];for(let i=6;i>=0;i--){const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);labels.push(d.toLocaleDateString(undefined,{weekday:'short'}));vals.push((state.sessions||[]).filter(s=>s.exam===exam&&new Date(s.at||0).toISOString().slice(0,10)===key).reduce((n,s)=>n+Number(s.seconds||0)/60,0))}
 new window.Chart(c,{type:'bar',data:{labels,datasets:[{label:'Minutes',data:vals,borderRadius:6}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
}