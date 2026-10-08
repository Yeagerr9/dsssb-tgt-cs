export function streak(sessions,dailyTarget){
 const days=new Set(sessions.filter(s=>(s.seconds||0)>=dailyTarget*60*.5).map(s=>new Date(s.at).toISOString().slice(0,10)));
 let cur=0;const d=new Date();for(;;){const k=d.toISOString().slice(0,10);if(!days.has(k))break;cur++;d.setDate(d.getDate()-1)}
 return {current:cur,days:[...days].sort().slice(-30)}
}