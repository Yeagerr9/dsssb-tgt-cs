import {topicRows,pWeight,esc,daysLeft} from './utils.js';
import {makePlan} from '../engine/planner.js';
export default {id:'planner',title:'Smart Planner',icon:'◆',exams:['dsssb','bpsc'],route:'#/planner',
render(el,ctx){
 const rows=topicRows(ctx.catalog,ctx.exam),ts=ctx.state.topicState||{},date=ctx.state.settings?.targets?.[ctx.exam],d=daysLeft(date)??999,minutes=Number(ctx.state.settings?.daily||120);
 const due=rows.filter(x=>ts[x.id]?.due&&ts[x.id].due<=Date.now()).sort((a,b)=>(ts[a.id].mastery??.3)-(ts[b.id].mastery??.3));
 const weak=rows.map(x=>({...x,m:ts[x.id]||{mastery:.3}})).sort((a,b)=>(a.m.mastery??.3)-(b.m.mastery??.3));
 const fresh=rows.filter(x=>(ts[x.id]?.attempts||0)<1).sort((a,b)=>pWeight(b.priority)-pWeight(a.priority));
 const day=new Date().getDay(),mockDay=day===0||day===3||day===6,plan=makePlan({minutes,due:due.slice(0,10).map(x=>x.topic),weak:weak.slice(0,2).map(x=>x.topic),newTopics:fresh.slice(0,2).map(x=>x.topic),mockDay,daysToExam:d});
 el.innerHTML='<div class="hero"><div><span class="eyebrow">ADAPTIVE QUEUE</span><h1>Today’s Study Plan</h1><p class="muted">Revision first, then weak topics, then high-priority new content. Within 21 days of the exam, the plan shifts toward mocks and error review.</p></div><div class="hero-score"><span class="small">BUDGET</span><strong>'+minutes+'m</strong><span class="small">'+(d===999?'no date':Math.floor(d)+' days left')+'</span></div></div>'+
 '<div class="grid">'+plan.map(p=>'<div class="card"><span class="eyebrow">'+esc(p.type)+'</span><div class="kpi">'+p.minutes+'m</div><p>'+p.items.slice(0,3).map(esc).join('<br>')+(p.items.length>3?'<br>…':'')+'</p></div>').join('')+'</div>'+
 '<div class="card"><h3>Ranked weak-topic queue</h3><div class="table-wrap"><table><tr><th>Topic</th><th>Section</th><th>Priority</th><th>Mastery</th><th>Attempts</th></tr>'+weak.slice(0,15).map(x=>'<tr><td><b>'+esc(x.topic)+'</b></td><td>'+esc(x.section)+'</td><td>'+x.priority+'</td><td>'+Math.round((x.m.mastery??.3)*100)+'%</td><td>'+(x.m.attempts||0)+'</td></tr>').join('')+'</table></div></div>';
 return el.innerHTML;
}};