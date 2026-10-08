export function streak(sessions,dailyTarget){
 const days=new Set(sessions.filter(s=>(s.seconds||0)>=dailyTarget*60*.5).map(s=>new Date(s.at).toISOString().slice(0,10)));
 let cur=0,gap=false;const d=new Date();
 for(;;){const k=d.toISOString().slice(0,10);if(days.has(k)){cur++;d.setDate(d.getDate()-1);continue}if(!gap&&cur>0){gap=true;d.setDate(d.getDate()-1);continue}break}
 return {current:cur,freezeUsed:gap,days:[...days].sort().slice(-30)}
}