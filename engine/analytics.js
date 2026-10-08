export function weakTopics(topics,attempts,weights={}){
 const by={};attempts.forEach(a=>(by[a.topicId]??=[]).push(a));
 return Object.keys(topics).map(id=>{const arr=by[id]||[],last10=arr.slice(-10),prev=arr.slice(-20,-10),acc=x=>x.length?x.filter(a=>a.correct).length/x.length:0;const weak=arr.length>=8&&(topics[id].mastery<.5||(acc(prev)-acc(last10)>=.15));return {...topics[id],topicId:id,weak,rank:Number(weights[id]||1)*(1-(topics[id].mastery??0))}}).filter(x=>x.weak).sort((a,b)=>b.rank-a.rank);
}
export function accuracyByTopic(attempts){const o={};attempts.forEach(a=>{o[a.topicId]??={attempts:0,correct:0};o[a.topicId].attempts+=1;o[a.topicId].correct+=a.correct?1:0});return Object.fromEntries(Object.entries(o).map(([k,v])=>[k,{...v,accuracy:v.correct/v.attempts}]));}
