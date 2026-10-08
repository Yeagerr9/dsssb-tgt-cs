import {topicRows,esc} from './utils.js';
import {selectNext} from '../engine/selector.js';
import {updateMastery} from '../engine/mastery.js';
import {scheduleTopic} from '../engine/spaced.js';
export default {id:'practice',title:'Practice Bank',icon:'✓',exams:['dsssb','bpsc'],route:'#/practice',
render(el,ctx){
 const all=(ctx.state.questions||[]).filter(q=>q.examTags?.includes(ctx.exam));
 const df=ctx.state.settings?.practiceDifficulty||'',tf=ctx.state.settings?.practiceTopic||'';
 const qs=all.filter(q=>(!df||String(q.difficulty)===df)&&(!tf||String(q.topicId||'').toLowerCase().includes(tf.toLowerCase())));
 const rows=topicRows(ctx.catalog,ctx.exam),ts=ctx.state.topicState||{},weights=Object.fromEntries(rows.map(x=>[x.id,x.priority==='A+'?4:x.priority==='A'?3:x.priority==='B'?2:1]));
 const next=selectNext(qs,ts,weights);
 if(!all.length){el.innerHTML='<div class="card"><h3>Practice Bank</h3><div class="empty">No question bank is loaded for this exam yet.<br><br>Add verified questions. The adaptive engine will then use mastery, difficulty, due dates and exam priority.</div><button id="addQ" class="btn primary">＋ Add verified question</button></div>';bindAdd(el,ctx);return el.innerHTML}
 const filter='<div class="card"><div class="toolbar"><select id="qDifficulty"><option value="">All difficulties</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select><input id="qTopic" value="'+esc(tf)+'" placeholder="Filter topic…"></div><span class="muted">'+qs.length+' of '+all.length+' questions match the filters.</span></div>';
 if(!qs.length){el.innerHTML=filter+'<div class="empty">No questions match these filters.</div>';bindFilters(el,ctx,df);return el.innerHTML}
 el.innerHTML=filter+'<div class="grid-2"><div class="card"><div class="section-head"><span class="tag">'+next.difficulty+'/5 difficulty</span><span class="tag">'+esc(next.source||'user')+'</span></div><div class="question">'+esc(next.text)+'</div><div id="options">'+(next.options||[]).map((o,i)=>'<button class="option" data-opt="'+i+'">'+String.fromCharCode(65+i)+'. '+esc(o)+'</button>').join('')+'</div><div class="toolbar"><button id="flag" class="btn">⚑ Flag for revision</button><span class="muted">Adaptive mode • weak/due topics weighted higher</span></div></div><div class="card"><h3>Question evidence</h3><div class="stat-list"><div class="stat-row"><span>Topic</span><b>'+esc(next.topicId)+'</b></div><div class="stat-row"><span>Attempts</span><b>'+(ts[next.topicId]?.attempts||0)+'</b></div><div class="stat-row"><span>Mastery</span><b>'+Math.round((ts[next.topicId]?.mastery??.3)*100)+'%</b></div></div></div></div>';
 bindFilters(el,ctx,df);
 el.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>answer(ctx,next,Number(b.dataset.opt)));
 el.querySelector('#flag').onclick=()=>{next.flagged=true;ctx.save();ctx.toast('Question flagged for revision')};
 return el.innerHTML;
}};
function bindFilters(el,ctx,df){el.querySelector('#qDifficulty').value=df;el.querySelector('#qDifficulty').onchange=e=>{ctx.state.settings.practiceDifficulty=e.target.value;ctx.save();ctx.render()};el.querySelector('#qTopic').onchange=e=>{ctx.state.settings.practiceTopic=e.target.value;ctx.save();ctx.render()}}
function answer(ctx,q,opt){
 const correct=opt===Number(q.answer),t=ctx.state.topicState[q.topicId]||{mastery:.3,attempts:0};
 const seconds=Number(prompt('Seconds spent on this question','30')||30),expected=Number(q.expectedSeconds||45);
 const u=updateMastery(t.mastery,correct,Number(q.difficulty||3),seconds,expected,t.attempts||0);
 ctx.state.topicState[q.topicId]={...t,...u,lastSeen:Date.now(),...scheduleTopic(t,correct,seconds<=expected,daysTo(ctx.state.settings?.targets?.[ctx.exam]))};
 ctx.state.attempts.push({id:crypto.randomUUID(),questionId:q.id,topicId:q.topicId,exam:ctx.exam,correct,seconds,timestamp:Date.now(),mode:'practice',difficulty:q.difficulty||3});
 ctx.save();ctx.toast(correct?'Correct ✓':'Incorrect — review the explanation');ctx.render();
}
function daysTo(d){return d?Math.max(1,(new Date(d)-Date.now())/86400000):999}
function bindAdd(el,ctx){el.querySelector('#addQ').onclick=()=>{const text=prompt('Question text');if(!text)return;const options=(prompt('Options separated by ||')||'').split('||').map(x=>x.trim()).filter(Boolean);const answer=Number(prompt('Correct option number (1-based)','1'))-1;const topicId=prompt('Topic ID (copy from Syllabus Tracker)');if(!topicId)return;ctx.state.questions=ctx.state.questions||[];ctx.state.questions.push({id:crypto.randomUUID(),examTags:[ctx.exam],topicId,difficulty:Number(prompt('Difficulty 1-5','3')),text,options,answer,source:'verified/user',expectedSeconds:45});ctx.save();ctx.toast('Question added');ctx.render()}}
