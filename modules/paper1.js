import {esc} from './utils.js';
export default {id:'paper1',title:'Paper 1 / GS',icon:'▤',exams:['dsssb','bpsc'],route:'#/paper1',
render(el,ctx){
 const sets=ctx.exam==='dsssb'?[ctx.catalog.dsssbPaper1]:[ctx.catalog.bpscMainPaper1,ctx.catalog.bpscMainGS,ctx.catalog.bpscPrelims];
 const ts=ctx.state.topicState||{};
 el.innerHTML='<div class="card"><div class="section-head"><div><h3>'+ (ctx.exam==='dsssb'?'DSSSB Paper 1':'BPSC Paper 1 + GS / Prelims')+'</h3><span class="muted">General components are tracked independently but use the same mastery engine.</span></div></div>'+sets.flatMap(s=>s||[]).map(sec=>'<div class="card"><div class="section-head"><b>'+esc(sec[0])+'</b><span class="badge">'+sec[2]+'</span></div>'+sec[3].map(t=>{const id=ctx.exam+':'+sec[0]+':'+t,m=ts[id]?.mastery??.3;return '<div class="stat-row"><span>'+esc(t)+'</span><span>'+Math.round(m*100)+'%</span></div>'}).join('')+'</div>').join('')+'</div>';return el.innerHTML;
}};