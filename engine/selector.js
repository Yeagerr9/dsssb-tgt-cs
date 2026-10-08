export function selectNext(questions,topicMap,examWeight={},now=Date.now()){
 if(!questions.length)return null;
 const scored=questions.map(q=>{
  const t=topicMap[q.topicId]||{},m=Number(t.mastery??.3),overdue=t.due?Math.min(1,Math.max(0,(now-t.due)/86400000)):0,w=Number(examWeight[q.topicId]||.01),target=Math.round(1+4*m),difficulty=Number(q.difficulty||3);
  const priority=(1-m)*.5+overdue*.3+w*.2,fit=Math.max(0,1-Math.abs(difficulty-target)/4),recent=t.lastSeen&&now-t.lastSeen<7*86400000?.35:1;
  return {...q,_score:priority*.7+fit*.3*recent,_mastery:m,_overdue:overdue};
 }).filter(q=>!q.lastSeen||now-q.lastSeen>=7*86400000);
 const pool=scored.length?scored:questions.map(q=>({...q,_score:0,_mastery:Number(topicMap[q.topicId]?.mastery??.3)}));
 const weak=pool.filter(q=>q._mastery<.5||q._overdue>0),medium=pool.filter(q=>q._mastery>=.5&&q._mastery<.8),strong=pool.filter(q=>q._mastery>=.8);
 const roll=Math.random(),bucket=roll<.7?weak:roll<.9?medium:strong;
 const chosen=(bucket.length?bucket:pool).sort((a,b)=>b._score-a._score).slice(0,5);
 return chosen[Math.floor(Math.random()*chosen.length)]||null;
}
export function mixQuestionPool(questions,topicMap){return questions}