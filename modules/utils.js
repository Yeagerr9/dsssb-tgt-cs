export const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
export function rows(catalog,exam){const sets=exam==='dsssb'?[catalog.dsssbTech,catalog.dsssbPaper1]:[catalog.bpscSubject,catalog.bpscMainPaper1,catalog.bpscPrelims,catalog.bpscMainGS];return sets.flatMap(x=>x||[])}
export function topicRows(catalog,exam){return rows(catalog,exam).flatMap(section=>(section[3]||[]).map(topic=>({section:section[0],expected:section[1],priority:section[2],topic,id:exam+':'+section[0]+':'+topic})))}
export function pWeight(p){return p==='A+'?4:p==='A'?3:p==='B'?2:1}
export function status(m){return m>=.85?'mastered':m>=.65?'revising':m>=.35?'learning':'not-started'}
export function fmtMin(n){n=Math.round(n||0);return Math.floor(n/60)+'h '+n%60+'m'}
export function daysLeft(date){if(!date)return null;return Math.max(0,(new Date(date)-Date.now())/86400000)}
export function activeDate(ctx){return ctx.state.settings?.targets?.[ctx.exam]||''}
export function examLabel(exam){return exam==='dsssb'?'DSSSB TGT':'BPSC TRE 4.0'}