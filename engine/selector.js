export function selectNext(questions,topicMap,examWeight={},now=Date.now()){
 const scored=questions.map(q=>{
  const t=topicMap[q.topicId]||{},m=Number(t.mastery??.3),overdue=t.due?Math.min(1,Math.max(0,(now-t.due)/86400000)):0,w=Number(examWeight[q.topicId]||.01);
  const priority=(1-m)*.5+overdue*.3+w*.2,target=Math.round(1+4*m),difficulty=Number(q.difficulty||3);
  const fit=Math.max(0,1-Math.abs(difficulty-target)/4),recent=t.lastSeen&&now-t.lastSeen<7*86400000?.35:1;
  return {...q,_score:priority*.7+fit*.3*recent};
 }).sort((a,b)=>b._score-a._score);
 const top=scored.slice(0,Math.min(5,scored.length));return top.length?top[Math.floor(Math.random()*top.length)]:null;
}
export function mixQuestionPool(questions,topicMap){return questions}
